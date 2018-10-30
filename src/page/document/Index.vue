<template>
  <div class="page with-ft">
    <group :title="group" :key="group" v-for="(documents, group) in list">
      <cell @click.native="showDocument(document)" is-link v-for="document in documents" :key="document.id">
        <span slot="title"><span style="vertical-align:middle;">{{document.name}}</span> <badge v-if="document.is_new" text="新"></badge></span>
      </cell>
    </group>

    <div class="page-ft" v-transfer-dom>
      <x-button type="warn" @click.native="sendEmail">发送全部资料到邮箱</x-button>
    </div>

    <div v-transfer-dom>
      <popup v-model="showPopup" style="height:100%;position:absolute">
        <iframe ref="iframe" v-if="document.filepath" :src="'/static/pdfjs/web/viewer.html?file=' + encodeURIComponent(baseUrl + document.filepath)" frameborder="0" class="pdfview"></iframe>
        <div class="page-ft">
          <x-button @click.native="showPopup = false" full type="warn"> 关闭预览 </x-button>
        </div>
      </popup>
    </div>
  </div>
</template>

<script>
import {
  Group,
  Cell,
  Badge,
  XButton,
  Confirm,
  Popup,
  PopupHeader,
  TransferDomDirective as TransferDom
} from 'vux';

export default {
  directives: {
    TransferDom
  },
  components: {
    Group,
    Cell,
    Badge,
    XButton,
    Confirm,
    Popup,
    PopupHeader,
  },
  name: 'Document',
  data() {
    return {
      list: [],
      showPopup: false,
      document: {},
    };
  },
  created(){
    this.$http.get('documents')
        .then(response=>{
          console.log(response);
          this.list = response.data.items.reduce(function (pre, current, index) {
            pre[current.group] = pre[current.group] || []
            pre[current.group].push(current)
            return pre
          }, {})
          console.log(this.list)
        }).catch(error=>{
            console.log(error);
        });
    this.$wechat.ready(()=>{
      let route = this.$router.resolve({name: this.$route.name, params:this.$route.params});
      const options = {
        title: '资料下载', // 分享标题
        desc: '心里程公益项目II期患者申请材料下载',
        link: window.location.protocol+'//'+window.location.host + route.href, // 分享链接，该链接域名或路径必须与当前页面对应的公众号JS安全域名一致
        imgUrl:window.location.protocol+'//'+window.location.host+'/static/pic.png', // 分享图标
        success: () => {
          this.$vux.toast.text('分享成功')
        }
      }
      this.$wechat.onMenuShareTimeline(options)
      this.$wechat.onMenuShareAppMessage(options)
    })
  },
  methods: {
    showDocument(pdf){
      this.document = pdf;
      this.showPopup = true;
      this.$nextTick(()=>{
        let height = document.documentElement.clientHeight || document.body.clientHeight
        let iframe = this.$refs.iframe
        console.log(iframe)
        iframe.height =  (height - 44)+'px';
      })
    },
    sendEmail() {
      const _this = this;
      this.$vux.confirm.prompt('请输入电子邮箱地址', {
        //title: '获取全部资料',
        title:
          '如“QQ号+@qq.com”，系统自动将资料文件发送至您的邮箱',
        onConfirm : email=>{
          if(this.isEmail(email)){
            this.$vux.loading.show({
              text: '正在发送请稍候'
            })
            this.$http.post('document/send-email', {email: email}).then(response => {
              console.log(response)
              this.$vux.loading.hide();
              this.$vux.toast.text('已发送，请注意查收。');
            });
          }
          else{
            this.$vux.toast.text('请输入正确格式的电子邮箱地址');
          }
        }
      });
    },
    isEmail(mail) {  
      var filter = /^([a-zA-Z0-9_\.\-])+\@(([a-zA-Z0-9\-])+\.)+([a-zA-Z0-9]{2,4})+$/;  
      if (filter.test(mail)) {  
          return true;   
      } else {  
          return false;  
      }   
  }  
  }
};
</script>

<style lang="less">
@import '~@/style/base.less';

.material {
  position: relative;
  padding-bottom: 44px;
  height: 100%;
  box-sizing: border-box;
}

.pdfview {
  width: 100%;
  position: absolute;
  top:0;
}

.weui-dialog .weui-dialog__hd .weui-dialog__title {
  font-weight: normal;
  font-size: 15px;
  line-height: 1.5;
  text-align: left !important;
}

.vux-prompt-msgbox {
  padding: 8px;
}
</style>