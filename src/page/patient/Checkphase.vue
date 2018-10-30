<template>
	<div class="phase-upload-page">
    <tab>
      <tab-item v-for="(item,index) in tabs" @on-item-click="tabitem = item" :key="index" :selected="tabitem === item">{{item}}</tab-item>
    </tab>
    <div class="tab-content" v-show="tabitem === '上传材料'">
      <div>需要上传{{checkItems.length}}项阶段审核材料，上传所有材料完成后项目办方进行审核</div>
        <group v-for="(item,index) in checkItems" :key="item.id"> 
          <cell :title="(index+1)+'.'+item.name" :value="item.itemstatus" @click.native="onItemClick(item)"></cell>
        </group>
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
      <popup v-model="showItem"  >
        <div class="popup1">
            <group class="myform" label-margin-right="2em" label-width="7.5em" :title="'请上传：'+check_item.name">
              <table class="table upload-table" >
                <tr  v-if="!checked">
                  <td>
                    <image-uploader class="myuploader" ref="imgUploader" :title="check_item.name" :value="formdata.images" :num="9"></image-uploader>
                  </td>
                </tr>
                 <tr>
                  <td>
                    <div class="img-uploaded">
                      <p class="temp-t" v-if="Reason">原因：{{Reason}}</p>
                      <transition-group name="fade">
                      <div class="item" v-for="(item, index) in checkImages" :key="item.id">
                        <div class="temp-pic">
                          <img :src="item.filepath" alt="" @click="showPop(item.filepath)">
                          <x-icon  v-if="!checked" type="ios-close" size="24" @click.native="deleteImg(item, index)"></x-icon>
                        </div>
                      </div>
                      </transition-group>
                    </div>
                  </td>
                </tr>               
              </table>
              <div style="padding:20px 15px;">
                <x-button v-if="!checked" @click.native="submitForm()" :disabled="submitBtnDisabled"  type="warn">上传</x-button>
                <x-button @click.native="showItem = false">关闭</x-button>
              </div>
            </group>
        </div>
      </popup>
    </div>
    <div v-transfer-dom>     
      <previewer :list="src" ref="previewer"  ></previewer>
    </div>
	</div>
</template>


