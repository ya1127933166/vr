<template>
<view class="loading-group">
    <view class="loader"></view>
    <view class="loader-text" >加载中</view>
</view>
</template>

<script>
/**
 * Loading
 */
export default {
    name: 'LoadingGroup',
};
</script>

<style lang="scss">
.loading-group {
    position: relative;
    width: 100%;
    height: 100rpx;
}
.loader-text{
    text-align: center;
    color: #ccc;
    margin-top:60rpx;
}
.loader:before {
    content: "";
    position: absolute;
    top: 0;
    left: -25rpx;
    height: 12rpx;
    width: 12rpx;
    border-radius: 12rpx;
    -webkit-animation: loaderg 1s ease-in-out infinite;
    animation: loaderg 1s ease-in-out infinite;
}

.loader {
    position: relative;
    width: 12rpx;
    height: 12rpx;
    top: 50%;
    left: 50%;
    margin: -6rpx 0 0 -6rpx;
    border-radius: 12rpx;
    -webkit-animation: loaderm 1s ease-in-out infinite;
    animation: loaderm 1s ease-in-out infinite;
}


.loader:after {
    content: "";
    position: absolute;
    top: 0;
    left: 25rpx;
    height: 12rpx;
    width: 12rpx;
    border-radius: 12rpx;
    -webkit-animation: loaderd 1s ease-in-out infinite;
    animation: loaderd 1s ease-in-out infinite;
}

@-webkit-keyframes loaderg {
    0% {
        background-color: rgba(200, 200, 200, .2);
    }

    25% {
        background-color: rgba(200, 200, 200, 1);
    }

    50% {
        background-color: rgba(200, 200, 200, .2);
    }

    75% {
        background-color: rgba(200, 200, 200, .2);
    }

    100% {
        background-color: rgba(200, 200, 200, .2);
    }
}

@keyframes loaderg {
    0% {
        background-color: rgba(200, 200, 200, .2);
    }

    25% {
        background-color: rgba(200, 200, 200, 1);
    }

    50% {
        background-color: rgba(200, 200, 200, .2);
    }

    75% {
        background-color: rgba(200, 200, 200, .2);
    }

    100% {
        background-color: rgba(200, 200, 200, .2);
    }
}

@-webkit-keyframes loaderm {
    0% {
        background-color: rgba(200, 200, 200, .2);
    }

    25% {
        background-color: rgba(200, 200, 200, .2);
    }

    50% {
        background-color: rgba(200, 200, 200, 1);
    }

    75% {
        background-color: rgba(200, 200, 200, .2);
    }

    100% {
        background-color: rgba(200, 200, 200, .2);
    }
}

@keyframes loaderm {
    0% {
        background-color: rgba(200, 200, 200, .2);
    }

    25% {
        background-color: rgba(200, 200, 200, .2);
    }

    50% {
        background-color: rgba(200, 200, 200, 1);
    }

    75% {
        background-color: rgba(200, 200, 200, .2);
    }

    100% {
        background-color: rgba(200, 200, 200, .2);
    }
}

@-webkit-keyframes loaderd {
    0% {
        background-color: rgba(200, 200, 200, .2);
    }

    25% {
        background-color: rgba(200, 200, 200, .2);
    }

    50% {
        background-color: rgba(200, 200, 200, .2);
    }

    75% {
        background-color: rgba(200, 200, 200, 1);
    }

    100% {
        background-color: rgba(200, 200, 200, .2);
    }
}

@keyframes loaderd {
    0% {
        background-color: rgba(200, 200, 200, .2);
    }

    25% {
        background-color: rgba(200, 200, 200, .2);
    }

    50% {
        background-color: rgba(200, 200, 200, .2);
    }

    75% {
        background-color: rgba(200, 200, 200, 1);
    }

    100% {
        background-color: rgba(200, 200, 200, .2);
    }
}
</style>