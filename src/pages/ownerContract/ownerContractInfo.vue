<template>
    <view class='ownerContractInfo'>
        <view class='process'>
            <progress activeColor="#00a680" backgroundColor="#cccccc" class='addProcess' :percent="pageInfo.len[2]" stroke-width="3" />
            <view class='processPoint'>
                <view v-for="(item) in pageInfo.processList" :key="item.text" :style="'background-color:'+(item.status==true?'#00a680':'#cccccc')+';'"></view>
            </view>
            <view class='processText'>
                <block v-for="(item) in pageInfo.processList" :key="item.text">
                    <view :style="'color:'+(item.status==true?'#06a782':'#8e8e8e')+';'">{{item.text}}</view>
                </block>
            </view>
        </view>
        <view class='ownerTop'>
            <block v-for="item in right" :key="item">
                <view class='topItem'>
                    <view class='itemLeft'>
                        {{item.text}}
                    </view>
                    <input v-model="item.val" v-if="item.text!=='抵押情况'&&item.text!=='产权性质'" class='itemInput' type="text" placeholder-style="color:#cccccc;" placeholder="请输入" />
                    <view class="picker" v-if="item.text==='产权性质'">
                        <picker @change="bindPickerChange" :range="downList">
                            <view class="uni-input" :style="'color:'+(item.val==''?'#cccccc':'#333')+';'">{{item.val==''?'请选择':item.val}}</view>
                        </picker>
                        <view class="cuIcon-right"></view>
                    </view>
                    <!-- <view class="cuIcon-right" v-if="item==='产权性质'" style="width:50rpx;height:50rpx;"></view> -->
                    <view v-if="item.text==='抵押情况'" class='mortgage'>
                        <view @tap.stop="mortgageClick(index)" v-for="(item,index) in mortgage" :class="['mortgageItem',item.status?'activemortgage':'mortgageItem']" :key="index">{{item.text}}</view>
                        <!-- <view class='mortgageItem'>无抵押</view> -->
                    </view>
                </view>
            </block>
        </view>
        <view class='centerTitle'>产权共有人</view>
        <view class='ownerCenter'>
            <block v-for="item in user" :key="item">
                <view class='centerItem'>
                    <view class='itemLeft'>
                        {{item.text}}
                    </view>
                    <input class='itemInput' type="text" placeholder-style="color:#d3cece;" placeholder="可选"/>
                </view>
            </block>
        </view>
        <view class='ownerBottom'>
            <block v-for="(item,index) in account" :key="item">
                <view @tap="financeClick(index)" class='bottomItem'>
                    <view class='itemLeft'>
                        {{item.text}}
                    </view>
                    <input v-if="item.text==='台账号'" class='itemInput' type="text" placeholder-style="color:#d3cece;" placeholder="可选"/>
                    <view v-else class='bottomLeft'>
                        <view class='redText'>房东年付，租客月付</view>
                        <view class='greenText'><view v-if="item.status"></view></view>
                    </view>
                </view>
            </block>
        </view>
        <view class='bottomBtn'>生成合同</view>
    </view>
</template>

<script>
import {createNamespacedHelpers} from 'vuex';
const {mapState:contractState,mapMutations:contractMutation} = createNamespacedHelpers('contract');
export default {
    name:'ownerContractInfo',
    data(){
        return{
            //产权性质下拉菜单
            downList:['普通住宅','公寓','别墅','平房','其他'],
            //产权
            right:[
                {text:'产权人姓名',val:'',status:false},
                {text:'手机号码',val:'',status:false},
                {text:'产权性质',val:'',status:false},
                {text:'抵押情况',val:'',status:false}
            ],
            //产权共有人
            user:[
                {text:'共有人名称',val:'',status:false},
                {text:'手机号码',val:'',status:false}
            ],
            //台账
            account:[
                {text:'台账号',val:'',status:false},
                {text:'开通年付金融',val:'',status:false}
            ],
            //抵押
            mortgage:[{text:'有抵押',status:false},{text:'无抵押',status:false}]
        }
    },
    mounted(){
        
    },
    computed:{
        ...contractState({
            pageInfo(state){
                this.updateProcerss(state.pageInfo);
                return state.pageInfo
            }
        })
    },
    methods:{
        ...contractMutation(['setPageInfo']),
        //更新进度条信息
        updateProcerss(info){
            //浅拷贝
            let temp = JSON.stringify(info)
            let pageInfo = JSON.parse(temp);

            //更改进度条
            pageInfo.processList[1].status = true
            this.setPageInfo(pageInfo)
        },
        //抵押情况切换
        mortgageClick(index){
            this.mortgage.map((ele,i)=>{
                ele.status = false;
                if(i == index){
                    ele.status = true
                }
            })
        },
        //年付金融
        financeClick(index){
            if(index == 1){
                this.account[index].status = !this.account[index].status
            }
        },
        //下拉菜单选择事件
        bindPickerChange(e){
            this.right[2].val = this.downList[e.detail.value]
        }
    }
}
</script>

