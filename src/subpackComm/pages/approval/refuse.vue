<template>
    <!-- 拒绝原因 -->
    <view class='renew'>
         <view class='infoHeader'>
            <view><text>天鹅湖二期</text>2室1厅1卫</view>
            <view>12-2-2001</view>
        </view>

        <view class='title'></view>
        <view class='infoBox'>
            <view class='normal'>
                <view class='left'>驳回类型</view>
                <view class='center' style="color:black">拒绝</view>
                <view class='cuIcon-right'></view>
            </view>
            <view class='normal note'>
                <view class='left'>拒绝原因</view>
                <view class='center'>输入拒绝原因，60字以内</view>
            </view>
            <textarea class='noteArea'></textarea>
        </view>

        <view class='saveBtn'>拒绝</view>
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
.renew{
    .infoHeader{
        background-color: white;
        width: 750rpx;
        text-align: center;
        padding-top: 40rpx;
        padding-bottom: 40rpx;
        border-bottom:solid 4rpx #e6e6e6;
        view:nth-child(1){
            text{
                font-size: 32rpx;
                font-weight: 600;
                padding-right: 10rpx;
            }
        }
    }
    .title{
        font-size: 24rpx;
        color: #6d6c6c;
        padding: 50rpx 0rpx 20rpx 20px;
    }
    .infoBox{
        background-color: white;
        padding: 0rpx 40rpx 0rpx 40rpx;
        box-sizing: border-box;
        .normal{
            display: flex;
            justify-content: space-between;
            align-items: center;
            height: 100rpx;
            border-bottom: solid 1rpx #e6e6e6;
            .normalLeft{
                display: flex;
                align-items: center;
                view:nth-child(1){
                    font-size: 42rpx;
                    color: #0080f0;
                    padding-right: 20rpx;
                }
                
            }
            .pickBox{
                flex-grow: 1;
                display: flex;
                justify-content: space-between;
                .pickItem{
                    display: flex;
                    align-items: center;
                    .picker{
                        padding-right: 20rpx;
                        color: $placerColor;
                    }
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
        }
        .normal:last-child{
            border: none;
        }
        .note{
            border: none;
            .center{
                text-align: right;
            }
        }
        .noteArea{
            height: 100rpx;
        }
    }
    .saveBtn{
        width: 690rpx;
        height: 100rpx;
        color: white;
        font-size: 36rpx;
        font-weight: 600;
        text-align: center;
        background-color: #00a680;
        margin: 40rpx auto;
        line-height: 100rpx;
        border-radius: 10rpx;
    }
}
</style>