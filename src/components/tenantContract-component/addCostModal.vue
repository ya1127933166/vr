<template>
    <view v-if="isShow" class='addCostModal' catchtouchmove='true'>
        <view @tap="clickMask" class='mask'></view>
        <view class='costBox'>
            <view class="boxTop">
                <view class='topCancel'>取消</view>
                <view class='topText'>添加费用项目，并入租金一起展示给租客</view>
                <view class='topConfirm'>确定</view>
            </view>
            <view class='optionsBox'>
                <block v-for="item in optionsList" :key="item.text">
                    <view @tap="selectTag(item)" :class="(item.status?'active':'option')">{{item.text}}</view>
                </block>
                <view class='cell'></view>
            </view>
            <view class='optionsBox'>
                <block v-for="item in cardList" :key="item.text">
                    <view @tap="selectTag(item)" :class="(item.status?'active':'option')">{{item.text}}</view>
                </block>
                <view class='cell'></view>
            </view>
            <view class='optionsBox'>
                <block v-for="item in otherList" :key="item.text">
                    <view @tap="selectTag(item)" :class="(item.status?'active':'option')">{{item.text}}</view>
                </block>
            </view>
        </view>
    </view>
</template>

<script>
export default {
    name:'addCostModal',
    props:{
        isShow:{
            type:Boolean,
            default:false
        },
        cilckCoastMaskCallBack:{
            type:Function,
            default:()=>()=>{}
        }
    },
    data(){
        return{
            optionsList:[
                {text:'水电费',status:true},
                {text:'宽带费',status:false},
                {text:'燃气费',status:false},
                {text:'有线电视费',status:false},
                {text:'卫生费',status:false},
                {text:'管理费',status:true},
                {text:'物业费',status:false},
            ],
            cardList:[
                {text:'门卡',status:true},
                {text:'钥匙',status:false},
                {text:'水电卡',status:false},
                {text:'燃气卡',status:false}
            ],
            otherList:[
                {text:'其他',status:false}
            ]
        }
    },
    computed:{
        
    },
    methods:{
        //选择标签
        selectTag(item){ 
            let optIndex = this.optionsList.indexOf(item);
            let cardIndex = this.cardList.indexOf(item);
            let otherIndex = this.otherList.indexOf(item);
           if(optIndex!=-1){
               this.optionsList[optIndex].status = !this.optionsList[optIndex].status
           }else if(cardIndex!=-1){
               this.cardList[cardIndex].status = !this.cardList[cardIndex].status
           }else{
               this.otherList[otherIndex].status = !this.otherList[otherIndex].status
           }
        },
        //点击遮罩关闭
        clickMask(){
            this.$emit('cilckCoastMaskCallBack')
        }
    }
}
</script>

<style lang='scss' scoped>
.addCostModal{
    .mask{
        width: 750rpx;
        height: 100vh;
        background-color: rgba(0,0,0,0.4);
        position: fixed;
        top: 0;
        left: 0;
        z-index: 10;
        animation: fade 0.3s ease-in-out;
    }
    .costBox{
        width: 750rpx;
        background-color: white;
        position: fixed;
        bottom: 0;
        left: 0;
        z-index: 11;
        animation: modal 0.3s ease-in-out;
        padding-bottom: 40rpx;
        .boxTop{
            display: flex;
            justify-content: space-between;
            padding-top: 20rpx;
            align-items: center;
            .topCancel,.topConfirm{
                width: 110rpx;
                height: 50rpx;
                text-align: center;
                line-height: 50rpx;
                font-size: 30rpx;
                border-radius: 4rpx;
            }
            .topCancel{
                background-color: #ececec;
            }
            .topConfirm{
                background-color:#00a680;
                color: white;
            }
            .topText{
                font-size: 26rpx;
            }
        }
        .optionsBox{
            padding: 40rpx 20rpx 0rpx 40rpx;
            box-sizing: border-box;
            display: flex;
            flex-wrap: wrap;
            .option{
                // width: 120rpx;
                background-color: #ededed;
                color: rgb(100, 98, 98);
                padding: 8rpx 20rpx;
                border-radius: 8rpx;
                margin-right: 20rpx;
                margin-top: 20rpx;
                font-size: 30rpx;
            }
            .active{
                color: white;
                background-color: #4c94db;
                padding: 8rpx 20rpx;
                border-radius: 8rpx;
                margin-right: 20rpx;
                margin-top: 20rpx;
                font-size: 30rpx;
            }
            .cell{
                width: 650rpx;
                height: 3rpx;
                background-color:  #e0e0e0;
                margin-top: 60rpx;
            }
        }
    }
}
@keyframes fade{
    0%{
        opacity: 0;
    }
    100%{
        opacity: 1;
    }
}

@keyframes modal{
    0%{
        transform: translateY(100%);
    }
    100%{
        transform: translateY(0%);
    }
}
</style>