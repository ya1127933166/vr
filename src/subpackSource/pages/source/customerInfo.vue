<template>
  <!-- 客户信息 -->
  <view class='customerInfo'>
    <view class='infoHeader'>
      <image mode="aspectFill"
             class='infoLeft'
             style="width:70rpx;height:70rpx;"
             :src="userDetail.avatar_url==''?'https://uss.img.lezhulife.com/xcxicon/defaultAvatar.png':userDetail.avatar_url"></image>
      <view class='infoCenter'>
        <view class='user'>
          <view class="userName">{{userDetail.customer_name}}</view>
          <image v-if='userDetail.gender'
                 style="width:30rpx;height:30rpx;"
                 :src="userDetail.gender==2?'https://uss.img.lezhulife.com/xcxicon/woman.png':'https://uss.img.lezhulife.com/xcxicon/man.png'"></image>

        </view>
        <view class="phone"
              @tap="callPhone">
          <view style="color:#55b3e4;margin-right:10rpx;"
                class='cuIcon-mobilefill'></view>
          <view style="color:#55b3e4;">{{userDetail.phone_no}}</view>
        </view>
        <view v-if="userDetail.wechat_no&&userDetail.wechat_no!=''"
              class='weixin'
              @tap="copyWeixin">
          <view style="color:#24db5a;margin-right:10rpx;"
                class='cuIcon-weixin'></view>
          <view style="color:#24db5a;">{{userDetail.wechat_no}}</view>
        </view>
      </view>
      <view class='infoRight'>来自于{{userDetail.add_staff_name}}</view>
    </view>
    <view class='infoBox'>
      <view class='normal'
            @tap="toFollowRecord">
        <view class='left'>跟进记录</view>
        <input disabled
               class='center'
               :placeholder-style="'color:'+(userDetail.followup_last_time==''?'#cccccc':'black')"
               placeholder-class="center"
               :placeholder="userDetail.followup_last_time==''?'暂无':userDetail.followup_last_time" />
        <view v-if="userDetail.followup_last_time"
              class='cuIcon-right'></view>
      </view>
      <view @tap="toSelectTag"
            class='normal tagItem'
            style="height:auto;padding:30rpx 40rpx 30rpx 40rpx;">
        <view style="min-width:140rpx"
              class='left'>标签</view>
        <view class='center'>
          <block v-if="tags&&tags.length">
            <view class="tagBox">
              <view v-for="(item,index) in tags"
                    :key="index"
                    class="tag">{{item}}</view>
            </view>
          </block>
          <view v-else
                class="tagBox">
            <view style="color:#cccccc">暂无</view>
          </view>
        </view>
        <view class='cuIcon-right'></view>
      </view>
      <view class='normal note'>
        <view class='left'>备注/描述</view>
        <view class='center'></view>
      </view>
      <textarea disabled
                class='noteArea'
                :placeholder-style="'color:'+(userDetail.remark?'black':'#cccccc')+';font-size:30rpx;'"
                :placeholder="userDetail.remark?userDetail.remark:'暂无'"></textarea>
    </view>

    <view class='title'></view>
    <view class='infoBox'>
      <view class='normal'>
        <view class='left'>添加人</view>
        <input disabled
               class='center'
               placeholder-style="color:black"
               placeholder-class="center"
               :placeholder="userDetail.add_staff_name" />
        <!-- <view class='cuIcon-right'></view> -->
      </view>
      <view class='normal'>
        <view class='left'>添加时间</view>
        <input disabled
               class='center'
               placeholder-style="color:black"
               placeholder-class="center"
               :placeholder="userDetail.add_time" />
        <!-- <view class='cuIcon-right'></view> -->
      </view>
    </view>

    <view class='bottomBar'>
      <view class='more'
            @click="this.isShowModal1 = true">
        <view class="cuIcon-more"></view>
        <view>更多</view>
      </view>
      <view class='call'
            @tap="callPhone">
        <view class="cuIcon-dianhua"></view>
        <view>拨打电话</view>
      </view>
      <view class='write'
            @tap="toFollow">
        <image style="width:50rpx;height:50rpx;"
               src='https://uss.img.lezhulife.com/xcxicon/write.png'></image>
        <view>写跟进记录</view>
      </view>
    </view>
    <Modal1 :isShow="isShowModal1"
            :normal="[{text:'共享给同事',status:false},{text:'编辑',status:false}]"
            @clickCallBack="clickModalItem"
            @clickMaskCallBack="this.isShowModal1 = false"></Modal1>
  </view>
