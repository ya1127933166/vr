<template>
    <view class="selectAuth">
        <PageHerader :isArrow="currentType!='选择身份'" @backCallBack="backClick"></PageHerader>
        <view :style="'width:100%;height:'+customeheaderInfo.headerHeight"></view>
        <view class="top">
            <view>{{currentType=='选择身份'?'找到你的企业/单位':'切换身份'}}</view>
            <view>选择一个{{currentType!='选择身份'?'进':'加'}}入</view>
        </view>
        <view class="bottom">
            <block v-for="(item,index) in selectAuthList" :key="item.staff_id">
                <view @tap="changeAuth(item,index)" class="bottomItem">
                    <view :style="'color:'+((item.expires=='Y'&&item.expire_desc!='')?'#8f8f8f':'')+';'" class="itemLeft">{{item.org_name}}</view>
                    <view class="itemRight">
                        <view class="yellowText" v-if="item.expire_desc!=''">{{item.expire_desc}}</view>
                        <view class="redText" v-if="item.expires=='Y'">{{item.expire_desc}}</view>
                        <view v-else-if="item.selected=='Y'&&index==isOnce" class="cuIcon-check"></view>
                    </view>
                </view>
            </block>
        </view>
        <view class="cell" style="width:100%;height:134rpx;"></view>
        <view @tap="createNewidentity" class="create">
            <view class="cuIcon-add"></view>
            <view class="add">创建新身份</view>
        </view>
    </view>
</template>

<script>
import {mapState,mapMutations,mapActions} from 'vuex';
import Modal2 from '../../../components/comm/modal2/modal2.vue';
import PageHerader from '../../../components/comm/pageHeader/pageHeader.vue';
export default {
    name:'selectAuth',
    data(){
        return{
            list:['满房地产','天投房屋租赁有限公司','张津津','牛犇犇','石磊磊','口品品','土垚垚'],
            currentType:'选择身份',
            isShowCreate:false,
            showModal2:true
        }
    },
    onLoad(options){
        if(options){
            this.currentType = options.type
        }
    },
    onShow(){
        // console.log(this.selectAuthList,'auth');
        // console.log(this.selectAuthList);
        // if(!this.selectAuthList.every(ele=>ele.selected=='N')){
        //     this.getnewewregistration();
        // }
        this.$store.state.mineNeedRefresh = true
    },
    computed:{
        ...mapState({
            selectAuthList(state){
                //设置有效身份个数，是否可以继续创建
                this.isShowCreate = (state.selectAuthList.filter((ele)=>ele.expires=='N')).length>3?false:true
                return state.selectAuthList
            },
            customeheaderInfo:state=>state.customeheaderInfo
        }),
        //确定是否是第一个被选中的
        isOnce(){
            let index = -1;
            for(let i=0;i<this.selectAuthList.length;i++){
                if(this.selectAuthList[i].selected=='Y'){
                    index = i;
                    break;
                }
            }
            return index
        }
    },
    methods:{
        ...mapMutations(['setCurrentOrganization']),
        ...mapActions(['getnewewregistration']),
        //去创建身份
        createNewidentity(){
            uni.navigateTo({
                url: '../../../subpackComm/pages/login/login?type=创建',
            })
        },
        //选择身份回调
        async changeAuth(item,index){
            uni.showLoading({
                title:'加载中...'
            })
            // console.log(item.staff_id,'9999999999999999',index,this.isOnce);
            if(item.expires=='Y'&&item.expire_desc!=''){
                let res = await this.renewModal()
                if(res==true){

                }else{
                    uni.navigateBack({
                        delta:3
                    })
                }
                return
            }
            // console.log(this.selectAuthList[this.isOnce],item,'对比');
            this.setCurrentOrganization(item);
            if(this.isOnce==-1||item.staff_id!=this.selectAuthList[this.isOnce].staff_id){
                // console.log('进来了');
                try {
                    let res = await this.request({
                        url:'registration/selecting',
                        type:'get',
                        param:{
                           staff_id:item.staff_id
                        }
                    })
                    if(res[1].data.state!=200){
                         uni.showToast({
                            title:this.$throwStatusCode(res[1].data.state,'创建用户'),
                            icon:'none'
                        })
                    }else{
                        this.getnewewregistration(()=>{
                            this.$bus.$emit('changeAuth','bababab')
                        });
                        uni.navigateBack({
                            delta:3
                        })
                    }
                } catch (error) {
                    uni.showToast({
                        title:'网络异常，请稍后重试',
                        iocn:'none'
                    })
                }
            }else{
                uni.navigateBack({
                    delta:3
                })
            }
        },
        //续费模态框
        renewModal(){
            return new Promise((reslove,reject)=>{
                uni.showModal({
                    cancelText:'返回',
                    title:'账户已到期',
                    confirmText:'立即续费',
                    confirmColor:'#22b090',
                    content:'您的账户已经到期，部分功能将收到限制，续费后为您解除限制，是否立即续费？',
                    success: function(res) {
                        if(res.confirm==true){
                            reslove(true)
                        }else{
                            reslove(false)
                        }
                    },
                    fail: function() {
                        reject(false)
                    }
                })
            })

        },
        //回退
        backClick(){
            uni.navigateBack({
                delta:-1
            })
        }
    },
    components:{
        PageHerader,
        Modal2
    }
}
</script>

<style lang='scss' scoped>
.selectAuth{
    min-height: 100vh;
    background-color: white;
    padding: 40rpx;
    box-sizing: border-box;
    .top{
        font-size: 40rpx;
    }
    .bottom{
        padding-top: 100rpx;
        .bottomItem{
            width: 100%;
            // height: 130rpx;
            border: solid 1rpx #f0eeee;
            display: flex;
            justify-content: space-between;
            align-items: center;
            margin-bottom: 20rpx;
            font-size: 34rpx;
            box-sizing: border-box;
            padding-left: 50rpx;
            padding-top: 40rpx;
            padding-bottom: 40rpx;
            box-sizing: border-box;
            border-radius: 6rpx;
            .itemLeft{
                font-weight: 600;
                overflow: hidden;
                text-overflow: ellipsis;
                white-space: nowrap;
            }
            .itemRight{
                margin-right: 30rpx;
                .yellowText,.redText{
                    font-size: 30rpx;
                    padding: 4rpx 12rpx;
                    min-width: 200rpx;
                    margin-left: 30rpx;
                }
                .yellowText{
                    color: #e2b446;
                    background-color: #feefdf;
                }
                .redText{
                    color: #b85450;
                    background-color: #fbe2e0;
                }
                .cuIcon-check{
                    font-size: 50rpx;
                    color: #08a884;
                }
            }
        }
    }
    .create{
        background-color: white;
        height: 130rpx;
        width: 100%;
        border-top: solid 1rpx #f0eeee;
        position: fixed;
        left: 0;
        bottom: 0;
        font-size: 34rpx;
        display: flex;
        justify-content: center;
        align-items: center;
        .cuIcon-add{
            font-size: 50rpx;
            margin-right: 10rpx;
        }
    }
}
</style>
