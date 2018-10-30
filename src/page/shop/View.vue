<template>
  <div class="page with-ft shop-view">
    <div class="view-hd">
      <div class="preview">
        <img :src="photo" alt="">
      </div>
      <div class="product-info">
        <div class="price">
          <span>{{price}}</span>里程币
        </div>
        <div class="title">
          {{title}}
        </div>
        <group class="amount">
          <cell :title="'合计：' + totalPrice +'里程币'">
            <inline-x-number style="display:block;" :min="1" v-model="num" width="50px"></inline-x-number>
          </cell>
        </group>
      </div>
    </div>
    <div class="view-bd">
      <div class="product-subtitle">礼品详情</div>
      <div class="product-detail">
        <p>{{summary}}</p>
      </div>
    </div>
    <div class="page-ft" v-transfer-dom>
      <x-button type="warn" @click.native="exchange(price)">兑换礼品</x-button>
    </div>
  </div>
</template>

<script>
import { XButton, Group, Cell, InlineXNumber, TransferDomDirective as TransferDom } from "vux"

export default {
  directives: {
    TransferDom
  },
  components: {
    XButton, Group, Cell, InlineXNumber
  },
  name:'ShopView',
  created(){
    this.initData()
  },
  computed:{
    totalPrice: function () {
      return this.num*this.price
    }
  },
  methods:{
    initData(){
      this.$http.get('gifts/'+this.$route.params.id)
        .then(response=>{
          let gift = response.data
          this.gift = gift
          this.price = gift.price
          this.photo = this.baseUrl+gift.image,
          this.title = gift.name,
          this.summary = gift.summary,
          this.total = gift.price
        }).catch(error=>{
          console.log(error);
        })
    },
    exchange($price){
      let userInfo = JSON.parse(window.localStorage.getItem('userInfo'));
      this.$http.get('patients',{params:{'PatientSearch[wechat_user_id]':userInfo.id,'expand':'wechatuser'}})
        .then(response=>{
          if(response.data.items.length == 0){
            this.$vux.toast.text('请先在我要报到登录后再进行操作')
          }else{
            let info = response.data.items[0]
            if($price*this.num<600){
              this.$vux.toast.text('一次兑换达到600里程币才能进行兑换')
            }else{
              if(info.coins<$price*this.num){
                this.$vux.toast.text('里程币不足')
              }else{
                this.$router.push({
                  name:'shop-exchange',
                  params:{
                    'gift_id':this.gift.id,
                    'patient_id':response.data.items[0].id,
                    'num':this.num,
                    'price':this.gift.price
                  }
                })
              }
            }
          }
        }).catch(error=>{
          console.log(error);
        })
    }
  },
  data () {
    return {
      price: '',
      photo: '',
      title: '',
      summary:'',
      gift:{},
      num:1,
    }
  },
}
</script>

<style lang="less">
@import '~@/style/base.less';
.shop-view {
  .preview {
    position: relative; width: 100%; height: 0; padding-top: 56.25%;
    img {
      position: absolute; top: 0; left: 0; width: 100%; height: 100%; object-fit: cover;
    }
  }
  .product-info {
    position: relative; box-shadow: 0 0 5px rgba(0, 0, 0, 0.15); border-radius: 5px; overflow: hidden; margin: -30px 15px 15px; background: #fff; overflow: hidden;
    .price {
      padding: 10px 15px 0; color: @magenta; font-size: 1.4rem;
      span {
        font-size: 2rem; margin-right: 5px; vertical-align: -2px;
      }
    }
    .title {
      padding: 5px 15px; color: #444; font-size: 1.6rem;
    }
    .amount {
      .weui-cells {
        margin-top: 0 !important; font-size: 1.4rem; color: #999;
        &::before,&::after { display: none;}
        .weui-cell {
          padding: 0 15px 15px;
        }
      }
    }
  }
}
.product-subtitle {
  margin: 0 25px; color: #444; font-size: 1.5rem; line-height: 2;
}
.product-detail {
  position: relative; box-shadow: 0 0 5px rgba(0, 0, 0, 0.15); border-radius: 5px; overflow: hidden; margin: 0 15px 15px; background: #fff; padding: 15px;
  font-size: 1.5rem; line-height: 1.5; color: #444;
  img {
    vertical-align: middle; max-width: 100%;
  }
  p {
    margin-bottom: 10px;
  }
}

</style>