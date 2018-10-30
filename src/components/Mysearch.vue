<!-- 搜索栏 -->
<template>
  <div class="search">
    <search
    @result-click="resultClick"
    :results="results"
    v-model.trim="value"
    position="absolute"
    auto-scroll-to-top top="0"
    @on-focus="onFocus"
    @on-cancel="onCancel"
    @on-submit="onSubmit"
    :placeholder="remind"
    ref="search">
    </search>
  </div>
</template>

<script>
import { Search } from 'vux'

export default {
  components: {
    Search
  },
  name: 'MySearch',
  props: {
    value: String,
  },
  methods: {
    setFocus () {
      this.$refs.search.setFocus()
    },
    resultClick (item) {
      window.alert('you click the result item: ' + JSON.stringify(item))
    },
    onSubmit (val) {
      this.$refs.search.setBlur()
      this.$emit('search',val)
    },
    onFocus () {
      console.log('on focus')
    },
    onCancel () {
      this.$emit('search','')
    }
  },
  data () {
    return {
      results: [],
      remind:'输入姓名或手机号'
    }
  }
}

</script>

<style lang="less" scoped>

</style>