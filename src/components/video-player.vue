<template>
<view class="video-player">
    <video :src="videoSrc" controls :autoplay="true" @play="handlePlay" @pause="handlePause" @waiting="handleWaiting" @error="handleError"></video>
    <cover-view class="video-play-tips" v-if="tips && tips.length">{{tips}}</cover-view>
</view>
</template>

<script>
export default {
    name: 'VideoPlayer',
    props: {
        videoSrc: {
            type: String,
        },
    },
    data() {
        return {
            tips: null,
        };
    },
    methods: {
        handlePlay() {
            this.tips = null;
        },
        handlePause() {
            // this.tips = null;
        },
        handleWaiting(e) {
            // this.tips = '正在加载视频...';
        },
        handleError() {
            this.tips = '加载视频失败...';
        },
    },
};
</script>

<style lang="scss">
.video-player {
    position: relative;
    width: 750rpx;
    height: 750rpx;
    overflow: hidden;
    video {
        width: 100%;
        height: 750rpx;
    }
    .video-play-tips {
        height: 80rpx;
        line-height: 80rpx;
        font-size: 28rpx;
        text-align: center;
        color: #444;
        background: rgba(255, 255, 255, .75);
        z-index: 1;
    }
}
</style>