<script>
import {
  XButton,
  Timeline,
  TimelineItem,
  Flow,
  Cell,
  Group,
  FlowState,
  FlowLine,
  Tab,
  TabItem,
  Loading,
  Popup,
  TransferDom,
  Previewer
} from "vux";
import global from "@/components/Global";
import ImageUploader from "@/components/ImageUploader";
import { mapState } from "vuex";
import qs from "qs";
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
    Cell,
    Group
  },
  created() {
    this.initData();
  },
  computed: {
    ...mapState({
      userInfo: state => state.vux.userInfo
    })
  },
  methods: {
    async initData() {
      this.$vux.loading.show();
      this.papid = this.$route.params.patient_id;
      this.$http
        .post("pap/get-phase-items", { patient_id: this.papid })
        .then(response => {
          //初始化用户信息
          console.log("getphaseitems", response);
          this.checkItems = [];
          response.data.checkitems.forEach((element, index) => {
            this.checkItems.push(element);
          });
          this.$vux.loading.hide();
        })
        .catch(error => {
          console.log(error);
          this.$vux.loading.hide();
        });
      //隐藏菜单
      this.$wechat.ready(() => {
        this.$wechat.hideAllNonBaseMenuItem();
      });
    },
    getcheckitemattach(check_item) {
      return new Promise((resolve,reject)=>{
        this.$http
          .post("pap/get-check-item-attach", {
            patient_id: this.papid,
            check_item_id: check_item.id,
            category: this.category
          })
          .then(response => {
            console.log("getcheckitemattach", response.data);
            let imgs = [];
            if(response.data.itemstatus == '审核通过'){
              this.checked = true
            }
            response.data.items.forEach((element, index) => {
              imgs.push(element);
            });
            this.$set(this.history,check_item.id,imgs);
            this.checkImages = this.history[check_item.id];
            this.Reason = response.data.reason;
            resolve()
          })
          .catch(error => {
          console.log(error);
          this.$vux.loading.hide();
         });
        });
    },
    async onItemClick(check_item) {
      this.Reason = ""
      this.checked = ''
      this.checkImages = this.history[check_item.id]
      this.check_item_id = check_item.id;

      if(check_item.itemstatus == '审核通过'){
        this.checked = true
      }
      this.formdata.images = []
      this.check_item = check_item
      this.showItem = true
      this.$vux.loading.show()
      await this.getcheckitemattach(check_item)
      this.$vux.loading.hide()
      if(!this.checked){
        this.$refs.imgUploader.reset()
      }
    },
    submitForm() {
      this.formdata.images = this.$refs.imgUploader.images;
      if (this.formdata.images == "") {
        this.$vux.toast.text("请上传资料");
        return false;
      }
      this.submitBtnDisabled = true;
      this.$vux.loading.show({ text: "正在上传" });
      this.formdata.patient_id = this.papid;
      this.formdata.check_item_id = this.check_item_id
      this.formdata.category = this.category
     this.$http
        .post("patient/phase-upload", this.formdata)
        .then(async response => {
          console.log('phaseupload',response)
          if (response.data.status == "success") {
            this.formdata.images = []
            this.$refs.imgUploader.reset()
            this.initData();
          await  this.getcheckitemattach(this.check_item)
            this.submitBtnDisabled = false;
            this.$vux.loading.hide();
            this.$vux.toast.text("上传成功")
          } else {
            this.submitBtnDisabled = false;
            this.$vux.loading.hide();
            this.$vux.toast.text(response.data.message);
          }
        })
        .catch(error => {
          console.log(this.formdata)
          this.submitBtnDisabled = false;
          this.$vux.loading.hide();
          console.log(error);
        });
    },
    deleteImg(item, index) {
      this.$vux.confirm.show({
        content: "确认删除？",
        onConfirm: () => {
          this.$http
            .post("pap/delete-check", { id: item.id })
            .then(response => {
              if (response.data.status == "success") {
                this.history[this.check_item_id].splice(index, 1);
                this.initData();
              }
            })
            .catch(error => {
              console.log(error);
            });
        }
      });
    },
    showPop(route) {
      this.src = [];
      this.src.push({
        src: route,
        w: 600,
        h: 800
      });
      this.$nextTick(() => {
        this.$refs.previewer.show(0);
      });
    }
  },
  data() {
    return {
      category: "阶段审核",
      papid: null,
      formdata: {
        images: []
      },
      tabs: ["上传材料", "示例图片"],
      tabitem: "上传材料",
      history: [],
      checkItems: [],
      check_item:'',
      check_item_id: null,
      Reason: "",
      checkImages: [],
      checked: false,
      submitBtnDisabled: false,
      showItem: false,
      src: [], //图片预览
      exampleList: [
        {
          src: tiaojian,
          name: "医学条件确认表",
          desc:
            "医学条件确认表—患者本人填写后，由项目医生按表格填写，签字盖项目专用章，且上传的照片清晰完整。"
        },
        {
          src: shenfen,
          name: "患者身份证",
          desc: "患者身份证—身份证正反面拍摄清晰完整，且身份证在有效期内。"
        },
        {
          src: xiangmu,
          name: "项目知情同意书",
          desc: "项目知情同意书—由患者本人签字，且上传的照片清晰完整。"
        },
        {
          src: fapiao,
          name: "发票示例图",
          desc:
            "12个月抗血小板治疗的购药凭证—上传的发票要求如下：1、发票抬头必须为患者本人；2、发票上的购买时间在2018年1月1日之后；3、发票上如显示为西药费，需提供相关购药明细；4、复印件需加盖医保局的章或报销单位章，并提供相应报销证明。上传的照片清晰完整。"
        },
        {
          src: chufang,
          name: "项目处方",
          desc:
            "项目处方—由项目医生按表格填写，签字盖项目专用章，且上传的照片清晰完整；项目办审核后，患者可持在有效期内的处方前往药房领药。"
        }
      ]
    };
  }
};
</script>

