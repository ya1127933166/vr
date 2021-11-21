<template>
  <view class="villageList">
    <view :class="['villageTop', isIOS ? 'ios-top': '']">
      <view class="searchBar">
        <view class="cuIcon-search icon"></view>
        <view @tap="hrefToVillage"
              class="search-input">
          {{searchText}}
        </view>
      </view>
      <view class="switchTabs">
        <view v-for="(tab, idx) in tabs"
              :key="idx"
              :class="['switchTabItem',(currentTabIdx === idx && 'selected') || '']"
              @tap="() => changeTab(idx)">
          {{tab.label}}
        </view>
      </view>
    </view>
    <scroll-view class="villageListScrollView"
                 scroll-y="true"
                 :lower-threshold='75'
                 @scrolltolower='lower'>
      <block v-if="houseList.length&&houseList.length>0">
        <HouseList :indexCurry="tabs[currentTabIdx].tabType === 'sale' ? 0 : 1"
                   v-for="(house,index) in houseList"
                   :List="house"
                   :key="index"
                   class="houseList"
                   @clickItemCallBack="clickHouseItem(house)">
        </HouseList>
        <view style="width:750rpx;height:100rpx;text-align:center;font-size:30rpx;color:#cccccc;line-height:100rpx">已加载全部</view>
      </block>
      <Empty v-else-if='houseList.length===0&&isShow'
             @addButtonCallBack="addHouseSource"
             :isAuth="isUserInfo"
             content="暂无房源"
             buttonText="去添加房源"
             path="https://uss.img.lezhulife.com/xcxicon/empty-house.png">

      </Empty>
      <!--			<view style="width:100%;height:100%;background-color:transparent;"></view>-->
    </scroll-view>
  </view>
</template>

<script>
import { mapState, createNamespacedHelpers } from "vuex";
import Empty from '@/components/comm/emptyPrompt/emptyPrompt.vue';
import HouseList from "@/components/find-component/houseList";
import Modal1 from "@/components/comm/modal1/modal1";
import DropMenu from "@/components/comm/dropDownMenu/dropDownMenu";
const { mapMutations } = createNamespacedHelpers('contract');
import { throttleTool } from "@/utils";

