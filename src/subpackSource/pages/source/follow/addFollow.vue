<template>
    <!-- 新增跟进 -->
    <view class='addFollow'>
        <view style="width:750rpx;height:2rpx;"></view>
        <view class='infoBox'>
            <view @tap="toSelectUser" class='normal' v-if="type =='customer'">
                <view class='left'>客户名称</view>
                <input disabled v-model="currentFollowUser.customer_name" class='center input' style="color:black;width:80%;font-size:30rpx;" placeholder-style="color:#cccccc;font-size:30rpx;" placeholder="请选择客户" />
                <image v-if="currentType=='No'" style="width:50rpx;height:50rpx;" src="https://uss.img.lezhulife.com/xcxicon/home-addrBook.png"></image>
            </view>
             <view class='normal' v-else-if="type=='sale'||type=='rent'">
                <view class='left'>房源</view>
                <view  class='center' >
                    <view style="color:#000">
                        {{total.type[0]}} {{total.type[1]}} {{total.type[2]}}
                    </view>
                      <view>
                        {{total.type[3]}} {{total.type[4]}} {{total.type[5]}}
                    </view>

                </view>

            </view>
        </view>
        <view class='title'></view>
        <view class='infoBox'>
            <view class='normal'>
                <view class='left'>跟进方式</view>
                <view class='pickBox'>
                    <picker mode="selector" :range="followMode" @change="bindPickerChange($event,'跟进方式')">
                        <view class='pickItem'>
                            <view class="picker" :style="'color:'+(info.modeText=='请选择'?'#cccccc':'black')+';font-size:30rpx;'">{{info.modeText}}</view>
                        </view>
                    </picker>
                </view>
                <view class='cuIcon-right'></view>
            </view>
            <view class='normal'>
                <view class='left'>跟进业务</view>
                <view class='pickBox'>
                    <picker mode="selector" :range="followBusiness" @change="bindPickerChange($event,'跟进业务')">
                        <view class='pickItem'>
                            <view class="picker" :style="'color:'+(info.businessText=='请选择'?'#cccccc':'black')+';font-size:30rpx;'">{{info.businessText}}</view>
                        </view>
                    </picker>
                </view>
                <view class='cuIcon-right'></view>
            </view>
            <view @tap="areaFocus=true" class='normal note'>
                <view class='left'>跟进内容</view>
                <!-- <view class='center'>请输入跟进内容</view> -->
            </view>
            <textarea @blur="areaFocus=false" :focus="areaFocus" v-model="info.describe" placeholder="请输入跟进内容" class='noteArea'></textarea>
        </view>

        <view class='title'></view>
        <view class='infoBox'>
            <view class='normal local' @tap="selectLocation">
                <view class='left'>
                    <view>位置</view>
                </view>
                <view class="center" v-if="info&&info.localName&&info.localAddr">
                    <view>{{info.localName}}</view>
                    <view>{{info.localAddr}}</view>
                </view>
                <view class="center" style="color:#ccc;margin-left:100rpx" v-else>可选</view>
                <view class='cuIcon-right'></view>
            </view>
            <view class='normal' @tap="uploadPhoto">
                <view class='left'>照片</view>
                <view :style="'color:'+(info.imgLength>0?'#333333':'#cccccc')" class="center">{{info.imgLength>0?`共${info.imgLength}张`:'请上传'}}</view>
                <view class='cuIcon-right'></view>
            </view>
        </view>

        <view @tap="saveBtn" :style="'background-color:'+(isChange?'#00a680':'#cccccc')+';'" class='saveBtn'>保存</view>
        <getLocation :wait-response.sync="waitLocation" @location="setLocation" />
    </view>
</template>

