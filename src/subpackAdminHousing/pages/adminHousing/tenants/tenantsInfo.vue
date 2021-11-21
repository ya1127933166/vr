<template>
    <!-- 租客信息 -->
    <view class='tenantsInfo'>
        <view class='infoHeader'>
            <view>张珊珊/李依依<text>A房间</text></view>
            <view><text>天鹅湖二期</text>2室1厅1卫</view>
            <view>12-2-2001</view>
        </view>

        <view class='title'>租客信息</view>
        <view class='infoBox'>
            <view @tap="toEditTennat" class='detail'>
                <view class='detailLeft'>
                    <view>张三三</view>
                    <view>180 **** 2833</view>
                    <view>510120 1990 1222 ****</view>
                </view>
                <view class='cuIcon-right'></view>
            </view>
           <view @tap="toEditTennat" class='detail'>
                <view class='detailLeft'>
                    <view>李依依 <text class='tag'>合租人</text></view>
                    <view>180 **** 2833</view>
                    <view>510120 1990 1222 ****</view>
                </view>
                <view class='cuIcon-right'></view>
            </view>
        </view>

        <view class='title'>租约信息</view>
        <view class='infoBox'>
            <block v-for="item in lease" :key="item.text">
                <view class='cell' v-if="item.text=='收支记录'"></view>
                <view @tap="clickItem(item.text)" class='normal' :style="'border:'+(item.text=='租约合同'||item.text=='收支记录'?'none':'')+';'">
                    <view class='left'>
                        <image style="width:40rpx;height:40rpx;" v-if="item.path&&item.path!='默认'" :src='item.path'></image>
                        <view>{{item.text}}</view>
                    </view>
                    <view :class="['center',item.text=='月租金'?'tagBox':'']" style="color:black;"><view>{{item.val[0]}}</view><view :class="[item.text=='租期'?'greyTag':'']">{{item.val[1]}}</view></view>
                    <view class='right'></view>
                    <view v-if="item.path" class='cuIcon-right'></view>
                </view>
                <view class='cell' v-if="item.text=='收支记录'"></view>
            </block>
        </view>
        <view style="width:750rpx;height:100rpx;"></view>

        <view class="removeBtn">删除</view>
    </view>
</template>

