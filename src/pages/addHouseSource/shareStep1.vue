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

      <view class='itemBox'>
        <view class='isShow'
              v-for="(item,index) in addhouseList"
              :key='index'
              @tap='modifyHouse(item,index)'
              :style="'borderBottom:'+(index==(addhouseList.length-1)?'none':'')">
          <view class="isShow_left">
            <span>{{item[7].substring(0,1)}}</span> {{item[0].val}}
            <view class="">
              {{item[2].val}}元/月 {{item[3].val}}
            </view>
          </view>
          <view class="isShow_right">
            <view class=""
                  style='margin-right: 30rpx;'>
              {{item[4].val}}房间图
            </view>
            <view class="cuIcon-right"></view>
          </view>
        </view>
        <view @tap="optionClickHandel('添加房间')"
              class='selectItem'
              v-if="pageType!='修改'">
          <view class='itemLeft'><span style="color: #00A680;font-size:50rpx;">＋</span>添加出租房间</view>
          <view class='itemCenter'></view>
          <view class="cuIcon-right"></view>
        </view>
      </view>
      <view class='itemBox'>
        <view @tap="optionClickHandel('公共照片')"
              class='selectItem'
              style='border-bottom: 2rpx solid #EEEDF2;'>
          <view class='itemLeft'>公共照片</view>
          <view class='itemCenter'
                style="margin-left:30rpx"
                :style="'color:'+(picture.val==='请上传'?'':'black')">{{picture.val}}</view>
          <view class="cuIcon-right"></view>
        </view>

        <view @tap="optionClickHandel('交割单')"
              class='selectItem'>
          <view class='itemLeft'>房源配置/交割单</view>
          <view class='itemCenter overText'
                :style="'color:'+(deliveryVal==='可选'?'':'black')"
                style="margin-left:30rpx">{{deliveryVal!=''?deliveryVal:'可选'}}</view>
          <view class="cuIcon-right"></view>
        </view>
      </view>
      <view class='itemBox'>
        <view @tap="optionClickHandel('来源渠道')"
              class='selectItem'>
          <view class='itemLeft'>来源渠道</view>
          <view class='itemCenter'
                style="margin-left:30rpx"
                :style="'color:'+(trench.val==='请选择'?'':'black')">{{trench.val}}</view>
          <view class="cuIcon-right"></view>
        </view>
      </view>
    </view>
    <view @tap="nextBtn"
          :style="'background-color:'+(!isChange?'#00a680':'#cccccc')+';'"
          class='nextBtn'>提交</view>
    <Modal2 :isShow="isShowAddSource"
            :normal="addSourceList"
            @clickCallBack="clickAddHouseCallBack1"
            @clickMaskCallBack="clickAddhouseMask1"></Modal2>
  </view>
</template>

