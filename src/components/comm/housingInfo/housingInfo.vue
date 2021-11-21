<template>
  <view :class="['housing-info', hasArrowRight ? 'between-box' : '']"
        @tap="funcBoxTap">
    <view class="info-title"
          :style="{marginLeft:(housingInfo.isFlag?'28rpx':'20rpx'),width:(housingInfo.isFlag?'30%':'20%')}">{{infoTitle}}</view>
    <view class="info-detail"
          v-if="housingInfo">
      <view class="first-line">
        <view v-if="infoFirstTitle">
          {{infoFirstTitle|| ''}}
        </view>
        <block v-else-if="(housingInfo.xqName && housingInfo.houseUnit) || !housingInfo.fullTitle">
          <view class="border"
                :style="{paddingRight:(housingInfo.isFlag?'15rpx':''),display:(housingInfo.isFlag?'block':'contents')}">
            {{housingInfo.xqName  || ''}}
          </view>

          <view class="border"
                :style="{paddingRight:(housingInfo.isFlag?'30rpx':''),display:(housingInfo.isFlag?'block':'contents')}">
            {{ housingInfo.houseNumber|| ''}}
          </view>
          <view :style="{marginRight:(housingInfo.isFlag?'15rpx':''),display:(housingInfo.isFlag?'block':'contents')}">
            {{ housingInfo.houseUnit|| ''}}
          </view>
        </block>
        <view class="border"
              v-else>
          {{ housingInfo.fullTitle || ''}}{{' '}}
        </view>
        <view v-if="housingInfo.orientation">
          {{ housingInfo.orientation || ''}}{{' '}}
        </view>
        <view v-if="housingInfo.listPrice && !hasArrowRight">
          {{housingInfo.listPrice|| ''}}{{housingInfo.priceUnit || ''}}{{' '}}
        </view>
        <view v-if="housingInfo.areaSize">
          {{housingInfo.areaSize|| ''}}m²{{' '}}
        </view>
      </view>
      <view class="info-location"
            v-if="housingInfo.area">
        {{housingInfo.area|| ''}}
      </view>
    </view>
    <view v-if="housingInfo.listPrice && hasArrowRight"
          class="info-func-box">
      <view class="info-price"
            :style="{fontWeight:(housingInfo.isFlag?'800':'')}">{{housingInfo.listPrice|| ''}}{{housingInfo.priceUnit || ''}}</view>
      <view class="cuIcon-right info-arrow"></view>
    </view>
  </view>
</template>

<script>
export default {
  name: "housingInfo",
  props: {
    infoTitle: {
      type: String,
      default: '房源'
    },
    housingInfo: {
      type: Object,
      default: {
        rentId: '',
        saleId: '',
        fullTitle: '天鹅湖二期 12-3-1203',
        houseUnit: '2室1厅1卫',
        areaSize: '130.2',
        price: 280.5,
        area: '成都 某旮旯',
        priceUnit: ''
      }
    },
    infoFirstTitle: {
      type: String,
      default: ''
    },
    hasArrowRight: {
      type: Boolean,
      default: false
    },
    arrowFunc: {
      type: Function
    },
  },
  mounted () {
    // console.log('housingInfo',this.housingInfo)
  },
  methods: {
    funcBoxTap (e) {
      if (this.arrowFunc) {
        if (typeof this.arrowFunc === 'function') {
          this.arrowFunc(e)
        } else {
          console.warn('arrowFunc in housingInfo is not a func')
        }
      }
    }
  }
}
</script>

<style lang="scss" scoped>
.housing-info {
  width: 100%;
  height: 180rpx;
  display: flex;
  align-items: center;
  padding: 10rpx 20rpx;
  background-color: #ffffff;
  &.between-box {
    justify-content: space-between;
  }
  .info-title {
    display: flex;
    justify-content: flex-start;
    align-items: center;
    width: 20%;
    max-width: 200rpx;
  }
  // .info-title1{
  //     display: flex;
  //     justify-content: flex-start;
  //     align-items: center;
  //     width: 25%;
  //     max-width: 200rpx;
  // }
  .info-detail {
    width: 60%;
    .first-line {
      display: flex;
      flex-wrap: wrap;
      & > view {
        //font-weight: 800;
        display: contents;
        line-height: 38rpx;
      }
      .border {
        font-weight: 800;
      }
    }
    .ellipsis {
      overflow: hidden;
      text-overflow: ellipsis;
      display: -webkit-box;
      -webkit-line-clamp: 2;
      -webkit-box-orient: vertical;
    }
    .info-location {
      font-size: 24rpx;
    }
  }
  .info-func-box {
    display: flex;
    align-items: center;
    height: 100%;
    position: relative;
    .info-price {
      width: 10%;
      min-width: 110rpx;
      color: #ea6b66;
      margin-right: 15rpx;
      text-align: right;
      line-height: 50rpx;
      min-height: 50rpx;
      height: fit-content;
      white-space: nowrap;
      //text-overflow: ellipsis;
    }
    .info-arrow {
      position: absolute;
      right: -10rpx;
    }
  }
}
</style>
