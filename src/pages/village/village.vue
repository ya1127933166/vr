<template>
    <!-- 小区名称 -->
    <view class="village">
         <view v-html="text"></view>
            <view v-html="text2"></view>
        <view class="villageTop">
            <view class="searchBar">
                <view class="cuIcon-search icon"></view>
                <input @input="bindInput" focus='true' v-model="searchText" class="search-input" type="text"
                       :placeholder="currentType && placeholderTypeMap[currentType] ? `请输入${placeholderTypeMap[currentType]}名称` : '小区/客户/同事'"
                >
                <view @tap="cancelSearch" v-if="isShowCross" class="cuIcon-close icon"></view>
            </view>
            <view class="searchText" @tap='toSearch'>{{search}}</view>
            <view class="searchRes" v-if="isShowCross">
                <block v-if="relevantList.length>0">
                    <view class="resTop">
                        <view class="topTitle">搜索结果</view>
                    </view>
                    <view class="showList" @tap="clickItem(item)" v-for="(item,index) in relevantList" :key="index" >
                        <!-- <view @tap="clickItem(item)" v-for="(item,index) in relevantList" :key="index" class="bottomItem">
                            <view v-html="item.highlight"></view>
                        </view> -->
                        <view class="xiaoqu">
                            <view v-if="item.type=='xiaoqu'">小区</view>
                            <view v-else-if="item.type=='staff'" >同事</view>
                            <view v-else >客户</view>
                        </view>
                        <view class="content" v-if="item.type=='xiaoqu'">
                            <view class="top" v-html="item.highlight"></view>
                            <view class="bottom"><view>{{item.quyu}}</view><view>{{item.shangquan}}</view></view>
                        </view>
                        <view class="content" v-else>
                            <view class="only_name" v-html="item.highlight"></view>
                        </view>
                    </view>
                </block>
                <block v-else>
                    <Empty content="暂无数据" path="https://uss.img.lezhulife.com/xcxicon/empty-house.png" :isButton="false"></Empty>
                </block>
            </view>
        </view>
        <view class="history">
            <view class="historyTop" v-if='currentLocationHistoryList.length'>
                <view class="topLeft">搜索历史</view>
                <view class="cuIcon-delete" @tap='removeHistroy'></view>
            </view>
            <view class="historyBottom">
                <block v-for="(item, idx) in currentLocationHistoryList" :key="idx" >
                    <view @tap="clickItem(item)" class="bottomItem" v-if="canHistoryDisplay(item)">
                        <view>
                            {{item.name}}
                        </view>
                    </view>
                </block>
            </view>
        </view>
        <!-- <view class="nearby">
            <view class="nearbyTop">
                <view class="topLeft">附近的小区</view>
                <view class="cuIcon-delete"></view>
            </view>
            <view class="nearbyBottom">
                <view @tap="clickItem(item)" v-for="item in nearbyList" :key="item" class="bottomItem">{{item}}</view>
            </view>
        </view> -->
    </view>
</template>

