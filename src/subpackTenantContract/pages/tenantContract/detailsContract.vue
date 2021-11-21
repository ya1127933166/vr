<template>
  <!-- 合同详情 -->
  <view class='ownerContractInfo'>
    <view class="contract_top">
      <view class="top_time">录入日期:{{contractList.addTime}}</view>
      <view class="bottomBtn"
            @tap='previewImage("查看附件")'>查看合同附件</view>
      <view class="abrogate"
            @tap='offContracting '
            v-if="tagText=='已生效'">作废合同</view>
      <view class='topTag'> {{tagText}}</view>
    </view>
    <!-- 房源 -->
    <!-- <view class="houseInfo">
                <view class="house_left">房源</view>
                <view class="house_center">
                    <view>{{contractList.xiaoquName}} {{contractList.houseNumber}}</view>
                    <view>{{contractList.houseUnit}} {{contractList.size}}</view>
                    <view style="color:#ccc">{{contractList.addr}}</view>
                </view>
                <view class="house_right">
                    <view>{{contractList.housePrice}}</view>
                    <view class="cuIcon-right" style="font-size:36rpx"></view>
                </view>
        </view> -->
    <housing-info :housing-info="housingInfo"
                  :has-arrow-right="true"
                  :arrow-func="hrefDetail">
    </housing-info>
    <!-- 产权信息 -->
    <view class="equities"
          v-if="isFlag">
      <view class="equities_title"> 产权信息</view>
      <view class="equities_center">
        <view class="item">
          <view>业主姓名:</view>
          <view>{{contractList.customerName}}</view>
        </view>
        <view class="item">
          <view>产权证号:</view>
          <view>{{contractList.agent.ownerNo}}</view>
        </view>
        <view class="item"
              @tap='previewImage("产权证照")'
              style="border-bottom:none">
          <view>产权证照:</view>
          <view>{{contractList.agent.ownerAttachUrl.length>0?'已上传':'暂无'}}</view>
          <view class='cuIcon-right'></view>
        </view>
      </view>
    </view>
    <!-- 租客 -->

    <view class="equities"
          v-if="!isFlag">
      <view class="equities_title"> 租客信息</view>
      <view class="equities_center">
        <view class="item">
          <view>租客姓名:</view>
          <view>{{contractList.customerName}}</view>
        </view>
        <view class="item"
              style="border-bottom:none">
          <view>租客电话:</view>
          <view>{{contractList.customerPhone}}</view>
          <view class="telephone cuIcon-dianhua"
                @tap='callPhone'></view>
        </view>

      </view>
    </view>
    <!-- 合同信息 -->
    <view class="equities"
          v-if="isFlag">
      <view class="equities_title"> 合同信息</view>
      <view class="equities_center"
            v-for="(item,index) in contractInfo"
            :key="index">
        <view class="item"
              :style="index==contractInfo.length-1?'border-bottom:none':''">
          <view>{{item.title}}:</view>
          <view>{{item.value}}</view>
          <button v-if="item.isCopy"
                  class="copy"
                  @tap='copy(item)'>复制</button>
        </view>
      </view>
    </view>
    <!-- 租约信息 -->
    <view class="equities"
          v-if="!isFlag">
      <view class="equities_title"> 租约信息</view>
      <view class="equities_center"
            v-for="(item,index) in lease"
            :key="index">
        <view class="item"
              :style="index==lease.length-1?'border-bottom:none':''">
          <view>{{item.title}}:</view>
          <view>{{item.value}}</view>
          <view v-if="item.isCopy"
                class="copy"
                @tap='copy(item)'>复制</view>
        </view>
      </view>
    </view>
    <!-- 交割单 -->
    <view class="delivery"
          v-if="delivery&&delivery.length">
      <view class="delivery_title">房屋配置/交割单</view>
      <view class="delivery_item"
            v-for="(item,index) in delivery"
            :key="index"
            :style="index==delivery.length-1?'border-bottom:none':''">
        <view>{{item.name}}</view>
        <view>{{item.value}}</view>
      </view>
    </view>
    <!-- 录入时间 -->
    <view class="enter_data">
      <view class="enter_title">录入时间</view>
      <view class="date_info"
            v-for="(item,index) in enterTime"
            :key='index'>
        <view>
          <view class="quan"></view>
          <view class="userIn">{{item.name}}·{{item.action}}</view>
          <!-- ·{{item.result}} -->
        </view>
        <view class="time">
          {{item.time}}
        </view>
      </view>
    </view>
  </view>
