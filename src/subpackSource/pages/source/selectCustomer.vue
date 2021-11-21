<template>
  <!-- 选择客源 -->
  <view class="selectCustomer">
    <view style="width:750rpx;height:30rpx;"></view>
    <scroll-view style="height:calc(100vh - 30rpx)"
                 scroll-y
                 class='selectBox'
                 @scrolltolower="bindScrolltolower">
      <block v-for="(item) in userList"
             :key="item">
        <view @tap="clickItem(item)"
              class="contacts"
              hover-class="hover-contacts">
          <image mode="aspectFill"
                 class='contactsLeft'
                 style="width:60rpx;height:60rpx;border-radius:30rpx"
                 :src="(item.avatar_url&&item.avatar_url!='')?item.avatar_url:'https://uss.img.lezhulife.com/xcxicon/defaultAvatar.png'"></image>
          <view class='contactsRight'>
            <view class='rightTop'>
              <view>{{item.name}}</view>
            </view>
          </view>
        </view>
      </block>
      <view v-if="stopLoad==true"
            class="loadAll">已加载全部</view>
      <Loading v-if="isLoading"></Loading>
    </scroll-view>
  </view>
</template>

<script>
import { createNamespacedHelpers } from 'vuex';
const { mapMutations: sourceMutation } = createNamespacedHelpers('source');
import Loading from '../../../components/module/loading.vue'
export default {
  name: 'selectCustomer',
  data () {
    return {
      currentPage: 1,
      userList: [],
      stopLoad: false,
      isLoading: true,
      callbackKey: '',
    }
  },
  onLoad (options) {

    const { callbackKey } = options
    if (callbackKey) {
      this.callbackKey = callbackKey
    }
  },
  mounted () {
    this.getUserList();
  },
  watch: {
    currentPage () {
      this.getUserList();
    }
  },
  methods: {
    ...sourceMutation(['setCurerntFollowUser']),
    //获取客户列表
    async getUserList () {
      this.isLoading = true
      let res = await this.request({
        url: 'customer/list',
        type: 'get',
        param: {
          add_id: '1',
          sort_id: '1',
          page: this.currentPage
        }
      })
      setTimeout(() => {
        if (res[1].data.state == 200) {
          this.userList = [...this.userList, ...res[1].data.body.customers]
          if (res[1].data.body.customers.length < 1) {
            this.stopLoad = true
          } else {
            this.stopLoad = false
          }
          this.isLoading = false
        } else {
          uni.showToast({
            title: this.$throwStatusCode(res[1].data.state, '获取列表'),
            icon: 'none'
          })
        }
      }, 0)
    },
    //列表选项点击事件
    clickItem (item) {
      // console.log('clickItem',item)
      const callbackKey = this.callbackKey
      if (callbackKey) {
        const callback = this.$store.state[callbackKey];
        if (typeof callback === "function") {
          callback(item);
        } else {
          console.warn('callback of form row has a illegal function callbackKey=', callbackKey)
        }
      } else {
        this.setCurerntFollowUser({ customer_id: item.customer_id, customer_name: item.name })
      }
      uni.navigateBack({
        delta: -1
      })
    },
    //上拉加载
    bindScrolltolower () {
      if (this.stopLoad == false) {
        this.currentPage += 1;
      }
    }
  },
  onReachBottom () {

  },
  components: {
    Loading
  }
}
</script>

<style lang='scss' scoped>
$pageBgColor: #f7f7f7;
$borderColor: #e9e9e9;
$placerColor: #cccccc;
$titleColor: #888888;
$greenColor: #00a680;
.selectCustomer {
  .selectBox {
    // margin-top: 30rpx;
    .contacts {
      padding: 0rpx 40rpx 0rpx 40rpx;
      display: flex;
      height: 100rpx;
      align-items: center;
      background-color: white;
      border-bottom: solid calc(1px / 2.5) #d9d9d9;
      // .contactsLeft{
      // 	// margin-right: 30rpx;
      // }
      &.hover-contacts {
        background-color: #e0e0e0;
      }
      .contactsRight {
        flex-grow: 1;
        //height: 160rpx;
        height: 100%;
        display: flex;
        flex-direction: column;
        // align-items: center;
        justify-content: center;
        font-size: 30rpx;
        padding-left: 30rpx;
        .rightTop {
          display: flex;
          align-items: center;
          view {
            margin-right: 20rpx;
          }
        }
        .rightBottom {
          display: flex;
          .bottomTag {
            font-size: 20rpx;
            background-color: $borderColor;
            color: $titleColor;
            padding: 4rpx;
            margin-right: 20rpx;
            margin-top: 10rpx;
          }
        }
      }
      &:last-child {
        border: none;
      }
    }
  }
  .loadAll {
    width: 750rpx;
    color: #cccccc;
    text-align: center;
    padding: 30rpx 0rpx;
    font-size: 30rpx;
  }
}
</style>
