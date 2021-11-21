<template  @tap='closeTip()'>
  <view class='addHouseSource'
        @tap='closeTip()'>
    <view class='addHouseProcess'>
      <progress activeColor="#00a680"
                backgroundColor="#cccccc"
                class='addProcess'
                :percent="pageInfo.len[0]"
                stroke-width="1" />
      <view class='processPoint'>
        <view v-for="(item) in pageInfo.processList"
              :key="item.text"
              :style="'background-color:'+(item.status==true?'#00a680':'#cccccc')+';'"></view>
      </view>
      <view class='processText'>
        <block v-for="(item) in pageInfo.processList"
               :key="item.text">
          <view :style="'color:'+(item.status==true?'#06a782':'#8e8e8e')+';'">{{item.text}}</view>
        </block>
      </view>
    </view>
    <view class='selectBox'>
      <view class='itemBox'>
        <block v-for="(item,index) in list"
               :key="item.text">
          <view v-if="index==list.length-1"
                class="tipStyle">
            <Toltip :text="isText"
                    ref='tip'
                    model="top"
                    y="-65"
                    x="2">
              <image @tap.stop='openTip();'
                     style="width: 30rpx;height: 30rpx;"
                     src="../../static/icon/qustion2.png"
                     mode="aspectFit"></image>
            </Toltip>
          </view>
          <view @tap="clickItem(item)"
                class='selectItem'
                style="position: relative;box-sizing:border-box;margin-left:70rpx;">
            <view v-if="item.text=='房源可见范围'"
                  class='itemLeft'>{{item.text}}</view>
            <view v-else
                  class='itemLeft'>{{item.text}}</view>
            <view class='itemCenter'
                  v-if="item.text!=='面积'&&item.text!=='城市'"
                  :style="'color:'+(item.val==='请选择'?'':'black')+';'">{{item.val}}</view>
            <input class="itemInput"
                   maxlength="20"
                   type="digit"
                   v-model="item.val"
                   v-if="item.text=='面积'"
                   @blur="getBlur"
                   placeholder-style="color:#cccccc"
                   placeholder="请输入">
            <picker :disabled="item.text=='城市'||item.text=='楼栋门牌'"
                    v-if="!item.isInput"
                    :style="'position: absolute;transform: translateX(50%);'"
                    :mode="item.mode"
                    fields="month"
                    :value="item.val"
                    :range="item.selectList"
                    @change="bindDateChange($event,item)">
              <view class="picker"
                    style="transform: translateX(-30%);opacity: 0;width:450rpx;height:100rpx">
                选择
              </view>
            </picker>
            <view v-if="item.text =='面积'">平米</view>
            <view v-else-if='item.text=="城市"'>{{locationInfo.name}}</view>
            <view v-else-if='item.text=="小区名称"&&houseType.id !=""'></view>
            <view v-else
                  class='cuIcon-right'></view>
          </view>
          <view v-if="index==list.length-2">
            <view class="bottom"></view>
          </view>
          <view v-if="index!=list.length-1||index!=list.length-2"
                id="cell">
            <view class="line"></view>
          </view>
        </block>
      </view>
    </view>
    <view @tap="nextBtn"
          :style="'background-color:'+(!isChange?'#00a680':'#cccccc')+';'"
          class='nextBtn'>下一步</view>
  </view>

</template>

