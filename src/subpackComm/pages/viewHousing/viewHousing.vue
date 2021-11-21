<template>
  <view>
    <view class='viewHousing'
          @tap="isApproval=false"
          v-if="flag">
      <view class='swiperBox'>
        <swiper @change="swiperChange"
                circular="true"
                class="swiper"
                :indicator-dots="indicatorDots"
                :autoplay="true">
          <swiper-item v-for="(item,index) in swiperList"
                       :key="index"
                       style="width:750rpx;height:500rpx">
            <image @tap="seeImage(index)"
                   mode="aspectFill"
                   :src='item '></image>
          </swiper-item>
        </swiper>
        <view class='swiperTip'>{{currentSwiper}}/{{swiperList.length}}</view>
      </view>
      <!-- <view class="demo">
        <web-view src='../../../../static/html/photo_sphere.html'></web-view>
      </view> -->
      <view class='houseContainer'>
        <view class="houseInfo">
          <view class='infoLeft'>
            <view class='right-name'>{{hosueDetails.house.name}} {{hosueDetails.houseUnit}} {{hosueDetails.house.orientation}}</view>
            <view class='right-addrs'>{{hosueDetails.bkXiaoqu.cityName}}·{{hosueDetails.bkXiaoqu.quyu}}·{{hosueDetails.bkXiaoqu.shangquan}}</view>
            <view class="segment">
              <view class="segment_item"
                    v-for="(item,index) in property"
                    :key='index'>
                {{item.property}}
              </view>
            </view>
          </view>
          <view class='infoRight'>
            <view>{{Introduce[4][0].property}}</view>
          </view>
          <button open-type="share"
                  class="infoShare"
                  style='font-size: 24rpx;'
                  v-if="pageType==0">
            <image style="width:40rpx;height:40rpx;"
                   src="https://uss.img.lezhulife.com/xcxicon/share.png"></image>
            <view>分享</view>
          </button>
        </view>
        <view class="date_time"
              v-if="pageType==1">
          <view class="">
            发布时间：{{hosueDetails.house.createTime}}
          </view>
          <view class="">
            更新时间：{{hosueDetails.house.updateTime}}
          </view>
          <view>
            房源可见范围: {{hosueDetails.visible}}
          </view>
        </view>
        <view class="house_layout">
          <view class="layout_item">

            <view class="layout_color">
              {{hosueDetails.houseSale.listPrice}}万
            </view>
            <view class="">
              售价
            </view>

          </view>
          <view class="layout_item">
            <view class="layout_color">
              {{hosueDetails.houseUnit}}
            </view>
            <view class="">
              户型
            </view>
          </view>
          <view class="layout_item">
            <view class="layout_color">
              {{hosueDetails.house.areaSize}}m²
            </view>
            <view class="">
              面积
            </view>
          </view>
          <!-- <view class="layout_item">
                                                <view class="layout_weight">
                                                        2次
                                                </view>
                                                <view class="">
                                                        近7日带看
                                                </view>
                                        </view> -->
          <!-- <view class="layout_item">
                                                <view class="layout_weight">
                                                        22次
                                                </view>
                                                <view class="">
                                                        近30日看
                                                </view>
                                        </view> -->
          <!-- <view class="layout_item">
                                                <view class="layout_weight">
                                                        11人
                                                </view>
                                                <view class="">
                                                        关注此房源
                                                </view>
                                        </view> -->
        </view>
        <view class="base_info">
          <view style=' font-size: 32rpx;font-weight: 600;margin-top: 20rpx;'>基本信息</view>
          <view class="info_box">
            <view class="info_item">
              <span>
                单价
              </span>：{{hosueDetails.sellPrice}}元/平
            </view>
            <view class="info_item">
              <span>挂牌</span>：{{guapai[0]}}
            </view>
            <view class="info_item">
              <span>朝向</span>：{{hosueDetails.house.orientation}}
            </view>
            <view class="info_item">
              <span>楼层</span>：{{hosueDetails.housefool}}
            </view>
            <view class="info_item">
              <span>楼型</span>：{{hosueDetails.bkXiaoqu.buildType}}
            </view>
            <view class="info_item">
              <span>电梯</span>：{{dianTi[0].property}}
            </view>
            <view class="info_item">
              <span>装修</span>：{{hosueDetails.renovation}}
            </view>
            <view class="info_item">
              <span>年代</span>：{{hosueDetails.bkXiaoqu.buildDate}}
            </view>
            <view class="info_item">
              <span>用途</span>：{{yongtu[0].property}}
            </view>
            <view class="info_item">
              <span>产权</span>：{{nianxian[0].property || ''}}
            </view>
          </view>
          <view class=""
                style='margin-top: 30rpx'>
            <span style="color: gray;">开发商</span>：{{hosueDetails.bkXiaoqu.buildCompany}}
          </view>
          <view class=""
                style='margin-top: 30rpx'>
            <span style="color: gray;">物业公司</span>：{{hosueDetails.bkXiaoqu.propertyCompany}}
          </view>
          <view class=""
                style='margin-top: 30rpx'>
            <span style="color: gray;">物业费</span>：{{hosueDetails.bkXiaoqu.propertyFee}}
          </view>
        </view>
      </view>
      <!--  <Delivery></Delivery>
                        <Business></Business> -->
      <SurveryMap :toChild="toChild"></SurveryMap>
      <view class="introBox">
        <view style=' font-size: 32rpx;font-weight: 600;margin: 40rpx 0 20rpx 30rpx;'>
          房源介绍
        </view>
        <view class="tabBar">
          <view class="tabBar_item"
                v-for="(item,index) in tarBarList"
                :key='index'
                @tap='curryIndex(index)'
                :style="index ==tabIndex?'color:#00A680;':''">
            {{item}}
            <view class="border_item"
                  :style="index ==tabIndex?'background-color:#00A680;':''">
            </view>
          </view>

        </view>

        <view class="tabBar_centent">
          {{Introduce[tabIndex].length>0?Introduce[tabIndex][0].property:''}}
        </view>
      </view>

      <Modal1 @clickCallBack="clickModalCallBack"
              @clickMaskCallBack="clickMask"
              :isShow="isShowModal1"
              :normal="renderList"
              :imgList="(isSign?signList:[])"></Modal1>
      <Modal2 :isHack="true"
              :isShowModal2="isShowModal2"
              :model1List="model1List"
              :isAuthCode="isAuthCode"
              :isModel1="isModel1"
              :modalTitle="modal2Title"
              :btnList="buttonList"
              @clickModal2MaskCallBack="clickModal2Mask"
              @clickModal2ItemCallBack="clickModal2Item">
        <block v-if="isSteward">
          <view class='steward'>
            <view class='stewardBox'>
              <view class='stewardTop'>
                <view class='topLeft'>当前管家:</view>
                <view class='topCenter'>
                  <view>张纪中</view>
                  <view>130 2223 3298</view>
                </view>
              </view>
              <view class='stewardBottom'>
                <view class='bottomLeft'>新的管家:</view>
                <input class='bottomCenter'
                       type="text"
                       placeholder-style="color:#cccccd"
                       placeholder="请选择" />
                <image style="width:50rpx;height:50rpx"
                       src='https://uss.img.lezhulife.com/xcxicon/home-addrBook.png'></image>
              </view>
            </view>
          </view>
        </block>
      </Modal2>

      <cover-view class='bottomBar'>
        <cover-view class='normal'>
          <cover-view v-if="pageType==1"
                      @tap="openMask('管理房源')"
                      class='normalAdmin'>
            <cover-image style="width:40rpx;height:40rpx"
                         src='https://uss.img.lezhulife.com/xcxicon/adminHousing.png'></cover-image>
            <cover-view>编辑房源</cover-view>
          </cover-view>
          <cover-view v-if="pageType==0"
                      @tap="openMask('经纪人')"
                      class='normaluser'>
            <cover-image class="headImage"
                         :src="staff.head"
                         mode='aspectFill'> </cover-image>
            <cover-view class=""
                        style='display:inline-block;'>
              <cover-view class="hide_text"
                          style='font-size: 36rpx;text-align: left;width:170rpx'>
                {{staff.name}}
              </cover-view>
              <cover-view class="hide_text"
                          style='font-size: 22rpx;text-align: left;width:130rpx'>
                {{staff.organizationName}}
              </cover-view>
            </cover-view>
          </cover-view>
          <cover-view v-if="pageType==1"
                      @tap="openMask('上下架房源')"
                      class='reserve'>{{btnType==1?'下架房源':'上架房源'}}</cover-view>
          <cover-view v-if="pageType==0&&!openType"
                      style="display:flex;margin-left : 20rpx">
            <cover-view @tap="openMask('联系我')"
                        class='sign'>
              <cover-image src='https://uss.img.lezhulife.com/xcxicon/telephone01.png'
                           mode='aspectFill'
                           style='display:inline-block;width: 50rpx;height: 50rpx;margin:0 14rpx'></cover-image>
              <cover-view>联系我</cover-view>
            </cover-view>

            <cover-view @tap="openMask('带看反馈')"
                        class='reserve1'>带看反馈</cover-view>
          </cover-view>
          <cover-view v-if="pageType==0&&openType">
            <cover-view @tap="openMask('联系我')"
                        class='sign1'>
              <cover-image src='https://uss.img.lezhulife.com/xcxicon/telephone01.png'
                           mode='aspectFill'
                           style='display:inline-block;width: 50rpx;height: 50rpx;margin:0 14rpx 0 130rpx'></cover-image>
              <cover-view>联系我</cover-view>
            </cover-view>
          </cover-view>
          <!-- <cover-view @tap="openMask('带看反馈')" class='reserve'>带看反馈</cover-view>
                                        <cover-view @tap="openMask('带看反馈')" class='sign'>下定金</cover-view> -->
        </cover-view>
      </cover-view>
      <cover-image v-if="isApproval"
                   class='arrowDown'
                   style="width:50rpx;height:50rpx"
                   src='https://uss.img.lezhulife.com/xcxicon/arrow-down-gray.png'></cover-image>
      <view style="width:750rpx;height:140rpx;"></view>
    </view>
    <view v-else></view>
  </view>
