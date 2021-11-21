<template>
    <!-- 待审批首页 -->
    <view class='approval'>
        <DropMenu :isWhite="true" :isShowBtn="false" @downMenuBarClickCallBack="clickMenuHandel" :menuBar="menuBar" :list="list"></DropMenu>
        <scroll-view scroll-y style="height:calc(100vh - 100rpx)">
            <block v-for="item in 10" :key="item">
                <HouseItem @tap="toContract"></HouseItem>
            </block>
            <view style="height:100rpx;width:750rpx"></view>
        </scroll-view>
    </view>
</template>

<script>
import DropMenu from '../../../components/comm/dropDownMenu/dropDownMenu.vue';
import HouseItem from '../../../components/comm/houseItem/houseItem.vue';
export default {
    name:'approval',
    data(){
        return{
            menuBar: [
                { text: "类型", status: false },
                { text: "状态", status: false }
            ],
            list:[
                [
                    { text: "类型", status: false },
                    { text: "全部", status: true },
                    { text: "业主合同", status: false },
                    { text: "租客合同", status: false }
                ],
                [
                    { text: "状态", status: false },
                    { text: "全部 ", status: true },
                    { text: "待审批", status: false },
                    { text: "已通过", status: false },
                    { text: "已拒绝", status: false },
                    { text: "待修改", status: false },
                ]
            ],
            currentMenuTitle: "默认",
        }
    },
	onLoad(){
		uni.hideLoading()
	},
    computed:{
        
    },
    methods:{
        clickMenuHandel(e){
            console.log(e);
        },
        toContract(){
            uni.navigateTo({
                url: '../../../subpackComm/pages/approval/tenantContract',
            })
        }
    },
    components:{
        DropMenu,
        HouseItem
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
    min-height: 100vh;
}
.approval{
    background-color: white;
    min-height: 100vh;
}
</style>