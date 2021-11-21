<template>
  <view class="find-page">
    <view class="home-head"
          :style="'padding-top:' + statusBarHeight + 'px'">
      <view class="header"
            :style=" 'height:' + headerHeight + 'px; line-height:' + headerHeight + 'px;'">
        <view class="location-name"
              v-if="true"
              @tap="goback"
              :style="'padding-left:' + marginWidth + 'px'">
          <view style="font-size: 40rpx;transform:rotate(90deg)"
                class='cuIcon-unfold'></view>
        </view>
        <view class="app-name">管理房源</view>
      </view>
      <view class="home-head-group">
        <view class="tab">
          <view class="tabTitle"
                v-for="(item,index) in tabList"
                :key='index'
                @tap='chooseTab(item,index)'
                :style='index==indexCurry?"font-weight: 800":""'>
            {{ item }}
            <view class="line"
                  v-show='index==indexCurry'></view>
          </view>
        </view>
      </view>
    </view>
    <DropMenu id="dropdown"
              :isShowBtn='false'
              :checkout='checkout'
              :menuBar="menuBar"
              @downMenuBarClickCallBack="downMenuBarClick"
              ref="dropMenu"
              :rightButton="'+添加房源'"
              @rightButtonClickCallBack="addHouseSource"
              :isScroll="true"
              @showHeaderHandel="showHeaderCallBack"></DropMenu>
    <scroll-view :scroll-y="isShowBar"
                 :style="'height:'+(isScroll?'calc(' + scrollHeight + 'px - ' + hackHeight + 'rpx)':hackScroll+'px')+';box-sizing: border-box;'"
                 lower-threshold='75'
                 @scrolltolower='lower'>
      <block v-if="houseList.length&&houseList.length>0">
        <HouseList :indexCurry="indexCurry"
                   :List='item'
                   v-for="(item,index) in houseList"
                   :key="index"
                   class="houseList"
                   @clickItemCallBack="clickHouseItem(item)"></HouseList>
        <view v-if="isShow!=true"
              style="width:750rpx;height:100rpx;text-align:center;font-size:30rpx;color:#cccccc;line-height:100rpx">
          已加载全部
        </view>
      </block>
      <Loading v-if="isShow==true"></Loading>
      <Empty v-else-if='houseList.length==0&&isShow==false'
             @addButtonCallBack="addHouseSource"
             :isAuth='isUserInfo'
             content="暂无房源"
             buttonText="去添加房源"
             path="https://uss.img.lezhulife.com/xcxicon/empty-house.png"></Empty>
      <!-- <view style="width:100%;height:100%;background-color:red;"></view> -->
    </scroll-view>
    <Modal1 :isShow="isShowAddSource"
            :imgList="addSourceList"
            @clickCallBack="clickAddHouseCallBack"
            @clickMaskCallBack="clickAddhouseMask"></Modal1>
    <view class="icon_position"
          @tap='addHouseSource1()'>
      <view class="">
        +
      </view>
      <view class="">
        录入房源
      </view>
    </view>
  </view>
</template>
<script>

