<template>
  <div class="myask">
    <!-- <div class="page-hd" v-transfer-dom>
      <button-tab class="help-tab">
        <button-tab-item @on-item-click="changePage('help-question')"><i class="iconfont wxicon-ques1"></i>精华提问</button-tab-item>
        <button-tab-item @on-item-click="changeCate('help-ask')" selected><i class="iconfont wxicon-help"></i>我要提问</button-tab-item>
        <button-tab-item @on-item-click="changeCate('help-mine')" ><i class="iconfont wxicon-ques2"></i>我的问题</button-tab-item>
      </button-tab>
    </div> -->
     <group>
      <x-textarea :max="200"  placeholder="请输入内容" v-model="formdata.content"></x-textarea>
    </group>
    <div style="padding:0 45px;margin-top:30px">
      <x-button type="warn" @click.native="submitForm()">发布问题</x-button>
    </div>
    <pop-menu selected="2"></pop-menu>
  </div>
</template>

<script>
import { XTextarea ,Group, XButton ,ButtonTab, ButtonTabItem ,TransferDom} from "vux";
import PopMenu from '@/components/PopMenu'
import global from '@/components/Global';
export default {
  directives: {
    TransferDom
  },
  name:'Ask',
  components:{
    XTextarea,
    Group,
    XButton,
    ButtonTab,
    ButtonTabItem,
    PopMenu
  },
  created(){
    this.initData();
  },
  methods:{
    initData(){
      let userInfo = JSON.parse(window.localStorage.getItem('userInfo'));
      this.$http.get('patients',{params:{'PatientSearch[wechat_user_id]':userInfo.id}})
        .then(response=>{
          if(response.data.items.length == 0){
            this.$vux.alert.show('请先登录再进行提问')
            this.$router.replace({name:'login-password'})
          }else{
            this.patient_id = response.data.items[0].id
          }
        }).catch(error=>{
          console.log(error);
        })
    },
    submitForm(){
      if(!this.formdata.content){
        this.$vux.toast.text('请填写问题内容');
      }else{
        this.formdata.config_id = global.configId
        this.formdata.status = '不展示'
        this.formdata.patient_id = this.patient_id
        this.$http.post('questions',this.formdata)
          .then(response=>{
            if(response.status == '201'){
              this.$vux.alert.show({
                title: '提示',
                content: '发送成功',
                onHide :(()=>{
                  this.$router.replace({name:'help-question'})
                })
              })
            }
          }).catch(error=>{
            console.log(error);
          })
      }
    },
    changePage(url){
      this.$router.push({name:url})
    },
    changeCate(url){
      let userInfo = JSON.parse(window.localStorage.getItem('userInfo'));
      this.$http.get('patients',{params:{'PatientSearch[wechat_user_id]':userInfo.id}})
        .then(response=>{
          if(response.data.items.length == 0){
            this.$vux.alert.show('请先在我要报到登录')
          }else{
            this.$router.push({name:url})
          }
        }).catch(error=>{
          console.log(error);
        })
    }
  },
  data(){
    return {
      patient_id : null,
      formdata:{
        config_id :'',
        status:'',
        patient_id : ''
      }
    }
  }
}
</script>

<style lang="less">
@import '~@/style/base.less';
.help-tab {
  margin: 6px;
  &.vux-button-group > a {
    .iconfont {
      margin-right: 3px; font-size: 1.6rem; vertical-align: -1px;
    }
    &.vux-button-group-current {
      color: #fff; background: @red;
    }
  }
}
</style>