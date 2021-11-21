<template>
  <view>
    <view>
      <view class="searchBar">
        <view class="cuIcon-search icon"></view>
        <input @input="bindInput"
               focus='true'
               v-model="searchText"
               class="inp"
               type="text"
               placeholder="请输入小区名称">
        <view @tap="cancelSearch"
              v-if="isShowCross"
              class="cuIcon-close icon"></view>
      </view>
    </view>
    <view class="result-box">
      <view class="result-title">
        搜索结果
      </view>
      <view class="result-list">
        <view class="housing-item"
              v-for="(housing) in housingList"
              :key="housing.house.id"
              @click="()=>this.housingClick(housing)">
          <view class="item-left">
            <image class="item-img"
                   :src="housing.publicPics"
                   mode="aspectFit"></image>
          </view>
          <view class="item-right">
            <view class="item-title">
              <span>合租</span>·<span>{{ housing.house.name }}</span> <span>{{housing.houseUnit}}</span>
            </view>
            <view class="item-tag-list">
              <span v-for="(tag, index) in housing.property"
                    :key="index"
                    class="tag-item">
                {{tag.property}}
              </span>
            </view>
            <view class="item-detail-list">
              <span class="detail-item">
                {{housing.houseUnit}}
              </span>|
              <span class="detail-item">
                {{housing.house.areaSize}}㎡
              </span>|
              <span class="detail-item">
                {{housing.house.orientation}}
              </span>|
              <span class="detail-item">
                {{housing.house.name}}
              </span>
            </view>
            <view class="item-room-list">
              <view v-for="(room, roomIdx) in roomMock"
                    :class="['room-item', room.hasLease ? 'disable' : '']"
                    :key="roomIdx"
                    class="room-item">
                <view class="room-index">{{String.fromCharCode(65 + (roomIdx))}}</view>
                <span class="room-price">{{room.roomPrice}} {{room.priceUnit}}</span>
              </view>
            </view>
          </view>
        </view>
      </view>
      <Modal1 :isShow="popupShow"
              :normal="[]"
              @clickCallBack="()=>{}"
              @clickMaskCallBack="() => this.popupShow = false">
      </Modal1>
    </view>
  </view>
</template>

