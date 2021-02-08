<template>
  <div id="app">
    <div id="app1">
      <form-create v-model="fApi" :rule="rule" :option="option"></form-create>
       <ElButton type="primary" plain @click="submit">提交</ElButton>
        <ElButton aligen="center" plain @click="reset">重置</ElButton>
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
          type: 'input',
          field: 'goods_name',
          title: '名称'
        },
        {
          type: 'datePicker',
          field: 'created_at',
          title: '时间'
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
