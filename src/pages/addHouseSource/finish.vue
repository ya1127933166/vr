<template>
  <view class="finish-page"
        style='background-color: #FFFFFF;     height: 47vh;'>
    <view class="finish_top">
      <view class="top_icon">

      </view>
      <view class="top_text">
        {{displayText}}已{{sourceText}}
      </view>
    </view>
    <view class='nextBtn'
          @tap='details'>查看详情</view>
    <view @tap='goContinue'
          v-if="source!='修改'"
          class='nextBtn'
          style='color: #00a680;background-color:#FFFFFF ;font-weight: 600;margin-bottom:30rpx'>继续录入</view>
  </view>
</template>

<script>
export default {
  name: "finish",
  data () {
    return {
      info: '',
      jumpType: '',
      displayText: '房源',
      contractId: 0,
      source: '',
      sourceText: '录入'
    }
  },
  onLoad (options) {
    const { origin, type, contractId, source } = options
    this.info = JSON.parse(type || '{}')
    this.displayText = origin === 'contract' ? '合同' : '房源'
    this.contractId = contractId
    if (this.info.saleId === undefined) {
      this.jumpType = '租房'
    } else {
      this.jumpType = '二手房'
    }
    //判断房源修改还是添加状态
    this.source = source
    if (source == '修改') {
      this.sourceText = '修改'
      uni.setNavigationBarTitle({
        title: '修改完成',
      })
    }
  },
  methods: {
    details () {
      if (this.contractId) {
        uni.navigateTo({
          url: `../../subpackTenantContract/pages/tenantContract/detailsContract?contractId=${this.contractId}`,
        })
      } else if (this.jumpType == '二手房') {
        let obj = {}
        obj.id = this.info.saleId
        obj.name = this.info.name
        uni.navigateTo({
          url: '../../subpackComm/pages/viewHousing/viewHousing?type=1&houseId=' + JSON.stringify(obj),
        })
      } else {
        let obj = {}
        obj.id = this.info.rentId
        obj.name = this.info.name
        uni.navigateTo({
          url: '../../subpackComm/pages/viewHousing/viewHousing1?type=1&houseId=' + JSON.stringify(obj),
        })
      }
    },
    goContinue () {
      uni.reLaunch({
        url: this.$$globalData.jumpPath || "../tabbar/home"
      })
    }
  }
}
</script>

<style lang='scss' scoped>
// page{
// 	height: 70vh;
// }
.finish-page {
  min-height: 620rpx;
}
.finish_top {
  width: 750rpx;
  overflow: hidden;
  // height: 60vh;
  /* height: 200rpx; */
  .top_icon {
    margin: 100rpx auto 0;
    height: 120rpx;
    width: 120rpx;
    border-radius: 50%;
    // background-color: #00A680;
    background-image: url('https://uss.img.lezhulife.com/xcxicon/result_ok.png');
    background-size: cover;
    color: #ffffff;
    font-size: 40rpx;
    view {
      height: 80rpx;
      line-height: 80rpx;
      text-align: center;
    }
  }
  .top_text {
    width: 150rpx;
    font-size: 30rpx;
    margin: 20rpx auto 30rpx;
  }
}
.nextBtn {
  width: 680rpx;
  height: 100rpx;
  background-color: #00a680;
  color: white;
  line-height: 100rpx;
  text-align: center;
  margin: 30rpx auto;
  border-radius: 10rpx;
  font-size: 34rpx;
  &:active {
    background: #007e5e;
  }
}
</style>
