<template>
<view class="video-player-box" :style="'padding-top: ' + headerHeight + 'px;'" @touchmove.stop="">
    <view class="video-player-content">
        <video-player :video-src="playVideoSrc"></video-player>
    </view>
    <view class="video-select-group">
        <view v-for="(item, index) in list"
            :key="index"
            @tap="selectPlayVideo(item, index)"
            :class="{active: playIndex === index}"
            class="video-option">视频{{index + 1}}</view>
    </view>
    <view class="close-btn" @tap="close">
        <text class="cuIcon-close"></text>
        <text>退出播放</text>
    </view>
</view>
</template>

<script>
import { mapState } from 'vuex';
import VideoPlayer from './video-player.vue';

export default {
    name: 'VidePlayerBox',
    components: {
        VideoPlayer,
    },
    props: {
        list: {
            type: Array,
        },
        current: {
            type: Number,
            default: 0,
        },
    },
    data() {
        return {
            playVideoSrc: '',
            playIndex: 0,
        };
    },
    computed: {
        ...mapState({
            statusHeight: state => state.sys.statusBarHeight,
            headerHeight: (state) => {
                const baseHeight = state.custom.bottom + state.custom.top;
                if (state.custom.top < state.sys.statusBarHeight) {
                    return baseHeight + state.sys.statusBarHeight;
                }
                return baseHeight - state.sys.statusBarHeight;
            },
            barHeight: state => state.custom.bottom + state.custom.top - state.sys.statusBarHeight,
            marginWidth: state => state.sys.windowWidth - state.custom.right,
        }),
    },
    mounted() {
        if (this.list.length) {
            this.playVideoSrc = this.list[this.playIndex];
        }
        if (this.current != this.playIndex) {
            this.playIndex = this.current;
            this.playVideoSrc = this.list[this.playIndex];
        }
    },
    methods: {
        selectPlayVideo(item, index) {
            this.playIndex = index;
            this.playVideoSrc = item;
        },
        close() {
            this.$emit('close');
        },
    },
    watch: {
        current() {
            this.playIndex = this.current;
            this.playVideoSrc = this.list[this.playIndex];
        },
    },
};
</script>

<style lang="scss">
.video-player-box {
    position: fixed;
    top: 0;
    right: 0;
    bottom: 0;
    left: 0;
    padding-top: 1rpx;
    padding-bottom: 150rpx;
    background: #fff;
    z-index: 1000;
    overflow: hidden;
    .close-btn {
        position: absolute;
        left: 0;
        right: 0;
        bottom: 0;
        padding-bottom: 20rpx;
        height: 120rpx;
        line-height: 100rpx;
        text-align: center;
        font-size: 32rpx;
        color: #555;
        background: #f8f8f8;
    }
}
.video-player-content {
    width: 750rpx;
    // height: 750rpx;
    overflow: hidden;
}
.video-select-group {
    padding: 20rpx 30rpx;
    overflow-x: hidden;
    overflow-y: auto;
    .video-option {
        display: inline-block;
        height: 80rpx;
        padding: 0 20rpx;
        margin: 10rpx;
        line-height: 80rpx;
        font-size: 28rpx;
        color: #333;
        border-radius: 8rpx;
        background: #f5f5f5;
        &.active {
            color: #fff;
            background: #00a680;
        }
    }
}
</style>
