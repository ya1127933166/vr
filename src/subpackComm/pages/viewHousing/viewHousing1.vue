<template  >
  <view>
    <view class='viewHousing'
          @tap="isApproval=false"
          v-if="flagType">
      <view class='swiperBox'>
        <swiper @change="swiperChange"
                circular="true"
                class="swiper"
                :indicator-dots="indicatorDots"
                :autoplay="true">
          <swiper-item v-for="(item,index) in swiperList"
                       :key="index"
                       style="width:750rpx;height:500rpx">
            <image @tap="seeImage"
                   mode="aspectFill"
                   :src='item'></image>
          </swiper-item>
        </swiper>
        <view class='swiperTip'>{{currentSwiper}}/{{swiperList.length}}</view>

      </view>
      <view class='houseContainer'>
        <view class='houseTop'>
          <view class="price">
            <span>{{hosueDetails.houseRent.listPrice}}</span><text>元/月</text><text> ({{hosueDetails.houseRent.payType}})</text>
          </view>
          <!-- <view class="price" v-else>
                        <span>{{totalShare.listPrice}}</span><text>元/月</text><text> ({{totalShare.houseRent.payType}})</text>
                    </view> -->
          <button open-type="share"
                  class="infoShare"
                  style='font-size: 24rpx;'
                  v-if="pageType==0">
            <image style="width:40rpx;height:40rpx;"
                   src="https://uss.img.lezhulife.com/xcxicon/share.png"></image>
            <view>分享</view>
          </button>
        </view>
        <view class="houseInfo">
          <view class='infoLeft'>
            <view class='right-name'>{{hosueDetails.rentalType}}·{{hosueDetails.name}} {{hosueDetails.houseUnit}} {{hosueType}}</view>
            <view class='right-addrs'>{{hosueDetails.cityName}}·{{hosueDetails.quyu}}·{{hosueDetails.shangquan}}</view>
          </view>

        </view>
        <view v-if="pageType==1"
              class="date_time"
              style='margin-top: 30rpx;margin-bottom: 50rpx;'>
          <view class="">
            发布时间：{{hosueDetails.houseRent.createTime}}
          </view>
          <view class="">
            更新时间：{{hosueDetails.houseRent.updateTime}}
          </view>
        </view>
        <view v-if="hosueDetails.rentalType=='合租'"
              scroll-x="true"
              class="scroll_X">
          <view class="scroll_item"
                v-for="(item,index) in scrollList"
                :key='index'
                :style="index ==houseIndex?'color:#00A680;font-weight:600':''"
                @tap='getHouse(index,item)'>
            {{item.roomNo}}房间
            <view class="border_item1"
                  :style="index==houseIndex?'background-color:#00A680;':''">
            </view>
          </view>
        </view>

        <view class="house_layout">
          <view class="layout_item">
            <view class="layout_color">
              {{hosueDetails.houseRent.areaSize}}m²
            </view>
            <!-- <view class="layout_color" v-else>
                            {{totalShare.houseRent.areaSize}}
                        </view> -->
            <view class="">
              面积
            </view>
          </view>
          <view class="layout_item">
            <view class="layout_color">
              {{hosueDetails.housefool}}
            </view>
            <view class="">
              楼层
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
              {{hosueDetails.orientation}}
            </view>
            <view class="">
              朝向
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

      </view>
      <view class="tagTitle">
        <view class="tagItem"
              v-for="(item,index) in tagTitle"
              :key='index'>
          {{item}}
        </view>
      </view>
      <!-- <view class="tagTitle" v-else>
                <view class="tagItem" v-for="(item,index) in totalShare.property" :key='index'>
                    {{item}}
                </view>
            </view> -->

      <view class="base_info"
            style='border-top: solid 16rpx #f5f5f5;margin-bottom: 60rpx;'
            v-if="hosueDetails.delivery&&hosueDetails.delivery.length>0">
        <view style=' font-size: 32rpx;font-weight: 600;margin-top: 20rpx;'>房屋配置</view>
        <view class="info_box">
          <view class="info_item"
                v-for="(item,index) in hosueDetails.delivery"
                :key='index'>
            ✔{{item}}
          </view>
        </view>
      </view>
      <view class="base_info"
            style='border-top: solid 16rpx #f5f5f5;margin-bottom: 60rpx;'>
        <view style=' font-size: 32rpx;font-weight: 600;margin-top: 20rpx;'>费用详情</view>
        <view class="info_box  ">
          <view class="info_item center">
            支付方式
          </view>
          <view class="info_item center">
            <view class="">
              租金
            </view>
            <view class=""
                  style='font-size: 24rpx;color: grey;'>
              (元/月)
            </view>
          </view>
          <view class="info_item center">
            <view class="">
              服务费
            </view>
            <view class=""
                  style='font-size: 24rpx;color:grey;'>
              (元)
            </view>
          </view>
          <view class="info_item center">
            <view class="">
              中介费
            </view>
            <view class=""
                  style='font-size: 24rpx;color: grey;'>
              (元)
            </view>
          </view>
          <view class="info_item center">
            {{hosueDetails.houseRent.payType}}
          </view>
          <view class="info_item center"
                style='color: #ff0606;'>
            {{hosueDetails.houseRent.listPrice}}
          </view>
          <view class="info_item center">
            0
          </view>
          <view class="info_item center">
            需咨询
          </view>
        </view>
      </view>
      <!--  <Delivery></Delivery>
            <Business></Business> -->
      <SurveryMap :toChild="toChild"></SurveryMap>
      <view class="introBox">
        <!-- <view style=' font-size: 32rpx;font-weight: 600;margin: 40rpx 0 20rpx 30rpx;'>
                    房源介绍
                </view>
                <view class="tabBar">
                    <view class="tabBar_item"  v-for="(item,index) in tarBarList" :key='index' @tap='curryIndex(index)' :style="index ==tabIndex?'color:#00A680;':''">
                        {{item}}
                        <view class="border_item" :style="index ==tabIndex?'background-color:#00A680;':''">
                        </view>
                    </view>

                </view>
                <view class="tabBar_centent">
                    楼层好。安静楼层好。安静楼层好。安静楼层好。安静楼层好。安静楼层好。安静
                </view> -->
        <!-- <view class="set">
                <view class="frist"  @tap="openMask('设置')">
                    <image src="../../../static/marker/marker-bus.png" mode='aspectFill'  >		</image>
                    <view class="">
                        编辑房源
                    </view>
                </view>
                <view class="second">
                    带看反馈
                </view>
                <view class="second" style='background-color:#00A680'>
                    下定金
                </view>
            </view> -->
        <!-- 	<view class="set" >
                <view class="frist">
                    <image src="../../../static/marker/marker-bus.png" mode='aspectFill' style='display:inline-block;width: 80rpx;
                    height: 80rpx;'>	</image>
                    <view class="" style='display:inline-block;'>
                        <view class="" style='font-size: 36rpx;'>
                            张口
                        </view>
                        <view class="" style='font-size: 22rpx;'>
                            德祐
                        </view>
                    </view>
                </view>
                <view class="second">
                    带看反馈
                </view>
                <view class="second" style='background-color:#00A680'>
                    下定金
                </view>
            </view> -->
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
                         mode='aspectFill'
                         style='display:inline-block;width: 80rpx;height: 80rpx;'> </cover-image>
            <cover-view class=""
                        style='display:inline-block;'
                        @tap='callPhone'>
              <cover-view class="hide_text"
                          style='font-size: 36rpx;text-align: left;width: 170rpx;'>
                {{staff.name}}
              </cover-view>
              <cover-view class="hide_text"
                          style='font-size: 22rpx;text-align: left;'>
                {{staff.organizationName}}
              </cover-view>
            </cover-view>
          </cover-view>
          <cover-view v-if="pageType==1"
                      @tap="openMask('上下架房源')"
                      class='reserve'>{{btnType==1?'下架房源':'上架房源'}}</cover-view>
          <cover-view v-if="pageType==0&&!openType"
                      style="display:flex;">
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
        </cover-view>
      </cover-view>
      <cover-image v-if="isApproval"
                   class='arrowDown'
                   style="width:50rpx;height:50rpx"
                   src='https://uss.img.lezhulife.com/xcxicon/arrow-down-gray.png'></cover-image>
      <view style="width:750rpx;height:140rpx;"></view>
    </view>
  </view>
