<template>
  <div class="member-center">
    <msg title="申请成功" description="尊敬的患者，您的申请信息已提交成功，审核工作将在3个工作日完成，请耐心等待。" icon="success">
      <x-button slot="buttons" type="warn" @click.native="toIndex()">返回首页</x-button>
    </msg>
  </div>
</template>

<script>
import { Msg, XButton } from 'vux'
import { Carousel, Slide } from 'vue-carousel';
import global from '@/components/Global'


export default {
  components: {
    Msg,
    XButton,
    Carousel,
    Slide,
  },
  name:'Success',
  methods: {
    toIndex(){
      this.$wechat.closeWindow();
    }
  },
 data () {
    return {
      formdata: {},
      msgtitle: '申请成功',
      msgdesc: '尊敬的患者，您的申请信息已提交成功，审核工作将在3个工作日完成，请耐心等待。',
      msgicon: 'success',
      msgbtn: {
        type: 'warn',
        text: '返回首页',
        onClick: this.changeIcon.bind(this)
      }
    }
  },
}
</script>

<style lang='less'>
@import '~@/style/base.less';

.index {
  position: relative; width: 100%;overflow: auto;
}
.index-hd {
  position: fixed; top: 0; left: 0; right: 0; z-index: 500; overflow: hidden;
  nav {
    position: relative; height: 36px; line-height: 36px; background-color: #f4f5f6; border-bottom: 1px solid #ddd;
    .nav_ul {
      overflow-x: auto; -webkit-overflow-scrolling: touch; white-space: nowrap; font-size: 0;
      &::-webkit-scrollbar {
        width: 0px; height: 0px;
      }
      a {
        display: inline-block; padding-left: 5px; padding-right: 5px; height: 36px; line-height: 36px; font-size: 15px; color: #505050; white-space: nowrap; -webkit-tap-highlight-color: rgba(0, 0, 0, .3); text-decoration: none;
        &:last-child {
          margin-right: 5px;
        }
        &.active {
          color: @orange; border-bottom: 2px solid @orange; height: 35px;
        }
      }
    }
  }
}
.swiper-cont {
    position: relative; width: 100%; height: 100%; z-index: 0; background: #fff; padding-top: 36px; box-sizing: border-box; overflow: auto; -webkit-overflow-scrolling: touch;
    &.hasbanner { padding-top: 196px;}
    .swiper-box {
      width: 100%; height: 100%;
      .vux-swiper-item {
        overflow: auto; -webkit-overflow-scrolling: touch;
      }
    }
}

</style>
