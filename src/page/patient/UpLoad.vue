<template>
	<div class="">
    <div class="mystep">
      <div class="step-hd" v-if="this.months>0">已累计上传{{months}}个月购药发票</div>
      <div class="step-hd" v-else>开始上传里程<br>（已上传的里程在审核后展示进度）</div>
      <flow>
        <template v-for="month in monthList" >
          <flow-state :key="month.index" :is-done="month.done">
            <span slot="title">{{month.index}}月</span>
          </flow-state>
          <flow-line :key="'line'+month.index" :is-done="month.done" v-if="month.index < monthList.length"></flow-line>
          <flow-line :key="'tips'+month.index" tip="进行中" v-if="month.index==months && month.index < monthList.length"></flow-line>
        </template>
      </flow>
    </div>
    <tab>
      <tab-item v-for="(item,index) in tabs" @on-item-click="tabitem = item" :key="index" :selected="tabitem === item">{{item}}</tab-item>
    </tab>
    <div class="tab-content" v-show="tabitem === '上传材料'">
      <div v-for="check_item in checkItems" :key="check_item.id">
        <image-uploader class="myuploader" :title="check_item.name" :value="check_item.images" @showPic = "showPop" :num="2"></image-uploader>
        <div class="img-uploaded">
          <div class="item" v-for="(attach, key) in check_history" :key="attach.id" v-show="attach.check_item_id == check_item.id">
            <div class="temp-pic">
              <img :src="attach.filepath" alt="" @click="showPop(attach.filepath)">
              <x-icon  v-if="attach.result === 0" type="ios-close" size="24" @click.native="deleteCheck(attach, key)"></x-icon>
            </div>
          </div>
          <div class="img-tips" v-if="check_item.reason">
            {{check_item.reason.join(',')}}
          </div>
        </div>
      </div>
      <image-uploader class="myuploader" :title="title" :value="this.formdata.images" @showPic = "showPop" :num="9"></image-uploader>
      <div v-transfer-dom>
        <previewer :list="src" ref="previewer"></previewer>
      </div>
      <div style="padding: 0 15px;margin-top:10px">
        <flexbox>
          <flexbox-item>
            <x-button type="default" @click.native="showPopup"><x-icon type="ios-help-outline" size="20" style="vertical-align: -3px; margin-right: 3px;"></x-icon>上传须知</x-button>
          </flexbox-item>
          <flexbox-item>
            <x-button type="warn" :disabled="submitBtnDisabled" @click.native="submitForm()" >提交</x-button>
          </flexbox-item>
        </flexbox>
      </div>
      <div v-transfer-dom>
        <popup v-model="show" position="bottom">
          <div style="padding: 15px; position: absolute; right: 0px;">
            <x-button @click.native="show = false" plain mini type="warn" style="border-radius:99px;">关闭</x-button>
          </div>
          <div class="weui-article popup0" style="background: #fff;">
                <h1 style="padding-right: 65px;">
                    微信平台患者上传须知
                </h1>
            <section style="text-align:justify">
                <p v-html="content"></p>
            </section>
          </div>
          
        </popup>
      </div>
      <div class="img-uploaded">
        <div class="item" v-for="(item, index) in history" :key="item.id">
          <div class="temp-pic">
            <img  v-if="item.status != '审核未通过'" :src="item.filepath" alt="" @click="showPop(item.filepath)">
            <img  v-if="item.status == '审核未通过'" :src="item.filepath" alt="" @click="showReason(item.filepath,item.reason)">
            <x-icon  v-if="item.status == '审核未通过'" type="ios-close" size="24" @click.native="deleteImg(item, index)"></x-icon>
            <span class="badge success">{{item.status}}</span>
          </div>
          <p class="temp-t"><span v-if="item.status=='审核未通过'">原因：{{item.reason}}</span></p>
        </div>
      </div>
    </div>
		<div class="tab-content" v-show="tabitem === '示例图片'">
      <div class="img-temp">
        <div class="item" v-for="item in exampleList" :key="item.src">
          <div class="item-hd"><div class="temp-pic"><img :src="item.src" alt="" @click="showPop(item.src)"></div></div>
          <div class="item-bd">
            <p class="temp-t">{{item.name}}</p>
            <p class="temp-desc">{{item.desc}}</p>
          </div>
        </div>
      </div>
    </div>
     <div v-transfer-dom>
      <x-dialog v-model="showHideOnBlur" class="dialog-demo" hide-on-blur>
        <div class="img-box">
          <img :src="fail_src" style="max-width:100%">
        </div>
        <div @click="showHideOnBlur=false">
          <span class="vux-close"></span>
          <p class="temp-t">原因：{{fail_reason}}</p>
        </div>
      </x-dialog>
    </div>
	</div>
