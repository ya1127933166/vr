<template>
  <cover-view @click="clickMaskHandel"
              v-show="isShow"
              catchtouchmove='true'
              class='modal1'>
    <cover-view :class="['modal1-box']">
      <block v-for="item in normal"
             :key="item.text">
        <cover-view @click.stop="clickItemHandle"
                    :data-item="item"
                    :style="'color:'+(item.status?'red':'black')+';'"
                    class='modal1-item'>{{item.text}}</cover-view>
        <cover-view class='cell'></cover-view>
      </block>
      <block v-for="item in imgList"
             :key="item">
        <cover-view @click.stop="clickItemHandle"
                    :data-item="item"
                    class="modal1-imageItem">
          <cover-image style="width:60rpx;height:60rpx;margin-right:30rpx;"
                       :src='item.path'></cover-image>
          <cover-view :class="[item.disable ? 'disable-text' : '']">{{item.text}}</cover-view>
          <cover-view v-if="item.disable"
                      class="disable-box">暂不可用</cover-view>
        </cover-view>
        <cover-view class='cell'></cover-view>
      </block>
      <cover-view class='cancelCell'></cover-view>
      <cover-view class='cancel'>取消</cover-view>
    </cover-view>
  </cover-view>
</template>

<script>
export default {
  props: {
    normal: {
      type: Array,
      default: () => ([])
    },
    imgList: {
      type: Array,
      default: () => ([])
    },
    isShow: {
      type: Boolean,
      default: false
    },
    clickCallBack: {
      type: Function,
      default: () => () => { }
    },
    clickMaskCallBack: {
      type: Function,
      default: () => () => { }
    }
  },
  data () {
    return {
      tabbarHeight: 0
    }
  },
  mounted () {
  },
  methods: {
    //选项点击事件
    clickItemHandle (e) {
      const { currentTarget } = e;
      const { item } = currentTarget.dataset || {};
      // console.log(e, item)
      const { disable } = item;
      if (!disable) {
        uni.showLoading({
          title: '加载中...',
        });
        this.$emit('clickCallBack', e)
      }
    },
    //遮罩点击事件
    clickMaskHandel () {
      this.$emit('clickMaskCallBack')
    }
  }
}
</script>

<style lang='scss' scoped>
.modal1 {
  height: 100vh;
  width: 750rpx;
  position: fixed;
  left: 0;
  top: 0;
  background-color: rgba(0, 0, 0, 0.4);
  z-index: 99;
  animation: mask 0.1s ease-in-out;
  .modal1-box {
    width: 750rpx;
    border-radius: 20rpx 20rpx 0rpx 0rpx;
    background-color: white;
    position: fixed;
    margin: auto;
    left: 0;
    bottom: -12rpx;
    animation: modal 0.1s ease-in-out;
    overflow: hidden;
    font-size: 32rpx;
    .modal1-item {
      text-align: center;
      height: 140rpx;
      line-height: 140rpx;
      // font-size: 28rpx;
    }
    .modal1-imageItem {
      display: flex;
      align-items: center;
      height: 160rpx;
      // padding-left: 60rpx ;
      justify-content: center;
      font-size: 32rpx;
      border-bottom: solid 1rpx #eeeeef;
      view {
        margin-left: 40rpx;
      }
    }
    .cell {
      width: 750rpx;
      height: 1rpx;
      background-color: #e7e5e5;
    }
    .cancelCell {
      width: 750rpx;
      height: 10rpx;
      background-color: #e7e5e5;
    }
    .cancel {
      text-align: center;
      height: 152rpx;
      line-height: 140rpx;
      font-size: 34rpx;
      color: black;
    }
    .disable-text {
      color: #b8b8b8;
    }
    .disable-box {
      $warnColor: #ea6b66;
      border-radius: 3rpx;
      border: 1rpx solid $warnColor;
      color: $warnColor;
      padding: 3rpx 5rpx;
      margin-left: 35rpx;
    }
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
@keyframes modal {
  0% {
    transform: translateY(100%);
  }
  100% {
    transform: translateY(0%);
  }
}

@keyframes downs {
  0% {
    transform: translateY(0%);
  }
  100% {
    transform: translateY(100%);
  }
}
</style>
