<template>
  <view class="">
    <view class="">
      <view class='itemBox'>
        <block v-for="(item,index) in list"
               :key="item.text">
          <view @tap="clickItem(item.text)"
                class='selectItem'
                style="position: relative;">
            <view class='itemLeft'>{{item.text}}</view>
            <view class='itemCenter'
                  v-if="item.text!=='月租金'&&item.text!=='房间面积'"
                  :style="'color:'+(item.val==='请选择'||item.val==='请上传'?'':'black')+';'">{{item.val}}</view>
            <input @tap='test'
                   class="itemInput"
                   maxlength="20"
                   type="digit"
                   v-model="item.val"
                   v-if="item.text=='月租金'||item.text=='房间面积'"
                   @blur="getBlur(index)"
                   style="height:100rpx"
                   placeholder-style="color:#cccccc"
                   placeholder="请输入">
            <picker :disabled="item.text=='月租金'||item.text=='房间面积'"
                    v-if="!item.isInput"
                    :style="'position: absolute;transform: translateX(50%);'"
                    :mode="item.mode"
                    fields="month"
                    :value="item.val"
                    :range="item.selectList"
                    @change="bindPriceChange($event,item)">
              <view class="picker"
                    style="transform: translateX(-50%);opacity: 0;width:450rpx;height:100rpx">
                选择
              </view>
            </picker>
            <view v-if="item.text=='月租金'">元</view>
            <view v-else-if="item.text=='房间面积'">㎡</view>
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
    <view class='itemBox'
          style="margin-top:25rpx">
      <view @tap="clickItem('独立卫生间')"
            class='selectItem'
            style="position: relative;">
        <view class='itemLeft'>{{wc.text}}</view>
        <view class='itemCenter'
              :style="'color:'+(wc.val==='请选择'?'':'black')+';'">{{wc.val}}</view>
        <picker :style="'position: absolute;transform: translateX(50%);'"
                :mode="wc.mode"
                fields="month"
                :value="wc.val"
                :range="wc.selectList"
                @change="bindPriceChange($event,wc)">
          <view class="picker"
                style="transform: translateX(-50%);opacity: 0;width:450rpx;height:100rpx">
            选择
          </view>
        </picker>
        <view class="cuIcon-right"></view>
      </view>
    </view>
    <view class='itemBox'
          style="margin-top:25rpx">
      <view v-for="(item,index) in setList"
            :key='index'
            @tap="clickItem(item.text)"
            class='selectItem'
            style="border-bottom:solid calc(1px / 2.5) #d9d9d9">
        <view class='itemLeft'>{{item.text}}</view>
        <view class='itemCenter'
              style="width:200rpx"
              :style="'color:'+(item.val==='请选择'?'':'black')+';'">{{item.val}}</view>
        <!-- <input maxlength="50" type="number" v-model="item.val" v-if="item.text=='房间编号/别名'" placeholder-style="color:#cccccc" placeholder="可选" style="margin-right: 60rpx;"> -->
        <view class="cuIcon-right"></view>
      </view>
    </view>
    <view @tap="submit"
          :style="'background-color:'+(!isChange?'#00a680':'#cccccc')+';'"
          class='nextBtn'>保存</view>

    <Modal1 :type='type'
            :isShow="isShowAddSource"
            :propertyArr='propertyArr'
            @clickCallBack="clickAddHouseCallBack"
            @clickMaskCallBack="clickAddhouseMask"></Modal1>
    <Modal2 :isShow="isShowAddSource1"
            :normal="addSourceList"
            @clickCallBack="clickAddHouseCallBack1"
            @clickMaskCallBack="clickAddhouseMask1"></Modal2>
    <houseAlias :totalList='totalList'
                :isShow="isShowAddSource2"
                @clickAliasBack="AliasBack"
                @clickAliasCallBack="clickAliasBack"
                @clickAlias='clickAliasItem'></houseAlias>
  </view>

</template>

