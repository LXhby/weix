<template>
  <div style="height:100%;">
    <div v-transfer-dom>
      <loading v-model="isLoading"/>
      <x-dialog :show="subscribeDialogShow" @on-show="showQrcode()">
        <div class="notice-model">
            <div class="qrcode">
                <img :src="qrcode" alt="" class="photo">
            </div>
            <div class="weui-dialog__hd"><strong class="weui-dialog__title">{{global.appName}}</strong></div>
            <div class="weui-dialog__bd">
                <p>长按上面二维码关注</p>
            </div>
            <div class="weui-dialog__ft">
                <div class="notice-countdown">
                    更多精彩内容，不容错过
                </div>
            </div>
            <a href="javascript:;" @click="hideSubscribeDialog()" class="btn-cancel" id="close-qrcode-notice"><i class="weui-icon-cancel"></i></a>
        </div>
      </x-dialog>
    </div>

    <view-box
      ref="viewBox"
      body-padding-bottom="55px">
      <!-- remember to import BusPlugin in main.js if you use components: x-img and sticky -->
        <!-- <transition
        @after-enter="$vux.bus && $vux.bus.$emit('vux:after-view-enter')"
        :name="'vux-pop-' + (direction === 'forward' ? 'in' : 'out')"> -->
        <router-view v-wechat-title="$store.state.vux.title" img-set="data:image/gif;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVQImWNgYGBgAAAABQABh6FO1AAAAABJRU5ErkJggg==" class="router-view" id="router-view"/>
        <!-- </transition> -->
    </view-box>
  </div>
</template>

<script>
import {
  Radio,
  Group,
  Cell,
  Badge,
  Actionsheet,
  ButtonTab,
  ButtonTabItem,
  ViewBox,
  Tabbar,
  TabbarItem,
  Loading,
  TransferDom,
  XDialog,
  cookie,
  Grid, GridItem,
  Popup,
} from "vux";
import { mapState } from "vuex";
import global from '@/components/Global'

export default {
  name: "app",
  directives: {
    TransferDom
  },
  components: {
    Radio,
    Group,
    Cell,
    Badge,
    ButtonTab,
    ButtonTabItem,
    ViewBox,
    Tabbar,
    TabbarItem,
    Loading,
    Actionsheet,
    XDialog,
    cookie,
    Popup,
  },
  watch: {
    showTabbar: function (val) {
      this.$refs.viewBox.$refs.viewBoxBody.style.paddingBottom =  val ? '55px':0
    },
  },
  data(){
    
    return {
      subscribeDialogShow: false, // 关注对话框
      global: global,
      qrcode: null,
      shareDialogShow: false, // 分享红包对话框
      showShareTips: false, // 分享提示浮层
      shareDialogStyle: {'max-width': '100%', width: '100%', height: '410px', 'background-color': 'transparent'},
      showRedPack: false,
      redpack: {},
    }
  },
  created(){

  },
  // mounted(){
  //   let initInteval = setInterval(()=>{
  //     let userInfo = JSON.parse(window.localStorage.getItem('userInfo'));
  //     if(userInfo==null) return;
  //     clearInterval(initInteval);
  //     let checkSubscribeInterval = setInterval(()=>{
  //       if(this.userInfo){
  //         clearInterval(checkSubscribeInterval)
  //         if(this.userInfo.subscribe==0){
  //           const subscribe_dialog_show = cookie.get('subscribe_dialog_show')
  //           if(subscribe_dialog_show != 'false'){
  //             this.subscribeDialogShow = true
  //           }
  //         }
  //         else{
  //           cookie.remove('subscribe_dialog_show', {path: '/'})
  //         }
  //       }
  //     }, 3000);
  //
  //     this.checkNewRedpack();
  //     setInterval(()=>{
  //       this.checkNewRedpack();
  //     }, 10000);
  //
  //   },1000);
  // },
  computed: {
    ...mapState({
      route: state => state.route,
      path: state => state.route.path,
      deviceready: state => state.app.deviceready,
      demoTop: state => state.vux.demoScrollTop,
      isLoading: state => state.vux.isLoading,
      direction: state => state.vux.direction,
      showTabbar: (state)=>{
        return (['/', '/teacher', '/live', '/member', '/explore'].indexOf(state.route.path)!==-1)
      },
    })
  },
  methods: {
    showQrcode(){
      this.$http.get('share-card/qrcode')
        .then(response => {
          this.qrcode = response.data
        }).catch(error => {
          console.log(error);
        });
    },
    hideSubscribeDialog(){
      this.subscribeDialogShow = false
      cookie.set('subscribe_dialog_show', "false", {
        path: '/',
        expires: 7
      })
      this.shareDialogShow = true;
    },
    checkNewRedpack(){ // 检查新的红包
    let userInfo = JSON.parse(window.localStorage.getItem('userInfo'));
      if(this.showRedPack == true) return;
      this.$http.get('redpacks', {params: {'RedpackSearch[user_id]': userInfo.id, 'RedpackSearch[status]':'未领取', 'RedpackSearch[type]':'分享红包'}})
        .then(response => {
          if(response.data.items.length>0){
            this.redpack = response.data.items[0];
            this.showRedPack = true;
          }
        }).catch(error => {
          console.log(error);
        });
    }
  },
};
</script>

