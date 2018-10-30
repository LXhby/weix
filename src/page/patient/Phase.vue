<template>
  <div class="phase">
    <x-header v-transfer-dom class="myheader" :left-options="{showBack: false}">申请患者：{{name}}</x-header>
    <div class="page-ft" v-transfer-dom>
      <x-button type="warn" @click.native="toNext" :disabled="submitBtnDisabled">下一步</x-button>
    </div>

    <div class="phase-title">
      <i class="iconfont wxicon-process"></i>{{mode_name}}
    </div>

    <timeline class="phasetimeline">
      	<timeline-item v-if="list.length > 0 ">
				<h3 >第{{list[0].phase}}疗程援助</h3>
         <div v-for="(item,index) in list"  :key="index">
          <h5>{{item['content']}}</h5>
          <p>{{item['remark']}}</p>
          <p>{{item['created']}}</p>
        </div>
			</timeline-item>
		</timeline>

  </div>
</template>

<script>
import {
  XHeader,
  XButton,
  Timeline,
  TimelineItem,
  TransferDom,
  dateFormat
} from "vux";
import global from "@/components/Global";
import { mapState } from "vuex";

export default {
  directives: {
    TransferDom
  },
  filters: {
    dateFormat
  },
  components: {
    XHeader,
    XButton,
    Timeline,
    TimelineItem,
    TransferDom
  },
  name: "Phase",

  created() {
    this.initData();
  },
  computed: {
    ...mapState({
      userInfo: state => state.vux.userInfo
    })
  },

  methods: {
    initData() {
      this.$vux.loading.show({
        text: "正在加载"
      });
      //判断患者阶段
      this.$http
        .post("pap/get-phase", { papid: this.$route.params.id })
        .then(response => {
          console.log("getphase", response.data);
          this.name = response.data.model.name;
          this.mode_name = response.data.mode.name;
          this.continue = response.data.continue;
          this.reason = response.data.reason;
          this.next_phase = response.data.next_phase;
          this.allow_rejoin = response.data.allow_rejoin;
          let arr = response.data.arr_status;
          for (var key in arr) {
            if (arr.hasOwnProperty(key)) {
              var element = arr[key];
              this.list.push(element);
            }
          }
          this.$vux.loading.hide();
        })
        .catch(error => {
          console.log(error);
        })
        .finally(() => {
          this.$vux.loading.hide();
        });
    },
    changeDate($date) {
      return dateFormat($date, "YYYY-MM-DD");
    },
    toNext() {
      if (this.reason) {
        switch (this.reason) {
          case "已拒绝":
            this.$vux.alert.show(
              "您当前不满足援助项目的申请条件，无法继续操作"
            );
            break;
          case "未领药":
            this.$vux.alert.show("当前阶段未领药完成，无法进行后续申请");
            break;
          case "入组审核未通过":
            this.$vux.alert.show("您未通过入组审核，无法继续操作");
            break;

          case "修改阶段审核材料":
           this.$router.push({
                name: "patient-checkphase",
                params: { patient_id: this.$route.params.id }
              });
            break;

          case "已出组":
            this.$vux.alert.show({
              title: "提示",
              content: "您已出组,无法继续申请"
            });
            break;
          case "无下一阶段":
            this.$vux.alert.show({
              title: "提示",
              content: "已完成所有援助流程"
            });
            break;
          case "后续审核未通过":
            this.$vux.alert.show({
              title: "提示",
              content: "抱歉，您未通过后续复审"
            });
            break;
          case "请等待当前阶段审核完成":
            this.$vux.alert.show({
              title: "提示",
              content: "请等待当前阶段审核完成"
            });
        }
      } else if (!this.reason && this.continue) {
        this.submitBtnDisabled = true;
        this.$vux.loading.show();
        this.$http
          .post("pap/next-phase", {
            papid: this.$route.params.id
            // empower: this.empower
          })
          .then(response => {
            console.log(response.data);
            if (response.data.status == "success") {
              this.$router.push({
                name: "patient-checkphase",
                params: { patient_id: this.$route.params.id }
              });
            } else {
              this.$vux.toast.text(response.data.remind);
              this.submitBtnDisabled = false;
            }
          })
          .catch(error => {
            console.log(error);
            this.$vux.loading.hide();
            this.$vux.toast.text(error.response.data.message);
            this.submitBtnDisabled = false;
          });
      }
    }
  },

  data() {
    return {
      list: [],
      name: "",
      mode_name: "",
      continue: false,
      reason: "",
      next_phase: "",
      arr_status: "",
      status: "",
      allow_rejoin: "",
      submitBtnDisabled: false,
      empower: ""
    };
  }
};
</script>

<style lang='less'>
@import "~@/style/base.less";


.phase {
  padding-top: 46px;
}
.myheader {
  background-color: @red !important; position: fixed !important; top: 0; left: 0; right: 0; z-index: 100;
  .vux-header-left .left-arrow:before {
    border-color: rgba(255, 255, 255, 0.5) !important;
  }
  .vux-header-title {
    color: #fff !important; font-size: 16px !important;
  }
  .vux-header-right,.vux-header-right a {
    color: #fff !important;
  }
}

.phase-title {
  text-align: center; font-size: 1.4rem; padding-top: 10px;
  .iconfont {
    color: @red; margin-right: 4px; font-size: 1.6rem;
  }
}
.phasetimeline {
  margin: 5px 10px 15px; background: #fff; border-radius: 5px; box-shadow: 0 0 5px rgba(0, 0, 0, 0.1); padding-left: 75px !important;
  .vux-timeline-item-content {
    padding-left: 1.8rem; position: relative; min-height: 32px;
  }
  .vux-timeline-item-color {
    background: @red;
  }
  .weui-icon-success-no-circle {
    color: @red;
  }
	p {
		color: #888;
		font-size: 1.4rem;
	}
	h4 {
		color: #666;
    font-weight: normal;
    font-size: 1.4rem;
    margin-bottom: 5px;
	}
	.recent {
		color: @red; position: absolute; left: -65px; top: 4px; width: 55px; line-height: 1.2;
  }
  .vux-timeline-item-head-first {
    top: 1px;
  }
  .vux-timeline-item-head {
    top: 6px;
  }
  .vux-timeline-item-tail {
    top: 10px; width: 1px; left: 6px; opacity: 0.3;
  }
  .waitting {
    .vux-timeline-item-color,.vux-timeline-item-tail {
      background-color: #ccc;
    }
    .recent {
      color: #ccc;
    }
    p { color:#ccc;}
  }
}

// .weui-btn_primary {
//   background-color: @green !important;
// }
</style>