</template>

<script>
import { mapState, mapActions, createNamespacedHelpers } from 'vuex';
const { mapState: sourceState, mapMutations: sourceMutations, mapGetters: sourceGetter, mapActions: sourceAction } = createNamespacedHelpers('source');
import Modal1 from '../../../components/comm/modal1/modal1.vue'
import PageHeader from "@/components/comm/pageHeader/pageHeader";
export default {
  name: 'customerInfo',
  data () {
    return {
      isShowModal1: false,
      customer_id: -1,
      userDetail: {},
      tags: [],
      stuckTagCheck: false,
    }
  },
  created () {
    const that = this;
    this.$bus.$on('updateUserDetail', (pageKey = '') => {
      // console.log('updateUserDetail')
      if (pageKey === 'addCustomerEdit') {
        that.stuckTagCheck = true
      }
      this.getUserDetail()
    })
    uni.$on('addCustomer', () => {
      this.getUserDetail()
    })
  },
  onLoad (options) {
    if (options && options.customer_id) {
      this.customer_id = options.customer_id
    }
    // this.getnewewregistration();
  },
  onShow () {
    const { is_delete } = this.sourceUserDetail()
    const tagListStr = this.tagList.join(',');
    const { tags, customer_id } = this.userDetail || {};
    // console.log('onShow', this.stuckTagCheck)
    this.tags = this.tagList;
    // 如果从编辑页返回,则重新装填数据 否则检查是否标签已改变,改变则是从标签编辑返回,需要更新数据
    if (!is_delete && !this.stuckTagCheck && customer_id && (tags !== tagListStr)) {
      this.editUser({ cleanTag: false })
      this.userDetail.tags = this.tagList
    }
    this.isShowModal1 = false
  },
  mounted () {
    // console.log('mounted', this.tagList.join())
    this.getUserDetail();
  },
  //页面销毁时清除监听
  beforeDestroy () {
    this.$bus.$off('updateUserDetail')
    const { is_delete } = this.sourceUserDetail()
    // console.warn('on customerInfo unload', is_delete)
    //如标签发生改变，则编辑用户信息
    if (!is_delete && this.userDetail.tags != this.tagList.join(',')) {
      // console.log('change', this.userDetail, this.tagList )
      this.editUser();
      this.$store.state.mineNeedRefresh = true;
    } else {
      this.resetTags()
    }
  },
  computed: {
    ...mapState({
      currentOrganization: state => state.currentOrganization,
    }),
    ...sourceState({
      enterpriseTag: state => state.enterpriseTag,
      personalTag: state => state.personalTag,
      storeUserDetail: state => state.userDetail
    }),
    tagList () {
      let storeTag = this.selectTag()
      let tags = []
      if (storeTag.length > 0) {
        storeTag.forEach(ele => {
          tags.push(ele.text)
        })
      }
      return tags
    }
  },
  comments: {
    PageHeader
  },
  methods: {
    ...mapActions(['getnewewregistration']),
    ...sourceMutations(['setUserDetail', 'setCurerntFollowUser', 'updateTagList', 'setInitTag', 'resetTags']),
    ...sourceGetter(['selectTag', 'sourceUserDetail']),
    ...sourceAction(['getFollowList']),
    //获取客户信息
    async getUserDetail () {
      uni.showLoading()
      try {
        let res = await this.request({
          type: 'get',
          url: 'customer/get',
          param: {
            staff_id: this.currentOrganization.staff_id,
            customer_id: this.customer_id
          }
        })
        const { body, state } = res[1].data || {}
        uni.hideLoading()
        if (+state === 200) {
          this.userDetail = body
          const { tags } = body
          // console.log('获取客户信息',this.userDetail)
          if (tags) {
            this.tags = tags.split(',')
            this.setInitTag(tags);
            // this.tags = tags
          }
        } else {
          uni.showToast({
            title: this.$throwStatusCode(res[1].data.state, '获取用户详情'),
            icon: 'none'
          })
        }
      } catch (error) {
        console.warn(error);
        uni.showToast({
          title: '系统繁忙，请稍后再试',
          icon: 'none'
        })
      }
    },
    //编辑客户
    editUser (params = { cleanTag: true }) {
      let { customer_id, customer_name, phone_no, gender, wechat_no, tags, remark } = this.userDetail;
      // console.log(this.userDetail,'客户详情', params.cleanTag, 'tags=',tags, 'tagList',this.tagList);
      this.request({
        url: 'customer/update',
        type: 'post',
        param: {
          customer_id,
          name: customer_name,
          phone_no,
          gender: gender == '男' ? 1 : 2,
          wechat_no,
          tag: this.tagList.join(','),
          remark
        }
      }).then((res) => {
        if (res[1].data.state != 200) {
          uni.showToast({
            title: this.$throwStatusCode(res[1].data.state, '更新客户'),
            icon: 'none'
          })
        } else {
          this.$utils.storeCurrentPage('other')
          if (params.cleanTag) {
            this.$bus.$emit('changeAuth')
            this.resetTags()
          }
        }
        // console.log(res,'获取');
      })
    },
    //模态框回调
    clickModalItem (e) {
      this.setUserDetail(this.userDetail)
      if (e.currentTarget.dataset.item.text == '共享给同事') {
        uni.navigateTo({
          url: `../../../subpackAddrlist/pages/addrList/addrList?type=选择客户`
        })
      } else {

        wx.navigateTo({
          url: `../../../subpackSource/pages/source/addCustomer?type=编辑客户`,
        })
      }
      this.isShowModal1 = false
    },
    //拨打电话
    callPhone () {
      uni.showModal({
        content: '确定拨打' + this.userDetail.phone_no,
        success: (res) => {
          if (res.confirm) {
            uni.makePhoneCall({
              phoneNumber: this.userDetail.phone_no //仅为示例
            });
          } else if (res.cancel) {
          }
        }
      })

    },
    //复制微信
    copyWeixin () {
      uni.setClipboardData({
        data: this.userDetail.wechat_no,
        success: function () {

        }
      });
    },
    //新增跟进记录页面
    toFollow () {
      this.setCurerntFollowUser({ customer_id: this.userDetail.customer_id, customer_name: this.userDetail.customer_name })
      uni.navigateTo({
        url: `../../../subpackSource/pages/source/follow/addFollow?type=yes&type1=customer`,
      })
    },
    //去跟进记录
    toFollowRecord () {
      if (this.userDetail && this.userDetail.followup_last_time) {
        this.getFollowList({ customer_id: this.userDetail.customer_id })
        wx.navigateTo({
          url: '../../../subpackSource/pages/source/follow/followContent',
        })
      }
    },
    //去选择标签
    toSelectTag () {
      uni.navigateTo({
        url: '../../../subpackSource/pages/source/tag'
      })
    },
  },
  components: {
    Modal1
  }
}
</script>

