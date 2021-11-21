<template>
  <view class="map-poi-box">
    <view class="map-poi-tabs">
      <view v-for="(item, index) in poiTabList"
            :key="index"
            :class="{active: index === poiTabIndex}"
            @tap="switchPoiTab(index)"
            class="poi-tab-item">{{item}}</view>
    </view>
    <view class="map-container"
          v-if="location">
      <map :markers="markers"
           :latitude="mapLocation.lat"
           :longitude="mapLocation.lng"
           scale="14"
           @markertap="showMarkerAddress"
           @tap="toMap"
           class="map-box"></map>
      <cover-view v-if="showMarker"
                  @tap="toMap(true)"
                  class="marker-address">{{showMarker.title}}: {{showMarker.address}}</cover-view>
    </view>
  </view>
</template>

<script>
// 地图工具
import coordTransform from '@/function/libs/coord-transform';
import mt from '../function/map-tool.js';

const {
  MapTool,
  poiTypeList,
} = mt;

let mapTool = new MapTool();

export default {
  name: 'MapPoiBox',
  props: {
    location: {
      type: Object,
    },
    title: String,
    address: String,
  },
  data () {
    return {
      poiTabList: poiTypeList,
      poiTabIndex: 0,
      markerList: [],
      markerAddress: '',
      showMarker: null,
      mapLocation: {
        lat: 30,
        lng: 104,
      },
    };
  },
  computed: {
    markers () {
      const list = this.markerList.slice();
      list.unshift(this.pointMarker);
      return list;
    },
    pointMarker () {
      const item = {
        id: Date.now(),
        title: this.title,
        address: this.address,
        location: this.mapLocation,
        type: 'house',
      };
      return mapTool.createMarker(item);
    },
  },
  mounted () {
    mapTool = new MapTool();
    if (this.location) {
      // 处理百度坐标系
      const location = { ...this.location };
      const [lng, lat] = coordTransform.bd09togcj02(location.lng, location.lat);
      this.mapLocation.lat = lat;
      this.mapLocation.lng = lng;
      mapTool.location = { ...this.mapLocation };
      this.searchMapPoi();
    }
  },
  onShow () {

  },
  watch: {
    location () {
      if (this.location) {
        // 处理百度坐标系
        const location = { ...this.location };
        const [lng, lat] = coordTransform.bd09togcj02(location.lng, location.lat);
        this.mapLocation.lat = lat;
        this.mapLocation.lng = lng;
        mapTool.location = { ...this.mapLocation };
      }
    },
  },
  methods: {
    // 切换poi数据
    switchPoiTab (index) {
      this.poiTabIndex = index * 1;
      this.searchMapPoi();
    },
    /**
     * 搜索附近数据
     */
    async searchMapPoi () {
      this.markerList = await mapTool.searchPoi(this.poiTabIndex);
    },
    /**
     * 显示marker地址
     */
    showMarkerAddress (e) {
      this.showMarker = mapTool.getMarkerPopup(e.markerId);
      this.showMarkerID = e.markerId;
    },
    /**
     * 去地图页面
     */
    toMap (status) {
      let url = '/pages/xiaoqu/map-poi';
      url = `${url}?lat=${this.location.lat}&lng=${this.location.lng}&poi=${this.poiTabIndex}`;
      if (status && this.showMarkerID) {
        url = `${url}&markerId=${this.showMarkerID}`;
      }
      this.$$globalData.houseMarker = { ...this.pointMarker };
      uni.navigateTo({
        url,
      });
    },
  },
}
</script>

<style lang="scss">
.map-poi-tabs {
  display: flex;
  flex-wrap: wrap;
  flex-direction: row;
  justify-content: space-between;
  margin-bottom: 10rpx;
  padding: 0 30rpx;
  .poi-tab-item {
    position: relative;
    line-height: 60rpx;
    font-size: 28rpx;
    color: #333;
    &.active {
      color: #00a680;
      &::after {
        content: '';
        position: absolute;
        bottom: 0;
        left: 10rpx;
        right: 10rpx;
        height: 6rpx;
        background: #00a680;
      }
    }
  }
}
.map-container {
  position: relative;
  width: 100%;
  height: 400rpx;
  .map-box {
    width: 100%;
    height: 100%;
  }
  .marker-address {
    position: absolute;
    right: 0;
    bottom: 0;
    left: 0;
    height: 70rpx;
    padding: 0 30rpx;
    line-height: 70rpx;
    font-size: 24rpx;
    text-align: center;
    color: #fff;
    background: rgba(0, 0, 0, 0.5);
  }
}
</style>