<script>
import Modal1 from './modal.vue';
import houseAlias from './houseAlias.vue'
import Modal2 from '@/components/comm/modal1/modal1.vue';
import { mapState, mapMutations, createNamespacedHelpers } from 'vuex';
const { mapState: contractState, mapMutations: contractMutation } = createNamespacedHelpers('contract')
export default {
  name: 'shareList',
  components: {
    Modal1,
    Modal2,
    houseAlias,
  },
  data () {
    return {
      type: false,
      list: [
        { text: '待出租房间', isInput: false, val: '请选择' },
        { text: '房间面积', isInput: true, val: '' },
        { text: '月租金', isInput: true, val: '' },
        { text: '付款方式', isInput: false, val: '请选择', mode: 'multiSelector', selectList: [['押1', '押2', '押3', '押4', "押5", '押6'], ['付1', '付2', '付3', '付4', '付5', '付6', '付12']] },
        { text: '房间照片', isInput: false, val: '请上传', pice: [] },
      ],
      isShowAddSource: false,
      isShowAddSource1: false,
      isShowAddSource2: false,
      addSourceList: [
        { text: '主卧' },
        { text: '次卧' },
        { text: '公区' },
      ],
      wc: { text: '独立卫生间', val: '请选择', mode: 'selector', selectList: ['带', '不带'] },
      setList: [{ text: '更多设置', val: '请选择' }, { text: '房间编号/别名', val: '请选择' }],
      setList1: [],
      propertyArr: [],
      hosueNum: 0,
      houseTy: '',
      houseStatus: '' //上次选择的房间号
    }
  },
  computed: {
    ...mapState(['upTempImageList',]),
    ...contractState({
      addhouseList: state => state.addhouseList,
      totalList: state => state.totalList,
      showImage: state => state.showImage,
      addHouse: state => state.addHouse
    })
  },
  onLoad (options) {
    this.houseTy = options.type
    //houseTy 1表示修改 0添加
    if (this.houseTy == 1) {
      //houseNum 表示修改房间列表下标值
      this.hosueNum = options.index
      let temp = this.addHouse
      for (let i = 0; i <= temp.length; i++) {
        if (i <= 4) {
          this.list[i].val = temp[i].val
          if (i == 4) {
            this.list[i].pice = temp[i].pice
            let arr = this.upTempImageList
            arr[1] = temp[i].show
            // this.setupTempImageList(arr)
          }
        } else {
          switch (i) {
            case 5:
              this.wc.val = temp[5].val
              break;
            case 6:
              let string = ''
              temp[6].forEach(ele => {
                ele.forEach(v => {
                  string = v.type + '-' + string
                })
              })

              this.setList[0].val = string
              this.setList1 = temp[6]
              break;
            case 7:
              this.houseStatus = temp[7]
              this.setList[1].val = temp[7]
              break
          }
        }
      }
    }
  },
  onShow () {
  },
  created () {
    if (this.addHouse[6]) {
      this.addHouse[6].forEach((ele, index) => {
        this.propertyArr[this.addHouse[6].length - 1 - index] = ele.map(v => {
          return v.type
        })
      })
    }
    uni.$on('upPice', res => {
      this.list[4].val = this.showImage.val
      this.list[4].pice = this.showImage.pice
      this.list[4].show = this.showImage.show
    })
  },

  methods: {
    test () {
    },
    ...mapMutations(['setupTempImageList', 'setshowImageList']),
    ...contractMutation(['setAdd', 'setAddHouse', 'setTotalList', 'setImage']),
    //失焦失焦
    getBlur (index) {
      if (Number(this.list[index].val).toFixed(2) === 'NaN') {
        uni.showToast({ title: `${this.list[index].text}格式错误`, icon: 'none' })
      } else {
        this.list[index].val = Number(this.list[index].val).toFixed(2)
      }
    },
    clickItem (item) {
      switch (item) {
        case "待出租房间":
          this.isShowAddSource1 = true
          break;
        case "房间编号/别名":
          this.isShowAddSource2 = true
          break;
        case '更多设置':
          this.isShowAddSource = true
          break
        case '房间照片':
          uni.navigateTo({
            url: '/pages/upload/upload?type=房源照片&numType=2&num=5', /*numType 1整租 2合租*/
          })
          break;
      }
    },
    isChecked () {
      let isCheck = true;
      let temp1 = JSON.parse(JSON.stringify(this.list))
      temp1.push(this.wc)
      temp1.push(...this.setList)
      temp1 = temp1.reverse()

      temp1.forEach((v, i) => {
        if (v.val == '请选择' || v.val == '' || v.val == '请上传') {
          uni.showToast({
            title: `请选择${temp1[i].text}`,
            icon: 'error'
          })
          isCheck = false
          return isCheck
        }
        if (i == 5) {
          if (Number(v.val).toFixed(2) === 'NaN') {
            uni.showToast({ title: `${v.text}格式错误`, icon: 'none' })
            isCheck = false
            return isCheck
          } else {
            let str = v.val.split('.')[0]
            if (str.length > 6) {
              uni.showToast({
                title: `超出价格范围`,
                icon: 'none'
              })
              isCheck = false
              return isCheck
            }
          }
        }
        if (i == 6) {
          if (Number(v.val).toFixed(2) === 'NaN') {
            uni.showToast({ title: `${v.text}格式错误`, icon: 'none' })
            isCheck = false
            return isCheck
          } else {
            let str = v.val.split('.')[0]
            if (str.length > 4) {
              uni.showToast({
                title: `超出面积范围`,
                icon: 'none'
              })
              isCheck = false
              return isCheck
            }
          }
        }
      })
      return isCheck
    },
    //房间别名
    AliasBack () {
      this.isShowAddSource2 = false
    },
    clickAliasItem (item) {
      this.totalList.forEach((v, i) => {
        v.status = false
        if (v.type == item.type) {
          this.totalList[i].status = item.status
        }
      })
    },
    clickAliasBack (item) {
      this.isShowAddSource2 = false
      this.setList[1].val = item.type
    },
    //出租房间选择
    clickAddhouseMask1 () {
      this.isShowAddSource1 = false
    },
    clickAddHouseCallBack1 (item) {
      uni.hideLoading()
      this.isShowAddSource1 = false,
        this.list[0].val = item.currentTarget.dataset.item.text
    },
    clickAddHouseCallBack (item) {
      this.isShowAddSource = false
      this.setList1 = item
      if (this.setList1.length > 0) {
        this.setList1.forEach((ele, index) => {
          this.propertyArr[this.setList1.length - 1 - index] = ele.map(v => {
            return v.type
          })
        })
      }
      if (item.length > 0) {
        let str = ''
        item.forEach(v => {
          v.forEach(ele => {
            str = ele.type + '-' + str
          })
        })
        let str1 = str.substring(0, str.length - 1)
        this.setList[0].val = str1
      }
    },
    clickAddhouseMask () {
      this.isShowAddSource = false

    },

    /**
     * 租金选择器
     */
    bindPriceChange (e, item) {

      if (item.text != '独立卫生间') {
        let index = this.list.indexOf(item);
        let val = e.detail.value;
        if (Array.isArray(val)) {
          this.list[index].val = this.list[index].selectList[0][val[0]] + '-' + this.list[index].selectList[1][val[1]]
        } else {
          this.list[index].val = this.list[index].selectList[val]
        }
      } else {
        let val = e.detail.value;
        this.wc.val = this.wc.selectList[val]
      }
    },
    //放入数据
    adData () {
      let temp = this.addHouse
      this.list.forEach((ele, index) => {
        temp[index] = ele
      })
      temp[5] = this.wc
      this.setList.forEach((ele, index) => {
        temp[index + 6] = ele.val
      })
      temp[6] = this.setList1
      return temp
    },
    submit () {
      let res = this.isChecked()
      if (res) {
        let item = this.adData()
        //清空照片
        item = JSON.parse(JSON.stringify(item))
        this.setImage({ show: [], pice: [] })
        let temp = []
        if (this.houseTy == 0) {
          //房间添加	
          temp[0] = item
          temp = temp.concat(this.addhouseList)
        } else {
          //房间修改
          let a = this.addhouseList[this.hosueNum][7]
          this.totalList.forEach(ele => {
            if (a == ele.type) {
              ele.num = 1
              ele.status = false
            }
          })
          //更新房间号状态
          this.setTotalList(this.totalList)
          this.addhouseList[this.hosueNum] = item
          temp = this.addhouseList
        }
        //房间信息存储
        // this.totalList = [{type:"A间",status:false,num:1},{type:"B间",status:false,num:1},{type:"C间",status:false,num:1},{type:"D间",status:false,num:1},{type:"E间",status:false,num:1},{type:"F间",status:false,num:1}]
        this.setAddHouse(temp)
        this.addhouseList.forEach(v => {
          this.totalList.forEach(ele => {
            if (v[7] == ele.type) {
              ele.num = 0
              ele.status = false
            }
            if (this.houseStatus && this.houseStatus == ele.type) {
              ele.num = 1
              ele.status = false
            }
          })
        })
        //更新房间号状态
        this.setTotalList(this.totalList)
        uni.navigateBack({
          delta: -1
        })
      }
    }
  },
  onUnload () {
    this.$off('upPice')
  }
}
</script>

<style  lang='scss' scoped>
.itemBox {
  margin-top: 20rpx;
  border-radius: 10rpx;
  background-color: white;
  .selectItem {
    margin: 0rpx 40rpx 0rpx 40rpx;
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
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
    }
    .itemInput {
      color: black;
      width: 100rpx !important;
    }

    &:active {
      background: #fafafa;
    }
  }
  .selectItem:last-child {
    // border-bottom: none;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
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
/*    .itemBoxTitle{
	        font-size: 20rpx;
	        color: white;
	    }
	} */
</style>
