<template>
  <view class='tenantContract'>
    <!-- 租客信息 -->
    <view class='infoTitle'>
      <view class='titleLeft'>租客信息</view>
      <view class='titleRight'>{{(true?'+添加合租人':'移除合伙人')}}</view>
    </view>
    <view class='infoBox'>
      <block v-for="item in tenantInfo"
             :key="item.text">
        <view :class="['itemBox',item.text==='居住人数'?'counterBox':'']">
          <view class='itemLeft'>{{item.text}}</view>
          <input class='itemCenter input'
                 v-if="item.text!=='居住人数'"
                 type="text"
                 :placeholder="item.val"
                 placeholder-style="font-size:28rpx;color:#cccccc">
          <view v-if="item.text==='居住人数'"
                class='counter'>
            <view @tap="increment(1)"
                  class='add'>+</view>
            <view class='num'>{{counterNum}}</view>
            <view @tap="increment(-1)"
                  class='cut'>-</view>
          </view>
        </view>
      </block>
    </view>

    <!-- 租客证件 -->
    <view class='infoTitle'>
      <view class='titleLeft'>租客证件</view>
      <view class='titleRight'></view>
    </view>
    <view class='infoBox'>
      <block v-for="item in cardInfo"
             :key="item.text">
        <view :class="['itemBox',item.text==='居住人数'?'counterBox':'']">
          <view class='itemLeft'>{{item.text}}</view>
          <input class='itemCenter'
                 v-if="item.text!=='居住人数'"
                 type="text"
                 :placeholder="item.val"
                 placeholder-style="font-size:28rpx;color:#cccccc">
          <view v-if="item.isArrow"
                class="cuIcon-right"></view>
        </view>
      </block>
    </view>

    <!-- 房源 -->
    <view class='infoTitle'>
      <view class='titleLeft'>房源</view>
      <view class='titleRight'></view>
    </view>
    <view class='infoBox'>
      <block v-for="item in houseInfo"
             :key="item.text">
        <view :class="['itemBox',item.text==='居住人数'?'counterBox':'']">
          <view class='itemLeft'>{{item.text}}</view>
          <input class='itemCenter'
                 v-if="item.text!=='居住人数'&&item.text!=='合同时间'"
                 type="text"
                 :placeholder="item.val"
                 placeholder-style="font-size:28rpx;color:#cccccc">
          <view v-if="item.text==='居住人数'"
                class='counter'>
            <view class='add'>+</view>
            <view class='num'></view>
            <view class='cut'>-</view>
          </view>
          <view v-if="item.isArrow"
                class="cuIcon-right"></view>
          <view v-if="item.text==='合同时间'"
                class='time'>
            <view class='start'>
              <picker v-if="!item.isInput"
                      mode="date"
                      fields="month"
                      :value="currentData"
                      start="2015-09-01"
                      end="2017-09-01"
                      @change="bindDateChange">
                <view class="picker">
                  起始时间
                </view>
              </picker>
            </view>
            <view class='center'>至</view>
            <view class='end'>
              <picker v-if="!item.isInput"
                      mode="date"
                      fields="month"
                      :value="currentData"
                      start="2015-09-01"
                      end="2017-09-01"
                      @change="bindDateChange">
                <view class="picker">
                  截止时间
                </view>
              </picker>
            </view>
            <view class='hack'></view>
          </view>
        </view>
      </block>
    </view>

    <!-- 尾款合并 -->
    <view class='infoTitle'>
      <view class='titleLeft'>尾款合并</view>
      <view class='titleRight'></view>
    </view>
    <view class='balanceBox'>
      <view class='boxTop'>
        <view class='balanceLeft'>尾款合并</view>
        <!-- <view >合并到首次一起付款</view> -->
        <picker mode="selector"
                :range="mergeRange"
                @change="bindDateChange">
          <view class='merge'>请选择</view>
        </picker>
        <view class="cuIcon-right"></view>
      </view>
      <view class='boxBottom'>
        合同最后一起账单5天，对应金额150元。建议合并
      </view>
    </view>

    <!-- 添加费用 -->
    <view class='infoTitle'>
      <view class='titleLeft'>添加费用</view>
      <view class='titleRight'></view>
    </view>
    <view class='addItem'>
      <block v-for="item in coastList"
             :key="item.text">
        <view class='itemBox'>
          <view class='itemLeft'>{{item.text}}</view>
          <view class='itemPrice'>{{item.price}}</view>
          <view :class="[item.status?'itemBtn':'deItemBtn']">
            <view @tap="switchPrice(item,'一次性')"
                  class="active">一次性</view>
            <view @tap="switchPrice(item,'每月')"
                  class="deActive">每月</view>
          </view>
          <view @tap="removePrice(item)"
                class='itemCross'>×</view>
        </view>
      </block>
    </view>
    <view class='addBox'
          @tap="addCoast">
      <view><text>＋</text>点击添加费用</view>
    </view>

    <!-- 交割单 -->
    <view class='infoTitle'>
      <view class='titleLeft'>房屋交割单</view>
      <view class='titleRight'></view>
    </view>
    <view class='infoBox'>
      <view class="itemBox">
        <view class='itemLeft'>房屋交割单</view>
        <input class='itemCenter'
               type="text"
               placeholder-style="font-size:28rpx;color:#cccccc">
        <view class="cuIcon-right"></view>
      </view>
    </view>

    <view class='nextBtn'
          @tap="confirmBtn">提交</view>

    <!-- 确认费用弹框 -->
    <view v-if="isShowModal"
          class="confirmModal"
          catchtouchmove="true">
      <view @tap="closeMask"
            class='mask'></view>
      <view class='maskBox'>
        <view class='title'>合同费用确认</view>
        <view class='info'>
          <view class='name'>租客姓名：<text class="nameRight">张三 <text>(510 120 19930501 2429)</text></text></view>
          <view class='phone'>手机号码：<text>180 1289 3300</text></view>
        </view>
        <view class='cost'>
          <view>月租金：<text>3000元（年付）</text></view>
          <view>服务费：<text>270元/月</text></view>
          <view>卫生费：<text>30元/月</text></view>
        </view>
        <view class='total'>
          <view>首次付款：<text>6300</text>元（含押金）</view>
          <view>每月租金：<text>3300</text>元（含服务费）</view>
        </view>
        <view class="btn">
          <view>返回</view>
          <view>生成合同</view>
        </view>
      </view>
    </view>

    <CostModal :isShow="isShowCoask"
               @cilckCoastMaskCallBack="clickCoskMask"></CostModal>
  </view>
