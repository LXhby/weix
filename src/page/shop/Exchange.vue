<template>
  <div class="member-center">
    <div class="page__hd">
      <h1 class="page__title" style="text-align: center; font-size: 1.8rem;">请输入积分兑换礼品邮寄地址</h1>
    </div>
    <group class="myform" label-margin-right="2em" label-width="5em">
      <x-input :required="true" is-type="china-name" readonly name="name"  v-model="formdata.name" title="姓名" placeholder="请输入姓名" ></x-input>
      <x-input :required="true"  is-type="china-mobile" readonly name="mobile" v-validate="'required|digits:11'" v-model.trim="formdata.mobile" title="联系方式" placeholder="请输入手机号码" keyboard="number"></x-input>
      <x-address  :required="true" v-validate="'required'"  name="apart" title="地区" v-model="formdata.place" :list="addressData"  placeholder="请选择地址"   value-text-align="left" @on-shadow-change="getName" inline-desc="选择省市区" ></x-address>
      <x-input :required="true"  v-validate="'required'"  name="address"   v-model="formdata.address" title="详细地址" placeholder="请输入详细地址" ></x-input>
    </group>
    <div style="padding: 0 45px;margin-top:10px">
      <x-button type="warn" :disabled="submitBtnDisabled" @click.native="submitForm()">提交</x-button>
    </div>
  </div>
</template>

<script>
import { GroupTitle,Group,XInput, 
 XButton, XProgress, Divider,Selector,Datetime,XAddress, 
 ChinaAddressV4Data,Value2nameFilter as value2name,} from 'vux'
import global from '@/components/Global'

export default {
  components: {
    Group,XButton,XProgress,
    Divider,GroupTitle,
    XInput,Selector,Datetime,
    XAddress,
  },
  name:'Exchange',

  created(){
    this.initData()
  },
  methods: {
    initData(){
      let userInfo = JSON.parse(window.localStorage.getItem('userInfo'))
      this.$http.get('patients',{params:{'PatientSearch[wechat_user_id]':userInfo.id,expand:'order'}})
        .then(response=>{
          //初始化用户信息
          let info = response.data.items[0]
            this.formdata={
              name : info.name,
              mobile:info.mobile,
            }
            this.addressData = ChinaAddressV4Data
            if(response.data.items[0].order.length>0){
              let order = response.data.items[0].order
              this.formdata.place = [order[0].province,order[0].city,order[0].county]
              this.formdata.address = order[0].address
            }
        }).catch(error=>{
          console.log(error)
        })
      //隐藏菜单
      this.$wechat.ready(()=>{
        this.$wechat.hideAllNonBaseMenuItem();
      })
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
          this.submitBtnDisabled = true
          this.formdata.gift_id = this.$route.params.gift_id
          this.formdata.patient_id = this.$route.params.patient_id
          this.formdata.price = Number(this.$route.params.price)*Number(this.$route.params.num)
          this.formdata.num = this.$route.params.num
          this.$http.post('orders',this.formdata)
            .then(response=>{
              if(response.status == '201'){
                this.$vux.alert.show('兑换成功')
                this.$router.replace({name:'shop'})
              }
            }).catch(error=>{
              console.log(error);
            })
        }else{
          console.log(this.validateErrors.all())
          this.$vux.toast.text('请完善表单信息后再提交');
          return false;
        }
      })
    },
  },
 data () {
    return {
      formdata: {
        name:'',
        mobile:'',  
        province:'',
        city:'',
        county:'',
        address:'',
      },
      addressData: [],
      submitBtnDisabled:false,
    }
  },
}
</script>

<style lang='less'>
@import '~@/style/base.less';

.page__hd {
  padding: 40px 40px 20px;
  .page__title {
    font-size: 2rem; font-weight: 400;
  }
  .page__desc {
    margin-top: 5px; color: #444; font-size: 1.6rem;
  }
}

</style>
