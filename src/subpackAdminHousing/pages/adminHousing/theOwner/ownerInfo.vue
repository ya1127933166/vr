<template>
    <!-- 业主信息 -->
    <view class='ownerInfo'>
        <view class='infoHeader'>
            <view><text>天鹅湖二期</text>2室1厅1卫</view>
            <view>12-2-2001</view>
        </view>

        <view class='title'>业主信息</view>
        <view class='infoBox'>
            <view class='normal'>
                <view class='left'>姓名</view>
                <view class='center'>张三三</view>
                <view class='right'>
                    <image style="width:50rpx;height:50rpx" src='https://uss.img.lezhulife.com/xcxicon/home-addrBook.png'></image>
                </view>
            </view>
            <view class='normal'>
                <view class='left'>联系电话</view>
                <view class='center'>
                    <view>130 *** 4722</view>
                </view>
                <view class='right'>
                    <image style="width:50rpx;height:30rpx" src='https://uss.img.lezhulife.com/xcxicon/yanjing2.png'></image>
                </view>
            </view>
            <view class='normal'>
                <view class='left'>身份证</view>
                <view class='center'>请完善</view>
                <view class='cuIcon-right'></view>
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
page{
    background-color: var(--pageBgColor);
}
.ownerInfo{
    .infoHeader{
        background-color: white;
        width: 750rpx;
        text-align: center;
        padding-top: 40rpx;
        padding-bottom: 40rpx;
        border-bottom:solid 4rpx #e6e6e6;
         view:nth-child(1){
            text{
                font-size: 34rpx;
                font-weight: 600;
                padding-right: 10rpx;
            }
        }
    }
    .title{
        font-size: 26rpx;
        color: #6d6c6c;
        padding: 50rpx 0rpx 20rpx 16px;
    }
    .infoBox{
        background-color: white;
        box-sizing: border-box;
        .normal{
            padding: 0rpx 40rpx 0rpx 40rpx;
            display: flex;
            justify-content: space-between;
            align-items: center;
            height: 100rpx;
            font-size: 30rpx;
            border-bottom: solid calc(1px / 2.5) #d9d9d9;
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