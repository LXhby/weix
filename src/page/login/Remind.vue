<template>
  <div class="member-center">
    <msg title="提示" description="您已提交过申请，等待项目办审核。" icon="waiting">
      <!-- <x-button slot="buttons" type="primary" @click.native="toIndex()" style="width: 70%;">上传里程</x-button> -->
      <x-button slot="buttons" type="warn" @click.native="toIndex()" style="width: 70%;">返回首页</x-button>
    </msg>
    <!-- <divider>提示</divider>
    <p style="text-align:center;">您已提交过申请，等待项目办审核<br>您可以先上传里程</p>
    <div style="padding-left:75px;padding-right:75px;margin-top:10px">
      <x-button type="primary" @click.native="toIndex()">返回首页</x-button>
    </div> -->
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
  name:'Remind',
  methods: {
    toIndex(){
      this.$wechat.closeWindow();
    }
  },
 data () {
    return {
      formdata: {},
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