</template>

<script>
import CostModal from '../../../components/tenantContract-component/addCostModal.vue';
export default {
  name: 'tenantContract',
  data () {
    return {
      counterNum: 0,
      tenantInfo: [
        { text: '租客姓名', val: '请填写租客姓名', status: true, isArrow: false },
        { text: '手机号码', val: '请填写租客手机号', status: true, isArrow: false },
        { text: '合租人姓名', val: '请填写合租客姓名', status: true, isArrow: false },
        { text: '合租人手机号', val: '请填写合租人手机号', status: true, isArrow: false },
        { text: '居住人数', val: '', status: true, isArrow: false }
      ],
      cardInfo: [
        { text: '身份证信息', val: '', status: true, isArrow: true },
        { text: '合租人身份信息', val: '', status: true, isArrow: true }
      ],
      houseInfo: [
        { text: '房源', val: '', status: true, isArrow: true },
        { text: '房间', val: '请选择', status: true, isArrow: true },
        { text: '合同时间', val: '', status: true, isArrow: false },
        { text: '付款方式', val: '', status: true, isArrow: true },
        { text: '月租金', val: '', status: true, isArrow: false },
        { text: '押金', val: '', status: true, isArrow: false }
      ],
      coastList: [
        { text: '门卡', price: '0.00', status: true },
        { text: '水电费', price: '10.00', status: true },
        { text: '管理费', price: '60.00', status: true },
      ],
      isShowModal: false,
      isShowCoask: false,
      mergeRange: ['合并进首次一起付款', '合并进最后一期付款', '不合并']
    }
  },
  methods: {
    //添增减居住人数
    increment (num) {
      if (num == 1) {
        this.counterNum++;
      } else {
        if (this.counterNum > 0) {
          this.counterNum--;
        }
      }
    },
    //日期选择器
    bindDateChange (e) {

    },
    //提交按钮
    confirmBtn () {
      this.isShowModal = true;
    },
    //关闭提交确定模态框
    closeMask () {
      this.isShowModal = false;
    },
    //添加费用按钮
    addCoast () {
      this.isShowCoask = true;
    },
    //添加费用遮罩点击事件
    clickCoskMask () {
      this.isShowCoask = false;
    },
    //切换费用
    switchPrice (item, text) {
      let i = this.coastList.indexOf(item);
      if (i != -1 && text == '一次性') {
        this.coastList[i].status = true;
      } else {
        this.coastList[i].status = false;
      }
    },
    //删除费用
    removePrice (item) {
      let i = this.coastList.indexOf(item);
      this.coastList.splice(i, 1);
    }
  },
  components: {
    CostModal
  }
}
</script>

