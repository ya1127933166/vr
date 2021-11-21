<template>
    <view class='addRoom'>
        <view class='infoHeader'>
            <!-- <view class='top'>张珊珊/李依依 <text>A房间</text></view> -->
            <view class='center'><text>天鹅湖二期</text>2室1厅1卫</view>
            <view>12-2-2001</view>
        </view>

        <view class='title'>房间信息</view>
        <view class='infoBox'>
            <view @tap="clickItem('房间号')" class='normal'>
                <view class='left'>房间号</view>
                <picker class="picker" mode="time" :value="time" start="09:01" end="21:01" @change="bindTimeChange">
                    <view class="pickerBox">请选择</view>
                </picker>
                <view class='cuIcon-right'></view>
            </view>
            <view @tap="clickItem('面积')" class='normal'>
                <view class='left'>面积</view>
                <input class='center' placeholder-style="color:black" placeholder-class="center" placeholder="15m²" />
                <view class='cuIcon-right'></view>
            </view>
            <view @tap="clickItem('户型')" class='normal'>
                <view class='left'>户型</view>
                <picker class="picker" mode="time" :value="time" start="09:01" end="21:01" @change="bindTimeChange">
                    <view class="pickerBox">请选择</view>
                </picker>
                <view class='cuIcon-right'></view>
            </view>
            <view @tap="clickItem('卫生间')" class='normal'>
                <view class='left'>卫生间</view>
                <view class='center'>
                    <view class='btnBox'>
                        <view>带卫生间</view>
                        <view>不带</view>
                    </view>
                </view>
            </view>
            <view @tap="clickItem('挂牌价格')" class='normal'>
                <view class='left'>挂牌价格</view>
                <input class='center' placeholder-style="color:black" placeholder-class="center" placeholder="1600 元/月" />
                <view class='cuIcon-right'></view>
            </view>
            <view @tap="clickItem('底价')" class='normal'>
                <view class='left'>底价</view>
                <input class='center' placeholder-style="color:black" placeholder-class="center" placeholder="1405 元/月" />
                <view class='cuIcon-right'></view>
            </view>
            <view @tap="clickItem('是否已出租')" class='normal'>
                <view class='left'>是否已出租</view>
                <picker class="picker" mode="time" :value="time" start="09:01" end="21:01" @change="bindTimeChange">
                    <view class="pickerBox">请选择</view>
                </picker>
                <view class='cuIcon-right'></view>
            </view>
        </view>

        <view class='title'>照片</view>
        <view class='infoBox'>
            <view @tap="clickItem('房间照片')" class='normal'>
                <view class='left'>房间照片</view>
                <input class='center' placeholder-class="center" placeholder="请上传" />
                <view class='cuIcon-right'></view>
            </view>
            <view @tap="clickItem('公区照片')" class='normal'>
                <view class='left'>公区照片</view>
                <input class='center' placeholder-class="center" placeholder="请上传" />
                <view class='cuIcon-right'></view>
            </view>
        </view>
        <view class='saveBtn'>保存</view>
    </view>
</template>

<script>
export default {
    name:'addRoom',
    data(){
        return{
            
        }
    },
    methods:{
        clickItem(text){
            switch (text) {
                case '房间号':
                    
                    break;
                case '面积':
                    
                    break;
                case '户型':
                    
                    break;
                case '卫生间':
                    
                    break;
                case '挂牌价格':
                    
                    break;
                case '底价':
                    
                    break;
                case '是否已出租':
                    
                    break;
                case '房间照片':
                    uni.navigateTo({
                        url: '../../../../pages/upload/upload',
                    })
                    break;
                case '公区照片':
                    uni.navigateTo({
                        url: '../../../../pages/upload/upload',
                    })
                    break;
                default:
                    break;
            }
        }
    },
    components:{
        
    }
}
</script>

<style lang='scss' scoped>
$pageBgColor:#f7f7f7;
$borderColor:#e9e9e9;
$placerColor:#cccccc;
$titleColor:#888888;
$greenColor:#00a680;
.addRoom{
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
        font-size: 26rpx;
        color: #6d6c6c;
        padding: 50rpx 0rpx 20rpx 16px;
    }
    .infoBox{
        background-color: white;
        box-sizing: border-box;
        .normal{
            padding: 0rpx 40rpx 0rpx 40rpx;
            display: flex;
            justify-content: space-between;
            align-items: center;
            height: 100rpx;
            border-bottom: solid calc( 1px / 2.5) #d9d9d9;
            position: relative;
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
            .picker{
                position: absolute;
                width: 90%;
                height: 100rpx;
                line-height: 100rpx;
                text-indent: 260rpx;
            }
            .left{
                width: 260rpx;
            }
            .center{
                flex-grow: 1;
                color: #cccccc;
                font-size: 30rpx;
                .tag{
                    display: inline-block;
                    color: #6666ff;
                    background-color: #dae8fc;
                    font-size: 20rpx;
                    text-align: center;
                    padding: 4rpx 10rpx;
                }
                .btnBox{
                    display: flex;
                    view{
                        width: 150rpx;
                        height: 50rpx;
                        border-radius: 30rpx;
                        font-size: 28rpx;
                        text-align: center;
                        line-height: 50rpx;
                        margin-right: 20rpx;
                    }
                    view:nth-child(1){
                        border: solid 1rpx $titleColor;
                        color: black;
                    }
                    view:nth-child(2){
                        border: solid 1rpx $greenColor;
                        color: $greenColor;
                    }
                }
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
            &:active{
                background-color: #fafafa;
            }
        }
        .normal:last-child{
            border: none;
        }
        .note{
            border: none;
            .center{
                text-align: right;
            }
        }
        .noteArea{
            height: 100rpx;
        }
    }
    .saveBtn{
        width: 690rpx;
        height: 100rpx;
        color: white;
        font-size: 34rpx;
        text-align: center;
        background-color: #00a680;
        margin: 40rpx auto;
        line-height: 100rpx;
        border-radius: 10rpx;
        &:active{
            background-color: #007e5e;
        }
    }
}

</style>