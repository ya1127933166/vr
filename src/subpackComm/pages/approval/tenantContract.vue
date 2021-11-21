<template>
    <!-- 租客合同 -->
    <view class='renew'>
         <view class='infoHeader'>
            <view><text>天鹅湖二期</text>2室1厅1卫</view>
            <view>12-2-2001</view>
        </view>

        <view class='title'>业务员信息</view>
        <view class='infoBox'>
            <view class='normal'>
                <view class='left'>业务员</view>
                <view class='center'>王小二/ 180 1234 4823</view>
                <view style="color:#969696;transform: rotate(90deg);font-size:50rpx;" class='cuIcon-phone'></view>
            </view>
        </view>

        <view class='title'>租客信息</view>
        <view class='infoBox'>
            <view class='normal'>
                <view class='left'>租客姓名</view>
                <view class='center'>王二</view>
            </view>
            <view class='normal'>
                <view class='left'>租客电话</view>
                <view class='center'>186 8899 3322</view>
                <view style="color:#969696;transform: rotate(90deg);font-size:50rpx;" class='cuIcon-phone'></view>
            </view>
        </view>

        <view class='title'>租约信息</view>
        <view class='infoBox'>
            <view class='normal'>
                <view class='left'>房源</view>
                <view class='center'>望京西园1区3号楼503 A房间</view>
            </view>
            <view class='normal'>
                <view class='left'>台帐号</view>
                <view class='center'>京A 3-43-2</view>
                <view class='right'>复制</view>
            </view>
            <view class='normal'>
                <view class='left'>租期</view>
                <view class='center'>(368天)2018-03-03至2019-02-05</view>
            </view>
            <view class='normal'>
                <view class='left'>月租金</view>
                <view class='center'>￥ 3100.00</view>
            </view>
            <view class='normal'>
                <view class='left'>押金</view>
                <view class='center'>￥ 3100.00</view>
            </view>
        </view>

        <view class='title'>其他费用项目</view>
        <view class='infoBox'>
            <view class='normal'>
                <view class='left'>卫生费</view>
                <view class='center'>￥ 100.00(每月)</view>
            </view>
        </view>
        <view style="width:750rpx;height:200rpx;"></view>
        <view class='bottomBar'>
            <view class="review">
                <image style="width:40rpx;height:40rpx;" src='https://uss.img.lezhulife.com/xcxicon/viewContract.png'></image>
                <view>查看合同</view>
            </view>
            <view class='reject'>
                <view>驳回</view>
                <view style="margin-left: 10rpx;" class='cuIcon-unfold'></view>
            </view>
            <view class="adopt">通过</view>
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
        font-size: 26rpx;
        color: $titleColor;
        padding: 50rpx 0rpx 20rpx 16px;
    }
    .infoBox{
        background-color: white;
        box-sizing: border-box;
        .normal{
            padding: 0rpx 40rpx 0rpx 40rpx;
            font-size: 30rpx;
            display: flex;
            justify-content: space-between;
            align-items: center;
            height: 100rpx;
            border-bottom: solid calc(1px / 2.5) #d9d9d9;
            .left{
                width: 240rpx;
            }
            .center{
                flex-grow: 1;
                color:#cccccc;
            }
            .right{
                color: #969696;
                border: solid 1rpx #969696;
                width: 80rpx;
                height: 40rpx;
                font-size: 24rpx;
                text-align: center;
                line-height: 40rpx;
                border-radius: 6rpx;
            }
        }
        .normal:last-child{
            border: none;
        }
    }
    .bottomBar{
        position:fixed;
        left: 0;
        bottom: 0;
        width: 750rpx;
        height: 120rpx;
        background-color: white;
        display: flex;
        justify-content: space-around;
        align-items: center;
        .review{
            text-align:center;
            font-size: 24rpx;
            background-color: white;
        }
        .reject,.adopt{
            width: 240rpx;
            height: 80rpx;
            border-radius: 7rpx;
            text-align: center;
            line-height: 80rpx;
            color: white;
            font-size: 30rpx;
        }
        .reject{
            background-color: #ff9933;
            display: flex;
            justify-content: center;
        }
        .adopt{
            background-color: #00a680;
        }
    }
}
</style>