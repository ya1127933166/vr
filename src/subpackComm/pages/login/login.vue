<template>
    <!-- 登录首页 -->
    <view class="login">
        <PageHeader :isArrow="currentType=='创建'" @backCallBack="backClick"></PageHeader>
        <view :style="'width:100%;height:'+customeheaderInfo.headerHeight"></view>
        <view class="loginTitle">
            <view v-show="currentType=='未找到'">未找到你的企业/单位</view>
            <view>可选择以下类型全新创建</view>
        </view>

        <view class="loginItem" @tap="toCreateAccout('企业')">
            <image style="width:70rpx;height:70rpx;" class="itemLeft" src='https://uss.img.lezhulife.com/xcxicon/login-enterprise.png'></image>
            <view class="itemRight">
                <view>企业</view>
                <view>适用于托管公司，中介机构等组织</view>
            </view>
        </view>

        <view class="loginItem" @tap="toCreateAccout('政府')">
            <image style="width:70rpx;height:70rpx;" class="itemLeft" src="https://uss.img.lezhulife.com/xcxicon/login-government.png"></image>
            <view class="itemRight">
                <view>政府</view>
                <view>适用于国资，政府旗下租赁运营组织</view>
            </view>
        </view>

        <view class="loginItem" @tap="toCreateAccout('个人')">
            <image style="width:70rpx;height:70rpx;" class="itemLeft" src='https://uss.img.lezhulife.com/xcxicon/login-personal.png'></image>
            <view class="itemRight">
                <view>个人</view>
                <view>适用于个人使用</view>
            </view>
        </view>
    </view>
</template>

<script>
import PageHeader from '../../../components/comm/pageHeader/pageHeader.vue';
import {mapState,mapMutations} from 'vuex';
export default {
    name:'login',
    data(){
        return{
            currentType:'未找到'
        }
    },
    onLoad(options){
        console.log(options);
        if(options){
            this.currentType = options.type
        }
    },
    computed:{
        ...mapState({
            customeheaderInfo:state=>state.customeheaderInfo
        }),
    },
    methods:{
        /**
         * 跳转至创建账号
         */
        toCreateAccout(type){
            uni.navigateTo({
                url: `/subpackComm/pages/login/createAccount?type=${type}`,
            })
        },
        /**
        
         */
        backClick(){
            uni.navigateBack({
                delta:-1
            })
        }
    },
    components:{
        PageHeader
    }
}
</script>

<style lang='scss' scoped>
$pageBgColor:#f7f7f7;
$borderColor:#e9e9e9;
$placerColor:#cccccc;
$titleColor:#888888;
$greenColor:#00a680;
page{
    background-color: white;
}
.login{
    min-height: 100vh;
    background-color: white;
    .loginTitle{
        width: 690rpx;
        padding: 40rpx 30rpx 70rpx 30rpx;
        font-size: 40rpx;
    }
    .loginItem{
        width: 690rpx;
        margin: 0 auto;
        border: solid 4rpx $borderColor;
        padding: 40rpx;
        display: flex;
        align-items: center;
        margin-bottom: 30rpx;
        border-radius: 6rpx;
        .itemLeft{
            margin: 0rpx 30rpx 0rpx 0rpx;
        }
        .itemRight{
            view:nth-child(1){
                font-size: 40rpx;
            }
            view:nth-child(2){
                padding-top: 10rpx;
                font-size: 28rpx;
                color: $titleColor;
            }
        }
        &:active{
            background-color: #fafafa;
        }
    }
}
</style>