<template>
  <!-- 解约合同 -->
  <view class='renew'>
    <view class='infoHeader'>
      <view><text>天鹅湖二期</text>2室1厅1卫</view>
      <view>12-2-2001</view>
    </view>
    <view class='title'></view>
    <view class='infoBox'>
      <view class='normal'>
        <view class='left'>解约时间</view>
        <picker class="centerPicke"
                mode="date"
                fields="day"
                :value="currentData"
                start="2015-09-01"
                end="2017-09-01"
                @change="bindDateChange($event)">
          <view class='pickItem'>
            <view class="picker"
                  :style="'color:'+(time=='请选择'?'#cccccc':'#333333')">
              {{time}}
            </view>
          </view>
        </picker>
        <view class='cuIcon-right'></view>
      </view>
      <view @tap="areaFocus=true"
            class='normal note'>
        <view class='left'>解约备注</view>
        <view class='center'>添加解约原因，说明</view>
      </view>
      <textarea @blur="areaFocus=false"
                :focus="areaFocus"
                class='noteArea'></textarea>
    </view>

    <view @tap="confirmBtn"
          class='saveBtn'>解约</view>
    <Modal2 :isAuthCode="true"
            :btnList="['取消','确定解约']"
            :isShowModal2="isShowModal2"
            modalTitle="解约合同"
            @clickModal2ItemCallBack="modal2ItemCallback"
            @clickModal2MaskCallBack=" modal2MaskCallBack"></Modal2>
  </view>
</template>

<script>
import Modal2 from '../../../../components/comm/modal2/modal2.vue'
export default {
  name: 'renew',
  data () {
    return {
      isShowModal2: false,
      time: '请选择',
      areaFocus: false
    }
  },
  methods: {
    //解约按钮
    confirmBtn () {
      this.isShowModal2 = true
    },
    //模态框选项回调
    modal2ItemCallback (item) {
    },
    //点击遮罩回调
    modal2MaskCallBack () {
      this.isShowModal2 = false;
    },
    //时间选择器回调
    bindDateChange (e) {
      this.time = e.detail.value;
    }
  },
  components: {
    Modal2
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
  background-color: $pageBgColor;
}
.renew {
  .infoHeader {
    background-color: white;
    width: 750rpx;
    text-align: center;
    padding-top: 40rpx;
    padding-bottom: 40rpx;
    border-bottom: solid 4rpx #e6e6e6;
    view:nth-child(1) {
      text {
        font-size: 32rpx;
        font-weight: 600;
        padding-right: 10rpx;
      }
    }
  }
  .title {
    font-size: 24rpx;
    color: #6d6c6c;
    padding: 50rpx 0rpx 20rpx 20px;
  }
  .infoBox {
    background-color: white;
    box-sizing: border-box;
    .normal {
      display: flex;
      justify-content: space-between;
      align-items: center;
      height: 100rpx;
      border-bottom: solid calc(1px / 2.5) #e6e6e6;
      position: relative;
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
      .pickBox {
        flex-grow: 1;
        display: flex;
        justify-content: space-between;
        .pickItem {
          display: flex;
          align-items: center;
          .picker {
            padding-right: 20rpx;
            color: $placerColor;
          }
        }
      }
      .left {
        width: 260rpx;
      }
      .center {
        flex-grow: 1;
        color: #cccccc;
      }
      .right {
        display: flex;
        align-items: center;
        view {
          color: black;
          font-weight: 600;
        }
        image {
          margin-left: 20rpx;
        }
      }
      .centerPicke {
        position: absolute;
        left: 0;
        top: 0;
        width: 100%;
        height: 100%;
        line-height: 100rpx;
        text-indent: 300rpx;
        // background-color: blueviolet;
      }
      &:active,
      &:active + .noteArea {
        background-color: #fafafa;
      }
    }
    .normal:last-child {
      border: none;
    }
    .note {
      border: none;
      .center {
        text-align: right;
      }
    }
    .noteArea {
      height: 100rpx;
      width: 100%;
      height: 140rpx;
      padding: 0rpx 40rpx 20rpx 40rpx;
      font-size: 30rpx;
    }
  }
  .saveBtn {
    width: 690rpx;
    height: 100rpx;
    color: white;
    font-size: 34rpx;
    text-align: center;
    background-color: #00a680;
    margin: 40rpx auto;
    line-height: 100rpx;
    border-radius: 10rpx;
    &:active {
      background-color: #007e5e;
    }
  }
}
</style>