<script>
import Modal2 from '@/components/comm/modal1/modal1.vue';
import { mapState, mapMutations, createNamespacedHelpers } from 'vuex';
const { mapState: contractState, mapMutations: contractMutation } = createNamespacedHelpers('contract')
export default {
  name: 'addHomeSourceStep1',
  components: {
    Modal2
  },
  data () {
    return {
      houseShow: [],
      picture: { val: '请上传' },
      deliveryList: [],
      deliveryVal: '',
      trench: { val: "请选择" },
      isShowAddSource: false,
      addSourceList: [
        { text: '业主主动委托' },
        { text: '推荐/转介绍' },
        { text: '同行' },
        { text: '公司' },
        { text: '自主获取' }],
      houseContent: {
        house: {
          rentalType: '2',
          xiaoquId: '1',
          name: '蜀都花园',
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
        houseRent: [{
          roomType: '1',
          pay: '',
          pledge: '',
          roomNo: '',
          areaSize: '',
          restroom: '-1',
          roomPics: '',
          listPrice: '',
          floorPrice: '',
          actualPrice: '',
          rentType: '',
          property: [],
        },],
        // 
        delivery: [],
      },
      houseType: '',
      pageType: '添加',
      houseId: '',
      houseUrl: '/house/add',
      piceText: '',
      // isrentId:""

    }
  },
  computed: {
    ...mapState({
      locationInfo: state => state.locationInfo,
      listCity: state => state.listCity,
      upTempImageList: state => state.upTempImageList,
      houseNumber1: state => state.houseNumber1
    }),

    ...contractState({
      stepHouse1: state => state.stepHouse1,
      stepHouse2: state => state.stepHouse2,
      pageInfo: state => state.pageInfo,
      addhouseList: state => state.addhouseList,
      totalList: state => state.totalList,
      addHouse: state => state.addHouse,
      showImage: state => state.showImage
    }),
  },
  onLoad (options) {
    this.houseType = options.type
    uni.hideLoading()
    //this.houseType==1 表示修改房源状态
    if (this.houseType == 1) {
      this.pageType = '修改'
      this.houseId = JSON.parse(options.houseId)
      this.houseUrl = '/house/update'
      this.houseContent.house.id = this.houseId.id
      this.getInit()
      //房间状态
      this.addhouseList.forEach(ele => {
        this.totalList.forEach(v => {
          if (v.type == ele[7]) {
            v.num = 0
            v.status = false
          }
        })
      })
      //更新房间号状态
      this.setTotalList(this.totalList)
    }
    uni.setNavigationBarTitle({
      title: this.pageInfo.title[0]
    })

  },
  onShow () {
    this.deliveryList = []
    this.$store.state.deliveryList.forEach((ele, i) => {
      ele.forEach((v, index) => {
        if (v.val != '') {
          switch (i) {
            case 0:
              this.deliveryList.push('电器类')
              break
            case 1:
              this.deliveryList.push('家具类')
              break
            case 2:
              this.deliveryList.push('钥匙凭证')
              break
            case 3:
              this.deliveryList.push('生活费用')
              break
          }
          return
        }
      })

    })
    this.deliveryList = [...new Set(this.deliveryList)];
    if (!this.deliveryList.length) {
      this.deliveryVal = '可选'
    } else {
      this.deliveryVal = this.deliveryList.join(',')
    }
    if (this.houseType == 2) {
      this.picture.val = this.upTempImageList[0].length == 0 ? '请上传' : "共" + this.upTempImageList[0].length + '张'
    }

    // this.getPice()
    let title = this.pageInfo.title[0]
    // this.setHouseAndCity();
    this.setPageInfo({ type: '添加房源', title: [`${title}`, '添加房源'], processList: [{ text: '房屋概况', status: true }, { text: '设置售价', status: true }, { text: '完成', status: false }], len: [50, 100] })
  },
  created () {
    //改变图片参数
    uni.$on('upPice', res => {
      this.houseType = 2
      this.piceText = res
    })
  },
  mounted () {

  },
  methods: {
    ...mapMutations(['setupTempImageList', 'setHouseNumber']),
    ...contractMutation(['setPageInfo', 'setStepHouse1', 'setStepHouse2', 'setTotalList', 'setHouseInfo', 'setImage']),
    //获取渠道
    clickAddHouseCallBack1 (item) {
      uni.hideLoading()
      this.isShowAddSource = false,
        this.trench.val = item.currentTarget.dataset.item.text
    },
    //初始化 回显数据
    getInit () {
      let temp = this.stepHouse2
      this.picture.val = temp[1][3] == 0 ? '请上传' : "共" + temp[1][3] + '张'
      this.trench.val = temp[3]
    },
    //取消遮罩
    clickAddhouseMask1 () {
      this.isShowAddSource = false
      this.trench.val = '请选择'
    },
    //点击事件
    optionClickHandel (item) {
      switch (item) {
        case "添加房间":
          uni.navigateTo({
            url: '/pages/addHouseSource/shareList?type=0',
          })
          break;
        case '公共照片':
          uni.navigateTo({
            url: '/pages/upload/upload?type=房源照片&numType=2',
          })
          break;
        case '交割单':
          uni.navigateTo({
            url: '/pages/addHouseSource/configList',
          })
          break;
        case '来源渠道':
          this.isShowAddSource = true
          break;
      }
    },
    //修改房间信息
    modifyHouse (item, index) {
      this.setHouseInfo(item)
      let temp = JSON.parse(JSON.stringify(this.addHouse))
      this.setImage(temp[4])
      uni.navigateTo({
        url: '/pages/addHouseSource/shareList?type=1&index=' + index
      })
    },

    /**
     * 下拉列表选择事件
     */
    bindDateChange (res, item) {
      let index = this.list.indexOf(item);
      let val = res.detail.value;
      if (Array.isArray(val)) {
        this.list[index].val = this.list[index].selectList[0][val[0]] + '-' + this.list[index].selectList[1][val[1]]
      } else {
        this.list[index].val = this.list[index].selectList[val]
      }
    },
    //表单校验

    /**
     * 下一步
     */
    nextBtn () {
      //
      if (!this.addhouseList.length) {
        uni.showToast({
          title: '请添加房间',
          icon: 'none'
        })
        return;
      }
      if (this.picture.val == '请上传') {
        uni.showToast({
          title: '请上传公共照片',
          icon: 'none'
        })
        return;
      }
      let temp = this.stepHouse2;
      if (this.houseType == 2 && this.piceText == '房间照片') {
        let len = this.$store.state.upTempImageList[0].length
        temp[1] = [this.$store.state.upTempImageList[0], [], [], [len]]
      } else {
        if (this.$store.state.upTempImageList[0] && this.$store.state.upTempImageList[0].length > 0) {
          let image = []
          this.$store.state.upTempImageList[0].forEach((ele, i) => {
            let num = ele.indexOf('/house')
            image[i] = ele.slice(num)
          })
          temp[1] = [image, [], [], [], image.length]

        } else {
          temp[1] = []
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
      temp[2] = [temp1, temp2, temp3, temp4]
      temp[3] = this.trench.val
      this.setStepHouse2(temp)
      let rentList = []
      /* JSON 数据转换*/
      this.addhouseList.forEach((ele, index) => {
        let houseList = {}
        //id
        if (this.houseType == 1 || this.pageType == '修改') {
          houseList.id = ele[8]
        }
        //出租房间
        switch (ele[0].val) {
          case '主卧':
            houseList.roomType = '1'
            break;
          case '次卧':
            houseList.roomType = '2'
            break;
          case '公区':
            houseList.roomType = '3'
            break;
        }
        //房间支付方式
        houseList.pay = ele[3].val.split('-')[1]
        houseList.pledge = ele[3].val.split('-')[0]
        //房间编号
        houseList.roomNo = ele[7].substring(0, 1)
        //房间面积
        houseList.areaSize = ele[1].val
        //房间照片
        houseList.roomPics = ele[4].pice.toString()
        //出租价格
        houseList.listPrice = ele[2].val
        houseList.floorPrice = ''
        houseList.actualPrice = ''
        //有无厕所
        switch (ele[5].val) {
          case '带':
            houseList.restroom = '1'
            break;
          case "不带":
            houseList.restroom = '-1'
        }
        ele[6].reverse()
        //房源属性设置
        let temp1 = []
        ele[6][0].forEach((v, i) => {
          temp1[i] = v.type
        })
        let temp2 = []
        ele[6][1].forEach((v, i) => {
          temp2[i] = v.type
        })
        let temp3 = []
        ele[6][2].forEach((v, i) => {
          temp3[i] = v.type
        })
        let temp4 = []
        ele[6][3].forEach((v, i) => {
          temp4[i] = v.type
        })
        houseList.property = [{ type: 10, property: temp1.toString() },
        { type: 11, property: temp2.toString() },
        { type: 12, property: temp3.toString() },
        { type: 13, property: temp4.toString() },]

        rentList[index] = houseList
      })
      this.houseContent.houseRent = rentList


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
      }
      //公区图 
      this.houseContent.house.publicPics = this.stepHouse2[1][0].toString()
      //渠道
      this.houseContent.house.channel = this.stepHouse2[3]
      //房屋清单
      let totalList = this.stepHouse2[2]
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
      // let temp = this.stepHouse1
      // this.list.forEach((ele,index)=>{
      //     temp[index+1] = ele.val
      // })
      // uni.navigateTo({
      //     url:`/pages/addHouseSource/finish`
      // })
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
            uni.reLaunch({
              url: `/pages/addHouseSource/finish?source=${this.pageType}&num=11&type=` + JSON.stringify(this.houseId)
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
          uni.hideLoading()
          uni.showToast({
            title: this.$throwStatusCode(res[1].data.state, '添加房源'),
            icon: 'none'
          })
        }
      } catch (err) {
        console.log(err)
      }
    }
  },
  onUnload () {
    //    this.setupTempImageList([])
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
      .isShow {
        width: 670rpx;
        margin: 0 40rpx;
        padding: 12rpx 0;
        border-bottom: calc(1px / 2.5) solid #e4e3e6;
        font-size: 28rpx;
        display: flex;
        justify-content: space-between;
        span {
          display: inline-block;
          width: 30rpx;
          height: 30rpx;
          line-height: 30rpx;
          text-align: center;
          margin-right: 24rpx;
          border: 2rpx solid #00a680;
          color: #00a680;
          font-size: 24rpx;
        }
        .isShow_right {
          display: flex;
          height: 100rpx;
          line-height: 100rpx;
          font-size: 30rpx;
          align-items: center;
        }
      }
      .selectItem {
        margin: 0rpx 40rpx 0rpx 40rpx;
        display: flex;
        height: 100rpx;
        align-items: center;
        // border-bottom: solid 3rpx #ececec;
        font-size: 30rpx;
        .itemLeft {
          height: 100rpx;
          width: 250rpx;
          line-height: 100rpx;
          span {
            position: relative;
            top: 5rpx;
            left: 0;
            // display: inline-block;
            // background: blue;
          }
        }
        .overText {
          overflow: hidden;
          text-overflow: ellipsis;
          white-space: nowrap;
        }
        .itemCenter,
        .itemInput {
          flex-grow: 1;
          color: #cfcfcf;
        }
        .itemInput {
          color: black;
        }

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
    &:active {
      background: #007e5e;
    }
  }
}
</style>