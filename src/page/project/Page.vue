<template>
  <div>
      <weui-article :article="article"></weui-article>
  </div>
</template>

<script>
import { GroupTitle,Group,Cell,CellBox,XInput, Swiper, SwiperItem, XButton, XProgress, Panel, Divider } from 'vux'
import { Carousel, Slide } from 'vue-carousel';
import WeuiArticle from "@/components/WeuiArticle";
import global from '@/components/Global'

export default {
  components: {
    Group,
    Cell,
    Swiper,
    SwiperItem,
    XButton,
    XProgress,
    Panel,
    Divider,
    Carousel,
    Slide,
    GroupTitle,
    CellBox,
    XInput,
    WeuiArticle
  },
  created () {
      this.initData()
  },
  methods: {
      initData(){
         this.$http.get('pages/'+this.$route.params.id)
            .then(Response=>{
              this.article = Response.data
              this.$wechat.ready(()=>{
                let route = this.$router.resolve({name: this.$route.name, params:this.$route.params});
                const options = {
                  title: Response.data.title, // 分享标题
                  desc: Response.data.remark,
                  link: window.location.protocol+'//'+window.location.host + route.href, // 分享链接，该链接域名或路径必须与当前页面对应的公众号JS安全域名一致
                  imgUrl:window.location.protocol+'//'+window.location.host+'/static/pic.png', // 分享图标
                  success: () => {
                    this.$vux.toast.text('分享成功')
                  }
                }
                this.$wechat.onMenuShareTimeline(options)
                this.$wechat.onMenuShareAppMessage(options)
              })  
            }).catch(error=>{
                console.log(error);
            })
      } 
  },
 data () {
    return {
       article:{} 
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
