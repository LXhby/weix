<template>
    <div class="member-center">
        <group class="mylogin" label-margin-right="2em" label-width="5em">
            <x-input :required="true" is-type="china-name" name="name"  v-model.trim="formdata.name" title="姓名" placeholder="患者姓名" ></x-input>
            <x-input :required="true" is-type="china-mobile" name="mobile" v-validate="'required|digits:11'" v-model.trim="formdata.mobile" title="手机号码" placeholder="患者注册时用的手机号" keyboard="number"></x-input>
            <!-- <x-input :required="true" name="verifycode" v-validate="'required|digits:6'" v-model="formdata.verifycode" title="验证码" class="weui-cell_vcode" placeholder="输入验证码" keyboard="number">
              <x-button slot="right" type="warn" mini plain style="margin:8px" :disabled="btnDisabled" @click.native="sendVerifycode()">{{btnText}}</x-button>
            </x-input> -->
        </group>
        <div style="padding:0 45px;margin-top:30px">
            <x-button type="warn" @click.native="submitForm()">绑定患者</x-button>
            <x-button type="default" @click.native="goRegister()">注册新患者</x-button>
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
    name:'Bind',
    methods: {
        submitForm(){
            this.$validator.validateAll().then((result) => {
                if(result){
                    let userInfo = JSON.parse(window.localStorage.getItem('userInfo'))
                    this.$http.post('pap/check-patient', this.formdata).then(response=>{
                        let pap_info = response.data
                        switch (response.data.status) {
                        case global.MOBILE_REGISTED:
                            this.$vux.toast.text('姓名与手机号不符，请核对输入的信息')
                            break;
                        //pap中没有信息
                        case global.NEW_PATIENT:
                            this.$vux.loading.show()
                            //查看微信中是否存在
                            this.$http
                                .post('patient/find-patient',this.formdata)
                                .then(response=>{
                                    switch (response.data.status) {
                                        case 'GO_PASSWORD':
                                            this.$vux.loading.hide()
                                            //随访助理注册患者
                                            this.$vux.confirm.show({
                                                title: '提示',
                                                content: '系统中不存在对应的患者，是否注册新患者？',
                                                confirmText:'前往注册',
                                                onConfirm:()=> {
                                                    this.$router.push({name:'register-emregister'})
                                                }
                                            })
                                            break;
                                        case 'MOBILE_REGISTED':
                                            this.$vux.toast.text('姓名与手机号不符')
                                            this.$vux.loading.hide()
                                            break;
                                        case 'GO_APPLY':
                                            this.formdata.config_id = global.configId
                                            this.$http.post('empower/bind-patient',this.formdata)
                                                .then(response=>{
                                                    this.$vux.loading.hide()
                                                    if(response.data.status == 'success'){
                                                        this.$vux.alert.show('绑定成功')
                                                        this.$router.push({name:'assist-detail'})
                                                    }else{
                                                        this.$vux.toast.text(error.response.data.message)
                                                    }
                                                }).catch(error=>{
                                                    console.log(error);
                                                    this.$vux.loading.hide()
                                                    this.$vux.toast.text(error.response.data.message)
                                                })
                                            break;
                                    }
                                }).catch(error=>{
                                    this.$vux.loading.hide()
                                    console.log(error);
                                })
                            break;
                        case global.CHECK_IN_WECHAT:
                            //绑定患者
                            this.formdata.config_id = global.configId
                            this.formdata.papid = pap_info.model.id
                            if(pap_info.model.openid != ''){
                                this.$vux.toast.text('该患者已经被绑定过了')
                            }else{
                                this.bindPatient(this.formdata)
                            }
                            break;
                        }
                    }).catch(error => {
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
        bindPatient(info){
            let userInfo = JSON.parse(window.localStorage.getItem('userInfo'))
            this.$http.post('empower/bind-patient',info)
                .then(response=>{
                if(response.data.status == 'success'){
                    info.openid = userInfo.openid
                    this.$http.post('pap/bind-patient', info).then(response=>{
                        if(response.data.status == 'success'){
                            this.$vux.alert.show('绑定成功')
                            this.$router.push({name:'assist-detail'})
                        }else{
                            this.$vux.toast.text(response.data.status)
                        }
                    }).catch(error=>{
                        console.log(error);
                    })
                }
                }).catch(error=>{
                    this.$vux.toast.text(error.response.data.message)
                })
        },
        goRegister(){
            this.$router.push({name:'register-emregister'})
        },
        startTimer(){
            this.btnDisabled =true
            let seconds = 60
            this.timer = setInterval(()=>{
                seconds --
                this.btnText = seconds + '秒'
                if(seconds<=0) {
                    clearInterval(this.timer)
                    this.btnText = '获取验证码'
                    this.btnDisabled = false
                }
            }, 1000);
        },
        sendVerifycode(){
            if(!this.formdata.mobile){
                this.$vux.toast.text('请输入手机号码')
            }else if(this.formdata.mobile.length<11){
                this.$vux.toast.text('请输入正确的手机号码')
                return false;
            }else{
                this.$http.post('patient/sendverifycode',{'mobile':this.formdata.mobile,'SmsType':'3','config_id':global.configId})
                    .then(response=>{
                        console.log(response)
                        this.startTimer()
                    }).catch(error=>{
                        console.log(error)
                        this.$vux.toast.text(error.response.data.message);
                    })
            }
        },
    },
    data () {
        return {
            formdata: {},
            btnText:'发送验证码',
            timer: null,
            btnDisabled: false,
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
