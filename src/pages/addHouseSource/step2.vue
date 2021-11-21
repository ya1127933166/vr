<template>
  <!-- 租房添加修改 -->
  <view class='addHouseSource'>
    <view class='addHouseProcess'>
      <progress activeColor="#00a680"
                backgroundColor="#cccccc"
                class='addProcess'
                :percent="pageInfo.len[1]"
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
        <view id="cell">
          <view class="line"></view>
        </view>
        <block v-for="(item,index) in list"
               :key="item.text">
          <view @tap="optionClickHandel(item.text)"
                class='selectItem'
                style="position: relative;">
            <view class='itemLeft'>{{item.text}}</view>
            <view class='itemCenter'
                  v-if="!item.isInput"
                  :style="'color:'+(item.val==='请选择'?'':'black')+';'">{{item.val}}</view>
            <input v-model="item.val"
                   @blur="getBlur(index)"
                   :focus="inputFocus"
                   class='itemInput'
                   v-else
                   type="digit"
                   placeholder-style='color: #cfcfcf;'
                   placeholder="请输入" />
            <picker v-if="!item.isInput"
                    style="position: absolute;transform: translateX(50%)"
                    :mode="item.mode"
                    :range="item.selectList"
                    @change="bindPriceChange($event,item)">
              <view class="picker"
                    style="transform: translateX(-50%);opacity: 0;width:450rpx;height:100rpx">
                选择
              </view>
            </picker>
            <view v-if="item.text!='月租金'"
                  class="cuIcon-right"></view>
            <view v-else
                  class='itemRightText'>元</view>
          </view>
          <view v-if="index!=list.length-1"
                id="cell">
            <view class="line"></view>
          </view>
        </block>
      </view>

      <view class='itemBoxTitle'
            style="color:gray;font-size:26rpx;padding:15rpx 0rpx 0rpx 30rpx"></view>
      <view class='itemBox'
            style="padding-top:0rpx">
        <view @tap="optionClickHandel('更多设置')"
              class='selectItem'>
          <view class='itemLeft'>更多设置</view>
          <view class='itemCenter'
                :style="'color:'+(houseSourceSet==='请选择'?'':'black')+';width:100rpx'">{{houseSourceSet}}</view>
          <view class="cuIcon-right"></view>
        </view>
      </view>

      <view class='itemBoxTitle'
            style="color:gray;font-size:26rpx;padding:15rpx 0rpx 0rpx 30rpx"></view>
      <view class='itemBox'
            style="padding-top:0rpx">
        <view @tap="optionClickHandel('房源照片')"
              class='selectItem'>
          <view class='itemLeft'>房源照片</view>
          <view class='itemCenter'
                :style="'color:'+(houseSourcePhoto=='请上传'?'#cccccc':'#333333')">{{houseSourcePhoto}}</view>
          <view class="cuIcon-right"></view>
        </view>
        <view v-if="index!=list.length-1"
              id="cell">
          <view class="line"></view>
        </view>
        <view @tap="optionClickHandel('交割单')"
              class='selectItem'>
          <view class='itemLeft'>房源配置/交割单</view>
          <view class='itemCenter'
                :style="'color:'+(hosueDeValue!='可选'?'#000':'')">{{hosueDeValue}}</view>
          <view class="cuIcon-right"></view>
        </view>
      </view>

      <view class='itemBoxTitle'
            style="color:gray;font-size:26rpx;padding:15rpx 0rpx 0rpx 30rpx"></view>
      <view class='itemBox'
            style="padding-top:0rpx">
        <view class='selectItem'
              @tap="optionClickHandel('来源渠道')">
          <view class='itemLeft'>房源来源渠道</view>
          <view class='itemCenter'
                :style="'color:'+(houseSourceText==='请选择'?'':'black')+';'">{{houseSourceText}}</view>
          <view class="cuIcon-right"></view>
        </view>
      </view>
    </view>
    <view @tap="submit"
          :style="'background-color:'+(!isChange?'#00a680':'#cccccc')+';'"
          class='nextBtn'>{{pageInfo.type=='添加房源'?'提交':'下一步'}}</view>
    <view style="width:750rpx;height:100rpx"></view>
    <Modal1 :type='type'
            :isShow="isShowAddSource"
            :propertyArr='propertyArr'
            @clickCallBack="clickAddHouseCallBack"
            @clickMaskCallBack="clickAddhouseMask"></Modal1>
    <Modal2 :isShow="isShowAddSource1"
            :normal="addSourceList"
            @clickCallBack="clickAddHouseCallBack1"
            @clickMaskCallBack="clickAddhouseMask1"></Modal2>
  </view>

