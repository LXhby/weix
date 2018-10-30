<template>
  <div>
    <group class="shop-list">
      <cell v-for="(listitem,index) in shoplist" @click.native="showDetail(listitem.id)" :key="index">
        <img slot="icon" class="thumb" :src="listitem.image" alt="">
        <span slot="title" class="title">{{listitem.name}}</span>
        <div slot="inline-desc" v-show="listitem.summary" class="desc">{{listitem.summary}}</div>
        <div slot="inline-desc" v-if="listitem.bought" class="price-area bought">
          <div class="price">
            <span>{{listitem.price}}</span>里程币
          </div>
          <div class="btn">
            已兑换
          </div>
        </div>
        <div slot="inline-desc" v-else class="price-area">
          <div class="price">
            <span>{{listitem.price}}</span>里程币
          </div>
          <div class="btn" @click.prevent.stop="exchange(listitem.id,listitem.price)">
            兑换
          </div>
        </div>
      </cell>
    </group>
    <infinite-loading v-if="infinite" @infinite="infiniteHandler" spinner="spiral">
      <span slot="no-results"><slot name="no-results">暂时没有礼品</slot></span>
      <span slot="no-more">
          <load-more :show-loading="false" tip="没有更多了" background-color="#fbf9fe"></load-more>
      </span>
    </infinite-loading>
  </div>
</template>
<script>
import { Group, Cell, CellBox ,LoadMore} from "vux"
import InfiniteLoading from 'vue-infinite-loading';
import {getUrl } from 'vux/src/libs/router'
import global from '@/components/Global'
import qs from "qs";

export default {
    components: {
      InfiniteLoading, Group, Cell, CellBox,LoadMore
    },
    name: 'ShopList',
    props: {
      shoplist: Array,
      infinite:false,
    },
    methods:{
      infiniteHandler($state) {
          this.$emit('infinite', $state);
      },
      exchange($id,$price){
          this.$emit('exchange', $id,$price);        
      },
      showDetail($id){
        this.$router.push({name:'shop-view',params:{'id':$id}})
      }
    },
    data () {
      return {
      }
    },
}
</script>

<style lang="less">
@import '~@/style/base.less';

.shop-list {
  .weui-cells {
    margin-top: 0 !important; background: transparent;
    &::before,&::after { display: none;}
    .weui-cell {
      box-shadow: 0 0 5px rgba(0, 0, 0, 0.15); border-radius: 5px; overflow: hidden; margin: 15px; background: #fff;
      &::before,&::after { display: none;}
      &:first-child {
        margin-top: 0;
      }
    }
  }
  .weui-cell__hd {
    width: 70px; height: 70px; border-radius: 4px; overflow: hidden; background: #f4f5f6; margin-right: 10px;
    .thumb {
      width: 100%; height: 100%; object-fit: cover;
    }
  }
  .title {
    font-size: 1.6rem; color: #444; display: block;
  }
  .desc {
    .txt-line-two; font-size: 1.3rem; line-height: 1.3; color: #999;
  }
  .price-area {
    overflow: hidden; margin-top: 5px;
    .price {
      color: @magenta; float: left; font-size: 1.3rem;
      span {
        font-size: 2rem; margin-right: 5px; vertical-align: -2px;
      }
    }
    .btn {
      float: right; background: @orange; color: #fff; border-radius: 20px; padding: 2px 8px; margin-top: 3px;
    }
    &.bought {
      .price { color: #ACB8C8;}
      .btn {
        background: #ACB8C8;
      }
    }
  }
  .weui-cell__ft { display: none;}
}
</style>
