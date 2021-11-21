<template>
  <!-- 我的消息 -->
  <scroll-view scroll-y
               class="myMessage">
    <view @tap="toList('公告')"
          class="messageItem">
      <view class='itemLeft'>
        <image style="width:70rpx;height:70rpx;"
               src='https://uss.img.lezhulife.com/xcxicon/myMeaasge-gorn.png'></image>
        <view v-if="false"
              class='point'></view>
      </view>
      <view class='itemCenter'>
        <view class='centerTop'>平台公告</view>
        <!-- <view class='centerBottom'>企业公告，最新优惠活动发布通知</view> -->
      </view>
      <!-- <view class='itemRight'>12:23</view> -->
    </view>
    <view id="cell">
      <view class="line"></view>
    </view>
    <view @tap="toList('业务')"
          class="messageItem">
      <view class='itemLeft'>
        <image style="width:70rpx;height:70rpx;"
               src='https://uss.img.lezhulife.com/xcxicon/myMessage-notice.png'></image>
        <view v-if="false"
              class='point'></view>
      </view>
      <view class='itemCenter'>
        <view class='centerTop'>业务通知</view>
        <!-- <view class='centerBottom'>麊湖国际社区租赁合同审批通过</view> -->
      </view>
      <!-- <view class='itemRight'>12:23</view> -->
    </view>

    <!-- <view class='bottomTip'>
            <view class="tipLeft">打开服务通知，重要消息不错过</view>
            <view class="tipRight">
                <view style="color:white;font-size:30rpx;margin-right:6rpx;" class="cuIcon-noticefill"></view>
                <view>开启</view>
            </view>
        </view> -->

    <view style="width:750rpx;height:140rpx;"></view>
  </scroll-view>
</template>

<script>
export default {
  name: 'myMessage',
  data () {
    return {
      messageType: '',
    }
  },
  onLoad () {
    uni.hideLoading()
  },
  methods: {
    toList (text) {
      if (text == '公告') {
        this.messageType = 2
      } else if (text == '业务') {
        this.messageType = 1
      }
      this.getMessageData()
    },
    //消息
    async getMessageData () {
      try {
        let res = await this.request({
          url: '/message/list',
          type: 'post',
          param: { messageType: this.messageType }
        })
        if (res[1].data.state == 200) {
          let arr = res[1].data.body
          let a = JSON.parse(JSON.stringify(arr))
          if (this.messageType == 2) {
            uni.navigateTo({
              url: '../../../subpackComm/pages/myMessage/business?type=平台公告&message=' + encodeURIComponent(JSON.stringify(a)),
            })
          } else if (this.messageType == 1) {
            uni.navigateTo({
              url: '../../../subpackComm/pages/myMessage/business?type=业务通知&message=' + encodeURIComponent(JSON.stringify(a)),
            })
          }
        } else {
          uni.showToast({
            title: this.$throwStatusCode(res[1].data.state, '获取消息'),
            icon: 'none'
          })
        }
      } catch (e) {
        console.log(e)
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
page {
  background-color: white !important;
}
.myMessage {
  width: 100%;
  height: 100vh;
  background-color: white;
  border-top: solid 2rpx #ebe8e8;
  .messageItem {
    height: 140rpx;
    display: flex;
    width: 750rpx;
    margin: 0 auto;
    justify-content: space-between;
    align-items: center;
    box-sizing: border-box;
    padding: 0 30rpx;
    // border-bottom: solid 2rpx $borderColor;
    .itemLeft {
      position: relative;
      .point {
        position: absolute;
        width: 20rpx;
        height: 20rpx;
        background-color: #ff0000;
        border-radius: 10rpx;
        right: -6rpx;
        top: -2rpx;
      }
    }
    .itemCenter {
      flex-grow: 1;
      padding-left: 40rpx;
      .centerTop {
        font-size: 30rpx;
        font-weight: 600;
      }
      .centerBottom {
        font-size: 28rpx;
        color: $titleColor;
      }
    }
    .itemRight {
      font-size: 24rpx;
      color: $titleColor;
    }
    &:active {
      background-color: #fafafa;
    }
  }
  .bottomTip {
    position: fixed;
    left: 50%;
    bottom: 50rpx;
    width: 690rpx;
    height: 100rpx;
    background-color: #666666;
    color: white;
    transform: translateX(-50%);
    border-radius: 50rpx;
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 0rpx 40rpx;
    box-sizing: border-box;
    .tipRight {
      display: flex;
      background-color: #ea6b66;
      width: 120rpx;
      height: 60rpx;
      justify-content: center;
      align-items: center;
      border-radius: 30rpx;
      font-size: 24rpx;
      image {
        margin-right: 6rpx;
      }
    }
  }
}
</style>