<template>
  <!-- 收支记录 -->
  <view class='income'>
    <DropMenu :menuBar="menuBar"
              :list="downList"
              @rightButtonClickCallBack="toAddCost"
              :rightButton="'添加费用'"></DropMenu>
    <scroll-view scroll-y
                 class='infoBox'>
      <view class='total'>
        <view class='totalLeft'>
          <view>收入0笔，合计</view>
          <view>￥0.00</view>
        </view>
        <view class='line'></view>
        <view class='totalRight'>
          <view>支出0笔，合计</view>
          <view>￥0.00</view>
        </view>
      </view>
      <block v-for="item in 10"
             :key="item">
        <BillItem @tap="toBillDetail"></BillItem>
      </block>
      <view style="width:100rpx;height:40rpx"></view>
    </scroll-view>
  </view>
</template>

<script>
import DropMenu from '../../../../components/comm/dropDownMenu/dropDownMenu.vue';
import BillItem from '../../../../components/adminHousing-component/billItem.vue';
export default {
  name: 'income',
  data () {
    return {
      renderList: [],
      mode: ['收支方式', '全部', '收入', '支出'],
      type: ['费用类型', '全部', '租金', '押金', '装修', '配置', '智能设备', '路由器', '宽带', '保洁', '物业', '水电燃气费', '维修', '中介费', '其他'],
      isMode: false,
      isType: false,
      menuBar: [
        { text: "收支方式", status: false },
        { text: "费用类型", status: false }
      ],
      downList: [
        [
          { text: "收支方式", status: false },
          { text: "全部", status: false },
          { text: "收入", status: false },
          { text: "支出", status: false }
        ],
        [
          { text: "费用类型", status: false },
          { text: "全部", status: false },
          { text: "租金", status: false },
          { text: "押金", status: false },
          { text: "装修", status: false },
          { text: "配置", status: false },
          { text: "智能设备", status: false },
          { text: "路由器", status: false },
          { text: "宽带", status: false },
          { text: "保洁", status: false },
          { text: "物业", status: false },
          { text: "水电燃气", status: false },
          { text: "维修", status: false },
          { text: "中介费", status: false },
          { text: "其他", status: false }
        ],
      ]
    }
  },
  methods: {
    toAddCost () {
      uni.navigateTo({
        url: '../../../subpackAdminHousing/pages/adminHousing/income/addCost',
      })
    },
    toBillDetail () {
      uni.navigateTo({
        url: '../../../subpackAdminHousing/pages/adminHousing/income/billDetail'
      })
    }
  },
  mounted () {
    let systemInfo = this.$$globalData.systemInfo;
  },
  components: {
    DropMenu,
    BillItem
  }
}
</script>

<style lang='scss' scoped>
$pageBgColor: #f7f7f7;
$borderColor: #e9e9e9;
$placerColor: #cccccc;
$titleColor: #888888;
$greenColor: #00a680;
.income {
  .infoBox {
    height: calc(100vh - 200rpx);
    width: 750rpx;
    .total {
      display: flex;
      background-color: #4abfa4;
      padding: 30rpx 40rpx 30rpx 40rpx;
      width: 700rpx;
      margin: 20rpx auto;
      color: white;
      .totalLeft {
        width: 50%;
        view:nth-child(1) {
          font-size: 26rpx;
        }
        view:nth-child(2) {
          padding: 20rpx 0rpx 20rpx 0rpx;
          font-size: 50rpx;
        }
      }
      .line {
        width: 2rpx;
        height: 100rpx;
        background-color: white;
      }
      .totalRight {
        padding-left: 60rpx;
        width: 50%;
        view:nth-child(1) {
          font-size: 26rpx;
        }
        view:nth-child(2) {
          padding: 20rpx 0rpx 20rpx 0rpx;
          font-size: 50rpx;
        }
      }
    }
  }
}
</style>