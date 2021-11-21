<template>
    <!-- 添加客户 -->
    <view class='addCost'>
        <!-- <view class='title'></view> -->
        <view class='infoBox'>
            <view class='normal'>
                <view class='left'>客户名称</view>
                <input disabled @tap="clickItem('name')" v-model="info.name" v-if="focusObj.name" class='center input' placeholder-style="color:#cccccc" placeholder-class="center" placeholder="请输入" />
                <input v-else :focus="true" v-model="info.name" class='center input' placeholder-style="color:#cccccc" placeholder-class="center" placeholder="请输入" />
            </view>
            <view id="cell"><view class="line"></view></view>
            <view class='normal'>
                <view class='left'>性别</view>
                <view class='pickBox'>
                    <picker mode="selector" :range="info.sex.range" @change="bindPickerChange">
                        <view class='pickItem'>
                            <view :style="'color:'+(info.sex.val=='请选择'?'#cccccc':'black')" class="picker">{{info.sex.val}}</view>
                        </view>
                    </picker>
                </view>
                <view class='cuIcon-right'></view>
            </view>
            <view id="cell"><view class="line"></view></view>
            <view class='normal'>
                <view class='left'>联系电话</view>
                <input disabled @tap="clickItem('phone')"  v-model="info.phone" class='center input' v-if="focusObj.phone" placeholder-style="color:#cccccc" placeholder-class="center" placeholder="请输入" />
                <input type="number" v-else :focus="true"  v-model="info.phone" class='center input' placeholder-style="color:#cccccc" placeholder-class="center" placeholder="请输入" />
            </view>
            <view id="cell"><view class="line"></view></view>
            <view class='normal'>
                <view class='left'>微信号</view>
                <input disabled @tap="clickItem('weixin')" v-model="info.weixin" class='center input' v-if="focusObj.weixin" placeholder-style="color:#cccccc" placeholder-class="center" placeholder="可选" />
                <input v-else :focus="true" v-model="info.weixin" class='center input' placeholder-style="color:#cccccc" placeholder-class="center" placeholder="可选" />
            </view>

        </view>
        <view class='title'></view>
        <view class='infoBox'>
            <view @tap="toAddtag" class='normal tagItem' style="height:auto;">
                <view class='left'>
                    <view class='cuIcon-tag' style="color:#5bacff;transform-origin:50% 50%; transform: rotate(180deg);font-size:50rpx;"></view>
                    <view style="width:100rpx">标签</view>
                </view>
                <view class='center'>
                    <view v-if="selectTag&&selectTag.length==0" style="margin:10rpx 0rpx 0rpx 0rpx;color:#cccccc">{{info.tag}}</view>
                    <view v-else class="tagBox">
                        <block v-for="item in selectTag" :key="item.text">
                            <view class="tag">{{item.text}}</view>
                        </block>
                    </view>
                </view>
                <view class='cuIcon-right' style="margin:10rpx 0rpx 0rpx 0rpx;"></view>
            </view>
        </view>

        <view class='title'></view>
        <view class='infoBox'>
            <view @tap="clickArea" class='normal note'>
                <view class='left'>备注/描述</view>
                <!-- <view class='center'>添加收款备注</view> -->
            </view>
            <textarea v-model="info.describe" @blur="textAreaBlur" :focus="isFoc" class="noteArea" name="" id="" cols="30" rows="10" placeholder="添加客户备注" placeholder-style="color:#cccccc;font-size:30rpx"></textarea>
        </view>
        <view v-if="currentType!='添加客户'" @tap="saveBtn('保存')" :style="'background-color:'+(isChange?'#00a680':'#cccccc')+';'" class='saveBtn'>保存</view>
        <view v-if="currentType=='添加客户'" class="btnBox">
            <view @tap="saveBtn('添加')" :style="'background-color:'+(isChange?'#00a680':'#cccccc')+';'" class="btnLeft">保存</view>
            <view @tap="saveBtn('继续')" :style="'border:solid 1rpx '+(isChange?'#00a680':'#cccccc')+';color:'+(isChange?'#00a680':'#cccccc')+';'" class="btnRight">保存，继续添加</view>
        </view>
        <view @tap="removeBtn" v-if="currentType!='添加客户'" class='removeBtn'>删除</view>
        <view style="width:750rpx;height:40rpx"></view>
    </view>
</template>