<script>
import {mapState,createNamespacedHelpers} from 'vuex';
import Empty from "@/components/comm/emptyPrompt/emptyPrompt";
const {mapState:contractState,mapMutations:contractMutation} = createNamespacedHelpers('contract');
export default {
    name:'village',
    components: {Empty},
    data(){
        return{
            searchText:'',
            typePort:"",
            search:'取消',
            isShowCross:false,
            userInfo:'',
            // relevantList:['麓湖国际社区','天悦府','中环岛','汇景广场','龙岛国际','华府春天','山水人家','惠山公馆','凯蒂凯旋城','华府悦璟','麓湖国际社区','天悦府','中环岛','汇景广场','龙岛国际','华府春天','山水人家','惠山公馆','凯蒂凯旋城','华府悦璟','麓湖国际社区','天悦府','中环岛','汇景广场','龙岛国际','华府春天','山水人家','惠山公馆','凯蒂凯旋城','华府悦璟'],
            relevantList:[],
            historyList:[],
            currentLocationHistoryList: [],
            currentType: '',
            placeholderTypeMap: {
                village: '小区',
                staff: '同事',
                customer: '顾客',
            }
			// historyList:['云景豪庭','青南美湾','第一城普宅','魏玛国际','洛森堡新殿'],
            // nearbyList:['富丽城','成南领寓','左岸花都','滨江和城','香山半岛']
        }
    },
    watch:{
        searchText(newValue,oldValue){
            if (newValue != '') {
                this.isShowCross = true
            } else {
                this.isShowCross = false
            }
        }
    },
    computed:{
        ...mapState(['locationInfo']),
        ...contractState({
            step1:state=>state.step1,
			stepHouse1:state=>state.stepHouse1
        }),

    },
    onLoad(options){
        // console.log('options',options)
        switch(options.type){
            case '小区':
                this.currentType = 'village'
                this.typePort = '/find/xiaoqu'
                uni.setNavigationBarTitle({
                    title: '小区搜索'
                 })
                break;
            case '全部':
                this.currentType = ''
                this.typePort = '/find'
                uni.setNavigationBarTitle({
                    title: '全部搜索'
                 })
        }
    },
    onShow() {
        this.checkLogin()
    },
	created(){
         this.userInfo =  this.selectAuthList()
        // console.log('this', this.userInfo)
		//获取历史记录
        const historyList = uni.getStorageSync('searchHistory') || []
        // console.log(historyList)
		this.historyList = historyList;
        const {id} = this.locationInfo || {}
        if (id) {
            // console.log({id})
            this.currentLocationHistoryList = historyList.filter((item) => item.locationId ? (item.locationId === id) : true).reverse();
        } else {
            this.currentLocationHistoryList = [...historyList].reverse();
        }
	},
    destroyed() {
        // 页面销毁时保存
        uni.setStorageSync('searchHistory', this.historyList);
    },
    methods:{
        ...contractMutation(['setStep1','setStepHouse1']),
        //选择被选中身份id
        ...mapState({
            isPhone: state => state.isPhone,
            selectAuthList: function (state) {
                let temp = state.selectAuthList.filter(e => {
                    return e.selected == 'Y'
                })
                return temp
            }
        }),
		//搜索历史 去重
		setString(arr){
			return	arr = [...new Set(arr)]
		},
        /**
         * 文本框输入事件
         */
        bindInput(e){
			this.searchText = e.detail.value;
            if(this.searchText.length>0){
                // this.search = '搜索'
                this.getData()
            }

        },
        //搜索数据
        async getData(){
            try{
                let res = await this.request1({
                    url:this.typePort,
                    param:{
                        q:this.searchText,
                       fId:`${this.locationInfo.id},${this.userInfo[0].staff_id},${this.userInfo[0].org_id}`,
                       page:1
                    }
                })
               if(res[1].data.state == 200){
                   // console.log('recv',this.relevantList)
                   this.relevantList = res[1].data.body
               }
            }catch(e){
                console.warn('error in search!',e)
            }
        },
		//搜索点击事件
        toSearch() {
            if (this.search === '取消') {
                uni.navigateBack({
                    delta: -1
                })
            } else {
                // 目前没有搜索可以点击,所以不会走到下方逻辑
                if (this.searchText.trim().length > 0) {
                    this.historyList.push(this.searchText.trim())
                    this.historyList = this.setString(this.historyList)
                    uni.setStorageSync('searchHistory', this.historyList);
                    this.searchText = ''
                } else {
                    uni.showToast({
                        title: '请输入不能为空',
                        icon: 'none'
                    })
                }
            }
        },
		//删除历史搜索记录
		removeHistroy(){
			this.historyList = []
			uni.removeStorageSync('searchHistory');
		},
        /**
         * 取消输入按钮
         */
        cancelSearch(){
			// console.log('取消');
            this.searchText = ''
        },
        /**
         * 检查该历史记录是否符合当前类型
         * @param item 历史记录item
         * @returns {boolean}
         */
        canHistoryDisplay(item) {
            if (!this.currentType) return true;
            const {type, id} = item;
            switch (this.currentType) {
                case "village": {
                    return type === 'xiaoqu'
                }
                default: {
                    return true;
                }
            }

        },
        /**
         * 添加历史记录并去重, id和type不相同方可添加
         * @param item
         * @private
         */
        _addHistoryItem(item) {
            const historyList = this.historyList;
            const {id, type} =item;
            const hasSame = (historyList.findIndex((historyItem) => {
                const {id: historyItemId, type: historyItemType} = historyItem;
                return (id === historyItemId) && (type === historyItemType)
            })) > -1
            if (!hasSame) {
                const {id} = this.locationInfo
                historyList.push({...item, locationId: id})
            }
        },


        /**
         * 确认用户已登录
         */
        checkLogin(callbackFunc) {
            //若没有确认身份再次确认
            if (!this.isPhone) {
                // 触发用户登录流程
                this.$login();
                return false;
            }
            callbackFunc && typeof callbackFunc === 'function' && callbackFunc();
            return true;
        },
        //选项点击事件
        clickItem(item){
            const {selectCallback} = this.$store.state;
            // console.log(selectCallback)
            //  console.log(item)
            const {type} = item

            this._addHistoryItem(item);
            // return;
            if (selectCallback && typeof selectCallback === 'function') {
                selectCallback(item)
            } else {
                switch (type) {
                    case 'xiaoqu': {
                        this.$store.state.selectedHousing = item;
                        uni.redirectTo({
                            url: './villageList',
                            // complete: (e) => {console.log('nav',e)}
                        })
                        break;
                    }
                    case 'customer': {
                        const {id} = item;
                        uni.redirectTo({
                            url:`../../subpackSource/pages/source/customerInfo?customer_id=${id}`
                        })
                        break;
                    }
                    case 'staff': {
                        const {id} = item;
                        uni.redirectTo({
                            url:`../../subpackAddrlist/pages/addrList/memberInfo?staff_id=${id}`
                        })
                        break;
                    }
                    default: {
                        //租房
                        let temp = Array.from(this.step1);
                        temp[1] = item;
                        this.setStep1(temp);
                        //二手房
                        let temp1 = Array.from(this.stepHouse1);
                        temp1[2] = item;
                        // console.log(temp1[2])
                        this.setStepHouse1(temp1);
                        uni.navigateBack({
                            delta:-1
                        })
                    }
                }
            }
        },
    }
}
</script>

