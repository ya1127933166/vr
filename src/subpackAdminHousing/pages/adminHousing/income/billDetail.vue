<template>
    <!-- 账单详情 -->
    <view class='billDetail'>
        <view class='infoHeader'>
            <view class='top'>A间租金</view>
            <view class='center'>+3500.00</view>
        </view>

        <view class='infoBox'>
            <view class='normal'>
                <view class='left'>费用发生区域</view>
                <view class='center' style="color:black;">
                    <view>天鹅湖二期 2室1厅1卫</view>
                    <view>12-2-2001 A间</view>
                </view>
                <view class='right'></view>
            </view>
            <view class='normal'>
                <view class='left'>费用发生区域</view>
                <input class='center' placeholder-style="color:black" placeholder-class="center" placeholder="收入" />
                <!-- <view class='cuIcon-right'></view> -->
            </view>
            <view class='normal'>
                <view class='left'>费用类型</view>
                <input class='center' placeholder-style="color:black" placeholder-class="center" placeholder="租金" />
                <!-- <view class='cuIcon-right'></view> -->
            </view>
            <view class='normal'>
                <view class='left'>付款人信息</view>
                <input class='center' placeholder-style="color:black" placeholder-class="center" placeholder="张珊珊" />
                <!-- <view class='cuIcon-right'></view> -->
            </view>
             <view @tap="areaFocus=true" class='normal note'>
                <view class='left'>备注</view>
                <view class='center'>添加收款备注</view>
            </view>
            <textarea @blur="areaFocus=false" :focus="areaFocus" class='noteArea'></textarea>
        </view>

        <view class='title'>凭证，单据</view>
        <view class='record'>
            <view>凭据/单据/转账记录</view>
            <view class='imageBox'>
                <image style="width:100rpx;height:100rpx;" src="https://uss.img.lezhulife.com/xcximages/house-none.jpg"></image>
                <image style="width:100rpx;height:100rpx;" src="https://uss.img.lezhulife.com/xcximages/house-none.jpg"></image>
                <image style="width:100rpx;height:100rpx;" src="https://uss.img.lezhulife.com/xcximages/house-none.jpg"></image>
                <image style="width:100rpx;height:100rpx;" src="https://uss.img.lezhulife.com/xcximages/house-none.jpg"></image>
                <image style="width:100rpx;height:100rpx;" src="https://uss.img.lezhulife.com/xcximages/house-none.jpg"></image>
                <image style="width:100rpx;height:100rpx;" src="https://uss.img.lezhulife.com/xcximages/house-none.jpg"></image>
            </view>
        </view>
        <view class='buttomBtn'>删除费用</view>
    </view>
</template>

<script>
export default {
    name:'billDetail',
    data(){
        return{
            areaFocus:false
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
.billDetail{
    .infoHeader{
        background-color: white;
        width: 750rpx;
        text-align: center;
        padding-top: 40rpx;
        padding-bottom: 70rpx;
        .top{
            font-size: 34rpx;
        }
         .center{
            font-size: 44rpx;
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
            align-items: flex-start;
            border-bottom: solid calc(1px / 2.5) #d9d9d9;
            position: relative;
            padding: 30rpx 40rpx 30rpx 40rpx;
            font-size: 30rpx;
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
            &:active, &:active + .noteArea{
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
        view{
            width: 300rpx;
            height: 80rpx;
            text-align: center;
            line-height: 80rpx;
            border-radius: 10rpx;
            font-size: 28rpx;
            font-weight: 600;
        }
        view:nth-child(1){
            background-color: $greenColor;
            color: white;
        }
        view:nth-child(2){
            border: solid 1rpx $greenColor;
            color: $greenColor;
        }
    }
    .record{
        background-color: white;
        padding: 20rpx 20rpx 20rpx 40rpx;
        font-size: 28rpx;
        .imageBox{
            padding: 20rpx 10rpx 0rpx 10rpx;
            image{
                margin-right: 20rpx; 
                margin-bottom: 20rpx; 
            }
        }
    }
    .buttomBtn{
        width: 750rpx;
        height: 100rpx;
        background-color: white;
        margin-top: 40rpx;
        text-align: center;
        line-height: 100rpx;
        color: #ea7672;
        font-size: 34rpx;
        margin-bottom: 60rpx;
        &:active{
            background-color: #fafafa;
        }
    }
}

</style>