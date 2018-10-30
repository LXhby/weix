<template>
  <div class="page with-ft with-hd">
  </div>
</template>
<script>
import global from '@/components/Global'
export default {
  components: {

  },
  name: 'Move',
  created(){
    this.initData()
  },
  methods:{
    initData(){
      let userInfo = JSON.parse(window.localStorage.getItem('userInfo'))
      this.$http.get('empowers', {params: {'expand': 'user', 'EmpowerSearch[wechat_user_id]':userInfo.id}})
        .then(response=>{
          console.log(response);
          if(response.data.items == ''){
            this.$router.push({name:'assist-login'})
          }else{
            this.$router.push({name:'assist-detail'})
          }
        }).catch(error=>{
            console.log(error);
        });
    },
  },
  data () {
    return {
    }
  }
}
</script>

<style lang="less">
.banner-box {
  width: 100%; overflow: hidden;
}
.record-banner {
  position: relative; margin: 10px 15px; height: 0; padding-top: 32%; overflow: hidden; background: center center no-repeat; background-size: 100% 100%;
  .banner-text {
    position: absolute; top: 50%; left:54px; margin-top: -30px; color: #fff; font-size: 14px; line-height: 20px;
    p {
      font-weight: bold; font-size: 36px; line-height: 1.33;
    }
  }
}
</style>