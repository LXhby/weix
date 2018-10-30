<template>
    <div class="member-center">
      <div class="banner">
        <div class="banner-img">
          <img src="../../assets/kv.jpg" alt="">
        </div>
      </div>    
      <group class="mylogin" label-margin-right="1em" label-width="8rem">
        <x-input :required="true" is-type="china-mobile" name="mobile" v-validate="'required|digits:11'" v-model="formdata.mobile" title="手机号码" placeholder="请输入手机号码" keyboard="number"></x-input>
        <x-input :required="true" name="verifycode" v-validate="'required|digits:6'" v-model="formdata.verifycode" title="验证码" class="weui-cell_vcode" placeholder="请输入验证码" keyboard="number">
          <x-button slot="right" type="primary" mini plain style="margin:8px" :disabled="btnDisabled" @click.native="sendVerifycode()">{{btnText}}</x-button>
        </x-input>
      </group>
      <div class="mylogin-change"> 
        <router-link  :to="{name:'login-password'}">
            使用密码登录
        </router-link>
      </div>
      <div style="padding: 0 45px;">
        <x-button type="warn" @click.native="submitForm()" style="font-weight: 800;">登录</x-button>
      </div>
      <div style="padding: 30px 30px">
        <div class="mylogin-tips">
          项目热线咨询：<a href="tel:4000822072" style="color:#666">4000822072</a><br/>
          项目邮箱：brilintapap@163.com<br/>
          网址：brilintapap.mpf.org.cn<br/>
          资料邮寄地址（只接收EMS特快专递）:<br/>
          上海邮政011-032信箱中华社会救助基金会<br/>
          心里程公益项目II期办公室收
        </div>
      </div>
  </div>
</template>

<script>
import { GroupTitle,Group, Cell,CellBox,XInput, Swiper, SwiperItem, XButton, XProgress, Panel, Divider } from 'vux'
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
    GroupTitle,
    CellBox,
    XInput,
  },
  name:'Verifycode',
  methods: {
    sendVerifycode(){
      if(!this.formdata.mobile){
        this.$vux.toast.text('请输入手机号码')
        return false
      }else if(this.formdata.mobile.length<11){
        this.$vux.toast.text('请输入正确的手机号码')
        return false;
      }else{
        this.btnDisabled =true
        this.$http.post('patient/sendverifycode',{'mobile':this.formdata.mobile,'SmsType':'3','config_id':global.configId})
          .then(response=>{
            console.log(response)
            this.startTimer()
          }).catch(error=>{
            console.log(error)
            this.$vux.toast.text(error.response.data.message);
          })
      } 
    },
    submitForm(){
      this.$validator.validateAll().then((result) => {
        if(result){
          let userInfo = JSON.parse(window.localStorage.getItem('userInfo'))
          this.$http.post('patient/code-login',this.formdata)
            .then(response=>{
              if(response.data.status == 'success'){
                this.$router.push({name:'update-password',params:{'mobile':this.formdata.mobile}})
              }else{
                this.$vux.toast.text(response.data.status)
              }
            }).catch(error=>{
              console.log(error);
            }) 
        }
        else{
          console.log(this.validateErrors.all())
          this.$vux.toast.text('请完善表单信息后再提交');
          return false;
        }
      })
    },
    startTimer(){
      let seconds = 60
      this.timer = setInterval(()=>{
        seconds --
        this.btnText = seconds + '秒'
        if(seconds<=0) {
          clearInterval(this.timer)
          this.btnText = '重发验证码'
          this.btnDisabled = false
        }
      }, 1000);
    },
  },
 data () {
    return {
      formdata: {},
      btnText:'获取验证码',
      timer: null,
      btnDisabled: false,
    }
  },
}
</script>

<style lang='less'>
@import '~@/style/base.less';


</style>
