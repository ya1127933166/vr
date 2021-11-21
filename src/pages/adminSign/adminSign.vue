<template>
  <!-- 管理签约 -->
  <view class='adminHousing'>
    <view class='adminHeader'>
      <view @tap="switchTab(item,index)"
            :class="(item.status?'headerItem':'normal')"
            v-for="(item,index) in header"
            :key="item.text">
        <view class='underLine'>{{item.text}}</view>
        <view :style="'transform-origin:'+(direction?'-150% 0%':'200% 0')+';'"
              class='line'></view>
      </view>
    </view>
    <view style="width:750rpx;height:100rpx"></view>
    <scroll-view scroll-y
                 style="height:calc( 100vh - 100rpx)">
      <block v-if="houseList.length&&houseList.length>0">
        <!-- <HouseItem :List="item"></HouseItem> -->
        <ContractList :indexCurry="indexCurry"
                      :List='item'
                      v-for="(item,index) in houseList"
                      :key="index"
                      class="houseList"
                      @tap='getDetails(item)'></ContractList>
      </block>
      <Empty v-else-if='houseList.length==0'
             @addButtonCallBack="addHouseSource"
             :isButton='isButton'
             :isAuth="isUserInfo"
             :content="content"
             :buttonText="buttonText"
             path="https://uss.img.lezhulife.com/xcxicon/empty-house.png"></Empty>
    </scroll-view>
  </view>
</template>

<script>
import { mapState } from "vuex";
import ContractList from '../../components/comm/houseItem/contractList';
import Empty from '../../components/comm/emptyPrompt/emptyPrompt.vue';

export default {
  name: 'adminHousing',
  data () {
    return {
      header: [
        { text: '全部', status: true },
        { text: '待处理', status: false },
        { text: '已处理', status: false }
      ],
      isButton: true,
      buttonText: '录入合同',
      Text: ['录入合同', '', ''],
      direction: false,
      currentIndex: 3,
      Page: 1,
      pageSize: 20,
      regionId: '',
      price: '',
      roomNum: '',
      sort: '',
      houseList: [],
      content: '暂无合同'
      // wholeRoomNum:'',
      // sharingRoomNum:''
    }
  },
  onLoad () {
    uni.hideLoading()
  },
  computed: {
    ...mapState({
      isUserInfo: (state) => state.isUserInfo,
      location: (state) => state.location
    })
  },
  onShow () {
    this.getContractList()
  },
  methods: {
    switchTab (item, index) {
      this.header.forEach((ele, i) => {
        ele.status = false
      })
      item.status = true
      if (index == 0) {
        this.isButton = true
        this.getContractList()
      } else {
        this.houseList = []
        this.isButton = false
        this.content = index == 1 ? '暂无待处理' : '暂无已处理'
      }
      this.buttonText = this.Text[index]
    },
    //查询合同列表
    async getContractList () {
      uni.showLoading({ title: '加载中...', icon: 'none' })
      try {
        let res = await this.request({
          url: 'contract/list'
        })
        if (res[1].data.state == 200) {
          this.houseList = res[1].data.body
          this.houseList.forEach(ele => {
            //图片加水印
            ele.house.houseImage = ele.house.houseImage + this.$imageSmall
          })
          uni.hideLoading()
        } else {
          uni.showToast({
            title: this.$throwStatusCode(res[1].data.state, '作废合同'),
            icon: 'none'
          })
        }
      } catch (e) {
        console.log(e)
      }
    },
    //查看详情
    getDetails (item) {
      uni.navigateTo({
        url: '../../subpackTenantContract/pages/tenantContract/detailsContract?contractId=' + item.contractId
      })
    },

    addHouseSource () {
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
            uni.navigateTo({
              url: '/pages/contractApplication/contractApplication'
            })
          } else {
            uni.showToast({
              title: this.$throwStatusCode(res[1].data.state, '授权用户信息'),
              icon: 'none'
            })
          }
        })
      } else {
        uni.navigateTo({
          url: '/pages/contractApplication/contractApplication'
        })
      }

    },

  },
  components: {
    ContractList,
    Empty
  }
}
</script>

<style lang='scss' scoped>
.adminHousing {
  background-color: white;
  min-height: 100vh;
  .adminHeader {
    background-color: white;
    display: flex;
    height: 100rpx;
    width: 750rpx;
    border-bottom: solid 4rpx #e6e6e6;
    box-sizing: border-box;
    padding: 0rpx 60rpx;
    justify-content: space-around;
    align-items: center;
    font-size: 32rpx;
    font-weight: 500;
    position: fixed;
    top: 0;
    left: 0;
    z-index: 2;
    .normal {
      width: 100%;
      height: 100%;
      text-align: center;
      line-height: 100rpx;
    }
    .headerItem {
      position: relative;
      color: #00a680;
      width: 100%;
      height: 100%;
      text-align: center;
      line-height: 100rpx;
      .line {
        position: absolute;
        left: 50%;
        transform: translateX(-50%);
        bottom: -4rpx;
        content: '';
        display: block;
        width: 80%;
        height: 6rpx;
        background-color: #00a680;
        animation: lineAnimate 0.1s ease-in;
      }
    }
    .normal,
    .headerItem {
      .underLine {
        .pointBox {
          .point {
            font-size: 16rpx;
            position: relative;
            top: -6rpx;
            margin: 0 10rpx;
          }
        }
      }
    }
  }
}

@keyframes lineAnimate {
  0% {
    // transform: scale(0);
    opacity: 0;
  }
  100% {
    // transform: scale(1);
    opacity: 1;
  }
}
</style>
