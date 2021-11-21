<template>
  <!-- 成员信息 -->
  <view class='customerInfo'>
    <view class='infoHeader'>
      <image mode="aspectFill"
             class='infoLeft'
             style="width:70rpx;height:70rpx;"
             :src="memberInfo.avatar_url?memberInfo.avatar_url:'https://uss.img.lezhulife.com/xcxicon/defaultAvatar.png'"></image>
      <view class='infoCenter'>
        <view class='user'>
          <view>{{memberInfo.staff_name}}</view>
          <image style="width:30rpx;height:30rpx;"
                 :src="memberInfo.gender=='2'?'https://uss.img.lezhulife.com/xcxicon/woman.png':'https://uss.img.lezhulife.com/xcxicon/man.png'"></image>
        </view>
        <view class="phone"
              @tap="bottomBarHandler('拨打电话')">
          <view style="color:#55b3e4;"
                class='cuIcon-mobilefill'></view>
          <view style="color:#55b3e4;">{{getPhone_number}}</view>
        </view>
        <view v-if="memberInfo.wechat_no"
              class='weixin'>
          <view style="color:#24db5a;"
                class='cuIcon-weixin'></view>
          <view style="color:#24db5a;">{{memberInfo.wechat_no}}</view>
        </view>
      </view>
      <!-- <view class='infoRight'>来自于张金金</view> -->
    </view>
    <view class='infoBox'>
      <view class='normal storeNormal'
            style="height:auto">
        <view class='left'>部门/门店</view>
        <view class='center'>
          <view class="centerBox">
            <block v-for="item in memberInfo.organization"
                   :key="item.org_id">
              <view v-if="!(item.org_name=='请选择'&&memberInfo.organization.length>1)"
                    class="boxItem">{{item.org_name}}</view>
            </block>
          </view>
        </view>
      </view>
      <view id="cell">
        <view class="line"></view>
      </view>
      <view class='normal'>
        <view class='left'>职务</view>
        <input disabled
               class='center'
               placeholder-style="color:black"
               placeholder-class="center"
               :placeholder="memberInfo.position?memberInfo.position:'暂无'" />
        <!-- <view class='cuIcon-right'></view> -->
      </view>
    </view>

    <view class='title'></view>
    <view class='infoBox'>
      <view class='normal'>
        <view class='left'>添加人</view>
        <input disabled
               class='center'
               placeholder-style="color:black"
               placeholder-class="center"
               :placeholder="memberInfo.add_user_name" />
        <!-- <view class='cuIcon-right'></view> -->
      </view>
      <view id="cell">
        <view class="line"></view>
      </view>
      <view class='normal'>
        <view class='left'>添加时间</view>
        <input disabled
               class='center'
               placeholder-style="color:black"
               placeholder-class="center"
               :placeholder="memberInfo.add_time" />
        <!-- <view class='cuIcon-right'></view> -->
      </view>
    </view>
    <view class='bottomBar'>
      <view @tap="bottomBarHandler('拨打电话')"
            class='call'>
        <image style="width:40rpx;height:40rpx;"
               src='https://uss.img.lezhulife.com/xcxicon/callPhone.png'></image>
        <view>拨打电话</view>
      </view>
      <view v-if="currentOrganization.permission.organization=='Y'"
            @tap="bottomBarHandler('编辑成员')"
            class='edit'>
        <image style="width:40rpx;height:40rpx;"
               src='https://uss.img.lezhulife.com/xcxicon/editMember.png'></image>
        <view>编辑成员</view>
      </view>
    </view>
  </view>
</template>

