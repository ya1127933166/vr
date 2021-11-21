<template>
  <view class="home-page abc"
        style="height:100vh">
    <view class="home-head"
          :style="'padding-top:' + statusBarHeight + 'px'">
      <view class="header"
            :style="'height:' + headerHeight + 'px; line-height:' + headerHeight + 'px;'">
        <view class="location-name"
              v-if="true"
              @tap="toLocation"
              :style="'padding-left:' + marginWidth + 'px'">
          <view class="location-value">{{locationInfo.name}}</view>
          <view class='cuIcon-unfold'></view>
        </view>
        <view class="app-name">{{brandName}}</view>
      </view>
      <view class="home-head-group">
        <view class="search-mode"
              @tap="toSearch">
          <view class="search-icon cuIcon-search"></view>
          <view class="search-input">小区/客户ddd/同事</view>
        </view>
        <view class="options-group">
          <view class="option-item"
                @tap="toApplication">
            <view class="option-icon">
              <image :src="'https://uss.img.lezhulife.com/xcxicon/application.png'"
                     mode="scaleToFill"></image>
            </view>
            <view class="option-name">签署合同</view>
          </view>
          <view class="option-item"
                @tap="toSigning">
            <view class="option-icon">
              <image :src="'https://uss.img.lezhulife.com/xcxicon/contract.png'"
                     mode="scaleToFill"></image>
            </view>
            <view class="option-name">管理合同</view>
          </view>
        </view>
      </view>
    </view>
    <!-- 	<view class="" style='width: 150rpx;margin: 0 auto;text-align: center;' @tap='goOut'>
			退出
		</view> -->
    <view class="home-menu">
      <view @tap="toJumpPage(i)"
            class="menu-item"
            v-for="i in menuData"
            :key="i.text">
        <view v-if="i.point"
              class="point"></view>
        <image :src="i.path"
               mode=""
               style="width: 70rpx;height: 70rpx;"></image>
        <view class="item-text">
          {{i.text}}
        </view>
      </view>
    </view>
    <view class="home-user-data">
      <view class="user-data-head">
        <view class="head-name">我的数据</view>
        <view class="data-month"
              v-if="true">
          <view class="data-month-value">{{dataYearMonth}}</view>
          <view class="data-month-arrow">
            <!-- 	<view class="cuIcon-unfold"></view> -->
          </view>
        </view>
        <picker :disabled="isPecker"
                mode="date"
                fields="month"
                :value="currentData"
                :start="preDate"
                :end="currentData"
                @change="bindDateChange">
          <view class="picker"
                @tap='selectData'>
            <!--  @tap="clickPickerHandel" -->
            <view>{{date}}</view>
            <view class="cuIcon-unfold"
                  style="margin-left:10rpx;"></view>
          </view>
        </picker>
      </view>
      <loading v-if="loading" />
      <view class="user-data-group">
        <view v-for="(item, index) in userData"
              :key="index"
              class="user-data-item">
          <view class="user-data-item-head">
            <view class="user-data-value">{{item.value}}</view>
            <view class="user-data-info"
                  v-if="item.symbol">{{item.symbol}}</view>
          </view>
          <view class="user-data-item-foot">
            <view class="user-data-info">{{item.name}}</view>
          </view>
        </view>
      </view>
    </view>
    <view class="month-selector-bg"
          v-if="monthSelector"
          @tap="closeMonthSelector"></view>
    <view class="month-selector"
          v-if="monthSelector"
          :class="{'month-selector-animate': monthSelectorAnimate}">
      <view class="mode-head">
        <view class="close-btn"
              @tap="closeMonthSelector">
          <view class="cuIcon-close"></view>
        </view>
        <view class="mode-name">请选择月份</view>
      </view>
      <view class="year-tab">
        <view v-for="(item, index) in monthList"
              :key="index"
              :class="{active: monthList.length > 0 && dataYear == item.name}"
              @tap="selectDataYear(item)"
              class="year-tab-item">{{item.name}}</view>
      </view>
      <view class="month-tab">
        <view v-for="(item, index) in monthList"
              :key="index"
              :class="{active: dataYear == item.name}"
              class="month-tab-item">
          <view v-for="(monthItem, monthIndex) in item.month"
                :key="monthIndex"
                :class="{active: selectedDataYear == item.name && dataMonth == monthItem}"
                @tap="selectDataMonth(monthItem)"
                class="month-item">{{monthItem}}月</view>
        </view>
      </view>
    </view>
    <!-- <view style="height:100px;width:100px"></view> -->
    <movable-area v-if="isShowSwicthAuth"
                  class="dragBox">
      <movable-view class="max"
                    direction="all">
        <view @tap="switchAuth"
              class="dragItem">
          <image style="width:50rpx;height:50rpx"
                 src="https://uss.img.lezhulife.com/xcxicon/switchUse.png"></image>
        </view>
      </movable-view>
    </movable-area>
    <!-- <Intercept></Intercept> -->
  </view>