</template>

<script>
import { createNamespacedHelpers } from 'vuex';

const { mapState: contractState, mapMutations: contractMutation } = createNamespacedHelpers('contract');
import housingInfo from "@/components/comm/housingInfo/housingInfo";

export default {
  name: 'ownerContractInfo',
  data () {
    return {
      housingInfo: {},
      //合同id
      contractId: '',
      //详情数据
      contractList: [],
      //合同类型判断值
      isFlag: true,
      //合同信息
      contractInfo: [
        { isCopy: false, title: '合同时间', value: '' },
        { isCopy: true, title: '合同编号', value: '' }
      ],
      //租约信息
      lease: [{ isCopy: true, title: '合同编号', value: '' },
      { isCopy: false, title: '支付方式', value: '' },
      { isCopy: false, title: '租期', value: '' },
      { isCopy: false, title: '月租金', value: '' },
      { isCopy: false, title: '押金', value: '' },
      { isCopy: false, title: '佣金', value: '' },
      ],
      //交割单
      // delivery:[{
      //     type:'电视',value:"长虹电视X1长虹电视X1长虹电视X1长虹电视X1长虹电视X1长虹电视X1长虹电视X1长虹电视X1长虹电视X1长虹电视X1长虹电视X1长虹电视X1长虹电视X1长虹电视X1长虹电视X1长虹电视X1"
      // },{
      //     type:'家具',value:"1张床"
      // },
      // {
      //     type:'钥匙',value:"电子锁"
      // },
      // {
      //     type:'生活费用',value:"水费"
      // }],
      delivery: [],

      //录入列表
      enterTime: [],
      //标签状态
      tagText: ''

    }
  },
  components: {
    housingInfo
  },
  onLoad (options) {
    // console.log(options.contractId)
    this.contractId = options.contractId
    uni.showLoading()
    //合同详情
    this.getInfo()
  },
  mounted () {

  },
  computed: {
    getTagStatus () {
      switch (this.contractList.status) {
        case "pending":
          this.tagText = '待审批'
          break;
        case "modify":
          this.tagText = '待修改'
          break;
        case "expired":
          this.tagText = '已过期'
          break;
        case "reject":
          this.tagText = '拒绝'
          break;
        case "signing":
          this.tagText = '待签署'
          break;
        case "available":
          this.tagText = '已生效'
          break;
      }
    }
  },
  methods: {
    //查看房源回调
    hrefDetail (e) {
      const { rentId, saleId, fullTitle, xqName } = this.housingInfo
      const obj = {
        name: xqName || fullTitle,
        id: rentId || saleId
      }
      if (!rentId) {
        uni.navigateTo({
          url: '../../../subpackComm/pages/viewHousing/viewHousing?type=0&houseId=' + JSON.stringify(obj),
          complete: (e) => console.log(e)
        })
      } else {
        uni.navigateTo({
          url: '../../../subpackComm/pages/viewHousing/viewHousing1?type=0&houseId=' + JSON.stringify(obj),
          complete: (e) => console.log(e)
        })
      }
    },
    //查看照片

    previewImage (item) {
      // item 1 查看合同附件照片 2 查看产权证照
      let imgArr = []
      if (item == '查看附件') {
        imgArr = this.contractList.contractAttachUrl
      } else if (item == '产权证照') {
        imgArr = this.contractList.agent.ownerAttachUrl
      }
      let arr = []
      imgArr.forEach((ele, i) => {
        arr[i] = ele + this.$imageLarge
      })
      // let imgArr = ['https://uss.img.lezhulife.com/houses/1632655616222.png','https://uss.img.lezhulife.com/houses/1632655616222.png'];
      // imgArr.push(this.contractList.agent.ownerAttachUrl);
      //  imgArr.push('https://uss.img.lezhulife.com/houses/1632655616222.png');
      uni.previewImage({
        current: arr[0],
        urls: arr,
      });
    },
    //作废合同
    offContracting () {
      uni.showModal({
        content: '确定作废该合同?',
        success: (res) => {
          if (res.confirm) {
            this.offContract()
          } else if (res.cancel) {
          }
        }
      })
    },
    async offContract () {
      try {
        let res = await this.request({
          url: `contract/invalid/${this.contractId}`
        })
        if (res[1].data.state == 200) {
          uni.showToast({
            title: '作废合同成功',
          })
          setTimeout(() => {
            uni.navigateBack({
              delta: 1
            })
          }, 600)
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
    //拨打电话
    callPhone () {
      uni.showModal({
        content: '确定拨打' + this.contractList.customerPhone,
        success: (res) => {
          if (res.confirm) {
            uni.makePhoneCall({
              phoneNumber: this.contractList.customerPhone
            });
          } else if (res.cancel) {
          }
        }
      })

    },
    //复制
    copy (item) {
      wx.setClipboardData({
        data: item.value,
        success () {
          wx.showToast({
            title: '复制成功',
            icon: 'success',
            duration: 1000
          })
        }
      })
    },
    //合同详情页

    async getInfo () {
      try {
        let res = await this.request({
          url: `contract/${this.contractId}`
        })
        if (res[1].data.state == 200) {
          const { body } = res[1].data
          const { title, houseNumber, xiaoquName, houseUnit, size, addr, housePrice, type, saleId, rentId,
            contractTime, contractNo, rent, deliveries, approves
          } = body || {}
          const { payMethod, price, pledge, commission } = rent || {}
          this.contractList = body
          //housingInfo
          this.housingInfo = {
            // fullTitle: title,
            xqName: xiaoquName,
            houseUnit: houseUnit,
            houseNumber: houseNumber,
            areaSize: " " + size.substring(0, size.length - 1),
            area: addr,
            listPrice: housePrice,
            isFlag: true
          }
          if (type === 'agent') {
            this.housingInfo.saleId = saleId
          } else {
            this.housingInfo.rentId = rentId
          }
          //合同类型判断
          this.isFlag = type === 'agent'
          //合同时间
          if (this.isFlag) {
            this.contractInfo[0].value = contractTime
            this.contractInfo[1].value = contractNo
          } else {
            //租约信息
            const valueArr = [contractNo, payMethod, contractTime, price, pledge, commission]
            this.lease.forEach((item, idx) => {
              item.value = valueArr[idx]
            })
          }
          const deliveriesTypeMap = {
            electric: '电器',
            furniture: '家具',
            key: '钥匙凭证',
            col: '生活费用'
          }
          this.delivery = []
          //交割单
          deliveries && deliveries.forEach((ele, i) => {
            this.delivery.push({
              type: deliveriesTypeMap[ele.type] || '',
              value: ele.remark,
              name: ele.name
            })
          })
          //录入时间
          this.enterTime = approves
          uni.hideLoading()
          //标签状态

        } else {
          uni.showToast({
            title: this.$throwStatusCode(res[1].data.state, '获取合同详情'),
            icon: 'none'
          })
        }
      } catch (e) {
        console.warn(`/contract/${this.contractId} error`, e)

        uni.hideLoading()
      }
    },


  }
}
</script>

<style lang='scss' scoped>
.ownerContractInfo {
  .contract_top {
    background-color: white;
    height: 22vh;
    width: 750rpx;
    position: relative;
    top: 0;
    left: 0;
    overflow: hidden;
    position: relative;
    .topTag {
      position: absolute;
      top: 35rpx;
      left: -66rpx;
      width: 250rpx;
      height: 60rpx;
      line-height: 60rpx;
      text-align: center;
      background-color: #00a680;
      /* -webkit-transform: rotate(-45deg); */
      transform: rotate(-45deg);
      font-size: 30rpx;
      font-weight: 600;
      color: #fff;
    }

    .top_time {
      margin-top: 40rpx;
      text-align: center;
      font-size: 30rpx;
    }
    .abrogate {
      text-align: center;
      font-size: 30rpx;
      color: rgb(248, 93, 88);
    }
  }
  .houseInfo {
    margin: 15rpx 0 0 0;
    display: flex;
    height: 150rpx;
    background: white;
    position: relative;
    .house_left {
      width: 190rpx;
      height: 150rpx;
      line-height: 150rpx;
      text-align: center;
      font-size: 32rpx;
      font-weight: 600;
    }
    .house_center {
      width: 370rpx;
      padding-top: 15rpx;
      view:nth-child(1) {
        font-weight: 600;
        font-size: 28rpx;
      }
      view:nth-child(3) {
        font-size: 24rpx;
      }
    }
    .house_right {
      position: absolute;
      top: 30rpx;
      right: 20rpx;
      display: flex;
      align-items: center;
      view:nth-child(1) {
        font-size: 30rpx;
        font-weight: 600;
        color: rgb(248, 93, 88);
        margin-left: 45rpx;
      }
    }
  }
  .equities {
    width: 750rpx;
    background: white;
    .equities_title {
      font-size: 24rpx;
      padding: 36rpx 50rpx;
      background: #f1f1f1;
      height: 80rpx;
    }
    .equities_center {
      padding: 0 50rpx;
      .item {
        display: flex;
        height: 100rpx;
        line-height: 100rpx;
        position: relative;
        border-bottom: solid calc(1px / 2.5) #d9d9d9;
        // 去除btn 默认样式
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
        view:nth-child(1) {
          margin-right: 40rpx;
          min-width: 140rpx;
          color: #808080;
        }
        .cuIcon-right {
          position: relative;
          right: -365rpx;
          bottom: 0;
          font-size: 36rpx;
        }
        .copy {
          position: absolute;
          right: 0;
          top: 30rpx;
          line-height: 40rpx;
          height: 40rpx;
          text-align: center;
          font-size: 22rpx;
          color: #808080;
          width: 80rpx;
          border-radius: 5rpx;
          border: 1px solid #c4c3c3;
        }
        .telephone {
          position: absolute;
          top: 20rpx;
          right: -10rpx;
          width: 60rpx;
          height: 60rpx;
          border-radius: 50%;
          background-size: cover;
        }
        .cuIcon-dianhua {
          font-size: 40rpx;
          line-height: 60rpx;
          color: #ababab;
        }
      }
    }
  }
  .delivery {
    width: 750rpx;
    background: white;
    .delivery_title {
      font-size: 24rpx;
      padding: 36rpx 50rpx;
      background: #f1f1f1;
      height: 80rpx;
    }
    .delivery_item {
      margin: 0 50rpx;
      display: flex;
      height: 100rpx;
      line-height: 100rpx;
      border-bottom: solid calc(1px / 2.5) #d9d9d9;
      view:nth-child(1) {
        width: 160rpx;
        margin-right: 20rpx;
        color: #808080;
      }
      view:nth-child(2) {
        max-width: 440rpx;
        overflow: hidden;
        white-space: nowrap;
        text-overflow: ellipsis;
      }
      view:nth-child(4) {
        border-bottom: none;
      }
    }
  }
  .enter_data {
    width: 750rpx;
    background: white;
    margin-bottom: 80rpx;
    .enter_title {
      font-size: 24rpx;
      padding: 36rpx 50rpx;
      background: #f1f1f1;
      height: 80rpx;
    }
    .date_info {
      margin: 20rpx 50rpx;
      height: 100rpx;

      .quan {
        display: inline-block;
        width: 20rpx;
        height: 20rpx;
        border-radius: 50%;
        background: #dad8d8;
      }
      .userIn {
        display: inline-block;
        margin-left: 20rpx;
        height: 50rpx;
        line-height: 50rpx;
      }
    }
    .time {
      margin: 10rpx 40rpx;
      font-size: 24rpx;
    }
  }
  .bottomBtn {
    width: 374rpx;
    height: 80rpx;
    background-color: #00a680;
    margin: 30rpx auto;
    color: white;
    font-size: 30rpx;
    text-align: center;
    line-height: 80rpx;
    border-radius: 50rpx;

    &:active {
      background-color: #007e5e;
    }
  }
}
</style>
