<template>
    <view class="find-select" :style="'background-color:'+ (isWhite?'white':'#f7f7f7')+';'">
        <view class="select-left" :style="'justify-content:'+((isShowBtn==false&&list.length==2)?'space-around':'space-between')+';'">
            <view class="select-area" v-for="(item,index) in transMenuBar" :key="item.text" @tap="downMenuHandel(index,$event)" :data-item="item">
                <view class="text">{{ item.text }}</view>
                <view class="cuIcon-unfold" :style="'margin:4rpx 0rpx 0rpx 4rpx;transform:rotate(' + (item.status ? 180 : 0) +'deg);'"></view>
            </view>
         <view v-if="isShowBtn" @tap.stop="rightButtonClick" class="addBox">
               <view class="addHome">{{rightButton}}</view>

            </view>
        </view>
		<!-- :style="{backgroundColor:isWhite?'white':'#f7f7f7',height:checkout=='mine'?'44vh':'40vh'}" -->
    <scroll-view v-if="isShowMenu&&!isShowMenu1&&!isShowMenu2" class="down-menu" scroll-y :style="'height:40vh;background-color:'+ (isWhite?'white':'#f7f7f7')+';'">
            <block v-for="(item, index) in menuList" :key="index">
                <view v-if="index!=0" @click="downMenuBarClick(item)" class="menu-item" :style="'color:' + (item.status==true ? '#1bb28c' : 'black') + ';'">{{ item.text }}</view>
            </block>
        </scroll-view>

        <block v-if="isShowMenu">
            <view class="down-menu1" v-if="isShowMenu1&&!isShowMenu2">
                <block v-for="(item, index) in menuList" :key="index">
                    <view  v-if="index" @click="downMenuBarClick(item)"
                          class="menu-item" :style="'color:' + (item.status ? '#1bb28c' : 'black') + ';'">
                        {{item.text }}
                    </view>
                </block>
                <view class="custom-input">
                    <view class="custom-title" style="margin: 20rpx 0rpx;width: 100%;font-size: 28rpx;">
                        自定义
                    </view>
                    <view class="input-row">
                        <input class="input-row-item" v-model="start" type="number" name="" value="" maxlength="6" placeholder="最低价"/>
                        <input class="input-row-item" v-model="end" type="number" name="" value="" maxlength="6" placeholder="最高价"/>
                        <text class="unit input-row-item" v-if='isFlag'>万</text>
                        <text class="unit input-row-item" v-else>元</text>
                        <view class="submit input-row-item" @tap='toNumber'>
                            确定
                        </view>
                    </view>
                </view>
		</view>
            <view class="down-menu2" v-if="isShowMenu2&&!isShowMenu1&&isFlag">
			<block class="menu-item" v-for="(item, index) in menuList" :key="index">
				<view v-if="index!=0" @click="downMenuBarClick1(item)" class="menu-item" style="margin-top:30rpx;" :style="'color:' + (item.status==true ? '#1bb28c' : 'black') + ';'">{{ item.text }}</view>
			</block>
			<view class='btn' style='margin-top:100rpx ;' @tap='getHouseType' >确定</view>
		</view>
            <view class="down-menu2" v-if="isShowMenu2&&!isShowMenu1&&!isFlag">
			<view class="" style="width: 120rpx;margin-bottom: 10rpx;">
				整租
			</view>
			<block class="menu-item" v-for="(item, index) in menuList[0].type1" :key="index">
				<view @click="downMenuBarClick1(item)" class="menu-item" :style="'color:' + (item.status==true ? '#1bb28c' : 'black') + ';'">{{ item.text }}</view>
			</block>
			<view class="" style="width: 120rpx;margin:10rpx 0">
				合租
			</view>
			<block class="menu-item" v-for="(item, index) in menuList[0].type2" :key="index">
				<view  @click="downMenuBarClick1(item)" class="menu-item" :style="'color:' + (item.status==true ? '#1bb28c' : 'black') + ';'">{{ item.text }}</view>
			</block>
			<view class='btn' @tap='getHouseStyle'>确定</view>
		</view>
            <view @click="clickMaskHandel" :style="'height:'+maskHeight" class="down-mask" @touchmove.navtive.stop="catchTouchMove"></view>
        </block>
    </view>
