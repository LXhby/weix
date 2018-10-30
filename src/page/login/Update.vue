<template>
    <div class="member-center">
    <p style="padding:15px">请设置密码，这样您可以使用手机号+密码登录，更快捷</p>
    <group class="myform" label-margin-right="2em" label-width="5em">
      <x-input :required="true" readonly is-type="china-mobile" name="mobile" v-validate="'required|digits:11'" v-model="formdata.mobile" title="手机号码" placeholder="请输入手机号码" keyboard="number"></x-input>
    </group>
    <group title="设置密码" class="myform" label-margin-right="2em" label-width="5em">
      <x-input :required="true" v-validate="'required'" title="输入密码" :min="6" placeholder="至少六个字符" type="password" v-model="formdata.password" ></x-input>
      <x-input :required="true" v-validate="'required'" title="确认密码" v-model="formdata.password2" type="password" placeholder="" :equal-with="formdata.password"></x-input>
    </group>
    <div style="padding:0 45px;margin-top:40px">
      <x-button type="warn" @click.native="submitForm()">确认</x-button>
    </div>
  </div>
</template>

<script>
import { GroupTitle,Group, Cell,CellBox,XInput, Swiper, SwiperItem, XButton, XProgress, Panel, Divider } from 'vux'
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
    GroupTitle,
    CellBox,
    XInput,
  },
  name:'Update',
  created(){
      this.formdata.mobile = this.$route.params.mobile
  },
  methods: {
    submitForm(){
      if(this.formdata.password != this.formdata.password2){
        this.$vux.toast.text('两次输入密码不一致');
        return false;
      }else if(this.formdata.password.length<6){
        this.$vux.toast.text('密码至少由6个字符组成');
        return false;
      }
      this.$validator.validateAll().then((result) => {
        if(result){
          this.$http.post('patient/update-password',this.formdata)
            .then(response=>{
              if(response.data.status == 'success'){
                this.$vux.toast.text('密码修改成功')
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
            }).catch(error=>{
              console.log(error);
            })
        }
        else{
          console.log(this.validateErrors.all())
          this.$vux.toast.text('输入信息不正确，请修正后再提交');
          return false;
        }
      })
    },
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
  },
 data () {
    return {
      formdata: {},
      mobile:{}
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
