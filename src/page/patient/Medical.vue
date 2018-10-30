<template>
	<div class="page with-ft">
    <tab>
      <tab-item v-for="(item,index) in tabs" @on-item-click="tabitem = item" :key="index" :selected="tabitem === item">{{item}}</tab-item>
    </tab>
    <div class="tab-content" v-show="tabitem === '上传材料'">
      <div v-for="(item, index) in checkItems" :key="item.id">
        <image-uploader class="myuploader" :title="item.name" :value="item.images" @showPic = "showPop" :num="2"></image-uploader>
        <div class="img-uploaded">
          <div class="item" v-for="(attach, key) in history" :key="attach.id" v-show="attach.check_item_id == item.id">
            <div class="temp-pic">
              <img :src="attach.filepath" alt="" @click="showPop(attach.filepath)">
              <x-icon  type="ios-close" size="24" @click.native="deleteImg(attach, key)"></x-icon>
            </div>
          </div>
        </div>
      </div>
    </div>
    <div v-transfer-dom>
      <previewer :list="src" ref="previewer"></previewer>
    </div>
		<div class="tab-content" v-show="tabitem === '示例图片'">
      <div class="img-temp">
        <div class="item" v-for="item in exampleList" :key="item.src">
          <div class="item-hd"><div class="temp-pic"><img :src="item.src" alt="" @click="showPop(item.src)"></div></div>
          <div class="item-bd">
            <p class="temp-t">{{item.title}}</p>
            <p class="temp-desc">{{item.desc}}</p>
          </div>
        </div>
      </div>
    </div>

    <div class="page-ft" v-transfer-dom>
      <x-button type="warn" :disabled="submitBtnDisabled" @click.native="submitForm()" >提交 </x-button>
    </div>
	</div>
</template>


<script>
import {XButton, Tab, TabItem,Loading,TransferDom,Previewer} from 'vux'
import global from '@/components/Global'
import ImageUploader from '@/components/ImageUploader'
import fapiao from "@/assets/fapiao.jpg";
import chufang from "@/assets/chufang.jpg";
import tiaojian from "@/assets/tiaojian.jpg";
import shenfen from "@/assets/shenfen.jpg";
import xiangmu from "@/assets/xiangmu.jpg";
import apply from "@/mixins/apply"

export default {
  directives: {
    TransferDom
  },
  components: {
    XButton,
    Tab,
    TabItem,
    ImageUploader,
    Loading,
    Previewer
  },
  mixins: [apply],
  created(){
    this.initData()
  },
  methods: {
    onItemClick(){},
    initData(){
      this.patient_id = this.$route.params.patient_id
      this.$http.post('pap/get-checkitems',{'patient_id':this.patient_id,'category':global.CATEGORY_MEDICAL})
        .then(response=>{
           console.log(response)
          response.data.items.forEach(element=>{
            element.patient_id = this.patient_id;
            element.images = [];
            this.checkItems.push(element)
          })
          if(response.data.attachs.length != 0){
            response.data.attachs.forEach(element=>{
              this.history.push(element)
            })
          }
        }).catch(error=>{
          console.log(error)
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
    deleteImg(item, index){
      this.$vux.confirm.show({
        content:'确认删除？',
        onConfirm:()=>{      
          this.$http.post('pap/delete-check', {'id':item.id}).then(response=>{
            if(response.data.status == 'success'){
              this.history.splice(index,1)
            }
          }).catch(error=>{
            console.log(error)
          })
        }
      })
    },
  },
  computed: {
    redirectUrl: function(){
      return { name: 'patient-checksuccess'};
    }
  },
  data () {
    return {
      title: '上传资料',
      patient_id:null,
      formdata:{
        images:[],
      },
      info: '资料资料',
      tabs: ["上传材料", "示例图片"],
      tabitem: '上传材料',
      submitBtnDisabled:false,
      src:[],//图片预览
      checkItems:[],
      history:[],
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
}

</style>
