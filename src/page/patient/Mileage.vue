<template>
  <div class="member-center">
  </div>
</template>

<script>
import { GroupTitle,Group,Cell,CellBox,XInput, Swiper, SwiperItem, XButton, XProgress, Panel, Divider } from 'vux'
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
                    this.$http.post('pap/check-patient', {name:info.name,mobile:info.mobile}).then(response=>{
                        let pap_info = response.data
                        switch (response.data.status) {
                        //pap中没有信息
                        case global.NEW_PATIENT:
                            this.$vux.alert.show({
                                content:'先在我要报到页面完成基本信息填写才可上传里程',
                                onHide:()=>{
                                    this.$wechat.closeWindow()
                                }
                            })
                            break;
                        case global.CHECK_IN_WECHAT:
                            if(pap_info.model.statusing == '初审驳回'){
                                this.$vux.alert.show('您的初审未能通过，请修改资料后重新提交')
                                this.$router.replace({name:'register-apply'})
                            }else{
                                //判断审核结果和流程状态
                                this.checkPhase(pap_info)
                            }          
                            break;
                        }
                    }).catch(error => {
                        console.log(error);
                    })
                }else{
                    this.$vux.alert.show({
                        content:'请先在我要报到登录后再上传里程',
                        onHide:()=>{
                            this.$wechat.closeWindow()
                        }
                    })
                }
            }).catch(error=>{
                this.$vux.toast.text(error);
            })
    },
    checkPhase(pap_info){
        if(pap_info.phase){
            console.log('checkphase',pap_info.model.status)
            if(pap_info.model.status == '在组' || pap_info.model.status == '出组' || pap_info.model.status == '归档'){
                // this.$router.push({
                //     name:'patient-remind',
                //     params:{'desc':'您当前的状态无法上传里程'}
                // })
                this.$router.push({                            //joe
                    name:'patient-phase',
                    params:{id:pap_info.id}
                })
            }else{
                switch (pap_info.phase.status) {
                case '已拒绝':
                    this.$router.push({
                        name:'patient-remind',
                        params:{'desc':'您当前审核未通过，无法上传里程'}
                    })
                    break;
                case '资料不全':
                    this.$vux.alert.show({
                        content:'只差一步即可入组领药,请先上传审核材料'
                    })
                    this.$router.replace({name:'patient-check',params:{'patient_id':pap_info.model.id}})
                    break;
                case '里程完毕待审核':
                    this.$router.push({
                        name:'patient-remind',
                        params:{'desc':'您已提交过入组审核材料,待项目办审核通过后即可入组领药'}
                    })
                    break;
                default:
                    this.$router.replace({
                        name:'patient-upload',
                        params:{'patient_id':pap_info.id}
                    })
                    break;
                }
            }   
        }else{
            this.$router.replace({
                name:'patient-upload',
                params:{'patient_id':pap_info.id}
            })
        }
    }
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
