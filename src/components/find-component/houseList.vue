<template>
  <view class='houseList'>
    <view v-if='indexCurry==0'
          @tap="clickItem"
          class='houseItem'>
      <image style="width:220rpx;height:165rpx"
             class='itemLeft'
             :src='List.publicPics[0]'></image>
      <!-- <view class="itemLeft">
                  <view class="cuIcon-camerafill"></view>
                  <view class="leftText">暂无图片</view>
              </view> -->
      <!-- <image v-else style="width:220rpx;height:165rpx" class='itemLeft' src='https://uss.img.lezhulife.com/xcximages/house-none.png?v=1'></image> -->
      <view class="itemRight">
        <view class="rightTop">
          <view class="topLeft">
            <view class="name">
              <span>{{List.house.name}}</span>
              <span>{{List.houseUnit}}</span>
              <span>{{List.house.orientation}}</span>
            </view>

            <view class="addr">
              <block v-for="(item,index) in List.property"
                     :key='index'>
                <view class="item">
                  {{item.property}}
                </view>
              </block>
            </view>
            <view class="info">
              <view>{{List.houseUnit}}</view>
              <view class="line"></view>
              <view>{{List.house.areaSize}}m²</view>
              <view class="line"></view>
              <view>{{List.house.orientation}}</view>
              <!-- <view class="line"></view>
							  <view>{{List.house.name}}</view> -->
            </view>
          </view>
        </view>
        <view class="bottom_list">
          <view class="bottom_left">
            {{List.houseSale.listPrice}}万
          </view>
          <view class="bottom_right">
            {{List.sellPrice}}元/平
          </view>
        </view>
      </view>
    </view>
    <view v-else-if='indexCurry==1'
          @tap="clickItem"
          class='houseItem'>
      <image style="width:220rpx;height:165rpx"
             class='itemLeft'
             :src='List.publicPics[0]'></image>
      <view class="itemRight">
        <view class="rightTop">
          <view class="topLeft">
            <view class="name">{{List.fullTitle || `${List.rentalType}·${List.name}·${List.houseUnit}`}}</view>
            <view class="addr">
              <block v-for="(item,index) in List.property"
                     :key='index'>
                <view class="item">
                  {{item}}
                </view>
              </block>
            </view>
            <view class="info">
              <view>{{List.houseUnit}}</view>
              <view class="line"></view>
              <view>{{List.areaSize}}m²</view>
              <view class="line"></view>
              <view>{{List.orientation}}</view>
              <!-- <view class="line"></view>
							  <view>{{item.info[3]}}</view> -->
            </view>
          </view>
        </view>
        <view class="bottom_list">
          <view class="bottom_left">
            {{List.listPrice}}元/月({{List.payType}})
          </view>
        </view>
      </view>
    </view>

  </view>
</template>

<script>
export default {
  name: 'houseList',
  data () {
    return {
      tagProperty: [],
      image: ''
    }
  },
  props: {
    title: String,
    List: Object,
    indexCurry: Number,
    clickItemCallBack: {
      type: Function,
      default: () => () => { }
    }
  },
  created () {
  },
  mounted () {
  },
  computed: {

  },
  methods: {
    clickItem () {
      this.$emit('clickItemCallBack')
    },
  }
}
</script>

<style lang='scss' scoped>
.houseList {
  width: 690rpx;
  margin: 0 auto;
  .houseTitle {
    display: flex;
    justify-content: space-between;
    padding-bottom: 20rpx;
    padding-top: 30rpx;
    .title-left {
      color: #00a680;
      font-size: 30rpx;
      font-weight: 700;
    }
    .title-distance {
      font-size: 20rpx;
      color: #737373;
    }
  }
  .houseItem {
    padding: 40rpx 20rpx 0rpx 20rpx;
    background-color: white;
    display: flex;
    position: relative;
    margin-bottom: 14rpx;
    border-radius: 6rpx;
    .itemLeft {
      width: 260rpx;
      margin-right: 20rpx;
      height: 190rpx;
      background-color: #f5f5f5;
      display: flex;
      justify-content: center;
      align-items: center;
      border-radius: 6rpx;
      .cuIcon-camerafill {
        color: #bfbfbf;
        margin-right: 10rpx;
      }
      .leftText {
        color: #888888;
        font-size: 20rpx;
      }
    }
    .itemRight {
      flex-grow: 1;
      position: relative;
      top: -6rpx;
      left: 0;
      .rightTop {
        display: flex;
        font-size: 26rpx;
        justify-content: space-between;
        .topLeft {
          font-size: 26rpx;
          line-height: 40rpx;
          .name {
            font-size: 30rpx;
            font-weight: 800;
            width: 410rpx;
            overflow: hidden;
            text-overflow: ellipsis;
            white-space: nowrap;
            span {
              display: inline-block;
              // max-width: 200rpx;
              margin-right: 10rpx;
            }
          }
          .info {
            display: flex;
            align-items: center;
            .line {
              width: 2rpx;
              height: 20rpx;
              background-color: black;
              margin: 0rpx 6rpx;
            }
          }
        }
        .topRight {
          display: flex;
          view {
            width: 30rpx;
            height: 30rpx;
            text-align: center;
            line-height: 30rpx;
            font-size: 20rpx;
            margin-right: 10rpx;
          }
          view:nth-child(1) {
            background-color: #dae8fc;
            color: #7475fe;
          }
          view:nth-child(2) {
            background-color: #ffe6cc;
            color: #ff850b;
          }
          view:nth-child(3) {
            background-color: #fff2cc;
            color: #e6bc4f;
          }
        }
      }
      .addr {
        display: flex;
        flex-wrap: wrap;
        margin: 0 0 10rpx 0;
        .item {
          min-width: 80rpx;
          padding: 0 6rpx;
          height: 40rpx;
          line-height: 40rpx;
          font-weight: 500;
          font-size: 24rpx;
          text-align: center;
          color: #00a680;
          border-radius: 6rpx;
          margin-right: 10rpx;
          background-color: #eeeeee;
        }
      }

      .bottom_list {
        display: flex;
        margin-top: 12rpx;
        .bottom_left {
          color: #ff0000;
          font-size: 32rpx;
          margin-right: 30rpx;
        }
        .show_status {
          height: 30rpx;
          width: 30rpx;
          color: #00a680;
          margin-right: 20rpx;
          font-size: 20rpx;
          line-height: 30rpx;
          text-align: center;
          display: inline-block;
          border: solid #00a680 2rpx;
          margin-bottom: 12rpx;
        }
        .price_item {
          display: inline-block;
        }
        .bottom_right {
          padding-top: 6rpx;
          color: #9999;
          font-size: 28rpx;
        }
      }
    }
    .cell {
      position: absolute;
      width: 490rpx;
      height: 1px;
      background-color: #e8e8e8;
      bottom: 0rpx;
      right: 0rpx;
      transform: scaleY(0.5);
    }
    &:active {
      background-color: #fafafa;
    }
  }
}
</style>