<style lang='scss' scoped>
$pageBgColor: #f7f7f7;
$borderColor: #e9e9e9;
$placerColor: #cccccc;
$titleColor: #888888;
$greenColor: #00a680;
.customerInfo {
  .title {
    width: 750rpx;
    height: 30rpx;
  }
  .infoHeader {
    width: 690rpx;
    height: 240rpx;
    background-color: white;
    margin: 30rpx auto 30rpx auto;
    box-sizing: border-box;
    padding: 30rpx 20rpx 10rpx 30rpx;
    display: flex;
    position: relative;
    font-size: 30rpx;
    border-radius: 8rpx;
    // .infoLeft{

    // }
    .infoCenter {
      padding-left: 30rpx;
      .user,
      .phone,
      .weixin {
        display: flex;
        align-items: center;
      }
      .user {
        .userName {
          font-weight: 800;
        }
        image {
          margin-left: 20rpx;
        }
      }
      .phone {
        padding-top: 40rpx;
      }
      .weixin {
        padding-top: 10rpx;
      }
    }
    .infoRight {
      position: absolute;
      bottom: 10rpx;
      right: 20rpx;
      color: #dad6d6;
      font-size: 28rpx;
    }
  }
  .infoBox {
    background-color: white;
    box-sizing: border-box;
    .normal {
      padding: 0rpx 40rpx 0rpx 40rpx;
      display: flex;
      justify-content: space-between;
      align-items: center;
      height: 100rpx;
      border-bottom: solid calc(1px / 2.5) #d9d9d9;
      position: relative;
      font-size: 30rpx;
      .normalLeft {
        display: flex;
        align-items: center;
        view:nth-child(1) {
          font-size: 42rpx;
          color: #0080f0;
          padding-right: 20rpx;
        }
      }
      .pickBox {
        flex-grow: 1;
        display: flex;
        justify-content: space-between;
        .pickItem {
          position: absolute;
          height: 100rpx;
          width: 600rpx;
          display: flex;
          left: 80rpx;
          top: 0;
          align-items: center;
          .picker {
            padding-right: 20rpx;
            color: $placerColor;
          }
        }
      }
      .left {
        width: 260rpx;
      }
      .center {
        flex-grow: 1;
        // color: #cccccc;
        font-size: 30rpx;
        align-items: center;
        // background-color: yellowgreen;
        .tagBox {
          display: flex;
          flex-wrap: wrap;
          .tag {
            display: inline-block;
            color: #5b5b5b;
            background-color: #ededed;
            font-size: 30rpx;
            text-align: center;
            padding: 4rpx 10rpx;
            margin: 8rpx;
            // max-width: 200rpx;
            // overflow: hidden;
            // text-overflow: ellipsis;
            // white-space: nowrap;
            border-radius: 6rpx;
          }
        }

        .btnBox {
          display: flex;
          view {
            width: 150rpx;
            height: 50rpx;
            border-radius: 30rpx;
            font-size: 28rpx;
            text-align: center;
            line-height: 50rpx;
            margin-right: 20rpx;
          }
          view:nth-child(1) {
            border: solid 1rpx $titleColor;
            color: black;
          }
          view:nth-child(2) {
            border: solid 1rpx $greenColor;
            color: $greenColor;
          }
        }
      }
      .right {
        display: flex;
        align-items: center;
        view {
          color: black;
          font-weight: 600;
        }
        image {
          margin-left: 20rpx;
        }
      }
      &:active,
      &:active + .noteArea {
        background-color: #fafafa;
      }
    }
    .tagItem {
      // padding: 0rpx 40rpx 0rpx 40rpx;
      align-items: center;
    }
    .normal:last-child {
      border: none;
    }
    .note {
      border: none;
      .center {
        text-align: right;
      }
    }
    .noteArea {
      height: 140rpx;
      padding: 0rpx 40rpx 20rpx 40rpx;
    }
  }
  .bottomBar {
    position: fixed;
    bottom: 0;
    left: 0;
    width: 750rpx;
    height: 120rpx;
    background-color: white;
    display: flex;
    align-items: center;
    justify-content: space-around;
    z-index: 10;
    .more,
    .call {
      // background-color: $greenColor;
      text-align: center;
      height: 100%;
      display: flex;
      align-items: center;
      flex-direction: column;
      justify-content: center;
      view:nth-child(1) {
        color: rgb(158, 157, 157);
        font-size: 40rpx;
      }
      view:nth-child(2) {
        font-size: 30rpx;
      }
      // &:active{
      //     // background-color: #dddddd;
      // }
    }
    .write {
      width: 260rpx;
      background-color: $greenColor;
      color: white;
      display: flex;
      height: 70rpx;
      border-radius: 50rpx;
      justify-content: center;
      align-items: center;
      font-size: 30rpx;
      image {
        margin-right: 10rpx;
      }
    }
  }
}
</style>
