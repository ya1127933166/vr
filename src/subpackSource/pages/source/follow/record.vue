<template>
  <!-- 跟进记录 -->
  <view class='record'>
    <scroll-view scroll-y
                 style="height:calc(100vh - 100rpx)"
                 @scrolltolower="bindScrolltolower">
      <view class='title'>跟进记录</view>
      <view v-for="(item) in followList"
            :key="item.id"
            class='recordBox'
            @tap="toRecoredDetail(item)">
        <view class='recordTop'>
          <image mode="aspectFill"
                 class='topLeft'
                 style="width:70rpx;height:70rpx;min-width:70rpx;border-radius:35px;"
                 :src="(item.avatar_url=='')?'https://uss.img.lezhulife.com/xcxicon/defaultAvatar.png':item.avatar_url"></image>
          <view class='topCenter'>
            <view>{{item.customer_name}}</view>
            <view>
              {{item.mode}}<text>|</text>
              {{item.business}}<text>|</text>
              {{item.followup_staff_name}}<text></text>
            </view>
            <view v-if="item.local_name!=''">
              <view style="color:#888888;font-size:26rpx"
                    class='cuIcon-locationfill'></view>
              <view>{{item.local_name}}</view>
            </view>
          </view>
          <view class='topRight'>{{item.followup_time}}</view>
        </view>
        <view class='recordCenter'>{{item.content}}</view>
        <view class='recordBottom'
              v-if="item.pics_array.length>0">
          <image v-for="src in item.pics_array"
                 :key="src"
                 mode="aspectFill"
                 style="width:100rpx;height:80rpx;"
                 :src="getUrl(src)"></image>
        </view>
      </view>
      <Loading v-if="isLoading"></Loading>
      <EmptyPrompt :isAuth="isUserInfo"
                   @addButtonCallBack="authUser"
                   :isContent="isUserInfo"
                   :buttonText="!isUserInfo?'请授权用户头像和昵称':''"
                   :isButton="!isUserInfo"
                   :content="followList&&followList.length==0?'暂无跟进记录':''"
                   v-if="followList.length==0||!isUserInfo"></EmptyPrompt>
      <view class="loadAll"
            v-if="stopLoad==true&&followList.length>0">已加载全部</view>
      <view style="width:750rpx;height:30rpx"></view>
    </scroll-view>
    <view @tap="toWriteRecord"
          class='writeBtn'>写跟进记录</view>
  </view>
</template>

<script>
import { createNamespacedHelpers, mapState, mapMutations } from 'vuex';
import EmptyPrompt from '../../../../components/comm/emptyPrompt/emptyPrompt.vue';
import Loading from '../../../../components/module/loading.vue'

const { mapState: sourceState, mapActions: sourceAction, mapMutations: sourceMutation } = createNamespacedHelpers('source');

export default {
  name: 'record',
  data () {
    return {
      page: 1,
      followList: [],
      stopLoad: false,
      isLoading: true
    }
  },
  onLoad () {
    uni.hideLoading()
  },
  created () {
    this.$bus.$on('updateFollowList', () => {
      this.page = 1
      this.followList = [];
      this.getFollowList();
    })
  },
  mounted () {
    this.getFollowList();
  },
  onShow () {

  },
  beforeDestroy () {
    //销毁事件监听
    this.$bus.$off('updateFollowList')
  },
  computed: {
    ...mapState({
      isUserInfo: state => state.isUserInfo,
    })
  },
  watch: {
    page (newValue, oldValue) {
      //监听page改变刷新数据
      if (newValue != 1) {
        this.getFollowList();
      }

    }
  },
  methods: {
    getUrl (item) {
      return item + this.$imageSuperSmall
    },
    ...sourceMutation(['setFollowList']),

    //授权用户昵称和头像
    async authUser (res) {
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
      }, 600)()
    },
    //去跟进记录详情
    toRecoredDetail (item) {
      uni.navigateTo({
        url: '../../../../subpackSource/pages/source/follow/followContent',
      })
      this.setFollowList([item])
    },
    //去写跟进记录页面
    toWriteRecord () {
      uni.navigateTo({
        url: '../../../../subpackSource/pages/source/follow/addFollow?type=No&type1=customer',
      })
    },
    //获取跟进列表
    async getFollowList () {
      this.isLoading = true
      try {
        let res = await this.request({
          url: 'followup/list',
          type: 'get',
          param: {
            page: this.page
          }
        })
        setTimeout(() => {
          if (res[1].data.state == 200) {
            this.followList = [...this.followList, ...res[1].data.body]
            this.isLoading = false
            if (res[1].data.body.length < 1) {
              this.stopLoad = true
            } else {
              this.stopLoad = false
            }
          } else {
            uni.showToast({
              title: this.$throwStatusCode(res[1].data.state, '获取跟进记录'),
              icon: 'none'
            })
          }
        }, 0)

      } catch (error) {
        console.log(error);
      }
    },
    //上拉加载
    bindScrolltolower () {
      if (this.stopLoad == false) {
        this.page += 1
      }
    },
  },
  components: {
    Loading,
    EmptyPrompt
  }
}
</script>

<style lang='scss' scoped>
$pageBgColor: #f7f7f7;
$borderColor: #e9e9e9;
$placerColor: #cccccc;
$titleColor: #888888;
$greenColor: #00a680;
.record {
  .title {
    padding: 40rpx 30rpx 16rpx 40rpx;
    color: $titleColor;
    font-size: 26rpx;
  }
  .recordBox {
    width: 690rpx;
    background-color: white;
    margin: 0 auto;
    padding: 30rpx;
    border-radius: 8rpx;
    margin-bottom: 30rpx;
    .recordTop {
      display: flex;
      color: $titleColor;
      position: relative;
      .topCenter {
        flex-grow: 1;
        padding-left: 30rpx;
        view:nth-child(1) {
          font-size: 32rpx;
          font-weight: 600;
          color: black;
        }
        view:nth-child(2) {
          font-size: 26rpx;
          text {
            margin: 0rpx 10rpx;
          }
        }
        view:nth-child(3) {
          display: flex;
          align-items: center;
        }
      }
      .topRight {
        position: absolute;
        font-size: 26rpx;
        color: $titleColor;
        top: 0rpx;
        right: 0rpx;
      }
    }
    .recordCenter {
      font-size: 30rpx;
      padding: 30rpx 0rpx 0rpx 0rpx;
    }
    .recordBottom {
      padding-top: 10rpx;
      image {
        border-radius: 10rpx;
        margin: 10rpx;
      }
    }
    &:active {
      background-color: #fafafa;
    }
  }
  .loadAll {
    width: 750rpx;
    text-align: center;
    font-size: 30rpx;
    color: #cccccc;
  }
  .writeBtn {
    width: 750rpx;
    height: 100rpx;
    background-color: white;
    border-top: solid 4rpx #ebeaea;
    position: fixed;
    bottom: 0rpx;
    left: 0rpx;
    text-align: center;
    line-height: 100rpx;
    font-size: 32rpx;
    color: $greenColor;
  }
}
</style>