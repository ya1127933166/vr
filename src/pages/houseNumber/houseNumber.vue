<template>
  <view class='houseNumber'>
    <view class='building'>
      <view class='buildingLeft'>
        <view class='leftText'>{{bound}}</view>
        <view class="cuIcon-unfold"></view>
        <picker style="position: absolute;transform: translateX(50%)"
                mode="selector"
                :range="buidlList"
                @change="bindPickeChange($event,'楼栋')">
          <view class="picker"
                style="transform: translateX(-50%);opacity: 0;width:140rpx;height:100rpx;background-color: yellowgreen;">
            选择
          </view>
        </picker>
      </view>
      <input type="text"
             class="input"
             v-model="boundText"
             placeholder-style="color: #dbd8d8"
             placeholder="请输入" />
    </view>
    <view id="cell">
      <view class="line"></view>
    </view>
    <view class='unit'>
      <view class='unitLeft'>
        <view class='leftText'>{{unit}}</view>
        <view class="cuIcon-unfold"></view>
        <picker style="position: absolute;transform: translateX(50%)"
                mode="selector"
                :range="unitList"
                @change="bindPickeChange($event,'单元')">
          <view class="picker"
                style="transform: translateX(-50%);opacity: 0;width:140rpx;height:100rpx;background-color: yellowgreen;">
            选择
          </view>
        </picker>
      </view>
      <input type="text"
             class="input"
             v-model="unitText"
             placeholder-style="color: #dbd8d8"
             placeholder="请输入" />
    </view>
    <view id="cell">
      <view class="line"></view>
    </view>
    <view class='floor'>
      <view class='floorLeft'>
        <view class='leftText'>楼层</view>
      </view>
      <picker class="center"
              mode="multiSelector"
              :range="floorList"
              :value='floorValue'
              @change="bindPickeChange($event,'楼层')">
        <view :style="'color:'+(floor=='请选择'?'#cccccc':'#333333')+';'">{{floor}}</view>
      </picker>
      <view class="cuIcon-right"></view>
    </view>
    <view id="cell">
      <view class="line"></view>
    </view>
    <view class='room'>
      <view class='roomLeft'>室</view>
      <input class="input"
             type="number"
             v-model="roomText"
             placeholder-style="color: #dbd8d8"
             placeholder="请输入" />
    </view>
    <view id="cell">
      <view class="line"></view>
    </view>

    <view @tap="saveBtn"
          :style="'background-color:'+(isChange?'#00a680':'#cccccc')+';'"
          class='saveBtn'>保存</view>
  </view>
</template>