</template>

<script>
import { mapState, createNamespacedHelpers, mapMutations } from "vuex";
const { mapMutations: contractMutation, mapState: contracrState } = createNamespacedHelpers('contract');
// import { Viewer } from 'photo-sphere-viewer'
//  console.log(Viewer)
// import 'photo-sphere-viewer/dist/photo-sphere-viewer.css'
import Modal1 from '../../../components/comm/modal1/modal1.vue';
import Modal2 from '../../../components/comm/modal2/modal2.vue';
import Delivery from './delivery.vue';
import Business from './business.vue';
import SurveryMap from './survey&map.vue';
export default {
  data () {
    return {
      flag: false,
      swiperList: [],
      previewList: [],
      currentSwiper: 1,
      isShowModal1: false,
      isSign: false,
      renderList: [],
      setList: [
        { text: '编辑房源', status: false },
        { text: '编辑房源介绍', status: false },
      ],
      adminList: [
        { text: '业主', status: false },
        { text: '租客', status: false },
        { text: '房间', status: false },
        { text: '收支记录', status: false }
      ],
      signList: [
        { text: '电子签约', path: 'https://uss.img.lezhulife.com/xcxicon/asgin.png' },
        { text: '录入历史租客', path: 'https://uss.img.lezhulife.com/xcxicon/enteyHistory.png' }
      ],
      isShowModal2: false,
      modal2Title: '',
      buttonList: [],
      isAuthCode: false,
      isModel1: false,
      isSteward: false,
      model1List: [],
      isApproval: false,
      tarBarList: ['核心卖点', "小区介绍", "周边配套", "交通出现"],
      tabIndex: 0,
      houseId: '',
      name: '',
      hosueDetails: [],
      property: [],
      dianTi: '',
      guapai: [],
      nianxian: '',
      yongtu: '',
      toChild: { location: {}, title: '', address: '' },
      Introduce: [],
      pageType: '',
      btnType: '',
      upShow: {},
      staff: {},
      hosueUrl: 'house/sale/info',
      openType: '',
      // viewer:'',
      // imgurl1:'https://img-blog.csdnimg.cn/20210324150402307.jpg?x-oss-process=image/watermark,type_ZmFuZ3poZW5naGVpdGk,shadow_10,text_aHR0cHM6Ly9ibG9nLmNzZG4ubmV0L3FxXzQyNzgzNjU0,size_16,color_FFFFFF,t_70'
    }
  },
  onLoad (options) {
    if (options.openType) {
      this.openType = options.openType
      this.$store.commit('setinit', true)
      this.hosueUrl = '/house/sale/share'
    }
    this.pageType = options.type
    let temp = JSON.parse(options.houseId)
    this.name = temp.name
    this.houseId = temp.id //这里是saleId 请求详情页面
    this.getDetails()
    wx.setNavigationBarTitle({
      title: this.name
    })
    uni.hideLoading()
  },
  created () {
    //数据刷新
    uni.$on('updateIntroduce', res => {
      if (res.type == 1) {
        this.flag = false
        this.getDetails()
      }
    })
  },
  mounted () {
    // console.log(this.viewer)
    //  this.viewer =uni.createSelectorQuery().select('.demo')
    // this.viewer = new Viewer({
    //   container: uni.createSelectorQuery().select('.demo'),
    //   panorama: this.imgurl1,
    //   size: {
    //     width: '100vw',
    //     height: '50vh',
    //   },
    // });
    // console.log(this.viewer)
  },
  onShow () {
    this.isShowModal1 = false;
    // wx.setNavigationBarColor({
    //   backgroundColor: '#ffffff',
    //   frontColor: '#000000',
    // })
  },
  computed: {

  },
  // mounted () {

  // },
  // ...contracrState({
  // 				step1:state=>state.step1
  //                 }),

  methods: {
    ...mapMutations(['setHouseNumber1', 'setHouseNumber', 'setupTempImageList', 'setDeliveryList', 'setshowImageList']),
    ...contractMutation(['setPageInfo', 'setStep1', 'setStep2']),
    //二手房详情
    async getDetails (cb) {
      uni.showLoading({
        title: '加载中'
      })
      try {
        let res = await this.request({
          url: this.hosueUrl,
          type: 'get',
          param: { saleId: this.houseId }
        })
        if (res[1].data.state == 200) {
          this.hosueDetails = res[1].data.body
          this.btnType = this.hosueDetails.houseSale.dr
          this.swiperList = [...this.hosueDetails.publicPics, ...this.hosueDetails.outPics, ...this.hosueDetails.floorPlanPics]
          //图片加水印
          this.previewList = JSON.parse(JSON.stringify(this.swiperList))
          this.swiperList.forEach((ele, i) => {
            this.swiperList[i] = ele + this.$imageMiddle
          })
          this.property = this.hosueDetails.houseSale.property.filter(ele => {
            return ele.type == 3 || ele.type == 5
          })
          this.dianTi = this.hosueDetails.houseSale.property.filter(ele => {
            return ele.type == 2
          })
          this.nianxian = this.hosueDetails.houseSale.property.filter(ele => {
            return ele.type == 4
          })
          this.yongtu = this.hosueDetails.houseSale.property.filter(ele => {
            return ele.type == 1
          })
          this.guapai = this.hosueDetails.houseSale.createTime.split(' ')
          this.Introduce[0] = this.hosueDetails.houseSale.property.filter(ele => {
            return ele.type == 20
          })
          this.Introduce[1] = this.hosueDetails.houseSale.property.filter(ele => {
            return ele.type == 21
          })
          this.Introduce[2] = this.hosueDetails.houseSale.property.filter(ele => {
            return ele.type == 22
          })
          this.Introduce[3] = this.hosueDetails.houseSale.property.filter(ele => {
            return ele.type == 23
          })
          this.Introduce[4] = this.hosueDetails.houseSale.property.filter(ele => {
            return ele.type == 6
          })
          //优化微信小程序地图 偏差
          this.toChild.location.lat = Number(this.hosueDetails.house.lat) + 0.006
          this.toChild.location.lng = Number(this.hosueDetails.house.lng) + 0.0065
          this.toChild.title = this.hosueDetails.bkXiaoqu.name
          this.toChild.address = this.hosueDetails.bkXiaoqu.addr
          this.staff = this.hosueDetails.staff
          uni.hideLoading()
          this.flag = true
          if (cb && typeof cb == 'function') {
            cb()
          }
        } else {
          uni.showToast({
            title: this.$throwStatusCode(res[1].data.state, '获取二手房详情'),
            icon: 'none'
          })
        }
      } catch (err) {
        console.log(err);
      }
    },
    //轮播图改变按钮
    swiperChange (e) {
      this.currentSwiper = e.detail.current + 1
    },
    seeImage (index) {
      console.log(index)
      if (index > 0) {
        let arr = []
        this.previewList.forEach((ele, i) => {
          arr[i] = ele + this.$imageLarge
        })
        uni.previewImage({
          current: this.currentSwiper - 1,
          urls: arr
        })
      } else {
        let item = this.previewList[0]
        console.log(item)
        //JSON.stringify(item),
        uni.navigateTo({
          url: '../../../subpackComm/pages/viewHousing/webview?addUrl=' + JSON.stringify(item),
          // url: '../../../subpackSource/pages/source/follow/addFollow'
        })
      }

    },
    openMask (text) {
      switch (text) {
        case '设置':
          this.renderList = this.adminList;
          this.isSign = false;
          this.isShowModal1 = true
          break;
        case '管理房源':
          this.renderList = this.setList;
          this.isSign = false;
          this.isShowModal1 = true
          break;
        case '带看反馈':
          let item = {}
          item.type = [this.hosueDetails.house.name, this.hosueDetails.houseUnit, this.hosueDetails.house.orientation, this.hosueDetails.bkXiaoqu.cityName, this.hosueDetails.bkXiaoqu.quyu, this.hosueDetails.bkXiaoqu.shangquan]
          item.id = this.hosueDetails.houseSale.id
          wx.navigateTo({
            url: '../../../subpackSource/pages/source/follow/addFollow?type1=sale&item=' + JSON.stringify(item),
          })
          break;
        case '签约':
          this.renderList = [];
          this.isSign = true;
          this.isShowModal1 = true
          break;
        case '上下架房源':
          this.upDown()
          break;
        case '联系我':
          this.callPhone()
          break
      }

    },
    //底部切换房源介绍
    curryIndex (index) {
      this.tabIndex = index
    },
    //分享
    onShareAppMessage (res) {
      let obj = {
        id: this.houseId,
        name: this.name
      }
      // console.log('id+++pid', item)
      return {
        title: this.name,
        // path: '/pages/group_detail/group_detail?id=' + this.id + '?pid=' + this.infoList.user.id,encodeURIComponent(JSON.stringify(item)),
        path: '/subpackComm/pages/viewHousing/viewHousing?openType=1&type=0&houseId=' + JSON.stringify(obj),
        success: (res) => {
          // 转发成功
          console.log("转发成功:" + JSON.stringify(res));
        },
        fail: function (res) {
          // 转发失败
          console.log("转发失败:" + JSON.stringify(res));
        }
      }
    },
    onShareTimeline () {
      let obj = {
        id: this.houseId,
        name: this.name
      }
      return {
        title: this.name,
        ppath: '/subpackComm/pages/viewHousing/viewHousing?openType=1&houseId=' + JSON.stringify(obj),
        success: (res) => {
          // 转发成功
          console.log("转发成功:" + JSON.stringify(res));
        },
        fail: function (res) {
          // 转发失败
          console.log("转发失败:" + JSON.stringify(res));
        }
      }
    },
    //遮罩选项点击回调模态框1
    clickModalCallBack (item) {
      let text = item.currentTarget.dataset.item.text;
      switch (text) {
        case '编辑房源介绍':
          let item = {}
          item.type = [this.hosueDetails.house.name, this.hosueDetails.houseUnit, this.hosueDetails.house.orientation, this.hosueDetails.house.areaSize, this.hosueDetails.houseSale.listPrice, this.hosueDetails.bkXiaoqu.cityName, this.hosueDetails.bkXiaoqu.quyu, this.hosueDetails.bkXiaoqu.shangquan]
          item.id = this.hosueDetails.house.id
          uni.navigateTo({
            url: '../../../subpackSource/pages/source/houseIntroduced?item=' + JSON.stringify(item)
          })
          break;
        case '带看反馈':
          uni.navigateTo({
            url: '../../../subpackSource/pages/source/feedback'
          })
          break;
        case '关闭年付':
          this.isModel1 = true;
          this.isSteward = false;
          this.modal2Title = '关闭年付';
          this.buttonList = ['确定'];
          this.model1List = ['该房源已与租客签署月付服务，待租赁合同期结束后才能申请关闭房东年付。']
          this.isAuthCode = false;
          this.isShowModal1 = false;
          this.isShowModal2 = true
          break;
        case '删除':
          this.isModel1 = true;
          this.isSteward = false;
          this.modal2Title = '删除房源';
          this.buttonList = ['取消', '确定删除'];
          this.model1List = ['请确认房源无租客，无收支记录;', '该房源无业主签约;', '删除后不可恢复。']
          this.isAuthCode = false;
          this.isShowModal1 = false;
          this.isShowModal2 = true
          break;
        case '编辑房源':
          this.stepInfo()
          break;
        case '租客':
          uni.navigateTo({
            url: '../../../subpackAdminHousing/pages/adminHousing/adminHousing?current=1',
          })
          break;
        case '房间':
          uni.navigateTo({
            url: '../../../subpackAdminHousing/pages/adminHousing/adminHousing?current=2',
          })
          break;
        case '收支记录':
          uni.navigateTo({
            url: '../../../subpackAdminHousing/pages/adminHousing/adminHousing?current=3',
          })
          break;
        case '电子签约':

          break;
        case '录入历史租客':

          break;
      }

    },
    //遮罩点击事件模态框1
    clickMask () {
      this.isShowModal1 = false
    },
    //模态框2遮罩点击事件
    clickModal2Mask () {
      this.isShowModal1 = false;
      this.isShowModal2 = false;
      this.isAuthCode = false;
      this.isModel1 = false;
      this.isSteward = false;
    },
    //模态框2选项点击事件
    clickModal2Item (item) {
      if (item == '确定' && this.buttonList.length == 1 && this.buttonList[0] == '确定' && this.modal2Title == '关闭年付') {
        this.isAuthCode = true;
        this.isShowModal1 = false;
        this.isModel1 = false;
        this.isShowModal2 = true;
        this.isSteward = false;
        this.buttonList = ['取消', '确认关闭'];
      }
    },
    //驳回按钮
    openApproval () {
      this.isApproval = true;
    },
    //驳回按钮弹框的修改和拒绝按钮
    approvalCallBack (item) {
      this.isApproval = false;
    },
    loge () {
      switch (this.btnType) {
        case 1:
          uni.showToast({
            title: '上架房源成功',
            icon: 'success',
            duration: 800
          })
          break;
        case 2:
          uni.showToast({
            title: '下架房源成功',
            icon: 'success',
            duration: 800
          })
          break;
      }
    },
    //二手房上下架
    async upDown () {
      try {
        let res = await this.request({
          url: 'change/house/state',
          type: 'get',
          param: {
            houseId: this.hosueDetails.house.id
          }
        })
        if (res[1].data.state == 200) {
          this.getDetails(this.loge)
        }
      } catch (err) {
        console.log(err)
      }
    },
    //拨打电话
    callPhone () {
      uni.showModal({
        content: '确定拨打' + this.staff.phoneNo,
        success: (res) => {
          if (res.confirm) {
            uni.makePhoneCall({
              phoneNumber: this.staff.phoneNo
            });
          } else if (res.cancel) {
          }
        }
      })

    },
    //编辑二手房数据回显
    async stepInfo () {
      try {
        let res = await this.request({
          url: 'house/update/info',
          type: 'get',
          param: { houseId: this.hosueDetails.house.id }
        })
        if (res[1].data.state == 200) {
          this.upShow = res[1].data.body
          //添加详情 1
          const { house } = this.upShow || {};
          const { houseSale } = this.upShow || {};
          const { delivery } = this.upShow || {};
          const { propertyList } = this.upShow || {};
          const { cityName, name, xiaoquId, areaSize, houseType, orientation, renovation, building, channel, publicPics, floorPlanPics, outPics } = house || {}
          const { listPrice, commission, visible } = houseSale || {}
          let temp = building.split('-')
          let arr = [cityName, {
            isInput: false,
            text: '小区名称',
            name,
            xiaoId: xiaoquId
          }, areaSize, houseType, orientation, renovation, temp[0] + temp[1].slice(temp[1].indexOf('层') + 1) + '室', visible]
          this.setStep1(arr)
          //添加详情 2

          //交割单存储
          delivery.forEach(ele => {
            ele.forEach(i => {
              i.status = true
              i.isClick = false
            })
          })
          this.setDeliveryList(delivery)
          let picsNum = Number(publicPics.length) + Number(floorPlanPics.length) + Number(outPics.length)
          let arr1 = [listPrice, commission, propertyList, '请选择', channel, [[publicPics], [floorPlanPics], [outPics], [picsNum]], delivery]
          this.setStep2(arr1)
          //门牌号
          const { buildingNum, unitNum, floorNum, totalFloorNum, houseNum } = this.upShow.house || {}
          let houseNumber = {
            bound: buildingNum,
            unit: unitNum,
            floor: floorNum + '层-共' + totalFloorNum + '层',
            room: houseNum
          }
          this.setHouseNumber1(houseNumber)
          this.setHouseNumber(houseNumber)
          //存储照片
          let image = [publicPics, floorPlanPics, outPics, [picsNum]]
          //上传临时储仓
          this.setupTempImageList(image)
          //图片添加页面展示图片
          this.setshowImageList(image)
          //交割单存储
          this.upShow.delivery.forEach(ele => {
            ele.forEach(i => {
              i.status = true
              i.isClick = false
            })
          })
          this.setDeliveryList(this.upShow.delivery)
          //页面配置
          this.setPageInfo({ type: '二手房源', title: ['修改二手房源', '修改二手房源'], processList: [{ text: '房屋概况', status: true }, { text: '设置售价', status: false }, { text: '完成', status: false }], len: [0, 50] })
          let obj = {}
          obj.id = this.hosueDetails.house.id
          obj.saleId = this.hosueDetails.houseSale.id
          obj.name = this.hosueDetails.house.name
          uni.navigateTo({
            url: '../../../pages/addHouseSource/stephouse1?type=1&houseType=' + JSON.stringify(obj),
          })
        } else {
          uni.hideLoading()
          uni.showToast({
            title: this.$throwStatusCode(res[1].data.state, '获取回显数据'),
            icon: 'none'
          })
        }
      } catch (e) {
        console.log(e)
      }
    }
  },
  components: {
    Modal1,
    Modal2,
    Delivery,
    Business,
    SurveryMap
  }
}

