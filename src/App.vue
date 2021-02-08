<template>
  <div id="app">
    <div id="app1">
      <form-create v-model="fApi" :rule="rule" :option="option"></form-create>
       <xl-button type="primary" plain @click="submit">提交</xl-button>
        <xl-button aligen="center" plain @click="reset">重置</xl-button>
    </div>
  </div>
</template>

<script>
export default {
  data () {
    return {
      // 实例对象
      fApi: {},
      // 表单生成规则
      rule: [
        {
          type: 'location-map',
          field: 'latLng',
          value: '31.937739751899553, 118.82612949739269',
          title: '地图'
        },
        {
          type: 'input',
          field: 'goods_name',
          col: {
            span: 8
          },
          title: '名称'
        },
        {
          type: 'InputNumber',
          col: {
            span: 8
          },
          field: 'price',
          title: '价格',
          value: 1,
          props: {
            precision: 2
          }
        },
        {
          type: 'select',
          field: 'cate_id',
          col: {
            span: 8
          },
          title: '产品分类',
          value: ['104', '105'],
          options: [
            { value: '104', label: '生态蔬菜', disabled: false },
            { value: '105', label: '新鲜水果', disabled: false }
          ],
          props: {
            multiple: true
          }
        },
        {
          type: 'tree',
          title: '权限',
          field: 'rule',
          value: [],
          props: {
            data: [{
              label: '一级 1',
              children: [{
                label: '二级 1-1',
                children: [{
                  label: '三级 1-1-1'
                }]
              }]
            }, {
              label: '一级 2',
              children: [{
                label: '二级 2-1',
                children: [{
                  label: '三级 2-1-1'
                }]
              }, {
                label: '二级 2-2',
                children: [{
                  label: '三级 2-2-1'
                }]
              }]
            }, {
              label: '一级 3',
              children: [{
                label: '二级 3-1',
                children: [{
                  label: '三级 3-1-1'
                }]
              }, {
                label: '二级 3-2',
                children: [{
                  label: '三级 3-2-1'
                }]
              }]
            }],
            props: {
              children: 'children',
              label: 'label'
            }
          }
        },
        {
          type: 'cascader',
          title: '所在区域',
          field: 'address',
          value: ['陕西省', '西安市', '新城区'],
          props: {
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
        },
        {
          type: 'switch',
          title: '是否上架',
          field: 'is_show',
          value: '1',
          props: {
            activeValue: '1',
            inactiveValue: '0'
          }
        },
        {
          type: 'datePicker',
          field: 'created_at',
          title: '时间'
        },
        {
          type: 'checkbox',
          title: '标签',
          field: 'label',
          value: ['1', '2', '3'],
          options: [
            { value: '1', label: '好用', disabled: true },
            { value: '2', label: '方便', disabled: false },
            { value: '3', label: '实用', disabled: false },
            { value: '4', label: '有效', disabled: false }
          ]
        },
        {
          type: 'radio',
          title: '是否展示input',
          field: ' is_postage',
          value: 0,
          options: [
            { value: 0, label: '不展示', disabled: false },
            { value: 1, label: '展示', disabled: false }
          ],
          control: [
            {
              value: 1,
              rule: [
                {
                  type: 'input',
                  field: 'postage_money',
                  title: '动态展示的',
                  value: 0
                }
              ]
            }
          ]
        }
      ],
      // 组件参数配置
      option: {
        // 表单提交事件
        submitBtn: false
      }
    }
  },
  components: {
  },
  methods: {
    submit () {
      this.fApi.submit((formData, $f) => {
        alert(JSON.stringify(formData))
      })
    },
    reset () {
      this.fApi.resetFields()
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
