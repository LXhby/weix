<template>
  <div class="knowledge-heart">
    <panel class="mypanel" :list="list" type="1"></panel>
    <grid cols="4" :show-lr-borders="false" :show-vertical-dividers="false" class="heart-list">
      <grid-item v-for="(item, index) in list" link="item.url" :key="index">
        <svg slot="icon" class="icon" aria-hidden="true">
          <use xlink:href="#wxicon-logon-copy"></use>
        </svg>
        <span slot="label" v-html="item.title"></span>
      </grid-item>
    </grid>
  </div>
</template>

<script>
import { Panel, Grid, GridItem } from "vux";
export default {
  components: {
    Panel, Grid, GridItem
  },
  name:'KnowledgeHeart',
  created () {
    this.initData()
  },
  methods: {
    initData(){
      this.$http
      .get('pages',{params:{'PageSearch[remark]':'知识库','PageSearch[config_id]':global.configId,'sort':'id'}})
        .then(response=>{
          response.data.items.forEach(element=>{
            this.list.push({
              src:element.image,
              title:element.title,
              desc:element.summary,
              url:{name:'project-page',params:{'id':element.id}}
            })
          })
        }).catch(error=>{
          console.log(error);
        })
    }
  },
  data () {
    return {
      list: [],
    }
  }
}
</script>

<style lang="less">
@import '~@/style/base.less';

.mypanel {
  .weui-media-box__hd {
    background: #e4e4e4; border-radius: 5px; overflow: hidden;
    .weui-media-box__thumb {
      height: 100%; object-fit: contain;
    }
  }
  .weui-media-box__title {
    font-weight: 800;
  }
}

.heart-list {
  .weui-grid {
    padding: 10px;
    &:after { display: none;}
  }
  .weui-grid__icon {
    height: 36px; width: 36px;
    .icon {
      height: 36px; width: 36px;
    }
  }
  .weui-grid__label {
    font-size: 1.2rem; color: #666;
  }
}
</style>