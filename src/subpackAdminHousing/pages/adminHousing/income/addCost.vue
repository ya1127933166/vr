<template>
    <!-- 添加费用 -->
    <view class='addCost'>
        <view class='infoHeader'>
            <!-- <view class='top'>张珊珊/李依依 <text>A房间</text></view> -->
            <view class='center'><text>天鹅湖二期</text>2室1厅1卫</view>
            <view>12-2-2001</view>
        </view>

        <view class='title'>添加费用</view>
        <view class='infoBox'>
            <view class='normal'>
                <view class='left'>金额</view>
                <input class='center' placeholder-class="center" placeholder-style="color:black" placeholder="200" />
                <view class='right'>元</view>
            </view>
            <view class='normal'>
                <view class='left'>费用发生区域</view>
                <picker class='pickBox' mode="date" fields="month" :value="currentData" start="2015-09-01" end="2017-09-01" @change="bindDateChange">
                    <view class='pickItem'>
                        请选择
                    </view>
                </picker>
                <view class='cuIcon-right'></view>
            </view>
            <view class='normal'>
                <view class='left'>收支方式</view>
                <view class='center'>
                    <view class='btnBox'>
                        <view>收入</view>
                        <view>支出</view>
                    </view>
                </view>
            </view>
            <view class='normal'>
                <view class='left'>费用类型</view>
                <picker class='pickBox' mode="date" fields="month" :value="currentData" start="2015-09-01" end="2017-09-01" @change="bindDateChange">
                    <view class='pickItem'>
                        请选择
                    </view>
                </picker>
                <view class='cuIcon-right'></view>
            </view>
            <view class='normal'>
                <view class='left'>付款人信息</view>
                <picker class='pickBox' mode="date" fields="month" :value="currentData" start="2015-09-01" end="2017-09-01" @change="bindDateChange">
                    <view class='pickItem'>
                        请选择
                    </view>
                </picker>
                <view class='cuIcon-right'></view>
            </view>
             <view @tap="areaFocus=true" class='normal note'>
                <view class='left'>备注</view>
                <view class='center'>添加收款备注</view>
            </view>
            <textarea @blur="areaFocus=false" :focus="areaFocus" class='noteArea'></textarea>
        </view>

        <view class='title'>凭证，单据</view>
        <view @tap="toUpload" class='infoBox'>
            <view class='normal'>
                <view class='left'>凭着/单据/转账记录</view>
                <input disabled class='center' placeholder-class="center" placeholder="请上传" />
                <view class='cuIcon-right'></view>
            </view>
        </view>
        <view class='buttomBox'>
            <view>保存</view>
            <view>保存，继续添加</view>
        </view>
    </view>
</template>

<script>
export default {
    name:'addCost',
    data(){
        return{
            areaFocus:false
        }
    },
    methods:{
        toUpload(){
            uni.navigateTo({
                url: '../../../../pages/upload/upload',
            })
        }
    }
}
</script>

<style lang='scss' scoped>
$pageBgColor:#f7f7f7;
$borderColor:#e9e9e9;
$placerColor:#cccccc;
$titleColor:#888888;
$greenColor:#00a680;
.addCost{
    .infoHeader{
        background-color: white;
        width: 750rpx;
        text-align: center;
        padding-top: 40rpx;
        padding-bottom: 40rpx;
        border-bottom:solid 4rpx #e6e6e6;
        .top{
            font-size: 34rpx;
            font-weight: 600;
            text{
                font-size: 24rpx;
                font-weight: 500;
                display: inline-block;
                background-color: #dae8fc;
                color:#797cfe;
                padding: 3rpx;
                margin-left: 20rpx;
            }
        }
         .center{
            text{
                font-size: 32rpx;
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
            display: flex;
            justify-content: space-between;
            align-items: center;
            height: 100rpx;
            border-bottom: solid calc(1px / 2.5) #d9d9d9;
            position: relative;
            padding: 0rpx 40rpx 0rpx 40rpx;
            font-size: 30rpx;
            .pickBox{
                position: absolute;
                left: 0rpx;
                top: 0rpx;
                width: 100%;
                height: 100%;
                line-height: 100rpx;
                text-indent: 300rpx;

            }
            .left{
                width: 260rpx;
            }
            .center{
                flex-grow: 1;
                color: #cccccc;
                font-size: 30rpx;
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
    .buttomBox{
        padding-top: 60rpx;
        width: 680rpx;
        margin: 0 auto;
        display: flex;
        justify-content: space-between;
        padding-bottom: 30rpx;
        view{
            width: 320rpx;
            height: 100rpx;
            text-align: center;
            line-height: 100rpx;
            border-radius: 10rpx;
            font-size: 34rpx;
        }
        view:nth-child(1){
            background-color: $greenColor;
            color: white;
            &:active{
                background-color: #007e5e;
            }
        }
        view:nth-child(2){
            border: solid 1rpx $greenColor;
            color: $greenColor;
            &:active{
                border: solid 1rpx #cccccc;
                color: #cccccc;
                background-color: #fafafa;
            }
        }
    }
}

</style>