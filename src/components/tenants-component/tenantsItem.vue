<template>
    <!-- 租客首页 -->
    <view class='tenants'>
        <view @tap="clickItem" class='infoBox'>
            <view class='itemTitle'>A (主卧 | 20m²)</view>
            <view class='itemBottom'>
                <image class='avatar' src='https://uss.img.lezhulife.com/xcxicon/defaultAvatar.png'></image>
                <view class='center'>
                    <view class='center-name'>张珊珊/李依依 <text class='tag'>履约中</text></view>
                    <view class='center-time'>2020-09-12 至 2021-09-11</view>
                    <view class='center-price'><text>1600</text>元/月 押1付3</view>
                    <view class='center-day'>已入住102天</view>
                </view>
                <view class="exit">
                    <view>2020-09-08</view>
                    <view>退租时间</view>
                </view>
                <view class='cuIcon-right'></view>
            </view>
        </view>
    </view>
</template>

<script>
export default {
    name:'tenants',
    props:{
        clickItemCallBack:{
            type:Function,
            default:()=>()=>{}
        }
    },
    data(){
        return{
            isShowModal1:false,
        }
    },
    methods:{
        //列表选项点击事件
        clickItem(){
            this.$emit('clickItemCallBack')
        },
    }
}
</script>

<style lang='scss' scoped>
$pageBgColor:#f7f7f7;
$borderColor:#e9e9e9;
$placerColor:#cccccc;
$titleColor:#888888;
$greenColor:#00a680;
.tenants{
    margin-top: 20rpx;
    .infoBox{
        background-color: white;
        width: 710rpx;
        margin: 0 auto;
        border-radius: 8rpx;
        .itemTitle{
            font-size: 30rpx;
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
                width: 80rpx;
                height: 80rpx;
                margin-top: -50rpx;
            }
            .center{
                flex-grow: 1;
                padding-left: 40rpx;
                font-size: 26rpx;
                line-height: 40rpx;
                
                .center-name{
                    font-size: 32rpx;
                    font-weight: 600;
                    .tag{
                        display: inline-block;
                        padding: 14rpx 10rpx;
                        line-height: 20rpx;
                        font-size: 28rpx;
                        font-weight: 400;
                        background-color: #eef6ee;
                        color: #21c11f;
                        margin-left: 20rpx;
                        border-radius: 6rpx;
                    }
                }
                .center-price{
                    text{
                        color:$greenColor
                    }
                }
            }
            .exit{
                // background-color: aqua;
                text-align: center;
                padding-right: 20rpx;
            }
        }
        &:active{
            background-color: #fafafa;
        }
    }
}
</style>