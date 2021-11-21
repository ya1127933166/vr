<template>
    <!-- 添加租客 -->
    <view class='addTenant'>
        <view class='infoHeader'>
            <view><text>天鹅湖二期</text>2室1厅1卫<text>合租</text></view>
            <view>12-2-2001</view>
        </view>
        <view class='title'>租客信息</view>
        <view class='infoBox'>
            <view class='detail'>
                <view class='detailLeft'>
                    <view>张三三</view>
                    <view>180 **** 2833</view>
                    <view>510120 1990 1222 ****</view>
                </view>
                <view class='cuIcon-right'></view>
            </view>
            <view class='normal'>
                <view class='normalLeft'>
                    <view>+</view>
                    <view>添加租客</view>
                </view>
                <view class='cuIcon-right'></view>
            </view>
        </view>

        <view class='title'>合同信息</view>
        <view class='infoBox'>
            <view class='normal'>
                <view class='left'>月租金</view>
                <input class='center' placeholder-class="center" placeholder-style="color:black;font-size:26rpx;" placeholder="2200 元"/>
            </view>
            <view class='normal'>
                <view class='left'>付款方式</view>
                <picker class="centerPicke" mode="multiSelector" :range="info.payment.list" :value="currentData" @change="bindDateChange($event,'付款方式')">
                    <view class='pickItem'>
                        <view class="picker" :style="'color:'+(info.payment.val=='请选择'?'#cccccc':'#333333')">
                        {{info.payment.val}}
                        </view>
                    </view>
                </picker>
                <view class='cuIcon-right'></view>
            </view>
            <view class='normal'>
                <view class='left'>合同时间</view>
                <view class='pickBox'>
                    <picker mode="date" fields="day" :value="currentData" start="2015-09-01" end="2017-09-01" @change="bindDateChange($event,'开始')">
                        <view class='pickItem'>
                            <view class="picker" :style="'color:'+(info.start=='起始时间'?'#cccccc':'#333333')">
                                {{info.start}}
                            </view>
                            <view class='cuIcon-unfold'></view>
                        </view>
                    </picker>
                    <picker mode="date" fields="day" :value="currentData" start="2015-09-01" end="2017-09-01" @change="bindDateChange($event,'结束')">
                        <view class='pickItem'>
                            <view class="picker" :style="'color:'+(info.end=='结束时间'?'#cccccc':'#333333')">
                            {{info.end}}
                            </view>
                            <view class='cuIcon-unfold'></view>
                        </view>
                    </picker>
                </view>
            </view>
        </view>

        <view class='title'>合同图片</view>
        <view @tap="toUpload" class='infoBox'>
            <view class='normal'>
                <view class='left'>租赁合同照片</view>
                <view class='center'>请上传</view>
                <view class='cuIcon-right'></view>
            </view>
        </view>

        <view class='btnBox'>
            <view class='btnLeft'>保存</view>
            <view class='btnRight'>保存，继续添加</view>
        </view>
    </view>
</template>

<script>
export default {
    name:'addTenant',
    data(){
        return{
            info:{
                payment:{
                    val:'请选择',
                    list:[['押1','押2','押3','无押金'],['付1','付2','付3','半年付','年付','一次性付清']]
                },
                start:'起始时间',
                end:'结束时间'
            }
            
        }
    },
    methods:{
        bindDateChange(e,text){
            // console.log(e,text);
            switch (text) {
                case '开始':
                    this.info.start = e.detail.value
                    break;
                case '结束':
                    this.info.end = e.detail.value
                    break;
                case '付款方式':
                    let temp = e.detail.value;
                    this.info.payment.val = `${this.info.payment.list[0][temp[0]]}-${this.info.payment.list[1][temp[1]]}`
                    break;
                default:
                    break;
            }
        },
        toUpload(){
            uni.navigateTo({
                url: '../../../../pages/upload/upload',
            })
        }
    }
}
</script>

<style lang='scss' scped>
$pageBgColor:#f7f7f7;
$borderColor:#e9e9e9;
$placerColor:#cccccc;
$titleColor:#888888;
$greenColor:#00a680;
.addTenant{
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
        box-sizing: border-box;
        .detail{
            height: 180rpx;
            background-color: white;
            display: flex;
            align-items: center;
            border-bottom: solid calc(1px / 2.5) #d3d3d3;
            padding: 0rpx 40rpx 0rpx 40rpx;
            font-size: 30rpx;
            .detailLeft{
                flex-grow: 1;
                view{
                    line-height: 40rpx;
                }
                view:nth-child(1){
                    font-size: 34rpx;
                    font-weight: 600;
                    padding-bottom: 10rpx;
                    padding-top: 20rpx;
                }
                view:nth-child(3){
                    padding-bottom: 10rpx;
                }
            }
            &:active{
                background-color: #fafafa;
            }
        }
        .normal{
            position: relative;
            font-size: 30rpx;
            display: flex;
            justify-content: space-between;
            align-items: center;
            height: 100rpx;
            padding: 0rpx 40rpx 0rpx 40rpx;
            border-bottom: solid calc(1px / 2.5) #d9d9d9;
            .normalLeft{
                display: flex;
                align-items: center;
                view:nth-child(1){
                    font-size: 42rpx;
                    color: #0080f0;
                    padding-right: 20rpx;
                }
                
            }
            .pickBox{
                flex-grow: 1;
                display: flex;
                justify-content: space-between;
                .pickItem{
                    display: flex;
                    align-items: center;
                    .picker{
                        padding-right: 20rpx;
                        color: $placerColor;
                        height: 100rpx;
                        line-height: 100rpx;
                    }
                }
            }
            .left{
                width: 260rpx;
            }
            .center{
                flex-grow: 1;
                color: #cccccc;
            }
            .right{
                display: flex;
                align-items: center;
                view{
                    color: black;
                    font-weight: 600;
                }
                image{
                    margin-left: 20rpx;
                }
            }
            .centerPicke{
                position: absolute;
                left: 0;
                top: 0;
                width: 100%;
                height: 100%;
                line-height: 100rpx;
                text-indent: 300rpx;
            }
            &:active{
                background-color: #fafafa;
            }
        }
        .normal:last-child{
            border: none;
        }
    }
    .btnBox{
        width: 680rpx;
        display: flex;
        justify-content: space-between;
        margin: 60rpx auto;
        view{
            width: 320rpx;
            height: 100rpx;
            text-align: center;
            line-height: 100rpx;
            font-size: 34rpx;
            border-radius: 10rpx;
        }
        .btnLeft{
            color: white;
            background-color: $greenColor;
            &:active{
                background-color: #007e5e;
            }
        }
        .btnRight{
            color: $greenColor;
            border: solid 1rpx $greenColor;
            &:active{
                background-color: #fafafa;
                color: #cccccc;
                border: solid 1rpx #cccccc;
            }
        }
    }
}
</style>