<template>
    <div>
        <flexbox :gutter="0" class="nav vux-1px-b">
            <flexbox-item>
                <x-button type="default" :mini="true" @click.native="addText"><i class="iconfont icon-wenzi"></i>添加文字</x-button>
            </flexbox-item>
            <flexbox-item>
                <x-button type="default" :mini="true" @click.native="addImage"><i class="iconfont icon-tupian"></i>添加图片</x-button>
            </flexbox-item>
        </flexbox>
        <group>
            <div class="item vux-1px" v-for="(item, index) in items">
                <div class="toolbar">
                    <i @click="removeItem(index)" class="iconfont icon-shanchu"></i>
                    <i @click="upItem(index)" class="iconfont icon-xiayi"></i>
                    <i @click="downItem(index)" class="iconfont icon-shangyi"></i>
                </div>
                <x-textarea v-if="item.type==='text'" placeholder="请输入文字内容" @keyup.native.27="confirm()" @keyup.native.4="confirm()" ref="input" :rows="3" v-model="item.value" :autosize="true"></x-textarea>
                <div v-if="item.type==='image'" class="image-item">
                    <img :src="item.value" height="80px">
                </div>
            </div>
        </group>
        <div style="padding:15px;">
            <x-button type="warn" @click.native="confirm()">确定</x-button>
            <x-button type="default" @click.native="cancel()">返回</x-button>
        </div>
    </div>
</template>

<script>
import { Group, XTextarea, XButton, Flexbox, FlexboxItem } from 'vux'
import global from '@/components/Global';
import imageUpload from '@/assets/image_upload.png'

export default {
  name: 'RichTextEditor',
  components: {
    Group,
    XButton,
    XTextarea,
    Flexbox, FlexboxItem
  },
  props: {
      value: String
  },
  data() {
      return {
          items: []
      }
  },
  created(){
      this.init()
  },
  watch: {
    value: function (newValue) {
      this.updateValue(newValue)
      this.init()
    }
  },
  methods: {
    updateValue: function (value) {
      this.$emit('input', value)
    },
    init(){
        this.items = []
        if(this.value){
            var rgExp = /<p>[\s\S]+?<\/p>/img
            var imgRgExp = /<img\s*src=\"([^\"]*?)\"[^>]*>/im
            var pRgExp = /<p>([\s\S]+?)<\/p>/im
            var paragraphs = this.value.match(rgExp)
            for (let index = 0; index < paragraphs.length; index++) {
                const element = paragraphs[index];
                if(true===imgRgExp.test(element)){
                    this.items.push({ type: 'image', 'value': this.baseUrl + RegExp.$1})
                }
                else if(true===pRgExp.test(element)){
                    this.items.push({ type: 'text', 'value': RegExp.$1.replace(/<br>/g, "\n")})
                }
            }
        }
    },
    confirm(){
        var html = []
        for (let index = 0; index < this.items.length; index++) {
          const element = this.items[index];
          if(element.type ==='text'){
              html.push('<p>'+element.value.replace(/\n/ig, '<br>')+'</p>')
          }
          if(element.type ==='image' && element.value != imageUpload){
              html.push('<p><img src="'+element.value.replace(this.baseUrl, '')+'"></p>')
          }
        }
        html = html.join("\n")
        this.updateValue(html)
        this.$emit('confirm')
    },
    cancel(){
        this.$emit('cancel')
    },
    addText() {
        this.items.push({type:'text'})
    },
    swapItems(arr, index1, index2) {
        arr[index1] = arr.splice(index2, 1, arr[index1])[0];
        return arr;
    },
    removeItem(index){
        this.items.splice(index, 1)
    },
    upItem(index){
        if(index == 0) {
            return;
        }
        this.swapItems(this.items, index, index - 1);
    },
    downItem(index){
        if(index == this.items.length -1) {
            return;
        }
        this.swapItems(this.items, index, index + 1);
    },
    addImage(index) {
      let _this = this;
      this.$wechat.chooseImage({
          count: 1, // 默认9
          sizeType: ['compressed'], // 可以指定是原图还是压缩图，默认二者都有
          sourceType: ['album', 'camera'], // 可以指定来源是相册还是相机，默认二者都有
          success: function (res) {
              var localId = res.localIds[0]; // 返回选定照片的本地ID列表，localId可以作为img标签的src属性显示图片
              _this.$wechat.uploadImage({
                localId: localId,
                isShowProgressTips: 1,
                success: function (res) {
                    var serverId = res.serverId; // 返回图片的服务器端ID
                    _this.$http
                      .get('wechat/download-image', {params: {serverId: serverId}})
                      .then(response => {
                        _this.items.push({type:'image', value: _this.baseUrl + response.data})
                      })
                      .catch(error => {
                        _this.$vux.toast.text(error.response.data.message);
                      });
                }
            });
          }
      });
    },
    onImgError(item, $event) {
      console.log(item, $event);
    }
  }
}
</script>

<style lang="less" scoped>
@import '~vux/src/styles/1px.less';
.nav {
  padding: 10px; position: relative; background: #fff; box-sizing: border-box;
  .vux-flexbox-item {
    padding:0 10px;
    button {width:100%;}
  }
}
.item {
    margin:10px;
    .image-item {text-align: center;}
}
.toolbar {
    text-align: right;
    i {margin-left:10px;}
}
</style>
