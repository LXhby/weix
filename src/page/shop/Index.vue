<template>
  <div class="shop">
    <div class="shop-hd">
      <div class="user-info">
        <div class="name">{{username}}</div>
        <div class="avatar"><img :src="useravatar" alt=""></div>
      </div>
      <group class="user-balance">
        <cell title="当前可用" :link="{name:'project-page',params:{'id':12}}">
          <div slot="inline-desc" class="balance-sum"><span>{{balance ? balance : 0}}</span>里程币</div>
          <div slot="value">里程币攻略</div>
        </cell>
      </group>
    </div>
    <div class="shop-bd">
      <tab>
        <tab-item v-for="(item,index) in tabs" @on-item-click="tabitem = item" :key="index" :selected="tabitem === item">{{item}}</tab-item>
      </tab>
      <div class="tab-content" v-show="tabitem === '礼品兑换'">
        <shop-list :shoplist='shoplist' :infinite="true" @infinite="infiniteHandler" @exchange="exchangeHandler"></shop-list>
      </div>
      <div class="tab-content" v-show="tabitem === '兑换记录'">
        <order-list :shoplist='shoprecordlist'></order-list>
      </div>
    </div>

    <div class="terms">
      <p>【声明】</p>
      <p>我们对公众号上所有内容的编辑非常谨慎，并将做持续的内容更新。本微信上的信息不能代替专业的医疗专业建议。此外，我们不对在本微信上发布的第三方文本负责，个人作者对其作品负责。我们不对因使用此类信息所导致的损失承担任何责任。</p>
      <p>本公众号任何内容旨在向患者提供公益项目信息，不涉及任何药品广告或宣传推广。本网站或公众号上的信息仅作为知识提供，不得取代医生或其他有资质的医疗专业人士提供的医疗建议和医疗咨询。本微信上的信息不用于疾病的诊断。</p>
      <p>【使用权】</p>
      <p>中华社会救助基金会医基金-心里程公益项目是本公众号中的全部内容（包括原创内容及原创图片）的专有权利的所有者。所有文本和插图受版权保护。您可以记录我们的信息，并加载到您的主存储器中。您可以转载，但请标明出处。如需要打印，打印版仅供您自己使用；禁止作其他用途，尤其是商业用途。与商标、版权、专利等有关的任何权利或许可证不得授予用户。</p>
      <p>【超链接】</p>
      <p>除自有信息外，我们亦可能提供第三方网站链接。第三方网站的内容和设计超出我们的控制。我们不确保第三方网站上的信息准确或正确。这些链接亦不代表对链接网站之内容的认可、支持或确认。链接网站的个人作者对网页上的信息、意见和事实负责。同样，我们不对链接与目标页面的技术安全负责。因此，我们不对使用这些超链接中包含之信息或使用超链接所导致的任何损失负责。</p>
    </div>
  </div>
</template>

<script>
import { XButton, Tab, TabItem, Group, Cell, CellBox } from "vux"
import ShopList from '@/components/ShopList'
import OrderList from '@/components/OrderList'
import InfiniteLoading from 'vue-infinite-loading';

