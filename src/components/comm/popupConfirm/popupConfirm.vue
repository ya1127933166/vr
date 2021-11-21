<template>
  <view catchtouchmove='true'
        v-show="showPopup"
        class='popup-confirm'>
    <view class='mask'
          @tap="_clickPopupMask"></view>
    <view class='popup-confirm-box'>
      <view class='popup-confirm-title'
            v-if="popupTitle">{{popupTitle}}</view>
      <slot></slot>
      <!-- 普通模态框 -->
      <view class='popup-content-box'>
        <view class='popup-content'>
          <block v-if="contentList && contentList.length">
            <view v-for="(content,index) in contentList"
                  :key="index"
                  :class="['popup-content-item', content.needSpan ? 'span-line': '', content.nowrap ? 'nowrap': '']">
              {{ content.text || content || ''}}
            </view>
          </block>
        </view>
      </view>
      <!-- 模态框按钮 -->
      <view class='popup-btn-box'>
        <block v-if="btnList.length">
          <view @tap="_clickPopupItem(0)"
                class='btnLeft'>{{btnList[0].text || btnList[0] || ''}}</view>
          <view @tap="_clickPopupItem(1)"
                class='btnRight'>{{btnList[1].text || btnList[1] || ''}}</view>
        </block>
        <block v-if="btnList.length===1">
          <view class='confirmBtn'
                @tap="_clickPopupItem(btnList[0])">{{btnList[0]}}</view>
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
  name: 'PopupConfirm',
  props: {
    //是否显示组件
    showPopup: {
      type: Boolean,
      default: false
    },
    //模态框列表内容
    contentList: {
      type: Array,
      default: () => ([
        {
          text: '1234',
          needSpan: false,
          nowrap: true
        },
        {
          text: '1235',
          needSpan: true,
        },
        {
          text: '1237',
        },
        'asdasd'
      ])
    },
    //模态框标题
    popupTitle: {
      type: String,
      default: ''
    },
    //按钮数组
    btnList: {
      type: Array,
      default: () => ([])
    },
    //遮罩点击回调
    clickPopupMaskCallBack: {
      type: Function,
      default: () => () => { }
    },
    //按钮点击回调
    clickPopupCallBack: {
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
    //遮罩点击事件
    _clickPopupMask (e) {
      this.$emit('clickPopupMaskCallBack')
    },
    //选项点击事件
    _clickPopupItem (key) {
      // console.log('_clickPopupItem', key, this.btnList)
      const { text, tapKey } = this.btnList[key] || {}
      this.$emit('clickPopupCallBack', this.btnList[key])
    }
  }
}
</script>

<style lang='scss' scoped>
.popup-confirm {
  .mask {
    height: 100vh;
    width: 750rpx;
    position: fixed;
    left: 0;
    top: 0;
    background-color: rgba(0, 0, 0, 0.4);
    animation: mask 0.1s ease-in;
    z-index: 2;
  }
  .popup-confirm-box {
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
    .popup-confirm-title {
      width: 100%;
      text-align: center;
      padding: 30rpx 0rpx 20rpx 30rpx;
      font-size: 32rpx;
      font-weight: 800;
      color: #666666;
    }
    .popup-btn-box {
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
    .popup-content-box {
      padding: 20rpx 35rpx 60rpx 35rpx;
      .modelTitle {
        font-size: 26rpx;
      }
      .popup-content {
        //padding: 20rpx 0rpx 10rpx 20rpx;
        font-size: 30rpx;
        .popup-content-item {
          padding: 20rpx 0 30rpx;
          font-size: 30rpx;
          width: 570rpx;
          white-space: pre-line;
          text-overflow: ellipsis;
          display: -webkit-box;
          -webkit-line-clamp: 5;
          -webkit-box-orient: vertical;
          &.span-line {
            border-bottom: 1px dotted rgba(0, 0, 0, 0.2);
          }
          &.nowrap {
            display: block;
            white-space: nowrap;
            -webkit-box-orient: inherit;
            -webkit-line-clamp: 1;
            overflow: hidden;
          }
        }
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
