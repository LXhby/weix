<template>
  <div class="member-center">
  </div>
</template>

<script>


export default {
  components: {
  },
  created () {
    this.initData()
  },
  methods: {
     initData(){
      let userInfo = JSON.parse(window.localStorage.getItem('userInfo'));
      this.$http.get('patients',{params:{'PatientSearch[wechat_user_id]':userInfo.id,'expand':'wechatuser'}})
        .then(response=>{
          if(response.data.items.length == 0){
            this.$vux.alert.show({
              title:'提示',
              content:'请先在我要报到登录',
              onHide:(()=>{
                this.$wechat.closeWindow()
              })
            })
          }else{
            this.$router.replace({name:'shop'})
          }
        }).catch(error=>{
          console.log(error);
        })
    },
  },
 data () {
    return {
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
