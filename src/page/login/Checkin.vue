<template>
  <div class="member-center">
  </div>
</template>

<script>
import { GroupTitle,Group,Cell,CellBox,XInput, Swiper, SwiperItem, XButton, XProgress, Panel, Divider } from 'vux'
import { Carousel, Slide } from 'vue-carousel';
import global from '@/components/Global'
import qs from 'qs'
//我要报到
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
        //判断患者是否登录
        let userInfo = JSON.parse(window.localStorage.getItem('userInfo'));
        this.$http.get('patients',{params:{'PatientSearch[wechat_user_id]':userInfo.id}})
            .then(response=>{
                if(response.data.items != ''){
                  let info = response.data.items[0]
                  //判断pap中是否存在对应信息
                  this.formdata = {
                    name:info.name,
                    mobile:info.mobile
                  }
                  this.$http.post('pap/check-patient', this.formdata).then(response=>{
                    console.log(response.data);
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
                  })
                }else{
                    this.$router.push({name:'login-password'})
                }
            }).catch(error=>{
                this.$vux.toast.text(error);
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
              if(pap_info.model.status == '在组' || pap_info.model.status == '出组'|| pap_info.model.status == '归档'){
                this.$router.push({name:'patient-phase',params:{id:pap_info.id}})
              }else{
                this.$router.push({name:'login-info'})
              }
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
      formdata:{
        name:'',
        mobile:''
      }
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
