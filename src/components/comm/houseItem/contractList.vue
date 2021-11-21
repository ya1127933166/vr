<template>
  <view class='houseList'>
    <view v-if='indexCurry==0'
          @tap="clickItem"
          class='houseItem'>
      <view class="product_tip itemLeft"
            :style="{ backgroundImage: 'url(' +List.house.houseImage+ ')'}"
            style="width:220rpx;height:165rpx">
        <view class=' backImg'
              :style="{borderBottomColor:(List.type=='agent'?'#E54959':'#2882D9')}"></view>
        <view>{{ List.type == 'agent' ? '代理' : '租房' }}</view>
        <view class="timer">{{ List.contractTime }}</view>
      </view>
      <view class="itemRight">
        <view class="rightTop">
          <view class="topLeft">
            <view class="name">
              <span>{{ List.house.title }}</span>
            </view>
            <view class='tag'
                  :style="{borderColor:tagColor,Color:tagColor}">{{ tagText }}</view>
            <view class="addr">
              <block v-for="(item,index) in List.house.tags"
                     :key='index'>
                <view class="item">
                  {{ item }}
                </view>
              </block>
            </view>
            <view class="info">
              <view>{{ List.house.houseUnit }}</view>
              <view class="line"></view>
              <view>{{ List.house.size }}m²</view>
              <view class="line"></view>
              <view>{{ List.house.orientation }}</view>
              <view class="line"></view>
              <view class="limt">{{ List.house.xqName }}</view>
            </view>
          </view>
        </view>
        <view class="bottom_list"
              v-if="List.type=='agent'">
          <view class="bottom_left">
            {{ List.house.price }}万
          </view>
          <view class="bottom_right">
            {{ List.house.avgPrice }}元/平
          </view>
        </view>
        <view class="bottom_list"
              v-if="List.type=='rent'">
          <view class="bottom_left">
            {{ List.house.price }}月/元
          </view>
          <view class="bottom_pay">
            （{{ List.house.payStr }}）
          </view>
        </view>
      </view>
    </view>

    <!-- <view  v-else-if='indexCurry==1' @tap="clickItem" class='houseItem' >
            <image  style="width:220rpx;height:165rpx" class='itemLeft' :src='List.publicPics[0]'></image>
            <view class="itemRight">
                <view class="rightTop">
                    <view class="topLeft">
                        <view class="name">{{List.rentalType}}·{{List.name}} {{List.houseUnit}}</view>
		  	  						  <view class="addr">
		  	  							  <block v-for="(item,index) in List.property" :key='index'>
		  	  								  <view class="item">
		  	  								  	{{item}}
		  	  								  </view>
		  	  							  </block>
		  	  						  </view>
		                  <view class="info">
		                      <view>{{List.houseUnit}}</view>
		                      <view class="line"></view>
		                      <view>{{List.areaSize}}m²</view>
		                      <view class="line"></view>
		                      <view>{{List.orientation}}</view>
							  <view class="line"></view>
							  <view>{{item.info[3]}}</view>
		                  </view>
		              </view>
		          </view>
		  	  				  <view class="bottom_list">
		  	  				  	<view class="bottom_left">
		  	  				  		{{List.listPrice}}元/月({{List.payType}})
		  	  				  	</view>
								<view v-show='List.rentalType=="合租"' class="bottom_show"  >
									<view class="" v-for="(item,index) in item.price" :key='index' :style='item.status==false?"color:#999":""'>
										<view class="show_status"  :style='isStyle' >
										{{item.num}}
										</view>
										<view class="price_item">
										{{    item.val}}
										</view>
									</view>
								</view>
		  	  				  </view>
		      </view>
		  </view> -->

  </view>
</template>

