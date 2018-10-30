<template>
  <div class="member-center">
    <div v-show="step">
        <group title="申请注册" class="mylogin" label-margin-right="2em" label-width="5em">
          <x-input :required="true" is-type="china-name" name="name"  v-model.trim="formdata.name" title="姓名" placeholder="请输入姓名" ></x-input>
          <x-input :required="true" is-type="china-mobile" name="mobile" v-validate="'required|digits:11'" v-model.trim="formdata.mobile" title="手机号码" placeholder="请输入手机号码" keyboard="number"></x-input>
          <x-input :required="true" name="verifycode" v-validate="'required|digits:6'" v-model="formdata.verifycode" title="验证码" class="weui-cell_vcode" placeholder="输入验证码" keyboard="number">
            <x-button slot="right" type="primary" mini plain style="margin:8px" :disabled="btnDisabled" @click.native="sendVerifycode()">{{btnText}}</x-button>
          </x-input>
        </group>
        <div v-transfer-dom>
          <popup v-model="show" max-height="75%">
              <div class="weui-article popup0" style="background: #fff;">
                <h1>
                    微信平台患者在线申请须知
                </h1>
                <section style="text-align:justify">
                    <p>尊敬的患者您好！</p>
                    <p>心里程公益项目II期（以下简称：“项目”），为保障申请本项目的患者的用药及时性及持续性，现开通微信在线申请功能，请在使用前仔细阅读以下相关条款。</p>
                    <p>1、患者知晓自身病情，且自愿申请心里程公益项目II期。</p>
                    <p>2、患者已全部知晓《心里程公益项目II期患者知情同意书》的全部内容，并完全接受其中的各项规定。</p>
                    <p>3、患者申请援助项目所提交的全部材料必须真实准确，且严格遵守项目的各项规定。如所提交材料出现虚假或不实，将彻底失去受助资格。</p>
                    <p>4、患者申请材料需按微信平台提示全部上传，如上传不完整或无法识别，项目办有权驳回，要求患者重新上传资料。</p>
                    <p>5、项目办对审核通过的患者材料进行抽查复核时，对于质疑的患者材料有权要求患者提供更多的申请材料，拒不提交材料者，项目办有权终止对此患者的援助。</p>
                    <p>6、基金会项目办根据患者提交材料的先后次序进行审核，审核结果将通过短信/微信的方式予以告知，如逾期没有反馈的，请务必及时拨打项目援助电话：4000822072。因患者自身原因导致申请、受助延误的，患者自行承担责任。</p>
                    <p>7、本项目为慈善项目，项目工作人员不得收取任何费用。如发现上述行为，请立即举报。如患者或患者家属有向上述人员行贿行为，患者将失去获得援助的机会。</p>
                    <p>8、心里程公益项目II期的一切解释权归中华社会救助基金会所有。</p>
                    <label for="weuiAgree" class="weui-agree" style="text-align:center;margin-top:20px">
                        <input id="weuiAgree" type="checkbox" @click="changeAccess()" class="weui-agree__checkbox">
                        <span class="weui-agree__text zpsm-red">
                          <a href="javascript:;">我已阅读并同意《在线申请须知》</a>
                        </span>
                    </label>
                </section>
              </div>
          </popup>
        </div>
        <div style="padding: 0 45px;margin-top:40px">
          <x-button type="warn" @click.native="check()">下一步</x-button>
        </div>
    </div>
    <div v-show="!step">
        <group title="请设置密码，这样您可以使用手机号+密码登录，更快捷" class="mylogin" label-margin-right="2em" label-width="5em">
          <x-input :required="true" readonly is-type="china-mobile" name="mobile" v-validate="'required|digits:11'" v-model="formdata.mobile" title="手机号码" placeholder="请输入手机号码" keyboard="number"></x-input>
          <x-input :required="true" title="输入密码" :min="6" type="password" placeholder="至少六个字符" v-model="formdata.password" ></x-input>
          <x-input :required="true" title="确认密码" v-model="formdata.password2" type="password" placeholder="确认密码" :equal-with="formdata.password"></x-input>
        </group>
        <div style="padding: 0 45px;margin-top:40px">
          <x-button type="warn" @click.native="submitForm()">确认</x-button>
        </div>
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
import { GroupTitle,Group,Cell,CellBox,XInput, Swiper, SwiperItem,
 XButton, XProgress, Panel, Divider,Popup,TransferDom,XSwitch } from 'vux'
