<template>
  <!-- 业主首页 -->
  <view class='owner'>
    <view class='title'>业主信息</view>
    <view class='infoBox'>
      <view class='detail'>
        <view class='detailLeft'>
          <view>张三三</view>
          <view>180 **** 2833</view>
          <view>510120 1990 1222 ****</view>
        </view>
        <view class='cuIcon-right'></view>
      </view>
      <!-- <view id="cell" style="height:10px;background-color:red;"><view class="line"></view></view> -->
      <view @tap="clickItem('添加产权共有人')"
            class='normal'>
        <view class='normalLeft'>
          <view>+</view>
          <view>添加产权共有人</view>
        </view>
        <view class='cuIcon-right'></view>
      </view>
    </view>

    <view class='title'>收款银行卡</view>
    <view class='infoBox'>
      <view class='detail'>
        <view class='detailLeft'>
          <view>中国银行</view>
          <view>1229 3288 1234 ****</view>
          <view>益州大道支行</view>
        </view>
        <view class='cuIcon-right'></view>
      </view>
      <view @tap="clickItem('添加收款银行')"
            class='normal'>
        <view class='normalLeft'>
          <view>+</view>
          <view>添加收款银行</view>
        </view>
        <view class='cuIcon-right'></view>
      </view>
    </view>

    <view class='title'>证件相关</view>
    <view class='infoBox'>
      <view @tap="clickItem('合同')"
            class='normal'>
        <view class='left'>合同</view>
        <view class='center'>请完善</view>
        <view class='cuIcon-right'></view>
      </view>
      <view @tap="clickItem('产权证件')"
            class='normal'>
        <view class='left'>产权证件</view>
        <view class='center'>请完善</view>
        <view class='cuIcon-right'></view>
      </view>
      <view @tap="clickItem('其他照片')"
            class='normal'>
        <view class='left'>其他照片</view>
        <view class='center'>可选</view>
        <view class='cuIcon-right'></view>
      </view>
    </view>

    <view class='title'>业主合同</view>
    <view class='infoBox'>
      <view @tap="clickItem('续签合同')"
            class='normal'>
        <view class='left'>续签业主合同</view>
        <view class='center'></view>
        <view class='cuIcon-right'></view>
      </view>
      <view @tap="clickItem('解约合同')"
            class='normal'>
        <view class='left'
              style="color:#ea6b66;">解约业主合同</view>
        <view class='center'></view>
        <view class='cuIcon-right'></view>
      </view>
    </view>

    <view style="width:750rpx;height:180rpx"></view>
  </view>
</template>

<script>
export default {
  name: 'owner',
  data () {
    return {

    }
  },
  methods: {
    clickItem (text) {
      switch (text) {
        case '添加产权共有人':
          uni.navigateTo({
            url: '../../../subpackAdminHousing/pages/adminHousing/theOwner/ownerInfo',
          })
          break;
        case '添加收款银行':
          uni.navigateTo({
            url: '../../../subpackAdminHousing/pages/adminHousing/theOwner/bankCard',
          })
          break;
        case '合同':

          break;
        case '产权证件':
          uni.showToast({
            icon: 'none',
            title: '功能尚未完善,请等待后续迭代'
          });
          console.warn('该身份证上传路径暂未支持')
          // uni.navigateTo({
          //     url: '../../../pages/uploadIdCard/uploadIdCard',
          // })
          break;
        case '其他照片':
          uni.navigateTo({
            url: '../../../pages/upload/upload',
          })
          break;
        case '续签合同':
          uni.navigateTo({
            url: '../../../subpackAdminHousing/pages/adminHousing/theOwner/renew',
          })
          break;
        case '解约合同':
          uni.navigateTo({
            url: '../../../subpackAdminHousing/pages/adminHousing/theOwner/termination',
          })
          break;
        default:
          break;
      }
    }
  }
}
</script>

<style lang='scss' scoped>
.owner {
  .title {
    font-size: 26rpx;
    color: #6d6c6c;
    padding: 50rpx 0rpx 20rpx 16px;
  }
  .infoBox {
    background-color: white;
    // padding: 0rpx 40rpx 0rpx 40rpx;
    box-sizing: border-box;
    .detail {
      height: 170rpx;
      background-color: white;
      display: flex;
      align-items: center;
      border-bottom: solid calc(1px / 2.5) #d9d9d9;
      padding: 0rpx 40rpx 0rpx 40rpx;
      .detailLeft {
        flex-grow: 1;
        font-size: 30rpx;
        view {
          line-height: 40rpx;
        }
        view:nth-child(1) {
          font-size: 34rpx;
          font-weight: 600;
          padding-bottom: 10rpx;
          padding-top: 20rpx;
        }
        view:nth-child(3) {
          padding-bottom: 10rpx;
        }
      }
      &:active {
        background-color: #fafafa;
      }
    }
    .normal {
      display: flex;
      justify-content: space-between;
      align-items: center;
      height: 100rpx;
      border-bottom: solid calc(1px / 2.5) #e6e6e6;
      padding: 0rpx 40rpx 0rpx 40rpx;
      font-size: 30rpx;
      .normalLeft {
        display: flex;
        align-items: center;
        view:nth-child(1) {
          font-size: 42rpx;
          color: #0080f0;
          padding-right: 20rpx;
        }
      }
      .left {
        width: 260rpx;
      }
      .center {
        flex-grow: 1;
        color: #cccccc;
      }
      &:active {
        background-color: #fafafa;
      }
    }
    .normal:last-child {
      border: none;
    }
  }
}
</style>