</script>

<style lang='scss' scoped>
page {
  height: 100vh;
  position: fixed;
  top: 0px;
  left: 0px;
  width: 100%;
  overflow: hidden;
}
.viewHousing {
  overflow: hidden;
  background-color: white;
  .swiperBox {
    position: relative;
    .swiper {
      width: 750rpx;
      height: 420rpx;
      image {
        width: 100%;
        height: 100%;
      }
    }
    .swiperTip {
      position: absolute;
      width: 60rpx;
      height: 30rpx;
      background-color: rgba(0, 0, 0, 0.5);
      bottom: 30rpx;
      left: 30rpx;
      border-radius: 15rpx;
      color: white;
      font-size: 20rpx;
      text-align: center;
      line-height: 30rpx;
    }
    .reason {
      position: absolute;
      left: 0;
      top: 0;
      background-color: #ea6b66;
      color: white;
      display: flex;
      font-size: 30rpx;
      align-items: center;
      box-sizing: border-box;
      padding: 20rpx 50rpx;
      .cuIcon-close {
        font-size: 46rpx;
        margin-right: 30rpx;
        font-weight: 800;
      }
    }
  }
  // .demo{
  //   width: 100vw;
  //   height:430rpx;
  //   background: #00a680;
  // }
  .houseContainer {
    display: flex;
    flex-direction: column;
    // height: calc(100vh - 420rpx);
    .houseInfo {
      padding-top: 30rpx;
      margin: 0 auto;
      width: 690rpx;
      min-height: 186rpx;
      display: flex;
      position: relative;
      button::after {
        border: none;
      }
      button {
        background-color: transparent;
        padding-left: 0;
        padding-right: 0;
        line-height: inherit;
      }
      button {
        border-radius: 0;
      }
      .infoLeft {
        max-width: 600rpx;
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
        .right-name {
          margin-bottom: 10rpx;
          font-size: 34rpx;
          font-weight: 800;
        }
        .segment {
          margin: 20rpx 0 0 0rpx;
          display: flex;
          .segment_item {
            color: #00a680;
            font-size: 24rpx;
            min-width: 80rpx;
            height: 40rpx;
            padding: 0 10rpx;
            border-radius: 6rpx;
            margin-right: 20rpx;
            line-height: 40rpx;
            text-align: center;
            background-color: #eeeeee;
          }
        }
        .right-addrs {
          color: grey;
          font-size: 28rpx;
        }
      }
      .infoRight {
        display: flex;
        flex-wrap: wrap;
        margin-top: 4rpx;
        margin-right: 20rpx;
        view {
          width: 80rpx;
          height: 40rpx;
          text-align: center;
          line-height: 40rpx;
          font-size: 24rpx;
          margin-left: 20rpx;
          border-radius: 6rpx;
        }
        view:nth-child(1) {
          background-color: #dae8fc;
          color: #7173fe;
        }
        view:nth-child(2) {
          background-color: #ffe3c7;
          color: #ff962c;
        }
      }
      .infoShare {
        position: absolute;
        right: 0rpx;
        bottom: 70rpx;
        text-align: center;
        color: #6b6b6b;
        font-size: 30rpx;
      }
    }
    .date_time {
      width: 750rpx;
      margin: 30rpx 30rpx 0rpx 30rpx;
    }
    .house_layout {
      display: flex;
      justify-content: space-between;
      width: 690rpx;
      margin: 30rpx auto 0;
      border-top: solid calc(1px / 2.5) #d9d9d9;
      border-bottom: solid calc(1px / 2.5) #d9d9d9;
      // height: 270rpx;
      font-size: 22rpx;
      flex-wrap: wrap;

      .layout_item {
        margin-top: 25rpx;
        // width: 33%;
        height: 110rpx;
        text-align: center;
        view:nth-child(2) {
          color: grey;
        }
      }

      .layout_item:nth-child(4) {
        padding-right: 117rpx;
      }
      .layout_item:nth-child(6) {
        padding-left: 115rpx;
      }
      .layout_color {
        margin-bottom: 10rpx;
        font-weight: 600;
        color: red;
        font-size: 32rpx;
      }
      .layout_weight {
        font-size: 32rpx;
        font-weight: 600;
        margin-bottom: 10rpx;
      }
    }
    .base_info {
      width: 750rpx;
      padding: 20rpx 30rpx 60rpx 40rpx;
    }
    .info_box {
      width: 750rpx;
      margin-top: rpx;
      display: flex;
      flex-wrap: wrap;
      .info_item {
        width: 50%;
        text-align: cener;
        margin-top: 30rpx;
        span {
          color: gray;
        }
      }
    }

    .houseConfig {
      width: 690rpx;
      margin: 30rpx auto;
      display: grid;
      height: 600rpx;
      grid-template-columns: 30% 40% 30%;
      grid-template-rows: repeat(3, 33.3%);
      position: relative;
      border-top: solid calc(1px / 2) #d9d9d9;
      border-bottom: solid calc(1px / 2) #d9d9d9;
      .item {
        padding-top: 30rpx;
        padding-left: 30rpx;
        view:nth-child(1) {
          font-size: 28rpx;
        }
        view:nth-child(2) {
          font-size: 34rpx;
          color: #ea6e69;
          font-weight: 600;
          padding-top: 10rpx;
          text {
            font-size: 26rpx;
          }
        }
        view:nth-child(3) {
          font-size: 28rpx;
        }
      }
      .edge {
        padding-left: 0rpx;
      }
      .center {
        view:nth-child(2) {
          color: #333333;
        }
      }
      .border {
        border-left: solid calc(1px / 2) #d9d9d9;
        border-right: solid calc(1px / 2) #d9d9d9;
      }
    }
  }
  .introBox {
    width: 750rpx;
    /* height: 200rpx; */
    // border-top: solid 16rpx #f5f5f5;
    .tabBar {
      display: flex;
      margin-left: 30rpx;
      .tabBar_item {
        position: relative;
        width: 150rpx;
        height: 40rpx;
        .border_item {
          position: absolute;
          left: 35rpx;
          bottom: -15rpx;
          width: 40rpx;
          height: 6rpx;
        }
      }
    }
    .tabBar_centent {
      /* height: 200rpx; */
      height: 170rpx;
      max-height: 120rpx;
      margin: 20rpx 30rpx;
      padding-bottom: 80rpx;
      border-bottom: solid 4rpx #f5f5f5;
    }
  }
  .set {
    display: flex;
    width: 750rpx;
    border-bottom: solid 4rpx #f5f5f5;
    margin-top: 10rpx;
    .frist {
      width: 210rpx;
      margin: 0 20rpx;
      height: 110rpx;
      text-align: center;
      image {
        width: 50rpx;
        height: 50rpx;
      }
    }
    .second {
      width: 210rpx;
      margin: 0 20rpx;
      height: 100rpx;
      background-color: #dd944b;
      border-radius: 10rpx;
      color: #ffffff;
      text-align: center;
      line-height: 100rpx;
    }
  }
  .steward {
    .stewardBox {
      font-size: 30rpx;
      font-weight: 600;
      .stewardTop {
        box-sizing: border-box;
        display: flex;
        align-items: center;
        border-bottom: solid 1rpx #cccc;
        padding-bottom: 30rpx;
        margin-top: 20rpx;
        .topLeft {
          padding-left: 30rpx;
        }
        .topCenter {
          padding-left: 20rpx;
        }
      }
      .stewardBottom {
        display: flex;
        align-items: center;
        padding: 30rpx 0rpx 30rpx 0rpx;
        .bottomLeft {
          padding-left: 30rpx;
        }
        .bottomCenter {
          width: 370rpx;
          padding-left: 20rpx;
          font-size: 30rpx;
        }
      }
    }
  }
  .bottomBar {
    width: 750rpx;
    height: 140rpx;
    background-color: white;
    position: fixed;
    left: 0px;
    bottom: 0rpx;
    display: flex;
    align-items: center;
    z-index: 0;
    .authBox {
      display: flex;
      justify-content: space-between;
      width: 600rpx;
      margin: 0 auto;
      .authBtnLeft {
        width: 270rpx;
        height: 100rpx;
        background-color: #ff9933;
        border-radius: 10rpx;
        font-size: 34rpx;
        color: white;
        display: flex;
        justify-content: center;
        align-items: center;
        .leftText {
          padding-right: 20rpx;
        }
        .cuIcon-unfold {
          font-weight: 800;
          margin-top: 6rpx;
        }
      }
      .authBtnRight {
        width: 270rpx;
        height: 100rpx;
        background-color: #00a680;
        border-radius: 10rpx;
        color: white;
        font-size: 34rpx;
        color: white;
        display: flex;
        justify-content: center;
        align-items: center;
      }
    }
    .normal {
      width: 100%;
      height: 100%;
      display: flex;
      /*  justify-content: space-around; */
      align-items: center;
      .headImage {
        display: inline-block;
        width: 80rpx;
        height: 80rpx;
        border-radius: 50%;
        margin-right: 20rpx;
      }
      .normalSet {
        display: flex;
        flex-direction: column;
        align-items: center;
      }
      .normalAdmin {
        width: 230rpx;
        margin: 0 20rpx;
        display: flex;
        flex-direction: column;
        align-items: center;
      }
      .normaluser {
        width: 286rpx;
        margin: 0 0 0 20rpx;
        .hide_text {
          white-space: nowrap; //不换行
          overflow: hidden; //超出隐藏
          text-overflow: ellipsis; //变成...
        }
      }
      .reserve {
        width: 430rpx;
        height: 80rpx;
        margin: 0 20rpx;
        background-color: #ffb570;
        border-radius: 10rpx;
        text-align: center;
        line-height: 80rpx;
        color: white;
        font-size: 28rpx;
      }
      .reserve1 {
        width: 200rpx;
        height: 80rpx;
        margin: 0 20rpx;
        background-color: #ffb570;
        border-radius: 10rpx;
        text-align: center;
        line-height: 80rpx;
        color: white;
        font-size: 28rpx;
      }
      .sign {
        display: flex;
        align-items: center;
        width: 210rpx;
        height: 80rpx;
        margin: 0 20rpx;
        background-color: #00a680;
        border-radius: 10rpx;
        text-align: center;
        line-height: 80rpx;
        color: white;
        font-size: 28rpx;
      }
      .sign1 {
        display: flex;
        align-items: center;
        width: 429rpx;
        height: 80rpx;
        margin: 0 20rpx;
        background-color: #00a680;
        border-radius: 10rpx;
        text-align: center;
        line-height: 80rpx;
        color: white;
        font-size: 30rpx;
      }
    }
    .editBox {
      background-color: #ff9933;
      width: 670rpx;
      height: 100rpx;
      margin: 0 auto;
      font-size: 34rpx;
      border-radius: 10rpx;
      display: flex;
      justify-content: center;
      align-items: center;
      color: white;
    }
  }
  .hideBox {
    position: fixed;
    width: 400rpx;
    height: 340rpx;
    background-color: #888888;
    bottom: 160rpx;
    border-radius: 30rpx;
    overflow: hidden;
    left: 70rpx;
    animation: fade 0.3s ease-in-out;
    .cell {
      width: 100%;
      height: 3rpx;
      background-color: #cccccc;
    }
    .hideItem {
      display: flex;
      width: 100%;
      height: 50%;
      align-items: center;
      box-sizing: border-box;
      padding-left: 30rpx;
      .itemText {
        padding-left: 40rpx;
        font-size: 34rpx;
        color: white;
        font-weight: 600;
      }
    }
  }
  .arrowDown {
    position: fixed;
    bottom: 120rpx;
    left: 120rpx;
    animation: fade 0.3s ease-in-out;
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