</template>

<script>
import {XButton,Timeline,TimelineItem, Flow, 
FlowState, FlowLine, Tab, TabItem,Loading,Popup,TransferDom,
Previewer,XDialog, Flexbox, FlexboxItem,Group,Cell} from 'vux'
import global from '@/components/Global'
import ImageUploader from '@/components/ImageUploader'
import qs from 'qs'
import fapiao from "@/assets/fapiao.jpg";
import chufang from "@/assets/chufang.jpg";
import tiaojian from "@/assets/tiaojian.jpg";
import shenfen from "@/assets/shenfen.jpg";
import xiangmu from "@/assets/xiangmu.jpg";


export default {
  directives: {
    TransferDom
  },
  components: {
    Flow,
    FlowState,
    FlowLine,
    XButton,
    Timeline,
    TimelineItem,
    Tab,
    TabItem,
    ImageUploader,
    Loading,
    Popup,
    Previewer,
    XDialog,
    Flexbox,
    FlexboxItem,
    Group,
    Cell
  },
  created(){
    this.initData()
  },
  methods: {
    onItemClick(){
      console.log(this.formdata.images)
    },
    showPopup(){
      this.show = true
    },
    initData(){
      this.$vux.loading.show({'text':'正在加载'})
      this.patient_id = this.$route.params.patient_id
      //获取上传历史
      this.$http.post('pap/get-mile', {'patient_id':this.patient_id}).then(response=>{
        response.data.models.forEach(element=>{
          this.history.push(element)
        })
        this.months = response.data.months
        for (let index = 0; index < 12; index++) {
          this.monthList.push({
            index: index+1,
            done: index+1 <= this.months
          })
        }
      }).catch(error=>{
        console.log(error)
      })

      this.$http.post('pap/get-all-checkitems',{'patient_id':this.patient_id})
        .then(response=>{
          response.data.items.forEach(element=>{
            if(element.id != 4){
              element.patient_id = this.patient_id;
              element.images = [];
              this.checkItems.push(element)
            }
          })
          if(response.data.attachs.length != 0){
            response.data.attachs.forEach((element,index)=>{
              this.check_history.push(element)
            })
          }

          this.checkItems.reduce(function(pre,cur,index){
            response.data.attachs.forEach((element,index)=>{
              if(element.reason){
                if(cur.id == element.check_item_id){
                  cur.reason = element.reason
                }
              }
            })
            return pre
          },{})          
          this.$vux.loading.hide()        
        }).catch(error=>{
          console.log(error)
        })

      //隐藏菜单
      this.$wechat.ready(()=>{
        this.$wechat.hideAllNonBaseMenuItem();
      })
      this.getKnown()
    
    },
    getKnown(){
      this.$http.get('pages',{params:{'PageSearch[remark]':'上传须知'}})
        .then(response=>{
          this.content = response.data.items[0].content
        }).catch(error=>{
          console.log(error);
        })
    },
    submitForm(){
      let flag = false
      for (let index = 0; index < this.checkItems.length; index++) {
          const element = this.checkItems[index];
          if (element.images.length != 0) {
              flag = true
          }
      }
      if(!flag && this.formdata.images == ''){
        this.$vux.toast.text('请上传材料')
        return false;
      }
      this.submitBtnDisabled = true
      this.$vux.loading.show({text:'正在上传'})
      this.formdata.patient_id = this.patient_id
      this.formdata.checkItems = this.checkItems
      this.$http.post('patient/mile-upload',this.formdata)
        .then(response=>{
          this.submitBtnDisabled = false
          this.$vux.loading.hide()
          if(response.data.status == 'success'){
            this.$vux.loading.hide()
            this.$vux.toast.text('上传成功')
            this.$router.replace({name:'patient-success',params:{'months':this.months}})
          }else{
            this.submitBtnDisabled = false
            this.$vux.loading.hide()
            this.$vux.toast.text(response.data.message);
          }
        }).catch(error=>{
          this.submitBtnDisabled = false
          this.$vux.loading.hide()
          console.log(error);
        })
    },
    deleteImg(item, index){
      this.$vux.confirm.show({
        content:'确认删除？',
        onConfirm:()=>{      
          this.$http.post('pap/delete-mile', {'id':item.id}).then(response=>{
            if(response.data.status == 'success'){
              this.history.splice(index,1)
            }
          }).catch(error=>{
            console.log(error)
          })
        }
      })
    },
    deleteCheck(item,index){
      this.$vux.confirm.show({
        content:'确认删除？',
        onConfirm:()=>{      
          this.$http.post('pap/delete-check', {'id':item.id}).then(response=>{
            if(response.data.status == 'success'){
              this.check_history.splice(index,1)
            }
          }).catch(error=>{
            console.log(error)
          })
        }
      })
    },
    showPop(route){
      this.src = []
      this.src.push({
        src: route,
        w: 600,
        h: 800
      })
      this.$nextTick(()=>{
        this.$refs.previewer.show(0)
      })
    },
    showReason(route,reason){
      this.fail_src = route
      this.fail_reason = reason
      this.showHideOnBlur = true
    }
  },
  data () {
    return {
      title: '上传发票',
      patient_id:null,
      formdata:{
        images:[]
      },
      info: '资料资料',
      tabs: ["上传材料", "示例图片"],
      tabitem: '上传材料',
      history:[],
      submitBtnDisabled:false,
      months:0,
      monthList:[],
      src:[],//图片预览,
      fail_src : '',
      fail_reason:'',
      showHideOnBlur: false,
      show:false,
      content:'',
      checkItems:[],
      check_history:[],
      exampleList:[
        {
          src : tiaojian,
          name:'医学条件确认表',
          desc: '医学条件确认表—患者本人填写后，由项目医生按表格填写，签字盖项目专用章，且上传的照片清晰完整。'
        },
        {
          src : shenfen,
          name:'患者身份证',
          desc: '患者身份证—身份证正反面拍摄清晰完整，且身份证在有效期内。'
        },
        {
          src : xiangmu,
          name:'项目知情同意书',
          desc: '项目知情同意书—由患者本人签字，且上传的照片清晰完整。'
        },
        {
          src : fapiao,
          name:'发票示例图',
          desc: '12个月抗血小板治疗的购药凭证—上传的发票要求如下：1、发票抬头必须为患者本人；2、发票上的购买时间在2018年1月1日之后；3、发票上如显示为西药费，需提供相关购药明细；4、复印件需加盖医保局的章或报销单位章，并提供相应报销证明。上传的照片清晰完整。'
        },
        {
          src : chufang,
          name:'项目处方',
          desc: '项目处方—由项目医生按表格填写，签字盖项目专用章，且上传的照片清晰完整；项目办审核后，患者可持在有效期内的处方前往药房领药。'
        },
      ]
    }
  },
}
</script>

