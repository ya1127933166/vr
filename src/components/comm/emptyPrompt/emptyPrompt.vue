<template>
  <!-- 无数据提示组件 -->
  <view class="empty">
    <view class="emptyTop">
      <image mode="aspectFit"
             style="width:300rpx;height:160rpx;"
             :src="path"></image>
    </view>
    <view class="emptyBottom">
      <view v-if="isContent"
            class="bottomLeft">{{content}}{{(isButton?',':'')}}</view>
      <button @tap="addButton"
              v-if="isButton"
              :style="'margin-left:'+(isContent?'20rpx':'0rpx')+''"
              class="bottomRight">
        <view class="cu-left">{{buttonText}}</view>
        <view class="cuIcon-right"></view>
      </button>
    </view>
  </view>
</template>

<script>
export default {
  name: 'empty',
  props: {
    //是否需要获取用户信息
    isAuth: {
      type: Boolean,
      default: false
    },
    isContent: {
      type: Boolean,
      default: true
    },
    isButton: {
      type: Boolean,
      default: true
    },
    path: {
      type: String,
      default: 'https://uss.img.lezhulife.com/xcxicon/empty-content.png'
    },
    content: {
      type: String,
      default: '暂无'
    },
    buttonText: {
      type: String,
      default: '添加'
    },
    addButtonCallBack: {
      type: Function,
      default: () => () => { }
    }
  },
  methods: {
    addButton () {
      this.$utils.debounce(() => {
        let that = this
        if (this.isAuth == false) {
          wx.getUserProfile({
            desc: '用于完善用户资料',
            lang: 'zh_CN',
            success: function (res) {
              that.$emit('addButtonCallBack', res)

            },
            fail: function (res) {


            },
            complete: () => {
              uni.hideLoading()
            }
          })
        } else {
          that.$emit('addButtonCallBack')
        }

      }, 600)()

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
.empty {
  width: 750rpx;
  height: 600rpx;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  .emptyBottom {
    display: flex;
    align-items: center;
    padding-top: 30rpx;
    .bottomLeft {
      font-size: 28rpx;
      color: $placerColor;
    }
    .bottomRight {
      display: flex;
      align-items: center;
      border: solid 2rpx $greenColor;
      color: $greenColor;
      // width: 170rpx;
      height: 60rpx;
      border-radius: 35rpx;
      justify-content: center;
      font-size: 24rpx;
      margin-left: 20rpx;
      padding: 0rpx 20rpx;
      &::after {
        border: none;
      }
      .cuIcon-right {
        margin: 3rpx 0rpx 0rpx 4rpx;
      }
    }
  }
}
</style>