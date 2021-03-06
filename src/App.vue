<template>
  <div id="app">
    <div id="app1">
      <form-create v-model="fApi" :rule="rule" :option="option" v-if="canShowForm" @change="changeValue"></form-create>
       <xl-button type="primary" plain @click="submit">提交</xl-button>
      <xl-button aligen="center" plain @click="reset">重置</xl-button>
    </div>
  </div>
</template>

<script>
import axios from 'axios'
export default {
  data () {
    return {
      canShowForm: false,
      // 实例对象
      fApi: {},
      // 表单生成规则
      rule: [],
      // 组件参数配置
      option: {
        // 表单提交事件
        submitBtn: false,
        // 表单ui
        form: {
          labelWidth: '150px'
        },
        global: {
          '*': {
            props: {
              disabled: false
            },
            col: {
              span: 24
            }
          },
          upload: {
            props: {
              onError: function (r) {
                alert('上传失败')
              }
            }
          }
        }
      }
    }
  },
  components: {
  },
  created () {
    this.getData()
  },
  methods: {
    submit () {
      this.fApi.submit((formData, $f) => {
        alert(JSON.stringify(formData))
      })
    },
    changeValue (value) {
      this.fApi.validateField(value)
    },
    reset () {
      this.fApi.resetFields()
    },
    translateData (item) {
      const arrTypeFormItem = ['checkbox', 'cascader', 'selectTree', 'upload']
      const itemFormatter = {}
      if (arrTypeFormItem.includes(item.displayType)) {
        itemFormatter.value = item.defaultValue ? item.defaultValue.split(',') : []
        itemFormatter.type = 'array'
      } else {
        itemFormatter.value = item.defaultValue
        itemFormatter.type = 'string'
      }
      return itemFormatter
    },
    getData () {
      axios.post('http://221.226.153.90:18081/app/mock/30/exttype/queryFormStructure/v1', {
        extTypeCode: 'second'
      }).then(async res => {
        // 先把前端需要的字段补齐 获取 type field title value
        const resData = (res?.data?.data?.rows || []).map(item => {
          const itemFormatter = this.translateData(item)
          return {
            ...item,
            type: item.displayType,
            field: item.fieldName,
            title: item.fieldDesc,
            // 数组和字符串转化
            value: itemFormatter.value,
            validate: [{ type: itemFormatter.type, required: true, message: `${item.fieldDesc}必填` }]
          }
        })

        // 过滤非hidden字段
        const rows = resData.filter(item => {
          // 一般情况只需要过滤 hidden 这里假设 register_time是联动的选项。在初始化的不能显示在根节点
          return item.displayType !== 'hidden' && item.fieldName !== 'register_time'
        })

        // 二次组装 需要的额外前端配置  比如 disable require等
        const tmpArr = []
        for (let index = 0; index < rows.length; index++) {
          // 目前的架构下 需要依次判断item手动填入前端配置
          const element = rows[index]
          switch (element.fieldName) {
            // 企业id 禁用
            case 'company_id':
              // id字段 禁用
              element.props = {
                disabled: true
              }
              break

            // 运用公司 补全下拉框
            case 'company_operator':
              {
                const { data: { typeList: selectArr } } = await axios.post('http://221.226.153.90:18081/app/mock/26/test/companyType', {
                  dictTypeCode: element.dictTypeCode
                })
                element.options = selectArr
              }
              break

            // 所属机构 补全下拉框
            case 'affiliated_institutions':
              element.props = {
                data: [{
                  label: '一级 1',
                  id: 1111111,
                  children: [{
                    id: 12,
                    label: '二级 1-1',
                    children: [{
                      id: 1223,
                      label: '三级 1-1-1'
                    }, {
                      id: 1223111,
                      label: '三级 1-1-21221一级 1221一级'
                    }]
                  }]
                }, {
                  label: '一级 2',
                  id: 13,
                  children: [{
                    id: 12235,
                    label: '二级 2-1',
                    children: [{
                      id: 12234,
                      label: '三级 2-1-1'
                    }]
                  }, {
                    id: 122345,
                    label: '二级 2-2',
                    children: [{
                      id: 12237,
                      label: '三级 2-2-1'
                    }]
                  }]
                }, {
                  id: 12238,
                  label: '一级 3',
                  children: [{
                    id: 12239,
                    label: '二级 3-1',
                    children: [{
                      id: 122310,
                      label: '三级 3-1-1'
                    }]
                  }, {
                    id: 122311,
                    label: '二级 3-2',
                    children: [{
                      id: 122312,
                      label: '三级 3-2-1'
                    }]
                  }]
                }],
                multiple: true,
                nodeKey: 'id',
                defaultProps: {
                  children: 'children',
                  label: 'label'
                }
              }
              break

            // 统计分类 补全下拉框
            case 'computed_type':
              {
                const { data: { typeList: selectArr } } = await axios.post('http://221.226.153.90:18081/app/mock/26/test/computedype', {
                  dictTypeCode: element.dictTypeCode
                })
                element.options = selectArr
              }
              break

            // 国民经济行业 补全下拉框
            case 'economic_industry':
              {
                const { data: { typeList: selectArr } } = await axios.post('http://221.226.153.90:18081/app/mock/26/test/economicndustry', {
                  dictTypeCode: element.dictTypeCode
                })
                element.options = selectArr
              }
              break

            // 行政区域
            case 'company_address':
              // 拼接 组件下拉data值 此处如果是城市选择从 字典服务获取。需要开发人员手动添加城市字典
              element.props = {
                options: [{
                  value: 'beijing',
                  label: '北京',
                  children: [
                    {
                      value: 'gugong',
                      label: '故宫'
                    },
                    {
                      value: 'tiantan',
                      label: '天坛'
                    },
                    {
                      value: 'wangfujing',
                      label: '王府井'
                    }
                  ]
                }, {
                  value: 'jiangsu',
                  label: '江苏',
                  children: [
                    {
                      value: 'nanjing',
                      label: '南京',
                      children: [
                        {
                          value: 'fuzimiao',
                          label: '夫子庙'
                        }
                      ]
                    },
                    {
                      value: 'suzhou',
                      label: '苏州',
                      children: [
                        {
                          value: 'zhuozhengyuan',
                          label: '拙政园'
                        },
                        {
                          value: 'shizilin',
                          label: '狮子林'
                        }
                      ]
                    }
                  ]
                }]
              }
              break

            // 图表上传配置
            case 'company_icon':
              {
                const domain = 'http://localhost:3000'
                // id字段 禁用
                element.props = {
                  action: `${domain}/upload/single`,
                  uploadType: 'image',
                  limit: 1,
                  multiple: false,
                  onSuccess: function (res, file) {
                    file.url = `${domain}${res.path}`
                    console.log(file.url)
                  }
                }
              }
              break

            // 是否启用如果有需要补全 选中值
            case 'is_ative':
              element.value = element.value ? '1' : '0'
              element.props = {
                activeValue: '1',
                inactiveValue: '0'
              }
              break
            // 企业label也可以自定义获取checkbox可选值
            case 'company_label':
              {
                const { data: { typeList: selectArr } } = await axios.post('http://221.226.153.90:18081/app/mock/26/test/companyLabel')
                element.options = selectArr
              }
              break
            // 企业评级同label
            case 'company_rate':
              {
                const { data: { typeList: selectArr } } = await axios.post('http://221.226.153.90:18081/app/mock/26/test/companyRate')
                element.options = selectArr
                // 此处处理动态展示的 后台无法展示层级关系，所以需要单独把数据拼接起来
                element.control = [
                  {
                    value: '4', // 四级企业展示
                    rule: resData.filter(item => item.fieldName === 'register_time')
                  }
                ]
              }
              break

            default:
              break
          }

          // 数据全部处理完 获取新处理完的数据
          tmpArr.push(element)
        }

        this.rule = tmpArr
        console.log(this.rule)
        // 渲染表单
        this.canShowForm = true
      })
    }
  }
}
</script>
<style>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
}
</style>
