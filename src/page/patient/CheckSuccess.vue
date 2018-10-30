<template>
	<div class="page with-ft">
    <div class="mymsg">
      <div class="hd"><icon type="success"></icon></div>
      <div class="bd">
        <h3>审核材料上传成功</h3>
        <p>请耐心等待项目办工作人员审核，审核工作将在5个工作日完成。</p>
      </div>
    </div>
    <div style="padding: 30px 30px">
      <div class="mylogin-tips">
        项目热线咨询：<a href="tel:4000822072" style="color:#666">4000822072</a><br/>
        项目邮箱：brilintapap@163.com<br/>
        网址：brilintapap.mpf.org.cn<br/>
        资料邮寄地址（只接收EMS特快专递）:<br/>
        上海邮政011-032信箱中华社会救助基金会<br/>
        心里程公益项目II期办公室收
      </div>
    </div>
    <div class="page-ft" v-transfer-dom>
      <x-button type="warn" @click.native="toIndex()">返回首页</x-button>
    </div>
	</div>
</template>


<script>
import {XButton,Icon,TransferDom} from 'vux'
import global from '@/components/Global'
import ImageUploader from '@/components/ImageUploader'

export default {
    directives: {
        TransferDom
    },
  components: {
    XButton,
    Icon
  },
  created(){
  },
  methods: {
    toIndex(){
      this.$wechat.closeWindow()
    },
  },
  data () {
    return {
      title: '上传资料',
      info: '资料资料',
    }
  },
}
</script>

<style lang='less'>
@import '~@/style/base.less';

.mymsg {
  .display-flex; align-items: center; margin: 10px; background: #fff; border-radius: 5px; box-shadow: 0 0 10px rgba(0, 0, 0, 0.1); padding: 15px;
  .hd {
    .weui-icon-success {
      font-size: 4.4rem;
      &::before { margin-left: 0;}
    }
  }
  .bd {
    .flex-1;
    h3 { color: @red; font-size: 1.6rem;}
    p { color: #787878; font-size: 1.2rem; line-height: 1.3; }
  }
}

.mytimeline {
  .vux-timeline {
    padding: 1rem 2rem;
  }
  .vux-timeline-item-content {
    padding-left: 1.8rem;
  }
	p {
		color: #888;
		font-size: 0.8rem;
	}
	h4 {
		color: #666;
		font-weight: normal;
	}
	.recent {
		color: rgb(4, 190, 2)
	}
}

</style>