<script>
import { throttleTool } from "@/utils";
import Modal1 from '@/components/comm/modal1/modal1.vue';
export default {
  name: "searchHousing",
  components: {
    Modal1,
  },
  data () {
    return {
      isShowCross: true,
      searchText: '',
      selectedHousing: {},
      housingList: [],
      roomMock: [
        {
          roomPrice: 2850,
          priceUnit: '月/元',
          hasLease: false
        },
        {
          roomPrice: 2750,
          priceUnit: '月/元',
          hasLease: true
        },
        {
          roomPrice: 2650,
          priceUnit: '月/元',
          hasLease: false
        },
      ],
      popupShow: false
    }
  },
  created () {
    const { selectedHousing } = this.$store.state
    // console.log(selectedHousing);
    const { name } = selectedHousing || {};
    if (name) {
      this.selectedHousing = selectedHousing
      this.searchText = name
    }
  },
  mounted () {
    // console.log('in');
    this.getData();
  },
  methods: {
    //搜索数据
    async getData () {
      try {
        const mockData = {
          "state": 200, "msg": "成功", "body": [
            {
              "publicPics": ["https://uss.img.lezhulife.com/houses/1634107740335.png"],
              "property": [
                {
                  "houseId": 287,
                  "rentId": 0,
                  "property": "满2年",
                  "type": 3,
                  "createTime": "2021-10-13 14:49:16",
                  "updateTime": "2021-10-13 14:49:16",
                  "dr": 0
                }, {
                  "houseId": 287,
                  "rentId": 0,
                  "property": "唯一",
                  "type": 5,
                  "createTime": "2021-10-13 14:49:16",
                  "updateTime": "2021-10-13 14:49:16",
                  "dr": 0
                }
              ],
              "houseUnit": "1室3厅1卫",
              "sellPrice": 1870,
              "houseSale": {
                "id": 74,
                "houseId": 287,
                "commission": "5",
                "commissionShare": "0",
                "listPrice": "23",
                "floorPrice": "23.00",
                "actualPrice": "0.00",
                "status": 0,
                "createTime": "2021-10-13 14:49:16",
                "updateTime": "2021-10-13 14:49:16",
                "dr": 0
              },
              "house": {
                "id": 287,
                "xiaoquId": 9130,
                "name": "解放西路12号",
                "houseNo": "CD211013458311",
                "cityId": "47",
                "areaId": "48",
                "busiAreaId": "255",
                "rentalType": 3,
                "orientation": "东",
                "buildingNum": "2",
                "unitNum": "4",
                "houseNum": "2",
                "floorNum": 1,
                "totalFloorNum": 3,
                "areaSize": 123,
                "livingRoomNum": 3,
                "roomNum": 1,
                "restroomNum": 1,
                "rebuildRoomNum": 0,
                "renovation": 2,
                "publicPics": "/houses/1634107740335.png",
                "outPics": "/houses/1634107747378.png",
                "floorPlanPics": "/houses/1634107744017.png",
                "addStaffId": 37961844,
                "lat": "30.688760",
                "lng": "104.084177",
                "channel": "请选择",
                "createTime": "2021-10-13 14:49:16",
                "updateTime": "2021-10-13 14:49:16",
                "dr": 0
              },
              "houseNum": "2-4-2"
            },
            {
              "publicPics": ["https://uss.img.lezhulife.com/houses/1634107740335.png"],
              "property": [
                {
                  "houseId": 287,
                  "rentId": 0,
                  "property": "满2年",
                  "type": 3,
                  "createTime": "2021-10-13 14:49:16",
                  "updateTime": "2021-10-13 14:49:16",
                  "dr": 0
                }, {
                  "houseId": 287,
                  "rentId": 0,
                  "property": "唯一",
                  "type": 5,
                  "createTime": "2021-10-13 14:49:16",
                  "updateTime": "2021-10-13 14:49:16",
                  "dr": 0
                }
              ],
              "houseUnit": "1室3厅1卫",
              "sellPrice": 1870,
              "houseSale": {
                "id": 74,
                "houseId": 287,
                "commission": "5",
                "commissionShare": "0",
                "listPrice": "23",
                "floorPrice": "23.00",
                "actualPrice": "0.00",
                "status": 0,
                "createTime": "2021-10-13 14:49:16",
                "updateTime": "2021-10-13 14:49:16",
                "dr": 0
              },
              "house": {
                "id": 287,
                "xiaoquId": 9130,
                "name": "解放西路12号",
                "houseNo": "CD211013458311",
                "cityId": "47",
                "areaId": "48",
                "busiAreaId": "255",
                "rentalType": 3,
                "orientation": "东",
                "buildingNum": "2",
                "unitNum": "4",
                "houseNum": "2",
                "floorNum": 1,
                "totalFloorNum": 3,
                "areaSize": 123,
                "livingRoomNum": 3,
                "roomNum": 1,
                "restroomNum": 1,
                "rebuildRoomNum": 0,
                "renovation": 2,
                "publicPics": "/houses/1634107740335.png",
                "outPics": "/houses/1634107747378.png",
                "floorPlanPics": "/houses/1634107744017.png",
                "addStaffId": 37961844,
                "lat": "30.688760",
                "lng": "104.084177",
                "channel": "请选择",
                "createTime": "2021-10-13 14:49:16",
                "updateTime": "2021-10-13 14:49:16",
                "dr": 0
              },
              "houseNum": "2-4-2"
            },
          ]
        }
        let res = await this.request1({
          url: this.typePort || '',
          param: {
            q: this.searchText || '',
            fId: `1`,
            page: 1
          },
          mockData
        })
        // console.log('rec', res)
        if (res.state === 200) {
          this.housingList = res.body
        }
      } catch (e) {
        console.warn(e)
      }
    },

    /**
     * 文本框输入事件
     */
    bindInput (e) {
      // this.searchText = e.detail.value;
      // console.log(this.searchText)
      if (this.searchText.length > 0) {
        this.search = '搜索'
        this.$utils.throttleTool(() => {
          this.getData()
        })
      }
    },
    /**
     * 取消输入按钮
     */
    cancelSearch () {
      this.searchText = ''
    },

    housingClick (item) {
      this.popupShow = true;
    },
  }
}
</script>

<style lang='scss' scoped>
$color: #00a680;
.fnBorder {
  border-radius: $uni-border-radius-base;
  border: $color 1px solid;
  padding: 5rpx $uni-spacing-col-sm;
  margin: 0 $uni-spacing-row-sm;
  color: $color;
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

  .inp {
    flex-grow: 1;
    margin: 0rpx 20rpx;
    font-size: 24rpx;
    color: black;
  }
}
.result-box {
  .result-title {
    padding-left: 15rpx;
    font-size: $uni-font-size-sm;
    color: #999999;
  }
  .result-list {
  }
}
.housing-item {
  display: flex;
  padding: $uni-spacing-row-sm $uni-spacing-col-sm;
  margin: 0 $uni-spacing-col-sm;
  &:not(:last-child) {
    border-bottom: 1px solid #aaaaaa;
  }
  .item-left {
    margin-right: $uni-spacing-row-lg;
  }
  .item-img {
    $img-size: 150rpx;
    width: $img-size;
    height: $img-size;
  }
  .item-title {
  }
  .tag-item {
    margin-top: 10rpx;
    margin-right: 10rpx;
    color: #01a680;
    border-radius: $uni-border-radius-base;
    padding: 5rpx $uni-spacing-col-sm;
    background-color: #eef6ee;
  }
  .detail-item {
    margin: 10rpx 5rpx 0;
    display: inline-block;
  }
  .item-room-list {
    .room-item {
      display: flex;
      margin-top: 10rpx;
      &.disable {
        color: #999999;
        border-color: #999999;
        .room-index {
          color: #999999;
          border-color: #999999;
        }
      }
    }
    .room-index {
      @extend .fnBorder;
    }
  }
}
</style>
