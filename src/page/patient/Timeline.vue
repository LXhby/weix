<template>
	<div class="mytimeline">
		<timeline :color="color">
			<timeline-item v-for="item in list" :key="item.id">
				<h4 class="recent">{{item.content}}</h4>
        <p>{{item.remark}}</p>
        <p class="time">{{item.created}}</p>
			</timeline-item>
		</timeline>
	</div>
</template>


<script>
import {XButton,Timeline,TimelineItem} from 'vux'
import { Carousel, Slide } from 'vue-carousel';
import global from '@/components/Global'
import qs from 'qs'

export default {
  components: {
    XButton,
    Timeline,
    TimelineItem
  },
  beforeCreate(){
    let id = this.$route.params.id
    this.$http.post('pap/applys-going', {id:id}).then(response=>{
      response.data.forEach(Element=>{
        this.list.push(Element)
      })
    }).catch(error => {
      console.log(error);
    })  
  },
  created () {
    
  },
  methods: {
    
  },
 data () {
    return {
        list:[
          {
            content: '12e324ewerfwe',
            remark: 'wregsdfgewrt',
            created: '12e34treter'
          },
          {
            content: '12e324ewerfwe',
            remark: 'wregsdfgewrt',
            created: '12e34treter'
          },
          {
            content: '12e324ewerfwe',
            remark: 'wregsdfgewrt',
            created: '12e34treter'
          },
          {
            content: '12e324ewerfwe',
            remark: 'wregsdfgewrt',
            created: '12e34treter'
          },
          {
            content: '12e324ewerfwe',
            remark: 'wregsdfgewrt',
            created: '12e34treter'
          },
        ],
        color:'#CC0001',
    }
  },
}
</script>

<style lang='less'>
@import '~@/style/base.less';

.mytimeline {
  .vux-timeline {
    padding: 1rem 2rem;
  }
  .vux-timeline-item-content {
    padding-left: 1.8rem;
  }
	p {
		color: #666; font-size: 1.4rem; line-height: 1.4;
    &.time {
      font-size: 1.2rem; color: #aaa;
    }
	}
	h4 {
		color: #666; font-size: 1.6rem;
		font-weight: normal;
	}
	.recent {
		color: @red;
  }
  .vux-timeline-item-head {
    width: 16px; height: 16px; left: -2px;
    .vux-timeline-item-checked {
      display: block !important; font-family: 'iconfont'; width: 16px; height: 16px;
      &::before {
        content: "\e604"; width: 16px; height: 16px; font-size: 12px; left: 2px; top: 3px;
      }
    }
  }
  .vux-timeline-item-head-first {
    top: 2px;
  }
}

</style>
