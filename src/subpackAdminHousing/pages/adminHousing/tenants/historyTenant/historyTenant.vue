<template>
    <!-- 历史租客 -->
    <view class='historyTenant'>
        <view class='infoHeader'>
            <view class='center'><text>天鹅湖二期</text>2室1厅1卫</view>
            <view>12-2-2001</view>
        </view>
        <view style="width:750rpx;height:30rpx"></view>
        <view class='title'>全部历史租客</view>
        <block v-for="(item) in 6" :key="item">
            <TenantsItem @clickItemCallBack="clickItem"></TenantsItem>
        </block>
        <view style="width:750rpx;height:100rpx;"></view>
    </view>
</template>

<script>
import TenantsItem from '../../../../../components/tenants-component/tenantsItem.vue';
export default {
    name:'historyTenant',
    data(){
        return{
            list:[
                {title:'整租',name:'李伊利/江一',tag:'到期退租'},
                {title:'整租',name:'苏米米',tag:'违约退租'},
                {title:'整租',name:'蒋真真/颜回',tag:'违约退租'},
                {title:'整租',name:'李伊利/江一',tag:'违约退租'}
            ]
        }
    },
    methods:{
        clickItem(){
            uni.navigateTo({
                url: '../../../../pages/adminHousing/tenants/tenantsInfo',
            })
        }
    },
    components:{
        TenantsItem
    }
}
</script>

<style lang='scss' scoped>
$pageBgColor:#f7f7f7;
$borderColor:#e9e9e9;
$placerColor:#cccccc;
$titleColor:#888888;
$greenColor:#00a680;
.historyTenant{
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
        font-size: 24rpx;
        color: $titleColor;
        padding: 0rpx 0rpx 0rpx 20px;
    }
}
</style>