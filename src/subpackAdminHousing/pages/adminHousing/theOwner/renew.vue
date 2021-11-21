<template>
    <!-- 续签合同 -->
    <view class='renew'>
         <view class='infoHeader'>
            <view><text>天鹅湖二期</text>2室1厅1卫</view>
            <view>12-2-2001</view>
        </view>

        <view class='title'></view>
        <view class='infoBox'>
             <view class='normal'>
                <view class='left'>续约期限</view>
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
            <view class='normal'>
                <view class='left'>月租金</view>
                <view class='center'>2200</view>
                <view class='right'>元</view>
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
                <view class='left'>空置期扣除标准</view>
                <picker class="centerPicke" mode="selector" :range="info.vacant.list" :value="currentData" @change="bindDateChange($event,'空置期扣除标准')">
                    <view class='pickItem'>
                        <view class="picker" :style="'color:'+(info.vacant.val=='请选择'?'#cccccc':'#333333')">
                        {{info.vacant.val}}
                        </view>
                    </view>
                </picker>
                <view class='cuIcon-right'></view>
            </view>
            <view @tap="areaFocus=true" class='normal note'>
                <view class='left'>合同备注</view>
                <view class='center'>添加合同附加条款，备注</view>
            </view>
            <textarea @blur="areaFocus=false" :focus="areaFocus" class='noteArea'></textarea>
        </view>

        <view @tap="singCode" class='saveBtn'>生成续签二维码</view>
    </view>
</template>

<script>
export default {
    name:'renew',
    data(){
        return{
            info:{
                start:'起始时间',
                end:'结束时间',
                payment:{
                    val:'请选择',
                    list:[['押1','押2','押3','无押金'],['付1','付2','付3','半年付','年付','一次性付清']]
                },
                vacant:{
                    val:'请选择',list:['第1次付款扣除/每年','第2次付款扣除/每年','第3次付款扣除/每年','第4次付款扣除/每年','首次全部扣除']
                }
            },
            areaFocus:false
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
                case '空置期扣除标准':
                    this.info.vacant.val = this.info.vacant.list[e.detail.value]
                    break;
                default:
                    break;
            }
        },
        //生成续签二维码
        singCode(){
            uni.navigateTo({
                url: '../../../../pages/signCode/signCode',
            })
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
page{
    background-color: $pageBgColor;
}
.renew{
    .infoHeader{
        background-color: white;
        width: 750rpx;
        text-align: center;
        padding-top: 40rpx;
        padding-bottom: 40rpx;
        border-bottom:solid 4rpx #e6e6e6;
        view:nth-child(1){
            text{
                font-size: 34rpx;
                font-weight: 600;
                padding-right: 10rpx;
            }
        }
    }
    .title{
        font-size: 26rpx;
        color: #6d6c6c;
        padding: 50rpx 0rpx 20rpx 20px;
    }
    .infoBox{
        background-color: white;
        box-sizing: border-box;
        .normal{
            position: relative;
            font-size: 30rpx;
            padding: 0rpx 40rpx 0rpx 40rpx;
            display: flex;
            justify-content: space-between;
            align-items: center;
            height: 100rpx;
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
                height: 100rpx;
                align-items: center;
                .pickItem{
                    display: flex;
                    align-items: center;
                    // border: solid 1px red;
                    height: 100%;
                    width: 100%;
                    .picker{
                        // border: solid 1px blue;
                        padding-right: 20rpx;
                        color: $placerColor;
                        width: 100%;
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
            &:active,&:active + .noteArea{
                background-color: #fafafa;
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
            height: 140rpx;
            width: 100%;
            padding: 0rpx 40rpx 20rpx 40rpx;
        }
    }
    .saveBtn{
        width: 690rpx;
        height: 100rpx;
        color: white;
        font-size: 34rpx;
        // font-weight: 600;
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