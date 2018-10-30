<template>
  <div class="patient-list">
    <div class="list-item" v-for="(item,index) in patientlist" :key="item.id">
      <div class="item-bd">
        <div class="item-title">{{item.name}}</div>
        <div class="item-desc">
          <span>
            <i class="iconfont wxicon-phone"></i>
            <a :href="'tel:'+item.mobile" class="item-desc">{{item.mobile}}</a>
          </span>
        </div>
      </div>
      <div class="item-ft">
        <x-button mini type="warn" @click.native="uploadMileage(item)">辅助申请</x-button>
      </div>
      <div class="item-ft">
        <x-button mini type="warn" @click.native="clearPatient(item,index)">移除</x-button>
      </div>
    </div>

    <infinite-loading  @infinite="infiniteHandler" spinner="spiral">
          <span slot="no-results"><slot name="no-results">暂时没有患者</slot></span>
          <span slot="no-more">
              <load-more :show-loading="false" tip="没有更多了" background-color="#fbf9fe"></load-more>
          </span>
    </infinite-loading>
  </div>
</template>
<script>
import InfiniteLoading from 'vue-infinite-loading';
import {getUrl } from 'vux/src/libs/router'
import global from '@/components/Global'
import qs from "qs";
import { Flexbox, FlexboxItem, LoadMore,XButton,} from 'vux'
export default {
    components: {
      InfiniteLoading,
      LoadMore,
      Flexbox,
      FlexboxItem,
      XButton
    },
    name: 'PatientList',
    props: {
      patientlist: Array,
      infinite:false,
    },
    data () {
      return {
      }
    },
    methods: {
        infiniteHandler($state) {
            this.$emit('infinite', $state);
        },
        clearPatient(item,index){
            this.$emit('clear',item,index)
        },
        uploadMileage(item){
            this.$emit('upload',item)
        }
    }
}
</script>

<style lang="less">
@import '~vux/src/styles/weui/widget/weui_cell/weui_cell_global';
@import '~@/style/base.less';

.patient-list {
  .list-item {
    position: relative; display: block; padding: 12px 15px; .display-flex; align-items: center; background: #fff; box-shadow: 0 0 5px rgba(0, 0, 0, 0.1); margin: 12px; border-radius: 8px;
    .item-bd {
      min-width: 0; .flex-1; font-size: 1.3rem;
      .item-title {
        position: relative; font-size: 1.7rem; line-height: 1.5;
      }
      .item-desc {
        color: #787878;
        font-size: 1.5rem;
        span {
          display: inline-block; white-space: nowrap; margin-right: 5px; line-height: 1.5;
          .iconfont {
            width: 16px; height: 16px; text-align: center; line-height: 16px; font-size: 12px; color: rgba(255, 255, 255, 0.7); background: lighten(desaturate(@blue, 70%),20%); border-radius: 16px; vertical-align: 1px; margin-right: 3px;
          }
        }
      }
    }
    .item-ft {
      margin-left: 10px;
      .weui-btn_mini {
        padding: 0 1em; 
      }
      .weui-btn {
        border-radius: 30px;
        &:after {
          border-radius: 30px;
        }
      }
    }
  }
}
</style>