<script>
import { mapState, mapMutations, createNamespacedHelpers } from 'vuex';
const { mapState: contractState, mapMutations: contractMutation } = createNamespacedHelpers('contract')
import Toltip from '../../components/comm/tolTip/tolTip.vue'
export default {
  name: 'addHomeSourceStep1',
  data () {
    return {
      list: [
        { text: '城市', isInput: true, val: '' },
        { text: '小区名称', isInput: false, val: '请选择', xiaoId: '' },
        { text: '面积', isInput: true, val: '请输入' },
        { text: '户型', isInput: false, val: '请选择', mode: 'multiSelector', selectList: [['1居室', '2居室', '3居室', '4居室', '5居室'], ['1厅', '2厅', '3厅', '4厅'], ['单卫', '双卫', '三卫', '四卫']] },
        { text: '朝向', isInput: false, val: '请选择', mode: 'selector', selectList: ['东', '南', '西', '北', '东北', '东北', '西南', '西北'] },
        { text: '装修', isInput: false, val: '请选择', mode: 'selector', selectList: ['毛坯', '简单装修', '精装修', '豪华装修'] },
        { text: '楼栋门牌', isInput: false, val: '请选择' },
        { text: '房源可见范围', isInput: false, val: '请选择', mode: 'selector', selectList: ['仅自己可见', '公开'] }
      ],
      isText: '此房源仅自己可见',
      isFlag: false,
      currentInfo: {},
      options: {},
      inputFocus: false,
      houseType: {
        id: ''
      },
      pageType: '添加'

    }
  },
  components: {
    Toltip,
  },
  computed: {
    ...mapState({
      locationInfo: state => state.locationInfo,
      listCity: state => state.listCity,
      houseNumber: function (state) {
        if (state.houseNumber.bound != '') {
          const { bound, unit, floor, room } = state.houseNumber;
          let temp = floor.split('-')[0]
          this.list[6].val = bound + unit + temp + room + '室'
        }
        return state.houseNumber
      }
    }),
    ...contractState({
      pageInfo: state => state.pageInfo,
      step1: function (state) {
        let temp = (Array.from(state.step1))
        this.list.forEach((ele, index) => {
          if (index != 1) {
            ele.val = temp[index]
          } else {
            ele.val = temp[1].name
            ele.xiaoId = temp[1].id
          }
        })
        return state.step1
      }
    }),
    //是否改变过表单
    isChange () {
      return this.list.every(ele => ele.val == '请选择' || ele.val == '')
    }
  },
  onLoad (options) {
    //options.type==1 表示修改状态
    if (options.type == 1) {
      this.pageType = '修改'
      this.houseType = JSON.parse(options.houseType)
    }
    uni.hideLoading()
    uni.setNavigationBarTitle({
      title: this.pageInfo.title[0]
    })
    //options.type==0  表示添加状态
    if (options.type == 0) {
      this.pageType = '添加'
    }
  },
  onShow () {
    if (this.pageType == '添加') {
      this.setPageInfo({ type: '二手房源', title: ['二手房源', '二手房源'], processList: [{ text: '房屋概况', status: true }, { text: '设置售价', status: false }, { text: '完成', status: false }], len: [0, 50] })
    } else {
      if (this.pageType == '修改') {
        this.setPageInfo({ type: '二手房源', title: ['修改二手房源', '修改二手房源'], processList: [{ text: '房屋概况', status: true }, { text: '设置售价', status: false }, { text: '完成', status: false }], len: [0, 50] })
      }
    }
  },
  created () {

  },
  mounted () {

  },
  methods: {
    ...mapMutations(['setupTempImageList', 'setHouseNumber', 'setHouseNumber1', 'setDeliveryList', 'setshowImageList']),
    ...contractMutation(['setStep1', 'setStep2', 'setPageInfo']),

    /**
     * 选项单击事件
     */
    //失焦事件
    getBlur () {
      if (this.list[2].val !== '请输入') {
        if (Number(this.list[2].val).toFixed(2) === 'NaN') {
          uni.showToast({ title: `${this.list[2].text}格式错误`, icon: 'none' })
        } else {
          this.list[2].val = Number(this.list[2].val).toFixed(2)
        }
      }

    },
    clickItem (item) {
      switch (item.text) {
        case '城市':

          break;
        case '楼栋门牌':
          if (this.pageType == '修改') {
            uni.navigateTo({
              url: '/pages/houseNumber/houseNumber?type=1',
            })
          } else {
            uni.navigateTo({
              url: '/pages/houseNumber/houseNumber?type=0',
            })
          }
          break;
        case '小区名称':
          if (this.houseType.id == '') {
            this.$store.state.selectCallback = (selected) => {
              if (selected && typeof selected === 'object') {
                this.list[1].val = selected.name
                this.list[1].xiaoId = selected.id
                this.$store.state.selectedHousing = selected
                delete this.$store.state.selectCallback;
                uni.navigateBack({
                  delta: -1
                })
              } else {
                uni.showToast({
                  title: '选择了无效的选项',
                  icon: 'none'
                })
                console.warn('selected is not a Object', selected)
              }
            }
            uni.navigateTo({
              url: '/pages/village/village?type=小区',
            })
          }
          break;
        case '面积':
          this.inputFocus = true
          break;

      }
    },
    /**
     * 下拉列表选择事件
     */
    bindDateChange (res, item) {
      let index = this.list.indexOf(item);
      let val = res.detail.value;
      if (Array.isArray(val)) {
        this.list[index].val = this.list[index].selectList[0][val[0]] + '-' + this.list[index].selectList[1][val[1]] + '-' + this.list[index].selectList[2][val[2]]
      } else {
        this.list[index].val = this.list[index].selectList[val]
      }
      if (index == 7) {
        if (this.list[7].val === '公开') {
          this.isText = '此房源全市场可见，更多浏览，更快获客成交。'
        } else {
          this.isText = '此房源仅自己可见'
        }
      }
    },
    //表单校验
    chechForm () {
      let isCheck = true;
      if (this.list[2].val == '') {
        uni.showToast({
          title: `请输入面积`,
          icon: 'none'
        })
        isCheck = false;
        return isCheck
      } else {
        if (Number(this.list[2].val).toFixed(2) === 'NaN') {
          uni.showToast({ title: `${this.list[2].text}格式错误`, icon: 'none' })
          isCheck = false;
          return isCheck
        } else {
          let index = this.list[2].val.indexOf('.')
          if (index != -1 && index > 4) {
            uni.showToast({
              title: `面积超出范围`,
              icon: 'none'
            })
            isCheck = false;
            return isCheck
          } else if ((index == -1 && this.list[2].val.length > 4)) {
            uni.showToast({
              title: `面积超出范围`,
              icon: 'none'
            })
            isCheck = false;
            return isCheck
          }
        }

      }
      // this.list[0].val = ''
      for (let i = 0; i < this.list.length; i++) {
        if (this.list[i].val == '请选择') {
          uni.showToast({
            title: `请选择${this.list[i].text}`,
            icon: 'none'
          })
          isCheck = false;
          break;
        }
      }

      return isCheck
    },
    //气泡框
    openTip () {
      this.isFlag = !this.isFlag
      if (this.isFlag) {
        this.$refs.tip[0].open()
      } else {
        this.$refs.tip[0].close()
      }
    },
    closeTip () {
      this.isFlag = false
      this.$refs.tip[0].close()
    },
    /**
     * 下一步
     */
    nextBtn () {
      let res = this.chechForm();
      if (res == true) {
        if (this.pageType == '添加') {
          this.setPageInfo({ type: '二手房源', title: ['二手房源', '二手房源'], processList: [{ text: '房屋概况', status: true }, { text: '设置售价', status: true }, { text: '完成', status: false }], len: [0, 50] })
        } else {
          if (this.pageType == '修改') {
            this.setPageInfo({ type: '二手房源', title: ['修改二手房源', '修改二手房源'], processList: [{ text: '房屋概况', status: true }, { text: '设置售价', status: true }, { text: '完成', status: false }], len: [0, 50] })
          }
        }
        //更新数据
        let temp = this.step1
        this.list.forEach((ele, index) => {
          if (index != 1) {
            temp[index] = ele.val
          } else {
            temp[1] = ele
          }
        })
        temp[0] = this.locationInfo.name
        this.setStep1(temp)
        this.$$globalData.jumpPath = '/pages/addHouseSource/stephouse1'
        if (this.pageType == '修改') {
          let obj = {}
          obj = this.houseType
          uni.navigateTo({
            url: `/pages/addHouseSource/stephouse2?type=1&houseId=` + JSON.stringify(obj)
          })
        } else if (this.pageType == '添加') {
          uni.navigateTo({
            url: `/pages/addHouseSource/stephouse2?type=0`
          })
        }
      }
    },
    //页面注销清除本地数据
    getClear () {
      let step1 = ['', { name: '请选择' }, '', '请选择', '请选择', '请选择', '请选择', '仅自己可见']
      let step2 = ['', '', '请选择', '请选择', '请选择', [], []]
      let houseNumber = {
        bound: '',
        unit: '',
        floor: '请选择',
        room: ''
      }
      this.setupTempImageList([[], [], [], [0]])
      this.setshowImageList([[], [], [], [0]])
      this.setHouseNumber(houseNumber)
      this.setHouseNumber1(houseNumber)
      this.setDeliveryList([[], [], [], []])
      this.setStep1(step1)
      this.setStep2(step2)
    }
  },
  onUnload () {
    this.getClear()
  }
}
</script>