<style lang='less'>
@import "~@/style/base.less";

.upload-page {
  .upload-list {
    .success {
      color: @green;
    }
    .warn {
      color: @red;
    }
    .wait {
      color: @blue;
    }
  }
}

.tab-content {
  position: relative;
  &::after {
    .b-line;
  }
}

.myuploader {
  .weui-cells {
    margin-top: 0 !important;
    &::before,
    &::after {
      display: none;
    }
  }
}

.img-temp {
  position: relative;
  padding: 10px 5px;
  overflow: hidden;
  background: #fff;
  .item {
    position: relative;
    .display-flex;
    box-sizing: border-box;
    padding: 10px;
    align-items: center;
    &::after {
      .b-line;
    }
    .item-hd {
      width: 80px;
      height: 80px;
      margin-right: 15px;
    }
    .item-bd {
      .flex-1;
      min-width: 0;
    }
    .temp-pic {
      position: relative;
      width: 100%;
      height: 0;
      padding-top: 100%;
      img {
        display: block;
        width: 100%;
        height: 100%;
        position: absolute;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
        object-fit: contain;
        background: #eee;
        border-radius: 4px;
      }
      .badge {
        position: absolute;
        top: 0;
        left: 0;
        padding: 2px 5px;
        border-radius: 0 0 5px 0;
        color: #fff;
        line-height: 1.3;
        &.success {
          background: fade(@green, 80%);
        }
        &.warn {
          background: fade(@red, 70%);
        }
        &.waitting {
          background: fade(@orange, 70%);
        }
      }
      .vux-x-icon {
        position: absolute;
        top: -8px;
        right: -8px;
        fill: #888;
      }
    }
    .temp-t {
      font-size: 1.6rem;
      line-height: 1.5;
      padding: 0 0 5px;
    }
    .temp-desc {
      font-size: 1.3rem;
      line-height: 1.3;
      color: #999;
    }
  }
}
.img-uploaded {
  position: relative;
  padding: 10px 5px;
  overflow: hidden;
  .item {
    width: 33.33%;
    float: left;
    position: relative;
    box-sizing: border-box;
    padding: 10px;
    .temp-pic {
      position: relative;
      width: 100%;
      height: 0;
      padding-top: 100%;
      img {
        display: block;
        width: 100%;
        height: 100%;
        position: absolute;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
        object-fit: contain;
        background: #eee;
        border-radius: 4px;
      }
      .badge {
        position: absolute;
        top: 0;
        left: 0;
        padding: 2px 5px;
        border-radius: 0 0 5px 0;
        color: #fff;
        line-height: 1.3;
        &.success {
          background: fade(@green, 80%);
        }
        &.warn {
          background: fade(@red, 70%);
        }
        &.waitting {
          background: fade(@orange, 70%);
        }
      }
      .vux-x-icon {
        position: absolute;
        top: -8px;
        right: -8px;
        fill: #888;
      }
    }
    .temp-t {
      font-size: 1.4rem;
      line-height: 24px;
      height: 24px;
      padding: 5px 5px 0;
      .txt-line-one;
    }
  }
}

.upload-temp {
  .temp-pic {
    position: relative;
    width: 100%;
    height: 0;
    padding-top: 100%;
    margin-bottom: 5px;
    img {
      display: block;
      width: 100%;
      height: 100%;
      position: absolute;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
      object-fit: contain;
      background: #eee;
      border-radius: 4px;
    }
  }
  .temp-t {
    font-size: 1.5rem;
    line-height: 1.5;
    padding: 0 0 5px;
    color: @red;
  }
  .temp-desc {
    font-size: 1.3rem;
    line-height: 1.3;
    color: #666;
  }
}
.upload-table {
  .myuploader {
    .weui-cell {
      padding: 2px 5px;
    }
  }
}
</style>