</template>

<script>
import { mapState, createNamespacedHelpers, mapMutations } from "vuex";
const { mapMutations: contractMutation, mapState: contracrState } = createNamespacedHelpers('contract');
import Modal1 from '../../../components/comm/modal1/modal1.vue';
import Modal2 from '../../../components/comm/modal2/modal2.vue';
import Delivery from './delivery.vue';
import Business from './business.vue';
import SurveryMap from './survey&map.vue';
export default {
  data () {
    return {
      flagType: false,
      swiperList: [
        'https://uss.img.lezhulife.com/xcximages/house-none.jpg',
        'https://uss.img.lezhulife.com/xcximages/video-none.jpg',
        'https://uss.img.lezhulife.com/xcximages/house-none.jpg',
        'https://uss.img.lezhulife.com/xcximages/video-none.jpg',
        'https://uss.img.lezhulife.com/xcximages/house-none.jpg',
        'https://uss.img.lezhulife.com/xcximages/video-none.jpg',
      ],
      previewList: [],
      currentSwiper: 1,
      isShowModal1: false,
      isSign: false,
      renderList: [],
      setList: [
        { text: '编辑房源', status: false },
        // {text:'编辑房源介绍',status:false},
        // {text:'下降房源',status:false},
      ],
      scrollList: [],
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
      segmentList: ['满五', '唯一'],
      tarBarList: ['核心卖点', "小区介绍", "周边配套", "交通出现"],
      tagTitle: [],
      houseList: ['冰箱', '洗衣机', '热水器', '宽带', '沙发', '双人床', '燃气灶', '电视'],
      tabIndex: 0,
      houseIndex: 0,
      rentId: '',
      name: '',
      hosueDetails: [],
      rentHouse: [],
      totalShare: {},
      toChild: { location: {}, title: '', address: '' },
      pageType: '',
      btnType: 1,
      roomType: '',
      staff: '',
      hosueUrl: 'house/rent/info',
      openType: ''



    }
  },
  onLoad (options) {
    if (options.openType) {
      this.openType = options.openType
      this.$store.commit('setinit', true)
      this.hosueUrl = '/house/rent/share'
    }
    this.pageType = options.type
    let temp = JSON.parse(options.houseId)
    this.rentId = temp.id
    this.name = temp.name
    this.getDetails()
    wx.setNavigationBarTitle({
      title: temp.name
    })
    uni.hideLoading()
  },
  onShow () {
    this.isShowModal1 = false;
    // wx.setNavigationBarColor({
    //   backgroundColor: '#ffffff',
    //   frontColor: '#000000',
    // })
  },

  mounted () {

  },
  computed: {
    flag () {
      return this.hosueDetails.rentalType == '整租' ? true : false
    },
    hosueType () {
      return this.hosueDetails.rentalType == '整租' ? '' : this.roomType
    }
  },
  methods: {
    ...mapMutations(['setHouseNumber1', 'setHouseNumber', 'setupTempImageList', 'setshowImageList', 'setDeliveryList']),
    ...contractMutation(['setPageInfo', 'setStepHouse1', 'setStepHouse2', 'setAddHouse']),
    //轮播图改变按钮
    swiperChange (e) {
      this.currentSwiper = e.detail.current + 1
    },
    seeImage () {
      let arr = []
      this.previewList.forEach((ele, i) => {
        arr[i] = ele + this.$imageLarge
      })
      uni.previewImage({
        current: this.currentSwiper - 1,
        urls: arr
      })
    },
    //开启遮罩模态框1
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
        case '上下架房源':
          this.upDown()
          break;
        case '签约':
          this.renderList = [];
          this.isSign = true;
          this.isShowModal1 = true
          break;
        case '联系我':
          this.callPhone()
          break
        case '带看反馈':
          let item = {}
          item.type = [this.hosueDetails.name, this.hosueDetails.houseUnit, this.hosueDetails.orientation, this.hosueDetails.cityName, this.hosueDetails.quyu, this.hosueDetails.shangquan]
          item.id = this.hosueDetails.houseRent.rentId
          wx.navigateTo({
            url: '../../../subpackSource/pages/source/follow/addFollow?type1=rent&item=' + JSON.stringify(item),
          })
          break;
      }

    },
    //切换房间
    getHouse (index, item) {
      this.rentId = item.rentId
      this.getDetails()
      this.houseIndex = index
      this.totalShare = this.rentHouse[index]
    },
    //切花底部tabBar
    curryIndex (index) {
      this.tabIndex = index
    },
    //分享
    onShareAppMessage (res) {
      let obj = {
        id: this.rentId,
        name: this.name
      }
      return {
        title: this.name,
        path: '/subpackComm/pages/viewHousing/viewHousing1?openType=1&type=0&houseId=' + JSON.stringify(obj),
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
        case '编辑房源':
          this.stepInfo()
          break;
        case '整租转合租':
          this.isModel1 = true;
          this.isSteward = false;
          this.modal2Title = '合租转整租';
          this.buttonList = ['取消', '继续转整租'];
          this.model1List = ['请确认合租的各个房间无租客合同;', '转为整租后，合租房间将不可用。']
          this.isAuthCode = false;
          this.isShowModal1 = false;
          this.isShowModal2 = true
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
        case '业主':
          uni.navigateTo({
            url: '../../../subpackAdminHousing/pages/adminHousing/adminHousing?current=0',
          })
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
    //上下架回调
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
    //租房上下架
    async upDown () {
      try {
        let res = await this.request({
          url: 'change/house/state',
          type: 'get',
          param: {
            houseId: this.hosueDetails.houseId,
            rentId: this.hosueDetails.houseRent.rentId
          }
        })
        if (res[1].data.state == 200) {
          this.getDetails(this.loge)


        }
      } catch (err) {
      }
    },

    //拨打电话
    callPhone () {
      uni.showModal({
        content: '确定拨打' + this.staff.phoneNo,
        success: (res) => {
          if (res.confirm) {
            uni.makePhoneCall({
              phoneNumber: this.staff.phoneNo //仅为示例
            });
          } else if (res.cancel) {
          }
        }
      })
    },
    //租房详情
    async getDetails (cb) {
      uni.showLoading({
        title: '加载中'
      })
      try {
        let res = await this.request({
          url: this.hosueUrl,
          type: 'get',
          param: { rentId: this.rentId }

        })
        if (res[1].data.state == 200) {
          this.hosueDetails = res[1].data.body.thisRoom
          this.btnType = this.hosueDetails.houseRent.dr
          this.swiperList = [...this.hosueDetails.publicPics, ...this.hosueDetails.floorPlanPics, ...this.hosueDetails.outPics, ...this.hosueDetails.houseRent.roomPics]
          //图片加水印
          this.previewList = JSON.parse(JSON.stringify(this.swiperList))
          this.swiperList.forEach((ele, i) => {
            this.swiperList[i] = ele + this.$imageMiddle
          })
          this.toChild.location.lat = Number(this.hosueDetails.lat) + 0.006
          this.toChild.location.lng = Number(this.hosueDetails.lng) + 0.0065
          this.toChild.title = this.hosueDetails.name
          this.toChild.address = this.hosueDetails.name
          this.tagTitle = this.hosueDetails.property
          this.roomType = this.hosueDetails.houseRent.roomType
          this.staff = this.hosueDetails.staff
          if (!this.flag) {
            this.scrollList = res[1].data.body.otherRoom
            this.scrollList.forEach((ele, i) => {
              if (this.hosueDetails.houseRent.roomNo == ele.roomNo) {
                this.houseIndex = i
              }
            })
          }
          this.flagType = true
          uni.hideLoading()
          if (cb && typeof cb == 'function') {
            cb()
          }
        } else {
          uni.hideLoading()
          uni.showToast({
            title: this.$throwStatusCode(res[1].data.state, '获取租房详情'),
            icon: 'none'
          })
        }
      } catch (err) {
        console.log(err);
      }
      // cb()
    },
    //编辑租房房数据回显
    async stepInfo () {
      try {
        let res = await this.request({
          url: 'house/update/info',
          type: 'get',
          param: { houseId: this.hosueDetails.houseId }
        })
        if (res[1].data.state == 200) {
          uni.hideLoading()
          this.upShow = res[1].data.body
          // 添加详情 1
          const { house } = this.upShow || {};
          const { listPrice, pledge, pay, property, roomPics } = this.upShow.houseRent || {};
          const { cityName, name, xiaoquId, areaSize, houseType, orientation, renovation, building, channel, publicPics, floorPlanPics, outPics } = house || {};
          //数据显示转换
          let temp = building.split('-')
          let arr = ['', cityName, {
            isInput: false,
            text: '小区名称',
            name: name,
            xiaoId: xiaoquId
          }, areaSize, houseType, orientation, renovation, temp[0] + temp[1].slice(temp[1].indexOf('层') + 1) + '室']
          this.setStepHouse1(arr)
          if (this.upShow.house.rentalType == '整租') {
            //添加详情 2
            let arr = []
            arr[0] = property[3]
            arr[1] = property[2]
            arr[2] = property[1]
            arr[3] = property[0]
            let picsNum = Number(publicPics.length) + Number(roomPics.length) + Number(outPics.length)
            let arr1 = [listPrice, pledge + '-' + pay, arr, channel, [publicPics, roomPics, outPics, [picsNum]]]
            // arr1[0] = this.upShow.houseRent.listPrice
            // arr1[1] = this.upShow.houseRent.pledge+'-'+this.upShow.houseRent.pay
            // arr1[2] = this.upShow.houseRent.property
            // arr1[3] = this.upShow.house.channel

            // arr1[4] = [this.upShow.house.publicPics,this.upShow.house.floorPlanPics,this.upShow.house.outPics,[picsNum]]
            this.setupTempImageList(arr1[4])
            this.setshowImageList(arr1[4])
            arr1[5] = this.upShow.delivery
            arr1[5].forEach(ele => {
              ele.forEach(i => {
                i.status = true
                i.isClick = false
              })
            })
            this.setDeliveryList(arr1[5])
            this.setStepHouse2(arr1)
          } else if (this.upShow.house.rentalType == '合租') {
            let arr1 = []
            arr1[0] = ''
            let picsNum = Number(this.upShow.house.publicPics.length)
            arr1[1] = [this.upShow.house.publicPics, [], [], [picsNum]]
            this.setupTempImageList(arr1[1])
            this.setshowImageList(arr1[1])
            arr1[2] = this.upShow.delivery
            arr1[2].forEach(ele => {
              ele.forEach(i => {
                i.status = true
                i.isClick = false
              })
            })
            this.setDeliveryList(arr1[2])
            arr1[3] = this.upShow.house.channel
            this.setStepHouse2(arr1)
            //合租房间数据
            let temp = []
            // let a = Array.from(this.upShow.houseRent)
            this.upShow.houseRent.forEach((v, i) => {
              temp[i] = []
              temp[i][0] = { val: v.roomType }
              temp[i][1] = { val: v.areaSize }
              temp[i][2] = { val: v.listPrice }
              temp[i][3] = { val: v.pledge + '-' + v.pay }
              let image = []
              v.roomPics.forEach((ele, i) => {
                let num = ele.indexOf('/houses')
                image[i] = ele.slice(num)
              })
              temp[i][4] = { val: '共' + v.roomPics.length + '张', pice: image, show: v.roomPics }
              temp[i][5] = { val: v.restroom }
              let arr = []
              arr[0] = v.property[3]
              arr[1] = v.property[2]
              arr[2] = v.property[1]
              arr[3] = v.property[0]
              temp[i][6] = arr
              temp[i][7] = v.roomNo + '间'
              temp[i][8] = v.id
            })
            this.setAddHouse(temp)
          }

          //门牌号
          let houseNumber = {
            bound: this.upShow.house.buildingNum,
            unit: this.upShow.house.unitNum,
            floor: this.upShow.house.floorNum + '层-共' + this.upShow.house.totalFloorNum + '层',
            room: this.upShow.house.houseNum
          }
          this.setHouseNumber1(houseNumber)
          this.setHouseNumber(houseNumber)
          //页头配置项
          this.setPageInfo({ type: '修改房源', title: ['修改' + this.upShow.house.rentalType + '房源', '修改' + this.upShow.house.rentalType + '房源'], processList: [{ text: '房屋概况', status: true }, { text: '设置价格', status: false }, { text: '完成', status: false }], len: [0, 50] })
          //页面所需参数 传递
          let obj = {}
          obj.id = this.hosueDetails.houseId
          obj.rentId = this.hosueDetails.houseRent.rentId
          obj.name = this.hosueDetails.name
          uni.navigateTo({
            url: '../../../pages/addHouseSource/step1?type=1&houseType=' + JSON.stringify(obj),
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
  .infoShare {
    position: absolute;
    right: 10rpx;
    bottom: -30rpx;
    text-align: center;
    color: #6b6b6b;
    font-size: 30rpx;
  }
  .houseContainer {
    display: flex;
    flex-direction: column;
    // height: calc(100vh - 420rpx);
    .houseTop {
      position: relative;
      margin: 0 auto;
      width: 690rpx;
      padding-top: 30rpx;
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
      .price {
        font-size: 40rpx;
        color: #ff0000;
        font-weight: 600;
        text {
          margin-left: 14rpx;
          font-size: 30rpx;
        }
      }
    }
    .houseInfo {
      padding-top: 20rpx;
      margin: 0 auto 24rpx;
      width: 690rpx;
      display: flex;
      position: relative;
      .infoLeft {
        max-width: 600rpx;
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
        .right-name {
          font-size: 34rpx;
          font-weight: 600;
          margin-bottom: 10rpx;
        }

        .right-addrs {
          color: grey;
          font-size: 28rpx;
        }
      }
    }
    .date_time {
      width: 750rpx;
      margin: 20rpx 30rpx;
    }
    .scroll_X {
      display: flex;
      width: 690rpx;
      margin: 0 auto;
      flex-wrap: nowrap;
      position: relative;
      top: 0;
      left: -25rpx;
      .scroll_item {
        width: 150rpx;
        height: 40rpx;
        line-height: 40prx;
        font-size: 32rpx;
        text-align: center;
        position: relative;
        .border_item1 {
          position: absolute;
          left: 50rpx;
          bottom: -15rpx;
          width: 40rpx;
          height: 6rpx;
        }
      }
    }
    .house_layout {
      width: 690rpx;
      margin: 30rpx auto;
      display: flex;
      border-top: solid calc(1px / 2.5) #d9d9d9;
      // border-bottom: solid calc(1px / 2.5) #d9d9d9;
      font-size: 22rpx;
      flex-wrap: wrap;
      justify-content: space-between;
      .layout_item {
        width: 25%;
        height: 110rpx;
        text-align: center;
        margin-top: 30rpx;
        view:nth-child(2) {
          color: grey;
        }
      }
      .layout_item:nth-child(1) {
        border-bottom: solid calc(1px / 2.5) #d9d9d9;
      }
      .layout_item:nth-child(2) {
        border-bottom: solid calc(1px / 2.5) #d9d9d9;
      }
      .layout_item:nth-child(3) {
        border-bottom: solid calc(1px / 2.5) #d9d9d9;
      }
      .layout_item:nth-child(4) {
        border-bottom: solid calc(1px / 2.5) #d9d9d9;
      }
      .layout_color {
        font-size: 32rpx;
        margin-bottom: 10rpx;
        font-weight: 500;
      }
      .layout_weight {
        font-size: 32rpx;
        margin-bottom: 10rpx;
        font-weight: 500;
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
  .tagTitle {
    width: 690rpx;
    margin: 0 auto 30rpx;

    display: flex;
    flex-wrap: wrap;
    .tagItem {
      color: #0081ff;
      font-size: 26rpx;
      text-align: center;
      min-width: 130rpx;
      height: 60rpx;
      line-height: 60rpx;
      margin: 10rpx 15rpx;
      padding: 0 10rpx;
      border: solid calc(1px / 2.5) #d9d9d9;
    }
  }
  .base_info {
    width: 750rpx;
    /* margin: 20rpx 30rpx; */
    padding: 20rpx 30rpx;
  }
  .info_box {
    width: 690rpx;
    margin-top: rpx;
    display: flex;
    font-size: 28rpx;
    flex-wrap: wrap;
    .info_item {
      min-width: 160rpx;
      // text-align: center;
      margin-right: 13rpx;
      margin-top: 30rpx;
    }
    .center {
      text-align: center;
    }
  }

  .introBox {
    width: 750rpx;
    /* height: 200rpx; */
    // border-top: solid 16rpx #f5f5f5;
    .tabBar {
      display: flex;
      margin-left: 30rpx;
      justify-content: center;
      .tabBar_item {
        position: relative;
        width: 150rpx;
        height: 60;
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
        width: 210rpx;
        margin: 0 20rpx;
        display: flex;
        flex-direction: column;
        align-items: center;
      }
      .normaluser {
        width: 286rpx;
        margin: 0 0 0 20rpx;
        .hide_text {
          width: 130rpx;
          white-space: nowrap; //不换行
          overflow: hidden; //超出隐藏
          text-overflow: ellipsis; //变成...
        }
      }
      .reserve {
        width: 430rpx;
        // width: 200rpx;
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
        // width: 430rpx;
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
        width: 430rpx;
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