<script>
import { mapMutations } from 'vuex';
export default {
  name: 'houseNumber',
  data () {
    return {
      buidlList: ['栋', '弄', '座', '号', '号楼', '胡同'],
      unitList: ['单元', '幢', '栋', '号', '号楼'],
      floorList: [],
      bound: '楼栋',
      unit: '单元',
      boundText: '',
      unitText: '',
      roomText: '',
      floor: '请选择',
      floorValue: []
    }
  },
  onLoad (options) {
    //type 为1  表示修改 获取存储数据
    // if(this.$store.state.houseNumber1){
    let arr = this.$store.state.houseNumber1.floor.split('-')
    this.floorValue = [arr[0] - 1, arr[1] - 1]
    const { bound, unit, floor, room } = this.$store.state.houseNumber1
    this.boundText = bound
    this.unitText = unit
    this.roomText = room
    this.floor = floor
    // }
    //初始化楼层数组
    this.floorList = []
    let temp1 = [];
    let temp2 = [];
    for (let i = 1; i < 53; i++) {
      temp1.push(`${i}层`)
      temp2.push(`共${i}层`)
    }
    this.floorList[0] = temp1;
    this.floorList[1] = temp2;
  },
  computed: {
    isChange () {
      let { bound, unit, boundText, unitText, roomText, floor } = this;
      if (bound == '楼栋' && unit == '单元' && boundText == '' && unitText == '' && roomText == '' && floor == '请选择') {
        return false
      } else {
        return true
      }
    }
  },
  methods: {
    ...mapMutations(['setHouseNumber', 'setHouseNumber1']),
    //下拉菜单选择事件
    bindPickeChange (e, text) {
      let index = e.detail.value;
      switch (text) {
        case '楼栋':
          this.bound = this.buidlList[index]
          break;
        case '单元':
          this.unit = this.unitList[index]
          break;
        case '楼层':
          let temp1 = this.floorList[0][index[0]].replace(/[^0-9]/ig, "");
          let temp2 = this.floorList[1][index[1]].replace(/[^0-9]/ig, "");
          let flag = Number(temp1) > Number(temp2)
          if (flag) {
            uni.showToast({
              title: '楼层大于总层数，请重新选择',
              icon: 'none'
            })
          } else {
            this.floor = this.floorList[0][index[0]] + '-' + this.floorList[1][index[1]]
          }
          break;
        default:
          break;
      }
    },
    //表单校验
    checkForm () {
      const that = this;
      let obj = that.$checkForm(that, {
        bound: {
          alias: '选择楼栋',
          type: 'string',
          required: true,
          callback (value) {
            if (value == '楼栋') {
              value = '栋'
            }
            return value == '楼栋' ? false : true
          }
        },
        boundText: {
          alias: '输入楼栋',
          type: 'string',
          required: true
        },
        unitText: {
          alias: '输入单元',
          type: 'string',
          required: true
        },
        floor: {
          alias: '选择楼层',
          type: 'string',
          required: true,
          callback (value) {
            return value == '请选择' ? false : true
          }
        },
        roomText: {
          alias: '输入房间号',
          type: 'string',
          required: true,
        }
      })
      let len = Object.keys(obj).length;
      if (len < 1) {
        return true
      } else {
        uni.showToast({
          title: `请${obj.alias}`,
          icon: 'none'
        })
        return false
      }
    },
    saveBtn () {
      let res = this.checkForm();
      if (res == true) {
        let { bound, boundText, unit, unitText, roomText, floor } = this;
        let temp = {}
        temp.bound = boundText
        temp.unit = unitText
        temp.floor = floor
        temp.room = roomText
        this.setHouseNumber1(temp)
        let obj = {};
        if (bound == '楼栋') {
          obj.bound = boundText + '栋'
        } else {
          obj.bound = boundText + bound;
        }

        obj.unit = unitText + unit;
        obj.floor = floor;
        obj.room = roomText;

        this.setHouseNumber(obj)
        uni.navigateBack({
          delta: -1
        })
      }
    }
  },
  onUnload () {

  }
}
</script>

<style lang='scss' scoped>
page {
  background-color: #f1f1f1;
}
.houseNumber {
  margin-top: 40rpx;
  background-color: white;
  box-sizing: border-box;
  .building,
  .unit {
    display: flex;
    padding: 0rpx 30rpx 0rpx 30rpx;
    align-items: center;
    height: 100rpx;
    align-items: center;
    .buildingLeft,
    .unitLeft {
      display: flex;
      align-items: center;
      width: 260rpx;
      .leftText {
        padding-right: 20rpx;
        font-size: 28rpx;
      }
    }
  }
  .floor {
    width: 100%;
    padding: 0rpx 30rpx 0rpx 30rpx;
    height: 100rpx;
    display: flex;
    align-items: center;
    justify-content: space-between;
    position: relative;
    .floorLeft {
      width: 260rpx;
    }
    .center {
      position: absolute;
      left: 0;
      top: 0;
      width: 100%;
      height: 100rpx;
      line-height: 100rpx;
      text-indent: 290rpx;
    }
  }
  .room {
    display: flex;
    padding: 0rpx 30rpx 0rpx 30rpx;
    height: 100rpx;
    align-items: center;
    .roomLeft {
      width: 260rpx;
    }
  }
  .saveBtn {
    width: 690rpx;
    height: 100rpx;
    color: white;
    font-size: 34rpx;
    text-align: center;
    background-color: #00a680;
    margin: 60rpx auto;
    line-height: 100rpx;
    border-radius: 10rpx;
    &:active {
      background-color: #5ba191 !important;
    }
  }
  .input {
    // background-color: aqua;
    width: 100%;
    height: 100rpx;
    padding-left: 80rpx;
  }
}
</style>
