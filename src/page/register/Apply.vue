<template>
  <div class="member-center">
    <group class="myform" label-margin-right="2em" label-width="5em">
      <x-input :required="true"   v-model="formdata.name" title="姓名" placeholder="请输入姓名" ></x-input>
    </group>
    <group class="myform" label-margin-right="2em" label-width="5em">
      <selector v-model="formdata.id_type" title="证件类型" :options="typeList"></selector>
    </group>
    <group class="myform" label-margin-right="2em" label-width="5em">
      <x-input :required="true"  :class="this.errorClass" name="idsn"  @on-blur="checkidsn"  v-model="formdata.idsn" title="证件号码" placeholder="请输入证件号码" ></x-input>
    </group>
     <!-- <group class="myform" label-margin-right="2em" label-width="5em">
      <datetime  :min-year="minYear" title="出生日期" v-model="formdata.birthdate" placeholder="请选择时间"></datetime>
    </group> -->
    <group class="myform" label-margin-right="2em" label-width="5em">
      <x-input :required="true"  is-type="china-mobile" readonly name="mobile" v-validate="'required|digits:11'" v-model.trim="formdata.mobile" title="手机号码" placeholder="请输入手机号码" keyboard="number"></x-input>
    </group>
    <group class="myform" label-margin-right="2em" label-width="7.5em" title="请按顺序选择省市、医院、医生、药房">
      <x-address :required="true" v-validate="'required'"  title="项目所属省市" v-model="formdata.place" placeholder="请选择省市" value-text-align="left" raw-value :list="addressData" hide-district @on-hide="getName" style="white-space: nowrap;"></x-address>
    </group>
    
    <group class="myform" label-margin-right="2em" label-width="5em">
      <selector :required="true" v-validate="'required'" @on-change="fetchDoctor" v-model="formdata.hospital_id" title="项目医院" :options="hospitalList"></selector>
    </group>
    <group class="myform" label-margin-right="2em" label-width="5em">
      <selector :required="true" v-validate="'required'" v-model="formdata.doctor_id" title="项目医生"  :options="doctorList"></selector>
    </group>
    <group class="myform" label-margin-right="2em" label-width="5em">
      <cell :title="'领药药房'"  is-link @click.native="showDrugstore=!showDrugstore" :value="drugstore"></cell>
    </group>
    <divider>注册身份</divider>
    <checker :required="true" v-validate="'required'" v-model="formdata.identity" default-item-class="demo1-item" selected-item-class="demo1-item-selected">
      <checker-item value="患者本人">患者本人</checker-item>
      <checker-item value="亲友">亲友</checker-item>
    </checker>
    <div style="padding: 0 45px;margin-top:10px">
      <x-button type="warn"  :disabled="submitBtnDisabled" @click.native="submitForm()">提交</x-button>
    </div>

    <div v-transfer-dom>
      <popup v-model="showDrugstore"  height="40%">
        <popup-header :left-text="'取消'" :right-text="'确定'" :title="'选择领药药房'" @on-click-right="changeDrugstore" @on-click-left="showDrugstore=false"></popup-header>
         <group class="myform" label-margin-right="2em" label-width="7.5em" title="">
            <x-address   title="药房所属省市" v-model="drugstoreData.place" placeholder="请选择省市" value-text-align="left" :popup-style="{zIndex: 502}" raw-value :list="addressData" hide-district @on-hide="getDrugstoreName" style="white-space: nowrap;"></x-address>
        </group>
        <group class="myform" label-margin-right="2em" label-width="5em">
          <selector  v-model="temp_drugstore_id" title="领药药房"  :options="drugstoreList"></selector>
        </group>
      </popup>
    </div>
  </div>
</template>

<script>
import { GroupTitle,Group,Cell,CellBox,XInput, Swiper, SwiperItem, TransferDom,Popup,PopupHeader,
 XButton, XProgress, Panel, Divider,Selector,Datetime,XAddress, 
 ChinaAddressV4Data,Value2nameFilter as value2name,Radio,Checker, CheckerItem,Picker } from 'vux'
