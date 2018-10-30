<template>
  <div class="shop-order">
    <form-preview header-label="本次使用" :header-value="cost" :body-items="list" :footer-buttons="buttons1"></form-preview>
  </div>
</template>

<script>
import { XButton, FormPreview } from "vux"

export default {
  components: {
    XButton, FormPreview
  },
  name:'ShopOrder',
  created(){
    this.initData()
  },
  methods:{
    initData(){
      this.$http.get('orders',{params:{'OrderSearch[id]':this.$route.params.id,expand:'patient,gift'}})
        .then(response=>{
          let order = response.data.items[0]
          let patient = response.data.items[0].patient
          let gift = response.data.items[0].gift
          this.list[0].value = gift.name
          this.list[1].value = patient.name
          this.list[2].value = order.created_at
          this.list[4].value = patient.mobile
          this.list[5].value = order.province+order.city+order.county+order.address
          this.cost = order.price+'里程币'
        }).catch(error=>{
          console.log(error);
        })
    }
  },
  data () {
    return {
      cost:'',
      list: [
        {
          label: '礼品',
          value: ''
        },
        {
          label: '兑换人',
          value: ''
        },
        {
          label: '兑换时间',
          value: ''
        },
        {
          label: '状态',
          value: '已兑换'
        },
        {
          label: '联系电话',
          value: ''
        },
        {
          label: '邮寄地址',
          value: ''
        }
      ],
      buttons1: [
        {
          style: 'primary',
          text: '返回杂货铺',
          onButtonClick: (name) => {
            this.$router.push({name:'shop'})
          }
        }
      ],
    }
  },
}
</script>

<style lang="less">
@import '~@/style/base.less';
.shop-order {
  font-size: 1.4rem;
  .weui-form-preview__hd {
    .weui-form-preview__value {
      color: @magenta;
    }
  }
  .weui-form-preview__bd {
    font-size: 1.4rem;
  }
  .weui-form-preview__btn_primary {
    color: @magenta;
  }
}

</style>