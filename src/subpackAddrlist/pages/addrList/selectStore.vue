<template>
    <!-- 选择门店 -->
    <view class="selectStore">
        <view style="width:750rpx;height:30rpx;"></view>
        <view @tap="optionsClick({org_id:storeList.org_id,org_name:storeList.org_name})" class="selectOpt">
            <view :class="[selectList.some(ele=>ele.org_id==storeList.org_id)?'activeLeft':'optLeft']"><view></view></view>
            <view class="optRight">
                <image style="width:50rpx;height:50rpx;" src='https://uss.img.lezhulife.com/xcxicon/department.png'></image>
                <view>{{storeList.org_name}}</view>
            </view>
        </view>
        <view id="cell"><view class="line"></view></view>
        <block v-for="(item,index) in storeList.children" :key="item.org_id">
            <view @tap="optionsClick(item)" class="selectOpt">
                <view :class="[selectList.some(ele=>ele.org_id==item.org_id)?'activeLeft':'optLeft']"><view></view></view>
                <view class="optRight">
                    <image style="width:50rpx;height:50rpx;margin-left:30rpx;" src='https://uss.img.lezhulife.com/xcxicon/department.png'></image>
                    <view>{{item.org_name}}</view>
                </view>
            </view>
            <view id="cell" v-if="lastOpt(index,item)"><view class="line"></view></view>
            <block v-for="(son) in item.children" :key="son.org_id">
                <view @tap="optionsClick(son)" class="selectOpt">
                    <view :class="[selectList.some(ele=>ele.org_id==son.org_id)?'activeLeft':'optLeft']"><view></view></view>
                    <view class="optRight">
                        <image style="width:50rpx;height:50rpx;margin-left:60rpx;" src='https://uss.img.lezhulife.com/xcxicon/department.png'></image>
                        <view>{{son.org_name}}</view>
                    </view>
                </view>
                <view id="cell" v-if="lastOpt(index,son)"><view class="line"></view></view>
            </block>
        </block>
        <view id="ppp" style="width:750rpx;height:160rpx"></view>
        <view @tap="confirmBtn" v-show="isShowButton" class='confirmBtn'>确定</view>
    </view>
</template>

<script>
import {mapState,createNamespacedHelpers} from 'vuex';
const {mapMutations:addrMuations,mapState:addrState} = createNamespacedHelpers('addrList');
export default {
    name:'selectStore',
    data(){
        return{
           storeList:[],//所有子部门门
           topList:[],//顶层部门
           selectList:[],//被选中的项目
           isShowButton:false,
           lastTemp:[{org_id:-1}],//存放最后一个选项，用于去除下划线
        }
    },
    mounted(){
        this.getAllorganizationList()
    },
    computed:{
        ...mapState({
            currentOrganization:state=>state.currentOrganization
        }),
        ...addrState({
            selectStoreList(state){
                this.selectList = state.selectStoreList.map(ele=>{
                    return {org_id:ele.org_id,org_name:ele.org_name}
                })
                return state.selectStoreList
            }
        })
    },
    watch:{
        currentOrganization(newValue,oldValue){
            // this.getAllorganizationList()
        },
        //监听数组长度改变动态显示确定按钮
        'selectList.length'(newValue,oldValue){
            if(newValue!=0){
                this.isShowButton = true
            }else{
                this.isShowButton = false
            }
        },
        //监听storeList有值之后去初始化最后一个数组
        'storeList.length'(newValue,oldValue){
            let recursion = function(arr){
                if(arr && arr.children){
                    return recursion(arr.children)
                }else{
                    return arr[arr.length-1] || {}
                }
            }
            let temp = recursion(this.storeList);
            if(temp.children.length>0){
                this.lastTemp = temp.children[temp.children.length-1]
            }else{
                this.lastTemp = temp;
            }

        }
    },
    methods:{
        ...addrMuations(['setSelectStoreList']),
        //获取所有部门列表
        async getAllorganizationList(){
            try {
                let res = await this.request({
                    url:'organization/list',
                    param:{
                        staff_id:this.currentOrganization.staff_id
                    }
                })
                if(res[1].data.state==200){
                    this.storeList = res[1].data.body
                    this.storeList.status = false;
                    this.storeList.children = this.storeList.children.map(ele=>{
                        ele.status = false
                        return ele
                    })
                }else{
                    let title = res[1].data.state==199?'获取失败':res[1].data.msg
                    uni.showToast({
                        title
                    })
                }
            } catch (error) {

            }
        },
        //部门选项点击事件
        optionsClick(item){
            let temp = {org_id:item.org_id,org_name:item.org_name};
            let index = -1;
            this.selectList.forEach((ele,i)=>{
                if(ele.org_id==item.org_id){
                    index = i
                }
            })
            if(index==-1){
                this.selectList.push(temp)
            }else{
                this.selectList.splice(index,1)
            }
        },
        //确定按钮
        confirmBtn(){
            this.setSelectStoreList(this.selectList)
            uni.navigateBack({
                delta:-1
            })
        },
        //最后一个子元素
        lastOpt(index,item){
            if(item.org_id==this.lastTemp.org_id){
                return false
            }else{
                return true
            }
        }
    },

}
</script>

<style lang='scss' scoped>
$pageBgColor:#f7f7f7;
$borderColor:#e9e9e9;
$placerColor:#cccccc;
$titleColor:#888888;
$greenColor:#00a680;
.selectStore{
    .selectOpt{
        background-color: white;
        display: flex;
        height: 100rpx;
        align-items: center;
        position: relative;
        .optLeft{
            width: 36rpx;
            height: 36rpx;
            border-radius: 18rpx;
            border: solid 2rpx rgb(163, 163, 163);
            margin: 0rpx 30rpx;
        }
        .activeLeft{
            background-color: #66b2ff;
            width: 36rpx;
            height: 36rpx;
            border-radius: 18rpx;
            border: solid 2rpx#66b2ff;
            margin: 0rpx 30rpx;
            view{
                width: 30rpx;
                height: 10rpx;
                border:solid 1rpx white;
                border-top: transparent;
                border-right: transparent;
                transform: rotate(-40deg);
                margin-top: 6rpx;
                margin-left: 4rpx;
            }
        }
        .optRight{
            padding-left: 14rpx;
            flex: 1;
            height: 100%;
            display: flex;
            align-items: center;
            // border-bottom: solid 2rpx $borderColor;
            view{
                padding-left: 20rpx;
                font-size: 26rpx;
            }
        }
        &:active{
            background-color: #fafafa;
        }
    }
    .confirmBtn{
        position: fixed;
        left: 0rpx;
        bottom: 0rpx;
        width: 750rpx;
        height: 100rpx;
        text-align: center;
        line-height: 100rpx;
        color: $greenColor;
        background-color: white;
        font-size: 34rpx;
        border-top: solid 2rpx#e9e9e9;
        &:active{
            background-color: #fafafa;
        }
    }
}

</style>