</template>

<script>
import Modal1 from './modal.vue';
import Modal2 from '@/components/comm/modal1/modal1.vue';
import { mapState, mapMutations, createNamespacedHelpers } from 'vuex';
const { mapState: contractState, mapMutations: contractMutation } = createNamespacedHelpers('contract');
// import moment from 'moment';
export default {
  name: 'addHomeSourceStep2',
  components: {
    Modal1,
    Modal2
  },
  data () {
    return {
      type: false,
      list: [
        { text: '月租金', isInput: true, val: '' },
        { text: '付款方式', isInput: false, mode: 'multiSelector', val: '请选择', selectList: [['押1', '押2', '押3', '押4', "押5", '押6'], ['付1', '付2', '付3', '付4', '付5', '付6', '付12']] },
      ],
      isabled: true,
      startText: '起始日期',
      endText: '截止日期',
      propertyArr: [],
      houseSourceSet: '请选择',
      houseSourceSet1: [],
      houseSourceList: ['自有产权', '自主获客', '中介', '终端商家', '公司推荐'],
      houseSourceText: '请选择',
      houseSourcePhoto: '请上传',
      houseDelivery: [],
      hosueDeValue: '可选',
      // delivery:[
      //     {text:'电器类',val:[]},
      //     {text:'家具类',val:[]},
      //     {text:'钥匙凭证',val:[]},
      //     {text:'生活费用信息',val:[]},
      // ],
      inputFocus: false,
      isShowAddSource: false,
      isShowAddSource1: false,
      addSourceList: [
        { text: '业主主动委托' },
        { text: '推荐/转介绍' },
        { text: '同行' },
        { text: '公司' },
        { text: '自主获取' }],
      houseContent: {
        house: {
          xiaoquId: '',
          name: '',
          rentalType: '1',
          orientation: '',
          buildingNum: '',
          unitNum: '',
          houseNum: '',
          floorNum: '',
          totalFloorNum: '',
          areaSize: '',
          livingRoomNum: '',
          roomNum: '',
          restroomNum: '',
          rebuildRoomNum: '',
          renovation: "",
          publicPics: '',
          outPics: '',
          floorPlanPics: '',
          channel: ''
        },
        houseRent: {
          roomType: '0',
          pay: '',
          pledge: '',
          roomNo: '',
          areaSize: '',
          restroom: '1',
          roomPics: '',
          listPrice: '',
          floorPrice: '',
          actualPrice: '',
          property: [],
        },
        delivery: [],
      },
      houseType: 0,
      houseId: '',
      pageType: '添加',
      houseUrl: '/house/add',

    }
  },
  onLoad (options) {
    //修改
    if (options.type == 1) {
      this.pageType = '修改'
      this.houseUrl = 'house/update'
      this.houseId = JSON.parse(options.houseId)
      this.houseContent.house.id = this.houseId.id
      this.houseContent.houseRent.id = this.houseId.rentId
    }

    this.getInit()
  },
  created () {
    if (this.stepHouse2[2] != '请选择') {
      this.stepHouse2[2].forEach((ele, index) => {
        this.propertyArr[index] = ele.map(v => {
          return v.type
        })
      })
    }
    //改变图片参数
    uni.$on('upPice', res => {
      this.houseType = 2
    })
  },
  onShow () {
    if (this.houseType == 2) {
      this.upTempImageList()
    }
    this.houseDelivery = []
    this.$store.state.deliveryList.forEach((ele, i) => {
      // let arr = ['电器类', '家具类', '钥匙凭证', '生活费用']
      ele.forEach((v, index) => {
        if (v.val.trim() != '') {
          switch (i) {
            case 0:
              this.houseDelivery.push('电器类')
              break
            case 1:
              this.houseDelivery.push('家具类')
              break
            case 2:
              this.houseDelivery.push('钥匙凭证')
              break
            case 3:
              this.houseDelivery.push('生活费用')
              break
          }
          return
        }
      })

    })
    this.houseDelivery = [...new Set(this.houseDelivery)];
    if (this.houseDelivery && !this.houseDelivery.length) {
      this.hosueDeValue = '可选'
    } else {
      this.hosueDeValue = this.houseDelivery.join(',')
    }

  },
  computed: {
    ...mapState(['deliverylist', 'houseNumber1']),
    //获取状态机中步骤二的数据
    ...contractState({
      pageInfo: function (state) {
        uni.setNavigationBarTitle({
          title: state.pageInfo.title[1]
        });
        return state.pageInfo
      },
      stepHouse1: state => state.stepHouse1,
      stepHouse2: state => state.stepHouse2
      // step2:function(state){
      //     //设置表单初始数据
      //     let stepData = state.step2;
      //     this.startText = (stepData[0].split('-'))[0];
      //     this.endText = (stepData[0].split('-'))[1];
      //     for(let i=0;i<4;i++){
      //         this.list[i].val = stepData[i+1];
      //     }

      //     this.houseSourceText = stepData[5];
      //     this.houseSourcePhoto = stepData[6];
      //     return state.step2
      // }
    }),
    //判断是否改变
    isChange () {
      let { startText, endText, list, houseSourceText, houseSourcePhoto } = this;
      let temp = [startText == '起始日期', endText == '截止日期', list.every(ele => ele.val == '请选择' || ele.val == ''), houseSourceText == '请选择', houseSourcePhoto == '请上传']
      return temp.every(ele => ele)
    },

  },
  methods: {
    ...mapMutations(['setupTempImageList', 'setHouseNumber']),
    ...contractMutation(['setStepHouse2', 'setStepHouse1',]),
    //图片上传临时数组
    ...mapState({
      upTempImageList: function (state) {
        let len = state.upTempImageList[3]
        this.houseSourcePhoto = len > 0 ? '共' + len + '张' : '请上传'
        state.upTempImageList
      }
    }),
    //初始化 回显数据
    getInit () {
      let temp = this.stepHouse2
      this.list.forEach((ele, index) => {
        ele.val = temp[index]
      })
      let str = ''
      this.houseSourceSet1 = temp[2]
      if (this.pageType == '修改') {
        temp[2].forEach(v => {
          v.forEach((ele, i) => {
            str = str + '-' + ele.type
          })
        })
        let str1 = str.substring(1, str.length)
        this.houseSourceSet = str1
        this.houseSourcePhoto = temp[4][3][0] > 0 ? '共' + temp[4][3][0] + '张' : '请上传'
      } else {
        this.houseSourceSet = '请选择'
        this.houseSourcePhoto = '请上传'
      }
      this.houseSourceText = temp[3]

    },
    //失焦事件
    getBlur (index) {
      if (Number(this.list[index].val).toFixed(2) === 'NaN') {
        uni.showToast({ title: `${this.list[index].text}格式错误`, icon: 'none' })
      } else {
        this.list[index].val = Number(this.list[index].val).toFixed(2)
      }
    },
    //更多设置回调
    clickAddhouseMask (item) {
      this.isShowAddSource = false
    },
    //获取渠道
    clickAddHouseCallBack1 (item) {
      uni.hideLoading()
      this.isShowAddSource1 = false,
        this.houseSourceText = item.currentTarget.dataset.item.text
    },
    clickAddHouseCallBack (item) {
      this.isShowAddSource = false
      if (item.length > 0) {
        this.houseSourceSet1 = item
        let str = ''
        item.forEach(v => {
          v.forEach((ele, i) => {
            str = str + '-' + ele.type
          })
        })
        let str1 = str.substring(1, str.length)
        this.houseSourceSet = str1
      }
      this.setList1 = item
      if (this.setList1.length > 0) {
        this.setList1.forEach((ele, index) => {
          this.propertyArr[this.setList1.length - 1 - index] = ele.map(v => {
            return v.type
          })
        })
      }

    },
    clickAddhouseMask1 () {
      this.isShowAddSource1 = false
    },
    /**
     * 日期选择期
     */
    bindDateChange (res, item) {
      if (item == '起始日期') {
        this.startText = res.detail.value
      } else {
        this.endText = res.detail.value
      }
    },
    /**
     * 租金选择器
     */
    bindPriceChange (e, item) {
      let index = this.list.indexOf(item);
      let val = e.detail.value;
      if (Array.isArray(val)) {
        this.list[index].val = this.list[index].selectList[0][val[0]] + '-' + this.list[index].selectList[1][val[1]]
      } else {
        this.list[index].val = this.list[index].selectList[val]
      }
    },
    /**
     * 房源选择器
     */
    bindSourceChange (e) {
      this.houseSourceText = this.houseSourceList[e.detail.value]
    },
    /**
     * 选项单击事件
     */
    optionClickHandel (item) {
      switch (item) {
        case '更多设置':
          this.isShowAddSource = true;
          break;
        case '房源照片':
          uni.navigateTo({
            url: '/pages/upload/upload?type=房源照片&numType=1&num=5',
          })
          break;
        case '交割单':
          uni.navigateTo({
            url: '/pages/addHouseSource/configList',
          })
          break;
        case "来源渠道":
          this.isShowAddSource1 = true
          break
        case '月租金':
          this.inputFocus = true
      }
    },
    isChecked () {
      let isCheck = true
      let temp1 = JSON.parse(JSON.stringify(this.list))
      temp1 = [...temp1, this.houseSourceSet, this.houseSourcePhoto]
      temp1 = temp1.reverse()
      temp1.forEach((v, i) => {
        if (v.val == '请选择' || v.val == '') {
          uni.showToast({
            title: `请选择${temp1[i].text}`,
            icon: 'none'
          })
          isCheck = false
          return isCheck
        }
        if (v == '') {
          uni.showToast({
            title: `请设置更多`,
            icon: 'none'
          })
        }
        if (v == '请上传') {
          uni.showToast({
            title: `请上传图片`,
            icon: 'none'
          })
          isCheck = false
          return isCheck
        }
        if (i == 3) {
          if (Number(v.val).toFixed(2) === 'NaN') {
            uni.showToast({ title: `${v.text}格式错误`, icon: 'none' })
            isCheck = false
            return isCheck
          } else {
            let str = v.val.split('.')[0]
            if (str.length > 6) {
              uni.showToast({
                title: `租金超出范围`,
                icon: 'none'
              })
              isCheck = false
              return isCheck
            }
          }

        }
      }
      )
      return isCheck
    },
    //提交按钮
    submit () {
      let res = this.isChecked()
      //数组暂存到状态机
      if (res) {
        let temp = this.stepHouse2;
        this.list.forEach((ele, index) => {
          temp[index] = ele.val
        })
        temp[2] = this.houseSourceSet1
        temp[3] = this.houseSourceText

        if (this.houseType == 2) {
          temp[4] = this.$store.state.upTempImageList
        } else {
          if (this.$store.state.upTempImageList[3][0] > 0) {
            let image = []
            this.$store.state.upTempImageList.forEach((ele, i) => {
              let arr = []
              ele.forEach((v, index) => {
                if (v.length && v.length > 0) {
                  let num = v.indexOf('/houses')
                  arr[index] = v.slice(num)
                }
              })
              image[i] = arr
            })
            temp[4] = image
          } else {
            temp[4] = [[], [], [], [0]]
          }
        }
        let temp1 = this.$store.state.deliveryList[0].filter(v => {
          return v.status == true
        })
        let temp2 = this.$store.state.deliveryList[1].filter(v => {
          return v.status == true
        })
        let temp3 = this.$store.state.deliveryList[2].filter(v => {
          return v.status == true
        })
        let temp4 = this.$store.state.deliveryList[3].filter(v => {
          return v.val != ""
        })
        temp[5] = [temp1, temp2, temp3, temp4]

        this.setStepHouse2(temp)
        /* JSON 数据转换*/
        //小区信息
        this.houseContent.house.name = this.stepHouse1[2].val
        //小区id
        this.houseContent.house.xiaoquId = this.stepHouse1[2].xiaoId
        //方位转换 
        switch (this.stepHouse1[5]) {
          case '东':
            this.houseContent.house.orientation = 'EO'
            break;
          case '西':
            this.houseContent.house.orientation = 'WO'
            break;
          case '南':
            this.houseContent.house.orientation = 'SO'
            break;
          case '北':
            this.houseContent.house.orientation = 'NO'
            break;
          case '东南':
            this.houseContent.house.orientation = 'ES'
            break;
          case '东北':
            this.houseContent.house.orientation = 'EN'
            break;
          case '西南':
            this.houseContent.house.orientation = 'WS'
            break;
          case '西北':
            this.houseContent.house.orientation = 'WN'
            break;
        }
        //楼栋信息
        this.houseContent.house.buildingNum = this.houseNumber1.bound
        this.houseContent.house.unitNum = this.houseNumber1.unit
        this.houseContent.house.houseNum = this.houseNumber1.room
        let arr = this.houseNumber1.floor.split('-')
        arr[0] = arr[0].substring(0, arr[0].length - 1)
        arr[1] = arr[1].substring(1, arr[1].length - 1)
        this.houseContent.house.floorNum = arr[0]
        this.houseContent.house.totalFloorNum = arr[1]
        //面积
        this.houseContent.house.areaSize = this.stepHouse1[3]
        //户型
        let arr1 = this.stepHouse1[4].split('-')
        arr1[0] = arr1[0].substring(0, 1)
        //房间数目
        this.houseContent.house.roomNum = arr1[0]
        arr1[1] = arr1[1].substring(0, 1)
        //客厅数目
        this.houseContent.house.livingRoomNum = arr1[1]
        //卫生间数目
        switch (arr1[2]) {
          case '单卫':
            this.houseContent.house.restroomNum = '1'
            break
          case '双卫':
            this.houseContent.house.restroomNum = '2'
            break
          case '三卫':
            this.houseContent.house.restroomNum = '3'
            break
          case '四卫':
            this.houseContent.house.restroomNum = '4'
            break
        }
        //装修
        switch (this.stepHouse1[6]) {
          case "毛坯":
            this.houseContent.house.renovation = '1'
            break;
          case "简单装修":
            this.houseContent.house.renovation = '2'
            break;
          case "精装修":
            this.houseContent.house.renovation = '3'
            break;
          case "豪华装修":
            this.houseContent.house.renovation = '4'
            break;
          default:
            break;
        }
        //公区图 
        this.houseContent.house.publicPics = this.stepHouse2[4][0].toString()
        //渠道
        this.houseContent.house.channel = this.stepHouse2[3]
        //支付方式
        let patStyle = this.stepHouse2[1].split('-')
        this.houseContent.houseRent.pay = patStyle[1]
        this.houseContent.houseRent.pledge = patStyle[0]
        //面积
        this.houseContent.houseRent.areaSize = this.stepHouse1[3]
        //房间照片
        this.houseContent.houseRent.roomPics = this.stepHouse2[4][1].toString()
        //挂牌价格
        this.houseContent.houseRent.listPrice = this.stepHouse2[0]
        // 设置房屋属性
        let property = this.stepHouse2[2]
        let arrList = [[], [], [], []]
        property = property.forEach((ele, index) => {
          ele.forEach(v => {
            arrList[index] = v.type + ',' + arrList[index]
          })
        })
        this.houseContent.houseRent.property = [{ type: 10, property: arrList[0].substring(0, arrList[0].length - 1) },
        { type: 11, property: arrList[1].substring(0, arrList[1].length - 1) },
        { type: 12, property: arrList[2].substring(0, arrList[2].length - 1) },
        { type: 13, property: arrList[3].substring(0, arrList[3].length - 1) }]
        //房屋清单
        let totalList = this.stepHouse2[5]
        let houseList = []
        totalList[0].forEach((ele) => {
          let a = {}
          a.type = 1
          a.name = ele.text
          a.remark = ele.val
          houseList.push(a)
        })
        totalList[1].forEach((ele) => {
          let a = {}
          a.type = 2
          a.name = ele.text
          a.remark = ele.val
          houseList.push(a)
        })
        totalList[2].forEach((ele) => {
          let a = {}
          a.type = 3
          a.name = ele.text
          a.remark = ele.val
          houseList.push(a)
        })
        totalList[3].forEach((ele, i) => {
          let a = {}
          a.type = 4
          a.name = ele.text
          a.remark = ele.val
          houseList.push(a)
        })
        houseList.forEach(ele => {
          this.houseContent.delivery.push(ele)
        })
        this.houseContent = JSON.stringify(this.houseContent)
        this.getAddhouse()
      }
    },
    //添加房源信息方法
    async getAddhouse () {
      uni.showLoading({
        title: '加载中...',
        icon: 'none'
      })
      try {
        let res = await this.request({
          url: this.houseUrl,
          contentType: 'application/json;charset=utf-8',
          type: 'post',
          param: this.houseContent
        })
        if (res[1].data.state == 200) {
          uni.hideLoading()
          //添加成功清除  本地缓存
          // let stephouse1 = ['', '', { name: '请选择' }, '', '请选择', '请选择', '请选择', '请选择']
          // let stephouse2 = ['', '请选择', '请选择', '请选择', [], []]
          // let houseNumber = {
          //   bound: '',
          //   unit: '',
          //   floor: '',
          //   room: ''
          // }
          // this.setupTempImageList([[], [], [], [0]])
          // this.setHouseNumber(houseNumber)
          // this.setStepHouse1(stephouse1)
          // this.setStepHouse2(stephouse2)

          if (this.pageType == '修改') {
            uni.reLaunch({
              url: `/pages/addHouseSource/finish?source=${this.pageType}&type=` + JSON.stringify(this.houseId)
            })
          } else if (this.pageType == '添加') {
            //房源添加
            let temp = {
              rentId: res[1].data.body.id,
              name: res[1].data.body.name
            }
            this.houseId = temp
            uni.reLaunch({
              url: `/pages/addHouseSource/finish?source=${this.pageType}&type=` + JSON.stringify(this.houseId)
            })
          }
        } else {
          uni.showToast({
            title: this.$throwStatusCode(res[1].data.state, '添加房源'),
            icon: 'none'
          })
        }
      } catch (err) {
        console.log(err)
      }

    },

  },

}
</script>