</template>

<script>
import {mapState} from 'vuex'
export default {
    name:'dropDownMenu',
    props:{
		 isAuth:{
            type:Boolean,
            default:false
        },
        //是否需要上提页面
        isScroll:{
            type:Boolean,
            default:false
        },
        //上提页面回调
        showHeaderHandel:{
            type:Function,
            default:()=>()=>{}
        },
        //点击列表项回调
        downMenuBarClickCallBack:{
            type:Function,
            default:()=>()=>{}
        },
        //右侧按钮
        rightButton:{
            type:String,
            default:'默认'
        },
        //按钮点击回调
        rightButtonClickCallBack:{
            type:Function,
            default:()=>()=>{}
        },
        //是否显示右侧绿色按钮
        isShowBtn:{
            type:Boolean,
            default:true
        },
        //点击菜单回调
        downMenuCallBack:{
            type:Function,
            default:()=>()=>{}
        },
        //是否白色背景
        isWhite:{
            type:Boolean,
            default:false
        },
        menuBar:{
            type:Array,
            default:[

			],
        },
        checkout:{
            type:String,
            default:''
        }
    },
    data(){
        // const systemInfo = this.$$globalData.systemInfo;
        // if(systemInfo.model.startsWith('iPhone 5')||systemInfo.model.startsWith('iPhone 6')||systemInfo.model.startsWith('iPhone 7')||systemInfo.model.startsWith('iPhone 8')){
        //     top = 64;
        // }else if(systemInfo.system.startsWith('Android')){
        //     top = 90
        // }else{
        //     top = 87
        // }
        // const {top: safeTop} = systemInfo.safeArea;
        // const {statusBarHeight, screenWidth} = systemInfo;
        // const rpxRate = screenWidth / 750;
        let top = 0;
        // console.warn({rpxRate,statusBarHeight, screenWidth}, this.headerHeight, top)
        // if (rpxRate > 0.52) {
        //     top = 100
        // } else if ( rpxRate > 0.45) {
        //     top = 85
        // } else {
        //     top = 65
        // }
        // console.log(systemInfo, {rpxRate, safeTop})
        // safeTop && (top = safeTop + statusBarHeight);
        return{
            menuList: [],
			isShowBar: false,
			isShowMenu: false,
			isShowMenu1:false,
			isShowMenu2:false,
			isFlag:true,
			currentMenuTitle: "默认",
            isClickBar:false,
			start:'',
			end:'',
			transList:[],
			indexContent:'',
			index:'',
			list:[[
			],
			[
				{ text: "价格", status: false },
				{ text: "50万以下", status: true },
				{ text: "50-70万", status: false },
				{ text: "70-80万", status: false},
				{ text: "80-100万", status: false },
				{ text: "100-150万", status: false },
				{ text: "150-200万", status: false },
				{ text: "200-300万", status: false},
				{ text: "300万以上", status: false },
			],
			[
				{ text: "户型", status: false },
				{ text: "1居", status: false },
				{ text: "2居", status: false},
				{ text: "3居", status: false},
				{ text: "4居", status: false},
				{ text: "5居", status: false},
				{ text: "5居以上", status: false},
			],
			[
				{ text: "排序", status: false},
				{ text: "总价从低到高", status: true },
				{ text: "总价从高到低", status: false },
				{ text: "面积从大到小", status: false },
			]],
            transMenuBar:[
				{ text: "区域", status: false },
				{ text: "价格", status: false },
				{ text: "户型", status: false },
				{ text: "智能排序", status: false },
            ],
            jsonList:'',
            jsonMenuBar:'',
			tarStatus:[
				[
					{ text: "价格", status: false },
					{ text: "50万以下", status: false },
					{ text: "50-70万", status: false },
					{ text: "70-80万", status: false},
					{ text: "80-100万", status: false },
					{ text: "100-150万", status: false },
					{ text: "150-200万", status: false },
					{ text: "200-300万", status: false},
					{ text: "300万以上", status: false },],
				[
					{ text: "价格", status: false },
					{ text: "1000以下", status: false },
					{ text: "1000-1500", status: false },
					{ text: "1500-2000", status: false},
					{ text: "2000-2500", status: false },
					{ text: "2500-3000", status: false },
					{ text: "3000-3500", status: false },
					{ text: "3500-4000", status: false},
					{ text: "4000以上", status: false },],
				[
					{ text: "户型", status: false },
					{ text: "1居", status: false },
					{ text: "2居", status: false},
					{ text: "3居", status: false},
					{ text: "4居", status: false},
					{ text: "5居", status: false},
					{ text: "5居以上", status: false},
				],
				[
					{ text: "方式", status: false ,
					type1:[{ text: "1居", status: false },
					{ text: "2居", status: false},
					{ text: "3居", status: false},
					{ text: "4居以上", status: false}]
					,
					type2:[{ text: "1居", status: false },
					{ text: "2居", status: false},
					{ text: "3居", status: false},
					{ text: "4居以上", status: false}]},
				],
				[
					{ text: "排序", status: false},
					{ text: "总价从低到高", status: true },
					{ text: "总价从高到低", status: false },
					{ text: "面积从大到小", status: false },
				],
				[
					{ text: "排序", status: false },
					{ text: "最新发布", status: true },
					{ text: "总价从低到高", status: false },
					{ text: "总价从高到低", status: false},
					{ text: "面积从小到大", status: false },
					{ text: "面积从大到小", status: false},
				],

				[
					{ text: "添加人", status: true },
					{ text: "全部", status: true },
					{ text: "自己添加的", status: false },
					{ text: "分享给我的", status: false },
				],
				[
					{ text: "排序", status: true },
					{ text: "智能排序", status: true },
					{ text: "按添加时间排序", status: false },
					{ text: "按分享优先", status: false },
				]

				],
            top
        }
    },
	created() {
		// console.log(this.menuBar);
		this.getAreaData()
		this.getCheckout()
		uni.$on('updata',res=>{
			setTimeout(()=>{
				uni.hideLoading()
			},400)
			if(res.index ==0){
				this.isFlag = true
				this.index = res.index
				// console.log('aaa',this.transMenuBar);
				// this.transMenuBar[0].text = '区域'
				this.transMenuBar[1].text='价格';
				this.transMenuBar[2].text ='户型';
				this.transMenuBar[3] && (this.transMenuBar[3].text = '排序')
			// 	 this.transMenuBar=[
			// 	{ text: "区域", status: false },
			// 	{ text: "价格", status: false },
			// 	{ text: "户型", status: false },
			// 	{ text: "智能排序", status: false },
            // ],
				this.transList[1] = this.tarStatus[0]
				this.transList[2] = this.tarStatus[2]
				this.transList[3] = this.tarStatus[4]

				}
			else if(res.index ==1){
				this.isFlag =false
				// this.transMenuBar[0].text = '区域'
                // console.log('this.transMenuBar', this.transMenuBar);
				this.transMenuBar[1].text='价格';
				this.transMenuBar[2].text = '方式';
				(this.transMenuBar[3]) && (this.transMenuBar[3].text = '排序')
				this.transList[1] = this.tarStatus[1]
				this.transList[2] = this.tarStatus[3]
				this.transList[3] = this.tarStatus[5]
				}
		})
		uni.$on('updataLocation',res=>{
			this.getAreaData()
		})
	},
	// onShow(){
	// 	console.log('hhhhhh')
	// },
    mounted(){
        const systemInfo = this.$$globalData.systemInfo;
        const {statusBarHeight, screenHeight, windowHeight, screenWidth} = systemInfo;
        const tabbarHeight = screenHeight - windowHeight;
        const rpxRate = screenWidth / 750;
        this.top = this.headerHeight  + tabbarHeight + statusBarHeight * rpxRate
    },
    watch:{
       transList:{
           handler(newValue,oldValue){
			   // console.log("监听",newValue)
			    this.transList = newValue
               // if(newValue.length>0){
               //      let jsonList = JSON.stringify(newValue);
               //      this.transList = JSON.parse(jsonList)
               // }
           },
           deep:true,
           immediate:true
       },
       menuBar:{
           handler(newValue,oldValue){
			   // console.log("menuBar",newValue);
               if(newValue.length>0){
                    let jsonMenuBar = JSON.stringify(newValue);
                    this.transMenuBar = JSON.parse(jsonMenuBar)
               }
           },
           deep:true,
           immediate:true
       }
    },
    computed:{
        ...mapState({
            isPhone: state => state.isPhone,
			locationInfo: (state) => state.locationInfo,
            headerHeight: (state) => {
                const baseHeight = state.custom.bottom + state.custom.top;
                if (state.custom.top < state.sys.statusBarHeight) {
                    return (
                        baseHeight + state.sys.statusBarHeight - state.sys.statusBarHeight
                    );
                }
                return (
                    baseHeight - state.sys.statusBarHeight - state.sys.statusBarHeight
                );
            },
        }),
        //遮罩高度
        maskHeight(){
            const sys = this.$$globalData.systemInfo
            return `calc(${sys.windowHeight}px - ${this.checkout=='mine'?'50vh':'40vh'} )`
        },
        //计算当前所选中的是哪个列表数据
		getCurrentMenu() {
            let index = -1;
            if (this.transList && this.transList.length) {
                for (let i = 0; i < this.transList.length; i++) {
                    const listItem = this.transList[i];
                    if (listItem && listItem.length) {
                        for (let j = 0; j < listItem.length; j++) {
                            if (listItem[j].text == this.currentMenuTitle) {
                                index = i
                            }
                        }
                    }
                }
            }
			if(index==-1){
				index = this.indexContent
			}
            return index
		},
    },
    methods:{
		//页面检测
        getCheckout() {
            if (this.checkout === 'find') {
                if (this.index == 0) {
                    this.transList[1] = this.tarStatus[0]
                    this.transList[2] = this.tarStatus[2]
                    this.transList[3] = this.tarStatus[4]
                } else if (this.index == 1) {
                    this.transList[1] = this.tarStatus[1]
                    this.transList[2] = this.tarStatus[3]
                    this.transList[3] = this.tarStatus[5]
                }
            } else if (this.checkout === 'mine') {
                this.list[1] = this.tarStatus[6]
                this.list[2] = this.tarStatus[7]
                this.list[3] = []
                this.transList = this.list
            }
        },
		//获取区域地址
		async getAreaData(){
			try {
				let res = await	this.request({
					url:'cities/region',
					type:'get',
					param:{
						cityId:this.locationInfo.id
					}
				})
			if(res[1].data.state==200){
					console.log("请求地址",res[1].data.body);
					let temp = res[1].data.body.map(ele=>{
						return {text:ele.name,status:false,type:0,id:ele.id}
					})
					temp.unshift({text:'区域',status:false,type:0},{text:'全部区域',status:true,type:0,id:''})
					this.list[0] = temp;
					 this.transList = this.list
				}else{
					uni.showToast({
						title: this.$throwStatusCode(res[1].data.state,'获取区域数据'),
						icon:'none'
					})
				}
			} catch (err) {
				console.log(err);
			}
		},
        /**
			* 展开下拉菜单
			*/
		downMenuHandel(index,e) {
			this.$utils.debounce(()=>{
				this.$emit('downMenuCallBack',e)
				this.indexContent = index
                // console.log(index, e)
                const {selectKey} = e.currentTarget.dataset.item;
				if(selectKey ==='tag'){
					uni.navigateTo({
						url: '../../subpackSource/pages/source/tag?type=客源',
					})
					return
				}
				if(this.isPhone != true){
					this.$$globalData.jumpPath='back'
					this.$login();
					//如果是客源页面使用，则点击标签跳转至选择标签
					return
				}
				if(this.isScroll == true){
					this.judgeRect()
					wx.pageScrollTo({
						duration: 300,
						scrollTop: 500,
						complete: (res) => {
						},
					});
				}
				this.isClickBar = true;
				let currentMenu = e.currentTarget.dataset.item;
				console.log("currentMenu",currentMenu, this.transList, index);
				this.currentMenuTitle = currentMenu.text;
				this.menuList = this.transList[index]
				console.log('menuList',this.menuList);
				for (let i = 0; i < this.transMenuBar.length; i++) {
					this.transMenuBar[i].status = false;
					if (i == index) {
						this.transMenuBar[i].status = !currentMenu.status;
						this.isShowMenu = this.transMenuBar[i].status;
						this.isShowMenu1 = currentMenu.type == 1
						this.isShowMenu2 = currentMenu.type == 2
					}
				}
			},600)()
		},
		//下拉菜单点击事件
        downMenuBarClick(e) {
            let currentMenuList = this.transList[this.getCurrentMenu];
            currentMenuList.forEach(ele => {
                ele.status = false;
                if (ele.text == e.text) {
                    ele.status = true;
                }
            })
            let selectText = e.text;
            let id = e.id
            //隐藏遮罩
            this.isShowMenu = false;
            this.transMenuBar.forEach((ele, i) => {
                ele.status = false;
            });
            this.transMenuBar[this.getCurrentMenu].text = selectText;
            this.transList[this.getCurrentMenu] = currentMenuList;
            this.$emit('downMenuBarClickCallBack', {
                index: this.getCurrentMenu,
                text: selectText,
                test: this.getCurrentMenu == 0 ? id : selectText
            })
            /*
				if(this.getCurrentMenu == 0){
					this.$emit('downMenuBarClickCallBack',{index:this.getCurrentMenu,text:selectText,test:id})
				}else if(this.getCurrentMenu == 1){
					this.$emit('downMenuBarClickCallBack',{index:this.getCurrentMenu,text:selectText,test:selectText})
				}else if(this.getCurrentMenu == 3){
					this.$emit('downMenuBarClickCallBack',{index:this.getCurrentMenu,text:selectText,test:selectText})
				}
				*/
        },
		//下拉菜单点击多选
		downMenuBarClick1(e){
				e.status = !e.status
		},
		//确定户型
		getHouseType(){
			let currentMenuList = this.transList[2];
			console.log('currentMenuList',currentMenuList);
			let arr=[]
			let arr1 = []
		    arr=currentMenuList.filter(ele=>{
			 return ele.status== true
			})
			arr.forEach(e=>{
				arr1.push(e.text)
			})
			this.$emit('downMenuBarClickCallBack',{index:2,text:arr1,test:arr1})
			// arr1.join('-')
			this.transMenuBar[2].text = arr1.length==0?'户型':arr1.join('-')
			this.transList[2] = currentMenuList;
			// this.transList[2].forEach((ele,i)=>{
			// 	ele.status = false
			// })
			//隐藏遮罩
			this.isShowMenu = false;
			this.transMenuBar.forEach((ele, i) => {
				ele.status = false;
			});

		},
		getHouseStyle(){
			let currentMenuList1 = this.transList[2][0].type1
			let currentMenuList2 = this.transList[2][0].type2;
			let arr=[]
			let arr1 = []
			arr=currentMenuList1.filter(ele=>{
			 return ele.status== true
			})
			arr.forEach(e=>{
				arr1.push(e.text)
			})
			arr1.join('-')
			let arr2=[]
			let arr3 = []
			arr2=currentMenuList2.filter(ele=>{
			 return ele.status== true
			})
			arr2.forEach(e=>{
				arr3.push(e.text)
			})
			arr3.join('-')
			console.log(arr1);
			console.log(arr3);
			this.transMenuBar[2].text = arr1.length==0&&arr3.length==0?'方式':'整租:'+arr1.join('-')+'-'+'合租:'+arr3.join('-')
			this.$emit('downMenuBarClickCallBack',{index:2,text:this.transMenuBar[2].text,test:{z:arr1,h:arr3}})
			//隐藏遮罩
			this.isShowMenu = false;
			this.transMenuBar.forEach((ele, i) => {
				ele.status = false;
			});
		},

		//自定义价格
		toNumber(){
			let selectText =''
			let eq = Number(this.end) > Number(this.start)
			if(!eq){
				uni.showToast({
				    title: '输入不正确',
					icon:'none',
				    duration: 600
				});
				return
			}else{
				if(this.isFlag ){
					selectText = this.start+'-'+this.end+'万'
				}else{
					selectText = this.start+'-'+this.end+'元'
				}
				// console.log('111',selectText);
				this.$emit('downMenuBarClickCallBack',{index:1,text:selectText,test:selectText})
				this.transMenuBar[1].text = selectText
				//默认选中第一个
				this.transList[1].forEach((ele,i)=>{
					ele.status = false
					if(i==1){
						ele.status = true
					}
				})
				//隐藏遮罩
				this.isShowMenu = false;
				this.transMenuBar.forEach((ele, i) => {
					ele.status = false;
				});
				this.start =''
				this.end=''
			}
		},
        //点击遮罩关闭模态框
		clickMaskHandel(){
			this.isShowMenu = false;
			this.transMenuBar.forEach((ele, i) => {
				ele.status = false;
			});
		},
		//按钮回调
		rightButtonClick(){
				let that = this
				console.log('isAuth',this.isAuth)
           		 if(this.isAuth == false){
                	wx.getUserProfile({
			    desc : '用于完善用户资料',
			    lang : 'zh_CN',
			    success : function( res ){
					console.log( 'wx.getUserProfile=>用户允许了授权' )
					that.$emit('rightButtonClickCallBack',res)

				},
				fail : function( res ){
				    // console.log('wx.getUserProfile=>用户拒绝了授权');
				    // console.log( res );

				},
				complete:()=>{
					uni.hideLoading()
				}})}else{
					that.$emit('rightButtonClickCallBack');	//this.isFlag
				}


        },
        //判断当前menubar位置
		judgeRect(){
			const that = this;
			let top = that.top || 0;
			let view = uni.createSelectorQuery().in(this).select(".find-select");
			view.boundingClientRect(data => {
                // console.log(data, top)
				if (data && (data.top <= top)) {
					that.isShowBar = true;
					that.isClickBar = false;
				} else {
					that.isShowBar = false;
					if(that.isClickBar==true){
						that.isShowBar = true;
					}else{
						that.isShowBar = false;
						that.isShowMenu = false;
						that.isClickBar = false;
						that.transMenuBar.forEach((ele, i) => {
							ele.status = false;
						});
					}
                }
                that.$emit('showHeaderHandel',that.isShowBar)
			}).exec();
		},
        manualInit(trueIdx = 1) {
            let jsonMenuBar = JSON.stringify(this.menuBar || []);
            this.transMenuBar = JSON.parse(jsonMenuBar)
            // console.log('manualUpdate',this.transList)
            this.transList[0] && this.transList[0].map((rowItem, rowIdx) => rowItem.status = rowIdx === 1)
            this.transList[1] && this.transList[1].map((rowItem, rowIdx) => rowItem.status = false)
            this.transList[2] && this.transList[2].map((rowItem, rowIdx) => rowItem.status = rowIdx === 1)
            this.transList[3] && this.transList[3].map((rowItem, rowIdx) => rowItem.status = rowIdx === 1)
            this.list.map(row => row.map((rowItem, rowIdx) => {
                const {status} = rowItem
                status && (rowItem.status = rowIdx === trueIdx)
            }))
        },
        catchTouchMove() {
            return this.isShowMenu
        }
    }
}
</script>