</template>

<script>
import { mapState, mapActions, mapMutations } from 'vuex';
// import dateFormat from '@/function/date-format';
/**
 * 当前时间
 */
const now = new Date();
const nowYear = now.getFullYear();
const nowMonth = now.getMonth() + 1;
// let timer= null
//    function debounce(func, delay) {
//       clearTimeout(timer)
//       timer = setTimeout(() => {
//         func();
//       }, delay)
//     }
const app = getApp();
export default {
  name: 'Home',

  data () {
    return {
      currentData: '',
      preDate: '',
      date: '',
      menuData: [{
        point: false,
        path: this.$baseURL + 'xcxicon/manage_house.png',
        text: '房源管理',
        pagePath: '../../subpackComm/pages/viewHousing/houseadd'
      },
      // {
      // 	point: false,
      // 	path: this.$baseURL+'xcxicon/home-apporl.png',
      // 	text: '待审批',
      // 	pagePath:'../../subpackComm/pages/approval/approval'
      // },
      {
        point: false,
        path: this.$baseURL + 'xcxicon/home-message.png',
        text: '消息',
        pagePath: '../../subpackComm/pages/myMessage/myMessage'
      }, {
        point: false,
        path: this.$baseURL + 'xcxicon/home-addrBook.png',
        text: '员工通讯录',
        pagePath: '../../subpackAddrlist/pages/addrList/addrList'
      }, {
        point: false,
        path: this.$baseURL + 'xcxicon/home-follow-up.png',
        text: '跟进记录',
        pagePath: '../../subpackSource/pages/source/follow/record'
      }
      ],
      myData: {},
      userData: [{
        value: 0,
        symbol: '(实时)',
        name: '新增房源',
      }, {
        value: 0,
        symbol: '(实时)',
        name: '新增客源',
      }, {
        value: 0,
        symbol: '(次)',
        name: '带看',
      }, {
        value: 0,
        symbol: '(次)',
        name: '陪看',
      }, {
        value: 0,
        symbol: '(个)',
        name: '代理合同',
      }, {
        value: 0,
        symbol: '(个)',
        name: '租房合同',
      }, {
        value: 0,
        symbol: '(套)',
        name: '结佣套数',
      }, {
        value: 0,
        symbol: '(元)',
        name: '结佣金额',
      }],
      monthList: [],
      monthSelector: false,
      monthSelectorAnimate: false,
      dataYear: nowYear,
      dataMonth: nowMonth,
      selectedDataYear: nowYear,
      dataYearMonth: '',
      loading: false,
      boundInfo: {},
      screenPadding: 0,
      isPecker: true,
    };
  },
  components: {

  },
  created () {
    uni.$on('getMyData', res => {
      this.setinit(true)
      // this.Init= false
      this.getMydata()
    })
    // uni.hideTabBar()
    // setTimeout(()=>{
    // 	uni.showTabBar()
    // },1000)
  },
  mounted () {

  },

  onLoad () {

    this.$store.dispatch('updateCustomBar');
    if (this.location && this.location.id) {
      this.loadData();
    }
    // uni.showLoading({
    //     title: '加载中...',
    // });
    // this._initPage()
    if (this.userinfo.id) {
      this.createMonthSelectData(this.userinfo.createDate);
    } else {
      this.waiting.userinfo = () => {
        this.createMonthSelectData(this.userinfo.createDate);
        return false;
      };
    }

  },
  onShow () {

    console.warn('show')
    this.$store.dispatch('updateCustomBar');
    this.$utils.storeCurrentPage('home')
    if (this.location && this.location.id) {
      this.loadData();
    }
    if (this.init == true) {
      this.getMydata()
    }
    //获取胶囊布局位置
    let res = wx.getMenuButtonBoundingClientRect();
    this.boundInfo = res;
    //初始化时间设置
    this.currentData = new Date().getFullYear() + '-' + (new Date().getMonth() + 1);
    this.preDate = (new Date().getFullYear() - 1) + '-' + ((new Date().getMonth() + 1) < 10 ? `0${(new Date().getMonth() + 1)}` : `${(new Date().getMonth() + 1)}`);
    this.date = (new Date().getFullYear()) + '-' + ((new Date().getMonth() + 1) < 10 ? `0${(new Date().getMonth() + 1)}` : `${(new Date().getMonth() + 1)}`);

    //如果已经授权手机号，则将日期选择器的限制放开
    setTimeout(() => {
      if (this.isPhone == true) {
        this.isPecker = false;
      }
    }, 1000)
  },
  computed: {
    ...mapState({
      //在获取到用户信息后确认身份
      headerData (state) {
        if (state.headerData != '') {
          this.getnewewregistration();
        }
      },
      customeheaderInfo (state) {
        const sys = this.$$globalData.systemInfo
        this.screenPadding = sys.windowWidth - (state.customeheaderInfo.bound.left + state.customeheaderInfo.bound.width)
        return state.customeheaderInfo
      },
      statusBarHeight: state => state.sys.statusBarHeight,
      headerHeight: (state) => {
        const baseHeight = state.custom.bottom + state.custom.top;
        if (state.custom.top < state.sys.statusBarHeight) {
          return baseHeight + state.sys.statusBarHeight - state.sys.statusBarHeight;
        }
        return baseHeight - state.sys.statusBarHeight - state.sys.statusBarHeight;
      },
      marginWidth: state => state.sys.windowWidth - state.custom.right,
      location: state => state.location,
      brandName: state => state.brand.name || '乐住通',
      isUser: state => state.user,
      isLogin: state => state.login,
      userinfo: state => state.userinfo,
      isPhone: state => state.isPhone,
      // headerData:state=>state.headerData,
      locationInfo: state => state.locationInfo,
      isShowSwicthAuth: state => state.selectAuthList.some(ele => ele.selected == 'Y'),
      isCheckingAuth: state => state.isCheckingAuth,
      init: state => state.init
    }),
  },
  methods: {
    ...mapMutations(['setinit']),
    //分享
    onShareAppMessage (res) {
      let shareObj = {
        title: '助您打造新经纪协作可视化能力，现在就开始~',
        path: `/pages/tabbar/home`,
        imageUrl: `https://uss.img.lezhulife.com/xcximages/share_bg.jpg`,
        fail: function () {
          console.log("转发失败:");
        }
      }
      if (res.from == 'button') {
        var eData = res.target.dataset;
      }
      return shareObj
    },
    // //分享朋友圈
    // onShareTimeline(){
    // 	let obj = {
    // 		id: this.houseId,
    // 		name: this.name
    // 	}
    // 	return{
    // 		title:this.name,
    // 		ppath: '/subpackComm/pages/viewHousing/viewHousing?houseId=' + JSON.stringify(obj),
    // 		success: (res) => {
    // 			// 转发成功
    // 			console.log("转发成功:" + JSON.stringify(res));
    // 		},
    // 		fail: function(res) {
    // 			// 转发失败
    // 			console.log("转发失败:" + JSON.stringify(res));
    // 		}
    // 	}
    // },
    //我的数据
    async getMydata () {
      let res = await this.request({
        url: 'my/date',
        type: 'post',
        param: {
          date: this.dataYear + '.' + this.dataMonth
        }
      })
      if (res[1].data.state == 200) {
        this.myData = res[1].data.body
        const { contractAgent, accompany, contractRent, followupsNum, SoldAmount, customerNum, SoldNum, houseNum } = this.myData
        this.userData[0].value = houseNum
        this.userData[1].value = customerNum
        this.userData[2].value = followupsNum
        this.userData[3].value = accompany
        this.userData[4].value = contractAgent
        this.userData[5].value = contractRent
        this.userData[6].value = SoldNum
        this.userData[7].value = SoldAmount
      } else {
        // uni.showToast({
        //     title: this.$throwStatusCode(res[1].data.state,'获取我的数据'),
        //     icon:'none'
        // })
      }
    },
    //退出
    // ...mapMutations(['setHeaderData']),
    goOut () {
      let that = this
      this.$utils.debounce(function () {
        try {
          that.request({
            url: 'user/logout',
            type: 'get'
          }).then(res => {
            if (res[1].data.state == 200) {
              uni.clearStorageSync();
              that.$store.commit('setHeaderData', '')
              that.$store.commit('setPhoneStatus', false)
            }
          })
        } catch (e) {
          console.log(e);
        }
      }, 600)()
    },
    ...mapActions(['getnewewregistration']),
    //切换身份
    switchAuth () {

      uni.navigateTo({
        url: '../../subpackComm/pages/login/selectAuth?type=切换身份'
      })
    },
    selectData () {
      if (this.isPecker) {
        this.$utils.debounce(() => {
          this.checkLogin(() => {
            this.isPecker = true
          })
        }, 500)()
      }
    },
    /**
     * 获取选择的时间
     */
    bindDateChange (res) {
      // console.log(this.currentData,'当前事件')
      // this.preDate = res.detail.value
      this.date = res.detail.value
      let Num = res.detail.value.split('-')
      this.dataYear = Num[0]
      this.dataMonth = Num[1]
      this.getMydata()
    },
    /**
     * 创建月份选择的基础数据
     * 推荐使用方法 - 传入用户的创建时间
     * @param {Date|String} beginDate 开始时间
     */
    /**
     * 确认用户已登录
     */
    checkLogin (cb) {
      if (this.isPhone == false) {
        // 触发用户登录流程
        console.log('进入');
        this.$login();
        return false;

      }
      cb();
    },
    //菜单选项中的跳转

    toJumpPage (item) {
      this.$utils.debounce(() => {
        // uni.showLoading({
        //     title: '加载中...',
        // });
        this.$$globalData.jumpPath = item.pagePath;
        // setTimeout(()=>{
        this.checkLogin(() => {
          uni.navigateTo({
            url: item.pagePath
          })
        })
        // },100)
      }, 600)()


    },
    toLocation () {
      this.$utils.debounce(() => {
        uni.showLoading({
          title: '加载中...',
        });
        this.$$globalData.jumpPath = '/pages/select-location/select-city'
        // 验证身份后继续
        this.checkLogin(() => {
          uni.navigateTo({
            url: '/pages/select-location/select-city',
          });
        });
      }, 600)()
    },
    toSearch () {
      this.$utils.debounce(() => {
        // uni.showLoading({
        //     title: '加载中...',
        // });
        this.$$globalData.jumpPath = '/pages/village/village?type=全部'
        // 验证身份后继续
        this.checkLogin(() => {
          uni.navigateTo({
            url: '/pages/village/village?type=全部',
          });
        });
      }, 600)()
    },
    toApplication () {
      this.$utils.debounce(() => {
        uni.showLoading({
          title: '加载中...',
        });
        this.$$globalData.jumpPath = '/pages/contractApplication/contractApplication'
        // 验证身份后继续
        this.checkLogin(() => {
          uni.navigateTo({
            url: '/pages/contractApplication/contractApplication',
          });
        });
      }, 600)()
    },
    toSigning () {
      uni.showLoading({
        title: '加载中...',
      });
      this.$utils.debounce(() => {
        this.$$globalData.jumpPath = '/pages/adminSign/adminSign'
        // 验证身份后继续
        this.checkLogin(() => {
          uni.navigateTo({
            url: '/pages/adminSign/adminSign',
          });
        });
      }, 600)()
    },
  },
  watch: {
    location () {
      if (this.location && this.location.id) {
        this.loadData();
      }
    },
  },
}
</script>

