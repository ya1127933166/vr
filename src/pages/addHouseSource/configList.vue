<template>
  <view class='addHouseSource'>
    <view class='itemBoxTitle'
          style="color:gray;font-size:26rpx;padding:30rpx 0rpx 0rpx 30rpx"></view>
    <view class='selectBox'>
      <view class='itemBox'>
        <block v-for="(item,index) in list"
               :key="item.text">
          <view @tap="optionClickHandel(item.text)"
                class='selectItem'
                style="position: relative;">
            <view class='itemLeft'>{{item.text}}</view>
            <view class='itemCenter'
                  v-if="!item.isInput"
                  :style="'color:'+(item.val==='请选择'?'':'black')+';'">{{item.val}}</view>
            <view class="cuIcon-right"
                  v-if="index!=3"></view>
          </view>
        </block>
      </view>
    </view>

    <view @tap="submit"
          :style="'background-color:'+(!isChange?'#00a680':'#cccccc')+';'"
          class='nextBtn'>保存</view>
    <view style="width:750rpx;height:100rpx"></view>

  </view>
</template>

<script>
import { mapState, createNamespacedHelpers } from 'vuex';
const { mapState: contractState, mapMutations: contractMutation } = createNamespacedHelpers('contract')

export default {
  name: 'addHomeSourceStep2',
  data () {
    return {
      list: [
        { text: '电器类', isInput: false, val: '请选择' },
        { text: '家具类', isInput: false, val: '请选择' },
        { text: '钥匙凭证', isInput: false, val: '请选择' },
        { text: '', isInput: false, val: '' },
        { text: '生活费用', isInput: false, val: '请选择' },
      ],
    }
  },
  onLoad () {

  },
  onShow () {
    this.isShow()
    // let temp1 = this.$store.state.deliveryList[1].filter(ele=>{
    // 			return ele.status == true
    // })
    // let arr1 = []
    // temp1.forEach((ele,i)=>{
    // 		   arr1[i] = ele.text +':'+ele.val
    // })
    // this.list[1].val = arr1.length==0?'请选择':arr1.join(';')
  },
  computed: {
    ...contractState({
      step2: state => state.step2,
    }),
  },
  methods: {
    ...contractMutation(['setStep2']),
    optionClickHandel (item) {
      switch (item) {
        case '电器类':
          uni.navigateTo({
            url: '../../subpackTenantContract/pages/tenantContract/deliverylist?type=电器类',
          })
          break;
        case '家具类':
          uni.navigateTo({
            url: '../../subpackTenantContract/pages/tenantContract/deliverylist?type=家具类',
          })
          break;
        case '钥匙凭证':
          uni.navigateTo({
            url: '../../subpackTenantContract/pages/tenantContract/deliverylist?type=钥匙凭证',
          })
          break;
        case '生活费用':
          uni.navigateTo({
            url: '../../subpackTenantContract/pages/tenantContract/deliverylist?type=生活费用',
          })
          break;
      }
    },
    //存储渲染
    isShow () {
      for (let i = 0; i < 4; i++) {
        let temp = this.$store.state.deliveryList[i].filter(ele => {
          if (i < 3) {
            return ele.status == true
          } else if (i == 3) {
            return ele.val != ''
          }

        })
        // let temp = [i]
        let arr = [];
        temp.forEach((ele, index) => {
          arr[index] = ele.text
        })
        if (i < 3) {
          this.list[i].val = arr.length == 0 ? '请选择' : arr.join(';')
        } else {
          this.list[4].val = arr.length == 0 ? '请选择' : arr.join(';')
        }
      }
    },
    //提交按钮
    submit () {
      uni.navigateBack({
        delta: -1
      })

    },

  },

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
        box-sizing: border-box;
        align-items: center;
        border-top: solid 2rpx #ececec;
        /* border-bottom: solid 2rpx #ececec; */
        font-size: 30rpx;
        padding: 0rpx 40rpx;
        .itemLeft {
          width: 260rpx;
        }
        .itemCenter {
          flex-grow: 1;
          color: #cfcfcf;
          width: 260rpx;
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
        }
        &:active {
          background: #fafafa;
        }
      }
      .selectItem:nth-child(4) {
        height: 30rpx;
        background: #eee;
      }
      .selectItem:nth-child(5) {
        border-bottom: none;
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