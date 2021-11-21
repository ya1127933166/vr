<template>
    <!-- 标签 -->
    <view class='tag'>
        <block>
            <view class='tagTitle'>企业标签</view>
            <view class='tagBox'>
                <block v-for="(item,index) in enterpriseTag" :key="item.title">
                    <view class='tagItem' @click.stop="toEdit(item,'企业标签')">
                        <view class='itemTitle'>{{item.title}}</view>
                        <view class='itemBox'>
                            <block v-for=" tag in item.list" :key="tag.text">
                                <view @click.stop="selectTag('企业标签',item.title,tag)" :class="[tag.status?'activeItem':'item']">{{tag.text}}</view>
                            </block>
                        </view>
                    </view>

                    <view class='cell'></view>
                    <view v-if="index!=enterpriseTag.length-1" id="cell"><view class="line"></view></view>
                </block>
            </view>
        </block>


        <block v-if="personalTag.length>0">
            <view class='tagTitle'>个人标签</view>
            <view class='tagBox'>
                <block v-for="item in personalTag" :key="item.title">
                    <view class='tagItem' @click.stop="toEdit(item,'个人标签')">
                        <view class='itemTitle'>{{item.title}}</view>
                        <view class='itemBox'>
                            <block v-for=" tag in item.list" :key="tag.text">
                                <view @click.stop="selectTag('个人标签',item.title,tag)" :class="[tag.status?'activeItem':'item']">{{tag.text}}</view>
                            </block>
                        </view>
                    </view>
                    <view class='cell'></view>
                </block>
            </view>
        </block>


        <view style="width:750rpx;height:300rpx"></view>
        <view v-if="currentType!='客源'" class='createTag' @tap="toCreatetag">
            <view>+</view>
            <view>新建标签组</view>
        </view>
    </view>
</template>

<script>
import {createNamespacedHelpers} from 'vuex';
const {mapState,mapMutations} = createNamespacedHelpers('source');
export default {
    name:'tag',
    data(){
        return{
            currentType:''
        }
    },
    onLoad(options){
        if(options&&options.type=="客源"){
            this.currentType = options.type
        }
    },
    mounted(){

    },
    computed:{
        ...mapState({
            enterpriseTag:state=>state.enterpriseTag,
            personalTag:state=>state.personalTag
        })
    },
    watch:{

    },
    methods:{
        ...mapMutations(['updateTagList','setCurrentTags']),
        //选择标签
        selectTag(text,title,tag){
            let curList = text=='企业标签'?this.enterpriseTag:this.personalTag;
            curList.forEach(ele=>{
                if(ele.title == title){
                    ele.list.forEach(ele=>{
                        if(ele.text==tag.text){
                            ele.status = !ele.status
                        }
                    })
                }
            })
        },
        //增加标签
        toCreatetag(){
            uni.navigateTo({
                url: '../../../subpackSource/pages/source/addTag?type=新建标签组',
            })
        },
        //去编辑标签页面
        toEdit(item,text){
            if(this.currentType == '客源'){
                return;
            }
            this.setCurrentTags(item)
            uni.navigateTo({
                url: `../../../subpackSource/pages/source/addTag?type=标签组&edit=${text}`,
            })
        }
    },
    onUnload(){
        //更新标签
        this.updateTagList({enterpriseTag:this.enterpriseTag,personalTag:this.personalTag})

        //判断是否有用于搜索的选中标签
        if(this.currentType == '客源'){
            this.$bus.$emit('changeAuth')
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
.tag{
    .tagTitle{
        color: $titleColor;
        font-size: 26rpx;
        padding: 40rpx 30rpx 10rpx 30rpx;
    }
    .tagBox{
        background-color: white;

        .tagItem{
            padding: 30rpx 10rpx 0rpx 40rpx;
            .itemTitle{
                font-size: 30rpx;
            }
            .itemBox{
                display: flex;
                flex-wrap: wrap;
                .item{
                    background-color: #ededed;
                    color: rgb(100, 98, 98);
                    padding: 8rpx 20rpx;
                    border-radius: 8rpx;
                    margin-right: 20rpx;
                    margin-top: 20rpx;
                    font-size: 30rpx;
                }
                .activeItem{
                    color: white;
                    background-color: #4c94db;
                    padding: 8rpx 20rpx;
                    border-radius: 8rpx;
                    margin-right: 20rpx;
                    margin-top: 20rpx;
                    font-size: 30rpx;
                }
            }
        }
        .cell{
            width: 1670rpx;
            height: 1rpx;
            background-color: white;
            margin: 40rpx 0rpx 40rpx 0rpx;
            transform: scale(0.4) translateY(-100%);
            transform-origin: left top;
        }
    }
    .tagBox{
        .tagItem + .cell:last-child{
            background-color: white;
        }
    }
    .createTag{
        position: fixed;
        bottom: 0rpx;
        left: 0rpx;
        width: 750rpx;
        height: 140rpx;
        background-color: white;
        display: flex;
        justify-content: center;
        align-items: center;
        font-size: 36rpx;
        color: rgb(85, 85, 85);
        view:nth-child(1){
            font-size: 50rpx;
            padding-right: 20rpx;
        }
        &:active{
            background-color: #fafafa;
        }
    }
}
</style>
