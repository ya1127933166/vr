<template>
    <!-- 租客首页 -->
    <view class='tenants'>
        <view class='tenantsTop'>
            <view @tap="topButton('添加租客')">添加租客</view>
            <view @tap="topButton('历史租客')">历史租客</view>
        </view>

        <view class='title'>已有租客</view>
        <block v-for="(item) in 6" :key="item">
            <TenantsItem @clickItemCallBack="clickItem"></TenantsItem>
        </block>

        <view style="width:750rpx;height:100rpx"></view>
        <Modal1 @clickCallBack="clickModalCallBack" @clickMaskCallBack="isShowModal1=false" :isShow="isShowModal1" :imgList="signList"></Modal1>
    </view>
</template>

<script>
import Modal1 from '../../../../components/comm/modal1/modal1.vue';
import TenantsItem from '../../../../components/tenants-component/tenantsItem.vue';
export default {
    name:'tenants',
    data(){
        return{
            isShowModal1:false,
            signList:[
                {text:'电子签约',path:'https://uss.img.lezhulife.com/xcxicon/asgin.png'},
                {text:'录入历史租客',path:'https://uss.img.lezhulife.com/xcxicon/enteyHistory.png'}
            ],
        }
    },
    methods:{
        //列表选项点击事件
        clickItem(){
            uni.navigateTo({
                url: '../../../subpackAdminHousing/pages/adminHousing/tenants/tenantsInfo',
            })
        },
        //顶部button点击事件
        topButton(text){
            if(text=='添加租客'){
                this.isShowModal1 = true;
            }else{
                uni.navigateTo({
                    url: '../../../subpackAdminHousing/pages/adminHousing/tenants/historyTenant/historyTenant',
                })
            }
        },
        //模态框回调
        clickModalCallBack(e){
            let item = e.currentTarget.dataset.item.text
            if(item=='录入历史租客'){
                uni.navigateTo({
                    url: '../../../subpackAdminHousing/pages/adminHousing/tenants/addTenant',
                })
            }
            this.isShowModal1 = false
        }
    },
    components:{
        Modal1,
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
.tenants{
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
        padding: 0rpx 0rpx 0rpx 16px;
    }
}
</style>