<style lang='scss' scoped>
$pageBgColor:#f7f7f7;
$borderColor:#e9e9e9;
$placerColor:#cccccc;
$titleColor:#888888;
$greenColor:#00a680;
.village{
    min-height: 100vh;
    background-color: white;
    border-bottom: solid calc(1px / 2.5) #d9d9d9;
    .villageTop{
        width: 750rpx;
        height: 140rpx;
        background-color: white;
        display: flex;
        align-items: center;
        justify-content: space-between;
        box-sizing: border-box;
        padding: 0rpx 30rpx;
        position: relative;
        .searchBar{
            height: 70rpx;
           border-bottom: solid calc(1px / 2.5) #d9d9d9;
            display: flex;
            flex-grow: 1;
            border-radius: 40rpx;
            padding: 0rpx 30rpx;
            box-sizing: border-box;
            align-items: center;
            justify-content: space-between;
            box-shadow: 0 0 15rpx #cccccc;
            .search-input{
                flex-grow: 1;
                margin: 0rpx 20rpx;
                font-size: 24rpx;
                color: black;
            }
        }
        .searchText{
            width: 100rpx;
            text-align:right;
            font-size: 28rpx;

        }
        .searchRes{
            position: absolute;
            left: 0rpx;
            top: 140rpx;
            overflow :auto;
            background-color: white;
            width: 750rpx;
            z-index: 10;
            height: calc(100vh - 143rpx);
            .resTop{
                width: 690rpx;
                margin: 0 auto;
                display: flex;
                justify-content: space-between;
                align-items: center;

                .topTitle{
                    color: rgb(153, 153, 153);
                    font-size: 22rpx;
                    padding-bottom: 0rpx;
                }
            }
            .resBottom{
                padding-left: 30rpx;
                display: flex;
                background-color: white;
                padding: 30rpx 30rpx 0rpx 30rpx;
                flex-wrap: wrap;
                flex-direction: column;
                .bottomItem{
                    height: 100rpx;
                    line-height: 100rpx;
                    padding: 4rpx 20rpx;
                    border-bottom: solid calc(1px / 2.5) #d9d9d9;
                }
            }
            //搜索样式
            .showList{
                border-bottom: solid calc(1px / 2.5) #d9d9d9;
                box-sizing: border-box;
                width: 750rpx;
                display: flex;
                flex-wrap:nowrap;
                .xiaoqu{
                    width: 20vw;
                    height: 50rox;
                    padding: 35rpx;
                    text-align: center;
                    color: gray;
                    view{
                        height: 40rpx;
                        line-height: 40rpx;
                        font-size: 22rpx;
                          width: 70rpx;
                        background: rgb(247, 245, 245);
                        color:grey
                    }
                }
                  .content{
                        width: 100%;
                        height: 120rpx;
                        .top{
                            height: 60rpx;
                            margin:5rpx 0 0 0;
                            padding-top:20rpx ;
                            font: 24rpx;
                            // line-height: 60rpx;
                        }
                        .bottom{
                            display: flex;
                             margin:1rpx 0 5rpx 0;
                            height: 40rpx;
                             font-size: 24rpx;
                            view{
                                color: gray;
                                display: flex;
                                flex-wrap: nowrap;
                                min-width: 50rpx;

                            }
                            view:nth-child(1){
                                //  max-width:100rpx;
                                margin-right:16rpx;
                            }
                        }
                        .only_name{
                            height: 120rpx;
                            line-height: 120rpx;

                        }
                    }
            }
        }
    }
    .history{
        box-sizing: border-box;
        .historyTop{
            width: 690rpx;
            margin: 0 auto;
            display: flex;
            justify-content: space-between;
            align-items: center;
            .topLeft{
                color: rgb(153, 153, 153);
                font-size: 22rpx;
                padding-bottom: 0rpx;
            }
        }
        .historyBottom{
            padding-left: 30rpx;
            display: flex;
            background-color: white;
            padding: 30rpx 10rpx 30rpx 45rpx;
            flex-wrap: wrap;
            box-sizing: border-box;
            .bottomItem{
                margin-right: 20rpx;
                margin-bottom: 20rpx;
                background-color: #f8f8f8;
                padding: 8rpx 20rpx;
                border-radius: 4rpx;
                font-size: 26rpx;
            }
        }
    }
    .nearby{
        box-sizing: border-box;
        .nearbyTop{
            width: 690rpx;
            margin: 0 auto;
            display: flex;
            justify-content: space-between;
            align-items: center;
            .topLeft{
                color: rgb(153, 153, 153);
                font-size: 22rpx;
                padding-bottom: 0rpx;
                padding-top: 30rpx;
            }
        }
        .nearbyBottom{
            padding-left: 30rpx;
            display: flex;
            background-color: white;
            padding: 30rpx 30rpx 0rpx 30rpx;
            flex-wrap: wrap;
            flex-direction: column;
            .bottomItem{
                height: 100rpx;
                line-height: 100rpx;
                padding: 4rpx 20rpx;
                border-bottom: solid calc(1px / 2.5) #d9d9d9;
            }
        }
    }
}
</style>
