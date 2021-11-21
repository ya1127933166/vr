<template>
  <view class="find-page">
    <!--        <view class="scrollBar" :style="`height:${tabbarHeight}px`">-->
    <view class="scrollBar"
          :style="'padding-top:' + ((isShowBar&&isScroll)?boundInfo.top:'0') + 'px;height:' + ((isShowBar&&isScroll)?headerHeight-0+boundInfo.top:'0') + 'px;'">
      <view @tap="toLocation"
            class="barLeft"
            :style="'height:' + boundInfo.height + 'px;'">
        <view :style="'padding-left:'+screenPadding+'px;'"
              class="barLeftText">{{ locationInfo.name}}</view>
        <view class='cuIcon-unfold'></view>
      </view>
      <view class="barRight"
            :style=" 'width:calc(100vw - ' + boundInfo.width + 'px - 200rpx);height:' + boundInfo.height + 'px;border-radius:calc((100vw - ' + boundInfo.width +'px - 180rpx)/2);'">
        <view class="cuIcon-search"></view>
        <view class="inputBox"
              @tap='toSearch'>
          <input placeholder="小区/客户/同事"
                 type="text"
                 disabled="true"
                 value="" />
        </view>
      </view>
    </view>
    <view class="home-head"
          :style="'padding-top:' + statusBarHeight + 'px'">
      <!--            <view class="header" :style="'padding-top:' + (isIphoneX?'10':'50') + 'rpx'">-->
      <view class="header">
        <view class="header-top">
          <open-data class='userAvatar'
                     mode="aspectFill"
                     style="width:120rpx;height:120rpx;border-radius: 60rpx;"
                     type="userAvatarUrl"></open-data>
          <view class="userName">
            {{currentOrganization.staffName || currentOrganization.nickName||''}}
          </view>
          <!--					<open-data class='userName' type="userNickName" lang="zh_CN"></open-data>-->
          <!-- <image class='userAvatar' style="width:100rpx;height:100rpx;" src="https://uss.img.lezhulife.com/xcxicon/defaultAvatar.png"></image>
                	<view class='userName'>任一</view> -->
        </view>
        <view class="home-head-group">
          <view class="menuBox">
            <view class="menuItem">
              <view class="count">{{customer.total}}</view>
              <view class="text">总人数</view>
            </view>
            <view class='line'></view>
            <view class="menuItem menuBorder">
              <view class="count">{{customer.today}}</view>
              <view class="text">今日新增</view>
            </view>
          </view>
        </view>
      </view>
      <view style="width:750epx;height:100rpx"></view>
    </view>
    <view class="invitation">
      <view class='contentBox'>
        <image class='boxLeft'
               style="width:70rpx;height:70rpx;"
               src="https://uss.img.lezhulife.com/xcxicon/invitation.png"></image>
        <view class='boxCenter'>
          <view>1000元现金红包限时领取</view>
          <view>邀请企业使用，获得现金红包</view>
        </view>
        <button open-type="share"
                class='boxRight'>
          <view>去邀请</view>
          <view class='cuIcon-right arrow'></view>
        </button>
      </view>
    </view>
    <DropMenu @downMenuCallBack="clickMenu"
              :isAuth='isUserInfo'
              :checkout="checkout"
              :menuBar="menuBar"
              @downMenuBarClickCallBack="downMenuBarClick"
              ref="dropMenu"
              :rightButton="'+添加客户'"
              @rightButtonClickCallBack="addUser"
              :isScroll="false"
              @showHeaderHandel="showHeaderCallBack"></DropMenu>
    <scroll-view :lower-threshold='50'
                 @scrolltolower="bindScrolltolower"
                 class='scrollBox'
                 :scroll-y="isShowBar"
                 :style="'height:'+(isScroll?'calc(' + scrollHeight + 'px - ' + hackHeight + 'rpx)':hackScroll+'px')+';' +
                      'background-color: #f7f7f7;box-sizing: border-box;'">
      <Loading v-if="isShowLoading"></Loading>
      <block v-if="userList && userList.length">
        <block v-for="(item) in userList"
               :key="item.customer_id">
          <view @tap="toUserDetail(item)"
                class="contacts">
            <image mode="aspectFill"
                   class='contactsLeft'
                   style="width:60rpx;height:60rpx;opacity:0.8;"
                   :src="item.avatar_url==''?'https://uss.img.lezhulife.com/xcxicon/defaultAvatar.png':item.avatar_url"></image>
            <view class='contactsRight'>
              <view class='rightTop'>
                <view class="userName">{{item.name}}</view>
                <view v-if="item.phone_no=='Y'"
                      style="color:#55b3e4;"
                      class='cuIcon-mobilefill'></view>
                <view v-if="item.wechat_no=='Y'"
                      style="color:#24db5a;"
                      class='cuIcon-weixin'></view>
              </view>
              <block v-if="item.tags&&item.tags.length>0">
                <view class="rightBottom">
                  <block v-for="(tag,index) in item.tags"
                         :key="tag">
                    <view v-if="index<3"
                          class='bottomTag'>{{tag}}</view>
                  </block>
                </view>
              </block>
            </view>
          </view>
        </block>
        <view v-if="userList.length>0 && stopLoad"
              class='allNum'>共{{userTotal}}人</view>
      </block>
      <Empty v-else
             :isButton='isButton'
             :isAuth='isUserInfo'
             :path="'https://uss.img.lezhulife.com/xcxicon/empty-user.png'"
             :buttonText="'去添加客户'"
             :content="contentText"
             @addButtonCallBack="addUser"></Empty>
    </scroll-view>
  </view>
