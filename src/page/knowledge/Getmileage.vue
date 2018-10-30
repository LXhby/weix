<template>
  <div class="knowledge">
    <panel class="mypanel" :list="list" type="1"></panel>
  </div>
</template>

<script>
import { Panel, } from "vux";
import global from '@/components/Global'
export default {
  components: {
    Panel
  },
  name:'Getmileage',
  created () {
    this.initData()
  },
  methods: {
    initData(){
      this.$http
      .get('pages',{params:{'PageSearch[remark]':'里程攻略','PageSearch[config_id]':global.configId,'sort':'id'}})
        .then(response=>{
          response.data.items.forEach(element=>{
            this.list.push({
              src:this.baseUrl+element.image,
              title:element.title,
              desc:element.summary,
              url:{name:'project-page',params:{'id':element.id}}
            })
          })
        }).catch(error=>{
          console.log(error);
        })
      this.$wechat.ready(()=>{
        let route = this.$router.resolve({name: this.$route.name, params:this.$route.params});
        const options = {
          title: '里程攻略', // 分享标题
          desc: '心里程公益项目II期里程攻略',
          link: window.location.protocol+'//'+window.location.host + route.href, // 分享链接，该链接域名或路径必须与当前页面对应的公众号JS安全域名一致
          imgUrl:window.location.protocol+'//'+window.location.host+'/static/pic.png', // 分享图标
          success: () => {
            this.$vux.toast.text('分享成功')
          }
        }
        this.$wechat.onMenuShareTimeline(options)
        this.$wechat.onMenuShareAppMessage(options)
      })
    }
  },
  data () {
    return {
      list: [],
    }
  }
}
</script>

<style lang="less">
@import '~@/style/base.less';

.mypanel {
  .weui-media-box__hd {
    background: #e4e4e4; border-radius: 5px; overflow: hidden;
    .weui-media-box__thumb {
      height: 100%; object-fit: contain;
    }
  }
}
</style>