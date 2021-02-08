<template>
  <div class="map-container">
    <div class="map-form">
      <xl-form :inline="true">
        <xl-form-item>
          <input
            class="el-input__inner input-map"
            type="text"
            id="container-inner-place"
          />
        </xl-form-item>
        <xl-form-item label="纬度">
          <xl-input class="input-map" v-model="lat" placeholder="纬度lat" />
        </xl-form-item>
        <xl-form-item label="经度">
          <xl-input class="input-map" v-model="lng" placeholder="经度lng" />
        </xl-form-item>
        <xl-form-item label="当前选择的地址">
            <span>{{positionLocal}}</span>
        </xl-form-item>
      </xl-form>
    </div>
    <div id="container-inner-map"></div>
  </div>
</template>

<script>
export default {
  props: {
    value: {
      type: String,
      default: ''
    },
    disabled: {
      type: Boolean,
      default: false
    }
  },
  computed: {
    url () {
      const url = `https://apis.map.qq.com/ws/geocoder/v1/?location=${this.lat},${this.lng}&key=AZ4BZ-GST62-OC5UL-C7HDU-B5A4H-QCBH6&output=jsonp`
      return url
    },
    latLng () {
      return `${this.lat},${this.lng}`
    }
  },
  methods: {
    initMap () {
      const map = new window.qq.maps.Map(
        document.getElementById('container-inner-map'),
        {
          center: new window.qq.maps.LatLng(this.lat, this.lng),
          zoom: 13
        }
      )
      // 实例化自动完成
      const ap = new window.qq.maps.place.Autocomplete(
        document.getElementById('container-inner-place')
      )
      let keyword = ''
      // 调用Poi检索类。用于进行本地检索、周边检索等服务。
      const searchService = new window.qq.maps.SearchService({
        complete: function (results) {
          if (results.type === 'CITY_LIST') {
            searchService.setLocation(results.detail.cities[0].cityName)
            searchService.search(keyword)
            return
          }
          const pois = results.detail.pois
          const latlngBounds = new window.qq.maps.LatLngBounds()
          for (let i = 0, l = pois.length; i < l; i++) {
            const poi = pois[i]
            latlngBounds.extend(poi.latLng)
            const marker = new window.qq.maps.Marker({
              map: map,
              position: poi.latLng
            })

            marker.setTitle(poi.name)
          }
          map.fitBounds(latlngBounds)
        }
      })
      // 添加监听事件
      window.qq.maps.event.addListener(ap, 'confirm', (res) => {
        keyword = res.value
        searchService.search(keyword)
      })
      window.qq.maps.event.addListener(map, 'click', (evt) => {
        this.lat = evt.latLng.lat
        this.lng = evt.latLng.lng
        this.searchLocation()
        this.$emit('input', this.latLng)
      })
    },
    searchLocation () {
      function jsonp (url, callback) {
        var callbackName = 'jsonp_callback_' + Math.round(100000 * Math.random())
        window[callbackName] = function (data) {
          delete window[callbackName]
          document.body.removeChild(script)
          callback(data)
        }

        var script = document.createElement('script')
        script.src = url + (url.indexOf('?') >= 0 ? '&' : '?') + 'callback=' + callbackName
        document.body.appendChild(script)
      }
      jsonp(this.url, (data) => {
        this.positionLocal = data.result?.address
      })
    }
  },
  data () {
    return {
      lat: '', // 纬度
      lng: '', // 经度
      positionLocal: '暂无地址'
    }
  },
  mounted () {
    this.initMap()
  },
  watch: {
    value: {
      handler (val) {
        //   纬度,精度
        if (val) {
          const tempArr = val.split(',')
          this.lat = tempArr[0] || ''
          this.lng = tempArr[1] || ''
        }
      },
      immediate: true
    }
  }
}
</script>

<style scoped>
#container-inner-map {
  width: 800px;
  height: 400px;
}
.input-map {
  width: 250px;
}
.map-search {
  display: flex;
  align-items: center;
}
.mg-r-15 {
  margin-right: 15px;
}
.map-form {
  margin-bottom: 15px;
}
</style>
