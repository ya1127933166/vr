<template>
    <!-- 选择成员 -->
    <view class="selectStore">
        <!-- <view :style="'width:750rpx;height:'+headerTop+'px;background-color: white;'"></view>
        <view class='header' :style="'top:'+headerTop+'px;width:750rpx;height:calc( 0rpx + ' + headerHeight + 'px );'">
            <view @tap="backClick" class="backBox">
                <view  class="cuIcon-back"></view>
            </view>
            <view class='headerText'>选择成员</view>
        </view>
        <view :style="'width:750rpx;height:calc(14rpx + '+(headerHeight+0)+'px);background-color: white;'"></view> -->
        <view style="width:750rpx;height:30rpx;"></view>
        <view class="selectOpt">
            <view class="optLeft">
                <image style="width:50rpx;height:50rpx;" src='https://uss.img.lezhulife.com/xcxicon/department.png'></image>
            </view>
            <view class="optRight">
                <view>总部财务</view>
            </view>
        </view>

        <view class="selectOpt">
            <view class="optLeft">
                <image style="width:50rpx;height:50rpx;" src='https://uss.img.lezhulife.com/xcxicon/department.png'></image>
            </view>
            <view class="optRight">
                <view>北京.海科大厦二店</view>
            </view>
        </view>

        <view class="selectOpt">
            <view class="optLeft">
                <image style="width:50rpx;height:50rpx;" src='https://uss.img.lezhulife.com/xcxicon/defaultAvatar.png'></image>
            </view>
            <view class="optRight">
                <view>张金禅</view>
            </view>
        </view>
        <!-- <Loading></Loading> -->
        <view v-if="currentType!='添加人'" class='confirmBtn'>确定</view>
    </view>
</template>

<script>
import Loading from '../../../components/module/loading.vue';
import PageHeader from '../../../components/comm/pageHeader/pageHeader.vue';
export default {
    name:'selectStore',
    data(){
        return{
            headerHeight:-1,
            headerTop:-1,
            currentType:''
        }
    },
    onLoad(options){
        this.currentType = options.type;
    },
    mounted(){
        //初始化自定义头部配置
        const systemInfo = this.$$globalData.systemInfo;
        this.headerHeight = systemInfo.statusBarHeight;
        const {height,top} = wx.getMenuButtonBoundingClientRect()
        this.headerHeight = height;
        this.headerTop = top;
    },
    methods:{
        //获取成员组织
        getMemberList(){
            this.request({
                url:'staff/list',
                type:'get'
            })
        },
        //选项点击事件
        optionClickHandel(){

        },
        //回退
        backClick(){
            uni.navigateBack({
                delta:-1
            })
        }
    },
    components:{
        Loading,
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
.selectStore{
    .header{
        position: fixed;
        left: 0;
        display: flex;
        justify-content: center;
        align-items: center;
        justify-content: space-between;
        .backBox{
            height: 100rpx;
            width: 100rpx;
            display: flex;
            align-items: center;
            .cuIcon-back{
                margin-left: 20rpx;
                font-size: 34rpx;
            }
        }
        .headerText{
            margin-right: 50%;
            transform: translateX(50%);
        }
    }
    .selectOpt{
        background-color: white;
        display: flex;
        height: 100rpx;
        align-items: center;
        .optLeft{
            margin: 0rpx 30rpx;
        }
        .optRight{
            padding-left: 14rpx;
            flex: 1;
            height: 100%;
            display: flex;
            align-items: center;
            border-bottom: solid 2rpx $borderColor;
            view{
                padding-left: 10rpx;
                font-size: 26rpx;
            }
        }
    }
    .confirmBtn{
        position: fixed;
        left: 0rpx;
        bottom: 0rpx;
        width: 750rpx;
        height: 120rpx;
        text-align: center;
        line-height: 120rpx;
        color: $greenColor;
        background-color: white;
        font-size: 34rpx;
        font-weight: 600;
        border-top: solid 2rpx#e9e9e9;
    }
}

</style>