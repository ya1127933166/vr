<template>
	<view :class="[model=='top'?'tip_top':'tip_bottom']" class="fontNum">
		<slot></slot>
		<view :style="'transform: translateX('+x+'%) translateY('+y+'%);'" v-show="isShow" class="tipBox">{{text}}</view>
	</view>
</template>

<script>
	export default{
		props:{
			//控制气泡框显示位置，有上下两个选项
			model:{
				type:String,
				default:'bottom'
			},
			//气泡框内容
			text:{
				type:String,
				default:''
			},
			//在气泡框位置不理想时可传递x坐标改变气泡框x轴位置
			x:{
				type:String,
				default:'2'
			},
			//在气泡框位置不理想时可传递y坐标改变气泡框y轴位置
			y:{
				type:String,
				default:'-55'
			}
		},
		data(){
			return{
				isShow:false
			}
		},
		methods:{
			//打开气泡框
			open(){
				this.isShow = true
			},
			//关闭气泡框
			close(){
				this.isShow = false
			}
		}
	}
</script>

<style lang="scss" scoped>
	.tip_top{
		position: relative;
		transition: 0.2s;
		.tipBox{
			position: absolute;
			width: 300rpx;
			font-size: 24rpx;
			color: #666666;
			background-color: white;
			z-index: 1;
			border: solid 1rpx #e6e6e6;
			padding: 24rpx 20rpx;
			border-radius: 10rpx;
			left: -20rpx;
			bottom: 0;
			
			&::after{
				content: '';
				position: absolute;
				background-color: white;
				display: block;
				width: 20rpx;
				height: 20rpx;
				border: solid 1rpx #e6e6e6;
				z-index: 2;
				transform: translateX(80%) translateY(54%) rotate(45deg);
				left: 0;
				bottom: 0;
				border-left: none;
				border-top: none;
			}
		}
		
	}
	
	.tip_bottom{
		position: relative;
		transition: 0.2s;
		.tipBox{
			position: absolute;
			width: 300rpx;
			font-size: 24rpx;
			color: #666666;
			background-color: white;
			z-index: 1;
			border: solid 1rpx #e6e6e6;
			padding: 24rpx 20rpx;
			border-radius: 10rpx;
			transform: translateX(-80%) translateY(10%);
			&::after{
				content: '';
				position: absolute;
				background-color: white;
				display: block;
				width: 20rpx;
				height: 20rpx;
				border: solid 1rpx #e6e6e6;
				z-index: 2;
				transform: translateX(-140%) translateY(-54%) rotate(45deg);
				border-bottom: none;
				border-right: none;
				top: 0;
				right: 0;
			}
			
		}
		
	}
</style>
