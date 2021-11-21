<template>
    <!-- 编辑租客 -->
    <view class='editTenant'>
        <view class='infoHeader'>
            <block>
                <view><text>天鹅湖二期</text>2室1厅1卫</view>
                <view>12-2-2001</view>
            </block>
        </view>
        <view class='title'>租客信息</view>
        <view class='infoBox'>
            <view class='normal'>
                <view class='left'>出租方式</view>
                <view class='center'><view class='tag'>合租</view></view>
                <view class='right'></view>
            </view>
             <view class='normal'>
                <view class='left'>房间号</view>
                <view class='center'><view class='tag'>A房间</view></view>
                <view class='pickBox'>
                    <picker mode="date" fields="month" :value="currentData" start="2015-09-01" end="2017-09-01" @change="bindDateChange">
                        <view class='pickItem'>
                            <view class="picker"></view>
                        </view>
                    </picker>
                </view>
                <view class='cuIcon-right'></view>
            </view>
            <view class='normal'>
                <view class='left'>租客姓名</view>
                <view class='center' style="color:black;">张珊珊</view>
                <view class='right'></view>
            </view>
            <!-- <view class='normal'>
                <view class='left'>是否合租人</view>
                <view class='center'>
                    <view class='btnBox'>
                        <view>是</view>
                        <view>否</view>
                    </view>
                </view>
            </view> -->
            <view class='normal'>
                <view class='left'>身份证</view>
                <input class='center' placeholder-style="color:black;" placeholder-class="center" placeholder="510 120 19901222 ****" />
                <view class='cuIcon-right'></view>
            </view>
            <view class='normal'>
                <view class='left'>手机号</view>
                <input type="number" class='center' placeholder-style="color:black;" placeholder-class="center" placeholder="180 **** 2833" />
                <image style="width:50rpx;height:30rpx;" src='https://uss.img.lezhulife.com/xcxicon/yanjing2.png'></image>
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
.editTenant{
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
        font-size: 30rpx;
        .normal{
            display: flex;
            justify-content: space-between;
            align-items: center;
            height: 100rpx;
            padding: 0rpx 40rpx 0rpx 40rpx;
            border-bottom: solid calc(1px / 2) #d9d9d9;
            position: relative;
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
                    position: absolute;
                    height: 100rpx;
                    width: 600rpx;
                    display: flex;
                    left: 80rpx;
                    top: 0;
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
                font-size: 30rpx;
                .tag{
                    display: inline-block;
                    color: #6666ff;
                    background-color: #dae8fc;
                    font-size: 30rpx;
                    text-align: center;
                    padding: 4rpx 10rpx;
                    border-radius: 6rpx;
                }
                .btnBox{
                    display: flex;
                    view{
                        width: 150rpx;
                        height: 50rpx;
                        border-radius: 30rpx;
                        font-size: 28rpx;
                        text-align: center;
                        line-height: 50rpx;
                        margin-right: 20rpx;
                    }
                    view:nth-child(1){
                        border: solid 1rpx $titleColor;
                        color: black;
                    }
                    view:nth-child(2){
                        border: solid 1rpx $greenColor;
                        color: $greenColor;
                    }
                }
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
