<template>
    <view class='business'>
        <view class='businessBox'>
            <view class='businessTitle'>业务人员</view>
            <view class='personBox'>
                <image class='personLeft' style="width:60rpx;height:60rpx" src='https://uss.img.lezhulife.com/xcxicon/defaultAvatar.png'></image>
                <view class='personRight'>
                    <view class='rightTop'>
                        <view class='topLeft'>
                            <view class='leftNick'>PP酱子</view>
                            <view class='housingCount'>本月22套房源</view>
                        </view>
                        <image style="width:40rpx;height:40rpx" src='https://uss.img.lezhulife.com/xcxicon/defaultAvatar.png'></image>
                    </view>
                    <view class='rightBottom'>
                        该房源来自渠道：中介
                    </view>
                </view>
            </view>
        </view>
        <view class='progressBox'>
            <view class='proTitle'>审批进度</view>
            <view class='positionBox'>
                <block v-for="item in 4" :key="item">
                    <view class="boxItem">
                        <view class="itemLeft">
                            <view class="leftTop"></view>
                            <view class="leftBottom"></view>
                        </view>
                        <view class="itemRight">
                            <view>李涛<text>●</text><text>等待审核</text></view>
                            <view>门店经理</view>
                            <view class="time">2019-09-03 08:35:26</view>
                        </view>
                    </view>
                </block>
            </view>
            <view class='copy'>抄送给：李涛，江涛，董平，兰敏</view>
        </view>
    </view>
</template>

<script>
export default {
    name:'business',
    data(){
        return{

        }
    }
}
</script>

<style lang='scss' scoped>
.business{
    .businessBox{
        padding: 50rpx 30rpx 40rpx 30rpx;
        .businessTitle{
            font-size: 32rpx;
            font-weight: 600;
            padding-bottom: 30rpx;
        }
        .personBox{
            box-sizing: border-box;
            display: flex;
            padding: 30rpx 10rpx 0rpx 10rpx;
            .personLeft{
                width: 70rpx;
            }
            .personRight{
                box-sizing: border-box;
                width: 600rpx;
                padding-left:30rpx ;
                .rightTop{
                    padding-bottom: 30rpx;
                    width: 100%;
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                    border-bottom:solid 4rpx  #eeeeee;
                    .topLeft{
                        .leftNick{
                            font-size: 32rpx;
                            color: black;
                            font-weight: 600;
                        }
                        .housingCount{
                            font-size: 30rpx;
                            color: #4b4747;
                        }
                    }
                }
                .rightBottom{
                    padding: 30rpx 0rpx 30rpx 0rpx;
                    font-size: 30rpx;
                }
            }
        }
    }
    .progressBox{
        padding: 30rpx;
        border-top: solid 14rpx #eeeeee;
        .proTitle{
            font-size: 32rpx;
            font-weight: 600;
            padding-bottom: 30rpx;
            padding-top: 20rpx;
        }
        .positionBox{
            width: 690rpx;
            margin: 0 auto;
            .boxItem{
                display: flex;
                .itemLeft{
                    width: 20rpx;
                    display: flex;
                    flex-direction: column;
                    align-items: center;
                    padding-top: 6rpx;
                    .leftTop{
                        width: 20rpx;
                        height: 20rpx;
                        border-radius: 10rpx;
                        border: solid 4rpx #cccccc;
                    }
                    .leftBottom{
                        width: 4rpx;
                        height: 120rpx;
                        background-color: #cccccc;
                        margin:  8rpx 0;
                    }
                }
                .itemRight{
                    padding-left: 20rpx;
                    view:nth-child(1){
                        font-size: 30rpx;
                        padding-bottom: 10rpx;
                        text:nth-child(1){
                            font-size: 20rpx;
                            margin: auto 20rpx;
                        }
                    }
                }
            }
        }
        .copy{
            width: 660rpx;
            margin: 40rpx auto 0rpx auto;
            border-top: solid 2rpx #f5f5f5;
            padding: 40rpx 0rpx 40rpx 0rpx;
        }
    }
}
</style>