<script>
export default {
    name:'tenatsInfo',
    data(){
        return{
            lease:[
                {text:'小区',val:['天鹅湖二期2室1厅1卫','12-2-2001']},
                {text:'台账号',val:['成A 3-43-2']},
                {text:'租期',val:['2018-03-03 至 2019-02-05','入住320天']},
                {text:'月租金',val:['1600元','押1付3']},
                {text:'押金',val:['1800元']},
                {text:'租约合同',val:[],path:'https://uss.img.lezhulife.com/xcxicon/leaseContract.png'},
                {text:'收支记录',val:[],path:'https://uss.img.lezhulife.com/xcxicon/income.png'},
                {text:'续租',val:[],path:'https://uss.img.lezhulife.com/xcxicon/Renewal.png'},
                {text:'退租',val:[],path:'https://uss.img.lezhulife.com/xcxicon/Rentrefund.png'},
            ]
        }
    },
    methods:{
        //编辑租客
        toEditTennat(){
            uni.navigateTo({
                url: '../../../../subpackAdminHousing/pages/adminHousing/tenants/editTennat',
            })
        },
        //选项点击事件
        clickItem(text){
            switch (text) {
                case '租约合同':
                    
                    break;
                case '收支记录':
                    uni.navigateTo({
                        url:'../../../../subpackAdminHousing/pages/adminHousing/tenants/historyTenant/bill'
                    })
                    break;
                case '续租':
                    uni.navigateTo({
                        url:'../../../../subpackAdminHousing/pages/adminHousing/tenants/renewal'
                    })
                    break;
                case '退租':
                    uni.navigateTo({
                        url:'../../../../subpackAdminHousing/pages/adminHousing/tenants/rentRefund'
                    })
                    break;
                default:
                    break;
            }
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
.tenantsInfo{
    .infoHeader{
        background-color: white;
        width: 750rpx;
        text-align: center;
        padding-top: 40rpx;
        padding-bottom: 40rpx;
        border-bottom:solid 4rpx #e6e6e6;
        font-size: 30rpx;
        view:nth-child(1){
            font-size: 34rpx;
            font-weight: 600;
            text{
                display: inline-block;
                background-color: #dae8fc;
                color: #6667fe;
                font-size: 28rpx;
                font-weight: 400;
                padding: 6rpx 10rpx;
                border-radius: 6rpx;
                margin-left: 30rpx;
            }
        }
    }
    .title{
        font-size: 26rpx;
        color: #6d6c6c;
        padding: 50rpx 0rpx 20rpx 16px;
    }
    .infoBox{
        background-color: white;
        // padding: 0rpx 40rpx 0rpx 40rpx;
        box-sizing: border-box;
        .detail{
            // width: 670rpx;
            // margin: 0 auto;
            padding: 0rpx 40rpx 0rpx 40rpx;
            height: 180rpx;
            background-color: white;
            display: flex;
            align-items: center;
            border-bottom: solid calc(1px / 2.5) #d9d9d9;
            .detailLeft{
                flex-grow: 1;
                font-size: 30rpx;
                view{
                    line-height: 40rpx;
                }
                view:nth-child(1){
                    font-size: 34rpx;
                    font-weight: 600;
                    padding-bottom: 10rpx;
                    padding-top: 20rpx;
                    .tag{
                       font-size: 30rpx;
                       font-weight: 500;
                       color: #ea6d68; 
                       background-color: #fdf0f0;
                       padding: 6rpx 10rpx;
                       margin-left: 20rpx;
                       border-radius: 6rpx;
                    }
                }
                view:nth-child(3){
                    padding-bottom: 10rpx;
                }
            }
            &:last-child{
                border: none;
            }
            &:active{
                background-color: #fafafa;
            }
        }
        .normal{
            // width: 670rpx;
            // margin: 0 auto;
            padding: 30rpx 40rpx 30rpx 40rpx;
            display: flex;
            justify-content: space-between;
            align-items: flex-start;
            // height: 100rpx;
            border-bottom: solid calc(1px / 2.5) #d9d9d9;
            font-size: 30rpx;
            .normalLeft{
                display: flex;
                align-items: center;
                view:nth-child(1){
                    font-size: 42rpx;
                    color: #0080f0;
                    padding-right: 20rpx;
                }
                
            }
            .left{
                width: 260rpx;
                display: flex;
                align-items: center;
                image{
                    margin-right: 20rpx;
                }
            }
            .center{
                flex-grow: 1;
                color: #cccccc;
                .greyTag{
                    background-color: #e6e6e6;
                    font-size: 30rpx;
                    display: inline-block;
                    padding: 4rpx 8rpx;
                    border-radius: 6rpx;
                }
            }
            .tagBox{
                display: flex;
                view:nth-child(2){
                    background-color: #d5e8d4;
                    color: #13ac88;
                    font-size: 30rpx;
                    border-radius: 6rpx;
                    padding: 4rpx 10rpx;
                    margin-left: 30rpx;
                }
            }
            &:active{
                background-color: #fafafa;
            }
        }
        .normal:last-child{
            border: none;
        }
        .cell{
            width: 750rpx;
            height: 20rpx;
            background-color: $pageBgColor;
        }
    }
    .removeBtn{
        width: 750rpx;
        height: 130rpx;
        font-size: 34rpx;
        line-height: 130rpx;
        text-align: center;
        color: #eb7570;
        background-color: white;
        border-top: solid 1rpx #d9d9d9;
        &:active{
            background-color: #fafafa;
        }
    }
}
</style>