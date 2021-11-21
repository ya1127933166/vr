<template>
  <view catchtouchmove='true'
        v-show="isShowModal2"
        class='modal2'>
    <view class='mask'
          @tap="clickModal2Mask"></view>
    <view class='modal2-box'>
      <view class='modalTitle'>{{modalTitle}}</view>
      <slot></slot>
      <!-- 短信验证码 -->
      <view v-if="isAuthCode"
            class='authCode'>
        <view class='authTitle'>该操作需要进行安全验证:</view>
        <view class='authNumber'>操作绑定的手机号为180****0099</view>
        <view class='authInput'>
          <view class='inputLeft'>验证码:</view>
          <input class='inputCenter'
                 type="text"
                 placeholder-style="color:#cccccc;"
                 placeholder="请输入" />
          <view @tap="getAuthCode"
                class='inputRight'>{{authCodeTetx}}</view>
        </view>
        <view class='codeError'>验证码错误</view>
      </view>
      <!-- 普通模态框 -->
      <view v-if="isModel1"
            class='model1'>
        <view class='modelTitle'
              v-if="isModel1Title">{{model1Title}}</view>
        <view class='modelList'>
          <view v-if="model1List.length>1">
            <block v-for="(item,index) in model1List"
                   :key="index">
              <view class='listItem'><text>{{index+1}}.</text>{{item}}</view>
            </block>
          </view>
          <view v-if="model1List.length==1"
                class='listItem'>{{model1List[0]}}</view>
        </view>
      </view>
      <!-- 模态框按钮 -->
      <view class='modalBtnBox'>
        <block v-if="btnList.length>1">
          <view @tap="clickModal2Item(btnList[0])"
                class='btnLeft'>{{btnList[0]}}</view>
          <view @tap="clickModal2Item(btnList[1])"
                class='btnRight'>{{btnList[1]}}</view>
        </block>
        <block v-if="btnList.length==1">
          <view class='confirmBtn'
                @tap="clickModal2Item(btnList[0])">{{btnList[0]}}</view>
        </block>
      </view>
    </view>
    <cover-view v-if="isHack"
                class='hackMask'
                style=""></cover-view>
  </view>
</template>

<script>
export default {
  name: 'modal2',
  props: {
    //是否显示组件
    isShowModal2: {
      type: Boolean,
      default: false
    },
    //是否启用短信验证
    isAuthCode: {
      type: Boolean,
      default: false
    },
    //是否启用普通模态框
    isModel1: {
      type: Boolean,
      default: false
    },
    //是否显示列表标题
    isModel1Title: {
      type: Boolean,
      default: true
    },
    //默认列表标题
    model1Title: {
      type: String,
      default: '亲爱滴伙伴:'
    },
    //模态框列表内容
    model1List: {
      type: Array,
      default: () => ([])
    },
    //模态框标题
    modalTitle: {
      type: String,
      default: ''
    },
    //按钮数组
    btnList: {
      type: Array,
      default: () => ([])
    },
    //遮罩点击回调
    clickModal2MaskCallBack: {
      type: Function,
      default: () => () => { }
    },
    //按钮点击回调
    clickModal2ItemCallBack: {
      type: Function,
      default: () => () => { }
    },
    //是否显示用兼容的块
    isHack: {
      type: Boolean,
      default: false
    }
  },
  data () {
    return {
      authCodeTetx: '获取验证码'
    }
  },
  mounted () {

  },
  onShow () {

  },
  watch: {

  },
  methods: {
    //点击获取二维码
    getAuthCode () {
      if (this.authCodeTetx != '获取验证码') {
        return;
      }
      let seconds = 50;
      this.authCodeTetx = seconds;
      let timer = setInterval(() => {
        this.authCodeTetx = seconds -= 1;
        if (seconds == 0 || this.isShowModal2 == false) {
          clearInterval(timer);
          this.authCodeTetx = '获取验证码'
        }
      }, 1000)
    },
    //遮罩点击事件
    clickModal2Mask (e) {
      this.$emit('clickModal2MaskCallBack')
    },
    //选项点击事件
    clickModal2Item (e) {
      this.$emit('clickModal2ItemCallBack', e)
    }
  }
}
</script>

<style lang='scss' scoped>
.modal2 {
  .mask {
    height: 100vh;
    width: 750rpx;
    position: fixed;
    left: 0;
    top: 0;
    background-color: rgba(0, 0, 0, 0.4);
    z-index: 99;
    animation: mask 0.1s ease-in;
    z-index: 2;
  }
  .modal2-box {
    width: 640rpx;
    border-radius: 20rpx;
    background-color: white;
    position: fixed;
    margin: auto;
    left: 50%;
    top: 50%;
    transform: translateX(-50%) translateY(-50%);
    overflow: hidden;
    z-index: 100;
    .modalTitle {
      width: 100%;
      text-align: center;
      padding: 30rpx 0rpx 20rpx 30rpx;
      color: #666666;
    }
    .authCode {
      width: 540rpx;
      height: 240rpx;
      margin: 0 auto;
      .authTitle {
        font-size: 30rpx;
        color: black;
        font-weight: 700;
      }
      .authNumber {
        font-size: 24rpx;
        color: #666666;
      }
      .authInput {
        display: flex;
        padding-top: 30rpx;
        justify-content: space-between;
        .inputLeft {
          font-size: 30rpx;
        }
        .inputCenter {
          width: 200rpx;
          padding: 0rpx 10rpx 0rpx 10rpx;
        }
        .inputRight {
          width: 200rpx;
          height: 60rpx;
          background-color: #e6e6e6;
          text-align: center;
          line-height: 60rpx;
          font-size: 28rpx;
          color: #3b3b3b;
          font-weight: 600;
          border-radius: 6rpx;
        }
      }
      .codeError {
        font-size: 24rpx;
        color: red;
        margin-left: 130rpx;
      }
    }
    .modalBtnBox {
      display: flex;
      width: 100%;
      height: 100rpx;

      text-align: center;
      line-height: 100rpx;
      font-size: 32rpx;
      view {
        width: 50%;
      }
      .btnLeft {
        border-top: solid 1rpx #cccc;
      }
      .btnRight {
        color: white;
        background-color: #666666;
        border-top: solid 1rpx #666666;
      }
      .confirmBtn {
        width: 100%;
        text-align: center;
      }
    }
    .model1 {
      padding: 20rpx 35rpx 60rpx 35rpx;
      .modelTitle {
        font-size: 26rpx;
      }
      .modelList {
        padding: 20rpx 0rpx 10rpx 20rpx;
        font-size: 30rpx;
      }
    }
  }
  .hackMask {
    width: 750rpx;
    height: 140rpx;
    background-color: rgba(0, 0, 0, 0.4);
    position: fixed;
    left: 0rpx;
    bottom: 0rpx;
    animation: mask 0.3s ease-in-out;
  }
}

@keyframes mask {
  0% {
    opacity: 0;
  }
  100% {
    opacity: 1;
  }
}
</style>