<style lang="scss">
@import '../../static/tabbar/find.scss';
button {
  position: static !important;
  display: block !important;
  margin-left: 0 !important;
  margin-right: 0 !important;
  padding-left: 0 !important;
  padding-right: 0 !important;
  box-sizing: content-box !important;
  font-size: medium !important;
  text-align: left !important;
  text-decoration: none !important;
  line-height: auto !important;
  border-radius: 0px !important;
  background-color: white !important;
  &::after {
    border: none;
  }
}
.button-hover {
  color: not specified !important;
}
page {
  background: #fff;
}
.statusBar {
  background-color: white;
  position: fixed;
  top: 0;
  left: 0;
  z-index: 100;
  transition: all 0.5s;
}

.scrollBar {
  position: fixed;
  top: 0;
  left: 0;
  width: 750rpx;
  // padding-left: 20rpx;
  display: flex;
  z-index: 100;
  background-color: white;
  animation: fade 0.1s ease;
  box-sizing: border-box;
  overflow: hidden;
  transition: all 0.1s ease-in;

  .barLeft {
    width: 120rpx;
    height: 100%;
    display: flex;
    border-radius: 50rpx;
    align-items: center;

    .barLeftText {
      width: 85rpx;
      font-size: 26rpx;
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
      display: flex;
      align-items: center;
    }
  }

  .barRight {
    box-sizing: border-box;
    padding: 0rpx 12rpx 0rpx 10rpx;
    display: flex;
    align-items: center;
    border: solid 1rpx #cccc;
    margin-left: 20rpx;

    .inputBox {
      padding-left: 10rpx;

      input {
        color: #888;
        font-size: 23rpx;
      }
    }
  }
}

