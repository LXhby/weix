<template>
  <div class="page with-ft with-hd">
    <div class="page-hd">
      <my-search @search="changePatient"></my-search>
    </div>
    <div v-if="tip" class="weui-cells__title">因您的申请暂未通过，暂时无法进行患者绑定，请耐心等待审核结果，如有疑问，请联系心里程公益项目II期办公室<a href="tel:4000-822-072" style="color:#ccc">4000-822-072</a></div>
    <div class="weui-cells__title">已经申请过的患者</div>
    <patient-list @clear = "reducePatient"  @upload = "uploadMileage" :patientlist="list" @infinite="infiniteHandler" style="margin-top: 0;" ></patient-list>
    <div class="page-ft" v-if="flag" v-transfer-dom>
      <x-button type="warn" @click.native="newPatient()">新增患者绑定</x-button>
    </div>
  </div>
</template>
<script>
    import PatientList from '@/components/PatientList'
    import MySearch from '@/components/MySearch'
    import { XButton, Group,TransferDom } from "vux";
    import global from '@/components/Global'
    import qs from 'qs'

    export default {
        directives: {
            TransferDom
        },
        components: {
            PatientList,
            MySearch,
            Group,
            XButton,
        },
        name: 'Detail',
        created(){
            this.initData()
            // this.fetchPage()
        },
        methods:{
            initData(){
                let userInfo = JSON.parse(window.localStorage.getItem('userInfo'))
                this.$http.get('empowers', {params: {'expand': 'user', 'EmpowerSearch[wechat_user_id]':userInfo.id}})
                  .then(response=>{
                    if(response.data.items == ''){
                        this.$router.push({name:'assist-login'})
                    }else{
                        console.log(response.data.items[0].status);
                        if(response.data.items[0].status == '审核通过'){
                            this.flag = true;
                        }else{
                            this.tip = true;
                        }
                    }
                  }).catch(error=>{
                      console.log(error);
                  });
            },
            infiniteHandler($state) {
                this.fetchPage($state);
            },
            fetchPage($state){
                let userInfo = JSON.parse(window.localStorage.getItem('userInfo'))
                this.$http.get('patients',{params:{'PatientSearch[em_user_id]':userInfo.id,page:this.page,'per-page': 10}})
                  .then(response=>{
                      console.log(userInfo.id)
                      this.total = response.data._meta.totalCount;
                      response.data.items.forEach(element=>{
                        this.list.push(element);
                      })
                      if($state){
                          if(response.data._meta.pageCount > 0){
                            $state.loaded();
                          }
                          if (response.data._meta.currentPage >= response.data._meta.pageCount) {
                            $state.complete();
                            }
                      }
                      this.page++;
                      console.log(this.list)
                  }).catch(error => {
                      console.log(error);
                  })
            },
            reducePatient(item,index){
                this.$vux.confirm.show({
                    title: '确认移除？',
                    content: '患者'+item.name+'的信息将从列表 移除',
                    onConfirm:()=> {
                      this.$vux.loading.show()
                      this.$http.put('patients/'+item.id,{em_user_id:''})
                        .then(response=>{
                            if(response.data.em_user_id == ''){
                                this.$http.post('pap/relieve-patient',item)
                                    .then(response=>{
                                        this.$vux.loading.hide()
                                        this.list.splice(index,1)
                                    }).catch(error=>{
                                        this.$vux.loading.hide()
                                        console.log(error)
                                    })
                            }                            
                        }).catch(error=>{
                            console.log(error);
                        })
                    }
                })
            },
            newPatient(){
                this.$router.push({name:'assist-bind'})
            },
            changePatient(val){
                let userInfo = JSON.parse(window.localStorage.getItem('userInfo'))
                this.list = []
                this.$http.get('patients',{params:{'PatientSearch[name_mobile]':val,'PatientSearch[em_user_id]':userInfo.id}})
                  .then(response=>{
                    response.data.items.forEach(element=>{
                      this.list.push(element);
                    })
                  }).catch(error => {
                      console.log(error);
                  })
            },
            uploadMileage(item){
                this.$vux.loading.show()
                //获取pap中的信息
                this.$http.post('pap/check-patient', {name:item.name,mobile:item.mobile}).then(response=>{
                    let pap_info = response.data
                    switch (response.data.status) {
                        //pap中没有信息
                        case global.NEW_PATIENT:
                            this.$vux.loading.hide()
                            this.$router.push({name:'register-empower',params:{id:item.id}})
                        break;
                        case global.CHECK_IN_WECHAT:
                            let userInfo = JSON.parse(window.localStorage.getItem('userInfo'));
                            //核对患者是否已解绑
                            if(item.em_user_id != userInfo.id){
                                this.$vux.loading.hide()
                                this.$vux.alert.show('患者'+item.name+'已不在绑定列表,请刷新页面')
                                return false;
                            }
                            if(pap_info.model.status != '初始'){
                                this.$vux.loading.hide()
                                this.checkPhase(pap_info)
                            }else if(pap_info.model.status == '初始'){
                                if(pap_info.model.statusing == '申请中' || pap_info.model.statusing == '' || pap_info.model.statusing == '待初审'){
                                    this.$vux.loading.hide()
                                    this.$router.push({
                                        name:'patient-upload',
                                        params:{'patient_id':pap_info.id}
                                    })
                                }else if(pap_info.model.statusing == '初审驳回'){
                                    this.$vux.loading.hide()
                                    this.$vux.alert.show('患者'+item.name+'的初审未能通过，请修改资料后重新提交')
                                    this.$router.push({name:'register-empower',params:{id:item.id}})
                                }else if(pap_info.model.statusing == '补充资料未审核' || pap_info.model.statusing == '补充资料已审核'){
                                    this.$vux.loading.hide()
                                    this.$router.push({
                                        name:'patient-upload',
                                        params:{'patient_id':pap_info.id}
                                    })
                                }else if(pap_info.model.statusing == '初审通过'){
                                    this.$vux.loading.hide()
                                    this.$router.push({
                                        name:'patient-upload',
                                        params:{'patient_id':pap_info.id}
                                    })
                                }
                            }          
                        break;
                    }
                }).catch(error => {
                    console.log(error);
                })
            },
            checkPhase(pap_info){
                if(pap_info.phase){
                    if(pap_info.model.status == '在组'){
                        this.$router.push({name:'patient-phase',params:{id:pap_info.id}})
                    }else if(pap_info.model.status == '出组' || pap_info.model.status == '归档'){
                        this.$vux.alert.show('患者'+pap_info.model.name+'当前状态为'+pap_info.model.status+',无法继续操作')
                    }
                    else{
                        switch (pap_info.phase.status) {
                            case '已拒绝':
                                this.$vux.alert.show('患者'+pap_info.model.name+'的审核未能通过，无法继续操作')
                                return false;
                                break;
                            case '资料不全':
                                this.$router.push({name:'patient-check',params:{'patient_id':pap_info.model.id}})
                                return false;
                                break;
                            case '里程完毕待审核':
                                this.$vux.alert.show('患者'+pap_info.model.name+'已经提交过入组审核资料，等待项目办审核')
                                return false;
                                break;
                            default:
                                this.$router.push({
                                    name:'patient-upload',
                                    params:{'patient_id':pap_info.model.id}
                                })
                                break;
                        }
                    }
                }else{
                    this.$router.push({
                        name:'patient-upload',
                        params:{'patient_id':pap_info.id}
                    })
                }
            }
        },
        data () {
            return {
                list: [],
                flag:false,
                tip:false,
                page:1,
            }
        }
    }
</script>

<style lang="less">
  .banner-box {
    width: 100%; overflow: hidden;
  }
  .record-banner {
    position: relative; margin: 10px 15px; height: 0; padding-top: 32%; overflow: hidden; background: center center no-repeat; background-size: 100% 100%;
    .banner-text {
      position: absolute; top: 50%; left:54px; margin-top: -30px; color: #fff; font-size: 14px; line-height: 20px;
      p {
        font-weight: bold; font-size: 36px; line-height: 1.33;
      }
    }
  }
</style>