<style lang='scss' scoped>
.addHouseSource {
  .addHouseProcess {
    padding: 70rpx 0rpx 70rpx 0rpx;
    .addProcess {
      margin: 0 auto;
      width: 400rpx;
    }
    .processPoint {
      width: 420rpx;
      display: flex;
      justify-content: space-between;
      margin: 0 auto;
      view {
        width: 20rpx;
        height: 20rpx;
        border-radius: 15rpx;
        background-color: #cccccc;
        transform: translateY(-65%);
      }
    }
    .processText {
      width: 600rpx;
      display: flex;
      justify-content: space-between;
      margin: 0 auto;
      view {
        width: 200rpx;
        color: #8e8e8e;
        text-align: center;
        // font-size: 24rpx;
      }
    }
  }
  .selectBox {
    width: 750rpx;
    // padding:0rpx 20rpx 0rpx 23rpx;
    .way {
      display: flex;
      background-color: white;
      padding: 40rpx;
      border-radius: 10rpx;
      view:nth-child(1) {
        width: 230rpx;
      }
      view:nth-child(2) {
        font-size: 30rpx;
      }
    }
    .itemBox {
      margin-top: 20rpx;
      border-radius: 10rpx;
      background-color: white;
      position: relative;
      .tipStyle {
        position: absolute;
        left: 30rpx;
        bottom: 29rpx;
      }
      .selectItem {
        margin: 0rpx 40rpx 0rpx 50rpx;
        display: flex;
        height: 100rpx;
        align-items: center;
        // border-bottom: solid 3rpx #ececec;
        font-size: 30rpx;
        .itemLeft {
          width: 230rpx;
        }
        .itemCenter,
        .itemInput {
          flex-grow: 1;
          color: #cfcfcf;
        }
        .itemInput {
          color: black;
          width: 100rpx !important;
        }
        // .itemRight{

        // }
        &:active {
          background: #fafafa;
        }
      }
      .bottom {
        width: 750rpx;
        height: 40rpx;
        background: #f1f1f1;
      }
      .selectItem:last-child {
        border-bottom: none;
      }
    }
    .itemBoxTitle {
      font-size: 20rpx;
      color: white;
    }
  }
  .nextBtn {
    width: 680rpx;
    height: 100rpx;
    background-color: #00a680;
    color: white;
    line-height: 100rpx;
    text-align: center;
    margin: 30rpx auto;
    border-radius: 10rpx;
    font-size: 34rpx;
    &:active {
      background: #007e5e;
    }
  }
  // .line{
  //     width: 750rpx;
  //     height: 20rpx;
  //     background: #cccccc;
  // }
}
</style>