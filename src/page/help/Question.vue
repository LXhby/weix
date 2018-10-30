<template>
  <div class="myques">
    <ques-list :queslist="list" :infinite="true" @infinite="infiniteHandler"></ques-list>
    <!-- <div class="page-hd" v-transfer-dom>
      <button-tab class="help-tab">
        <button-tab-item @on-item-click="changePage('help-question')" selected><i class="iconfont wxicon-ques1"></i>精华提问</button-tab-item>
        <button-tab-item @on-item-click="changeCate('help-ask')"><i class="iconfont wxicon-help"></i>我要提问</button-tab-item>
        <button-tab-item @on-item-click="changeCate('help-mine')" ><i class="iconfont wxicon-ques2"></i>我的问题</button-tab-item>
      </button-tab>
    </div> -->
    <pop-menu selected="1"></pop-menu>
    <div class="terms">
      <p>【声明】</p>
      <p>我们对公众号上所有内容的编辑非常谨慎，并将做持续的内容更新。本微信上的信息不能代替专业的医疗专业建议。此外，我们不对在本微信上发布的第三方文本负责，个人作者对其作品负责。我们不对因使用此类信息所导致的损失承担任何责任。</p>
      <p>本公众号任何内容旨在向患者提供公益项目信息，不涉及任何药品广告或宣传推广。本网站或公众号上的信息仅作为知识提供，不得取代医生或其他有资质的医疗专业人士提供的医疗建议和医疗咨询。本微信上的信息不用于疾病的诊断。</p>
      <p>【使用权】</p>
      <p>中华社会救助基金会医基金-心里程公益项目是本公众号中的全部内容（包括原创内容及原创图片）的专有权利的所有者。所有文本和插图受版权保护。您可以记录我们的信息，并加载到您的主存储器中。您可以转载，但请标明出处。如需要打印，打印版仅供您自己使用；禁止作其他用途，尤其是商业用途。与商标、版权、专利等有关的任何权利或许可证不得授予用户。</p>
      <p>【超链接】</p>
      <p>除自有信息外，我们亦可能提供第三方网站链接。第三方网站的内容和设计超出我们的控制。我们不确保第三方网站上的信息准确或正确。这些链接亦不代表对链接网站之内容的认可、支持或确认。链接网站的个人作者对网页上的信息、意见和事实负责。同样，我们不对链接与目标页面的技术安全负责。因此，我们不对使用这些超链接中包含之信息或使用超链接所导致的任何损失负责。</p>
    </div>
  </div>
</template>

<script>
import { Flexbox, FlexboxItem, XButton ,TransferDom, ButtonTab, ButtonTabItem } from 'vux'
import QuesList from '@/components/QuesList'
import PopMenu from '@/components/PopMenu'
import global from "@/components/Global";
import InfiniteLoading from 'vue-infinite-loading';
import Head from "@/assets/new_head.jpeg";

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
  name:'Question',
  created(){
  },
  methods:{
    initData($state){
      this.$http.get('questions',{
        params:{
          'QuestionSearch[config_id]':global.configId,
          'expand':'patient,user',
          'QuestionSearch[status]':'展示',
          sort: '-id',page:this.page,'per-page':10
        }
        })
        .then(response=>{
          response.data.items.forEach(element=>{
            this.list.push({
              avatar:Head,
              user: '提问人',
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
    },
    infiniteHandler($state) {
      console.log($state);
      this.initData($state)
    },
    // changePage(url){
    //   this.$router.push({name:url})
    // },
    // changeCate(url){
    //   let userInfo = JSON.parse(window.localStorage.getItem('userInfo'));
    //   this.$http.get('patients',{params:{'PatientSearch[wechat_user_id]':userInfo.id}})
    //     .then(response=>{
    //       if(response.data.items.length == 0){
    //         this.$vux.alert.show('请先在我要报到登录')
    //       }else{
    //         this.$router.push({name:url})
    //       }
    //     }).catch(error=>{
    //       console.log(error);
    //     })
    // },
  },
  data () {
    return {
        page:1,
        list: [],
    }
  },
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

.terms {
  font-size:11px; color: #333; line-height: 150%; padding: 10px;
  p {margin-bottom: 10px;}
}
</style>

