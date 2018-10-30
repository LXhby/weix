<template>
  <baidu-map class="bm-view" :center="centerCity" @ready="handler" ak="YXj45G9DAY3T9WMbwbLwrNqAvcwb4Svp">
    <group class="bm-picker">
      <popup-picker title="选择城市" @on-change="getName" :data="citylist" :columns="2" v-model="value4" show-name></popup-picker>
    </group>
    <!-- <div class="project-count">
        <div class="hd">
          心里程公益项目
          <span class="iconfont wxicon-mark"></span>
        </div>
        <div class="bd">
            <div class="count-item">
                <div class="title"><span class="iconfont wxicon-city"></span>覆盖城市</div>
                <div class="sum">103</div>
            </div>
            <div class="count-item">
                <div class="title"><span class="iconfont wxicon-hospital2"></span>项目医院</div>
                <div class="sum">5936</div>
            </div>
            <div class="count-item">
                <div class="title"><span class="iconfont wxicon-pharmacy"></span>项目药房</div>
                <div class="sum">5445</div>
            </div>
        </div>
    </div> -->
    <!-- 默认显示project-count，选择城市后显示result-box -->
    <div class="result-box">
      <tab :line-width=2 custom-bar-width="60px" v-model="index">
        <tab-item class="vux-center" :selected="demo2 === item" v-for="(item, index) in list2" @click="demo2 = item" :key="index">{{item.title}}</tab-item>
      </tab>
      <swiper v-model="index" :show-dots="false" :style="{ 'height': !reShow ? '100px' : '200px'}">
        <swiper-item v-for="(item, index) in list2" :key="index" :style="{ 'height': !reShow ? '100px' : '200px'}">
          <div class="tab-swiper vux-center">
            <div class="result-list">
              <div @click="setCenter(reitem,index)" class="item" v-for="reitem in item.itemlist" :key="reitem.index">
                {{reitem.name}}
                <br>
                {{reitem.address ? '地址：'+reitem.address : reitem.address}}
                <br>
                {{reitem.doctors ? '医生：'+reitem.doctors : ''}}
              </div>
            </div>
          </div>
        </swiper-item>
      </swiper>
      <div class="result-ft" @click="toggleResult">
        <span v-if="reShow"><x-icon type="ios-arrow-up" size="14"></x-icon> 收起</span>
        <span v-else><x-icon type="ios-arrow-down" size="14"></x-icon> 展开</span>
      </div>
    </div>
  </baidu-map>
</template>

<script>
import { PopupPicker, Group, Tab, TabItem, Swiper, SwiperItem,Value2nameFilter as value2name, } from 'vux'
import global from '@/components/Global'
import qs from "qs";
import Search from 'vue-baidu-map/components/Search/LocalSearch'
import BaiduMap from "vue-baidu-map/components/Map/Map";

