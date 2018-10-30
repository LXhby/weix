<template>
  <div class="">
    <div class="weui-cells weui-cells_form">
        <div class="weui-cell">
            <div class="weui-cell__bd">
                <div class="weui-uploader">
                    <div class="weui-uploader__hd">

                        <p class="weui-uploader__title">{{title}}</p>
                        <div class="weui-uploader__info">{{note}}</div>
                    </div>
                    <div class="weui-uploader__bd">
                        <ul class="weui-uploader__files" id="uploaderFiles">
                            <!-- <li  @click="showPic(image.filepath?image.filepath:(baseUrl+image.src))" v-for="(image,index) in prevImages" :key="image.serverId" class="weui-uploader__file" :style="{backgroundImage: 'url(' + (image.filepath?image.filepath:(image.src ? (baseUrl + image.src):defaultImage)) +')'}">
                                <x-icon  type="ios-close-empty" size="20" @click.prevent.stop="removeImg(false, image,index)"></x-icon>
                            </li> -->
                            <li  @click="showPic(image.filepath?image.filepath:(baseUrl+image.src))" v-for="(image,index) in images" :key="image.serverId" class="weui-uploader__file" :style="{backgroundImage: 'url(' + (image.filepath?image.filepath:(image.src ? (baseUrl + image.src):defaultImage)) +')'}">
                                <x-icon  type="ios-close-empty" size="20" @click.prevent.stop="removeImg(true, image,index)"></x-icon>
                            </li>
                        </ul>
                        <div class="weui-uploader__input-box" @click="chooseImage()" v-if="this.images.length<num"></div>
                    </div>
                </div>
            </div>
        </div>
    </div>
    <div v-transfer-dom>
        <previewer :list="src" ref="previewer"></previewer>
    </div>
  </div>
</template>

<script>
import {Previewer,TransferDom} from "vux";
import global from '@/components/Global';
import defaultImage from '@/assets/image.jpg'

export default {
  name: 'ImageUploader',
  components: {
      Previewer,
  },
  directives: {
    TransferDom
  },
  props: {
      value: {
          type: Array
      },
    //   prevImages: {
    //       type: Array,
    //       default: []
    //   },
      title: {
          type: String,
          default: '上传图片'
      },
      note: {
          type: String,
          default: ''
      },
      num:{
          type:Number,
          default:1
      }
  },
  data() {
    return {
        defaultImage: defaultImage,
        images:[],
        src:[]
    };
  },
  created() {
    this.images = this.value
  },
  mounted() {
    this.$on('$ImageUploader:reset', () => {
        this.images = [];
        this.updateValue(this.images)
    });
  },
  methods: {
    reset() {
        this.images = [];
        this.updateValue(this.images)
    },
    updateValue: function (value) {
        if(value===null) value = defaultImage
        this.$emit('input', value)
    },
    chooseImage(event) {
      this.$wechat.chooseImage({
          count: this.num,
          sizeType: ['compressed'], // 可以指定是原图还是压缩图，默认二者都有
          sourceType: ['album','camera'], // 可以指定来源是相册还是相机，默认二者都有
          success: async (res)=> {
            try{
                for (let index = 0; index < res.localIds.length; index++) {
                    const serverId = res.localIds[index];
                    await this.uploadImage(serverId);
                }
            } catch (error){
                console.log(error)
                this.$vux.toast.text(error.response.data.message);
            }
          }
      });
    },
    uploadImage(serverId){
        return new Promise((resolve, reject)=>{
            this.$wechat.uploadImage({
                localId: serverId,
                isShowProgressTips: 1,
                success: (res)=> {
                    var serverId = res.serverId; // 返回图片的服务器端ID
                    this.$http
                      .get('wechat/download-image', {params: {serverId: serverId}})
                      .then(response => {
                        this.images.push({
                            serverId:serverId,
                            src:response.data
                        })
                        this.updateValue(this.images)
                        resolve()
                      })
                      .catch(error => {
                        console.log(error)
                        reject(error)
                      });
                }
            });
        });
    },
    removeImg(is_new, item,index){
      this.$vux.confirm.show({
        content:'确认删除？',
        onConfirm:()=>{      
          this.images.splice(index,1)
          this.$http.post('patient/delete-img',{src:item.src})
            .then(response=>{
                console.log(response);
            }).catch(error=>{
                console.log(error);
            })
        }
      })
    },
    onImgError(item, $event) {
      console.log(item, $event);
    },
    showPic(route){
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
  }
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="less">
@import '~vux/src/styles/weui/weui.less';
@import '~@/style/base.less';

.weui-uploader__hd{
    .weui-uploader__title { font-size: 15px;}
    .weui-uploader__info{ font-size: 12px; }
}
.weui-uploader__file {
    position: relative;
    .vux-x-icon {
        position: absolute; top: 0; right: 0; fill: #fff; background: fade(red, 70%); border-radius: 0 0 0 8px;
      }
}
.weui-uploader__ft {
    font-size: 1.4rem; color: #787878;
}
</style>
