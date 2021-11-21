<template>
  <!-- 跟进内容 -->
  <view class='followContent'>
    <view style="width:750rpx;height:2rpx;"></view>
    <view class='infoBox'>
      <view class='normal'>
        <view class='left'>客户名称</view>
        <input disabled
               class='center'
               placeholder-style="color:black"
               placeholder-class="center"
               :placeholder="followList.title" />
      </view>
    </view>
    <view class='title'></view>
    <view class='infoBox'>
      <view class='normal'>
        <view class='left'>跟进方式</view>
        <input disabled
               class='center'
               placeholder-style="color:black"
               placeholder-class="center"
               :placeholder="followList.mode" />
      </view>
      <view class='normal'>
        <view class='left'>跟进业务</view>
        <input disabled
               class='center'
               placeholder-style="color:black"
               placeholder-class="center"
               :placeholder="followList.business" />
      </view>
      <view class='normal note'>
        <view class='left'>跟进内容</view>
        <view class='center'></view>
      </view>
      <textarea disabled
                class='noteArea'
                placeholder-style="color:black;font-size:30rpx;"
                :placeholder="followList.content"></textarea>
    </view>

    <view class='title'></view>
    <view class='infoBox'>
      <view class='normal'>
        <view class='left'>
          <view>位置</view>
        </view>
        <view class="center"
              style="color:#333333">
          <view>{{(followList.local_name=='')?'未上传':followList.local_name}}</view>
        </view>
      </view>
      <view class='normal'>
        <view class='left'>照片</view>
        <view class="center"
              v-if="followList && followList.pics_array && followList.pics_array.length">
          <block v-for="(item,index) in followList.pics_array"
                 :key="item">
            <image mode="aspectFill"
                   @tap="previewImage(index)"
                   style="width:80rpx;height:60rpx;border-radius:10rpx;margin-right:16rpx;"
                   :src="getUrl(item)"></image>
          </block>
        </view>
        <view class="center"
              style="color:#333333"
              v-else>未上传</view>
      </view>
    </view>

    <view class='title'></view>
    <view class='infoBox'>
      <view class='normal'>
        <view class='left'>
          <view>跟进人</view>
        </view>
        <input disabled
               class='center'
               placeholder-style="color:black;font-size:30rpx;"
               placeholder-class="center"
               :placeholder="followList.followup_staff_name" />
      </view>
      <view class='normal'>
        <view class='left'>跟进时间</view>
        <input disabled
               class='center'
               placeholder-style="color:black;font-size:30rpx;"
               placeholder-class="center"
               :placeholder="followList.followup_time" />
      </view>
    </view>
  </view>
</template>

<script>
import { createNamespacedHelpers } from 'vuex';
const { mapActions: sourceAction, mapState: sourceState } = createNamespacedHelpers('source');
export default {
  name: 'followContent',
  data () {
    return {
      //  imageUrl : []
    }
  },
  onLoad (options) {

  },
  computed: {
    ...sourceState({
      followList: state => {
        return state.followList[state.followList.length - 1]
      }
    })
  },
  methods: {
    getUrl (item) {
      return item + this.$imageSuperSmall
    },
    ...sourceAction(['getFollowList']),
    //预览图片
    previewImage (index) {
      if (this.followList && this.followList.pics_array && this.followList.pics_array.length) {
        // let list = this.followList.pics_array.map(ele => {
        //     return ele.startsWith('h') ? ele : 'https://uss.img.lezhulife.com' + ele
        // })
        let arr = []
        this.followList.pics_array.forEach((ele, i) => {
          arr[i] = ele + this.$imageLarge
        })
        uni.previewImage({
          urls: arr,
          current: index
        })
      }
    }
  },
  onUnload () {

  }
}
</script>

<style lang='scss' scoped>
$pageBgColor: #f7f7f7;
$borderColor: #e9e9e9;
$placerColor: #cccccc;
$titleColor: #888888;
$greenColor: #00a680;
.followContent {
  .title {
    font-size: 26rpx;
    color: #6d6c6c;
    padding: 20rpx 0rpx 16rpx 20px;
  }
  .infoBox {
    background-color: white;
    box-sizing: border-box;
    .normal {
      padding: 0rpx 40rpx 0rpx 40rpx;
      display: flex;
      justify-content: space-between;
      align-items: center;
      height: 100rpx;
      border-bottom: solid calc(1px / 2.5) #d9d9d9;
      position: relative;
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
        // background-color: yellow;
        width: 100rpx;
        .pickItem {
          // position: absolute;
          height: 100rpx;
          width: 600rpx;
          display: flex;
          left: 80rpx;
          top: 0;
          align-items: center;
          .picker {
            padding-right: 20rpx;
            color: black;
          }
        }
      }
      .left {
        width: 260rpx;
        display: flex;
        align-items: center;
        view:nth-child(2) {
          margin-left: 20rpx;
        }
      }
      .center {
        flex-grow: 1;
        color: #cccccc;
        font-size: 30rpx;
        .tag {
          display: inline-block;
          color: #6666ff;
          background-color: #dae8fc;
          font-size: 20rpx;
          text-align: center;
          padding: 4rpx 10rpx;
        }
        .btnBox {
          display: flex;
          view {
            width: 150rpx;
            height: 50rpx;
            border-radius: 30rpx;
            font-size: 28rpx;
            text-align: center;
            line-height: 50rpx;
            margin-right: 20rpx;
          }
          view:nth-child(1) {
            border: solid 1rpx $titleColor;
            color: black;
          }
          view:nth-child(2) {
            border: solid 1rpx $greenColor;
            color: $greenColor;
          }
        }
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
      width: 100%;
      height: 140rpx;
      padding: 0rpx 40rpx 20rpx 40rpx;
    }
  }
  .buttomBox {
    padding-top: 60rpx;
    width: 680rpx;
    margin: 0 auto;
    display: flex;
    justify-content: space-between;
    view {
      width: 300rpx;
      height: 80rpx;
      text-align: center;
      line-height: 80rpx;
      border-radius: 10rpx;
      font-size: 28rpx;
      font-weight: 600;
    }
    view:nth-child(1) {
      background-color: $greenColor;
      color: white;
    }
    view:nth-child(2) {
      border: solid 1rpx $greenColor;
      color: $greenColor;
    }
  }
  .saveBtn {
    width: 690rpx;
    height: 100rpx;
    color: white;
    font-size: 36rpx;
    font-weight: 600;
    text-align: center;
    background-color: #00a680;
    margin: 60rpx auto;
    line-height: 100rpx;
    border-radius: 10rpx;
  }
}
</style>