<style lang='scss' scoped>
.tenantContract {
  .infoTitle {
    // width: 690rpx;
    display: flex;
    justify-content: space-between;
    margin: 0 auto;
    align-items: center;
    padding: 40rpx 30rpx 20rpx 16rpx;
    font-size: 26rpx;
    .titleLeft {
      color: grey;
    }
    .titleRight {
      color: #4882c0;
    }
  }
  .infoBox {
    .itemBox {
      padding-left: 40rpx;
      padding-right: 40rpx;
      height: 100rpx;
      box-sizing: border-box;
      background-color: white;
      display: flex;
      justify-content: space-between;
      align-items: center;
      font-size: 30rpx;
      position: relative;
      border-bottom: solid calc(1px / 2.5) #d9d9d9;
      .itemLeft {
        width: 250rpx;
      }
      .itemCenter {
        flex-grow: 1;
      }
      .counter {
        display: flex;
        width: 200rpx;
        height: 60rpx;
        border: solid 1rpx #cccccc;
        text-align: center;
        align-items: center;
        border-radius: 6rpx;
        .add,
        .cut {
          width: 60rpx;
        }

        .num {
          height: 60rpx;
          flex-grow: 1;
          border-left: solid 1rpx #cccccc;
          border-right: solid 1rpx #cccccc;
          line-height: 60rpx;
          transform: tr;
        }
      }
      .time {
        display: flex;
        flex-grow: 1;
        // width: 80%;
        align-items: center;
        position: relative;
        justify-content: space-between;
        .start,
        .end {
          width: 80%;
          font-size: 30rpx;
          height: 100rpx;
          color: #cccccc;
          line-height: 100rpx;
        }
        .end {
          text-align: right;
        }
        .center {
          // width: 120rpx;
          text-align: center;
        }
        .hack {
          position: absolute;
          width: 160rpx;
          height: 80rpx;
          background-color: red;
          left: 130rpx;
          opacity: 0;
        }
      }
      .cell {
        position: absolute;
        width: 690rpx;
        height: 2rpx;
        background-color: #ececec;
        bottom: 0rpx;
        left: 50%;
        transform: translateX(-50%);
      }
      .input {
        position: absolute;
        // background-color: yellow;
        width: 100%;
        height: 100%;
        top: 0rpx;
        left: 0rpx;
        padding-left: 300rpx;
      }
      &:last-child {
        border-bottom: none;
      }
      &:active {
        background-color: #fafafa;
      }
    }
    .itemBox:last-child {
      .cell {
        position: absolute;
        width: 690rpx;
        height: 0rpx;
        background-color: #ececec;
        bottom: 0rpx;
        left: 50%;
        transform: translateX(-50%);
      }
    }
    .counterBox {
      justify-content: left;
    }
  }
  .balanceBox {
    padding: 30rpx 40rpx 30rpx 40rpx;
    background-color: white;
    .boxTop {
      display: flex;
      align-items: center;
      justify-content: space-between;
      // padding-top: 30rpx;
      height: 100%;
      position: relative;
      font-size: 30rpx;
      .merge {
        position: absolute;
        height: 100rpx;
        width: 100%;
        flex-grow: 1;
        text-align: right;
        color: #4882c0;
        left: 0;
        top: 0;
        padding-right: 50rpx;
        box-sizing: border-box;
      }
    }
    .boxBottom {
      font-size: 26rpx;
      color: grey;
      padding-top: 10rpx;
    }
    &:active {
      background-color: #fafafa;
    }
  }
  .addBox {
    width: 750rpx;
    height: 120rpx;
    background-color: white;
    display: flex;
    justify-content: center;
    align-items: center;
    font-size: 30rpx;
    view {
      color: #4882c0;
      text {
        padding-right: 20rpx;
        font-weight: 600;
        font-size: 36rpx;
      }
    }
    &:active {
      background-color: #fafafa;
    }
  }
  .addItem {
    background-color: white;
    box-sizing: border-box;
    padding-top: 20rpx;
    .itemBox {
      width: 690rpx;
      margin: 0 auto;
      display: flex;
      align-items: center;
      justify-content: space-between;
      height: 100rpx;
      font-size: 30rpx;
      // border: solid 1px red;
      .itemLeft {
        width: 160rpx;
      }
      .itemPrice {
        flex-grow: 1;
      }
      .itemBtn,
      .deItemBtn {
        width: 200rpx;
        display: flex;
        height: 60rpx;
        font-size: 28rpx;
        border-radius: 8rpx;
        overflow: hidden;
        view {
          width: 50%;
          text-align: center;
          line-height: 60rpx;
        }
        .active {
          background-color: #00a680;
          color: white;
          border: solid 1rpx #00a680;
        }
        .deActive {
          background-color: white;
          border: solid 1rpx #cccccc;
          border-radius: 0rpx 8rpx 8rpx 0rpx;
          border-left: none;
        }
      }
      .deItemBtn {
        .active {
          background-color: white;
          border: solid 1rpx #cccccc;
          border-radius: 8rpx 0rpx 0rpx 8rpx;
          border-right: none;
          color: #333333;
        }
        .deActive {
          background-color: #00a680;
          color: white;
          border: solid 1rpx #00a680;
        }
      }
      .itemCross {
        font-size: 40rpx;
        color: red;
        width: 50rpx;
        text-align: center;
      }
    }
  }
  .nextBtn {
    width: 690rpx;
    height: 100rpx;
    background-color: #00a680;
    color: white;
    line-height: 100rpx;
    text-align: center;
    margin: 30rpx auto;
    border-radius: 10rpx;
    padding-bottom: 50rpx;
    font-size: 34rpx;
    &:active {
      background-color: #007e5e;
    }
  }
  .confirmModal {
    .mask {
      position: fixed;
      top: 0;
      left: 0;
      width: 750rpx;
      height: 100vh;
      background-color: rgba(0, 0, 0, 0.4);
      z-index: 10;
      animation: fade 0.1s ease-in-out;
    }
    .maskBox {
      width: 670rpx;
      height: 600rpx;
      background-color: #e4e4e7;
      border-radius: 10rpx;
      position: fixed;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
      margin: auto;
      z-index: 11;
      padding: 30rpx 0rpx 0rpx 0rpx;
      font-size: 24rpx;
      display: flex;
      flex-direction: column;
      animation: fade 0.1s ease-in-out;
      font-size: 28rpx;
      overflow: hidden;
      .title {
        text-align: center;
        font-size: 32rpx;
        font-weight: 600;
      }
      .info {
        padding-top: 50rpx;
        padding-left: 30rpx;
        .name {
          .nameRight {
            text {
              font-weight: 600;
              padding-left: 20rpx;
            }
          }
        }
      }
      .cost {
        padding-top: 30rpx;
        padding-bottom: 30rpx;
        padding-left: 30rpx;
      }
      .total {
        margin-left: 30rpx;
        width: 500rpx;
        border-top: dotted 4rpx #cccccc;
        padding: 20rpx 0rpx 40rpx 0rpx;
        view {
          text {
            font-size: 30rpx;
            font-weight: 700;
          }
        }
      }
      .btn {
        display: flex;
        border-top: solid 3rpx #cccccc;
        height: 100%;
        align-items: center;
        // background-color: rosybrown;
        // padding-top: 10rpx;
        flex-grow: 1;
        font-size: 32rpx;
        view {
          height: 100%;
          width: 50%;
          display: flex;
          justify-content: center;
          align-items: center;
          font-size: 30rpx;
        }
        view:nth-child(1) {
          border-right: solid 2rpx #cccccc;
        }
        view:nth-child(2) {
          background-color: #666666;
          color: white;
        }
      }
    }
  }
}

@keyframes fade {
  0% {
    opacity: 0;
  }
  100% {
    opacity: 1;
  }
}
</style>