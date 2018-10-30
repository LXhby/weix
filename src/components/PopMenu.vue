<!-- 搜索栏 -->
<template>
  <div class="popmenu">
    <i class="iconfont wxicon-msg2" @click="togglePopmenu"></i>
    <div class="popmenu-cont" :class="{ active : isActive }">
      <div class="menu-items">
        <div class="menu-item" :class="{ active : selected == 1 }" @click="changePage('help-question')">
          <i class="iconfont wxicon-ques1"></i>精华提问
        </div>
        <div class="menu-item" :class="{ active : selected == 2 }" @click="changeCate('help-ask')">
          <i class="iconfont wxicon-help"></i>我要提问
        </div>
        <div class="menu-item" :class="{ active : selected == 3 }" @click="changeCate('help-mine')">
          <i class="iconfont wxicon-ques2"></i>我的问题
        </div>
      </div>
    </div>
  </div>
</template>

<script>

export default {
  components: {
  },
  name: 'PopMenu',
  props: {
    selected: String,
  },
  methods: {
    togglePopmenu:function(){
      this.isActive = !this.isActive
    }, 
    changePage(url){
      this.$router.push({name:url})
    },
    changeCate(url){
      let userInfo = JSON.parse(window.localStorage.getItem('userInfo'));
      this.$http.get('patients',{params:{'PatientSearch[wechat_user_id]':userInfo.id}})
        .then(response=>{
          if(response.data.items.length == 0){
            this.$vux.alert.show('请先在我要报到登录')
          }else{
            this.$router.push({name:url})
          }
        }).catch(error=>{
          console.log(error);
        })
    },
  },
  data () {
    return {
      isActive: false,
    }
  }
}

</script>

<style lang="less">
@import '~@/style/base.less';

.popmenu {
  position: fixed; height: 44px; width: 44px; right: 10px; bottom: 30%; border-radius: 100%; line-height: 44px; background: @magenta; text-align: center; box-shadow: 0 0 5px fade(@magenta,80%);
  & > .iconfont {
    font-size: 2.4rem; vertical-align: middle; color: #fff;
  }
  .popmenu-cont {
    position: absolute; right: 55px; bottom: 50%; background: #eee; padding: 0 5px; line-height: 1.3; margin-bottom: -14px; display: none; border-radius: 4px;
    &::before {
      .arrow-r; right: -5px; border-color: #eee; background: #eee;
    }
    &.active {
      display: block;
    }
    .menu-items {
      .display-flex;
    }
    .menu-item {
      white-space: nowrap; padding: 8px 6px; font-size: 1.3rem; color: #999;
      &.active {
        color: @magenta;
      }
      .iconfont {
        margin-right: 2px; font-size: 1.6rem; vertical-align: -1px;
      }
    }
  }
}
</style>