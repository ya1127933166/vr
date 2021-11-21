<template>
    <view class='ownerContract'>
        <view class='ownerTop'>
            <view class='top'>
                <view></view>
            </view>
            <view class='center'>房源已提交审核，注意微信审核通知</view>
            <view class='bottom'>查看进度</view>
        </view>
        <view class='ownerBottom'>
            <view class='topBox'>
                <view class='bottomTitle'>房源签约流程</view>
                <view class='titleLine'></view>
            </view>
        </view>
        <view class='procerss'>
            <view class='proLeft'>
                <block v-for="item in processList" :key="item.text">
                    <view class='leftBox'>
                        <view class='leftTop'></view>
                        <view class='leftBottom'></view>
                    </view>
                </block>
            </view>
            <view class='proRight'>
                <block v-for="item in processList" :key="item.text">
                    <view class='rightBox'>
                        <view class='rightTop'>{{item.text}}</view>
                        <view class='rightBottom'>{{item.status}}</view>
                    </view>
                </block>
            </view>
        </view>
    </view>
</template>

<script>
export default {
    data(){
        return{
            processList:[
                {text:'填写房源信息',status:'填写房源真实信息'},
                {text:'上级审批',status:'由申请人的直属上级审批'},
                {text:'签约',status:'系统自动生成电子签约合同，双方签约'},
                {text:'预付款项',status:'根据合同条款，预付一部分款项给业主'},
                {text:'交房确认后',status:'支付剩余款项给业主'},
            ]
        } 
    }
}
</script>

<style lang='scss' scoped>
.ownerContract{
    .ownerTop{
        width: 750rpx;
        height: 400rpx;
        background-color: white;
        text-align: center;
        padding-top: 60rpx;
        .top{
            width: 80rpx;
            height: 80rpx;
            background-color: #00a680;
            border-radius: 40rpx;
            display: flex;
            justify-content: center;
            align-items: center;
            margin:  0 auto;
            view{
                width: 30rpx;
                height: 50rpx;
                border: solid 7rpx white;
                border-radius: 5rpx;
                border-left: transparent;
                border-top: transparent;
                transform: rotate(50deg) translateY(-10%) translateX(-20%);
            }
        }
        .center{
            font-size: 30rpx;
            padding: 30rpx 0rpx 40rpx 30rpx;
        }
        .bottom{
            width: 690rpx;
            height: 100rpx;
            color: white;
            text-align: center;
            line-height: 100rpx;
            background-color: #00a680;
            border-radius: 10rpx;
            font-size: 34rpx;
            margin: 0 auto;
            &:active{
                background-color: #007e5e;
            }
        }
    }
    .ownerBottom{
        padding: 70rpx 30rpx 0rpx 30rpx;
        .topBox{
            .bottomTitle{
                width: 200rpx;
                color: #8a8888;
                font-size: 30rpx; 
                font-weight: 600;
                text-align: center;
                background-color: #f1f1f1;
                transform: translateY(50%);
                margin: 0 auto;
            }
            .titleLine{
                width: 600rpx;
                height: 4rpx;
                background-color: #e4e0e0;
                margin: 0 auto;
            }
        }
    }
    .procerss{
        padding: 80rpx 30rpx 0rpx 30rpx;
        display: flex;
        .proLeft{
            .leftBox{
                display: flex;
                flex-direction: column;
                justify-content: center;
                align-items: center;
                .leftTop{
                    width: 20rpx;
                    height: 20rpx;
                    background-color: #9ac7bf;
                    border-radius: 10rpx;
                }
                .leftBottom{
                    margin: 10rpx 0rpx 10rpx 0rpx;
                    width: 4rpx;
                    height: 70rpx;
                    background-color: #9ac7bf;
                }
            }
            .leftBox:last-child{
                .leftBottom{
                    width: 0rpx;
                    height: 0rpx;
                }
            }
        }
        .proRight{
            flex-grow: 1;
            padding-left: 20rpx;
            .rightBox{
                height: 116rpx;
                .rightTop{
                    font-size: 24rpx;
                    // margin-top: -6rpx;
                }
                .rightBottom{
                    color: #bbb8b8;
                    font-size: 20rpx;
                    padding-top: 10rpx;
                }
                &:nth-child(2){
                    .rightTop{
                        margin-top: -12rpx;
                    }
                }
                &:nth-child(3){
                    .rightTop{
                        margin-top: -8rpx;
                    }
                }
                &:nth-child(4){
                    .rightTop{
                        margin-top: -6rpx;
                    }
                }
                &:nth-child(5){
                    .rightTop{
                        margin-top: -10rpx;
                    }
                }
            }
        }
    }
}
</style>