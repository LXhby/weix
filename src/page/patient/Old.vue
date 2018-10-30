
<template>
  <div class="member-center">
    <div class="banner">
      <div class="banner-img">
        <img src="../../assets/old_kv.jpg" alt="">
      </div>
    </div> 
    <group class="mylogin" label-margin-right="1em" label-width="8rem">
      <x-input :required="true" v-validate="'required'" name="name"  v-model="formdata.name" title="姓名" placeholder="请输入姓名"></x-input>
      <x-input :required="true" is-type="china-mobile" name="mobile" v-validate="'required|digits:11'" v-model="formdata.mobile" title="手机号码" placeholder="请输入手机号码" keyboard="number"></x-input>
    </group>
     <div style="padding: 0 45px;margin-top:40px">
        <x-button type="warn" @click.native="submitForm()">查询</x-button>
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
  name:'Old',
  methods: {
    submitForm(){
      this.$validator.validateAll().then((result) => {
        if(result){
            this.$http.post('patient/check-old', this.formdata).then(response=>{
                console.log(response);
                let pap_info = response.data
                switch (response.data.status) {
                    //pap中没有信息
                    case global.NEW_PATIENT:
                        this.$vux.toast.text('不存在该患者')
                    break;
                    case global.CHECK_IN_WECHAT:          
                        //查看papid
                        this.$router.push({name:'patient-oldline',params:{'id':pap_info.model.id}})
                    break;
                    case global.MOBILE_REGISTED:          
                        this.$vux.toast.text('姓名与手机号不符，请核对您输入的信息')
                    break;
                }
            }).catch(error => {
                console.log(error);
            });;
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
