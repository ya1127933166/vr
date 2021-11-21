<template>
<view class="house-material">
    <view class="house-material-group">
        <view class="house-material-item" @tap="toList('electricAppliance')">
            <view class="house-material-item-name">电器类</view>
            <view class="house-material-item-value">
                <view class="content">{{electricAppliance}}</view>
            </view>
            <view class="house-material-item-arrow">
                <view class="cuIcon-right"></view>
            </view>
        </view>
        <view class='cell'></view>
        <view class="house-material-item" @tap="toList('furniture')">
            <view class="house-material-item-name">家具类</view>
            <view class="house-material-item-value">
                <view class="content">{{furniture}}</view>
            </view>
            <view class="house-material-item-arrow">
                <view class="cuIcon-right"></view>
            </view>
        </view>
        <view class='cell'></view>
        <view class="house-material-item" @tap="toList('KeyCert')">
            <view class="house-material-item-name">钥匙凭证</view>
            <view class="house-material-item-value">
                <view class="content">{{KeyCert}}</view>
            </view>
            <view class="house-material-item-arrow">
                <view class="cuIcon-right"></view>
            </view>
        </view>
    </view>

    <view class="house-material-group">
        <view class="house-material-item" @tap="toList('costOfLiving')">
            <view class="house-material-item-name">生活费用信息</view>
            <view class="house-material-item-value">
                <view class="content">{{costOfLiving}}</view>
            </view>
            <view class="house-material-item-arrow">
                <view class="cuIcon-right"></view>
            </view>
        </view>
    </view>
</view>
</template>

<script>
/**
 * 房屋交割单，大分类导航
 */
import {
    mapState,
} from 'vuex';

export default {
    name: 'HouseMaterial',
    data() {
        return {
            isTapBack: false,
        };
    },
    computed: {
        
    },
    onUnload() {
        
    },
    methods: {
        /**
         * 前往列表
         */
        toList(type) {
            this.$$globalMethod.houseMaterialSave = (list) => {
                this.$store.commit('updateHouseMaterial', {
                    type,
                    list,
                });
            };
            uni.navigateTo({
                url: `/pages/contract/house-material-list?type=${type}`,
            });
        },
        /**
         * 返回时，调用缓存事件
         */
        
    },
};
</script>

<style lang="scss">
page {
    background: #f1f1f1;
}

.house-material-group {
    // padding: 16rpx 30rpx;
    margin: 40rpx 0;
    background-color: white;
}

.house-material-item {
    position: relative;
    display: flex;
    flex-wrap: wrap;
    flex-direction: row;
    justify-content: space-between;
    padding: 20rpx 30rpx;
    background: #fff;
    &:first-child::before {
        content: '';
        position: absolute;
        top: 0;
        left: 0;
        right: 0;
        height: 1rpx;
        background: #eee;
    }
    &::after {
        content: '';
        position: absolute;
        left: 30rpx;
        right: 0;
        bottom: 0;
        height: 1rpx;
    }
    &:last-child::after {
        left: 0;
    }
    &:active {
        background: #f5f5f5;
    }
    .house-material-item-name {
        line-height: 72rpx;
        font-size: 28rpx;
    }
    .house-material-item-value {
        flex: 1;
        display: flex;
        flex-wrap: wrap;
        flex-direction: row;
        justify-content: flex-end;
        padding: 0 15rpx;
        .content {
            max-width: 280rpx;
            line-height: 72rpx;
            font-size: 28rpx;
            color: #888;
            text-overflow: ellipsis;
            white-space: nowrap;
            overflow: hidden;
        }
    }
    .house-material-item-arrow {
        width: 40rpx;
        line-height: 72rpx;
        font-size: 36rpx;
        text-align: right;
        color: #aaa;
    }
}
.cell{
    width: 690rpx;
    height: 2rpx;
    background-color: #f1f1f1;
    margin: 0 auto;
}
</style>