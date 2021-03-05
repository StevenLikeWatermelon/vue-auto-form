<template>
  <div id="app">
    <div id="app1">
      <form-create v-model="fApi" :rule="rule" :option="option" v-if="canShowForm"></form-create>
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
    reset () {
      this.fApi.resetFields()
    },
    getData () {
      axios.post('http://221.226.153.90:18081/app/mock/30/exttype/queryFormStructure/v1', {
        extTypeCode: 'second'
      }).then(async res => {
        // 先把前端需要的字段补齐 获取 type field title value
        const resData = (res?.data?.data?.rows || []).map(item => ({
          ...item,
          type: item.displayType,
          field: item.fieldName,
          title: item.fieldDesc,
          // 数组和字符串转化
          value: (item.displayType === 'cascader' || item.displayType === 'checkbox') ? item.defaultValue.split(',') : item.defaultValue
        }))

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
            // 名称必填校验
            case 'company_name':
              element.validate = [{ type: 'string', required: true, message: '请输入名称' }]
              break

            // 公司类型补全根据字典值下拉框
            case 'company_type':
              {
                const { data: { typeList: selectArr } } = await axios.post('http://221.226.153.90:18081/app/mock/26/test/companyType', {
                  dictTypeCode: element.dictTypeCode
                })
                element.options = selectArr
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
                    value: 4, // 四级企业展示
                    rule: resData.filter(item => item.fieldName === 'register_time')
                  }
                ]
              }
              break
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