<style lang='scss' scoped>
.find-select {
	box-sizing: border-box;
	padding: 0rpx 50rpx 0rpx 50rpx;
	width: 750rpx;
	height: 100rpx;
	background-color: #f7f7f7;
	display: flex;
	align-items: center;
	justify-content: space-between;
	border-bottom: solid 1rpx #eaeaea;
	position: relative;
	z-index: 99;
	.select-left {
		width: 100%;
		display: flex;
		font-size: 28rpx;
		position: relative;
		justify-content: space-between;
		height: 100%;
        // background-color: aqua;

		.select-area {
			width: 140rpx;
			display: flex;
			align-items: center;
            // background-color: aqua;
			.text {
                // background-color: aquamarine;
				max-width: 120rpx;
				overflow: hidden;
				text-overflow: ellipsis;
				white-space: nowrap;
			}
			image {
				transition: 0.3s;
			}
		}
        .addBox{
			position: relative;
			top: 0;right: -15rpx;
            height: 100%;
            display: flex;
            align-items: center;
            .addHome {
                width: 160rpx;
                border: solid 1.5rpx #47bda2;
                color: #47bda2;
                padding: 10rpx 6rpx;
                border-radius: 100rpx;
                text-align: center;
                font-size: 28rpx;
            }
        }
	}


	.down-menu {
		width: 750rpx;
		position: absolute;
		top: 99rpx;
		right: 0;
		z-index: 1;
		background-color: #f7f7f7;
		font-size: 28rpx;
		transition:all 0.3s ease-in-out;
		.menu-item {
			width: 750rpx;
			height: 70rpx;
			line-height: 70rpx;
			padding: 0rpx 0rpx 0rpx 50rpx;
			border-bottom: 2rpx solid transparent;
			/* border-bottom: solid calc(1px / 2.5)#d9d9d9; */
           &:active{
                background-color: #fafafa;
            }
		}
	}
	.down-menu1{
		width: 750rpx;
		height:35vh;
		background-color: red;
		position: absolute;
		padding: 20rpx 60rpx 0;
		top: 99rpx;
		right: 0;
		z-index: 1;
		background-color: #FFFFFF;
		font-size: 28rpx;
		transition:all 0.3s ease-in-out;
		.menu-item{
			display: inline-block;
			width: 137rpx;
			height: 50rpx;
			font-size: 22rpx;
			line-height: 50rpx;
			background-color: #F1F1F1;
			margin: 20rpx 10rpx 10rpx 10rpx;
			text-align: center;
}
        .custom-input {
            margin-top: 50rpx;
            .custom-title {
                width: 100%;
            }
            .input-row {
                display: flex;
                align-items: center;
                .input-row-item {
                    flex: 1;
                }
            }
            input{
                width: 150rpx;
                height: 60rpx;
                display:inline-block;
                background-color: #fff;
                margin:10rpx  0rpx  10rpx  30rpx;
                border: 2rpx solid #eee;
            }
            .unit{
                font-size: 32rpx;
                height: fit-content;
                //position: relative;
                //right: -30rpx;
                //bottom: 38rpx;
            }
            .submit{
                //position: relative;
                //right: -105rpx;
                //bottom: 40rpx;
                //display: inline-block;
                width: 127rpx;
                height: 70rpx;
                text-align: center;
                line-height: 70rpx;
                background-color: #eee;
            }
        }
	}
	 .down-menu2{
		width: 750rpx;
		min-height:30vh;
        max-height: 50vh;
		background-color: red;
		position: absolute;
		padding: 50rpx 50rpx 0;
		top: 99rpx;
		right: 0;
		z-index: 1;
		background-color: #FFFFFF;
		font-size: 28rpx;
		transition:all 0.3s ease-in-out;
		.menu-item{
			display: inline-block;
			width: 143rpx;
			height: 50rpx;
			font-size: 22rpx;
			line-height: 50rpx;
			background-color: #F1F1F1;
			margin: 10rpx 10rpx 0rpx 10rpx;
			text-align: center;
			}
			.btn{
				width: 100% ;
				height: 80rpx;
				margin-top:50rpx;
				 margin-bottom: 50rpx;
				border-radius: 10rpx;
				color: #FFFFFF;
				background-color:#1bb28c ;
				text-align: center;
				line-height: 80rpx;
			}
		}
	.down-mask {
		width: 100%;
		height: 100%;
		background-color: rgba(0, 0, 0, 0.4);
		position: fixed;
		bottom: 0;
		left: 0;
		z-index: 0;
		animation: fade 0.1s ease-in-out;
	}
}
</style>
