<template>
    <view class='delivery'>
        <view class='title'>房交割情况</view>
        <view class='describe'>原房间内的配置交割清单</view>
        <view class='detail'>
            <view class='detailItem'>
                <view class='itemLeft'>电器</view>
                <view class='itemRight'>
                    长虹x1;康佳x1;微波炉x1;空调1.5p-2台;热水器x1;抽油烟机x1;
                </view>
            </view>
            <view class='detailItem'>
                <view class='itemLeft'>钥匙凭证</view>
                <view class='itemRight'>
                    门禁卡x1;钥匙x3;
                </view>
            </view>
        </view>
        <view class='remark'>
            <view class='remarkTitle'>房屋说明备注</view>
            <view class='remarkDescribe'>房屋描述，特色或业主要求</view>
            <view disabled class='remarkContent'>房屋特色/业主要求</view>
        </view>
    </view>

</template>

<script>
export default {
    name:'delivery',
    data(){
        return{

        }
    }
}
</script>

<style lang='scss' scoped>
.delivery{
    padding-top: 70rpx;
    .title{
        width: 690rpx;
        margin: 0 auto;
        font-size: 32rpx;
        font-weight: 600;
    }
    .describe{
        width: 690rpx;
        margin: 10rpx auto;
        font-size: 26rpx;
        color:rgb(109, 104, 104);
    }
    .detail{
        width: 100%;
        padding: 20rpx 40rpx 20rpx 40rpx;
        font-size: 30rpx;
        .detailItem{
            display: flex;
            border-bottom: solid 4rpx#eeeeee;
            .itemLeft{
                min-height: 140rpx;
                width: 240rpx;
                margin: auto 0;
                line-height: 140rpx;
            }
            .itemRight{
                min-height: 100rpx;
                width: 430rpx;
                display: flex;
                align-items: center;
            }

        }
        .detailItem:last-of-type{
            border: none;
        }
    }
    .remark{
        width: 100%;
        border-top: solid 14rpx#eeeeee;
        border-bottom: solid 14rpx #eeeeee;
        padding: 50rpx 30rpx 50rpx 30rpx;
        .remarkTitle{
            padding-top: 30rpx;
            font-size: 32rpx;
            font-weight: 600;
        }
        .remarkDescribe{
            padding-top: 10rpx;
            font-size: 26rpx;
            color:rgb(109, 104, 104);
        }
        .remarkContent{
            margin-top: 30rpx;
            width: 100%;
            min-height: 100rpx;
            border: solid 6rpx #eeeeee;
            background-color: #f7f7f7;
            border-radius: 4rpx;
            padding: 20rpx 20rpx 20rpx 10rpx;
            color: #807b7b;
            font-size: 30rpx;
        }
    }
}
</style>