export default {
  components: {
    XButton, Tab, TabItem, ShopList, Group, Cell, CellBox,
    InfiniteLoading,OrderList
  },
  name:'Shop',
  created(){
    this.initData()
  },  
  methods:{
    initData(){
      let userInfo = JSON.parse(window.localStorage.getItem('userInfo'));
      this.$http.get('patients',{params:{'PatientSearch[wechat_user_id]':userInfo.id,'expand':'wechatuser'}})
        .then(response=>{
          if(response.data.items.length != 0){
            let patient = response.data.items[0]
            let wechat_user = patient.wechatuser
            this.useravatar = wechat_user.headimgurl
            this.username = patient.name
            this.balance = patient.coins
            this.fetchOrder(patient.id)
          }
        }).catch(error=>{
          console.log(error);
        })
    },
    fetchGift($state){
      this.$http.get('gifts',{params:{'GiftSearch[is_delete]':0,page:this.page,sort:'-id','per-page':5}})
        .then(response=>{
          response.data.items.forEach(element=>{
            element.image = this.baseUrl+element.image
            console.log(element.image);
            
            this.shoplist.push(element)
          })
          if($state){
            if(response.data._meta.pageCount > 0) {
                $state.loaded()
            }
            if(response.data._meta.currentPage >= response.data._meta.pageCount){
                $state.complete()
            }
          }
          this.page++
        }).catch(error=>{
          console.log(error)
        })
    },
    
    fetchOrder($id){
      this.$http.get('orders',{params:{'OrderSearch[patient_id]':$id,expand:'gift'}})
        .then(response=>{
          response.data.items.forEach(element=>{
            this.shoprecordlist.push({
               url:'',
               id:element.id,
               image:this.baseUrl+element.gift.image,
               name:element.gift.name,
               summary:element.gift.summary,
               price:element.price,
               num:element.num,
               bought:true,
            })
          })
        }).catch(error=>{
          console.log(error)
        })
    },

    infiniteHandler($state) {
      this.fetchGift($state)
    },
    exchangeHandler($id,$price){
      let userInfo = JSON.parse(window.localStorage.getItem('userInfo'));
      this.$http.get('patients',{params:{'PatientSearch[wechat_user_id]':userInfo.id,'expand':'wechatuser'}})
        .then(response=>{
          if(response.data.items.length == 0){
            this.$vux.toast.text('请先在我要报到登录后再进行操作')
          }else{
            let info = response.data.items[0]
            if(info.coins<600){
              this.$vux.toast.text('一次兑换达到600里程币才能进行兑换')
            }else if(info.coins>600 && info.coins<$price){
              this.$vux.toast.text('里程币不足')
            }else{
              this.$router.push({name:'shop-view',params:{id:$id}})
            }
          }
        }).catch(error=>{
          console.log(error);
        })
    }
  },
  data () {
    return {
      username: '未登录',
      useravatar: '/src/assets/avatar.png',
      balance: '',
      tabs: ["礼品兑换", "兑换记录"],
      tabitem: '礼品兑换',
      shoplist: [],
      shoprecordlist: [],
      page:1,
    }
  },
}
</script>

<style lang="less">
@import '~@/style/base.less';
.shop-hd {
  position: relative; padding: 15px 15px 0;
  &:before {
    content: ""; background: @magenta; position: absolute; top: 0; right: 0; left: 0; bottom: 50px; z-index: 10;
  }
  & > * {
    position: relative; z-index: 20;
  }
  .user-info {
    .display-flex; align-items: center; color: #fff; padding: 0 10px 10px;
    .avatar {
      margin-right: 5px; height: 48px; width: 48px; border-radius: 100%; border: #fff solid 2px; overflow: hidden;
      img {
        background: #e4e4e4; display: block; height: 100%; width: 100%; object-fit: cover;
      }
    }
    .name {
      .flex-1; min-width: 0; font-size: 1.6rem;
    }
  }
  .user-balance {
    .weui-cells {
      box-shadow: 0 0 5px rgba(0, 0, 0, 0.1); border-radius: 5px; overflow: hidden;
      &::before,&::after { display: none;}
      .vux-label {
        color: #999;
      }
    }
    .balance-sum {
      span {
        color: @magenta; font-size: 2.4rem; margin-right: 5px; vertical-align: -2px;
      }
    }
  }
}

.shop-bd {
  .vux-tab {
    background: transparent;
    .vux-tab-item {
      background: transparent;
      .vux-tab-selected {
        border-bottom-width: 0 !important;
      }
    }
    .vux-tab-ink-bar {
      display: none !important;
    }
  }
}

.terms {
  font-size:11px; color: #333; line-height: 150%; padding: 10px;
  p {margin-bottom: 10px;}
}
</style>