<script>
import { createNamespacedHelpers, mapState } from 'vuex';
const { mapMutations: addrMutations, mapState: addrState } = createNamespacedHelpers('addrList');
export default {
  name: 'customerInfo',
  data () {
    return {
      staff_id: '-1',
      memberInfo: { phone_no: '111' }
    }
  },
  onLoad (options) {
    if (options && options.staff_id) {
      this.staff_id = options.staff_id;
      this.getMemberDetail();
    }
  },
  onShow () {
    if (this.memberDetail.isEdit && this.memberDetail.isEdit == true) {
      this.getMemberDetail();
    }
  },
  computed: {
    ...addrState({
      memberDetail (state) {
        if (state.memberDetail != {}) {
          this.memberInfo = state.memberDetail
        }
        return state.memberDetail
      }
    }),
    ...mapState({
      //获取当前所选择顶层部门
      currentOrganization (state) {
        //默认初始化当前选择部门为顶层部门
        return state.currentOrganization
      },
    }),
    getPhone_number () {
      if (this.memberInfo.phone_no) {
        let temp = this.memberInfo.phone_no.split('')
        temp.splice(3, 0, ' ')
        temp.splice(8, 0, ' ')
        return temp.join('')
      }
      return ''
    }
  },
  methods: {
    ...addrMutations(['setMemberDetail', 'setSelectStoreList']),
    //获取成员详情
    async getMemberDetail () {
      try {
        let res = await this.request({
          url: 'staff/get',
          type: 'get',
          param: {
            staff_id: this.staff_id
          }
        })

        if (res[1].data.state == 200) {
          this.memberInfo = res[1].data.body
        } else {
          uni.showToast({
            title: this.$throwStatusCode(res[1].data.state, '获取'),
            icon: 'none'
          })
          setTimeout(() => {
            uni.navigateBack({
              delta: -1
            })
          }, 500)
        }
      } catch (error) {
        console.log(error);
      }
    },
    //底部按钮回调
    bottomBarHandler (text) {
      if (text == '拨打电话') {
        uni.showModal({
          content: '确定拨打' + this.memberInfo.phone_no,
          success: (res) => {
            if (res.confirm) {
              uni.makePhoneCall({
                phoneNumber: this.memberInfo.phone_no
              });
            } else if (res.cancel) {
              console.log('取消')
            }
          }
        })
      } else {
        this.setMemberDetail(this.memberInfo)
        uni.navigateTo({
          url: '../../../subpackAddrlist/pages/addrList/member?type=编辑成员'
        })
      }
    }
  },
  onUnload () {
    this.setSelectStoreList([{ org_id: 'c', org_name: '请选择' }]);
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
      right: 10rpx;
      color: #dad6d6;
      font-size: 24rpx;
    }
  }
  .infoBox {
    background-color: white;
    box-sizing: border-box;
    font-size: 30rpx;
    .normal {
      padding: 0rpx 40rpx 0rpx 40rpx;
      display: flex;
      justify-content: space-between;
      align-items: center;
      height: 100rpx;
      // border-bottom: solid 1rpx #e6e6e6;
      position: relative;
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
        color: #cccccc;
        font-size: 30rpx;
        .tag {
          display: inline-block;
          background-color: #ededed;
          font-size: 30rpx;
          text-align: center;
          padding: 4rpx 10rpx;
          margin-right: 10rpx;
          color: $titleColor;
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
    }
    .storeNormal {
      align-items: flex-start;
      padding: 30rpx 40rpx;
      box-sizing: border-box;
      .center {
        flex-grow: 1;
        max-width: 500rpx;
        .centerBox {
          display: flex;
          flex-wrap: wrap;
          .boxItem {
            color: black;
            margin-right: 20rpx;
          }
        }
      }
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
      height: 100rpx;
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
    border-top: solid 2rpx #e9e9e9;
    .call,
    .edit {
      height: 100%;
      display: flex;
      width: 50%;
      justify-content: center;
      align-items: center;
      color: #6c6c6c;
      font-size: 34rpx;
      image {
        margin-right: 10rpx;
      }
      &:active {
        background-color: #fafafa;
      }
    }
    .edit {
      border-left: solid 2rpx #e9e9e9;
    }
  }
}
</style>