<style lang='less'>
@import '~@/style/base.less';
@import '~vux/src/styles/close';

.mystep {
  padding: 15px; position: relative; background: #fff; color: #666;
  &:after {
    .b-line;
  }
  .step-hd {
    text-align: center; font-size: 1.8rem;
    .info {
      font-size: 1.3rem; color: #666;
    }
  }
  .weui-wepay-flow {
    padding: 25px 0;
  }
  .weui-wepay-flow__li {
    width: 16px; height: 16px;
    .weui-wepay-flow__state {
      width: 16px; height: 16px; border-radius: 8px; line-height: 18px; text-align: center;
      &::before {
        content: "\e604"; font-family: 'iconfont'; font-size: 12px;
      }
    }
    &.weui-wepay-flow__li_done {
      .weui-wepay-flow__state {
        background:-moz-linear-gradient(top, #ffbdbb, #ff7670);  
        background:-webkit-gradient(linear, 0 0, 0 bottom, from(#ffbdbb), to(#ff7670)); 
      }
    }
  }
  .weui-wepay-flow__line {
    height: 8px; background: #fff1f0;
    .weui-wepay-flow__process {
      height: 8px; background: #fec6c4;
    }
  }
  [class^="weui-wepay-flow__title-"], [class*=" weui-wepay-flow__title-"] {
    font-size: 12px;
  }
  [class^="weui-wepay-flow__info-"] {
    background: #ff7670; bottom: 14px; padding: 3px 8px;
  }
  .weui-wepay-flow__info-top:after {
    border-color: #ff7670 transparent transparent transparent;
  }
}

.tab-content {
  position: relative;
  &::after { .b-line;}
}

.myuploader {
  .weui-cells {
    margin-top: 0 !important;
    &::before,&::after {
      display: none;
    }
  }
}

.img-temp {
  position: relative; padding: 10px 5px; overflow: hidden; background: #fff;
  .item {
    position: relative; .display-flex; box-sizing: border-box; padding: 10px; align-items: center;
    &::after {
      .b-line;
    }
    .item-hd {
      width: 80px; height: 80px; margin-right: 15px;
    }
    .item-bd {
      .flex-1; min-width: 0;
    }
    .temp-pic {
      position: relative; width: 100%; height: 0; padding-top: 100%;
      img {
        display: block; width: 100%; height: 100%; position: absolute; top: 0; left: 0; right: 0; bottom: 0; object-fit: contain; background: #eee; border-radius: 4px;
      }
      .badge {
        position: absolute; top: 0; left: 0; padding: 2px 5px; border-radius: 0 0 5px 0; color: #fff; line-height: 1.3;
        &.success {
          background: fade(@green,80%)
        }
        &.warn {
          background: fade(@red,70%)
        }
        &.waitting {
          background: fade(@orange,70%)
        }
      }
      .vux-x-icon {
        position: absolute; top: -8px; right: -8px; fill: #888;
      }
    }
    .temp-t {
      font-size: 1.6rem; line-height: 1.5; padding: 0 0 5px;
    }
    .temp-desc {
      font-size: 1.3rem; line-height: 1.3; color: #999;
    }
  }
}
.img-uploaded {
  position: relative; padding: 10px 5px; overflow: hidden;
  .item {
    width: 33.33%; float: left; position: relative; box-sizing: border-box; padding: 10px;
    .temp-pic {
      position: relative; width: 100%; height: 0; padding-top: 100%;
      img {
        display: block; width: 100%; height: 100%; position: absolute; top: 0; left: 0; right: 0; bottom: 0; object-fit: contain; background: #eee; border-radius: 4px;
      }
      .badge {
        position: absolute; top: 0; left: 0; padding: 2px 5px; border-radius: 0 0 5px 0; color: #fff; line-height: 1.3;
        &.success {
          background: fade(@green,80%)
        }
        &.warn {
          background: fade(@red,70%)
        }
        &.waitting {
          background: fade(@orange,70%)
        }
      }
      .vux-x-icon {
        position: absolute; top: -8px; right: -8px; fill: #888;
      }
    }
    .temp-t {
      font-size: 1.4rem; line-height: 24px; height: 24px; padding: 5px 5px 0; .txt-line-one;
    }
  }
  .img-tips {
    clear: both; padding: 0px 10px 15px; font-size: 1.4rem; color: #787878; line-height: 1.3;
  }
}

.dialog-demo {
  .weui-dialog{
    border-radius: 8px;
    padding-bottom: 8px;
  }
  .dialog-title {
    line-height: 30px;
    color: #666;
  }
  .img-box {
    position: relative; width: 100%; height: 0; padding-top: 100%;
    img {
      display: block; width: 100%; height: 100%; position: absolute; top: 0; left: 0; right: 0; bottom: 0; object-fit: contain; background: #eee; border-radius: 4px;
    }
  }
  .vux-close {
    margin-top: 8px;
    margin-bottom: 8px;
  }
  .temp-t {
    padding: 0 10px; font-size: 1.5rem;line-height: 1.4
  }
}

</style>
