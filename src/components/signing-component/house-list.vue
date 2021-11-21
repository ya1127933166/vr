<template>
<view class="house-list">
    <view v-for="(item, index) in list"
        :key="index"
        @tap="viewHouse(item)"
        class="house-item">
        <view class="house-thumb">
            <image :src="item.cover" mode="aspectFill"></image>
        </view>
        <view class="house-info">
            <view class="house-title">{{item.areaName}}</view>
            <view class="house-intro">
                <text class="info-value">{{item.hSize}}㎡</text>
                <text class="info-value">|</text>
                <text class="info-value">{{item.houseType}}</text>
            </view>
            <view class="house-addr">
                <text class="info-value">{{item.area}}·{{item.businessCircle}}</text>
            </view>
            <view class="house-price-group">
                <text class="price-value">{{item.price}}</text>
                <text class="price-symbol">(元/月)</text>
                <text class="pay-type">{{item.payType}}</text>
            </view>
        </view>
        <view class="house-status">
            <view class="status-info" 
                :class="'status-1'+item.status">{{item.statusName}}</view>
        </view>
    </view>
    <getLocation :wait-response.sync="waitLocation" @location="setLocation" />
</view>
</template>

<script>
/**
 * 房源列表
 */
import getLocation from '../get-location.vue';

let locationCallback = null;

export default {
    name: 'HouseList',
    props: {
        list: {
            type: Array,
        },
    },
    components: {
        getLocation,
    },
    data() {
        return {
            waitLocation: false,
        };
    },
    methods: {
        setLocation(res) {
            this.$$globalData.locationData = res;
            if (typeof locationCallback === 'function') {
                locationCallback(res);
            }
        },
        // 阅读房源详情
        viewHouse(item) {
            this.waitLocation = true;
            locationCallback = () => {
                if (`${item.marking}` === '2') {
                    uni.navigateTo({
                        url: `/pages/contract/rent?id=${item.id}`,
                    });
                } else {
                    uni.navigateTo({
                        url: `/pages/signing/house?id=${item.id}`,
                    });
                }
            };
        },
    },
};
</script>

<style lang="scss">
.house-list {
    $houseItemSize: 180rpx;
    .house-item {
        display: flex;
        flex-wrap: wrap;
        flex-direction: row;
        justify-content: space-between;
        height: $houseItemSize;
        margin: 30rpx 0;
    }
    .house-thumb {
        width: $houseItemSize;
        height: $houseItemSize;
        image {
            display: block;
            width: 100%;
            height: 100%;
        }
    }
    .house-info {
        flex: 1;
        height: $houseItemSize;
        padding: 0 30rpx;
        display: flex;
        flex-wrap: wrap;
        flex-direction: column;
        justify-content: space-between;
        .info-value {
            line-height: 30rpx;
            font-size: 24rpx;
            color: #aaa;
        }
        .price-value {
            font-size: 32rpx;
        }
        .pay-type,
        .price-symbol {
            margin-right: 8rpx;
            font-size: 24rpx;
        }
    }
    .house-status {
        width: 120rpx;
        display: flex;
        flex-wrap: wrap;
        flex-direction: column;
        justify-content: center;
        .status-info {
            width: 100%;
            height: 50rpx;
            line-height: 52rpx;
            font-size: 24rpx;
            text-align: center;
            color: #333;
            border-radius: 8rpx;
            background: #f5f5f5;
            &.status-1 {
                background: #D5E8D4;
            }
            &.status-3 {
                background: #FFE6CC;
            }
        }
    }
    .house-title {
        line-height: 1.4;
        font-size: 32rpx;
    }
}
</style>
