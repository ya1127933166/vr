<template>
    <view class='survery'>
       <!-- <view class='surveryBox' style="border-top: solid 16rpx #f5f5f5;border-bottom: solid 16rpx #f5f5f5;padding: 40rpx 30rpx 40rpx 30rpx;">
            <view class='surveryTitle' style="font-size: 32rpx;font-weight: 600;padding-bottom: 30rpx;">小区概况</view>
            <view class='menuBox'>
                <block v-for="item in menuList" :key="item.title">
                    <view class='menuItem' style="display: flex;font-size: 28rpx;">
                        <view class='itemLeft' style="width: 170rpx;color: #646363;">{{item.title}}</view>
                        <view class='itemRight'>{{item.discre}}</view>
                    </view>
                </block>
            </view>
        </view> -->
        <view class='mapBox' style="border-top: solid 16rpx #f5f5f5;">
            <view class='mapTitle' style="padding: 40rpx 0rpx 20rpx 0rpx;width: 690rpx;margin: 0 auto;font-size: 32rpx;font-weight: 600;">位置及周边配套</view>
            <view class='mapAddrs' style="width: 690rpx;margin: 0 auto;font-size: 26rpx;padding-bottom: 20rpx;">位置：{{toChild.address}}</view>
            <MapTool :location='toChild.location'  :title="toChild.title" :address="toChild.address"></MapTool>
        </view>
    </view>
</template>

<script>
	import {mapState} from 'vuex'
import MapTool from '../../../components/map-poi-box.vue'
export default {
    name:'survey',
    data(){
        return{
            menuList:[
                {title:'小区别名:',discre:'城南一9s号'},
                {title:'建成年代:',discre:'2012年'},
                {title:'产权年限:',discre:'40-70年'},
                {title:'建筑结构:',discre:'塔板结合'},
                {title:'楼栋总数:',discre:'34栋'},
                {title:'总户数:',discre:'2302户'},
                {title:'是否电梯:',discre:'是'},
                {title:'物业类型:',discre:'住宅+公寓'},
                {title:'物业公司:',discre:'成都中海物业管理有限公司'},
                {title:'物业费用:',discre:'3元/平米/月'},
                {title:'开发商:',discre:'中海振兴（成都）物业发展有限公司'},
            ]
        }
    },
    props:{
        toChild:{
            type:Object,
            default:{}
        },
    },
    watch:{
        toChild:{
            handler(newValue,oldValue){
			    this.toChild = newValue
           },
           deep:true,
           immediate:true
        }
    },
	computed:{
		...mapState({location: (state) => state.location,})
	},
    components:{
        MapTool
    },
	created() {
	}
}
</script>

<style lang='scss' scoped>
.survery{
    .surveryBox{
        border-top: solid 16rpx #f5f5f5;
        border-bottom: solid 16rpx #f5f5f5;
        padding: 50rpx 30rpx 40rpx 30rpx;
        .surveryTitle{
            font-size: 32rpx;
            font-weight: 600;
            padding-bottom: 30rpx;
        }
        .menuBox{
            .menuItem{
                display: flex;
                font-size: 30rpx;
                .itemLeft{
                    width: 170rpx;
                    color: #646363;
                }
                // .itemRight{
                //     // font-weight: 600;
                // }
            }
        }
    }
    .mapBox{
        .mapTitle{
            padding: 40rpx 0rpx 20rpx 0rpx;
            width: 690rpx;
            margin: 0 auto;
            font-size: 32rpx;
            font-weight: 600;
        }
        .mapAddrs{
            width: 690rpx;
            margin: 0 auto;
            font-size: 26rpx;
            padding-bottom: 20rpx;
        }
    }
}
</style>