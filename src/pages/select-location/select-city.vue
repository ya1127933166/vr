<template>
  <view class="select-location">
    <scroll-view style="min-height:100vh"
                 scroll-y
                 class="city-list cu-list menu sm-border cityBox"
                 v-if="cityList && cityList.length">
      <block>
        <view class='currentCity'>
          <!--                gps定位城市-->
          <!--                <view class='curText'>当前定位城市 <text class='curName'> currentCityInfo.name</text></view>-->
          <!--                当前选择城市-->
          <view class='curText'>当前选择城市 <text class='curName'>{{locationInfo.name}}</text></view>
        </view>
        <view class='otherCity'>其他城市</view>
        <view class='cityList'>
          <block v-for="item in cityList"
                 :key="item.name">
            <view @click="selectedCity(item)"
                  class='cityItem'>{{item.name}}</view>
          </block>
        </view>
      </block>
    </scroll-view>
    <view class="null-data-tips"
          v-else-if="!cityList.length">没有可选城市</view>
  </view>
</template>

<script>
import {
  mapState
} from 'vuex';

export default {
  name: 'SelectCity',
  data () {
    return {
      isContract: false
    };
  },
  computed: {
    ...mapState({
      list: state => state.locationList,
      locationInfo: state => state.locationInfo,
      cityList: state => state.cityList,
      currentCityInfo: state => state.currentCityInfo
    })
  },
  created () {

  },
  onLoad (options) {
    uni.hideLoading()
    if (options && options.type == '合同') {
      this.isContract = true;
    }
  },
  mounted () {

  },
  watch: {
    'locationInfo.name' (newValue, oldValue) {
      this.request({
        url: 'select/city',
        type: 'get',
        param: { cityId: this.locationInfo.id }
      }).then((res) => {
        if (res[1].data.state == 200) {
        } else {
          uni.showToast({
            title: this.$throwStatusCode(res[1].data.state, '切换城市'),
            icon: 'none'
          })
        }
      }).catch((e) => {
        console.log(e)
      })
    }
  },
  methods: {
    selectCity (item) {
      this.$store.commit('updateLocation', item);
      if (typeof this.$$globalMethod.locationReloadData === 'function') {
        this.$$globalMethod.locationReloadData();
      }
      uni.navigateBack({
        delta: -1,
      });
    },
    //选择城市
    selectedCity (item) {
      uni.$emit("updataLocation", item)
      //列表选择城市
      if (this.isContract == true) {
        let temp = Array.from(this.$store.state.contract.step1)
        temp[1] = item.name
        this.$store.commit('contract/setStep1', temp);
      } else {
        //手动切换城市
        this.$store.commit('updateLocationInfo', item);
      }
      uni.navigateBack({
        delta: -1,
      });
    }
  },
};
</script>

<style lang="scss" scoped>
page {
  background: white;
}
.select-location {
  background: white;
}
.cityBox {
  background-color: #f7f7f7;
  box-sizing: border-box;
  .currentCity {
    padding: 30rpx;
    display: flex;
    align-items: center;
    .curText {
      color: gray;
      padding-left: 10rpx;
      display: flex;
      align-items: center;
      .curName {
        color: black;
        font-weight: 500;
        padding-left: 10rpx;
      }
    }
  }
  .otherCity {
    font-size: 30rpx;
    color: grey;
    padding: 30rpx 0rpx 20rpx 40rpx;
  }
  .cityList {
    width: 750rpx;
    padding-left: 30rpx;
    height: auto;
    .cityItem {
      width: 220rpx;
      height: 80rpx;
      background-color: white;
      border-radius: 10rpx;
      margin-top: 20rpx;
      float: left;
      margin-right: 20rpx;
      text-align: center;
      line-height: 80rpx;
      &:active {
        background-color: #fafafa;
      }
    }
  }
}
.null-data-tips {
  line-height: 80rpx;
  font-size: 24rpx;
  text-align: center;
  color: #888;
}
</style>
