<template>
    <!-- 账单 -->
    <view class='bill'>
        <view class='infoHeader'>
            <view><text>李伊利/江一</text><text>整租</text></view>
            <view><text>天鹅湖二期</text>2室1厅1卫</view>
            <view>12-2-2001</view>
        </view>
        <BillItem></BillItem>
    </view>
</template>

<script>
import BillItem from '../../../../../components/adminHousing-component/billItem.vue';
export default {
    name:'bill',
    data(){
        return{

        }
    },
    methods:{

    },
    components:{
        BillItem
    }
}
</script>

<style lang='scss' scoped>
$pageBgColor:#f7f7f7;
$borderColor:#e9e9e9;
$placerColor:#cccccc;
$titleColor:#888888;
$greenColor:#00a680;
.bill{
   .infoHeader{
        background-color: white;
        width: 750rpx;
        text-align: center;
        padding-top: 40rpx;
        padding-bottom: 40rpx;
        border-bottom:solid 4rpx #e6e6e6;
         view:nth-child(1){
            text:nth-child(1){
                font-size: 34rpx;
                font-weight: 600;
                padding-right: 10rpx;
            }
            text:nth-child(2){
                display: inline-block;
                background-color:#dae8fc;
                color: #6666ff;
                font-size: 28rpx;
                font-weight: 400;
                padding: 2rpx 10rpx;
                border-radius: 6rpx;
                margin-left: 30rpx;
            }
        }
    }
}
</style>