<template>
  <div class="member-center">
    <div class="banner">
      <div class="banner-img">
        <img src="../../assets/kv.jpg" alt="">
      </div>
    </div> 
    <group class="mylogin" label-margin-right="1em" label-width="8rem">
      <x-input :required="true" is-type="china-mobile" name="mobile" v-validate="'required|digits:11'" v-model="formdata.mobile" title="手机号码" placeholder="请输入手机号码" keyboard="number"></x-input>
      <x-input :required="true" v-validate="'required'" type="password" name="password"  v-model="formdata.password" title="密码" placeholder="请输入密码" ></x-input>
    </group>
    <div class="mylogin-change">
        忘记密码？
        <router-link  :to="{name:'login-verifycode'}">
            使用验证码登录
        </router-link>
    </div>
    <div style="padding: 0 25px;">
      <flexbox>
        <flexbox-item>
          <x-button type="warn" @click.native="submitForm()" style="font-weight: 800;">登录</x-button>
        </flexbox-item>
        <flexbox-item>
          <x-button type="default" :link="{name:'register-index'}">在线注册</x-button>
        </flexbox-item>
      </flexbox>
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
import { GroupTitle,Group,Cell,CellBox,XInput, Swiper, SwiperItem, XButton, XProgress, Panel, Divider, Flexbox, FlexboxItem } from 'vux'
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
    Flexbox,
    FlexboxItem
  },
  name:'Password',
  methods: {
    checkPap(pap_info){
      let userInfo = JSON.parse(window.localStorage.getItem('userInfo'));
      this.formdata.papid = pap_info.id
      this.formdata.name = pap_info.model.name
      this.formdata.mobile = pap_info.model.mobile
      this.$http.post('patient/find-patient',this.formdata)
        .then(response=>{
          if(response.data.status == 'LOGIN'){
            //绑定完成papid后判断患者流程状态
            if(pap_info.model.status != '初始'){
              this.$router.push({name:'login-info'})
            }else if(pap_info.model.status == '初始'){
              if(pap_info.model.statusing == '申请中' || pap_info.model.statusing == '' || pap_info.model.statusing == '待初审'){
                this.$router.push({name:'login-remind'})
              }else if(pap_info.model.statusing == '初审驳回'){
                this.$vux.alert.show('您的初审未能通过，请修改资料后重新提交')
                this.$router.push({name:'register-apply'})
              }else if(pap_info.model.statusing == '补充资料未审核' || pap_info.model.statusing == '补充资料已审核'){
                this.$router.push({name:'login-remind'})
              }else if(pap_info.model.statusing == '初审通过'){
                this.$router.push({name:'login-remind'})
              }
            }
          }
        }).catch(error=>{
          console.log(error);
        })
    },
    submitForm(){
      this.$validator.validateAll().then((result) => {
        if(result){
          this.$http.post('patient/login',this.formdata)
            .then(response=>{
              switch (response.data.status) {
                case 'NOT_EXIST':
                  this.$vux.toast.text('用户不存在，请先注册')
                  break;
                case 'WRONG_NUMBER':
                  this.$vux.toast.text('密码错误，请重新输入')
                  break;
                case 'SUCCESS':
                  //判断pap中是否存在对应信息
                  this.formdata.name = response.data.name
                  this.$http.post('pap/check-patient', this.formdata).then(response=>{
                     let pap_info = response.data
                     switch (response.data.status) {
                      //pap中没有信息
                      case global.NEW_PATIENT:
                        this.$router.push({name:'register-apply'})
                        break;
                      case global.CHECK_IN_WECHAT:          
                        //查看papid
                        this.checkPap(pap_info)
                        break;
                    }
                  }).catch(error => {
                    console.log(error);
                  });;
                  break;
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

</style>
