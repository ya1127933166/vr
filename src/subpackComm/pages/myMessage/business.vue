<template>
  <!-- 业务通知 -->
  <view class="business">
    <view class="cell"></view>
    <view v-if="messageType=='平台公告'">
      <view @tap="toDetail(item)"
            class='businessItem'
            v-for="(item,index) in messageData"
            :key="index">
        <view class='itemTime'>{{item.createTime}}</view>
        <view class='itemBox'>
          <view class="itemTitle">
            <view>{{item.title}}</view>
          </view>
          <view class="itemOpt"
                style="min-height:100rpx">
            <view class="optRight">{{item.subContent}}</view>
          </view>

          <view class="itemDetail">
            <view>查看详情</view>
            <view class="cuIcon-right"></view>
          </view>
        </view>
      </view>
    </view>
    <!-- 业务 -->
    <view v-if="messageType=='业务通知'">
      <view @tap="toDetail(item)"
            class='businessItem'
            v-for="(item,index) in messageData"
            :key="index">
        <view class='itemTime'>{{item.createTime}}</view>
        <view class='itemBox'>
          <view class="itemTitle">
            <view>{{item.title}}</view>
            <!-- <view class="cuIcon-roundclosefill cuIcon"></view> -->
          </view>
          <view class="itemOpt">
            <view class="optLeft">小区</view>
            <view class="optRight">{{item.name}}</view>
          </view>
          <view class="itemOpt">
            <view class="optLeft">户型</view>
            <view class="optRight">{{item.houseType}}</view>
          </view>
          <view class="itemOpt">
            <view class="optLeft">月租金</view>
            <view class="optRight">{{item.price}}</view>
          </view>
          <view class="itemOpt">
            <view class="optLeft">付款方式</view>
            <view class="optRight">{{item.paymentMethod}}</view>
          </view>
          <view class="itemOpt">
            <view class="optLeft">合同期限</view>
            <view class="optRight">{{item.startTime.split(' ')[0]}} - {{item.endTime.split(' ')[0]}}</view>
          </view>
          <view class="itemOpt">
            <view class="optLeft">拒绝原因</view>
            <view style="color:#ea6b66"
                  class="optRight">{{item.reject}}</view>
          </view>
          <view class="itemDetail">
            <view>查看详情</view>
            <view class="cuIcon-right"></view>
          </view>
        </view>
      </view>
    </view>
    <EmptyPrompt v-if="!messageData.length"
                 :isButton="false"
                 :isContent="true"
                 :content="'暂无通知'"></EmptyPrompt>
    <view style="width:750rpx;height:100rpx"></view>
  </view>
</template>

<script>
import EmptyPrompt from '../../../components/comm/emptyPrompt/emptyPrompt.vue';
export default {
  name: 'business',
  data () {
    return {
      messageData: [],
      messageType: ''
    }
  },
  components: {
    EmptyPrompt
  },
  onLoad (options) {
    uni.setNavigationBarTitle({
      title: options.type
    })
    this.messageType = options.type
    this.messageData = JSON.parse(decodeURIComponent(options.message))
  },
  methods: {
    toDetail (item) {
      if (this.messageType == '业务通知') {
        uni.navigateTo({
          url: `../../../subpackTenantContract/pages/tenantContract/detailsContract?contractId=${item.jumpId}`,
        })
      } else if (this.messageType == '平台公告') {
        uni.navigateTo({
          url: '../../../subpackComm/pages/myMessage/noticeDetail?addUrl=' + JSON.stringify(item.addr),
        })
      }
    }
  }
}
</script>

<style lang='scss' scoped>
$pageBgColor: #f7f7f7;
$borderColor: #e9e9e9;
$placerColor: #cccccc;
$titleColor: #888888;
$greenColor: #00a680;
.business {
  .cell {
    width: 750rpx;
    height: 2rpx;
    background-color: $borderColor;
  }
  .businessItem {
    width: 100%;
    height: 100%;
    .itemTime {
      text-align: center;
      padding: 30rpx 0rpx 20rpx 0rpx;
      color: $titleColor;
      font-size: 22rpx;
    }
    .itemBox {
      border-radius: 20rpx;
      width: 690rpx;
      background-color: white;
      margin: 0 auto;
      padding: 20rpx 30rpx 10rpx 30rpx;
      .itemTitle {
        font-size: 32rpx;
        display: flex;
        align-items: center;
        font-weight: 500;
        padding-bottom: 20rpx;
        .cuIcon {
          color: #ea6b66;
          font-size: 42rpx;
          margin-left: 14rpx;
          margin-top: 4rpx;
        }
      }
      .itemOpt {
        color: $titleColor;
        font-size: 28rpx;
        display: flex;
        line-height: 40rpx;
        .optLeft {
          width: 160rpx;
        }
        .optRight {
          width: 500rpx;
        }
        .activity {
          padding-bottom: 40rpx;
          text {
            display: -webkit-box;
            -webkit-box-orient: vertical;
            -webkit-line-clamp: 2;
            overflow: hidden;
            word-wrap: break-word;
            word-break: break-all;
            white-space: pre-line;
          }
        }
      }
      .itemDetail {
        display: flex;
        justify-content: space-between;
        align-items: center;
        height: 70rpx;
        border-top: solid 1rpx $borderColor;
        margin-top: 10rpx;
      }
      &:active {
        background-color: #fafafa;
      }
    }
  }
}
</style>