<script>
import {createNamespacedHelpers,mapState,mapActions} from 'vuex';
const {mapState:sourceState,mapMutations:sourceMutations,mapGetters:sourceGetter} = createNamespacedHelpers('source');

export default {
    name:'addCost',
    data(){
        return{
            info:{//页面初始数据
                name:'',
                sex:{val:'请选择',range:['男','女']},
                phone:'',
                weixin:'',
                tag:'请选择',
                describe:''
            },
            initInfo:'',//监听数据
            isChange:false,//初始数据是否改动
            currentType:'',//当前页面模式
            focusObj:{//焦点对象
                name:true,
                sex:true,
                phone:true,
                weixin:true
            },
            isFoc:false
        }
    },
    onLoad(options){
        // console.log(options)
		uni.hideLoading()
        //测试用
        this.getnewewregistration()

        this.currentType = options.type;
        uni.setNavigationBarTitle({
            title: options.type,
        })

        if(options&&options.type=='编辑客户'){
            const {customer_name,gender,phone_no,wechat_no,tags,remark} = this.userDetail;
            this.info.name = customer_name;
            this.info.sex.val = gender==1?'男':'女';
            this.info.phone = phone_no;
            this.info.weixin = wechat_no;
            this.info.describe = remark
            this.info.tag = tags
            // console.log(tags)
            if (tags) {
                if (typeof tags === 'string') {
                    this.setCurrentTags((tags.split(',')).map(item => ({
                        status: true,
                        text: item
                    })))
                } else if (typeof tags === 'object') {
                    this.setCurrentTags(tags.map(item => ({
                        status: true,
                        text: item
                    })))
                }
            }
        }
    },
    onShow(){
        // console.log('this.selectTag',this.selectTag)
    },
    mounted(){
        this.initInfo = JSON.stringify(this.info);
        // console.log(this.initInfo)
    },
    computed:{
        ...mapState({
            currentOrganization: state => state.currentOrganization,
        }),
        ...sourceGetter(['selectTag']),
        ...sourceState({
            count: state => state.enterpriseTag,
            userDetail: state => state.userDetail
        }),
        watchInfo(){
            return JSON.stringify(this.info)
        }
    },
    watch:{
        watchInfo(newValue,oldValue){
            if (this.initInfo) {
                this.isChange = newValue != this.initInfo
                // console.log('isChange', newValue != this.initInfo, newValue, this.initInfo)
            }
        },
        selectTag(newValue,oldValue) {
            // console.log('new selectTag', newValue)
            this.info.tag = newValue.map(tagItem => tagItem.text)
        }
    },
    methods:{
        //测试用
        ...mapActions(['getnewewregistration']),

        //更新修改信息
        ...sourceMutations(['setCurrentTags','setUserDetail','resetTags']),
        //文本域焦点事件
        clickArea(){
            setTimeout(()=>{
                this.isFoc = true
            },150)
        },
        textAreaBlur(){
            this.isFoc = false
        },
        //选项点击后自动触发焦点
        clickItem(text){
            for (const key in this.focusObj) {
                this.focusObj[key] = true;
                if(key==text){
                    this.focusObj[key] = false
                }
            }
        },
        //下拉菜单选择事件
        bindPickerChange(e){
            this.info.sex.val = this.info.sex.range[e.detail.value]
        },
        //跳转至新增标签
        toAddtag(){
            uni.navigateTo({
                url: '../../../subpackSource/pages/source/tag',
            })
        },
        //保存按钮
        async saveBtn(text){
            let res = await this.checkRule();
            // console.log('res',res);
            //   uni.showModal({
            //             title:'3',
            //             content:`${res}`
            //         })


            // console.log(this.info,this.currentOrganization);
            if(!res){
                return;
            }
            // console.log(this.selectTag.map(ele=>{
            //     return ele.text
            // }).join(),'---');
            let {name,phone,sex,weixin,describe} = this.info;
            //判断是否有数据更改，无数据改动直接返回
            if(this.currentType==='编辑客户'){
                // const {customer_name,gender,phone_no,wechat_no,tags,remark} = this.userDetail;
                if(!this.isChange){
                    //  uni.navigateBack({
                    //     delta:-1
                    // })
                    return;
                }
            }
            let param = {
                // staff_id:this.currentOrganization.staff_id,
                name:name,
                phone_no:phone,
                gender:sex.val==='男'?1:2,
                wechat_no:weixin,
                tag:this.selectTag.map(ele=>{
                    return ele.text
                }).join(),
                remark:describe
            }
            //添加或者编辑客户
            let url = '';
            if(this.currentType === '编辑客户'){
                url = 'customer/update';
                param.customer_id = this.userDetail.customer_id
            }else{
                url = 'customer/add';
            }
            try {
                let res = await this.request({
                    url,
                    type:'post',
                    param
                })
                // console.log(res);
                if(res[1].data.state=='200'){
                    uni.showToast({
                        title:this.currentType == '编辑客户'?'修改成功':'添加成功'
                    })
                    this.$store.state.mineNeedRefresh = true;
                    if(text=='保存'||text=='添加'){
                        setTimeout(()=>{
                            this.$bus.$emit('updateUserDetail', 'addCustomerEdit');
                            uni.navigateBack({
                                delta:-1
                            })
                        },600)
                    }
                    if(text == '继续'){
                        this.info={//页面初始数据
                            name:'',
                            sex:{val:'请选择',range:['男','女']},
                            phone:'',
                            weixin:'',
                            tag:'请选择',
                            describe:''
                        }
                    }
                    // let temp = this.userDetail;
                    // temp.isChange = true
                    // this.setUserDetail(temp)
                    //添加后更新首页列表
                    this.$bus.$emit('changeAuth')
                }else{
                    uni.showToast({
                        title:this.$throwStatusCode(res[1].data.state,'添加或修改成员'),
                        icon:'none'
                    })
                }
            } catch (error) {

            }
        },
        //删除客户
        async removeBtn(){
            // console.log(this.userDetail, this.setUserDetail);
            const that = this;
            uni.showModal({
                title: '提示',
                content:'确定删除该客户吗？',
                complete:async function(res) {
                    // console.log(res);
                    if(res.confirm){
                        uni.showLoading();
                        let res = await that.request({
                            url:'customer/delete',
                            type:'post',
                            param:{
                                customer_id:that.userDetail.customer_id
                            }
                        })
                        if(res[1].data.state=='200'){
                            that.setUserDetail({...that.userDetail, is_delete: true})
                            uni.hideLoading()
                            that.$store.state.mineNeedRefresh = true;
                            that.$utils.storeCurrentPage('other');
                            uni.showToast({
                                title: '删除成功',
                                icon: 'success',
                                duration: 3000,
                                success: () => {
                                    //删除后刷新列表
                                    // that.$bus.$emit('changeAuth')
                                    setTimeout(() => {
                                        uni.switchTab({
                                            url: '/pages/tabbar/mine',
                                            // complete: (e) => {console.log('uni.switchTab',e)}
                                        });
                                    }, 600)
                                }
                            })
                        }else{
                            uni.showToast({
                                title:that.$throwStatusCode(res[1].data.state,'删除客户'),
                                icon:'none'
                            })
                        }
                    }
                }
            })
        },
        //表单校验
        checkRule(){
            const that = this;
            if(!(/^1[3456789]{1}[0-9]{9}$/.test(this.info.phone))){
               uni.showToast({
                   title:'电话输入不规范',
                   icon:'none'
               })
                return false;
            }

            //表单校验
            let obj = this.$checkForm(this.info,{
                name:{
                    alias:'客户名称',
                    type:'string',
                    required:true,
                    // rule:/^(?:[\u4e00-\u9fa5·]{2,16})$/
                },
                'sex.val':{
                    alias:'性别',
                    type:'string',
                    required:true,
                    callback(value){
                        if(value!='请选择'){
                            return true;
                        }
                        return false;
                    }
                },
                phone:{
                    alias:'电话',
                    type:'string',
                    required:true,
                    rule:/^1[3456789]{1}[0-9]{9}$/,
                    // callback:(e,a,b)=>{console.log(e,a,b)
                    // uni.showModal({
                    //     title:'1',
                    //     content:`${e}`
                    // })
                    // return true
                    // }
                },
                weixin:{
                    alias:'微信',
                    type:'string',
                    // rule:/^[a-zA-Z][-_a-zA-Z0-9]{5,19}$/,
                    depend(){
                        if(that.info.weixin!=''&&that.info.weixin.length>1){
                            return true
                        }
                        return false
                    }
                },
            }, (e) => {console.log('check form call back',e)})

            const length = Object.keys(obj).length;
            if(length === 0){
                // console.log('return true!')
                //   uni.showModal({
                //         title:'2',
                //         content:'return true!'
                //     })
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
                    if(obj.alias=='性别'){
                        uni.showToast({
                            title: `请选择${obj.alias}`,
                            icon:'none'
                        })
                        break
                    }
                    uni.showToast({
                        title: `${obj.alias}输入不符合规范`,
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
        if (this.isChange) {
            this.resetTags();
            this.$bus.$emit('updateUserDetail', 'addCustomerEdit');
            // this.$store.state.currentOrganization = true
            // console.log('on add customer unload',this.$store.state.currentOrganization)
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
.addCost{
    .title{
        font-size: 26rpx;
        color: #6d6c6c;
        padding: 20rpx 0rpx 20rpx 20px;
    }
    .infoBox{
        background-color: white;
        box-sizing: border-box;
        .normal{
            display: flex;
            justify-content: space-between;
            align-items: center;
            height: 100rpx;
            padding: 0rpx 30rpx 0rpx 30rpx;
            // border-bottom: solid 1rpx #e6e6e6;
            position: relative;
            font-size: 30rpx;
            box-sizing: border-box;
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
                width: 100rpx;
                .pickItem{
                    position: absolute;
                    height: 100rpx;
                    width: 100%;
                    display: flex;
                    flex-grow: 1;
                    left: 0;
                    top: 0;
                    align-items: center;
                    .picker{
                        padding-right: 20rpx;
                        color: black;
                        font-size: 30rpx;
                        margin-left: 290rpx;
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
                // color: #cccccc;
                font-size: 30rpx;
                align-items: center;
                .tagBox{
                    display: flex;
                    align-items: top;
                    flex-wrap: wrap;
                    .tag{
                        display: inline-block;
                        color: #5b5b5b;
                        background-color: #ededed;
                        font-size: 30rpx;
                        text-align: center;
                        padding: 4rpx 10rpx;
                        margin: 8rpx;
                        max-width: 200rpx;
                        overflow: hidden;
                        text-overflow: ellipsis;
                        white-space: nowrap;
                        border-radius: 6rpx;
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
                box-sizing: border-box;
                left: 0;
                top: 0;
                width: 100%;
                height: 100%;
                padding-left: 290rpx;
                padding-right: 30rpx;
            }
            &:active,&:active + .noteArea{
                background-color: #fafafa;
            }
        }
        .tagItem{
            align-items: flex-start;
            padding: 30rpx 30rpx 30rpx 30rpx;
        }
        .normal:last-child{
            border: none;
        }
        .note{
            border: none;
            position: relative;
            width: 100%;
            height: 100rpx;
            padding: 0 30rpx;
            align-items: flex-start;
            .center{
                padding-top: 30rpx;
                text-align: right;
            }
            .left{
                padding-top: 30rpx;
            }
        }
        .noteArea{
            box-sizing: border-box;
            flex-grow: 1;
            height:200rpx;
            box-sizing: border-box;
            padding: 20rpx 40rpx;
            width: 100%
        }
    }
    .saveBtn,.removeBtn{
        width: 690rpx;
        height: 100rpx;
        color: white;
        font-size: 34rpx;
        text-align: center;
        background-color: #00a680;
        line-height: 100rpx;
        border-radius: 10rpx;
        margin-left: 50%;
        transform: translateX(-50%);
        margin-top: 40rpx;
    }
    .saveBtn{
        &:active{
            background-color: #007e5e;
        }
    }
    .removeBtn{
        background-color: white;
        color: #eb7470;
        box-sizing: border-box;
        &:active{
            background-color:#fafafa;
        }
    }
    .btnBox{
        width: 690rpx;
        height: 100rpx;
        font-size: 36rpx;
        display: flex;
        justify-content: space-between;
        margin: 30rpx auto;
        .btnLeft,.btnRight{
            width: 320rpx;
            height: 100%;
            text-align: center;
            line-height: 100rpx;
            border-radius: 10rpx;
        }
        .btnLeft{
            background-color: $greenColor;
            color: white;
            &:active{
                background-color: #007e5e!important;
            }
        }
        .btnRight{
            border:solid 1rpx $greenColor;
            color: $greenColor;
            &:active{
                background-color: #fafafa;
                color: white;
            }
        }
    }
}

</style>
