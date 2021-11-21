<template>
  <!-- 二手房添加修改 -->
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
                  :style="'color:'+(item.val==='请选择'?'':'black')+';'"
                  style="width:360rpx;box-sizing: border-box;">{{item.val}}</view>
            <input v-model="item.val"
                   @blur="getBlur(index)"
                   :focus="inputFocus"
                   class='itemInput'
                   v-else
                   type="digit"
                   placeholder-style='color: #cfcfcf;'
                   :placeholder="item.val==''?'请输入':item.val" />
            <view v-if="item.text!='售价'&&item.text!='佣金比例'"
                  class="cuIcon-right"></view>
            <view v-else-if='item.text=="售价"'
                  class='itemRightText'>万</view>
            <view v-else-if="item.text=='佣金比例'"
                  class='itemRightText'>%</view>
          </view>
          <view v-if="index!=list.length-1"
                id="cell">
            <view class="line"></view>
          </view>
        </block>
      </view>
      <view class='itemBoxTitle'
            style="color:gray;font-size:26rpx;padding:30rpx 0rpx 0rpx 30rpx"></view>
      <view class='itemBox'
            style="padding-top:0rpx">
        <block v-for="(item,index) in delivery"
               :key="item.text">
          <view @tap="optionClickHandel('上传房屋图片')"
                class='selectItem'>
            <view class='itemLeft'>{{item.text}}</view>
            <view class='itemCenter'
                  :style="item.val!='请上传'?'color:#000':''">{{item.val}}</view>
            <view class="cuIcon-right"></view>
          </view>
          <view v-if="index!=delivery.length-1"
                id="cell">
            <view class="line"></view>
          </view>
        </block>
      </view>

      <view class='itemBoxTitle'
            style="color:gray;font-size:26rpx;padding:30rpx 0rpx 0rpx 30rpx"></view>
      <view class='itemBox'
            style="padding-top:0rpx">

        <view @tap="optionClickHandel('交割单')"
              class='selectItem'>
          <view class='itemLeft'>房源配置/交割单</view>
          <view class='itemCenter'
                :style="'color:'+(hosueDeValue!='可选'?'#000':'')">{{hosueDeValue}}</view>
          <view class="cuIcon-right"></view>
        </view>
        <view id="cell">
          <view class="line"></view>
        </view>
        <view @tap="optionClickHandel('来源渠道')"
              class='selectItem'>
          <view class='itemLeft'>来源渠道</view>
          <!-- <view class='itemCenter'></view> -->
          <input class='itemInput'
                 disabled="true"
                 type="digit"
                 :placeholder-style='getSources=="请选择"?"color:#cfcfcf":"color:#000"'
                 :placeholder="getSources" />
          <view class="cuIcon-right"></view>
        </view>

      </view>
    </view>

    <view @tap="submit"
          :style="'background-color:'+(!isChange?'#00a680':'#cccccc')+';'"
          class='nextBtn'>{{pageInfo.type=='二手房源'?'提交':'下一步'}}</view>
    <view style="width:750rpx;height:100rpx"></view>
    <Modal1 :type='type'
            :propertyArr='propertyArr'
            :isShow="isShowAddSource"
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
  data () {
    return {
      type: true,
      list: [
        { text: '售价', isInput: true, val: '' },
        { text: '佣金比例', isInput: true, val: '' },
        { text: '更多设置', isInput: false, val: '请选择' },
      ],
      count: '',
      isabled: true,
      houseSourceList: ['自有产权', '自主获客', '中介', '终端商家', '公司推荐'],
      houseSourceText: '请选择',
      delivery: [
        { text: '上传房屋图片', val: '请上传' },
      ],
      houseDelivery: [],
      propertyArr: [],
      hosueDeValue: '可选',
      getSources: '请选择',
      inputFocus: false,
      startDate: {
        start: '',
        end: ''
      },
      endDate: {
        start: '',
        end: ''
      },
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
          rentalType: '3',
          xiaoquId: '',
          name: '',
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
        // houseRent:{},
        houseSale: {
          commission: '',
          commissionShare: '',
          listPrice: '',
          floorPrice: '',
          floorPrice: '',
          actualPrice: '',
          property: [],
        },
        delivery: [],
      },
      houseType: '',
      pageType: '添加',
      houseId: '',
      houseUrl: 'house/add',

    }
  },
  components: {
    Modal1,
    Modal2
  },
  onLoad (options) {
    this.houseType = options.type
    if (options.type == 1) {
      this.pageType = '修改'
      this.houseUrl = 'house/update'
      this.houseId = JSON.parse(options.houseId)
      this.houseContent.house.id = this.houseId.id
    }
    this.getInit()


  },
  created () {
    if (this.step2[2]) {
      this.step2[2].split('-').forEach((ele, index) => {
        this.propertyArr[this.step2[2].split('-').length - 1 - index] = ele
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
    if (!this.houseDelivery.length) {
      this.hosueDeValue = '可选'
    } else {
      this.hosueDeValue = this.houseDelivery.join(',')
    }
  },
  computed: {
    ...mapState(['deliverylist', 'houseNumber1', 'houseNumber']),
    //获取状态机中步骤二的数据
    ...contractState({
      pageInfo: function (state) {
        uni.setNavigationBarTitle({
          title: state.pageInfo.title[1]
        });
        return state.pageInfo
      },
      step1: function (state) {
        return state.step1
      },
      step2: state => state.step2
    }),

  },
  methods: {
    ...contractMutation(['setStep1', 'setStep2']),
    ...mapMutations(['setupTempImageList', 'setHouseNumber']),
    //图片上传临时数组
    ...mapState({
      upTempImageList: function (state) {
        let len = state.upTempImageList[3]
        this.delivery[0].val = len > 0 ? '共' + len + '张' : '请上传'
        state.upTempImageList
      }
    }),
    //初始化数据
    getInit () {
      let temp = (Array.from(this.step2))
      this.list.forEach((ele, index) => {
        ele.val = temp[index]
      })
      this.getSources = temp[4]
      this.upTempImageList()
    },
    clickAddHouseCallBack (item) {
      this.isShowAddSource = false
      if (item.length > 0) {
        let str = ''
        item.forEach(v => {
          v.forEach(ele => {
            str = ele.type + '-' + str
          })
        })
        let str1 = str.substring(0, str.length - 1)
        this.list[2].val = str1
      }
      this.setList1 = item
      if (this.setList1.length > 0) {
        this.setList1.forEach((ele, index) => {
          this.propertyArr[index] = ele.map(v => {
            return v.type
          })
        })
      }
    },
    //失焦事件
    getBlur (index) {
      let num = index == 1 ? 1 : 2
      if (Number(this.list[index].val).toFixed(num) === 'NaN') {
        uni.showToast({ title: `${this.list[index].text}格式错误`, icon: 'none' })
      } else {
        this.list[index].val = Number(this.list[index].val).toFixed(num)
      }
    },

    //获取渠道
    clickAddHouseCallBack1 (item) {
      uni.hideLoading()
      this.isShowAddSource1 = false,
        this.getSources = item.currentTarget.dataset.item.text
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
    isChecked () {
      let isCheck = true;
      let temp1 = JSON.parse(JSON.stringify(this.list))
      temp1.push(this.delivery[0])
      temp1 = temp1.reverse()
      temp1.forEach((v, i) => {
        if (i == 3) {
          if (Number(v.val).toFixed(2) === 'NaN') {
            uni.showToast({ title: `${v.text}格式错误`, icon: 'none' })
            isCheck = false
            return isCheck
          } else {
            let str = v.val.split('.')[0]
            if (str.length > 6) {
              uni.showToast({
                title: `售价超出范围`,
                icon: 'none'
              })
              isCheck = false
              return isCheck
            }
          }

        }
        if (i == 2) {
          if (Number(v.val).toFixed(1) === 'NaN') {
            uni.showToast({ title: `${v.text}格式错误`, icon: 'none' })
            isCheck = false
            return isCheck
          } else {
            if (Number(v.val).toFixed(1) > 50 || (Number(v.val)).toFixed(1) < 0) {
              uni.showToast({
                title: `佣金范围0到50`,
                icon: 'none'
              })
              isCheck = false
              return isCheck
            }
          }

        } else if (v.val == '请选择' || v.val == '' || v.val == '请上传') {
          uni.showToast({
            title: `请选择${temp1[i].text}`,
            icon: 'none'
          })
          isCheck = false
          return isCheck

        }

      })
      return isCheck
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
        case '上传房屋图片':
          uni.navigateTo({
            url: '/pages/upload/upload?type=上传房屋图片&numType=3',
          })
          break;
        case '交割单':
          uni.navigateTo({
            url: '/pages/addHouseSource/configList',
          })
          break;
        case '更多设置':
          this.isShowAddSource = true;
          break;
        case "来源渠道":
          this.isShowAddSource1 = true
          break
      }
    },
    //添加房源遮罩点击
    clickAddhouseMask () {
      this.isShowAddSource = false
    },
    clickAddhouseMask1 () {
      this.isShowAddSource1 = false
    },
    //提交按钮
    submit () {
      //数组暂存到状态机
      let res = this.isChecked()
      if (res) {
        let temp = this.step2;
        this.list.forEach((ele, index) => {
          temp[index] = ele.val
        })
        temp[4] = this.getSources;
        if (this.houseType == 2) {
          temp[5] = this.$store.state.upTempImageList
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
            temp[5] = image
          }
        }

        this.setStep2(temp)
        if (this.houseType == 2) {
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
          temp[6] = [temp1, temp2, temp3, temp4]
        }
        /* JSON 数据转换*/
        //小区信息
        this.houseContent.house.name = this.step1[1].val
        //小区id
        this.houseContent.house.xiaoquId = this.step1[1].xiaoId
        //方位转换 
        switch (this.step1[4]) {
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
        this.houseContent.house.areaSize = this.step1[2]
        //户型
        let arr1 = this.step1[3].split('-')
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
        switch (this.step1[5]) {
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
        }
        //是否可见
        switch (this.step1[7]) {
          case '仅自己可见':
            this.houseContent.houseSale.visible = '1'
            break;
          case '公开':
            this.houseContent.houseSale.visible = '2'
            break;
        }
        //室内图 
        this.houseContent.house.publicPics = this.step2[5][0].toString()
        //户型图
        this.houseContent.house.floorPlanPics = this.step2[5][1].toString()
        //室外图
        this.houseContent.house.outPics = this.step2[5][2].toString()
        //渠道
        this.houseContent.house.channel = this.step2[4]
        //佣金比例
        this.houseContent.houseSale.commission = Number(this.step2[1]).toFixed(2)
        //挂牌价
        this.houseContent.houseSale.listPrice = this.step2[0]
        this.houseContent.houseSale.floorPrice = this.step2[0]
        //设置房屋属性
        let property = this.step2[2].split('-')
        this.houseContent.houseSale.property = [
          { type: 1, property: property[5] },
          { type: 2, property: property[4] },
          { type: 3, property: property[3] },
          { type: 4, property: property[2] },
          { type: 5, property: property[1] },
          { type: 6, property: property[0] }]
        //房屋清单
        let totalList = this.step2[6]
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
          if (this.pageType == '修改') {
            //房源修改
            uni.reLaunch({
              url: `/pages/addHouseSource/finish?source=${this.pageType}&type=` + JSON.stringify(this.houseId)
            })
          } else if (this.pageType == '添加') {
            //房源添加
            let temp = {
              saleId: res[1].data.body.id,
              name: res[1].data.body.name
            }
            this.houseId = temp
            uni.reLaunch({
              url: `/pages/addHouseSource/finish?source=${this.pageType}&type=` + JSON.stringify(this.houseId)
            })
          }

        } else {
          uni.hideLoading()
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
  onUnload () {

  }
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
          // max-width: 300rpx;
        }
        .itemCenter,
        .itemInput {
          flex-grow: 1;
          width: 260rpx;
          color: #cfcfcf;
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
        }
        .itemInput {
          // margin-left: 97rpx;
          color: black;
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