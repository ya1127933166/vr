<template>
<view class="location-guide-bg"
    v-if="locationGuideVisible"
    @tap="locationGuideVisible = false">
    <view class="location-guide" @tap.stop="">
        <view class="title">请开启定位权限</view>
        <button class="open-auth-setting"
            open-type="openSetting"
            @opensetting="checkAuth">
            打开授权设置
        </button>
    </view>
</view>
</template>
<script>
/**
 * 辅助获取定位权限组件
 */
export default {
    name: 'GetLocation',
    props: {
        waitResponse: Boolean,
    },
    data() {
        return {
            locationGuideVisible: false,
        };
    },
    mounted() {
        if (this.waitResponse) {
            this.getUserLocation();
        }
    },
    watch: {
        waitResponse() {
            if (this.waitResponse) {
                this.getUserLocation();
            }
        },
    },
    methods: {
        closeWaitResponse() {
            this.$emit('update:waitResponse', false);
        },
        /**
         * 获取用户定位
         */
        async getUserLocation(num = 0) {
            uni.showLoading({
                title: '获取定位中...',
                mask: true,
            });
            if (num > 3) {
                uni.hideLoading();
                this.closeWaitResponse();
                uni.showModal({
                    content: '经过多次尝试，无法获取您的定位信息。请检查微信是否有定位权限，或检查是否开启了手机定位服务。',
                    showCancel: false,
                });
                return null;
            }
            const [err, res] = await uni.getLocation({
                type: 'gcj02',
                altitude: true,
            });
            if (err) {
                const checkAuth = await this.checkLocationAuth();
                if (checkAuth) {
                    setTimeout(async () => {
                        await this.getUserLocation(num + 1);
                    }, 500);
                } else {
                    uni.hideLoading();
                this.closeWaitResponse();
                    this.locationGuideVisible = true;
                }
            } else {
                uni.hideLoading();
                this.closeWaitResponse();
                this.$emit('location', res);
            }
            return true;
        },
        async checkLocationAuth() {
            const [err, res] = await uni.getSetting();
            if (err) return false;
            return res.authSetting.hasOwnProperty('scope.userLocation') && res.authSetting['scope.userLocation'] === true;
        },
        /**
         * 确定是否授权
         * 未授权，弹出提示
         */
        async checkAuth() {
            this.locationGuideVisible = false;
            const status = await this.checkLocationAuth();
            if (!status) {
                uni.showModal({
                    content: '由于无法正常获取定位，您不能进行相关操作，请开启定位权限后继续操作。',
                    showCancel: false,
                });
            }
        },
    },
};
</script>

<style lang="scss">
.location-guide-bg {
    position: fixed;
    top: 0;
    left: 0;
    bottom: 0;
    right: 0;
    display: flex;
    flex-wrap: wrap;
    flex-direction: row;
    justify-content: space-between;
    background: rgba(0, 0, 0, .25);
    z-index: 1000;
}
.location-guide {
    width: 600rpx;
    margin: auto;
    padding: 0 0 40rpx;
    text-align: center;
    border-radius: 12rpx;
    background: #fff;
    box-sizing: border-box;
    overflow: hidden;
    z-index: 1001;
    .title {
        height: 90rpx;
        margin-bottom: 40rpx;
        line-height: 90rpx;
        font-size: 32rpx;
        color: #000;
        background: #f5f5f5;
    }
    .open-auth-setting {
        width: 280rpx;
        height: 80rpx;
        line-height: 80rpx;
        text-align: center;
        font-size: 28rpx;
        text-align: center;
        color: #fff;
        border: none;
        border-radius: 4rpx;
        background: #00a680;
        &::after,
        &::before {
            display: none;
        }
    }
}
</style>