export default {
  name: "villageList",
  components: {
    HouseList,
    Modal1,
    DropMenu,
    Empty
  },

  data () {
    return {
      searchText: 'text',
      isIOS: true,
      tabs: [
        {
          label: '二手房',
          tabType: 'sale'
        },
        {
          label: '整租',
          tabType: 'allrent'
        },
        {
          label: '合租',
          tabType: 'sharerent'
        }
      ],
      selectedHousing: {},
      currentTabIdx: 0,
      houseList: [],
      currentPage: 0,
      pageOptionsType: '',
      // 是否跳转到录入合同页
      isContract: false,
      isShow: false
    }
  },
  onLoad (options) {
    const { housingId, isContract, type } = options
    let { selectedHousing } = this.$store.state;
    // console.log('onLoad',options, selectedHousing)
    /**
     *
    selectedHousing = {
        "fId": 47,
        "highlight": "双林路<span style='color:#ff0000'>1</span>号",
        "cityName": "成都",
        "quyu": "成华",
        "name": "双林路1号",
        "id": 5048,
        // "id": 1,
        "shangquan": "新华公园",
        "addr": "双林路1号",
        "type": "xiaoqu"
    }
     *
     */
    this.tabs = this._computeTabsList(type)
    type && (this.pageOptionsType = type)
    this.isContract = !!isContract
    if (selectedHousing && selectedHousing.name) {
      const { name } = selectedHousing
      this.selectedHousing = selectedHousing
      this.searchText = name
      delete this.$store.state.selectedHousing
    } else {
      console.warn('selectedHousing is null, please check params')
    }
  },
  mounted () {
    const systemInfo = this.$$globalData.systemInfo;
    const isIOS = !!systemInfo.system.startsWith('iOS');
    this.changeTab();
  },
  computed: {
    ...mapState({
      isUserInfo: state => state.isUserInfo,
      isPhone: state => state.isPhone,
    }),
  },
  methods: {
    ...mapMutations(['setPageInfo']),
    hrefToVillage () {
      this.$store.state.selectCallback = (selected) => {
        if (selected && typeof selected === 'object') {
          // console.log('in callback', selected)
          this.$store.state.selectedHousing = selected
          delete this.$store.state.selectCallback;
          uni.redirectTo({
            // url: '../../subpackSearch/pages/housing/searchHousing'
            // url: '../../subpackComm/pages/contractFind/contractFind',
            url: `./villageList?type=${this.pageOptionsType}&isContract=true`, // sale || rent
          })
        } else {
          uni.showToast({
            title: '选择了无效的选项',
            icon: 'none'
          })
          console.warn('selected is not a Object', selected)
        }
      }
      uni.redirectTo({
        url: './village?type=小区',
        // url: '../../subpackComm/pages/contractFind/contractFind',
        complete: (e) => console.log(e)
      })
    },
    changeTab (nextIdx = 0) {
      this.$utils.debounce(() => {
        this.houseList = []
        this.currentPage = 0
        this.isShow = false
        uni.showLoading({
          title: '加载中...',
        });
        this.checkLogin(() => {
          this.currentTabIdx = nextIdx
          this.getData()
        })
      }, 500)()
    },
    async getData () {
      // const {selectedHousing} = this.$store.state;
      const { id } = this.selectedHousing;
      const { tabType } = this.tabs[this.currentTabIdx]
      let temp = {
        type: tabType, // 二手房 sale  整租 allrent  合租 sharerent
        xiaoquId: id //
      }
      const parseTempType = (typeStr = '') => {
        switch (typeStr) {
          case "sale": return '二手房';
          case "allrent": return '整租';
          case "sharerent": return '合租';
          default:
            console.warn('unexpect temp type', typeStr)
            return ''
        }
      }


      if (!this.checkLogin()) {
        console.log('验证身份');
        return;
      }
      // let res =[]
      let res = await this.request({
        // url: `house/${temp.type}/xiaoqu/${temp.xiaoquId} `,
        url: `house/${temp.type}/xiaoqu/${id}`,
        type: 'get',
        param: {
          currentPage: this.currentPage + 1,
          src: 'contract'
        }
      })
      const { state, body } = res[1].data

      // console.log('res', res[1].data)
      // console.log('res', JSON.stringify(res[1].data))
      if (state === 200) {
        body.forEach(ele => {
          //图片加水印
          ele.houseImage = ele.houseImage + this.$imageSmall
        })
        // console.log(body)
        //限制列表展示标签个数 为3
        let arr = []
        // for (let i = 0; i < 10; i++) {
        //     body.push(mockRentData)
        // }

        if (tabType === 'sale') {
          for (const item of body) {
            // console.log('item', item)
            const {
              avgPrice, commissionRate,
              houseId, houseImage, houseNo, houseUnit, orientation,
              price, saleId, size, tags, title, type, xqName
            } = item

            arr.push({
              ...item,
              avgPrice, commissionRate, saleId,
              publicPics: [houseImage],
              houseId, houseUnit,
              rentalType: temp.type,
              rentalTypeStr: parseTempType(temp.type),
              property: tags.map((item) => ({ property: item })),
              xqName,
              sellPrice: avgPrice,
              houseSale: {
                listPrice: price,
              },
              house: {
                name: title,
                orientation,
                areaSize: size,
              }
            })
          }
        } else {
          for (const item of body) {
            // console.log('item', item)
            const {
              houseId, title, xqName, tags,
              houseUnit, orientation, size,
              price, payStr, houseImage,
              pledge, rentId
            } = item

            arr.push({
              ...item,
              rentId,
              areaSize: size,
              publicPics: [houseImage],
              houseId,
              pledge,
              houseUnit,
              listPrice: price,
              fullTitle: title,
              orientation,
              payType: payStr,
              rentalType: temp.type,
              rentalTypeStr: parseTempType(temp.type),
              property: tags,
              xqName,
            })
          }
        }
        if (body.length) this.currentPage += 1
        this.houseList = this.houseList.concat(arr)
        uni.hideLoading()
        this.isShow = true
      } else {
        uni.hideLoading()
        uni.showToast({
          title: this.$throwStatusCode(res[1].data.state, '获取租房列表'),
          icon: 'none'
        })
      }
    },

    //点击列表的回调
    clickHouseItem (item) {
      const { tabType } = this.tabs[this.currentTabIdx]
      let obj = {}
      const isContract = this.isContract;
      uni.showLoading({
        title: '加载中...',
      });
      // console.log('clickHouseItem',item, this.isContract, tabType)
      const { saleId, rentId, size, houseId, house, houseSale, orientation,
        fullTitle, houseUnit, xqName, rentalType, property } = item
      const {
        cityName, quyu, name,
        id: areaId, shangquan, addr
      } = this.selectedHousing
      const areaStr = [cityName, quyu, shangquan].join(' · ');
      let navUrl = ''
      switch (tabType) {
        case "sale": {
          //二手房请详页面
          obj = {
            id: saleId || '',
            name: house.name || ''
          }
          if (isContract) {
            this.$store.state.findPageClickItem = {
              ...item,
              saleId,
              "areaSize": size,
              houseId,
              "listPrice": houseSale.listPrice || '',
              "fullTitle": house.name || '',
              "orientation": house.orientation || '',
              priceUnit: '万',
              area: areaStr
            }
          }
          const jumpPath = isContract ? '../ownerContract/ownerContractRecorder' : '../../subpackComm/pages/viewHousing/viewHousing'
          this.$$globalData.jumpPath = jumpPath
          navUrl = `${jumpPath}?type=0&houseId=${JSON.stringify(obj)}`
          break;
        }
        case "allrent":
        case "sharerent": {
          //租房请详页面
          obj = isContract ? { id: rentId || '' } : { id: rentId || '', name: fullTitle || '' }
          if (isContract) {
            this.$store.state.findPageClickItem = {
              ...item,
              "areaSize": size,
              priceUnit: '元',
              area: areaStr
            }
          }
          const jumpPath = isContract ? '../../subpackTenantContract/pages/tenantContract/tenantContractRecorder'
            : '../../subpackComm/pages/viewHousing/viewHousing1?type=0&houseId=' + JSON.stringify(obj)
          // const jumpPath = '../../../pages/ownerContract/ownerContractRecorder'
          this.$$globalData.jumpPath = jumpPath
          navUrl = jumpPath

          break;
        }
        default: {
          console.warn('unexpect tabType in clickHouseItem', tabType)
        }
      }
      if (navUrl) {
        this.checkLogin(() => {
          uni.navigateTo({
            url: navUrl,
            complete: (e) => {
              // console.log('uni.navigateTo', e, navUrl)
              uni.hideLoading()
            }
          })
        })
      }
    },
    /**
     * 跳转新增房源
     */
    addHouseSource () {
      this.$utils.debounce(() => {
        const { tabType } = this.tabs[this.currentTabIdx]
        if (!this.checkLogin()) {
          console.log('验证身份');
          return
        }
        let dirUrl = '../addHouseSource/step1?type=0';
        let pageInfo = {
          type: '添加房源',
          title: ['', '添加房源'],
          processList: [{ text: '房屋概况', status: true }, { text: '设置价格', status: false }, {
            text: '完成',
            status: false
          }],
          len: [0, 50]
        }
        switch (tabType) {
          case "allrent": {
            pageInfo.title[0] = '整租房源';
            break;
          }
          case "sharerent": {
            pageInfo.title[0] = '合租房源';
            break;
          }
          case 'sale': {
            dirUrl = '../addHouseSource/stephouse1?type=0'
            pageInfo.type = '二手房源';
            pageInfo.title = ['二手房源', '二手房源'];
            pageInfo.processList = [{ text: '房屋概况', status: true }, { text: '设置售价', status: false }, {
              text: '完成',
              status: false
            }]
            break;
          }
          default: {
            console.warn('unexpect type in tabType', tabType);
            return;
          }
        }
        // console.log(pageInfo)
        this.setPageInfo({
          ...pageInfo,
        })
        // let temp = Array.from(this.step1);
        // this.setStep1(temp)
        uni.redirectTo({
          url: dirUrl,
          complete: (e) => {
            console.warn('uni.navigateTo', e, dirUrl)
          }
        })
      }, 600)()
    },
    /**
     * 确认用户已登录
     */
    checkLogin (callbackFunc) {
      //若没有确认身份再次确认
      if (!this.isPhone) {
        // 触发用户登录流程
        this.$login();
        return false;
      }
      callbackFunc && typeof callbackFunc === 'function' && callbackFunc();
      return true;
    },
    //到底加载
    lower (e) {
      this.$utils.throttleTool(() => {
        this.getData()
      }, 500)
    },
    _computeTabsList (pageType = '') {
      const tabMap = {
        sale: {
          label: '二手房',
          tabType: 'sale'
        },
        allrent: {
          label: '整租',
          tabType: 'allrent'
        },
        sharerent: {
          label: '合租',
          tabType: 'sharerent'
        }
      }
      switch (pageType) {
        case "sale": {
          return [
            tabMap[pageType]
          ]
        }
        case "rent": {
          return [
            tabMap.allrent,
            tabMap.sharerent,
          ]
        }
        default: {
          return [
            tabMap.sale,
            tabMap.allrent,
            tabMap.sharerent,
          ]
        }
      }
    }

  }
}
</script>