<script>
export default {
  name: 'contractList',
  data () {
    return {
      tagProperty: [],
      tagColor: '',
      tagText: ''
    }
  },
  props: {
    title: String,
    List: Object,
    indexCurry: Number,
    clickItemCallBack: {
      type: Function,
      default: () => () => {
      }
    }
  },
  mounted () {

  },
  computed: {
    getTag () {
      switch (this.List.status) {
        case "pending":
          this.tagColor = '#F2D72C'
          this.tagText = '待审批'
          break;
        case "modify":
          this.tagColor = '#F2D72C'
          this.tagText = '待修改'
          break;
        case "expired":
          this.tagColor = '#a1a3a6'
          this.tagText = '已过期'
          break;
        case "reject":
          this.tagColor = '#E52C18'
          this.tagText = '已拒绝'
          break;
        case "signing":
          this.tagColor = '#F2D72C'
          this.tagText = '待签署'
          break;
        case "available":
          this.tagColor = '#00A680'
          this.tagText = '已生效'
          break;
      }
    }
  },
  methods: {
    clickItem () {
      this.$emit('clickItemCallBack')
    },
  }
}
</script>

<style lang='scss' scoped>
.houseList {
  width: 710rpx;
  margin: 0 auto;

  .houseTitle {
    display: flex;
    justify-content: space-between;
    padding-bottom: 20rpx;
    padding-top: 30rpx;

    .title-left {
      color: #00a680;
      font-size: 30rpx;
      font-weight: 700;
    }

    .title-distance {
      font-size: 20rpx;
      color: #737373;
    }
  }

  .houseItem {
    padding: 40rpx 0rpx 30rpx 0rpx;
    background-color: white;
    display: flex;
    position: relative;
    margin-bottom: 14rpx;
    // border-bottom: solid calc(1px / 2.5) #d9d9d9;
    border-radius: 6rpx;
    position: relative;
    // .imgFather{
    //     width: 110px;
    //     height: 82px;
    //     // overflow: hidden;
    //     position: relative;
    //     .tag{
    //          height: 160rpx;
    //         width: 160rpx;
    //         line-height: 80rpx;
    //         text-align: center;
    //         background: red;
    //         color: #fff;
    //         font-size: 24rpx;
    //         position: relative;
    //         top: -46px;
    //         left: -50px;
    //         z-index: 11;
    //         -webkit-transform: rotate(-90deg);
    //         transform: rotate(-135deg);
    //         .text{
    //             position: absolute;
    //             bottom: 0;
    //             right: 0;
    //             font-size: 24rpx;
    //             font-weight: 600;
    //             background: blue;
    //             transform: rotate(-135deg);
    //         }
    //     }
    //     .backImg{
    //         width:220rpx;
    //         height:165rpx;
    //         position: absolute;
    //         top: 0;
    //         left: 0;
    //         background: yellow;
    //     }
    // }
    .product_tip {
      position: relative;
      top: 0;
      left: 0;
      width: 180rpx;
      height: 165rpx;
      // background-image: url(https://uss.img.lezhulife.com/xcximages/house-none.png);
      background-size: cover;
      text-align: left;

      view:nth-child(2) {
        color: #212447;
        transform: rotate(-45deg);
        font-size: 600;
        color: #fff;
        position: relative;
        font-size: 24rpx;
        top: -27px;
        left: -84rpx;
      }

      .backImg {
        width: 0;
        height: 0;
        border-bottom: 60rpx solid rgb(235, 63, 92);
        border-right: 60rpx solid transparent;
        border-left: 60rpx solid transparent;
        transform: rotate(-45deg);
        position: absolute;
        top: -10rpx;
        left: -39rpx;
      }

      .timer {
        color: #9999;
        font-size: 20rpx;
        position: absolute;
        top: 174rpx;
        left: 0;
        text-overflow: ellipsis;
        white-space: nowrap;
        overflow: hidden;
      }
    }

    .itemLeft {
      // width: 260rpx;
      margin-right: 20rpx;
      // height: 190rpx;
      background-color: #f5f5f5;
      display: flex;
      justify-content: center;
      align-items: center;
      border-radius: 6rpx;

      .cuIcon-camerafill {
        color: #bfbfbf;
        margin-right: 10rpx;
      }

      .leftText {
        color: #888888;
        font-size: 20rpx;
      }
    }

    .itemRight {
      flex-grow: 1;
      position: relative;
      top: -6rpx;
      left: 0;

      .rightTop {
        display: flex;
        font-size: 26rpx;
        justify-content: space-between;

        .topLeft {
          font-size: 26rpx;
          min-width: 400rpx;
          line-height: 40rpx;
          position: relative;

          .name {
            // width: 410rpx;
            overflow: hidden;
            text-overflow: ellipsis;
            display: -webkit-box;
            -webkit-line-clamp: 2;
            -webkit-box-orient: vertical;
            max-width: 350rpx;

            span {
              font-size: 30rpx;
              font-weight: 800;
              display: inline-block;
              // max-width: 200rpx;
            }
          }
          .addr {
            display: flex;
            flex-wrap: wrap;
            margin: 0 0 10rpx 0;
            .item {
              min-width: 80rpx;
              padding: 0 6rpx;
              height: 40rpx;
              line-height: 40rpx;
              font-weight: 500;
              font-size: 24rpx;
              text-align: center;
              color: #00a680;
              border-radius: 6rpx;
              margin-right: 10rpx;
              background-color: #eeeeee;
            }
          }
          .info {
            display: flex;
            align-items: center;

            .line {
              width: 2rpx;
              height: 20rpx;
              background-color: black;
              margin: 0rpx 6rpx;
            }

            .limt {
              max-width: 130rpx;
              overflow: hidden;
              text-overflow: ellipsis;
              white-space: nowrap;
            }
          }

          .tag {
            position: absolute;
            top: 0;
            right: -60rpx;
            z-index: 1;
            display: inline-block;
            min-width: 86rpx;
            height: 40rpx;
            text-align: center;
            border: #00a680 2rpx solid;
            border-radius: 8rpx;
            color: #00a680;
          }
        }

        .topRight {
          display: flex;

          view {
            width: 30rpx;
            height: 30rpx;
            text-align: center;
            line-height: 30rpx;
            font-size: 20rpx;
            margin-right: 10rpx;
          }

          view:nth-child(1) {
            background-color: #dae8fc;
            color: #7475fe;
          }

          view:nth-child(2) {
            background-color: #ffe6cc;
            color: #ff850b;
          }

          view:nth-child(3) {
            background-color: #fff2cc;
            color: #e6bc4f;
          }
        }
      }

      .addr {
        display: flex;
        margin: 0 0 10rpx 0;

        .item {
          min-width: 80rpx;
          padding: 0 6rpx;
          height: 40rpx;
          line-height: 40rpx;
          font-weight: 500;
          font-size: 24rpx;
          text-align: center;
          color: #00a680;
          border-radius: 6rpx;
          margin-right: 10rpx;
          background-color: #eeeeee;
        }
      }

      .bottom_list {
        display: flex;
        margin-top: 12rpx;

        .bottom_left {
          color: #ff0000;
          font-size: 32rpx;
          margin-right: 30rpx;
          min-width: 80rpx;
        }

        .show_status {
          height: 30rpx;
          width: 30rpx;
          color: #00a680;
          margin-right: 20rpx;
          font-size: 20rpx;
          line-height: 30rpx;
          text-align: center;
          display: inline-block;
          border: solid #00a680 2rpx;
          margin-bottom: 12rpx;
        }

        .price_item {
          display: inline-block;
        }

        .bottom_right {
          padding-top: 6rpx;
          color: #9999;
          font-size: 28rpx;
        }

        .bottom_pay {
          color: #ff0000;
          font-size: 28rpx;
          margin-top: 4rpx;
        }
      }
    }

    .cell {
      position: absolute;
      width: 490rpx;
      height: 1px;
      background-color: #e8e8e8;
      bottom: 0rpx;
      right: 0rpx;
      transform: scaleY(0.5);
    }

    &:active {
      background-color: #fafafa;
    }
  }
}
</style>
