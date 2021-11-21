<template>
    <view class="step-flow">
        <view class="step-item">
            <view class="step-arrow" :class="{active: ligth >= 0}"></view>
            <view class="step-name">填写房源</view>
            <view class="step-line-ligth" v-if="step > 0"></view>
        </view>
        <view class="step-item">
            <view class="step-arrow" :class="{active: ligth >= 1}"></view>
            <view class="step-name">系统审批</view>
            <view class="step-line-ligth" v-if="step > 1"></view>
        </view>
        <view class="step-item">
            <view class="step-arrow" :class="{active: ligth >= 2}"></view>
            <view class="step-name">正式签约</view>
        </view>
    </view>
</template>

<script>
export default {
    name: 'TabFlow',
    props: {
        ligth: Number,
        step: Number,
        default: 0,
    },
    data() {
        return {};
    },
}
</script>

<style lang="scss">
.step-flow {
    position: relative;
    display: flex;
    flex-wrap: wrap;
    flex-direction: row;
    justify-content: center;
    height: 160rpx;
    padding: 0 5% 40rpx;
    background: #fafafa;
    &::before {
        content: '';
        position: absolute;
        left: 16.667%+2%;
        right: 16.667%+2%;
        top: 50rpx;
        height: 2rpx;
        margin-top: -1rpx;
        background: #ccc;
    }
    .step-item {
        position: relative;
        width: 33.33%;
        height: 140rpx;
        padding-top: 50rpx;
        text-align: center;
        box-sizing: border-box;
        .step-line-ligth {
            position: absolute;
            left: 0;
            right: 0;
            top: 50rpx;
            height: 2rpx;
            margin-top: -1rpx;
            background: #00a680;
            z-index: 1;
        }
        &:first-child {
            .step-line-ligth {
                left: 50%;
            }
        }
        &:last-child {
            .step-line-ligth {
                right: 50%;
            }
        }
    }
    .step-arrow {
        position: absolute;
        top: 50rpx;
        left: 50%;
        width: 24rpx;
        height: 24rpx;
        margin-top: -12rpx;
        margin-left: -12rpx;
        border-radius: 50%;
        background: #ccc;
        &.active {
            background: #00A680;
        }
    }
    .step-name {
        line-height: 90rpx;
        font-size: 24rpx;
        color: #555;
    }
}
</style>