<script>
import {createNamespacedHelpers,mapState,mapMutations} from 'vuex';
import getLocation from '../../../../components/get-location';
import upyLoad from '../../../../function/upload-upyun.js';
const {mapState:sourceState,mapMutations:sourceMutation} = createNamespacedHelpers('source');
let locationCallback = null;
export default {
    name:'addFollow',
    components: {
        getLocation,
    },
    data(){
        return{
            followMode:['带看','陪看','邀约','电话拜访','网络拜访','采集'],
            followBusiness:['销售机会','商务谈判','合同','关系维护','房源维护'],
            info:{
                modeText:'请选择',
                businessText:'请选择',
                describe:'',
                localName:'',//当前位置名称
                localAddr:'',//当前详细地址
                imgLength:-1
            },
            initInfo:'',
            isChange:false,
            areaFocus:false,
            currentType:'',
            lat:'',//当前经度
            lng:'',//当前维度
            type:'',
            total:'',
            waitLocation: false,
            locationInitSuccess: false,

        }
    },
    onLoad(options){
        this.initInfo = JSON.stringify(this.info)
        // console.log('dd',this.initInfo)
        //更进类型
        this.type = options.type1
        if(this.type =='sale'){
            this.total = JSON.parse(options.item)
        }else if(this.type =='rent'){
             this.total = JSON.parse(options.item)
        }
       else if(this.type=='customer'){
            this.currentType = options.type
        }
    },
    onShow(){
    },
    computed:{
        ...sourceState({
            currentFollowUser: state => state.currentFollowUser
        }),
        ...mapState({
            upTempImageList: function(state){
                this.info.imgLength = state.upTempImageList[3][0]
                return state.upTempImageList
            }
        }),
        watchInfo(){
            return JSON.stringify(this.info)
        }
    },
    watch:{
        watchInfo(newValue,oldValue){
            if(newValue!=this.initInfo){
                this.isChange = true
            }else{
                this.isChange = false
            }
        }
    },
    methods:{
         ...sourceMutation(['setCurerntFollowUser']),
         ...mapMutations(['setupTempImageList','setshowImageList']),
        setLocation(res) {
            this.$$globalData.locationData = res;
            if (typeof locationCallback === 'function') {
                locationCallback(res);
            }
        },
        //选择客户
        toSelectUser(){
            uni.navigateTo({
                url: '../../../../subpackSource/pages/source/selectCustomer',
            })
        },
        //下拉菜单选择事件
        bindPickerChange(e,text){
            if(text=='跟进方式'){
                this.info.modeText = this.followMode[e.detail.value]
            }else{
                this.info.businessText = this.followBusiness[e.detail.value]
            }
        },
        //选择地理位置
        selectLocation(){
            const that = this;
            // this.waitLocation = true;
            locationCallback = (res) => {
                that.locationInitSuccess = true;
                // console.log('in', res)
            };
            if(that.lat==''&&that.lng==''){
                uni.getLocation({
                    type: 'wgs84',
                    success: function (res) {
                        // console.log(res)
                        uni.chooseLocation({
                            success: function (res) {
                                // console.log(res)
                                that.lat = res.latitude;
                                that.lng = res.longitude;
                                that.info.localName = res.name;
                                that.info.localAddr = res.address;
                            }
                        });
                    },
                    fail:function(res){
                        console.warn('获取地理位置失败', res)
                        that.waitLocation = !that.locationInitSuccess
                    },
                    complete:function(res){
                        // console.log(res)
                    }
                });
            }else{
                uni.chooseLocation({
                    latitude:that.lat,
                    longitude:that.lng,
                    success: function (res) {
                        that.lat = res.latitude;
                        that.lng = res.longitude;
                        that.info.localName = res.name;
                        that.info.localAddr = res.address;
                    },
                    fail: () => {
                        that.waitLocation = !that.locationInitSuccess
                    }
                });
            }
        },
        //上传图片
        uploadPhoto(){
            if(this.type == 'customer'){
                if(this.currentFollowUser.customer_name==''){
                uni.showToast({
                    title:'请选择客户',
                    icon:'none'
                })
                return
             }
            }
            // let temp =[this.total.type[0],this.total.type[1],this.total.type[2]]
            let  temp = [this.currentFollowUser.customer_name,'','']
            wx.navigateTo({
                url: '../../../../pages/upload/upload?type=跟进记录&numType=5&temp='+JSON.stringify(temp)
            })
        },
        //保存按钮
        saveBtn(){
            if(this.type=='customer'){
                this.info.id = this.currentFollowUser.customer_id
                if(this.currentFollowUser.customer_name==''){
                    uni.showToast({
                        title:'请选择客户',
                        icon:'none'
                    })
                return
            }
            }
            if(!this.isChange){
                return
            }
            let res = this.checkForm();
            if(res!=true){
                return
            }
            this.addFollow();
        },
        //新增跟进记录
        async addFollow(){
            let temp = this.upTempImageList[0]
            // console.log('照片',temp)
            try {
                let res = await this.request({
                    url:'followup/add',
                    type:'post',
                    param:{
                        // customer_id:this.currentFollowUser.customer_id,
                        relationId:this.total.id?this.total.id:this.currentFollowUser.customer_id,
                        type:this.type,
                        content:this.info.describe,
                        mode:this.info.modeText,
                        business:this.info.businessText,
                        local_name:this.info.localName,
                        address:this.info.localAddr,
                        lat:this.lat,
                        lng:this.lng,
                        pics:temp.join()
                    }
                })

                if(res[1].data.state==200){
                    uni.showToast({
                        title:'新增成功'
                    })
                    this.$bus.$emit('updateUserDetail')
                    this.$bus.$emit('updateFollowList')
                    setTimeout(()=>{
                        uni.navigateBack({
                            delta:-1
                        })
                        //清除后端需要的图片地址
                        this.setupTempImageList([[],[],[],[0]])
                        //清除前端展示的图片地址
                        this.setshowImageList([[],[],[],[0]])
                    },1000)

                }else{
                    uni.showToast({
                        title:this.$throwStatusCode(res[1].data.state,'新增跟进'),
                        icon:'none'
                    })
                }
            } catch (error) {
                console.warn(error);
            }
        },
        //表单校验
        checkForm(){
            const that = this;
            let obj = this.$checkForm(this.info,{
                modeText:{
                    alias:'跟进方式',
                    type:'string',
                    required:true,
                    callback(value){
                        if(value!='请选择'){
                            return true
                        }
                        return false
                    }
                },
                businessText:{
                    alias:'跟进业务',
                    type:'string',
                    required:true,
                    callback(value){
                        if(value!='请选择'){
                            return true
                        }
                        return false
                    }
                },
                describe:{
                    alias:'跟进内容',
                    type:'string',
                    required:true
                }
            })
            const length = Object.keys(obj).length;
            if(length === 0){
                return true;
            }

            switch (obj.type) {
                case 'type':
                    uni.showToast({
                        title: `${obj.alias}的类型定义错误`,
                        icon:'none'
                    })
                    break;
                case 'required':
                    uni.showToast({
                        title: `请输入${obj.alias}`,
                        icon:'none'
                    })
                    break;
                case 'rule':
                    let title = '';
                    if(obj.alias == '跟进方式'||obj.alias == '跟进业务'){
                        title = `请选择${obj.alias}`
                    }else{
                        title = `${obj.alias}输入不符合规范`
                    }
                    uni.showToast({
                        title,
                        icon:'none'
                    })
                    break;
                default:
                    break;
            }
            return false;
        }
    },
    onUnload(){
        this.setCurerntFollowUser({customer_id:'',customer_name:''})
        this.setupTempImageList([[],[],[],[0]])
        this.setshowImageList([[],[],[],[0]])
    }
}
</script>