<style lang='scss' scoped>
.addHouseSource {
  .addHouseProcess {
    padding: 70rpx 0rpx 70rpx 0rpx;
    box-sizing: border-box;
    .addProcess {
      margin: 0 auto;
      width: 400rpx;
    }
    .processPoint {
      width: 420rpx;
      display: flex;
      justify-content: space-between;
      margin: 0 auto;
      view:nth-child(2) {
        background-color: #00a680 !important;
      }
      view {
        width: 20rpx;
        height: 20rpx;
        border-radius: 15rpx;
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
        font-size: 30rpx;
      }
    }
  }
  .selectBox {
    width: 750rpx;
    // padding:0rpx 20rpx 0rpx 23rpx;
    box-sizing: border-box;
    .way {
      display: flex;
      background-color: white;
      padding: 40rpx;
      border-radius: 10rpx;
      box-sizing: border-box;
      view:nth-child(1) {
        width: 230rpx;
      }
      view:nth-child(2) {
        font-size: 26rpx;
        font-weight: 600;
      }
    }
    .itemBox {
      margin-top: 20rpx;
      border-radius: 10rpx;
      // padding:20rpx 40rpx 0rpx 40rpx;

      background-color: white;
      box-sizing: border-box;

      .selectItem {
        display: flex;
        height: 100rpx;
        align-items: center;
        // border-bottom: solid 3rpx #ececec;
        font-size: 30rpx;
        padding: 0rpx 40rpx;
        .itemLeft {
          width: 260rpx;
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
        // .itemRight{

        // }
        .itemRightText {
          box-sizing: border-box;
          margin-right: 20rpx;
        }
        .timeRight {
          display: flex;
          width: 340rpx;
          justify-content: space-between;
          position: relative;
          // background-color: yellowgreen;
          .rightItem {
            display: flex;
            align-items: center;
            color: #cfcfcf;
            // image{
            //     // margin-left: 20rpx;
            // }
          }
          .rightItem:nth-child(2) {
            // margin-left: 80rpx;
            transform: translateX(50%);
          }
          .hack {
            position: absolute;
            width: 120rpx;
            height: 120rpx;
            background-color: red;
            left: 140rpx;
            top: -40rpx;
            opacity: 0;

            // z-index: 99999;
          }
        }
        &:active {
          background: #fafafa;
        }
      }
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
}
</style>