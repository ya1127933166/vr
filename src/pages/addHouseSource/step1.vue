<template>
  <view class='addHouseSource'>
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
      <view class='way'
            v-if="pageInfo.type=='添加房源'">
        <view>出租方式</view>
        <view style="color:#333333;">{{pageInfo.title[0].substring(0,2)}}</view>
      </view>
      <view class='way'
            v-if="pageInfo.type=='修改房源'">
        <view>出租方式</view>
        <view style="color:#333333;">{{pageInfo.title[0].substring(2,4)}}</view>
      </view>
      <view class='itemBox'>
        <block v-for="(item,index) in list"
               :key="item.text">
          <view @tap="clickItem(item)"
                hover-class="active_box"
                class='selectItem'
                style="position: relative;">
            <view class='itemLeft'>{{item.text}}</view>

            <view class='itemCenter'
                  v-if="item.text!=='面积'&&item.text!=='城市'"
                  :style="'color:'+(item.val==='请选择'?'':'black')+';'">{{item.val}}</view>
            <input class="itemInput"
                   maxlength="20"
                   type="digit"
                   v-model="item.val"
                   @blur="getBlur"
                   v-if="item.text=='面积'"
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
                    style="transform: translateX(-50%);opacity: 0;width:450rpx;height:100rpx">
                选择
              </view>
            </picker>
            <view v-if="item.text=='面积'"
                  style='width:60rpx;'>平米</view>
            <view v-else-if='item.text=="城市"'>{{locationInfo.name}}</view>
            <view v-else-if='item.text=="小区名称"&&houseId.id !=""'></view>
            <view v-else
                  class='cuIcon-right'></view>

          </view>
          <view v-if="index!=list.length-1"
                id="cell">
            <view class="line"></view>
          </view>
        </block>
      </view>
    </view>
    <view @tap="nextBtn"
          hover-class="active_btn"
          :style="'background-color:'+(!isChange?'#00a680':'#cccccc')+';'"
          class='nextBtn'>下一步</view>
  </view>
</template>

