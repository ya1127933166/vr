<template>
    <view class="houseItem">
        <view class='itemLeft'>
            <image style="width:190rpx;height:160rpx;" src='https://uss.img.lezhulife.com/xcximages/house-none.jpg'></image>
            <view>DS-103948393</view>
            <view class='mark'>业主</view>
        </view>
        <view class="itemCenter">
            <view>英郡二期1居室</view>
            <view>57m² <text>|</text>1室1厅1卫</view>
            <view>高新.天府软件园</view>
            <view><text class='price'>1805</text>元/月 <text class='mode'>（押1付3）</text></view>
            <view>业务员：张继科</view>
        </view>
        <view class='itemRight'>待审批</view>
    </view>
</template>

<script>
export default {

}
</script>

<style lang='scss' scoped>
$pageBgColor:#f7f7f7;
$borderColor:#e9e9e9;
$placerColor:#cccccc;
$titleColor:#888888;
$greenColor:#00a680;
.houseItem{
    padding: 30rpx 0rpx;
    width: 670rpx;
    margin: 0 auto;
    border-bottom: solid calc(1px / 2.5) #d9d9d9;
    display: flex;
    .itemLeft{
        position: relative;
        overflow: hidden;
        view:nth-child(2){
            font-size: 22rpx;
            color: #d3d3d3;
        }
        .mark{
            position: absolute;
            width: 100rpx;
            height: 70rpx;
            background-color: #ea6b66;
            color: white;
            text-align: center;
            line-height: 110rpx;
            font-size: 22rpx;
            left: -44rpx;
            top: -22rpx;
            transform: rotate(-50deg);
            
        }
    }
    .itemCenter{
        padding-left: 30rpx;
        font-size: 26rpx;
        flex-grow: 1;
        view:nth-child(1){
            font-size: 32rpx;
            font-weight: 600;
        }
        view:nth-child(2){
            color: #888888;
            text{
                margin: 0rpx 10rpx;
            }
        }
        view:nth-child(3){
            color: #888888;
        }
        view:nth-child(4){
            padding-top: 20rpx;
            padding-bottom: 10rpx;
            .price{
                color: #ea6b66;
                font-size: 30rpx;
                font-weight: 600;
                margin-right: 10rpx;
            }
            // .mode{
                
            // }
        }
        // view:nth-child(5){
            
        // }
        
    }
    .itemRight{
        width: 100rpx;
        background-color: #ffe6cc;
        color: #ff9933;
        height: 40rpx;
        margin: auto 20rpx;
        text-align: center;
        font-size: 28rpx;
        line-height: 40rpx;
        border-radius: 4rpx;
    }
    &:active{
        
        background-color: #fafafa;
    }
}
</style>