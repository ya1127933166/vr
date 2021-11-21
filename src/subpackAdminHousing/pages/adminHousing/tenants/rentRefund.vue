<template>
    <!-- 退租 -->
    <view class='rentRefund'>
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
                    <picker mode="date" fields="day" :value="currentData" start="2015-09-01" end="2017-09-01" @change="bindDateChange($event,'开始')">
                        <view class='pickItem'>
                            <view class="picker" :style="'color:'+(info.start=='起始时间'?'#cccccc':'#333333')">
                            {{info.start}}
                            </view>
                            <view class='cuIcon-unfold'></view>
                        </view>
                    </picker>
                    <picker class='pickItem' mode="date" fields="day" :value="currentData" start="2015-09-01" end="2017-09-01" @change="bindDateChange($event,'结束')">
                        <view class='pickItem'>
                            <view class="picker" :style="'color:'+(info.end=='结束时间'?'#cccccc':'#333333')">
                            {{info.end}}
                            </view>
                            <view class='cuIcon-unfold'></view>
                        </view>
                    </picker>
                </view>
            </view>
            <view class='normal'>
                <view class='left'>退租金额</view>
                <input class='center' placeholder-class="center" placeholder-style="color:black;font-size:26rpx;" placeholder="0 元"/>
                <view class="right">押金剩余：<text>1600</text>元</view>
            </view>

            <view @tap="areaFocus=true" class='normal note'>
                <view class='left'>备注</view>
                <view class='center'>退租备注，60字以内</view>
            </view>
            <textarea @blur="areaFocus=false" :focus="areaFocus" class='noteArea'></textarea>
        </view>

        <view class='saveBtn'>保存</view>
    </view>
</template>

<script>
export default {
    name:'rentRefund',
    data(){
        return{
            info:{
                start:'起始时间',
                end:'结束时间'
            },
            areaFocus:false
        }
    },
    methods:{
       bindDateChange(e,text){
           if(text=='开始'){
               this.info.start = e.detail.value
           }else{
               this.info.end = e.detail.value
           }
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
.rentRefund{
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
        .normal{
            font-size: 30rpx;
            padding: 0rpx 40rpx 0rpx 40rpx;
            display: flex;
            justify-content: space-between;
            align-items: center;
            height: 100rpx;
            border-bottom: solid calc(1px / 2) #d9d9d9;
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
                text-align: right;
            }
            .right{
                margin-left: 30rpx;
                height: 100%;
                width: 400rpx;
                text-align: right;
                background-color: #f0f0f0;
                display: flex;
                align-items: center;
                justify-content: center;
                font-size: 24rpx;
                text{
                    font-weight: 600;
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
    .saveBtn{
        width: 690rpx;
        height: 100rpx;
        text-align: center;
        line-height: 100rpx;
        border-radius: 10rpx;
        font-size: 34rpx;
        margin: 50rpx auto;
        background-color: $greenColor;
        color: white;
        &:active{
            background-color: #007e5e;
        }
    }
}
</style>