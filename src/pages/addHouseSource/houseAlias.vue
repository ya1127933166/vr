<template>
  <view v-if="isShow"
        catchtouchmove='true'
        class='modal1'>
    <view class='modal_box'
          style='width: 750rpx; background-color:#FFFFFF ;'>
      <view class='modal_top'>
        <view class='top_left'
              @tap="clickMaskHandel">取消</view>
        <view class='top_center'>更多设置</view>
        <view class='top_right'
              @tap='clickOk'>确定</view>
      </view>

      <cover-view class='house_tpye'>
        <cover-view style="font-weight:800; margin:20rpx 0 40rpx 0;font-size: 24rpx;">房屋编号</cover-view>
        <cover-view class="house_list">
          <block v-for="(item,index) in totalList"
                 :key='index'>
            <cover-view class='house_item'
                        @tap='cilckItemHandel(item)'
                        :style="{backgroundColor:(item.status==true?'#00A680':''),color:(item.status==true?'#fff':'')}">{{item.num==0?(item.type +'已占用'):item.type}}</cover-view>
          </block>
        </cover-view>
      </cover-view>

    </view>
  </view>
</template>

<script>
export default {
  props: {
    totalList: {
      type: Array,
      default: () => ([])
    },
    normal: {
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
      okList: ''
    }
  },
  mounted () {
  },
  components: {

  },

  methods: {
    //选项点击事件
    cilckItemHandel (item) {
      if (item.num == 1) {
        item.status = !item.status
        this.$emit('clickAlias', item)
      } else {
        uni.showToast({
          title: `${item.type}被占用`,
          icon: 'none'
        })
      }
    },
    // this.$emit('clickCallBack',item)
    clickOk () {
      this.okList = this.totalList.filter(ele => {
        return ele.status == true
      })
      let flag = this.okList.length == 0 ? false : true
      if (flag) {
        this.$emit('clickAliasCallBack', this.okList[0])
      } else {
        uni.showToast({
          title: '请选择房间',
          icon: 'none',
          duration: 400
        })
      }

    },
    //遮罩点击事件
    clickMaskHandel () {


      this.$emit('clickAliasBack', '')
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
  .modal_box {
    width: 750rpx;
    padding: 50rpx 0r;
    min-height: 50vh;
    border-radius: 20rpx 20rpx 0rpx 0rpx;
    background-color: white;
    position: fixed;
    margin: auto;
    left: 0;
    bottom: -12rpx;
    animation: modal 0.1s ease-in-out;
    overflow: hidden;
    font-size: 32rpx;
    .modal_top {
      display: flex;
      .top_left {
        width: 20%;
        height: 50rpx;
        margin-top: 20rpx;
        color: #cccccc;
        text-align: center;
      }
      .top_center {
        width: 60%;
        height: 50rpx;
        margin-top: 20rpx;
        color: #000;
        text-align: center;
      }
      .top_right {
        width: 20%;
        height: 50rpx;
        margin-top: 20rpx;
        color: #00a680;
        text-align: center;
      }
    }
    .house_tpye {
      margin-top: 15rpx;
      margin-left: 40rpx;
      width: 750rpx;
      .house_list {
        margin-top: 10rpx;
        margin-bottom: 10rpx;
        display: flex;
        width: 90%;
        flex-wrap: wrap;
        .house_item {
          min-width: 145rpx;
          height: 60rpx;
          font-size: 24rpx;
          line-height: 60rpx;
          text-align: center;
          margin: 10rpx 20rpx 15rpx 0;
          background-color: #eee;
        }
      }
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