<style lang='scss' scoped>
.ownerContractInfo{
    .process{
        padding: 70rpx 0rpx 70rpx 0rpx;
        .addProcess{
            margin: 0 auto;
            width: 400rpx;
        }
        .processPoint{
            width: 420rpx;
            display: flex;
            justify-content: space-between;
            margin: 0 auto;
            view{
                width: 20rpx;
                height: 20rpx;
                border-radius: 15rpx;
                background-color: #cccccc;
                transform: translateY(-65%);
            }
        }
        .processText{
            width: 600rpx;
            display: flex;
            justify-content: space-between;
            margin: 0 auto;
            view{
                width: 200rpx;
                color: #8e8e8e;
                text-align: center;
                font-size: 28rpx;
            }
        }
    }
    .ownerTop,.ownerCenter,.ownerBottom{
        width: 750rpx;
        background-color: white;
        .topItem,.centerItem,.bottomItem{
            height: 100rpx;
            padding: 0rpx 40rpx 0rpx 40rpx;
            display: flex;
            align-items: center;
            border-bottom: solid calc(1px / 2.5) #d9d9d9;
            justify-content: space-between;
            font-size: 30rpx;
            position: relative;
            .itemLeft{
                width: 240rpx;
            }
            .itemInput{
                width: 100%;
                height: 100%;
                left: 0;
                top: 0;
                padding-left: 240rpx;
                position: absolute;
                color: #cccccc;
                font-size: 30rpx;
                display: flex;
                align-items: center;
                // background-color: rgba($color: #000000, $alpha: 0.3);
            }
            .picker{
                .uni-input{
                    position: absolute;
                    left: 0;
                    top: 0;
                    width: 100%;
                    height: 100%;
                    color: #cccccc;
                    text-indent: 240rpx;
                    padding-right: 40rpx;
                    display: flex;
                    flex-grow: 1;
                    justify-content: space-between;
                    align-items: center;
                }
                
            }
            .mortgage{
                padding-left: 20rpx;
                display: flex;
                flex-grow: 1;
                .mortgageItem{
                    width: 140rpx;
                    height: 60rpx;
                    background-color: #f1f1f1;
                    text-align: center;
                    line-height: 60rpx;
                    font-size: 28rpx;
                    border-radius: 6rpx;
                }
                .mortgageItem:nth-child(2){
                    margin-left: 50rpx;
                }
                .activemortgage{
                    background-color: #00a680;
                    color: white;
                }
            }
            &:last-child{
                border: none;
            }
            &:active{
                background-color: #fafafa;
            }
        }
    }
    .centerTitle{
        font-size: 28rpx;
        padding: 30rpx 0rpx 20rpx 30rpx;
        color: #888888;
    }
    .ownerBottom{
        margin-top: 40rpx;
        .bottomItem{
            .bottomLeft{
                flex-grow: 1;
                display: flex;
                justify-content: space-between;
                align-items: center;
                .redText{
                    // width: 270rpx;
                    border: solid 1rpx#f08080;
                    border-radius: 40rpx;
                    color: #f08080;
                    font-size: 26rpx;
                    text-align: center;
                    margin: auto 0;
                    transform: translateX(10%);
                    padding: 4rpx 20rpx;
                }
                .greenText{
                    width: 40rpx;
                    height: 40rpx;
                    border: solid 1rpx #00a680;
                    border-radius: 20rpx;
                    display: flex;
                    justify-content: center;
                    align-items: center;
                    view{
                        width: 15rpx;
                        height: 30rpx;
                        border: solid 1rpx #00a680;
                        border-left: transparent;
                        border-top: transparent;
                        transform: rotate(50deg);
                        margin-top: -10rpx;
                    }
                }
            }
        }
    }
    .bottomBtn{
        width: 690rpx;
        height: 100rpx;
        background-color: #00a680;
        margin: 40rpx auto;
        color: white;
        font-size: 34rpx;
        text-align: center;
        line-height: 100rpx;
        border-radius: 10rpx;
        &:active{
            background-color: #007e5e;
        }
    }
}
</style>