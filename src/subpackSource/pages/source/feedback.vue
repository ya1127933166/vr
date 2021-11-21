<template>
	<view class="">
		<view class="house_top">
			<view class="top_left">
				房源
			</view>
			<view class="top_right">
				<view class="">
					天鹅湖二期 2室1厅1卫 东南
				</view>
				<view class="">
					285万  130㎡
				</view>
				<view class="">
					成都·高新·天府软件园
				</view>
			</view>
			
		</view>
		<view class='selectBox'>
		    <view class='itemBox'>    
		        <block v-for="(item,index) in list" :key="item.text">
		            <view  class='selectItem' style="position: relative;"  :style='index==2?"height:150rpx":""'>
		                <view class='itemLeft'>{{item.text}}</view>
		                <view class='itemCenter' v-if="!item.isInput" :style="'color:'+(item.val==='请选择'?'':'black')+';'">{{item.val}}</view>
						<textarea  v-if="item.text=='跟进内容'" placeholder-style='color:#cccccc' placeholder='本次带看对房源的感受或评价'></textarea>
						<picker :disabled="item.text=='跟进内容'" v-if="!item.isInput" :style="'position: absolute;transform: translateX(50%);'" :mode="item.mode" fields="month" :value="item.val" :range="item.selectList" @change="bindDateChange($event,item)">
							<view class="picker" style="transform: translateX(-50%);opacity: 0;width:450rpx;height:100rpx">
							选择
							</view>
						</picker>
		                <view  class="cuIcon-right" v-if='!item.isInput'></view>
		            </view>
		        </block>
		    </view>    
		</view>
		<view class='selectBox'>
		    <view class='itemBox'>    
		        <block v-for="(item,index) in pice" :key="item.text">
		            <view @tap="optionClickHandel(item.text)" class='selectItem' style="position: relative;">
		                <view class='itemLeft'>{{item.text}}</view>
		                <view class='itemCenter' v-if="!item.isInput" :style="'color:'+(item.val==='可选'?'':'black')+';'">{{item.val}}</view>
		                <view  class="cuIcon-right"></view>
		            </view>
		        </block>
		    </view>    
		</view>
		<view @tap="nextBtn"  class='nextBtn'>保存</view>
	</view>
</template>

<script>
	export default{
		name:'feedback',
		data(){
		    return{
		        list:[
					{text:'跟近方式',isInput:false,val:'请选择',mode:'selector',selectList:['带看','陪看','邀约','电话拜访','网络拜访','采集']},
		            {text:'跟进业务',isInput:false,val:'请选择',mode:'selector',selectList:['销售机会','商务谈判','合同','关系维护','房源维护']},
				   	 {text:'跟进内容',isInput:true,val:''},
		        ],	
				pice:[
					{text:'位置',isInput:false,val:'可选'},
					{text:'照片',isInput:false,val:'可选'},
				]
			}
		},
	}
</script>

<style lang='scss' scoped>
	.house_top{
		width: 750rpx;
		padding: 0 50rpx;
		background-color: #FFFFFF;
		display: flex;
		.top_left{
			width: 30vw;
			height: 200rpx;
			font-size: 32rpx;
			line-height: 200rpx;
		}
		.top_right{
			font-size: 30rpx;
			width: 70vw;
			margin-top: 50rpx;
			height: 150rpx;
			view:nth-child(3){
				font-size: 24rpx;
				color: #e0dfe3;
			}
		}
	}
	
	.nextBtn{
        width: 680rpx;
        height: 100rpx;
        background-color:#00a680;
        color:white;
        line-height: 100rpx;
        text-align: center;
        margin: 50rpx auto;
        border-radius: 10rpx;
        font-size: 34rpx;
        &:active{
            background:#007e5e;
        }
    }
    .selectBox{
        width: 750rpx;
        // padding:0rpx 20rpx 0rpx 23rpx;
		margin-bottom: 20rpx;
        box-sizing: border-box;
        .way{
            display: flex;
            background-color: white;
            padding: 40rpx ;
            border-radius: 10rpx;
            box-sizing: border-box;
            view:nth-child(1){
                width: 230rpx;
            }
            view:nth-child(2){
                font-size: 26rpx;
                font-weight: 600;
            }
        }
        .itemBox{
            margin-top: 20rpx;
            border-radius: 10rpx;
            // padding:20rpx 40rpx 0rpx 40rpx;

            background-color: white;
            box-sizing: border-box;
            
            .selectItem{
                display: flex;
                height: 100rpx;
				box-sizing:border-box;
                align-items: center;
				border-top: solid 2rpx #ececec;
				/* border-bottom: solid 2rpx #ececec; */
                font-size: 30rpx;
                padding: 0rpx 40rpx;
                .itemLeft{
                    width: 260rpx;
                }
		
                .itemCenter,{
                    flex-grow: 1;
                    color: #cfcfcf;
					white-space: nowrap;
					overflow: hidden;
					text-overflow: ellipsis;
                }
				textarea{
					height: 100rpx;
					padding-top: 30rpx;
					padding-left: 60rpx;
				}
                &:active {
                    background: #fafafa;
                }
            }
        }
    }
</style>

