<template>
  <div class="member-center">
    <div class="banner">
      <div class="banner-img">
        <img src="../../assets/kv.jpg" alt="">
      </div>
    </div>    
    <group class="mylogin" label-margin-right="2em" label-width="5em">
      <x-input :required="true" is-type="china-name" name="realname" v-validate="'required'" v-model.trim="formdata.realname" title="姓名" placeholder="请输入姓名"></x-input>
      <x-input :required="true" is-type="china-mobile" name="mobile" v-validate="'required|digits:11'" v-model.trim="formdata.mobile" title="手机号码" placeholder="请输入手机号码" keyboard="number"></x-input>
      <x-input :required="true"  name="department" v-validate="'required'" v-model.trim="formdata.department" title="工作单位" placeholder="请输入工作单位"></x-input>
      <!-- <x-input :required="true"  name="duty" v-validate="'required'" v-model.trim="formdata.duty" title="职务" placeholder="请输入职务"></x-input> -->
      <selector :required="true" v-validate="'required'"  name="duty"  v-model="formdata.duty" title="职务" :options="dutyList"  placeholder="请选择职务"></selector>
      <x-address  :required="true" v-validate="'required'"  name="apart" title="地区" v-model="formdata.place" :list="addressData"  placeholder="请选择地址"   value-text-align="left" @on-shadow-change="getName" inline-desc="选择省市区" ></x-address>
      <x-input :required="true"  v-validate="'required'"  name="address"   v-model="formdata.address" title="详细地址" placeholder="请输入详细地址" ></x-input>
      <x-input :required="true" name="verifycode" v-validate="'required|digits:6'" v-model="formdata.verifycode" title="验证码" class="weui-cell_vcode" placeholder="输入验证码" keyboard="number">
        <x-button slot="right" type="primary" mini plain style="margin:8px" :disabled="btnDisabled" @click.native="sendVerifycode()">{{btnText}}</x-button>
      </x-input>
    </group>
    <div v-transfer-dom>
      <popup v-model="show" max-height="75%">
          <div class="weui-article popup0" style="background: #fff;">
            <h1>
                里程助手申请须知
            </h1>
            <section style="text-align:justify">
                <p>中华社会救助基金会于2018年1月发起心里程公益项目II期，为方便急性冠脉综合征患者，以及合并高危因素的既往心梗史患者申请心里程公益项目II期，特开通里程助手线上申请，里程助手申请通过后，可协助患者进行线上申请。</p>
                <p>里程助手申请时需注意以下须知：</p>
                <p>1、患者均为自愿申请并参加本项目， 不以买赠推广、传递虚假信息等其他形式诱导患者参与项目。</p>
                <p>2、本项目为公益项目，在协助申请的各个环节中，将采用面对面协助患者进行申请，不向患者以申请项目为名索要额外费用或物品。</p>
                <p>3、本项目所有的申请资料均需由患者自行准备，不得干预申请表格的填写，或为帮助患者顺利通过审核而伪造虚假信息。</p>
                <p>4、项目办将对患者的入组申请做出最终的审批，是否需要补充资料、是否通过均由项目办通知患者本人，不得向患者作出任何有关项目审批结果的承诺。</p>
                <p>5、所有项目相关的援助流程及标准均由基金会及项目办统一发出，不得以非正规渠道或内部培训内容的名义告知患者任何不切实际的援助方案或援助信息。</p>
                <p>6、对所涉及的患者信息（包括但不限于患者个人/家庭信息、工作信息、治疗信息、用药信息等），均需严格保密，不得以任何形式收集或泄露给第三方。。</p>
                <p>7、不做有损项目办或基金会名誉的事情。项目办作为监督及管理部门，对我的工作进行定期的监察，如发现有违背上述注意事项的行为，情节严重的将追究其法律责任。</p>
                <label for="weuiAgree" class="weui-agree" style="text-align:center;margin-top:20px">
                    <input id="weuiAgree" type="checkbox" @click="changeAccess()" class="weui-agree__checkbox">
                    <span class="weui-agree__text zpsm-red">
                      <a href="javascript:;">我已阅读《里程助手申请须知》</a>
                    </span>
                </label>
            </section>
          </div>
      </popup>
    </div>
    <div style="padding: 0 45px;margin-top:10px">
      <x-button type="warn" @click.native="submitForm()">申请成为里程助手</x-button>
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
XButton, XProgress, Panel, Divider,Popup,TransferDom,XAddress,
ChinaAddressV4Data,Value2nameFilter as value2name,Selector } from 'vux'
import { Carousel, Slide } from 'vue-carousel';
import global from '@/components/Global'


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
    XAddress,
    Selector
  },
  name:'Login',
  created(){
    this.initData()
  },
  methods: {
    initData(){
      this.addressData = ChinaAddressV4Data
    },
    popup(){
      this.show = true;
    },
    changeAccess(){
      this.access = !this.access
      this.show = false
    },
    sendVerifycode(){
      if(!this.formdata.mobile){
        this.$vux.toast.text('请输入手机号码')
        return false;
      }else if(this.formdata.mobile.length<11){
        this.$vux.toast.text('请输入正确的手机号码')
        return false;
      }else{
        this.$http.post('patient/sendverifycode',{'mobile':this.formdata.mobile,'SmsType':'3','config_id':global.configId})
          .then(response=>{
            console.log(response)
            this.startTimer();
          }).catch(error=>{
            console.log(error)
            this.$vux.toast.text(error.response.data.message);
          })
      } 
    },
    startTimer(){
      this.btnDisabled =true
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
    },
    getName (value) {
      let data = value2name(value, this.addressData)
      let arr = data.split(''),index = arr.indexOf(' ')
      let province = '',city = '',county = ''
      let arr_remain = arr.splice(index+1)
      let remain_index = arr_remain.indexOf(' ')
      for (let i = 0; i < arr.length; i++) {
        if(i<index){
          province += arr[i]
        }
      }
      for (let j = 0; j < arr_remain.length; j++) {
        if(j<remain_index){
          city += arr_remain[j]
        }else if(j>remain_index){
          county  += arr_remain[j]
        }
      }        
      //定义表单省市 
      this.formdata.province = province
      this.formdata.city = city
      this.formdata.county = county
    },
   submitForm(event) {
      this.$validator.validateAll().then((result) => {
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
          this.formdata.config_id = global.configId
          this.$http.post('empower/login',this.formdata)
            .then(response=>{
              if(response.data.status == 'success'){                
                this.$router.push({name:'assist-detail'})
              }
            }).catch(error=>{
              this.$vux.toast.text(error.response.data.message);
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
      btnText:'获取验证码',
      timer: null,
      btnDisabled: false,
      show:false,
      access:false,
      addressData: [],
      dutyList:['医生','护士','药师','其它']
    }
  },
}
</script>

<style lang='less'>
@import '~vux/src/styles/weui/widget/weui-agree/weui-agree';
@import '~vux/src/styles/weui/widget/weui_page/weui_article';
@import '~@/style/base.less';
</style>
