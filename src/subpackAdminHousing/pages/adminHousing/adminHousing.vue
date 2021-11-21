<template>
  <!-- 管理房源首页 -->
  <view class='adminHousing'>
    <view class='adminHeader'>
      <view @tap="switchTab(item)"
            :class="(item.status?'headerItem':'normal')"
            v-for="item in header"
            :key="item.text">
        <view class='underLine'>{{item.text}}</view>
        <view :style="'transform-origin:'+(direction?'-150% 0%':'200% 0')+';'"
              class='line'></view>
      </view>
    </view>
    <view style="width:750rpx;height:100rpx"></view>
    <Owner v-if="currentIndex==0"></Owner>
    <Tenants v-if="currentIndex==1"></Tenants>
    <Room v-if="currentIndex==2"></Room>
    <Income v-if="currentIndex==3"></Income>
  </view>
</template>

<script>
import Owner from './theOwner/theowner.vue';
import Tenants from './tenants/tenants.vue';
import Room from './room/room.vue';
import Income from './income/income.vue';
export default {
  name: 'adminHousing',
  data () {
    return {
      header: [
        { text: '业主', status: true },
        { text: '租客', status: false },
        { text: '房间', status: false },
        { text: '收支记录', status: false }
      ],
      direction: false,
      currentIndex: 0
    }
  },
  onLoad (options) {
    if (options.current) {
      this.currentIndex = options.current
      this.header.forEach((ele, index) => {
        ele.status = false;
        if (index == options.current) {
          ele.status = true;
        }
      })
    }
  },
  methods: {
    switchTab (item) {
      //已被选择下标
      let currentIndex = -1;
      this.header.forEach((ele, i) => {
        if (ele.status == true) {
          currentIndex = i;
        }
      })

      //当前选择下标
      let index = this.header.indexOf(item);
      this.currentIndex = index
      if (index > currentIndex) {
        this.direction = true
      } else {
        this.direction = false
      }
      let temp = this.header;
      this.header = temp.map(ele => {
        ele.status = false;
        if (ele.text == item.text) {
          ele.status = true
        }
        return ele
      })
    }
  },
  components: {
    Owner,
    Tenants,
    Room,
    Income
  }
}
</script>

<style lang='scss' scoped>
.adminHousing {
  .adminHeader {
    background-color: white;
    display: flex;
    height: 100rpx;
    width: 750rpx;
    border-bottom: solid 4rpx #e6e6e6;
    box-sizing: border-box;
    padding: 0rpx 100rpx;
    justify-content: space-between;
    align-items: center;
    font-size: 32rpx;
    font-weight: 500;
    position: fixed;
    top: 0;
    left: 0;
    z-index: 2;
    .normal {
      width: 100%;
      height: 100%;
      text-align: center;
      line-height: 100rpx;
    }
    .headerItem {
      position: relative;
      color: #00a680;
      width: 100%;
      height: 100%;
      text-align: center;
      line-height: 100rpx;
      .line {
        position: absolute;
        left: 50%;
        transform: translateX(-50%);
        bottom: -4rpx;
        content: '';
        display: block;
        width: 100rpx;
        height: 6rpx;
        background-color: #00a680;
        animation: lineAnimate 0.1s ease-in;
      }
    }
  }
}

@keyframes lineAnimate {
  0% {
    // transform: scale(0);
    opacity: 0;
  }
  100% {
    // transform: scale(1);
    opacity: 1;
  }
}
</style>