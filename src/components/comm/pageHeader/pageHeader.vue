<template>
    <!-- 自定义头部 -->
    <view class="pageHeader">
        <view class='header' :style="'width:750rpx;height:' + customeheaderInfo.headerHeight + ';padding-top:'+customeheaderInfo.bound.top+'px;'">
            <view v-if="isArrow" @tap="backClick" class="backBox">
                <view :style="'margin-left:'+backMargin+'px'" class="cuIcon-back"></view>
            </view>
            <view :style="'transform: translateX('+(isAndroid?'-294%':'-50%')+');'" class='headerText'>{{title}}</view>
        </view>
    </view>
</template>

<script>
import {mapState} from 'vuex';
export default {
    name:'selectStore',
    props:{
        title:{
            type:String,
            default:''
        },
        backCallBack:{
            type:Function,
            default:()=>()=>{}
        },
        isArrow:{
            type:Boolean,
            default:true
        }
    },
    data(){
        return{
            
        }
    },
    mounted(){
        
    },
    computed:{
        ...mapState({
            customeheaderInfo:state=>state.customeheaderInfo
        }),
        //计算返回键距离左边的边距
        backMargin(){
            return this.$$globalData.systemInfo.windowWidth-0-this.customeheaderInfo.bound.left-0-this.customeheaderInfo.bound.width-0
        },
        //系统信息
        isAndroid(){
            const sys = this.$$globalData.systemInfo;
            return sys.system.startsWith('Android')
        }
    },
    methods:{
        //回退
        backClick(){
            this.$emit('backCallBack')
        }
    },
    components:{
        
    }
}
</script>

<style lang='scss' scoped>
.pageHeader{
    position: fixed;
    left: 0;
    top: 0;
    z-index:10;
    transition: ease-in 0.2s;
    background-color: white;
    .header{
        box-sizing: border-box;
        display: flex;
        align-items: center;
        position: relative;
        .backBox{
            width: 80rpx;
            height: 100%;
            // background-color: yellowgreen;
            display: flex;
            align-items: center;
            .cuIcon-back{
                font-size: 40rpx;
                color: black;
                transform: translateX(20%);
                font-weight: 400;
            }
            &:active{
                background-color: #e0e0e0;
            }
        }
        .headerText{
            position: absolute;
            left: 50%;
            transform: translateX(-294%);
            font-size: 34rpx;
        }
    }
}

</style>