</template>

<script>
/**
 * 发现页
 */
import { mapState, createNamespacedHelpers, mapActions } from "vuex";
const { mapGetters: mapGetSource, mapState: sourceState, mapActions: sourceAction, mapMutations: sourceMutation } = createNamespacedHelpers('source');
import Modal1 from "@/components/comm/modal1/modal1.vue";
import Empty from '../../components/comm/emptyPrompt/emptyPrompt.vue';
import DropMenu from '../../components/comm/dropDownMenu/dropDownMenu.vue';
import Loading from '../../components/module/loading.vue';

export default {
  name: "Mine",
  components: {
    Modal1,
    Empty,
    DropMenu,
    Loading
  },
  data () {
    return {
      menuBar: [
        { text: "标签", status: false, selectKey: 'tag' },
        { text: "添加人", status: false },
        { text: "排序", status: false },
      ],
      checkout: 'mine',//检验所在页面
      isShowBar: false,
      boundInfo: {},
      tabbarHeight: 0,
      scrollHeight: 0,
      isShowMenu: false,
      currentMenuTitle: "默认",
      isClickBar: false,
      hackHeight: 0,
      totalTop: 0,
      isIphoneX: false,
      screenPadding: 0,
      info: {
        tag: '',
        add_id: 1,
        sort_id: 1,
        page: 0
      },
      userList: [],
      userTotal: 0,
      isShowLoading: true,
      isScroll: false,
      hackScroll: '',
      stopLoad: false,
      customer: {},
      isButton: true,
      contentText: '暂无客户',
      showType: false,
      isTag: false,
      isAll: 0
    };
  },
  onLoad () {
  },
  onShow () {
    const { mineNeedRefresh } = this.$store.state;
    if (!(!this.$utils.matchPage('mine') || mineNeedRefresh)) return
    this.$store.state.mineNeedRefresh = false;
    uni.pageScrollTo({
      scrollTop: 0
    })
    this._initPageMine();
    if (this.isTag) {
      this.isTag = false;
    }
    uni.showLoading({
      title: '加载中...',
      mask: true
    })
    //获取客户列表
    this.getUserList();
    //获取客户数
    this.getCustomer()

    const systemInfo = this.$$globalData.systemInfo;

    //获取胶囊布局位置
    let res = wx.getMenuButtonBoundingClientRect();
    this.boundInfo = res;

    //计算底部tabbr高度
    this.tabbarHeight = systemInfo.screenHeight - 0 - systemInfo.windowHeight;
    //计算scroll-view高度
    this.scrollHeight = systemInfo.screenHeight - (this.headerHeight - 0 + this.tabbarHeight - 0 + systemInfo.statusBarHeight - 0);
    //设置兼容安卓苹果的高度
    this.hackHeight = systemInfo.system.startsWith("iOS") ? 106 : 111;

    this.isIphoneX = systemInfo.model.startsWith("iPhone X") ? true : false;
    this.totalTop = systemInfo.model.startsWith("iPhone X") ? `calc(${systemInfo.statusBarHeight}px + 130rpx)` : `calc(${systemInfo.statusBarHeight}px + 180rpx)`;
  },
  onHide () {
    // console.warn('hide')
    // this._initPageMine();
  },
  onPageScroll (res) {
    this.$refs.dropMenu.judgeRect()
  },
  created () {
    // //获取客户数量
    // this.getCustomer()
    //获取标签数组
    this.getTagList();
    this.getnewewregistration();
    this.$bus.$on('changeAuth', this._initPageMine)
    this.$store.state.mineNeedRefresh = true;
  },
  mounted () {
    // console.log('this.currentOrganization',this.currentOrganization)
  },
  //页面销毁时清除监听
  beforeDestroy () {
    this.$bus.$off('changeAuth')
    // delete this.$store.state.mineNeedRefresh
  },
  computed: {
    ...mapGetSource(['selectTag']),
    ...sourceState({
      userDetail: state => state.userDetail
    }),
    ...mapState({
      isUserInfo: state => state.isUserInfo,
      statusBarHeight: (state) => state.sys.statusBarHeight,
      headerHeight: (state) => {
        const baseHeight = state.custom.bottom + state.custom.top;
        if (state.custom.top < state.sys.statusBarHeight) {
          return (
            baseHeight + state.sys.statusBarHeight - state.sys.statusBarHeight
          );
        }
        return (baseHeight - state.sys.statusBarHeight - state.sys.statusBarHeight);
      },
      marginWidth: (state) => state.sys.windowWidth - state.custom.right,
      isPhone: state => state.isPhone,
      locationInfo: (state) => state.locationInfo,
      customeheaderInfo (state) {
        const sys = this.$$globalData.systemInfo
        this.screenPadding = sys.windowWidth - (state.customeheaderInfo.bound.left + state.customeheaderInfo.bound.width)
        return state.customeheaderInfo
      },
      isCheckingAuth: state => state.isCheckingAuth,
      currentOrganization: state => state.currentOrganization,
    }),
    maskHeight () {
      const sys = this.$$globalData.systemInfo
      return `calc(${sys.windowHeight - this.headerHeight}px - 40vh )`
    },
  },
  watch: {
    selectTag: {
      handler (newVal, oldVal) {
        // console.log(newVal)
        switch (newVal.length) {
          case 0: {
            this.menuBar[0].text = '标签'
            break;
          }
          case 1: {
            let str = '标签'
            if (newVal[0].text) {
              str = newVal[0].text.slice(0, 3) + (newVal[0].text.length > 3 ? '...' : '')
            }
            this.menuBar[0].text = str
            break;
          }
          default: {
            let str = '标签'
            if (newVal[0].text) {
              str = newVal[0].text.slice(0, 2) + (newVal[0].text.length > 3 ? '...' : '')
            }
            this.menuBar[0].text = str + '等'
          }
        }
      }
    }
  },
  methods: {
    ...mapActions(['getnewewregistration']),
    ...sourceAction(['getTagList']),
    ...sourceMutation(['resetTags']),
    _initPageMine () {
      !this.isTag && this.resetTags();
      this.userList = [];
      this.userTotal = 0;
      // console.warn('!this.$utils.matchPage',!this.$utils.matchPage('mine'))
      if (!this.$utils.matchPage('mine')) {
        this.info = this.$options.data().info
        this.menuBar = this.$options.data().menuBar
        // console.log(this.info, this.menuBar)
        this.$refs.dropMenu.manualInit();
        this.$refs.dropMenu.getCheckout()
      } else {
        this.info.page = 0;
      }
      this.$utils.storeCurrentPage('mine')
    },
    onShareAppMessage: (res) => {
      let shareObj = {
        title: '助您打造新经纪协作可视化能力，现在就开始~',
        path: `/pages/tabbar/home`,
        imageUrl: `https://uss.img.lezhulife.com/xcximages/share_bg.jpg`,
        success: function () {
        },
        fail: function () {
        }
      }
      if (res.from == 'button') {
        var eData = res.target.dataset;
        console.log(eData.name);     // shareBtn
      }
      return shareObj
    },
    //子组件控制是否显示头部
    showHeaderCallBack (e) {
      // console.log('showHeaderCallBack',e)
      if (e && !this.isShowBar) {
        let view = uni.createSelectorQuery().in(this).select(".scrollBox");
        view.boundingClientRect(data => {
          // console.log(data)
          const { top } = data
          uni.pageScrollTo({
            scrollTop: top + this.headerHeight,
            // complete: (e)=> {console.log('scroll', top, e)}
          })
        }).exec();
      } else if (!e && this.isShowBar) {
        uni.pageScrollTo({
          scrollTop: 0,
          // complete: (e)=> {console.log('scroll top', e)}
        })
      }
      this.isShowBar = e
    },
    //上拉加载
    bindScrolltolower () {
      //没有数据停止刷新
      if (this.stopLoad) {
        return
      }
      // 列表选择后重新获取数据 防止多次请求故判断 isShowLoading
      !this.isShowLoading && this.getUserList()
    },
    //下拉菜单点击事件
    downMenuBarClick (e) {
      this.isTag = false;
      this.$utils.debounce(() => {
        this.isButton = true;
        this.contentText = '暂无客户'
        this.info.page = 0;
        this.userList = [];
        this.userTotal = 0;
        if (e.index == 1) {
          this.showType = true
          switch (e.text) {
            case '全部':
              this.info.add_id = 1
              break;
            case '自己添加的':
              this.info.add_id = 2
              break;
            case '分享给我的':
              this.info.add_id = 3
              break;
            default:
              break;
          }
        } else {
          this.showType = false
          switch (e.text) {
            case '智能排序':
              this.info.sort_id = 1
              break;
            case '按添加时间排序':
              this.info.sort_id = 2
              break;
            case '按分享优先':
              this.info.sort_id = 3
              break;
            default:
              break;
          }
          console.warn('selected sort', this.info.sort_id)
        }
        //列表选择后重新获取数据
        this.getUserList();
      }, 600)()

    },
    //点击目录回调
    clickMenu (e) {
      // console.log('clickMenu', e, this.isTag)
      this.isTag = true;
      this.$store.state.mineNeedRefresh = true;
      this.$utils.debounce(() => {
        console.log(e, '目录');
      }, 600)()
    },
    //获取成员的客户数量
    async getCustomer () {
      try {
        let res = await this.request({
          url: 'customer/number',
          type: 'get'
        })
        if (res[1].data.state == 200) {
          this.customer = res[1].data.body
          this.isAll += 1
          if (this.isAll >= 2) {
            uni.hideLoading()
            this.isAll = 0
          }
        } else {
          uni.showToast({
            title: this.$throwStatusCode(res[1].data.state, '获取客户数量'),
            icon: 'none'
          })
        }
      } catch (e) {
        console.log(e)
      }
    },
    //添加客户
    addUser (res) {
      this.$utils.debounce(() => {
        if (this.isUserInfo == false) {
          this.request({
            url: 'push/wxuser',
            type: 'post',
            param: {
              encryptedData: res.encryptedData,
              iv: res.iv
            },
          }).then((res) => {
            if (res[1].data.state == 200) {
              this.$store.commit('setUserInfoStatus', true)
              uni.showToast({
                title: '授权成功',
                icon: 'success'
              })
            } else {
              uni.showToast({
                title: this.$throwStatusCode(res[1].data.state, '授权用户信息'),
                icon: 'none'
              })
            }
          })
        }
        uni.showLoading({
          title: '加载中...',
        });
        this.$$globalData.jumpPath = "../../subpackSource/pages/source/addCustomer"
        this.checkLogin(() => {
          //	重置选中的标签
          this.resetTags();
          this.$store.state.mineNeedRefresh = true
          this.isTag = false;
          uni.navigateTo({
            url: "../../subpackSource/pages/source/addCustomer?type=添加客户"
          })
        })
      }, 600)()
    },
    //获取客户列表
    async getUserList () {
      // console.log("this.info.add_id ",this.info.add_id)
      if (this.info.add_id == 3 && this.showType) {
        this.isButton = false
        this.contentText = '暂无分享客户，请同事分享给我'
      }
      this.isShowLoading = true;
      let tag = '';
      try {
        // console.log('标签项',this.selectTag,this.isTag)
        //去tag标签筛选
        if (this.selectTag.length > 0) {
          tag = this.selectTag.map(ele => {
            return ele.text
          }).join(',')
        }
        let { add_id, sort_id, page } = this.info;
        let res = await this.request({
          url: 'customer/list',
          type: 'get',
          param: {
            // staff_id:this.currentOrganization.staff_id,
            tag,
            add_id,
            sort_id,
            page: page + 1
          }
        })
        if (res[1].data && res[1].data.state && +res[1].data.state === 200) {
          const { customers, customer_count } = res[1].data.body
          this.isAll += 1
          if (this.isAll === 2) {
            uni.hideLoading()
            this.isAll = 0
          }
          this.userList.push(...customers);
          // console.log(this.userList)
          this.userTotal = customer_count + this.userTotal;
          this.isDisableScroll();

          //当没有数据时停止刷新
          if (customers.length < 1) {
            this.stopLoad = true;
          } else {
            this.stopLoad = false;
            this.info.page += 1;
          }
        } else {
          uni.showToast({
            title: this.$throwStatusCode(res[1].data.state, '获取客源列表'),
            icon: 'none'
          })
        }
        this.isShowLoading = false

      } catch (error) {
        console.error(error);
      }
    },
    //计算是否滚动
    isDisableScroll () {
      if (this.userList.length < 1) {
        return false;
      }
      const sys = this.$$globalData.systemInfo
      let view = uni.createSelectorQuery().in(this).select(".contacts");

      const that = this;
      //计算是否禁止滚动
      this.$nextTick(() => {
        view.boundingClientRect(data => {
          if (data) {
            that.hackScroll = sys.windowHeight - 0 - (data.top || 0)
            if ((that.userList.length * data.height + 50 > sys.windowHeight - 0 - (data.top || 0))) {
              that.isScroll = true
            }
          }
        }).exec();
      })
    },
    //查看客户详情
    toUserDetail (item) {
      uni.navigateTo({
        url: `../../subpackSource/pages/source/customerInfo?customer_id=${item.customer_id}`
      })
    },
    /**
     * 确认用户已登录
     */
    checkLogin (cb) {
      if (!this.isPhone) {
        // 触发用户登录流程
        this.$login();
        return false;
      }
      cb();
    },
    toLocation () {
      this.$utils.debounce(() => {
        this.$$globalData.jumpPath = "/pages/select-location/select-city"
        // 验证身份后继续
        this.checkLogin(() => {
          uni.navigateTo({
            url: "/pages/select-location/select-city",
          });
        });
      }, 600)()
    },
    toSearch () {
      this.$utils.debounce(() => {
        this.$$globalData.jumpPath = "/pages/village/village"
        // 验证身份后继续
        this.checkLogin(() => {
          uni.navigateTo({
            url: "/pages/village/village?type=全部",
            // complete: (e) => {console.log('nav',e)}
          });
        });
      }, 600)()
    }
  }
};
</script>

