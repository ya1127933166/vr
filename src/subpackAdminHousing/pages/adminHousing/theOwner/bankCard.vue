<template>
    <!-- 银行卡信息 -->
    <view class='bank'>
        <view class='title'>业主信息</view>
        <view class='infoBox'>
            <view class='normal'>
                <view class='left'>收款人</view>
                <view class='center' style="color:black;">张三三</view>
                <view class='right'></view>
                <!-- <view class='cuIcon-right'></view> -->
            </view>
            <view class='normal'>
                <view class='left'>开户银行</view>
                <view class='center' style="color:black;">中国银行</view>
                <view class='right'></view>
                <view class='cuIcon-right'></view>
            </view>
            <view class='normal'>
                <view class='left'>收款账号</view>
                <view class='center' style="color:black;">1229 3288 1234 1279</view>
                <!-- <view class='cuIcon-right'></view> -->
            </view>
            <view class='normal'>
                <view class='left'>开户行地址</view>
                <view class='center'>可选</view>
                <!-- <view class='cuIcon-right'></view> -->
            </view>
        </view>

        <view class='saveBtn'>保存</view>
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
page{
    background-color: $pageBgColor;
}

.bank{
    border-top: solid 4rpx $borderColor;  
    .title{
        font-size: 26rpx;
        color: $titleColor;
        padding: 50rpx 0rpx 20rpx 16px;
    }
    .infoBox{
        background-color: white;
        box-sizing: border-box;
        .normal{
            display: flex;
            justify-content: space-between;
            align-items: center;
            height: 100rpx;
            border-bottom: solid calc(1px / 2.5) #d9d9d9;
            padding: 0rpx 40rpx 0rpx 40rpx;
            font-size: 30rpx;
            .normalLeft{
                display: flex;
                align-items: center;
                view:nth-child(1){
                    font-size: 42rpx;
                    color: #0080f0;
                    padding-right: 20rpx;
                }
                
            }
            .left{
                width: 260rpx;
            }
            .center{
                flex-grow: 1;
                color: #cccccc;
            }
            .right{
                display: flex;
                align-items: center;
                view{
                    color: black;
                    font-weight: 600;
                }
                image{
                    margin-left: 20rpx;
                }
            }
            &:active{
                background-color: #fafafa;
            }
        }
        .normal:last-child{
            border: none;
        }
    }
    .saveBtn{
        width: 690rpx;
        height: 100rpx;
        color: white;
        font-size: 34rpx;
        // font-weight: 600;
        text-align: center;
        background-color: #00a680;
        margin: 40rpx auto;
        line-height: 100rpx;
        border-radius: 10rpx;
        &:active{
            background-color: #007e5e;
        }
    }
}
</style>