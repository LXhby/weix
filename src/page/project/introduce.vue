∏<template>
    <div>
        <div class="banner">
          <div class="banner-img">
            <img src="../../assets/kv.jpg" alt="">
          </div>
        </div> 
        <group class="project-nav">
          <panel :list="projectnav" type="1" >
            <i class="iconfont wxicon-about"></i>
          </panel>
        </group>
    </div>
</template>

<script>
import { GroupTitle,Group,Cell,CellBox,XInput, Swiper, SwiperItem, XButton, XProgress, Panel, Divider } from 'vux'
import { Carousel, Slide } from 'vue-carousel';
import global from '@/components/Global'
import qs from 'qs'

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
  },
  created () {
    this.initData()
  },
  methods: {
    initData(){
      this.$http
      .get('pages',{params:{'PageSearch[remark]':'项目介绍','PageSearch[config_id]':global.configId,'sort':'id'}})
        .then(response=>{
          response.data.items.forEach(element=>{
            this.projectnav.push({
              src:this.baseUrl+element.image,
              title:element.title,
              desc:element.summary,
              url:{name:'project-page',params:{'id':element.id}}
            })
          })
          this.projectnav.push({
            src: '/static/icon_documents.png',
            title: '资料下载',
            desc: '可查看和发送项目申请材料到您的邮箱',
            url:{name:'document'}
          })
          console.log(this.projectnav);
        }).catch(error=>{
          console.log(error);
        })
    }
  },
 data () {
    return {
      projectnav: []
    }
  },
}
</script>

<style lang='less'>
@import '~@/style/base.less';

.project-nav {
  margin: 10px;
  .weui-cells {
    margin-top: 0; border-radius: 8px; overflow: hidden; box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
    &:after,&::before {
      display: none;
    }
  }
}
</style>