.home-head {
  position: relative;
  // background: url($homeBG) 0 0 no-repeat;
  background: url($findHeadBG) 0 0 no-repeat;
  // background: #aaa;
  // background-size: 100% auto;
  background-size: cover;
  box-sizing: border-box;
  overflow: hidden;

  .header {
    position: relative;
    height: 80rpx;
    color: #fff;
    z-index: 10;
  }

  .location-name {
    position: absolute;
    top: 50%;
    left: 30rpx;
    height: 80rpx;
    margin-top: -40rpx;
    // padding: 0 16rpx;
    line-height: 84rpx;
    font-size: 28rpx;
    color: #fff;
    display: flex;
    align-items: center;
    // margin-left: 30rpx;

    .cuIcon-unfold {
      margin-left: 10rpx;
      font-size: 30rpx;
      // font-weight: 900;
    }
    .location-icon {
      margin-right: 4rpx;
      width: 30rpx;
      height: 30rpx;
      // padding: (80rpx+(-30rpx))*.5 0;

      image {
        display: block;
        width: 100%;
        height: 100%;
      }
    }
  }

  .app-name {
    font-size: 36rpx;
    font-weight: bold;
    text-align: center;
    color: #fff;
  }

  &::before {
    content: '';
    position: absolute;
    bottom: 0;
    width: 100%;
    height: 80rpx;
    background: #fff;
  }

  &::after {
    content: '';
    position: absolute;
    bottom: 0;
    width: 200%;
    height: 240rpx;
    background: #fff;
    transform: rotate(-12deg);
    transform-origin: 50% 100%;
  }
}