<script>
import { mapState, mapMutations, createNamespacedHelpers } from 'vuex';
const { mapState: contractState, mapMutations: contractMutation } = createNamespacedHelpers('contract')
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
        { text: '装修标准', isInput: false, val: '请选择', mode: 'selector', selectList: ['毛坯', '简单装修', '精装修', '豪华装修'] },
        { text: '楼栋门牌', isInput: false, val: '请选择' }
      ],
      currentInfo: {},
      options: {},
      inputFocus: false,
      houseId: { id: '' },
      pageType: '添加',
    }
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
      stepHouse1: function (state) {
        let temp = (Array.from(state.stepHouse1))
        temp.splice(0, 1)
        this.list.forEach((ele, index) => {
          if (index != 1) {
            ele.val = temp[index]
          } else {
            ele.val = temp[1].name
            ele.xiaoId = temp[1].id
          }
        })
        return state.stepHouse1
      }
    }),
    //是否改变过表单
    isChange () {
      return this.list.every(ele => ele.val == '请选择' || ele.val == '')
    }
  },
  onLoad (options) {
    //回显数据跳转
    //options.type==1  表示添加状态
    uni.setNavigationBarTitle({
      title: this.pageInfo.title[0]
    })
    if (options.type == 1) {
      this.pageType = '修改'
      this.houseId = JSON.parse(options.houseType)
    }
    //options.type==0  表示添加状态 
    if (options.type == 0) {
      this.pageType = '添加'
    }
  },
  onShow () {
    let title = this.pageInfo.title[0]
    if (this.pageType == '添加') {
      this.setPageInfo({ type: '添加房源', title: [`${title}`, `${title}`], processList: [{ text: '房屋概况', status: true }, { text: '设置', status: false }, { text: '完成', status: false }], len: [0, 50] })
    } else if (this.pageType == '修改') {
      this.setPageInfo({ type: '修改房源', title: [`${title}`, `${title}`], processList: [{ text: '房屋概况', status: true }, { text: '设置', status: false }, { text: '完成', status: false }], len: [0, 50] })
    }

  },
  mounted () {

  },
  methods: {
    ...mapMutations(['setupTempImageList', 'setHouseNumber', 'setHouseNumber1', 'setshowImageList', 'setDeliveryList']),
    checkKeydown (e, value) {
      this.checkValue = value;
    },
    ...contractMutation(['setPageInfo', 'setStepHouse1', 'setStepHouse2', 'setAddHouse', 'setTotalList']),
    //失焦事件
    getBlur () {
      if (Number(this.list[2].val).toFixed(2) === 'NaN') {
        uni.showToast({ title: `${this.list[2].text}格式错误`, icon: 'none' })
        // this.list[2].val = ''
      } else {
        this.list[2].val = Number(this.list[2].val).toFixed(2)
      }
    },
    /**
     * 选项单击事件
     */
    clickItem (item) {
      switch (item.text) {
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
          if (this.houseId.id == '') {
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
    },
    /**
     * 设置选择城市和门牌号
     */
    // setHouseAndCity(){
    //     if(this.listCity!=''){
    //         this.list[0].val = this.listCity.name;
    //     }
    //     if(this.houseNumber!='---'){
    //         this.list[6].val = this.houseNumber;
    //     }
    // },
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
      this.list[0].val = ''
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
    /**
     * 下一步
     */
    nextBtn () {
      let res = this.chechForm();

      if (res == true) {
        let title = this.pageInfo.title[0]
        if (this.pageType == '添加') {
          this.setPageInfo({ type: '添加房源', title: [`${title}`, `${title}`], processList: [{ text: '房屋概况', status: true }, { text: '设置', status: false }, { text: '完成', status: false }], len: [0, 50] })
        } else if (this.pageType == '修改') {
          this.setPageInfo({ type: '修改房源', title: [`${title}`, `${title}`], processList: [{ text: '房屋概况', status: true }, { text: '设置', status: false }, { text: '完成', status: false }], len: [0, 50] })
        }
        //更新数据
        let temp = this.stepHouse1
        this.list.forEach((ele, index) => {
          if (index != 1) {
            temp[index + 1] = ele.val
          } else {
            temp[2] = ele
          }
        })
        temp[1] = this.locationInfo.name
        this.setStepHouse1(temp)
        if (title == '整租房源' || title == '修改整租房源') {
          this.$$globalData.jumpPath = '/pages/addHouseSource/step1'
          if (this.pageType == '修改') {
            uni.navigateTo({
              url: `/pages/addHouseSource/step2?type=1&houseId=` + JSON.stringify(this.houseId)
            })
          } else if (this.pageType == '添加') {
            uni.navigateTo({
              url: `/pages/addHouseSource/step2?type=0`
            })
          }

        } else {
          this.$$globalData.jumpPath = '/pages/addHouseSource/step1'
          if (this.pageType == '修改') {
            uni.navigateTo({
              url: `/pages/addHouseSource/shareStep1?type=1&houseId=` + JSON.stringify(this.houseId)
            })
          } else if (this.pageType == '添加') {
            uni.navigateTo({
              url: `/pages/addHouseSource/shareStep1?type=0`
            })
          }
        }

      }
    },
    //页面注销清除本地数据
    getClear () {
      let stephouse1 = ['', '', { name: '请选择' }, '', '请选择', '请选择', '请选择', '请选择']
      let stephouse2 = ['', '请选择', '请选择', '请选择', [], []]
      let houseNumber = {
        bound: '',
        unit: '',
        floor: '请选择',
        room: ''
      }
      let totalList = [
        { type: "A间", status: false, num: 1 }, { type: "B间", status: false, num: 1 }, { type: "C间", status: false, num: 1 }, { type: "D间", status: false, num: 1 }, { type: "E间", status: false, num: 1 }, { type: "F间", status: false, num: 1 }
      ]
      this.setupTempImageList([[], [], [], [0]])
      this.setshowImageList([[], [], [], [0]])
      this.setHouseNumber(houseNumber)
      this.setHouseNumber1(houseNumber)
      this.setDeliveryList([[], [], [], []])
      this.setTotalList(totalList)
      this.setStepHouse1(stephouse1)
      this.setStepHouse2(stephouse2)
      this.setAddHouse([])
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
      .selectItem {
        padding: 0rpx 40rpx 0rpx 40rpx;
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
          /* 	margin-left: 74rpx; */
          width: 100rpx !important;
        }
        /*  // .itemRight{
                    
                // } */
        &:active {
          background: #fafafa;
        }
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
  }
}
</style>