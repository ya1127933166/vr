<template>
    <!-- 续租 -->
    <view class='renewal'>
        <view class='infoHeader'>
            <view>张珊珊/李依依<text>A房间</text></view>
            <view><text>天鹅湖二期</text>2室1厅1卫</view>
            <view>12-2-2001</view>
        </view>
        <view class='title'>续租信息</view>
        <view class='infoBox'>
            <view class='normal'>
                <view class='left'>续租信息</view>
                <view class='pickBox'>
                    <picker mode="date" fields="month" :value="currentData" start="2015-09-01" end="2017-09-01" @change="bindDateChange">
                        <view class='pickItem'>
                            <view class="picker">
                            起始时间
                            </view>
                            <view class='cuIcon-unfold'></view>
                        </view>
                    </picker>
                    <picker mode="date" fields="month" :value="currentData" start="2015-09-01" end="2017-09-01" @change="bindDateChange">
                        <view class='pickItem'>
                            <view class="picker">
                            起始时间
                            </view>
                            <view class='cuIcon-unfold'></view>
                        </view>
                    </picker>
                </view>
            </view>
             <view class='normal'>
                <view class='left'>月租金</view>
                <input class='center' placeholder-class="center" placeholder-style="color:black;font-size:26rpx;" placeholder="2200 元"/>
            </view>
             <view class='normal'>
                <view class='left'>付款方式</view>
                <picker class="payment" mode="date" fields="month" :value="currentData" start="2015-09-01" end="2017-09-01" @change="bindDateChange">
                    <view class='pickItem'>
                        <view class="picker">
                        起始时间
                        </view>
                    </view>
                </picker>
                <view class='cuIcon-right'></view>
            </view>

            <view @tap="areaFocus=true" class='normal note'>
                <view class='left'>备注</view>
                <view class='center'>续租备注，60字以内</view>
            </view>
            <textarea @blur="areaFocus=false" :focus="areaFocus" class='noteArea'></textarea>
        </view>

        <view class='signBtn'>电子签约</view>
        <view class='saveBtn'>保存</view>
    </view>
</template>

<script>
export default {
    name:'renewal',
    data(){
        return{
            areaFocus:false
        }
    }
}
</script>

<style lang='scss' scped>
$pageBgColor:#f7f7f7;
$borderColor:#e9e9e9;
$placerColor:#cccccc;
$titleColor:#888888;
$greenColor:#00a680;
.renewal{
     .infoHeader{
        background-color: white;
        width: 750rpx;
        text-align: center;
        padding-top: 40rpx;
        padding-bottom: 40rpx;
        border-bottom:solid 4rpx #e6e6e6;
        font-size: 30rpx;
        view:nth-child(1){
            font-size: 34rpx;
            font-weight: 600;
            text{
                display: inline-block;
                background-color: #dae8fc;
                color: #6667fe;
                font-size: 28rpx;
                font-weight: 400;
                padding: 6rpx 10rpx;
                border-radius: 6rpx;
                margin-left: 30rpx;
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
        // .detail{
        //     padding: 0rpx 40rpx 0rpx 40rpx;
        //     height: 170rpx;
        //     background-color: white;
        //     display: flex;
        //     align-items: center;
        //     border-bottom: solid 1rpx #f3f3f3;
        //     .detailLeft{
        //         flex-grow: 1;
        //         view{
        //             line-height: 40rpx;
        //         }
        //         view:nth-child(1){
        //             font-size: 34rpx;
        //             font-weight: 600;
        //             padding-bottom: 10rpx;
        //             padding-top: 20rpx;
        //         }
        //         view:nth-child(3){
        //             padding-bottom: 10rpx;
        //         }
        //     }
        // }
        .normal{
            font-size: 30rpx;
            display: flex;
            justify-content: space-between;
            align-items: center;
            position: relative;
            height: 100rpx;
            padding: 0rpx 40rpx 0rpx 40rpx;
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
                        height: 100rpx;
                        line-height: 100rpx;
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
            .payment{
                position: absolute;
                width: 100%;
                height: 100%;
                line-height: 100rpx;
                text-indent: 260rpx;
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
            &:active,&:active + .noteArea{
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
            height: 140rpx;
            width: 100%;
            padding: 0rpx 40rpx 20rpx 40rpx;
        }
    }
    .signBtn,.saveBtn{
        width: 690rpx;
        height: 100rpx;
        text-align: center;
        line-height: 100rpx;
        border-radius: 10rpx;
        font-size: 34rpx;
        margin: 30rpx auto;
    }
    .signBtn{
        margin-top: 70rpx;
        color: white;
        background-color: $greenColor;
        color: white;
        &:active{
            background-color: #007e5e;
        }
    }
    .saveBtn{
        margin-top: 30rpx;
        border: solid 1px $greenColor;
        color: $greenColor;
        &:active{
            background-color: #fafafa;
        }
    }
}
</style>