<style lang="scss" scope>
@import '../../static/tabbar/find.scss';
$pageBgColor: #f7f7f7;
$borderColor: #e9e9e9;
$placerColor: #cccccc;
$titleColor: #888888;
$greenColor: #00a680;
page {
  background: #f7f7f7;
}
.find-page {
  // position: relative;
  .statusBar {
    background-color: white;
    position: fixed;
    top: 0;
    left: 0;
    z-index: 100;
    animation: fade 0.1s ease;
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
    box-sizing: border-box;
    overflow: hidden;
    transition: all 0.1s ease-in;

    .barLeft {
      width: 120rpx;
      height: 100%;
      display: flex;
      align-items: center;
      border-radius: 50rpx;
      // justify-content: space-between;

      .barLeftText {
        width: 85rpx;
        font-size: 26rpx;
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
        // margin-left: 30rpx;
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
    min-height: 400rpx;
    max-height: 440rpx;
    height: 25vh;
    position: relative;
    // background: url($homeBG) 0 0 no-repeat;
    background: url($findHeadBG) 0 0 no-repeat;
    background-color: #f7f7f7;
    // background-size: 100% auto;
    // background-size: cover;
    box-sizing: border-box;
    overflow: hidden;
    border-bottom-right-radius: 60rpx 10%;
    border-bottom-left-radius: 60rpx 10%;

    .header {
      // position: relative;
      padding-top: 20rpx;

      .header-top {
        z-index: 10;
        padding-left: 40rpx;
        box-sizing: border-box;
        display: flex;
        align-items: center;
        box-sizing: border-box;
        // height: 300rpx;
        line-height: 100rpx;
        .userAvatar {
          overflow: hidden;
        }
        .userName {
          font-size: 40rpx;
          font-weight: 600;
          margin-left: 30rpx;
          color: white;
        }
      }
      .home-head-group {
        // padding: 60rpx 0rpx 170rpx 0rpx;
        height: 200rpx;
        // padding-top: 30rpx;
        box-sizing: border-box;
        display: flex;
        z-index: 10;
        align-items: flex-start;
        .menuBox {
          width: 100%;
          height: 100rpx;
          display: flex;
          justify-content: center;
          padding-top: 50rpx;
          padding-bottom: 20rpx;
          align-items: center;
          // transform: translateY(-110rpx);
          // position: fixed;
          // top: 0rpx;
          // left: 0rpx;
          // margin-top: -60rpx;
          .menuItem {
            width: 33%;
            text-align: center;
            color: white;
            .count {
              font-size: 40rpx;
              font-weight: 700;
            }
            .text {
              padding-top: 10rpx;
              font-size: 28rpx;
            }
          }
          .line {
            width: 2rpx;
            height: 60rpx;
            background-color: white;
            margin: 0rpx 70rpx 0rpx 70rpx;
          }
          .menuBorder {
            position: relative;
          }
        }
      }
    }
  }
  $searchHeight: 72rpx;
  .invitation {
    width: 750rpx;
    height: 50rpx;
    position: relative;
    .contentBox {
      width: 690rpx;
      height: 100rpx;
      background-color: white;
      position: absolute;
      left: 50%;
      bottom: 0;
      transform: translateX(-50%);
      display: flex;
      justify-content: space-between;
      border-radius: 8rpx;
      align-items: center;
      padding: 0rpx 20rpx 0rpx 20rpx;
      .boxCenter {
        flex-grow: 1;
        padding-left: 30rpx;
        view:nth-child(1) {
          font-size: 28rpx;
          font-weight: 600;
        }
        view:nth-child(2) {
          font-size: 24rpx;
        }
      }
      .boxRight {
        display: flex;
        align-items: center;
        view:nth-child(1) {
          font-size: 32rpx;
          padding-right: 10rpx;
        }
        .arrow {
          margin-top: 6rpx;
        }
      }
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
    }
  }
  .find-select {
    box-sizing: border-box;
    padding: 0rpx 50rpx 0rpx 50rpx;
    width: 750rpx;
    height: 100rpx;
    background-color: #f7f7f7;
    display: flex;
    align-items: center;
    justify-content: space-between;
    border-bottom: solid 1rpx #eaeaea;
    position: relative;
    z-index: 99;
    .select-left {
      width: 480rpx;
      display: flex;
      font-size: 24rpx;
      justify-content: space-between;
      height: 100%;

      .select-area {
        width: 160rpx;
        display: flex;
        align-items: center;
        .text {
          max-width: 100rpx;
          overflow: hidden;
          text-overflow: ellipsis;
          white-space: nowrap;
        }
        image {
          transition: 0.3s;
        }
      }
    }
    .addBox {
      height: 100%;
      display: flex;
      align-items: center;
      .addHome {
        width: 160rpx;
        border: solid 1.5rpx #47bda2;
        color: #47bda2;
        padding: 6rpx;
        border-radius: 100rpx;
        text-align: center;
        font-size: 24rpx;
      }
    }
    .down-menu {
      width: 750rpx;
      position: absolute;
      top: 99rpx;
      right: 0;
      z-index: 1;
      background-color: #f7f7f7;
      font-size: 24rpx;
      transition: all 0.3s ease-in-out;
      .menu-item {
        width: 750rpx;
        height: 70rpx;
        line-height: 70rpx;
        padding: 0rpx 0rpx 0rpx 50rpx;
        border-bottom: solid 1rpx#eaeaea;
      }
    }
    .down-mask {
      width: 100%;
      height: 100%;
      background-color: rgba(0, 0, 0, 0.4);
      position: fixed;
      bottom: 0;
      left: 0;
      z-index: 0;
      animation: fade 0.1s ease-in-out;
    }
  }
  .scrollBox {
    .contacts {
      font-size: 30rpx;
      padding: 20rpx 0rpx 20rpx 30rpx;
      display: flex;
      // height: 120rpx;
      //align-items: flex-start;
      align-items: center;
      background-color: white;
      border-bottom: solid calc(1px / 2.5) #d9d9d9;
      .contactsLeft {
        margin-right: 30rpx;
        //min-width: 70rpx;
      }
      .contactsRight {
        flex-grow: 1;
        // border-bottom: solid 4rpx $borderColor;
        // height: 160rpx;
        display: flex;
        flex-direction: column;
        // align-items: center;
        justify-content: center;
        .rightTop {
          display: flex;
          align-items: center;
          font-size: 30rpx;
          .userName {
            font-weight: 800;
          }
          view {
            margin-right: 20rpx;
          }
        }
        .rightBottom {
          display: flex;
          flex-wrap: wrap;
          .bottomTag {
            display: inline-block;
            font-size: 24rpx;
            background-color: #f8f8f8;
            color: $titleColor;
            padding: 2rpx 8rpx;
            margin-right: 20rpx;
            margin-top: 10rpx;
            border-radius: 4rpx;
            max-width: 160rpx;
            overflow: hidden;
            text-overflow: ellipsis;
            white-space: nowrap;
          }
        }
      }
      &:active {
        background-color: #fafafa;
      }
    }

    .allNum {
      width: 750rpx;
      height: 50px;
      text-align: center;
      line-height: 50px;
      color: $titleColor;
    }
  }
}
@keyframes fade {
  0% {
    opacity: 0;
  }
  20% {
    opacity: 0;
  }
  40% {
    opacity: 0;
  }
  60% {
    opacity: 0;
  }
  80% {
    opacity: 1;
  }
  100% {
    opacity: 1;
  }
}
</style>