<style>
@import "nprogress/nprogress.css";
@import "//at.alicdn.com/t/font_649428_enrekmgxl8nkx1or.css";

.share-tips {
  opacity:0.7; display:block; height:700px; width:100%; background: url('~@/assets/share.png'); background-size: 100% 100%; background-repeat: no-repeat;
}
.notice-model .btn-cancel {
  position: absolute;
  top: 0px;
  right: 0px;
  color: #fff;
  padding: 5px;
}
.notice-model .btn-cancel .weui-icon-cancel {
  color: #fff;
  vertical-align: middle;
}
.notice-model .notice-countdown {
  text-align: center;
  font-size: 15px;
  width: 100%;
}
.notice-model .notice-countdown span {
  font-size: 16px;
}
.notice-model .qrcode {
  background: url('./assets/model-t.jpg') center center no-repeat;
  background-size: cover;
  text-align: center;
  height: 120px;
  margin-bottom: 40px;
}
.notice-model .qrcode .photo {
  height: 150px;
  width: 150px;
  vertical-align: middle;
  border: #fff solid 2px;
  margin-top: 16px;
}
</style>

<style lang="less">
@import "~vux/src/styles/reset.less";
@import "~vux/src/styles/1px.less";
@import "~vux/src/styles/tap.less";
@import "~vux/src/styles/close.less";
@import "~vux/src/styles/weui/widget/weui_tips/weui_dialog.less";
@import "/style/base.less";

.txt-line-two {
  overflow: hidden;
  text-overflow: ellipsis;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  word-break: break-word;
}

html {
font-size: 62.5%
}
body {
  background-color: #fbf9fe;
}
html,
body {
  height: 100%;
  width: 100%;
  overflow-x: hidden;
}
.router-view {
  width: 100%;
}
.vux-pop-out-enter-active,
.vux-pop-out-leave-active,
.vux-pop-in-enter-active,
.vux-pop-in-leave-active {
  will-change: transform;
  transition: all 250ms;
  height: 100%;
  position: absolute;
  backface-visibility: hidden;
  perspective: 500;
}
.vux-pop-out-enter {
  opacity: 0;
  transform: translate3d(-100%, 0, 0);
}
.vux-pop-out-leave-active {
  opacity: 0;
  transform: translate3d(100%, 0, 0);
}
.vux-pop-in-enter {
  opacity: 0;
  transform: translate3d(100%, 0, 0);
}
.vux-pop-in-leave-active {
  opacity: 0;
  transform: translate3d(-100%, 0, 0);
}

.weui-cells {
  margin-top: 10px !important;
}

.weui-panel__hd {
  color: #333;
  font-size: 15px !important;
}

.weui-btn::after {
  width: calc(200% - 1px) !important;
}

.page {
  height: 100%; box-sizing: border-box; overflow: scroll; -webkit-overflow-scrolling: touch;
}
.page.with-hd {
  padding-top: 44px;
}
.page.with-ft {
  padding-bottom: 48px;
}
.page-hd {
  position: fixed; min-height: 44px; width: 100%; left: 0; top: 0; z-index: 100;
}
.page-ft {
	position: fixed; min-height: 48px; width: 100%; left: 0; bottom: 0; z-index: 100;
	.weui-btn {
    border-radius: 0; line-height: 2.66666666;
    &::after {
      border-radius: 0; border-width: 0;
    }
    .iconfont {
      font-size: 2.4rem; vertical-align: -3px;
    }
	}
}

.mygrid {
  background: #fff;
  .weui-grid__icon {
    .myfont {
      font-size: 28px;
      color: @orange;
    }
  }
  .weui-grid__label {
    font-size: 12px;
    color: #555;
  }
}

.myform {
  .weui-cells {
    font-size: 15px;
  }
}

/*banner*/
.banner {
    position: relative; max-width: 1024px; margin: 0 auto;
    .banner-img {
        img { vertical-align: middle; width: 100%;}
    }
    .banner-t {
        position: absolute; bottom: 0; left: 0; right: 0; padding: 8px 10px; line-height: 20px; font-size: 15px;
        color: #fff; background-color: rgba(0,0,0,0.6);
    }
}

// 登录注册
.mylogin {
  .weui-cells {
    margin-top: 0 !important;
  }
  .weui-cell {
    padding: 12px 15px;
  }
  .weui-label {
    color: #666;
    .iconfont {
      font-size: 1.7rem;
    }
  }
  .weui-cell__bd {
    font-size: 16px;
  }
}
.mylogin-change {
  text-align: right; padding: 10px 15px; color: #999;
  a { color: @orange;}
}
.mylogin-tips {
  background: #f4f5f6; border: #e4e4e4 solid 1px; padding: 10px 15px; font-size: 1.4rem; color: #666; border-radius: 5px;
}

@media only screen and (min-width: 481px) {
html {
font-size:94%!important
}
}

@media only screen and (min-width: 561px) {
html {
font-size:109%!important
}
}

@media only screen and (min-width: 641px) {
html {
font-size:125%!important
}
}
</style>