export default {
  components: {
    PopupPicker,
    Group,
    Tab,
    TabItem,
    Swiper,
    SwiperItem,
    BaiduMap,
    Search
  },
  name:'XlcMap',
  created(){
    this.getProvinceCity()
  },
  methods: {
    getProvinceCity(){
      let data = {}
      this.$http.post('pap/get-province-city', data)
        .then(response=>{
          this.citylist = response.data
        }).catch(error => {
          console.log(error);
        });;
    },
    getName (value) {
      let data = value2name(value, this.citylist)
      let arr = data.split(''),index = arr.indexOf(' ')
      let province = '',city = ''
      for (let i = 0; i < arr.length; i++) {
        if(i<index){
          province += arr[i]
        }else if(i>index){
          city += arr[i]
        }
      }    
      if(city!='' && province != ''){
        this.centerCity = province + city
        this.fetchHospital(province, city)
        this.fetchDrugstore(province, city)
      }
    },
    //获取项目医院，医生，药房
    fetchHospital(province, city){
      this.$http.post('pap/get-hospital', {'province':province, 'city':city}).then(response=>{  
        this.list2[0].itemlist = []
        response.data.forEach(Element=>{
          this.list2[0].itemlist.push(Element)
          this.hospitalMark(Element.address)
        })
      }).catch(error => {
        console.log(error);
      });;
    },
    //获取药房
    fetchDrugstore(province, city){
      this.$http.post('pap/get-drugstore', {'province':province, 'city':city}).then(response=>{
        this.list2[1].itemlist = []
        response.data.forEach(Element=>{
          this.list2[1].itemlist.push(Element)
          this.drugstoreMark(Element.address)
        })
      }).catch(error => {
        console.log(error);
      })
    },
    toggleResult:function(){
      this.reShow = !this.reShow
    },
    handler ({BMap, map}) {
      this.BMap = BMap;
      this.map = map;
      this.getName(["001000", "001001"])
    },
    hospitalMark(address){
      var myGeo = new this.BMap.Geocoder();
        // 将地址解析结果显示在地图上，并调整地图视野    
        myGeo.getPoint(address, (point)=>{      
            if (point) {
              this.map.addOverlay(new this.BMap.Marker(point))
            }      
        }, 
        this.centerCity);
    },
    drugstoreMark(address){
      var myGeo = new this.BMap.Geocoder();
        // 将地址解析结果显示在地图上，并调整地图视野    
        myGeo.getPoint(address, (point)=>{      
            if (point) {
              // this.map.centerAndZoom(point, 16);
              var myIcon = new BMap.Icon("http://api.map.baidu.com/img/markers.png", new BMap.Size(23, 25), {  
                      offset: new BMap.Size(10, 25), // 指定定位位置  
                      imageOffset: new BMap.Size(0, 0 - 10 * 25) // 设置图片偏移  
                  });  
              this.map.addOverlay(new this.BMap.Marker(point,{icon:myIcon}))
            }      
        }, 
        this.centerCity); 
    },
    setCenter(val,index){
       var opts = {    
            width : 50,     // 信息窗口宽度    
            height: 40,     // 信息窗口高度    
            title : val.name  // 信息窗口标题   
       }    
       var infoWindow = new BMap.InfoWindow(val.address, opts);  // 创建信息窗口对象 
       var mark = new this.BMap.Geocoder();
        // 将地址解析结果显示在地图上，并调整地图视野    
        mark.getPoint(val.address, (point)=>{      
            if (point) {
              this.point = point   
            }
            this.map.centerAndZoom(this.point, 16);
            this.map.openInfoWindow(infoWindow, this.point);
        }, 
        this.centerCity);
    }
  },
  data () {
    return {
      map: null,
      BMap: null,
      centerCity:'北京',
      point:null,
      citylist: [],
      value4: [],
      list2: [
        {
          title: '项目医院',
          itemlist: []
        },
        {
          title: '项目药房',
          itemlist: []
        }
      ],
      index: 0,
      demo2: '美食',
      reHeight: '100',
      reShow: false,
    }
  },
}
</script>

<style lang='less'>
@import '~@/style/base.less';

.bm-view {
  width: 100%; height: 100%; position: fixed; top: 0; right: 0; left: 0; bottom: 0;
}
.bm-picker {
  position: absolute !important; top: 20px; left: 15px; right: 15px;
  .weui-cells {
    border-radius: 44px; box-shadow: 0 0 10px rgba(0, 0, 0, 0.07); color: @red;
    &:first-child {
      margin-top: 0 !important;
    }
    &:before,&:after {
      display: none;
    }
  }
}
.project-count {
  position: absolute !important; bottom: 10px; left: 10px; right: 10px; background: #fff; box-shadow: 0 0 10px rgba(0, 0, 0, 0.07); border-radius: 5px; color: #555;
  .hd {
    position: relative; padding: 10px 15px; font-size: 20px;
    &::after {
      .b-line; left: 15px; right: 15px;
    }
    .iconfont {
      position: absolute; top: -3px; right: 15px; font-size: 36px; color: @red;
    }
  }
  .bd {
    .display-flex; padding: 15px;
    .count-item {
      .flex-1; text-align: center;
      .title {
        font-size: 16px;
      }
      .iconfont {
        color: @blue; margin-right: 5px; font-size: 16px;
      }
    }
  }
}
.result-box {
  position: absolute !important; bottom: 10px; left: 10px; right: 10px; background: #fff; box-shadow: 0 0 10px rgba(0, 0, 0, 0.07); border-radius: 5px; color: #555;
  .vux-slider > .vux-swiper {
    overflow: initial;
    .vux-swiper-item {
      overflow: auto;
    }
  }
  .result-list {
    padding: 10px 15px;
    .item {
      position: relative; padding: 8px 0; font-size: 1.4rem;
      &::after {
        .b-line;
      }
      &::after:last-child { display: none;}
    }
  }
  .result-ft {
    position: relative; padding: 10px; text-align: center; color: #999; font-size: 14px;
    &::before {
      .t-line;
    }
    .vux-x-icon {
      fill: #999; vertical-align: -2px;
    }
  }
}

</style>
