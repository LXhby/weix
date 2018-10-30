<template>
  <div class="myques page">
    <ques-list :queslist="list" :infinite="true" @infinite="infiniteHandler"></ques-list>
    <!-- <div class="page-hd" v-transfer-dom>
      <button-tab class="help-tab">
        <button-tab-item @on-item-click="changePage('help-question')" selected><i class="iconfont wxicon-ques1"></i>精华提问</button-tab-item>
        <button-tab-item @on-item-click="changeCate('help-ask')"><i class="iconfont wxicon-help"></i>我要提问</button-tab-item>
        <button-tab-item @on-item-click="changeCate('help-mine')" selected><i class="iconfont wxicon-ques2"></i>我的问题</button-tab-item>
      </button-tab>
    </div> -->
    <pop-menu selected="3"></pop-menu>
  </div>
</template>

<script>
import { Flexbox, FlexboxItem, XButton ,TransferDom ,ButtonTab, ButtonTabItem} from 'vux'
import QuesList from '@/components/QuesList'
import PopMenu from '@/components/PopMenu'
import global from "@/components/Global";
import InfiniteLoading from 'vue-infinite-loading';

export default {
    directives: {
        TransferDom
    },
  components: {
    Flexbox,
    FlexboxItem,
    XButton,
    QuesList,
    InfiniteLoading,
    ButtonTab,
    ButtonTabItem,
    PopMenu
  },
  name:'Mine',
  beforeCreate(){
    this.checkIdentity
  },
  methods:{
    checkIdentity(){
      let userInfo = JSON.parse(window.localStorage.getItem('userInfo'));
      this.$http.get('patients',{params:{'PatientSearch[wechat_user_id]':userInfo.id}})
        .then(response=>{
          if(response.data.items.length == 0){
            this.$vux.alert.show('请先在我要报到登录')
            this.$router.replace({name:'login-password'})
          }else{
            this.patient_id = response.data.items[0].id
          }
        }).catch(error=>{
          console.log(error);
        })
    },
    initData($state){
      let userInfo = JSON.parse(window.localStorage.getItem('userInfo'));
      this.$http.get('patients',{params:{'PatientSearch[wechat_user_id]':userInfo.id}})
        .then(response=>{
          if(response.data.items.length != 0){
            this.$http.get('questions',{
            params:{
              'QuestionSearch[config_id]':global.configId,
              'expand':'patient,user',
              'QuestionSearch[patient_id]':response.data.items[0].id,
              sort: '-id',page:this.page,'per-page':10
            }
            })
            .then(response=>{
              response.data.items.forEach(element=>{
                this.list.push({
                  avatar:element.user.headimgurl,
                  user: element.patient.name,
                  title: element.content,
                  time: element.created_at,
                  reply: element.answer,
                  recommend: element.is_good,
                })
              })
              if($state){
                  if(response.data._meta.pageCount > 0) {
                      $state.loaded()
                  }
                  if(response.data._meta.currentPage >= response.data._meta.pageCount){
                      $state.complete()
                  }
                }
              this.page++
            }).catch(error=>{
              console.log(error);
            })
          }
        }).catch(error=>{
          console.log(error);
        })
    },
    infiniteHandler($state) {
      console.log('infiniteHandler')
      console.log($state)
      this.initData($state)
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
  data () {
    return {
        page:1,
        list: [],
        patient_id:''
    }
  },
}
</script>

<style lang="less">
@import '~@/style/base.less';

</style>

