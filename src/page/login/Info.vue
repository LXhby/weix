<template>
  <div class="member-center">
    <group class="mylogin" label-margin-right="2em" label-width="5em">
      <x-input :required="true" name="name" v-model="formdata.name" title="姓名" readonly></x-input>

      <x-input :required="true" readonly is-type="china-mobile" name="mobile" v-validate="'required|digits:11'" v-model="formdata.mobile" title="手机号码"  keyboard="number"></x-input>

      <x-input :required="true" name="idsn" v-model="formdata.idsn" title="身份证号" readonly></x-input>

      <x-input :required="true" name="hospital" v-model="formdata.hospital" title="项目医院" readonly></x-input>
    </group>
    <div style="text-align:center;margin-top:10px" class="mylogin-change" v-if="remind">
      您已初审通过，请及时
      <router-link  :to="{name:'patient-mileage'}" >
        上传里程
      </router-link>
    </div>
    <div style="padding: 0 45px;margin-top:10px">
      <x-button type="warn" @click.native="submitForm()">返回首页</x-button>
    </div>
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
      let userInfo = JSON.parse(window.localStorage.getItem('userInfo'))
      this.$http.get('patients',{params:{'PatientSearch[wechat_user_id]':userInfo.id}})
        .then(response=>{
            this.$http.post('pap/check-patient', response.data.items[0]).then(response=>{
                this.formdata = {
                    name : response.data.model.name,
                    idsn : response.data.model.idsn,
                    mobile : response.data.model.mobile,
                    hospital : response.data.hospital.name,
                }
                if(response.data.model.status == '初始'){
                  this.remind = true
                }else if(response.data.model.status == '未入组' && response.data.phase.status != '里程完毕待审核'){
                  this.remind = true
                }
            }).catch(error => {
                console.log(error);
            });;
        }).catch(error=>{
           console.log(error);
        })

    },
    submitForm(){
        this.$wechat.closeWindow()
    }
  },
 data () {
    return {
        formdata:{},
        remind:false
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