import { mapState, createNamespacedHelpers, mapMutations } from "vuex";
const { mapMutations: contractMutation, mapState: contracrState } = createNamespacedHelpers('contract');
import HouseList from "@/components/find-component/houseList.vue";
import Modal1 from '@/components/comm/modal1/modal1.vue';
import DropMenu from '@/components/comm/dropDownMenu/dropDownMenu.vue';
import Empty from '@/components/comm/emptyPrompt/emptyPrompt.vue';
import Loading from '@/components/module/loading.vue';
export default {
  name: 'houseadd',
  components: {
    HouseList,
    Modal1,
    DropMenu,
    Empty,
    Loading
  },
  data () {
    return {
      houseList: [],
      isShow: true,
      menuList: [],
      checkout: 'find',//检验所在页面
      isShowBar: true,
      boundInfo: {},
      yesterdayData: {
        houseCount: 0,
        rentCount: 0,
      },
      refreshKey: Date.now(),
      regionList: [],
      regionTopList: [],
      loading: false,
      tabbarHeight: 0,
      scrollHeight: 0,
      isShowMenu: false,
      currentMenuTitle: "默认",
      isClickBar: false,
      hackHeight: 0,
      isShowAddSource: false,
      addSourceList: [
        { text: '整租', path: 'https://uss.img.lezhulife.com/xcxicon/wholdrent.png' },
        { text: '合租', path: 'https://uss.img.lezhulife.com/xcxicon/joinrent.png' },
      ],
      screenPadding: 0,
      hackScroll: '',
      isScroll: false,
      menuBar: [
        { text: "区域", status: false, type: 0 },
        { text: "价格", status: false, type: 1 },
        { text: "户型", status: false, type: 2 },
        { text: "排序", status: false, type: 0 },
      ],
      tabList: ['二手房', '租房'],
      indexCurry: 0,
      Page: 1,
      totalPage: 1,
      pageSize: 20,
      regionId: '',
      price: '',
      roomNum: '',
      sort: '',
      wholeRoomNum: '',
      sharingRoomNum: ''

    };
  },
  onLoad () {
    // uni.hideLoading()
  },
  onShow () {
    const that = this;
    const systemInfo = this.$$globalData.systemInfo;
    //获取胶囊布局位置
    let res = wx.getMenuButtonBoundingClientRect();
    this.boundInfo = res;

    //计算底部tabbr高度
    this.tabbarHeight = systemInfo.screenHeight - 0 - systemInfo.windowHeight;
    //计算scroll-view高度
    this.scrollHeight = systemInfo.screenHeight - (this.headerHeight - 0 + this.tabbarHeight - 0 + systemInfo.statusBarHeight - 0);
    //设置兼容安卓苹果的高度
    this.hackHeight = systemInfo.system.startsWith('iOS') ? 106 : 111;

    const sys = this.$$globalData.systemInfo


    if (this.houseList.length > 0) {
      let view = uni.createSelectorQuery().in(this).select(".houseList");
      //计算是否禁止滚动
      try {
        setTimeout(() => {
          view.boundingClientRect(data => {
            if ((that.houseList.length * data.height > sys.windowHeight - 0 - data.top)) {
              that.isScroll = true
            }
          }).exec();
        }, 0)
      } catch (error) {

      }
    } else {
      //计算无数据时scroll-view高度
      let menuObj = uni.createSelectorQuery().in(this).select("#dropdown");
      setTimeout(() => {
        menuObj.boundingClientRect(res => {
          that.hackScroll = sys.windowHeight - 0 - res.top
        }).exec();
      }, 0)
    }
  },
  onPageScroll (res) {
    this.$refs.dropMenu.judgeRect()
  },
  created () {
    //获取二手房
    this.OldHouseList()
    uni.$on('updataLocation', res => {
      this.$store.commit('updateLocationInfo', res);
      this.locationInfo.id = res.id
      // console.log(this.locationInfo.id);
      // this.getAreaData();
    })
  },
  mounted () {

  },
  computed: {
    ...mapState({
      statusBarHeight: (state) => state.sys.statusBarHeight,
      headerHeight: (state) => {
        const baseHeight = state.custom.bottom + state.custom.top;
        if (state.custom.top < state.sys.statusBarHeight) {
          return (
            baseHeight + state.sys.statusBarHeight - state.sys.statusBarHeight
          );
        }
        return (
          baseHeight - state.sys.statusBarHeight - state.sys.statusBarHeight
        );
      },
      marginWidth: (state) => state.sys.windowWidth - state.custom.right,
      location: (state) => state.location,
      city: (state) => {
        if (state.location && state.location.name) {
          return state.location.name.replace("市", "");
        }
        return "";
      },
      isUser: (state) => state.user,
      isUserInfo: state => state.isUserInfo,
      locationInfo: (state) => state.locationInfo,
      isPhone: state => state.isPhone,
      customeheaderInfo (state) {
        const sys = this.$$globalData.systemInfo
        this.screenPadding = sys.windowWidth - (state.customeheaderInfo.bound.left + state.customeheaderInfo.bound.width)
        return state.customeheaderInfo
      },
      isCheckingAuth: state => state.isCheckingAuth
    }),
    ...contracrState({
      step1: state => state.step1,
      stepHouse1: state => state.stepHouse1
    })
  },
  methods: {
    // ...mapMutations()
    ...contractMutation(['setPageInfo', 'setStep1', 'setStepHouse1']),
    //返回
    goback () {
      uni.navigateBack({
        delta: -1
      })
    },
    //子组件控制是否显示头部
    showHeaderCallBack (e) {
      console.warn(e)
      this.isShowBar = e
    },
    //下拉菜单点击事件
    downMenuBarClick (e) {
      if (this.indexCurry == 0) {
        switch (e.index) {
          case 0:
            this.regionId = e.test
            break;
          case 1:
            if (e.test == '50万以下') {
              this.price = '0-50'
            } else if (e.test == "300万以上") {
              this.price = '300'
            } else {
              let temp = e.test.substring(0, e.test.length - 1)
              this.price = temp
            }
            break;
          case 2:
            let temp = []
            let flag = e.test
            for (let i = 0; i <= flag.length - 1; i++) {
              if (flag[i] != '5居以上') {
                temp[i] = flag[i].substring(0, flag[i].length - 1)
              } else {
                temp[i] = 6
              }
            }
            temp = temp.join(',')
            this.roomNum = temp
            break;
          case 3:
            switch (e.test) {
              case '总价从低到高':
                this.sort = 2
                break;
              case '总价从高到低':
                this.sort = 3
                break;
              case '面积从大到小':
                this.sort = 5
                break;
            }
            break;
        }
        //改变条件，获取二手房列表
        this.houseList = []
        this.Page = 1
        this.totalPage = 1
        this.pageSize = 20
        this.OldHouseList()
      } else if (this.indexCurry == 1) {
        switch (e.index) {
          case 0:
            this.regionId = e.test
            break;
          case 1:
            if (e.test == '1000以下') {
              this.price = '0-1000'
            } else if (e.test == "4000以上") {
              this.price = '4000'
            } else {
              let temp = e.test
              this.price = temp
            }
            break;
          case 2:
            if (e.test.z != 'undefined') {
              let arr1 = []
              let arr2 = []
              let z = e.test.z
              for (let i = 0; i <= z.length - 1; i++) {
                if (z[i] != '4居以上') {
                  arr1[i] = z[i].substring(0, z[i].length - 1)
                } else {
                  arr1[i] = 4
                }
              }
              arr1 = arr1.join(',')
              this.wholeRoomNum = arr1
              let h = e.test.h
              for (let i = 0; i <= h.length - 1; i++) {
                if (h[i] != '4居以上') {
                  arr2[i] = h[i].substring(0, h[i].length - 1)
                } else {
                  arr2[i] = 4
                }
              }
              arr2 = arr2.join(',')
              this.sharingRoomNum = arr2
            } else {
              let temp = []
              let flag = e.test
              for (let i = 0; i <= flag.length - 1; i++) {
                if (flag[i] != '5居以上') {
                  temp[i] = flag[i].substring(0, flag[i].length - 1)
                } else {
                  temp[i] = 6
                }
              }
              temp = temp.join(',')
              this.roomNum = temp
            }
            break;
          case 3:
            switch (e.test) {
              case '最新发布':
                this.sort = 1
                break;
              case '总价从低到高':
                this.sort = 2
                break;
              case '总价从高到低':
                this.sort = 3
                break;
              case '面积从小到大':
                this.sort = 4
                break;
              case '面积从大到小':
                this.sort = 5
                break;
            }
            break;
        }
        this.houseList = []
        this.Page = 1
        this.totalPage = 1
        this.pageSize = 20
        this.RentHouseList()
      }
    },
    //empty组件回调 添加房源
    addHouseSource (res) {
      this.$utils.debounce(() => {
        if (this.isUserInfo == false) {
          uni.showLoading({
            title: '加载中...',
          });
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
              uni.hideLoading()
              uni.showToast({
                title: '授权成功',
                icon: 'success'
              })
            } else {
              uni.hideLoading()
              uni.showToast({
                title: this.$throwStatusCode(res[1].data.state, '授权用户信息'),
                icon: 'none'
              })
            }
            return
          })
        }
        if (this.indexCurry == 1) {
          // 打开租房模态框 选择租房类型
          this.isShowAddSource = true;
        } else {
          if (!this.checkLogin1()) {
            return
          }
          this.setPageInfo({ type: '二手房源', title: ['二手房源', '二手房源'], processList: [{ text: '房屋概况', status: true }, { text: '设置售价', status: false }, { text: '完成', status: false }], len: [0, 50] })
          uni.navigateTo({
            url: '../../../pages/addHouseSource/stephouse1?type=0'
          })
        }
      }, 600)()
    },
    //添加房源
    addHouseSource1 () {

      this.$utils.debounce(() => {

        if (this.isUserInfo == false) {
          wx.getUserProfile({
            desc: '用于完善用户资料',
            lang: 'zh_CN',
            success: (item) => {
              let res = item
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
                  uni.hideLoading()
                  uni.showToast({
                    title: '授权成功',
                    icon: 'success'
                  })
                  this.getIn()
                } else {
                  uni.hideLoading()
                  uni.showToast({
                    title: this.$throwStatusCode(res[1].data.state, '授权用户信息'),
                    icon: 'none'
                  })
                }
                return
              })
            },
            fail: function (item) {

            },
            complete: () => {
              uni.hideLoading()
            }
          })
          uni.showLoading({
            title: '加载中...',
          });

        } else {
          this.getIn()
        }

      }, 600)()
    },
    //进入添加房源
    getIn () {
      if (this.indexCurry == 1) {
        // 打开租房模态框 选择租房类型
        this.isShowAddSource = true;
      } else {
        // 验证身份后继续
        // uni.showLoading({
        //     title: '加载中...',
        // });
        if (!this.checkLogin1()) {
          return
        }
        // this.checkLogin(() => {return});
        //初始化合同页面配置
        this.setPageInfo({ type: '二手房源', title: ['二手房源', '二手房源'], processList: [{ text: '房屋概况', status: true }, { text: '设置售价', status: false }, { text: '完成', status: false }], len: [0, 50] })
        let temp = Array.from(this.step1);
        // temp[0]=e.currentTarget.dataset.item.text;
        this.setStep1(temp)
        uni.navigateTo({
          url: '../../../pages/addHouseSource/stephouse1?type=0'
        })
      }
    },
    //到底加载
    lower (e) {
      // this.Page = this.Page +1
      if (this.indexCurry == 0) {
        this.OldHouseList()
      } else if (this.indexCurry == 1) {
        this.RentHouseList()
      }
    },
    //获取下拉菜单区域数据
    async getAreaData () {
      try {
        let res = await this.request({
          url: 'cities/region',
          type: 'get',
          param: {
            cityId: this.locationInfo.id
          }
        })
        if (res[1].data.state == 200) {
          let temp = res[1].data.body.map(ele => {
            return { text: ele.name, status: false, type: 0 }
          })
          temp.unshift({ text: '区域', status: false, type: 0 }, { text: '全部区域', status: true, type: 0 })
          this.list[0] = temp;

        } else {
          uni.showToast({
            title: this.$throwStatusCode(res[1].data.state, '获取区域数据'),
            icon: 'none'
          })
        }
      } catch (err) {
        console.log(err);
      }
    },
    //添加房源回调
    clickAddHouseCallBack (e) {
      uni.hideLoading()
      let title = e.currentTarget.dataset.item.text + "房源"
      //初始化合同页面配置
      this.setPageInfo({ type: '添加房源', title: [`${title}`, `${title}`], processList: [{ text: '房屋概况', status: true }, { text: '设置价格', status: false }, { text: '完成', status: false }], len: [0, 50] })
      let temp = Array.from(this.stepHouse1);
      temp[0] = title
      this.setStepHouse1(temp)
      uni.navigateTo({
        url: '../../../pages/addHouseSource/step1'
      })

    },
    //添加房源遮罩点击
    clickAddhouseMask () {
      this.isShowAddSource = false
    },
    //点击列表的回调
    clickHouseItem (item) {
      //二手房请详页面 0表示二手房
      if (this.indexCurry == 0) {
        let obj = {}
        obj.id = item.houseSale.id
        obj.name = item.house.name
        uni.showLoading({
          title: '加载中...',
        });
        this.$$globalData.jumpPath = '../../../subpackComm/pages/viewHousing/viewHousing'
        this.checkLogin(() => {
          uni.navigateTo({
            url: '../../../subpackComm/pages/viewHousing/viewHousing?type=1&houseId=' + JSON.stringify(obj),
          })
        })
      }
      //租房请详页面  1表示租房
      if (this.indexCurry == 1) {
        uni.showLoading({
          title: '加载中...',
        });
        let obj = {}
        obj.id = item.rentId
        obj.name = item.name
        this.$$globalData.jumpPath = '../../../subpackComm/pages/viewHousing/viewHousing1'
        this.checkLogin(() => {
          uni.navigateTo({
            url: '../../../subpackComm/pages/viewHousing/viewHousing1?type=1&houseId=' + JSON.stringify(obj),
          })
        })
      }
    },
    /**
      * 确认用户已登录
      */
    checkLogin (cb) {
      //若没有确认身份再次确认
      if (!this.isPhone) {
        // 触发用户登录流程
        this.$login();
        return false;
      }
      cb();
    },
    checkLogin1 () {

      if (!this.isPhone) {
        this.$login();
        return false;
      }
      return true
    },
    toLocation () {
      this.$utils.debounce(() => {
        this.$refs.dropMenu.clickMaskHandel()
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
        this.$$globalData.jumpPath = "/pages/search/search"
        // 验证身份后继续
        this.checkLogin(() => {
          uni.navigateTo({
            url: "/pages/search/search",
          });
        });
      }, 600)()
    },
    chooseTab (item, index) {
      this.$utils.debounce(() => {
        this.$refs.dropMenu.isShowMenu = false
        this.houseList = []
        // this.regionId=''
        this.price = ''
        this.roomNum = ''
        this.sort = ''
        this.wholeRoomNum = ''
        this.sharingRoomNum = ''
        this.Page = 1
        this.totalPage = 1
        this.pageSize = 20
        // this.isShow= false
        this.checkLogin(() => {
          this.indexCurry = index
          // 0二手房 1租房
          if (index == 0) {
            // uni.hideLoading()
            this.OldHouseList()
            uni.$emit('updata', { index })
          } else if (index == 1) {
            // uni.hideLoading()
            this.RentHouseList()
            uni.$emit('updata', { index })
          }
        })
      }, 600)()
    },
    //二手房查询列表
    async OldHouseList () {
      this.isShow = true
      let temp = {
        cityId: this.locationInfo.id,
        currentPage: this.Page,
        pageSizes: this.pageSize,
        regionId: this.regionId,
        price: this.price,
        roomNum: this.roomNum,
        sort: this.sort
      }
      if (this.Page <= this.totalPage) {
        uni.showLoading({
          title: '加载中...'
        })
        try {
          let res = await this.request({
            url: 'admin/house/sale/list',
            type: 'post',
            param: temp
          })
          if (res[1].data.state == 200) {
            uni.hideLoading()
            const { body } = res[1].data
            //图片加水印
            body.forEach(ele => {
              ele.publicPics[0] = ele.publicPics[0] + this.$imageSmall
            })
            this.Page += 1
            if (body.length == 20) {
              this.totalPage += 1
              this.isShow = false
            }
            this.houseList = this.houseList.concat(body)
          } else {
            uni.hideLoading()
            uni.showToast({
              title: this.$throwStatusCode(res[1].data.state, '获取二手房列表'),
              icon: 'none'
            })
            this.isShow = false
          }
        } catch (err) {
          console.log(err)
        }
      }
      setTimeout(() => {
        this.isShow = false
      }, 1000)
    },
    //租房查询列表
    async RentHouseList () {
      this.isShow = true
      let temp = {
        cityId: this.locationInfo.id,
        currentPage: this.Page,
        pageSizes: this.pageSize,
        regionId: this.regionId,
        price: this.price,
        // roomNum:this.roomNum,
        wholeRoomNum: this.wholeRoomNum,
        sharingRoomNum: this.sharingRoomNum,
        sort: this.sort
      }
      if (this.Page <= this.totalPage) {
        uni.showLoading({
          title: '加载中...',
        });
        try {
          let res = await this.request({
            url: 'admin/house/rent/list',
            type: 'post',
            param: temp
          })
          if (res[1].data.state == 200) {
            const { body } = res[1].data
            //图片加水印
            body.forEach(ele => {
              ele.publicPics[0] = ele.publicPics[0] + this.$imageSmall
            })
            this.Page += 1
            if (body.length == 20) {
              this.totalPage += 1
              this.isShow = false
            }
            //限制列表展示标签个数 为3
            let arr = []
            for (let i = 0; i < body.length; i++) {
              arr[i] = body[i].property
              arr[i].length = 3
              arr[i] = arr[i].filter(ele => {
                return ele != 'null'
              })
              body[i].property = arr[i]
            }
            this.houseList = this.houseList.concat(res[1].data.body)

          } else {
            uni.hideLoading()
            uni.showToast({
              title: this.$throwStatusCode(res[1].data.state, '获取二手房列表'),
              icon: 'none'
            })
            this.isShow = false
          }
        } catch (err) {
          console.log(err)
        }
      }

      setTimeout(() => {
        uni.hideLoading()
        this.isShow = false
      }, 800)
    }
  },

};
		</script>
		
		<style lang="scss" scope>