import { Carousel, Slide } from 'vue-carousel';
import global from '@/components/Global'
import qs from 'qs'

export default {
  directives: {
    TransferDom
  },
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
    Popup,
    XSwitch
  },
  name:'EmRegister',
  created(){
  },
  methods: {
    popup(){
      this.show = true;
    },
    changeAccess(){
      this.access = !this.access
      this.show = false
    },
    check(){
      this.$validator.validateAll().then(async (result) => {
        if(result){    
          if(!this.access){
            this.$vux.confirm.show({
              title:'提示',
              content:'阅读并同意《在线申请须知》后才可注册',
              confirmText:'点击阅读',
              onConfirm:()=>{
                this.popup()
              }
            })
            return false
          }
          //核对验证码
          let response =await this.$http.post('patient/check-verifycode',this.formdata)
              if(response.data.status == 'SUCCESS'){
                 //在pap中验证手机号，姓名
                try{
                  response = await this.$http.post('pap/check-patient', this.formdata)
                  switch(response.data.status)
                  {
                    //手机号已注册
                    case(global.MOBILE_REGISTED):
                      this.$vux.toast.text('此手机号已经注册过了')
                      break;
                    //在微信端核对
                    case(global.CHECK_IN_WECHAT):
                      let userInfo = JSON.parse(window.localStorage.getItem('userInfo')) 
                      //查看papid
                      this.formdata.papid = response.data.id
                      response = await this.$http.post('patient/find-patient',this.formdata)
                      if(response.data.status=='GO_PASSWORD'){
                        //pap后台加入，微信端没有数据
                        this.step =false;
                        this.flag = true
                      }else if(response.data.status=='LOGIN'){
                        this.$vux.alert.show('该患者已经注册过了，请直接进行绑定操作')
                      }
                      break;
                    //pap不存在对应信息
                    case(global.NEW_PATIENT):
                      this.formdata.papid = 0
                      response = await this.$http.post('patient/find-patient',this.formdata)
                      if(response.data.status=='GO_PASSWORD'){
                        this.step =false;
                        this.flag = true;
                      }else if(response.data.status=='GO_APPLY'){
                        //患者已经注册过了
                        this.$vux.alert.show('该患者已经注册过了，请直接进行绑定操作')
                      }else if(response.data.status=='MOBILE_REGISTED'){
                        this.$vux.toast.text('此手机号已经注册过了')
                      }
                      break;                
                  }
                }
                catch (error){
                  console.log(error);
                };
              }else{
                this.$vux.toast.text('无效的验证码');
              }
        }
        else{
          console.log(this.validateErrors.all())
          this.$vux.toast.text('请完善表单信息后再提交');
          return false;
        }
      })
    },
    //填写密码后提交表单
    submitForm(){
      if(!this.formdata.password ||  !this.formdata.password2){
        this.$vux.toast.text('请完善表单信息');
        return false;
      }else{
        if(this.formdata.password != this.formdata.password2){
          this.$vux.toast.text('两次输入密码不一致');
          return false;
        }else if(this.formdata.password.length<6){
          this.$vux.toast.text('密码至少由6个字符组成');
          return false;
        }
        //提交注册
        this.formdata.config_id = global.configId
        this.$http.post('patient/em-register',this.formdata)
          .then(response=>{
            if(response.data==true){
              if(this.flag){
                this.$vux.alert.show('注册成功!')
                this.$router.push({name:'assist-detail'})
              }else{
                this.$vux.alert.show('注册成功!')
                this.$router.push({name:'assist-detail'})
              } 
            }else{
              this.$vux.toast.text(response.data);
            }
          }).catch(error=>{
            console.log(error);
          })   
      }
    },
    sendVerifycode(){
      if(!this.formdata.mobile){
        this.$vux.toast.text('请输入手机号码')
        return false;
      }else if(this.formdata.mobile.length !=11){
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
    }
  },
 data () {
    return {
      formdata: {},
      step:true,
      flag:false,
      btnText:'获取验证码',
      timer: null,
      btnDisabled: false,
      labelPosition: '',
      show:false,
      access:false
    }
  },
}
</script>

<style lang='less'>
@import '~vux/src/styles/weui/widget/weui-agree/weui-agree';
@import '~vux/src/styles/weui/widget/weui_page/weui_article';
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
