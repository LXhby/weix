<template>
  <div class="page with-ft myanswer">
    <answer-list :answerlist="list"></answer-list>
    <div class="page-ft" v-transfer-dom>
      <flexbox :gutter="0">
        <flexbox-item><x-button type="default" link="/help/question"><i class="iconfont wxicon-help"></i> 我要提问</x-button></flexbox-item>
        <flexbox-item><x-button type="warn" link="/help/ask"><i class="iconfont wxicon-ques1"></i> 我的问题</x-button></flexbox-item>
      </flexbox>
    </div>
  </div>
</template>

<script>
import AnswerList from '@/components/AnswerList'
import {TransferDom} from 'vux'

export default {
  directives: {
      TransferDom
  },
  components: {
    AnswerList,
  },
  name:'Answer',
  data () {
    return {
        list: [
          {
            url: '/',
            title: '患者应该如何申请心里程-急性冠状动脉综合征患者援助项目？',
            time: '5天前',
            recommend: true,
          },
          {
            url: '/',
            title: '患者应该如何申请心里程-急性冠状动脉综合征患者援助项目？',
            time: '5天前',
            recommend: false,
          },
          {
            url: '/',
            title: '患者应该如何申请心里程-急性冠状动脉综合征患者援助项目？',
            time: '5天前',
            recommend: true,
          },
          {
            url: '/',
            title: '患者应该如何申请心里程-急性冠状动脉综合征患者援助项目？',
            time: '5天前',
            recommend: false,
          }
        ]
    }
  },
}
</script>

<style lang="less">
@import '~@/style/base.less';

</style>