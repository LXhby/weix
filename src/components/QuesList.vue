<template>
  <div class="ques-list">
    <div class="list-item" v-for="(item,index) in queslist" :key="item.id">
      <span class="item-badge" v-if="item.recommend">精华</span>
      <div class="item-hd">
        <div class="avatar"><img :src="item.avatar" alt=""></div>
        <div class="name">{{item.user}}</div>
      </div>
      <div class="item-bd">
        <div class="item-title">{{item.title}}</div>
        <div class="item-time">{{item.time}}</div>
        <div class="item-reply" v-if="item.reply">
          <div class="reply-cont" >
            <span>项目办回复：</span>
            <div v-html="item.reply"></div>
          </div>
        </div>
      </div>
      <!-- <div class="item-ft" @click="togglereply">
        <span v-if="isHide">展开</span><span v-else>收起</span>回复 &gt;
      </div> -->
    </div>
    <infinite-loading v-if="infinite" @infinite="infiniteHandler" spinner="spiral">
      <span slot="no-results">暂时没有提问</span>
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
import {LoadMore } from 'vux'
export default {
    components: {
      InfiniteLoading,
      LoadMore
    },
    name: 'QuesList',
    props: {
      queslist: Array,
      infinite:false,
    },
    data () {
      return {
          baseUrl: global.baseUrl,
          isHide: true,
      }
    },
    methods: {
        infiniteHandler($state) {
            this.$emit('infinite', $state);
        },
        togglereply: function(){
            this.isHide = !this.isHide;
        }
    }
}
</script>

<style lang="less">
@import '~@/style/base.less';

.ques-list {
  .list-item {
    position: relative; display: block; padding: 12px 15px; background: #fff; box-shadow: 0 0 5px rgba(0, 0, 0, 0.1); margin: 12px; border-radius: 8px;
    .item-badge {
      position: absolute; top: 0; right: 15px; padding: 8px 6px 3px; border-radius: 0 0 5px 5px; background: @magenta; color: #fff; font-size: 12px;
    }
    .item-hd {
      .display-flex; align-items: center;
      .avatar {
        margin-right: 5px; height: 40px; width: 40px; object-fit: cover;
        img {
          background: #e4e4e4; display: block; height: 100%; width: 100%; border-radius: 100%;
        }
      }
      .name {
        .flex-1; min-width: 0; font-size: 1.5rem;
      }
    }
    .item-bd {
      font-size: 1.4rem; margin-left: 45px; 
      .item-title {
        position: relative; font-size: 1.4rem; line-height: 1.5; color: @red;
      }
      .item-time {
        font-size: 1.2rem; color: #999; padding: 5px 0;
      }
      .item-reply {
         position: relative; background: #f2f2f5; border-radius: 5px; color: #999; padding: 10px; margin-top: 5px;
        &::before {
          .arrow-t; position: absolute; background: #f2f2f5; border-color: #f2f2f5; top: 0; left: 20px;
        }
        .reply-cont {
          text-align: justify; color: #000;
          &.hide {
            overflow: hidden; text-overflow: ellipsis; display: -webkit-box; -webkit-line-clamp: 3; -webkit-box-orient: vertical; word-break: break-word;
          }
        }
        span { color: #666;}
      }
    }
    .item-ft {
      margin-top: 10px; margin-left: 45px; line-height: 2; color: #999;;
    }
  }
}
</style>
