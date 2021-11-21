<template>
  <view class="deliverylist">
    <view class="listBox">
      <view class="itemLeft">
        <block v-for="(item) in items"
               :key="item.text">
          <view :style="'padding:'+(currentType!='生活费用'?'0rpx 30rpx 0rpx 40rpx':'0rpx 40rpx 0rpx 40rpx')+';'"
                class="item"
                @tap.stop="cilckItemHandel(item)">
            <view class="cover_view">
              <checkbox v-if="currentType!='生活费用'"
                        class="check_box"
                        @tap.stop="radioChange(item)"
                        :checked="item.status" />
            </view>
            <view :style="'margin-left:'+(currentType!='生活费用'?'30rpx':'0rpx')+';'"
                  class="text">{{item.text}}</view>
            <block v-if="currentType!='生活费用'">
              <input :focus="item.isClick"
                     @blur="bindBlur(item)"
                     @focus="bindFocus($event,item)"
                     @input="bindInput($event,item)"
                     :style="'color:black;opacity:'+(item.isClick?'1':'0')+';font-size:30rpx'"
                     class="inp"
                     type="text"
                     :value="item.val"
                     placeholder-style="#cccccc"
                     :placeholder="(item.isClick?'请输入':'')" />
              <input disabled
                     :style="'color:black;opacity:'+(!item.isClick?'1':'0')+';font-size:30rpx'"
                     class="valText"
                     :value="item.val" />
            </block>
            <block v-else>
              <view class="right">
                <!-- <view :style="'color:'+(item.val=='请选择'?'#cccccc':'#333333')">{{item.val}}</view> -->
                <input class="priceInp"
                       disabled
                       v-model="item.val"
                       style="color:#333333;font-size:30rpx;width:100%"
                       placeholder-style="color:#cccccc;font-size:30rpx"
                       placeholder="请选择"
                       type="text">
                <view class="cuIcon-right"></view>
              </view>
            </block>
          </view>
          <view id="cell">
            <view class="line"></view>
          </view>
        </block>
      </view>
    </view>
    <view :style="'background-color:'+(!isChange?'#00a680':'#cccccc')+';'"
          @tap="saveBtn"
          class="saveBtn">保存</view>
    <view style="width:750rpx;height:100rpx"></view>
  </view>
</template>

