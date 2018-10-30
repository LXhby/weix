<template>
  <div class="weui-article">
    <h1>
        {{article.title}}
        <!-- <div class="summary display-flex">
            <span class="flex-1">讲者：刘大海</span>
            <span class="flex-1">时间：2016-08-30</span>
        </div> -->
        <div class="summary weui-flex">
            <span class="flex-1">心里程患者援助项目Ⅱ期</span>
        </div>
    </h1>
    <section v-html="article.content"></section>
  </div>
</template>
<script>

export default {
    components: {

    },
    name: 'WeuiArticle',
    props: {
        article:{}
    },
    data () {
      return {
      }
    },
    methods: {

    }
}
</script>

<style lang="less">
@import '~vux/src/styles/weui/widget/weui_page/weui_article';
@import '~@/style/base.less';

.weui-article {
    h1 {
        text-align: center; font-weight: bold; font-size: 20px; border-bottom: #e4e4e4 solid 1px;
        .summary {
            font-weight: normal; font-size: 13px; color: #666; margin-bottom: 5px;
            span { text-align: center;}
        }
    }
    section {
        color: #444;
        h3 { font-weight: bold; font-size: 17px; color: #333;}
        img { width: 100%; height: auto;}
    }
}
</style>
