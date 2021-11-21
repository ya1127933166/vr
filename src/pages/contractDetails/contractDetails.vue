<template>
  <view class='contractDetail'>
    <view class='detailTop'>
      <view class="tag">待签署</view>
      <view class="reason">拒绝原因拒绝原因拒绝原因拒绝原因拒绝原因拒绝原因拒绝原因拒绝原因拒绝原因拒绝原因</view>
      <view class='topTime'>签署剩余时间: <text>12:00:00</text></view>
      <view class='review'>查看合同</view>
      <view class='signCode'>签署二维码</view>
      <view @tap="isShowModal2=true"
            class='abolish'>作废合同</view>
    </view>
    <view class='personTitle'>产权人信息</view>
    <view class='personInfo'>
      <block v-for="item in personInfo"
             :key="item.text">
        <view class='infoItem'>
          <view class='itemLeft'>{{item.text}}</view>
          <view class='itemRight'>{{item.val}}</view>
          <view @tap="callPhone"
                v-if="item.text==='业主电话'"
                class='itemPhone cuIcon-phone'></view>
        </view>
      </block>
    </view>

    <view class='housTitle'>房源信息</view>
    <view class='housInfo'>
      <block v-for="item in housingInfo"
             :key="item.text">
        <view class='infoItem'>
          <view class='itemLeft'>{{item.text}}</view>
          <view class='itemRight'>{{item.val}}</view>
          <view @tap="copyBtn"
                v-if="item.text=='台账号'"
                class="copyBtn">复制</view>
        </view>
      </block>
    </view>

    <view class='financeTitle'>年付金融</view>
    <view class='financeInfo'>
      <view class='infoItem'>
        <view class='itemLeft'>房东年付/租客月付</view>
        <view class='itemRight'>支持</view>
      </view>
    </view>

    <Modal2 :isModel1="true"
            :isShowModal2="isShowModal2"
            modalTitle="作废合同"
            :isModel1Title="false"
            :btnList="['再想想','确认作废']"
            :model1List="['合同删除后，不能进行签署，不能恢复，确定继续作废合同吗？']"
            @clickModal2MaskCallBack="isShowModal2=false"
            @clickModal2ItemCallBack="clickModalBtn"></Modal2>
    <view style="width:750rpx;height:100rpx"></view>
  </view>
</template>

<script>
import Modal2 from '../../components/comm/modal2/modal2.vue';
export default {
  name: 'contractDetail',
  components: {
    Modal2
  },
  data () {
    return {
      personInfo: [{ text: '业主姓名', val: '王二' }, { text: '业主电话', val: '186 8899 3322' }],
      housingInfo: [
        { text: '房源', val: '望京西园1区3号楼503 A房间' },
        { text: '台账号', val: '京A 3-43-2' },
        { text: '租期', val: '2018年3月3日 - 2019年2月5日(368天)' },
        { text: '月租金', val: '￥ 3100.00' },
        { text: '付款方式', val: '押一付三' }
      ],
      isShowModal2: false
    }
  },
  methods: {
    clickModalBtn (e) {
      console.log(e);
    },
    //拨打电话
    callPhone () {
      uni.makePhoneCall({
        phoneNumber: '114' //仅为示例
      });
    },
    //复制
    copyBtn () {
      uni.setClipboardData({
        data: 'hello',
        success: function () {
          console.log('success');
        }
      });
    }
  }
}
</script>

<style lang='scss' scoped>
.contractDetail {
  .detailTop {
    padding-top: 60rpx;
    box-sizing: border-box;
    width: 750rpx;
    // height: 500rpx;
    background-color: white;
    position: relative;
    display: flex;
    flex-direction: column;
    // justify-content: space-around;
    align-items: center;

    .tag {
      position: absolute;
      left: 0rpx;
      top: 0rpx;
      width: 340rpx;
      height: 60rpx;
      background-color: #1296db;
      transform: rotate(-40deg);
      text-align: center;
      color: white;
      font-size: 32rpx;
      line-height: 60rpx;
      margin-top: 40rpx;
      margin-left: -100rpx;
    }
    .reason {
      width: 480rpx;
      padding-bottom: 40rpx;
      font-size: 30rpx;
      color: #ea6f6a;
    }
    .topTime {
      font-size: 32rpx;
      text {
        font-weight: 600;
        padding-left: 10rpx;
      }
    }
    .review {
      width: 370rpx;
      height: 80rpx;
      background-color: #00a680;
      border-radius: 40rpx;
      text-align: center;
      line-height: 80rpx;
      color: white;
      font-size: 32rpx;
      margin-top: 30rpx;
    }
    .signCode {
      width: 370rpx;
      height: 80rpx;
      border: solid 1rpx #00a680;
      border-radius: 40rpx;
      color: #00a680;
      font-size: 32rpx;
      text-align: center;
      line-height: 80rpx;
      margin-top: 30rpx;
    }
    .abolish {
      font-size: 30rpx;
      color: #ec7b75;
      margin-top: 30rpx;
      margin-bottom: 50rpx;
    }
  }
  .personTitle,
  .housTitle,
  .financeTitle {
    font-size: 26rpx;
    color: #888888;
    padding: 40rpx 0rpx 16rpx 30rpx;
  }
  .personInfo,
  .housInfo,
  .financeInfo {
    .infoItem {
      padding: 0rpx 40rpx 0rpx 40rpx;
      height: 100rpx;
      background-color: white;
      display: flex;
      justify-content: space-between;
      align-items: center;
      border-bottom: solid calc(1px / 2.5) #d9d9d9;
      .itemLeft {
        width: 170rpx;
        font-size: 30rpx;
      }
      .itemRight {
        flex-grow: 1;
        font-size: 30rpx;
        color: #a0a0a0;
      }
      .copyBtn {
        color: #959595;
        border: solid 1rpx #959595;
        padding: 4rpx 20rpx;
        border-radius: 8rpx;
        font-size: 28rpx;
      }
      .itemPhone {
        color: #959595;
        font-size: 50rpx;
      }
      &:last-child {
        border: none;
      }
    }
  }
  .financeInfo {
    .infoItem {
      .itemLeft {
        width: 290rpx;
        font-size: 28rpx;
      }
    }
  }
}
</style>