.home-head-group {
  position: relative;
  padding: 20rpx 40rpx;
  z-index: 10;
}

$searchHeight: 72rpx;

.search-mode {
  position: relative;
  height: $searchHeight;

  .search-input {
    height: $searchHeight;
    padding: ($searchHeight - 60rpx) * 0.5 10rpx;
    padding-left: $searchHeight * 0.8;
    line-height: 64rpx;
    border: none;
    color: #888;
    background: #fff;
    border-radius: 4rpx;
    overflow: hidden;
  }

  .search-icon {
    position: absolute;
    top: 0;
    left: 0;
    width: $searchHeight * 0.8;
    line-height: $searchHeight;
    font-size: 32rpx;
    text-align: center;
    color: #aaa;
  }
}

.options-group {
  padding: 20rpx 0rpx 40rpx 0;
  display: flex;
  flex-wrap: wrap;
  flex-direction: row;
  justify-content: space-between;

  .option-item {
    width: 326rpx;
    height: 160rpx;
    padding: 20rpx $searchHeight * 0.8;
    border: 1rpx solid #eee;
    border-radius: 8rpx;
    background: #fff;
    box-sizing: border-box;
    &:active {
      background-color: #fafafa;
    }
  }

  .option-icon {
    width: 40rpx;
    height: 40rpx;
    margin: 10rpx 0;

    image {
      display: block;
      width: 100%;
      height: 100%;
    }
  }

  .option-name {
    font-size: 32rpx;
    font-weight: bold;
    color: #000;
  }
}

.home-menu {
  width: 100%;
  height: 170rpx;
  display: flex;
  justify-content: space-between;
  padding: 0rpx 20rpx 0rpx 20rpx;

  .menu-item {
    width: 25%;
    text-align: center;
    font-size: 30rpx;
    font-weight: 540;
    position: relative;

    .point {
      position: absolute;
      content: ' ';
      display: block;
      right: 10rpx;
      background-color: red;
      border-radius: 50%;
      width: 10px;
      height: 10px;
    }
  }
}

.home-user-data {
  position: relative;
  border-top: 10rpx solid #f5f5f5;
}