import { Carousel, Slide } from 'vue-carousel';
import global from '@/components/Global'
import qs from 'qs'


export default {
  components: {
    Group,Cell,Swiper,
    SwiperItem,XButton,XProgress,
    Panel,Divider,Carousel,
    Slide,GroupTitle,CellBox,
    XInput,Selector,Datetime,
    XAddress,Radio,Datetime,
    Checker,CheckerItem,Picker,Popup,PopupHeader
  },
  name:'Apply',
  directives: {
    TransferDom
  },
  created(){
    this.initData()
  },
  methods: {
    // check(){
    //   console.log(this.formdata.drugstore_id)
    // },
    initData(){
      let userInfo = JSON.parse(window.localStorage.getItem('userInfo'))
      this.$http.get('patients',{params:{'PatientSearch[wechat_user_id]':userInfo.id}})
        .then(response=>{
          console.log(response)
          //初始化用户信息
          let info = response.data.items[0]
          if(info.papid){
            //获取pap中对应信息
            this.getPapInfo(info)
          }else{
            this.formdata={
              name : info.name,
              mobile:info.mobile,
              id_type:'身份证'
            }
            //获取省市值
            this.getProvinceCity()
          }
        }).catch(error=>{
          console.log(error)
        })
    },
    getProvinceCity(){
      let data = {}
      this.$http.post('pap/get-province-city', data)
        .then(response=>{
          this.addressData = response.data
        }).catch(error => {
          console.log(error);
        });;
    },
    //获取pap信息
    getPapInfo(info){
      this.$http.post('pap/check-patient',{name:info.name,mobile:info.mobile})
        .then(response=>{
          console.log(response);
          let pap_info = response.data
          this.formdata = pap_info.model
          this.formdata.hospital_id = pap_info.hospital.id
          this.formdata.drugstore_id = pap_info.model.drugstore_id
          //设置省市信息
          this.setAddress(pap_info)
          this.fetchHospital(pap_info.province,pap_info.city)
          this.getAllDrugstore(pap_info.model.drugstore_id)
          
        }).catch(error=>{
          console.log(error);
        })
    },
    //设置省市值
    setAddress(pap_info){
      let data = {}
      this.$http.post('pap/get-province-city', data)
        .then(response=>{
          this.addressData = response.data
          let place = [pap_info.model.province,pap_info.model.city]
          this.formdata.place = place
        }).catch(error => {
          console.log(error);
        });;
    },
    //获取项目医院，医生，药房
    fetchHospital(province,city){
      let data = {}
      this.$http.post('pap/get-hospital', {'province':province, 'city':city}).then(response=>{
        this.hospitalList = []
        response.data.forEach(Element=>{
          this.hospitalList.push({
            key:Element.id,
            value:Element.name
          })
        })
        this.hospitalList.unshift({
          key:'',
          value:'请选择项目医院'
        })
      }).catch(error => {
        console.log(error);
      });;
    },
    //获取医生
    fetchDoctor(){
      if(this.formdata.hospital_id>0){
        this.$http.post('pap/get-doctor', {'hospital_id':this.formdata.hospital_id}).then(response=>{
        this.doctorList = []
          response.data.forEach(Element=>{
            this.doctorList.push({
              key:Element.id,
              value:Element.name
            })
          })
          this.doctorList.unshift({
            key:'',
            value:'请选择项目医生'
          })
        }).catch(error => {
          console.log(error);
        });;
      }     
    },
    //获取药房
    fetchDrugstore(province,city){
      this.$vux.loading.show({
        text: '正在加载药房'
      })
      this.$http.post('pap/get-drugstore', {'province':province, 'city':city}).then(response=>{
        this.$vux.loading.hide()
        this.drugstoreList = []
        response.data.forEach(Element=>{
          this.drugstoreList.push({
            key:Element.id,
            value:Element.name
          })
        })
        this.drugstoreList.unshift({
          key:'',
          value:'请选择项目药房'
        })
      }).catch(error => {
        console.log(error);
      });;
    },
    getAllDrugstore(pap_drugstore_id){
      this.$http.post('pap/get-drugstore', {}).then(response=>{
        response.data.forEach(Element=>{
          if(Element.id == pap_drugstore_id ){
            this.drugstore = Element.name
          }
          })
      }).catch(error => {
        console.log(error);
      });;
    },
    getName (value) {
      if(!this.formdata.place || !this.addressData || this.addressData.length ===0) return;
      let data = value2name(this.formdata.place, this.addressData)
      let arr = data.split(''),index = arr.indexOf(' ')
      let province = '',city = ''
      for (let i = 0; i < arr.length; i++) {
        if(i<index){
          province += arr[i]
        }else if(i>index){
          city += arr[i]
        }
      }    
      //定义表单省市 
      this.formdata.province = province    
      this.formdata.city = city
      this.fetchHospital(province,city)
      // this.fetchDrugstore(province,city)
    },
    getDrugstoreName (value) {
      if(!this.drugstoreData.place || !this.addressData || this.addressData.length ===0) return;
      let data = value2name(this.drugstoreData.place, this.addressData)
      let arr = data.split(''),index = arr.indexOf(' ')
      let province = '',city = ''
      for (let i = 0; i < arr.length; i++) {
        if(i<index){
          province += arr[i]
        }else if(i>index){
          city += arr[i]
        }
      }    
      //定义表单省市 
      this.drugstoreData.province = province    
      this.drugstoreData.city = city
      // this.fetchHospital(province,city)
      this.fetchDrugstore(province,city)
    },
    changeDrugstore(){
    this.showDrugstore = false
    this.formdata.drugstore_id = this.temp_drugstore_id
      this.drugstore = '请选择领药药房'
      this.drugstoreList.forEach(Element=>{
         if(Element.key == this.formdata.drugstore_id){
           this.drugstore = Element.value
         }
       })
    },
    checkidsn(value){
      if(!isIdCardNo(value)){
        this.$vux.toast.text('请输入正确的证件号码')
        this.errorClass = 'weui-cell_warn'
        this.idcheck = false;
      }else{
        this.formdata.birthdate = getBirthById(value)
        this.formdata.gender = getSexById(value)
        this.errorClass = ''
        this.idcheck = true
      }
    },
    submitForm(event) {
      let hospital = []
      this.hospitalList.forEach(element=>{
        hospital.push(element.key)
      })
      let doctor = []
      this.doctorList.forEach(element=>{
        doctor.push(element.key)
      })
      // let drugstore = []
      // this.drugstoreList.forEach(element=>{
      //   drugstore.push(element.key)
      // })
      
      if(hospital.indexOf(this.formdata.hospital_id) == -1){
        this.$vux.toast.text('请选择医院')
        return false
      }else if(doctor.indexOf(this.formdata.doctor_id) == -1){
        this.$vux.toast.text('请选择医生')
        return false
      }else if(!this.formdata.drugstore_id){
        this.$vux.toast.text('请选择药房')
        return false
      }
      this.$validator.validateAll().then((result) => {
        //验证身份证号码
        this.checkidsn(this.formdata.idsn)
        if(result && this.idcheck){
          this.submitBtnDisabled = true
          this.formdata.mode_id = 1
          this.$http.post('pap/apply', this.formdata).then(response=>{
            if(response.data.status == 'create'){
              this.formdata.papid = response.data.id
              this.$http.post('patient/find-patient',this.formdata)
                .then(response=>{
                  if(response.data.status == 'LOGIN'){
                    this.submitBtnDisabled = false
                    this.$router.replace({name:'register-success'})
                  }
                }).catch(error=>{
                  this.submitBtnDisabled = false
                  console.log(error);
                })
            }else if(response.data.status == 'update'){
              this.submitBtnDisabled = false
              this.$router.replace({name:'register-success'})
            }else{
              this.submitBtnDisabled = false
              this.$vux.toast.text(response.data.status);
            } 
          }).catch(error => {
            this.submitBtnDisabled = false
            console.log(error);
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
      formdata: {
        province:'',
        city:'',
        gender:'',
        birthdate:'',
        drugstore_id:'',
      },
      drugstoreData:{
        province:'',
        city:'',
      },
      typeList:['身份证','军官证'],
      hospitalList:[],
      doctorList:[],
      drugstoreList:[],
      addressData: [],
      identity:['患者本人','家属'],
      errorClass:'',
      idcheck:false,
      minYear:1900,
      submitBtnDisabled:false,
      showDrugstore:false,
      temp_drugstore_id:'',
      drugstore:'',
    }
  },
}

 function isIdCardNo(idCard){
    //15位和18位身份证号码的正则表达式
    var regIdCard=/^(^[1-9]\d{7}((0\d)|(1[0-2]))(([0|1|2]\d)|3[0-1])\d{3}$)|(^[1-9]\d{5}[1-9]\d{3}((0\d)|(1[0-2]))(([0|1|2]\d)|3[0-1])((\d{4})|\d{3}[Xx])$)$/;
    //如果通过该验证，说明身份证格式正确，但准确性还需计算
    if(regIdCard.test(idCard)){
        if(idCard.length==18){
            var idCardWi=new Array( 7, 9, 10, 5, 8, 4, 2, 1, 6, 3, 7, 9, 10, 5, 8, 4, 2 ); //将前17位加权因子保存在数组里
            var idCardY=new Array( 1, 0, 10, 9, 8, 7, 6, 5, 4, 3, 2 ); //这是除以11后，可能产生的11位余数、验证码，也保存成数组
            var idCardWiSum=0; //用来保存前17位各自乖以加权因子后的总和
            for(var i=0;i<17;i++){
                idCardWiSum+=idCard.substring(i,i+1)*idCardWi[i];
                }
            var idCardMod=idCardWiSum%11;//计算出校验码所在数组的位置
            var idCardLast=idCard.substring(17);//得到最后一位身份证号码

            //如果等于2，则说明校验码是10，身份证号码最后一位应该是X
            if(idCardMod==2){
                if(idCardLast=="X"||idCardLast=="x"){
                    return true;
                    }else{
                        return false;
                }
            }else{
                //用计算出的验证码与最后一位身份证号码匹配，如果一致，说明通过，否则是无效的身份证号码
                if(idCardLast==idCardY[idCardMod]){
                    return true;
                }else{
                    return false;
                }
            }
      }
    }else{
        //alert("身份证格式不正确!");
        return false;
    }
  }
  function getBirthById(value) {
    if (!value) {
        return "";
    }
    var year = "1900";
    var month = "1";
    var day = "1";
    if (value.length == 15) {
        year = "19" + value.substr(6, 2);
        month = value.substr(8, 2);
        day = value.substr(10, 2);
    } else if (value.length == 18) {
        year = value.substr(6, 4);
        month = value.substr(10, 2);
        day = value.substr(12, 2);
    } else {
        return "";
    }  
    // if (newDate.toString() == "NaN") {
    //     return "";
    // } else {
        return year + "-" + month + "-" + day;
    // }
  }
  function getSexById(value) {
    if (!value) {
        return "未知";
    } else if (value.length == 15) {
        return parseInt(value.substr(14, 1)) % 2 ? "男" : "女";
    } else if (value.length == 18) {
        return parseInt(value.substr(16, 1)) % 2 ? "男" : "女";
    } else {
        return "未知";
    }
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
.demo1-item {
  border: 1px solid #ececec;
  padding: 5px 25px;
  font-size: 16px;
  margin-right:20px;
}
.demo1-item-selected {
  background: #ffffff url(/static/active.png) no-repeat right bottom;
  border: 1px solid red;
}

</style>
