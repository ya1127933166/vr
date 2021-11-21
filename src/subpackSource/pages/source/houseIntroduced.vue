<template>
	<view class="">
		<view class="house_top">
			<view class="top_left">
				房源
			</view>
			<view class="top_right">
				<view class="">
					{{pageList.type[0]}} {{pageList.type[1]}} {{pageList.type[2]}}
				</view>
				<view class="">
					{{pageList.type[3]}}万  {{pageList.type[4]}}㎡
				</view>
				<view class="">
					{{pageList.type[5]}}·{{pageList.type[6]}}·{{pageList.type[7]}}
				</view>
			</view>
			
		</view>
			<view v-if="flag">
				<view class="house_content" >
					<view class="content_item">
						<view class="font_siez">
							核心卖点<text>({{sellingNum}}/120)</text>
						</view> 
						<textarea v-model="selling"  maxlength=120  placeholder-style='color:#cccccc'  placeholder='可以从户型、朝向、楼层位置、装修、性价比等方向描述'></textarea>
					</view>
					<view class="content_item">
						<view class="font_siez">
							小区介绍<text>({{plotNum}}/120)</text>
						</view> 
						<textarea v-model="plot"  maxlength=120 placeholder-style='color:#cccccc'  placeholder='可以从小区环境、基础设施、安保、车位、人车分离等方向描述'></textarea>
					</view>
					<view class="content_item">
						<view class="font_siez">
							周边配套<text>({{circumNum}}/120)</text>
						</view> 
						<textarea v-model="circum"  maxlength=120 placeholder-style='color:#cccccc'  placeholder='可以从周边商场、学校、医院、地铁线路、公交线路等方向描述'></textarea>
					</view>
					<view class="content_item">
						<view class="font_siez">
							交通出行<text>({{trafficNum}}/120)</text>
						</view> 
						<textarea v-model="traffic"  maxlength=120 placeholder-style='color:#cccccc' placeholder='可以从小区附近公交、地铁等进行描述'></textarea>
					</view>
				</view>
				<view @tap="nextBtn"  class='nextBtn'>保存</view>
			</view>
	</view>
</template>

<script>
	export default{
		name:'houseintroduced',
		data(){
			return{
				flag:false,
				pageList:{},
				selling:'',
				sellingNum:0,
				plot:'',
				plotNum:0,
				circum:'',
				circumNum:0,
				traffic:'',
				trafficNum:0,
				houseProperty:{
					house:{
						id:''
					},
					property:[
						{type:20,property:''},
						{type:21,property:''},
						{type:22,property:''},
						{type:23,property:''},
					]
				}
				

			}
		},
		onLoad(options){
			this.pageList= JSON.parse(options.item)
			console.log('aa',this.pageList)
			uni.hideLoading()
			this.propertyInfo()
		},
		watch:{
			selling:{
				handler(newValue,oldValue){
					this.sellingNum = newValue.length
					if(this.sellingNum >120){
						this.selling = newValue.substring(0,120);
						this.sellingNum = 120
						uni.showToast({
							title:'字数不能超过120',
							icon:'none'
						})
					}
				}
			},
			plot:{
				handler(newValue,oldValue){
					this.plotNum = newValue.length
					if(this.plotNum >120){
						this.plot = newValue.substring(0,120);
						this.plotNum = 120
						uni.showToast({
							title:'字数不能超过120',
							icon:'none'
						})
					}
				}
			},
			circum:{
				handler(newValue,oldValue){
					this.circumNum = newValue.length
					if(this.circumNum >120){
						this.circum = newValue.substring(0,120);
						this.circumNum = 120
						uni.showToast({
							title:'字数不能超过120',
							icon:'none'
						})
					}
				}
			},
			traffic:{
				handler(newValue,oldValue){
					this.trafficNum = newValue.length
					if(this.trafficNum >120){
						this.traffic = newValue.substring(0,120);
						this.trafficNum = 120
						uni.showToast({
							title:'字数不能超过120',
							icon:'none'
						})
					}
				}
			}
		},
		methods:{
			async propertyInfo(){
				uni.showLoading({
					title:'加载中...'
				})
				try{
					let res = await this.request({
						url:'house/introduce/info ',
						type:'post',
						param:{houseId:this.pageList.id}
					})
					if(res[1].data.state==200){
						console.log(res[1].data.body)
						for(let i=0;i<res[1].data.body.length;i++){
							if(res[1].data.body[i].type==20){
								this.selling = res[1].data.body[i].name
							}else if(res[1].data.body[i].type==21){
								this.plot = res[1].data.body[i].name
							}else if(res[1].data.body[i].type==22){
								this.circum = res[1].data.body[i].name
							}else{
								this.traffic = res[1].data.body[i].name
							}
						}
						this.flag = true
						uni.hideLoading()
					}
				}catch(e){
					console.log(e)
				}
			},
			async submitProperty(){
					try{
						let res = await this.request({
							url:'house/introduce/update',
							contentType:'application/json;charset=utf-8',
							type:'post',
							param:this.houseProperty
						})
						if(res[1].data.state==200){
							wx.hideLoading()
							wx.showToast({
							  title: '提交成功',
							  icon:'none'
							})
							uni.$emit('updateIntroduce',{type:1})
							setTimeout(() => {
								uni.navigateBack({
								delta:-1
								})
							}, 800);
						}else{
							wx.hideLoading()
							wx.showToast({
							  title: '提交失败',
							  icon:'none'
							})
						}
					}catch{

					}
				},
			nextBtn(){
				wx.showLoading({
				  title: '提交中...',
				})
				this.houseProperty.house.id = this.pageList.id
				this.sellingNum>0?this.houseProperty.property[0].property=this.selling.trim():''
				this.plotNum>0?this.houseProperty.property[1].property=this.plot.trim():''
				this.circumNum>0?this.houseProperty.property[2].property=this.circum.trim():''
				this.trafficNum>0?this.houseProperty.property[3].property=this.traffic.trim():''
				this.houseProperty = JSON.stringify(this.houseProperty)
				this.submitProperty()
			}
			}
	}
</script>

<style lang='scss' scoped>
	.house_top{
		width: 750rpx;
		padding: 0 85rpx;
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
	.house_content{
		width: 750rpx;
		margin-top: 20rpx;
		padding: 0 50rpx;
		overflow: hidden;
		background-color: #FFFFFF;
		.content_item{
			margin-top: 30rpx;
			.font_siez{
				font-size: 32rpx;
				text{
					display: inline-block;
					margin-left: 18rpx;
					font-size: 28rpx;
				}
			}
		}
		textarea{
			padding-top: 20rpx;
			height: 120rpx;
			width: 650rpx;
			border-bottom: solid calc(1px / 2.5) #d9d9d9;
		}
	}
	.nextBtn{
        width: 680rpx;
        height: 100rpx;
        background-color:#00a680;
        color:white;
        line-height: 100rpx;
        text-align: center;
        margin: 30rpx auto;
        border-radius: 10rpx;
        font-size: 34rpx;
        &:active{
            background:#007e5e;
        }
    }
</style>