<style lang='scss' scoped>
$pageBgColor: #f7f7f7;
$borderColor: #e9e9e9;
$placerColor: #cccccc;
$titleColor: #888888;
$greenColor: #00a680;
.villageList {
  height: 100vh;
  background-color: white;
  border-bottom: solid calc(1px / 2.5) #d9d9d9;
  .villageTop {
    background-color: $pageBgColor;
    width: 100%;
    height: fit-content;
    min-height: 140rpx;
    display: flex;
    align-items: center;
    flex-direction: column;
    box-sizing: border-box;
    padding: 0 30rpx;
    position: sticky;
    z-index: 2;
    top: 0;
    //border-bottom: #aaaaaa solid 1px;
    //box-shadow: 0 10rpx 16rpx #aaaaaa66;
    &.ios-top {
      padding-top: 20rpx;
    }
    .searchBar {
      height: 70rpx;
      border-bottom: solid calc(1px / 2.5) #d9d9d9;
      display: flex;
      flex-grow: 1;
      border-radius: 40rpx;
      padding: 0rpx 30rpx;
      box-sizing: border-box;
      align-items: center;
      justify-content: space-between;
      width: 100%;
      box-shadow: 0 0 15rpx #cccccc;
      .search-input {
        flex-grow: 1;
        margin: 0rpx 20rpx;
        font-size: 24rpx;
        color: black;
      }
    }
    .searchText {
      width: 100rpx;
      text-align: right;
      font-size: 28rpx;
    }
    .switchTabs {
      display: flex;
      justify-content: flex-start;
      align-items: center;
      //margin-top: 12rpx;
      width: 100%;
      .switchTabItem {
        font-size: 32rpx;
        color: black;
        padding: 24rpx 18rpx 24rpx;
        margin-right: 18rpx;
        transition: color 0.3s;
        &:after {
          transition: opacity 0.3s linear, width 0.3s;
          content: '';
          height: 8rpx;
          width: 0;
          border-radius: 5rpx;
          background-color: transparent;
          opacity: 0;
          position: absolute;
          bottom: 8rpx;
          left: 50%;
          transform: translate(-50%, 100%);
        }
        &.selected {
          color: $greenColor;
          position: relative;
          &:after {
            $lineWidth: 80rpx;
            width: $lineWidth;
            opacity: 1;
            background-color: $greenColor;
          }
        }
      }
    }
  }
  .villageListScrollView {
    height: 90%;
    //height: calc(100vh - 100rpx);
  }
}
</style>