<script>
import { mapState, mapMutations } from 'vuex';
export default {
  name: 'deliverylist',
  data () {
    return {
      currentType: '',
      items: [],
      electric: [{ text: '双人床', status: false, val: '', isClick: false }, { text: '单人床', status: false, val: '', isClick: false }, { text: '床头柜', status: false, val: '', isClick: false }, { text: '衣柜', status: false, val: '', isClick: false }, { text: '电脑桌', status: false, val: '', isClick: false }, { text: '书桌', status: false, val: '', isClick: false }, { text: '书柜', status: false, val: '', isClick: false }, { text: '餐桌', status: false, val: '', isClick: false }, { text: '椅子', status: false, val: '', isClick: false }, { text: '电视柜', status: false, val: '', isClick: false }, { text: '沙发', status: false, val: '', isClick: false }],
      furniture: [{ text: '电视机', status: false, val: '', isClick: false }, { text: '冰箱', status: false, val: '', isClick: false }, { text: '洗衣机', status: false, val: '', isClick: false }, { text: '空调', status: false, val: '', isClick: false }, { text: '微波炉', status: false, val: '', isClick: false }, { text: '热水器', status: false, val: '', isClick: false }, { text: '燃气灶', status: false, val: '', isClick: false }, { text: '油烟机', status: false, val: '', isClick: false }, { text: '饮水机', status: false, val: '', isClick: false }, { text: '机顶盒', status: false, val: '', isClick: false }, { text: '灭火器', status: false, val: '', isClick: false }],
      keys: [{ text: '房门钥匙', status: false, val: '', isClick: false }, { text: '单元门钥匙', status: false, val: '', isClick: false }, { text: '门禁卡', status: false, val: '', isClick: false }, { text: '信箱钥匙', status: false, val: '', isClick: false }, { text: '冷水卡', status: false, val: '', isClick: false }, { text: '热水卡', status: false, val: '', isClick: false }, { text: '中水卡', status: false, val: '', isClick: false }, { text: '电卡', status: false, val: '', isClick: false }, { text: '燃气卡', status: false, val: '', isClick: false }],
      lifePrice: [{ text: '水费', status: false, val: '', isClick: false }, { text: '电费', status: false, val: '', isClick: false }, { text: '电话费', status: false, val: '', isClick: false }, { text: '收视费', status: false, val: '', isClick: false }, { text: '供暖费', status: false, val: '', isClick: false }, { text: '燃气费', status: false, val: '', isClick: false }, { text: '物业费', status: false, val: '', isClick: false }, { text: '卫生费', status: false, val: '', isClick: false }]
    };
  },
  onLoad (options) {
    uni.setNavigationBarTitle({
      title: options.type
    })
    this.currentType = options.type
    switch (options.type) {
      case '电器类':
        this.items = this.furniture
        break;
      case '家具类':
        this.items = this.electric
        break;
      case '钥匙凭证':
        this.items = this.keys
        break;
      case '生活费用':
        this.items = this.lifePrice
        break;
    }
  },
  computed: {
    ...mapState({
      deliveryList: function (state) {
        //初始化选中的数据
        let thatData = [this.furniture, this.electric, this.keys, this.lifePrice]
        state.deliveryList.forEach((ele, index) => {
          if (ele.length > 0) {
            ele.forEach((item) => {
              thatData[index].forEach((v, i) => {
                if (v.text == item.text) {
                  thatData[index][i] = item
                }
              })
            })
          }
        })
        return state.deliveryList
      }
    }),

  },
  methods: {
    ...mapMutations(['setDeliveryList']),
    //是否发生改变
    isChange () {
      if (this.currentType != '生活费用') {
        return this.items.every(ele => !ele.val.trim() && ele.status == false)
      } else {
        return this.items.every(ele.status == false)
      }
    },
    /**
     * 单选按钮点击事件
     */
    radioChange (item) {
      let index = this.items.indexOf(item);
      this.items[index].status = !this.items[index].status;
      if (!this.items[index].isClick) {
        this.items[index].isClick = true
      } else {
        this.items[index].isClick = false
      }
    },
    /**
     * 选项点击事件
     */
    cilckItemHandel (item) {
      if (this.currentType != '生活费用') {
        let index = this.items.indexOf(item);
        this.items[index].status = true;
        let temp = this.items;
        this.items = temp.map(ele => {
          ele.isClick = false
          if (ele.text == item.text) {
            ele.isClick = true
          }
          return ele
        })
      } else {
        let deliveryList = this.deliveryList;
        deliveryList[deliveryList.length - 1] = this.lifePrice
        this.setDeliveryList(deliveryList)
        uni.navigateTo({
          url: `../../../subpackTenantContract/pages/tenantContract/lifePrice?type=${item.text}`,
        })
      }

    },
    /**
     * 失焦事件
     */
    bindBlur (item) {
      let index = this.items.indexOf(item);
      this.items[index].isClick = false;
      // if (!this.items[index].status) {
      //   this.items[index].val = ''
      // }
    },
    /**
     * 文本框改变事件
     */
    bindInput (e, item) {
      let index = this.items.indexOf(item);
      this.items[index].val = e.detail.value
    },
    /**
     * 文本框获取焦点事件
     */
    bindFocus (e, item) {
      let temp = this.items;
      this.items = temp.map(ele => {
        ele.isClick = false
        if (ele.text == item.text) {
          ele.isClick = true
        }
        return ele
      })
    },
    /**
     * 保存按钮
     */
    saveBtn () {


      //数据未发生改变直接返回
      if (this.isChange == true) {
        uni.navigateBack({
          delta: -1
        })
        return
      }

      //判断是否有选中且未填写的项
      let temp = [];
      temp = this.items.filter(ele => ele.status);
      let isSave = false;
      if (this.currentType != '生活费用') {
        for (let i = 0; i < temp.length; i++) {
          if (temp[i].val == '') {
            uni.showToast({
              title: `请输入${temp[i].text}配置`,
              icon: 'none'
            })
            isSave = true;
            break;
          }
        }
      }
      if (!isSave) {
        //将填写的数据保存到状态机
        let deliveryList = this.deliveryList;
        let valList = [];
        valList = this.items.filter((ele, i) => {
          if (this.currentType != '生活费用' && ele.status) {
            return ele
          } else if (this.currentType == '生活费用' && ele.val != '') {
            return ele
          }
        })
        switch (this.currentType) {
          case '电器类':
            deliveryList[0] = valList
            break;
          case '家具类':
            deliveryList[1] = valList
            break;
          case '钥匙凭证':
            deliveryList[2] = valList
            break;
          case '生活费用':
            deliveryList[3] = valList
            break;
          default:
            break;
        }
        this.setDeliveryList(deliveryList);
        uni.navigateBack({
          delta: -1
        })
      }
    }

  }

};
</script>

<style lang="scss" scoped>
$pageBgColor: #f7f7f7;
$borderColor: #e9e9e9;
$placerColor: #cccccc;
$titleColor: #888888;
$greenColor: #00a680;
page {
  background: #ffffff;
}
.deliverylist {
  background-color: white;
  min-height: 100vh;
  .listBox {
    .itemLeft {
      .item {
        width: 750rpx;
        // margin-left: 30rpx;
        display: flex;
        height: 100rpx;
        align-items: center;
        // border-bottom: solid 1rpx $borderColor;
        box-sizing: border-box;
        padding: 0rpx 30rpx 0rpx 10rpx;
        position: relative;
        .cover_view {
          border-radius: 50%;
          overflow: hidden;
          border: 1rpx solid #eee;
          .check_box {
            transform: scale(1.2);
          }
        }

        .text {
          margin-left: 30rpx;
          font-size: 30rpx;
          width: 200rpx;
          height: 100%;
          line-height: 100rpx;
        }
        .inp,
        .valText {
          position: absolute;
          background-color: seagreen;
          flex-grow: 1;
          font-size: 30rpx;
          height: 40rpx;
          left: 240rpx;
          background-color: white;
        }
        .right {
          display: flex;
          flex-grow: 1;
          align-items: center;
          justify-content: space-between;
          color: $placerColor;
          font-size: 30rpx;
          width: 100%;
          .priceInp {
            width: 100%;
            overflow: hidden;
            text-overflow: ellipsis;
            white-space: nowrap;
          }
        }
        .inp,
        .valText {
          margin-left: 60rpx;
          margin-top: -4rpx;
        }
        &:active {
          background-color: #fafafa;
          input {
            background-color: #fafafa;
          }
        }
      }
    }
  }
  .saveBtn {
    width: 690rpx;
    height: 100rpx;
    background-color: $greenColor;
    color: white;
    text-align: center;
    line-height: 100rpx;
    font-size: 34rpx;
    margin: 40rpx auto;
    border-radius: 10rpx;
    &:active {
      background: #007e5e;
    }
  }
}

@keyframes animate {
  0% {
    transform: scale(0.2);
  }
  100% {
    transform: scale(0.8);
  }
}
</style>