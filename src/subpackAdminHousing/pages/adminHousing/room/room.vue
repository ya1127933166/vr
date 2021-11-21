<template>
    <!-- 房间主页 -->
    <view class='room'>
        <view class='tenantsTop'>
            <view @tap="toAddRoom">添加房间</view>
            <view @tap="transfor">合租转整租</view>
        </view>

        <view class='title'>已有租客</view>
        <block v-for="(item,index) in 6" :key="item">
            <view class='infoBox' :style="'margin-top:'+(index==0?0:20)+'rpx;'">
                <!-- <view class='itemTitle'>A (主卧 | 20m²)</view> -->
                <view class='itemBottom'>
                    <image class='avatar' src='https://uss.img.lezhulife.com/xcximages/house-none.jpg'></image>
                    <view class='center'>
                        <view class='center-name'>A <text class='line'></text> <text class='text'>空置16天</text> <text class='tag'>已租</text></view>
                        <view class='center-time'><text class='opt'>主卧</text><text class='opt'>20m²</text><text class='opt'>独卫</text></view>
                        <view class='center-price'><text class='priceTag'>出租价</text> <text>1600</text>元/月</view>
                        <!-- <view class='center-day'>已入住102天</view> -->
                    </view>
                    <view class='cuIcon-right'></view>
                </view>
            </view>
        </block>
        <view style="width:750rpx;height:100rpx"></view>
        <Modal2 @clickModal2MaskCallBack="isShowModal2=false" :isModel1="true" :isModel1Title="false" :model1List="['请确认合租的各个房间无租客，无合同;','转为整租后，合租房间将不可用。']" :modalTitle="'合租转整租'" :btnList="['取消','继续转租']" :isShowModal2="isShowModal2"></Modal2>
    </view>
</template>

<script>
import Modal2 from '../../../../components/comm/modal2/modal2.vue'
export default {
    name:'room',
    data(){
        return{
            isShowModal2:false
        }
    },
    methods:{
        //添加房间
        toAddRoom(){
            uni.navigateTo({
                url: '../../../subpackAdminHousing/pages/adminHousing/room/addRoom',
            })
        },
        //合租转整租
        transfor(){
            this.isShowModal2 = true
        }
    },
    components:{
        Modal2
    }
}
</script>

<style lang='scss' scoped>
$pageBgColor:#f7f7f7;
$borderColor:#e9e9e9;
$placerColor:#cccccc;
$titleColor:#888888;
$greenColor:#00a680;
.room{
    .tenantsTop{
        width: 750rpx;
        height: 100rpx;
        padding: 20rpx 20rpx 20rpx 20rpx;
        display: flex;
        justify-content: right;
        flex-direction: row-reverse;
        align-items: center;
        view:nth-child(2){
            font-size: 30rpx;
            color: #777373;
            border-right: solid 2rpx #999999;
            padding-right: 20rpx;
        }
        view:nth-child(1){
            color:$greenColor;
            border: solid 1rpx $greenColor;
            border-radius: 30rpx;
            padding: 4rpx 20rpx;
            margin-left: 20rpx;
            font-size: 28rpx;
        }
    }
    .title{
        font-size: 26rpx;
        color: $titleColor;
        padding: 0rpx 0rpx 20rpx 16px;
    }
    .infoBox{
        background-color: white;
        width: 700rpx;
        margin: 0 auto;
        border-radius: 8rpx;
        .itemTitle{
            font-size: 28rpx;
            border-bottom: solid 1rpx #eeeeee;
            padding: 20rpx;
        }
        .itemBottom{
            box-sizing: border-box;
            padding: 30rpx;
            display: flex;
            justify-content: space-between;
            align-items: center;
            .avatar{
                width: 130rpx;
                height: 90rpx;
                margin-top: -30rpx;
            }
            .center{
                flex-grow: 1;
                padding-left: 40rpx;
                font-size: 30rpx;
                line-height: 40rpx;
                
                .center-name{
                    font-size: 30rpx;
                    font-weight: 600;
                    display: flex;
                    align-items: center;
                    .line{
                        display: inline-block;
                        width: 4rpx;
                        height: 20rpx;
                        background-color: black;
                        margin-left: 10rpx;
                    }
                    .tag{
                        display: inline-block;
                        padding: 10rpx 10rpx;
                        line-height: 20rpx;
                        font-size: 28rpx;
                        background-color: #eef6ee;
                        color: #21c11f;
                        margin-left: 20rpx;
                        border-radius: 4rpx;
                    }
                    .text{
                        padding-left: 10rpx;
                        font-size: 30rpx;
                        color: #747474;
                    }
                }
                .center-time{
                    font-size: 28rpx;
                    display: flex;
                    align-items: center;
                    height: 60rpx;
                    padding-top: 20rpx;
                    .opt::after{
                        content: '';
                        display: inline-block;
                        margin: 0rpx 10rpx 0rpx 10rpx;
                        width: 2rpx;
                        height: 20rpx;
                        background-color: black;
                        box-sizing: border-box;
                    }
                    .opt:last-child::after{
                        content: '';
                        display: inline-block;
                    }
                }
                .center-price{
                    padding-top: 20rpx;
                    border-radius: 4rpx;
                    text:nth-child(1){
                        color:$titleColor;
                        font-size: 28rpx;
                        font-weight: 600;
                    }
                    .priceTag{
                        display: inline-block;
                        font-size: 26rpx;
                        font-weight: 500;
                        background-color: #f5f5f5;
                        padding-left: 10rpx;
                        padding-right: 10rpx;
                        margin-right: 10rpx;
                    }
                }
            }
        }
        &:active{
            background-color: #fafafa;
        }
    }
}
</style>