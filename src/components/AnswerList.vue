<template>
  <div class="answer-list">
    <router-link class="list-item" v-for="(item,index) in answerlist" :key="item.id" to="/" >
      <span class="item-badge" v-if="item.recommend">精华</span>
      <div class="item-hd">
        <span class="item-icon">问</span>
      </div>
      <div class="item-bd">
        <div class="item-title">{{item.title}}</div>
      </div>
      <div class="item-ft" v-if="item.time">
        <div class="item-time">{{item.time}}</div>
      </div>
    </router-link>
  </div>
</template>
<script>
import InfiniteLoading from 'vue-infinite-loading';
import {getUrl } from 'vux/src/libs/router'
import global from '@/components/Global'
import qs from "qs";
export default {
    components: {
      InfiniteLoading,
    },
    name: 'AnswerList',
    props: {
      answerlist: Array,
      infinite:false,
    },
    data () {
      return {
          baseUrl: global.baseUrl
      }
    },
    methods: {
        infiniteHandler($state) {
            this.$emit('infinite', $state);
        },
    }
}
</script>

<style lang="less">
@import '~@/style/base.less';

.answer-list {
  .list-item {
    position: relative; display: block; padding: 12px 15px; background: #fff; box-shadow: 0 0 5px rgba(0, 0, 0, 0.1); margin: 12px; border-radius: 8px;
    .item-badge {
      position: absolute; top: 0; right: 15px; padding: 8px 5px 3px; border-radius: 0 0 5px 5px; background: @magenta; color: #fff; font-size: 12px;
    }
    .item-hd {
      margin-bottom: 5px;
      .item-icon {
        background: @blue; display: block; height: 24px; width: 24px; line-height: 24px; text-align: center; color: #fff; font-size: 15px; border-radius: 24px;
      }
    }
    .item-bd {
      min-width: 0; font-size: 1.4rem;
      .item-title {
        position: relative; font-size: 1.4rem; line-height: 1.5; color: #555;
      }
    }
    .item-ft {
      margin-top: 5px;
      .item-time {
        color: #999; font-size: 1.2rem; line-height: 1.5;
      }
    }
  }
}
</style>
