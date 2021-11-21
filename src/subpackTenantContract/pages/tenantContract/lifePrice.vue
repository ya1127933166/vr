<template>
  <!-- 生活费用信息 -->
  <view class="lifePrice">
    <block v-for="item in list"
           :key="item.text">
      <view class="lifeItem">
        <view class="itemLeft">{{item.text}}</view>
        <picker v-if="!item.isInp"
                class="picker"
                :mode="item.mode"
                :range="item.selectList"
                :value="date"
                :start="preDate"
                :end="nextDate"
                @change="bindChange($event,item)">
          <view :style="'color:'+(item.val=='请选择'?'#cccccc':'black')+';'">{{item.val}}</view>
        </picker>
        <input :maxlength="20"
               v-model="item.val"
               class="input"
               style="color:black"
               v-else
               type="digit"
               placeholder-style="color:#cccccc"
               placeholder="请填写" />
        <view v-if="!item.isInp"
              class="cuIcon-right"></view>
      </view>
    </block>
    <view @tap="saveBtn"
          class="saveBtn"
          :style="'background-color:'+(isActiveBtn?'#00a680':'#cccccc')+';'">保存</view>
    <view @tap="clear"
          class="clear"
          :style="'background-color:'+(isActiveBtn?'#dd524d':'#cccccc')+';'">清空</view>
  </view>
</template>

<script>
import { mapState, mapMutations } from 'vuex';
export default {
  name: 'lifePrice',
  data () {
    return {
      list: [
        { text: '起计日期', val: '请选择', isInp: false, selectList: [], mode: 'date' },
        { text: '起计底数', val: '', isInp: true },
        { text: '单价', val: '', isInp: true },
        { text: '单位', val: '请选择', isInp: false, mode: 'selector', selectList: ['每度(电)', '每吨(水)', '每方(气)', '每月', '每年'] }
      ],
      preDate: '',
      nextDate: '',
      isActiveBtn: false,
      tempList: [],
      currentType: ''
    }
  },
  onLoad (options) {
    uni.setNavigationBarTitle({
      title: options.type,
    })
    this.currentType = options.type;
  },
  mounted () {
    this.initData();
  },
  computed: {
    ...mapState({
      deliveryList: function (state) {
        const that = this;
        let temp = state.deliveryList[state.deliveryList.length - 1];
        temp.forEach(ele => {
          if (ele.text == that.currentType && ele.val != '') {
            ele.val.split(',').forEach((item, index) => {
              that.list[index].val = item
            })
          }
        })

        return state.deliveryList
      }
    }),
    /**
     * 序列化监听对象
     */
    watchList () {
      return JSON.stringify(this.list)
    }
  },
  watch: {
    /**
     * 监听页面是否有输入数据
     */
    watchList (newValue, oldValue) {
      if (newValue != this.tempList) {
        this.isActiveBtn = true
      } else {
        this.isActiveBtn = false
      }
    }
  },
  methods: {
    ...mapMutations(['setDeliveryList']),
    /**
     *初始化页面配置 
     */
    initData () {
      //深拷贝原数组，用户监听对比
      this.tempList = JSON.stringify(this.list);
      //初始话当前日期
      this.preDate = (new Date().getFullYear() - 1) + '-' + ((new Date().getMonth() + 1) < 10 ? `0${(new Date().getMonth() + 1)}` : `${(new Date().getMonth() + 1)}`);
      this.nextDate = (new Date().getFullYear() + 11) + '-' + ((new Date().getMonth() + 1) < 10 ? `0${(new Date().getMonth() + 1)}` : `${(new Date().getMonth() + 1)}`);
    },
    /**
     * 下拉列表选择事件
     */
    bindChange (e, item) {
      let index = this.list.indexOf(item)
      if (e.detail.value - 0 < 20) {
        this.list[index].val = this.list[index].selectList[e.detail.value];
      } else {
        this.list[index].val = e.detail.value;
      }
    },
    //清空数据
    clear () {
      // this.list.forEach((ele, i) => {
      //   if (i == 0 || i == 3) {
      //     ele.val = '请选择'
      //   } else {
      //     ele.val = ''
      //   }

      // })
      this.list = [
        { text: '起计日期', val: '请选择', isInp: false, selectList: [], mode: 'date' },
        { text: '起计底数', val: '', isInp: true },
        { text: '单价', val: '', isInp: true },
        { text: '单位', val: '请选择', isInp: false, mode: 'selector', selectList: ['每度(电)', '每吨(水)', '每方(气)', '每月', '每年'] }
      ]
      let temp = this.deliveryList
      let that = this
      temp[temp.length - 1].forEach(ele => {
        if (ele.text == that.currentType) {
          ele.val = ''
        }
      })
      that.setDeliveryList(temp)
      uni.navigateBack({
        delta: -1
      })
    },
    /**
     * 保存按钮
     */
    saveBtn () {
      const that = this;
      if (!this.isActiveBtn) {
        return
      }
      let isSave = false;
      for (let i = 0; i < this.list.length; i++) {
        if (this.list[i].val == '请选择' || this.list[i].val == '') {
          uni.showToast({
            title: `请输入或选择${this.list[i].text}选项`,
            icon: 'none'
          })
          isSave = true;
          break;
        }
      }
      if (isSave) {
        return;
      }

      let temp = this.deliveryList
      temp[temp.length - 1].forEach(ele => {
        if (ele.text == that.currentType) {
          ele.val = that.list.map(ele => {
            return ele.val
          }).join(',')
        }
      })
      that.setDeliveryList(temp)
      uni.navigateBack({
        delta: -1
      })
    }
  }
}
</script>

<style lang='scss' scoped>
$pageBgColor: #f7f7f7;
$borderColor: #e9e9e9;
$placerColor: #cccccc;
$titleColor: #888888;
$greenColor: #00a680;
.lifePrice {
  min-height: 100vh;
  background-color: white;
  .lifeItem {
    display: flex;
    height: 100rpx;
    padding: 0rpx 40rpx 0rpx 40rpx;
    border-bottom: solid calc(1px / 2.5) #d9d9d9;
    margin: 0 auto;
    justify-content: space-between;
    align-items: center;
    position: relative;
    font-size: 30rpx;
    .itemLeft {
      width: 240rpx;
    }
    .picker,
    .input {
      position: absolute;
      left: 0;
      top: 0;
      width: 100%;
      height: 100%;
      line-height: 100rpx;
      padding-left: 240rpx;
      // flex-grow: 1;
      color: $placerColor;
    }
    .picker {
      text-indent: 240rpx;
      padding-left: 0rpx;
    }
    &:active {
      background-color: #fafafa;
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
    border-radius: 8rpx;
    &:active {
      background-color: #007e5e !important;
    }
  }
  .clear {
    width: 690rpx;
    height: 100rpx;
    background-color: $uni-color-error;
    color: white;
    text-align: center;
    line-height: 100rpx;
    font-size: 34rpx;
    margin: 40rpx auto;
    border-radius: 8rpx;
  }
}
</style>