.user-data-head {
  position: relative;
  height: 120rpx;
  margin-top: 10rpx;
  line-height: 120rpx;
  padding-left: 60rpx;
  display: flex;
  flex-wrap: wrap;
  flex-direction: row;
  justify-content: flex-start;
  .picker {
    width: 200rpx;
    position: absolute;
    // background-color: aqua;
    display: flex;
  }
  .head-name {
    margin-right: 20rpx;
    font-size: 32rpx;
  }

  .data-month {
    display: flex;
    flex-wrap: wrap;
    flex-direction: row;
    justify-content: flex-start;
    font-size: 24rpx;
    color: #666;
  }

  .data-month-value {
    margin-right: 8rpx;
  }
}

.user-data-group {
  position: relative;
  padding: 10rpx 60rpx;
  display: flex;
  flex-wrap: wrap;
  flex-direction: row;
  justify-content: space-between;

  &::before {
    content: '';
    position: absolute;
    top: 85rpx;
    bottom: 85rpx;
    left: 50%;
    width: 2rpx;
    margin-left: -1rpx;
    background: #f5f5f5;
  }

  .user-data-item {
    width: 310rpx;
    padding: 30rpx 0;
  }

  .user-data-item-head,
  .user-data-item-foot {
    display: flex;
    flex-wrap: wrap;
    flex-direction: row;
    justify-content: center;
    height: 54rpx;
    line-height: 54rpx;
    overflow: hidden;
  }

  .user-data-value {
    font-size: 48rpx;
    font-weight: bold;
    color: #222;

    & + .user-data-info {
      line-height: 62rpx;
      margin-left: 6rpx;
    }
  }

  .user-data-info {
    font-size: 24rpx;
    color: #666;
  }
}

.month-selector-bg {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.25);
  z-index: 100;
}

.month-selector {
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  background: #f5f6f7;
  z-index: 110;
  transition: all 300ms ease-in-out;
  opacity: 0;
  transform: translateY(100%);

  &.month-selector-animate {
    opacity: 1;
    transform: none;
  }

  .mode-head {
    position: relative;
    height: 90rpx;
    border-bottom: 1rpx solid #eee;

    .close-btn {
      position: absolute;
      top: 0;
      left: 0;
      width: 90rpx;
      height: 90rpx;
      line-height: 90rpx;
      text-align: center;
      font-size: 40rpx;
      color: #666;
    }

    .mode-name {
      line-height: 90rpx;
      text-align: center;
      font-size: 32rpx;
      color: #222;
    }
  }

  .year-tab {
    display: flex;
    flex-wrap: wrap;
    flex-direction: row;
    justify-content: center;
    padding-top: 20rpx;
  }

  .year-tab-item {
    height: 60prx;
    padding: 0 15rpx;
    margin: 0 6rpx;
    line-height: 64rpx;
    font-size: 28rpx;
    border-radius: 4rpx;
    background: #fff;
    overflow: hidden;

    &.active {
      color: #fff;
      background: #08c;
    }
  }

  .month-tab-item {
    display: none;
    padding: 20rpx 35rpx 15rpx;
    flex-wrap: wrap;
    flex-direction: row;
    justify-content: flex-start;

    &.active {
      display: flex;
    }
  }

  .month-item {
    width: 150rpx;
    height: 80rpx;
    margin: 0 10rpx 20rpx;
    line-height: 84rpx;
    text-align: center;
    font-size: 32rpx;
    border-radius: 4rpx;
    background: #fff;
    overflow: hidden;

    &.active {
      color: #fff;
      background: #08c;
    }
  }
}

.dragBox {
  width: 100rpx;
  height: 50vh;
  position: fixed;
  bottom: 0;
  right: 0;
  .max {
    width: 100rpx;
    height: 70rpx;
    background-color: rgba(0, 0, 0, 0.25);
    display: flex;
    align-items: center;
    border-radius: 35rpx 0rpx 0rpx 35rpx;
    .dragItem {
      width: 60rpx;
      height: 60rpx;
      border-radius: 30rpx;
      background-color: #01a57f;
      margin-left: 10rpx;
    }
  }
}

.fadeUpIn-enter,
.fadeUpIn-leave-to {
  opacity: 0;
  transform: translateY(100%);
}

.fadeUpIn-enter-active,
.fadeUpIn-leave-active {
  transition: all 200ms linear;
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
