<template>
<view class="region-container">
	<view class="region-info-group">
		<view class="region-name">{{area}}</view>
		<view class="region-data-type-select" :class="'select-key-' + dataRangeIndex">
			<view class="data-option-item" :class="{'active': dataRangeIndex == 0}" @tap="switchRange(0)">近3日</view>
			<view class="data-option-item" :class="{'active': dataRangeIndex == 1}" @tap="switchRange(1)">近30日</view>
		</view>
		<view class="region-data-top-switch" @tap="switchType">
			<view class="switch-item" :class="{'active': dataType == 0}">热门出租小区TOP10</view>
			<view class="switch-item" :class="{'active': dataType == 1}">热门上新小区TOP10</view>
			<view class="switch-icon">
				<image src="https://uss.img.lezhulife.com/xcxicon/switch-icon.png" mode="scaleToFill"></image>
			</view>
		</view>
	</view>
	<view class="region-data-container">
		<view class="region-xiaoqu-list">
			<view v-for="(item, index) in rows"
				:key="index"
				@tap="toXiaoqu(item)"
				class="xiaoqu-item">
				<view class="xiaoqu-name">{{item.name}}</view>
				<view class="xiaoqu-info" v-if="dataType === 0">出租{{item.count}}套/共{{item.total}}套</view>
				<view class="xiaoqu-info" v-else-if="dataType === 1">上新{{item.count}}套/共{{item.total}}套</view>
			</view>
		</view>
		<view class="region-more-data" @tap="toXiaoquList">
			<text>更多小区</text>
			<view class="more-icon cuIcon-right"></view>
		</view>
	</view>
</view>
</template>

<script>
/**
 * 区域模块
 */
export default {
	name: 'RegionItem',
	props: {
		list: Object,
		area: String,
		city: String,
	},
	data() {
		return {
			dataRangeIndex: 0,
			dataType: 0,
			loading: false,
		};
	},
    computed: {
        rows() {
            if (!this.list) return [];
            let key = '';
            if (this.dataRangeIndex === 0 && this.dataType === 0) {
                key = 'date3RentTop';
            } else if (this.dataRangeIndex === 0 && this.dataType === 1) {
                key = 'date3AddTop';
            } else if (this.dataRangeIndex === 1 && this.dataType === 0) {
                key = 'date30RentTop';
            } else {
                key = 'date30AddTop';
            }
            return this.list[key] || [];
        },
    },
	methods: {
		toXiaoqu(item) {
			uni.navigateTo({
				url: `/pages/xiaoqu/item?id=${item.id}`,
			});
		},
		toXiaoquList() {
			uni.navigateTo({
				url: `/pages/xiaoqu/list?area=${this.area}&city=${this.city}`,
			});
		},
		switchRange(index) {
			this.dataRangeIndex = index;
		},
		switchType() {
			this.dataType = this.dataType ? 0 : 1;
		},
	},
};
</script>

<style lang="scss">
.region-container {
	padding: 30rpx;
	border-bottom: 10rpx solid #f5f5f5;
    display: flex;
    flex-wrap: wrap;
    flex-direction: row;
    justify-content: space-between;
}
.region-info-group {
	width: 200rpx;
	.region-name {
		margin-bottom: 20rpx;
		font-size: 40rpx;
		font-weight: bold;
		color: #222;
	}
}
.region-data-type-select {
    display: flex;
    flex-wrap: wrap;
    flex-direction: row;
    justify-content: space-between;
	height: 60rpx;
	margin: 10rpx 0;
	.data-option-item {
		width: 50%;
		height: 50rpx;
		line-height: 50rpx;
		font-size: 24rpx;
		text-align: center;
		&:first-child {
			border-left: 1rpx solid #ccc;
			border-top: 1rpx solid #ccc;
			border-bottom: 1rpx solid #ccc;
			border-top-left-radius: 8rpx;
			border-bottom-left-radius: 8rpx;
		}
		&:last-child {
			border-right: 1rpx solid #ccc;
			border-top: 1rpx solid #ccc;
			border-bottom: 1rpx solid #ccc;
			border-top-right-radius: 8rpx;
			border-bottom-right-radius: 8rpx;
		}
		&.active {
			color: #fff;
			border-color: #00a680 !important;
			background: #00a680;
		}
	}
}
.region-data-top-switch {
	position: relative;
	padding-right: 50rpx;
	line-height: 30rpx;
	font-size: 24rpx;
	.switch-item {
		display: none;
	}
	.switch-item.active {
		display: block;
	}
	.switch-icon {
		position: absolute;
		top: 4rpx;
		right: 30rpx;
		width: 20rpx;
		height: 20rpx;
		image {
			display: block;
			width: 100%;
			height: 100%;
		}
	}
}
.region-data-container {
	position: relative;
	width: 460rpx;
	padding-bottom: 70rpx;
	.region-xiaoqu-list {
		display: flex;
		flex-wrap: wrap;
		flex-direction: row;
		justify-content: space-between;
	}
	.xiaoqu-item {
		width: 220rpx;
		height: 90rpx;
		padding: 15rpx 10rpx;
		margin-bottom: 30rpx;
		text-align: center;
		border: 1rpx solid #e5e5e5;
		border-radius: 8rpx;
	}
	.xiaoqu-name {
		width: 100%;
		height: 30rpx;
		line-height: 30rpx;
		font-size: 24rpx;
		color: #222;
		text-overflow: ellipsis;
		white-space: nowrap;
		overflow: hidden;
	}
	.xiaoqu-info {
		height: 30rpx;
		line-height: 30rpx;
		font-size: 20rpx;
		color: #444;
	}
}
.region-more-data {
	position: absolute;
	right: 0;
	bottom: 0;
	width: 150rpx;
	height: 60rpx;
	padding: 0 40rpx 0 15rpx;
	line-height: 60rpx;
	font-size: 24rpx;
	border-radius: 4rpx;
	background: #f5f5f5;
	.more-icon {
		position: absolute;
		top: 0;
		right: 10rpx;
		width: 30rpx;
		height: 60rpx;
		line-height: 60rpx;
		color: #555;
	}
}
</style>