// @import "@/static/tabbar/find.scss";
@import '../../../static/tabbar/find.scss';
page {
  background: #ffffff;
}
.find-page {
  padding-bottom: 4rpx;
  position: relative;
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
    // transform: translateY(10%);

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
    position: relative;
    background: url($findHeadBG) 0 0 no-repeat;
    background-size: 100% 450rpx;
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

      .location-icon {
        margin-right: 4rpx;
        width: 30rpx;
        height: 30rpx;
        // padding: (80rpx+ (-30rpx)) * 0.5 0;

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

    // &::before {
    //   content: "";
    //   position: absolute;
    //   bottom: 0;
    //   width: 100%;
    //   height: 80rpx;
    //   background: #fff;
    // }

    // &::after {
    //   content: "";
    //   position: absolute;
    //   bottom: 0;
    //   width: 200%;
    //   height: 240rpx;
    //   background: #fff;
    //   transform: rotate(-12deg);
    //   transform-origin: 50% 100%;
    // }
  }

  .home-head-group {
    position: relative;
    padding: 20rpx 60rpx;
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
  .tab {
    width: 100%;
    height: 50rpx;
    display: flex;
    margin-top: 30rpx;
    position: relative;
    top: -20rpx;
    left: -15rpx;
    .tabTitle {
      position: relative;
      width: 100rpx;
      color: #ffffff;
      text-align: center;
      font-size: 32rpx;
      margin-right: 20rpx;
      margin-bottom: -7rpx;
      .line {
        position: absolute;
        bottom: -8rpx;
        left: 0rpx;
        width: 50%;
        transform: translateX(50%);
        height: 6rpx;
        background-color: #ffffff;
        border-radius: 6rpx;
      }
    }

    .tabTitle:nth-childe {
      color: red;
    }
  }

  .menuBox {
    width: 100%;
    height: 100%;
    display: flex;
    justify-content: center;
    padding-top: 50rpx;
    padding-bottom: 20rpx;
    .menuItem {
      width: 33%;
      text-align: center;
      color: white;
      .count {
        font-size: 40rpx;
        font-weight: 700;
      }
      .text {
        padding-top: 20rpx;
        font-size: 28rpx;
      }
    }
    .menuBorder {
      position: relative;
    }
    .menuBorder::before {
      position: absolute;
      left: 0;
      bottom: 0;
      content: '';
      display: block;
      width: 4rpx;
      height: 70rpx;
      background-color: #6bc9af;
    }
    .menuBorder::after {
      position: absolute;
      right: 0;
      bottom: 0;
      content: '';
      display: block;
      width: 4rpx;
      height: 70rpx;
      background-color: #6bc9af;
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
  .options-group {
    padding: 40rpx 0;
    display: flex;
    flex-wrap: wrap;
    flex-direction: row;
    justify-content: space-between;

    .option-item {
      width: 290rpx;
      height: 160rpx;
      padding: 20rpx $searchHeight * 0.8;
      border: 1rpx solid #eee;
      border-radius: 8rpx;
      background: #fff;
      box-sizing: border-box;
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

  .location-name {
    padding: 0 16rpx;
    font-size: 28rpx;
    color: #444;
    display: flex;
    z-index: 10;
    .location-icon {
      position: relative;
      width: 30rpx;
      height: 100%;
      margin-right: 4rpx;
      image {
        position: absolute;
        display: block;
        top: 50%;
        left: 0;
        width: 30rpx;
        height: 30rpx;
        margin-top: -15rpx;
      }
    }
  }
}
.find-head {
  width: 690rpx;
  margin: 10rpx auto;
  padding: 20rpx;
  background: url($findHeadBG);
  background-size: cover;
  $searchHeight: 72rpx;
  .search-mode {
    position: relative;
    height: $searchHeight;
    .search-input {
      height: $searchHeight;
      padding: ($searchHeight - 60rpx) * 0.5 10rpx;
      padding-left: $searchHeight * 0.8;
      line-height: 64rpx;
      font-size: 24rpx;
      border: none;
      color: #888;
      border-radius: 4rpx;
      background: #fff;
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
}
.find-data-group {
  position: relative;
  display: flex;
  flex-wrap: wrap;
  flex-direction: row;
  justify-content: space-between;
  margin-top: 40rpx;
  margin-bottom: 10rpx;
  color: #f9f9f9;
  &::before {
    content: '';
    position: absolute;
    top: 25rpx;
    bottom: 25rpx;
    left: 50%;
    width: 2rpx;
    margin-left: -1rpx;
    background: #ccc;
  }
  .find-data-item {
    width: 310rpx;
  }
  .find-data-item-head,
  .find-data-item-foot {
    display: flex;
    flex-wrap: wrap;
    flex-direction: row;
    justify-content: center;
    height: 48rpx;
    line-height: 48rpx;
    overflow: hidden;
  }
  .find-data-value {
    font-size: 44rpx;
    font-weight: bold;
    color: #fff;
    & + .find-data-info {
      line-height: 56rpx;
      margin-left: 6rpx;
      font-size: 20rpx;
    }
  }
  .find-data-info {
    font-size: 28rpx;
  }
}
.find-data-tips {
  padding: 0 40rpx;
  line-height: 40rpx;
  font-size: 20rpx;
  text-align: right;
  color: #bbb;
}
.find-split-line {
  height: 10rpx;
  margin: 30rpx 0 0;
  background: #f5f5f5;
}
@keyframes fade {
  0% {
    opacity: 0;
  }
  100% {
    opacity: 1;
  }
}
.icon_position {
  width: 140rpx;
  height: 140rpx;
  position: fixed;
  right: 40rpx;
  bottom: 150rpx;
  border-radius: 50%;
  color: #ffffff;
  background-color: #00d4a6;
  view {
    text-align: center;
  }
  view:nth-child(1) {
    margin-top: 10rpx;
    font-size: 60rpx;
  }
  view:nth-child(2) {
    font-weight: 800;
    // margin-bottom:5rpx ;
    position: relative;
    top: -9rpx;
    left: 0;
  }
}
</style>
		
