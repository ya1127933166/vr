<template>
  <view class='contractBox'>
    <view @tap="selectOwner('owner')"
          class='contractItem'>
      <image mode="aspectFill"
             class='itemLeft'
             style="width:90rpx;height:90rpx;"
             src="https://uss.img.lezhulife.com/xcxicon/entrust.png"></image>
      <view class='itemCenter'>
        <view class='centerTop'>代理合同</view>
        <view class='centerBottom'>向业主签署代理合同</view>
      </view>
      <view class="cuIcon-right"></view>
    </view>
    <view @tap="selectOwner('tenant')"
          class='contractItem'>
      <image mode="aspectFill"
             class='itemLeft'
             style="width:90rpx;height:90rpx;"
             src="https://uss.img.lezhulife.com/xcxicon/lease.png"></image>
      <view class='itemCenter'>
        <view class='centerTop'>租客合同</view>
        <view class='centerBottom'>向租客签署租赁合同</view>
      </view>
      <view class="cuIcon-right"></view>
    </view>
    <Modal1 :isShow="popupShow"
            :imgList="imgList"
            @clickCallBack="contractSelect"
            @clickMaskCallBack="closePopup">
    </Modal1>
  </view>
</template>

<script>
import { createNamespacedHelpers } from 'vuex';
import Modal1 from '@/components/comm/modal1/modal1.vue';
const { mapMutations } = createNamespacedHelpers('contract')
export default {
  name: '',
  components: {
    Modal1,
  },
  data () {
    return {
      imgList: [
        // {
        //     path: 'https://uss.img.lezhulife.com/xcxicon/asgin.png',
        //     text: '签署电子合同',
        //     disable: true
        // },
        {
          path: 'https://uss.img.lezhulife.com/xcxicon/enteyHistory.png',
          text: '录入历史合同'
        },
      ],
      contractKey: '',
      popupShow: false,
    }
  },
  onLoad () {
    uni.hideLoading()
  },
  destroyed () {
    if (this.$store.state.selectCallback) {
      delete this.$store.state.selectCallback
    }
  },
  methods: {
    ...mapMutations(['setPageInfo']),
    selectOwner (key = '') {
      this.contractKey = key || ''
      this.popupShow = true;
    },
    toOwnerContract () {
      this.setPageInfo({ type: '业主合同', title: ['房源位置', '房源概况', '合同信息'], processList: [{ text: '填写房源', status: true }, { text: '合同信息', status: false }, { text: '签约', status: false }], len: [0, 25, 50] })
      this.$store.state.selectCallback = (selected) => {
        if (selected && typeof selected === 'object') {
          this.$store.state.selectedHousing = selected
          delete this.$store.state.selectCallback;
          uni.redirectTo({
            // url: '../../subpackSearch/pages/housing/searchHousing'
            // url: '../../subpackComm/pages/contractFind/contractFind',
            url: '../village/villageList?type=sale&isContract=true',
          })
        } else {
          uni.showToast({
            title: '选择了无效的选项',
            icon: 'none'
          })
          console.warn('selected is not a Object', selected)
        }
      }
      uni.navigateTo({
        url: '/pages/village/village?type=小区',
        // url: '../../subpackComm/pages/contractFind/contractFind',
        complete: this.initPage
      })
    },
    toTenantContract () {
      this.$store.state.selectCallback = (selected) => {
        if (selected && typeof selected === 'object') {
          // console.log('in callback', selected)
          this.$store.state.selectedHousing = selected
          delete this.$store.state.selectCallback;
          uni.redirectTo({
            // url: '../../subpackSearch/pages/housing/searchHousing'
            url: '../village/villageList?type=rent&isContract=true',
          })
        } else {
          uni.showToast({
            title: '选择了无效的选项',
            icon: 'none'
          })
          console.warn('selected is not a Object', selected)
        }
      }
      uni.navigateTo({
        url: '/pages/village/village?type=小区',
        // url:'../../subpackComm/pages/contractFind/contractFind',
        // url:'../../subpackTenantContract/pages/tenantContract/tenantContract',
        complete: this.initPage
      })
    },
    initPage () {
      uni.hideLoading()
      this.popupShow = false;
      this.contractKey = '';
    },
    closePopup (e) {
      // console.log('close', e)
      this.popupShow = false
    },
    contractSelect (e) {
      // console.log('contractSelect', e)
      switch (this.contractKey) {
        case 'owner': {
          this.toOwnerContract();
          break;
        }
        case 'tenant': {
          this.toTenantContract();
          break;
        }
        default: {
          console.warn('unexpect key for selectOwner', this.contractKey)
        }
      }
    }
  }
}
</script>

<style lang='scss' scoped>
.contractBox {
  padding-top: 40rpx;
  .contractItem {
    background-color: white;
    display: flex;
    align-items: center;
    width: 690rpx;
    height: 180rpx;
    margin: 0rpx auto 40rpx auto;
    box-sizing: border-box;
    padding: 0rpx 40rpx 0rpx 50rpx;
    justify-content: space-between;
    .itemCenter {
      transform: translateX(-20%);
      .centerTop {
        font-size: 36rpx;
        font-weight: 500;
      }
      .centerBottom {
        font-size: 24rpx;
        color: #969191;
        padding-top: 10rpx;
      }
    }
    &:active {
      background-color: #fafafa;
    }
  }
}
</style>
