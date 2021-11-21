<template>
    <!-- 账单组件 -->
    <view class='bill'>
        <view class='income'>
            <view class='time'>
                <view>2020年10月</view>
                <view>收入￥3500&nbsp;&nbsp;&nbsp;支出￥60</view>
            </view>
            <view class='info'>
                <view class='item'>
                    <view class='itemLeft'>
                        <view>租金</view>
                        <view>10月22日 13:22</view>
                    </view>
                    <view class='itemRight'>+3500.00</view>
                </view>
                <view class='item'>
                    <view class='itemLeft'>
                        <view>维修费</view>
                        <view>10月22日 13:22</view>
                    </view>
                    <view class='itemRight' style="color:black;">-60.00</view>
                </view>
            </view>
        </view>

        <view class='income'>
            <view class='time'>
                <view>2020年10月</view>
                <view>收入￥3500&nbsp;&nbsp;&nbsp;支出￥60</view>
            </view>
            <view class='info'>
                <view class='item'>
                    <view class='itemLeft'>
                        <view>租金</view>
                        <view>10月22日 13:22</view>
                    </view>
                    <view class='itemRight'>+3500.00</view>
                </view>
                <view class='item'>
                    <view class='itemLeft'>
                        <view>押金</view>
                        <view>10月22日 13:22</view>
                        <view>租客首次缴纳押金</view>
                    </view>
                    <view class='itemRight' style="color:black;">-60.00</view>
                </view>
            </view>
        </view>
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
.bill{
    .income{
        .time{
            font-weight: 600;
            font-size: 32rpx;
            padding: 30rpx 0rpx 10rpx 40rpx;
            view:nth-child(2){
                font-size: 28rpx;
                color: $titleColor;
                padding:10rpx 0rpx 10rpx 0rpx;
            }
        }
        .info{
            background-color: white;
            width: 700rpx;
            margin: 0 auto;
            border-radius: 8rpx;
            .item{
                display: flex;
                width: 650rpx;
                margin: 0 auto;
                box-sizing: border-box;
                align-items: center;
                justify-content: space-between;
                border-bottom: solid calc(1px / 2.5) $borderColor;
                padding: 20rpx 0rpx 20rpx 0rpx;
                .itemLeft{
                    view:nth-child(1){
                        font-size: 30rpx;
                        font-weight: 600;
                    }
                    view:nth-child(2),view:nth-child(3){
                        font-size: 28rpx;
                        color: $titleColor;
                        font-weight: 600;
                    }
                }
                .itemRight{
                    font-size: 34rpx;
                    font-weight: 600;
                    color: #0ebc0c;
                    
                }
                .itemRight::first-letter{
                    padding-right: 14rpx;
                }
            }
            .item:last-child{
                border: none;
            }
            &:active{
                background-color: #fafafa;
            }
        }
    }
}
</style>