<style lang='scss' scoped>
$pageBgColor:#f7f7f7;
$borderColor:#e9e9e9;
$placerColor:#cccccc;
$titleColor:#888888;
$greenColor:#00a680;
.addFollow{
    .title{
        font-size: 26rpx;
        color: #6d6c6c;
        padding: 20rpx 0rpx 16rpx 20px;
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
            border-bottom: solid calc(1px / 2.5) #d9d9d9;
            position: relative;
            font-size: 30rpx;
            position: relative;
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
                width: 750rpx;
                height: 100%;
                position: absolute;
                left: 0;
                top: 0;
                .pickItem{
                    height: 100rpx;
                    width: 750rpx;
                    display: flex;
                    align-items: center;
                    .picker{
                        box-sizing: border-box;
                        padding-right: 20rpx;
                        color: $placerColor;
                        text-indent: 300rpx;
                    }
                }
            }
            .left{
                width: 260rpx;
                display: flex;
                align-items: center;
                view:nth-child(2){
                    margin-left: 20rpx;
                }
            }
            .center{
                flex-grow: 1;
                color: #cccccc;
                font-size: 26rpx;
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
            .input{
                position: absolute;
                // background-color: $greenColor;
                width: 100%;
                height: 100%;
                left: 0;
                top: 0;
                padding-left: 300rpx;

            }
            &:active,&:active + .noteArea{
                background-color: #fafafa;
            }
        }
        .normal:last-child{
            border: none;
        }
        .local{
            height: auto;
            padding: 30rpx 40rpx;
            box-sizing: content-box;
            align-items: flex-start;
            .center{
                color: #333333;
                font-size: 30rpx;
                width: 600rpx;
                // background-color: red;

                view{
                    width: 480rpx;
                    overflow: hidden;
                    text-overflow: ellipsis;
                    white-space: nowrap;
                }
            }
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
    .buttomBox{
        padding-top: 60rpx;
        width: 680rpx;
        margin: 0 auto;
        display: flex;
        justify-content: space-between;
        view{
            width: 300rpx;
            height: 80rpx;
            text-align: center;
            line-height: 80rpx;
            border-radius: 10rpx;
            font-size: 28rpx;
            font-weight: 600;
        }
        view:nth-child(1){
            background-color: $greenColor;
            color: white;
        }
        view:nth-child(2){
            border: solid 1rpx $greenColor;
            color: $greenColor;
        }
    }
    .saveBtn{
        width: 690rpx;
        height: 100rpx;
        color: white;
        font-size: 34rpx;
        text-align: center;
        background-color: #00a680;
        margin: 60rpx auto;
        line-height: 100rpx;
        border-radius: 10rpx;
    }
}

</style>
