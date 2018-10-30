<template>
	<div class="upload-s page with-ft">
    <div class="mymsg">
      <div class="hd"><icon type="success"></icon></div>
      <div class="bd">
        <h3>里程上传成功，待审核后更新进度</h3>
        <p>请耐心等待项目办工作人员审核，审核工作将在5个工作日完成。</p>
      </div>
    </div>
    <div class="mytimeline">
      <timeline>
        <timeline-item v-for="month in monthList" :key="month.index">
          <h4 class="recent"> 已上传{{month.index}}个月里程</h4>
          <!-- <p class="recent">2016-04-17 12:00:00</p> -->
        </timeline-item>
      </timeline>
    </div>
    <div class="page-ft" v-transfer-dom>
      <x-button type="warn" @click.native="toIndex()">返回首页</x-button>
    </div>
	</div>
</template>


<script>
import {XButton,Timeline,TimelineItem,Icon,TransferDom} from 'vux'
import global from '@/components/Global'
import ImageUploader from '@/components/ImageUploader'

export default {
    directives: {
        TransferDom
    },
  components: {
    XButton,
    Timeline,
    TimelineItem,
    Icon,
    TransferDom
  },
  created(){
    this.initData()
  },
  methods: {
    toIndex(){
      this.$wechat.closeWindow()
    },
    initData(){
      this.months = this.$route.params.months
       for (let index = 0; index < this.months; index++) {
          this.monthList.push({
            index: index+1,
          })
        }
    }
  },
  data () {
    return {
      title: '上传资料',
      info: '资料资料',
      tabs: ["上传材料", "示例图片"],
      tabitem: '上传材料',
      months:0,
      monthList:[],
    }
  },
}
</script>

<style lang='less'>
@import '~@/style/base.less';
.upload-s {
  .mymsg {
    .display-flex; align-items: center; margin: 10px; background: #fff; border-radius: 5px; box-shadow: 0 0 10px rgba(0, 0, 0, 0.1); padding: 15px;
    .hd {
      .weui-icon-success {
        font-size: 4.4rem;
        &::before { margin-left: 0;}
      }
    }
    .bd {
      .flex-1;
      h3 { color: @red; font-size: 1.6rem;}
      p { color: #787878; font-size: 1.2rem; line-height: 1.3; }
    }
  }

  .mytimeline {
    .vux-timeline {
      padding: 1rem 2rem;
    }
    .vux-timeline-item-content {
      padding-left: 1.8rem;
    }
    p {
      color: #888;
      font-size: 0.8rem;
    }
    h4 {
      color: #666;
      font-weight: normal;
    }
    .recent {
      color: @orange;
    }
    .vux-timeline-item-head {
      width: 16px; height: 16px; left: -2px; top: 0px;
      .vux-timeline-item-checked {
        display: block !important; font-family: 'iconfont'; width: 16px; height: 16px;
        &::before {
          content: "\e604"; width: 16px; height: 16px; font-size: 12px; left: 2px; top: 3px;
        }
      }
    }
    .vux-timeline-item-head-first {
      top: -1px;
    }
  }
}
</style>
