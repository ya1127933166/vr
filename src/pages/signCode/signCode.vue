<template>
    <view class="signCode">
        <view class="codeBox">
            <image :src="'data:image/png;base64,'+qrPath"></image>
        </view>
        <view class='codeText'>扫一扫二维码签署合同</view>
        <view class='shareBtn'>分享给业主</view>
        <view class='saveBtn'>保存到手机</view>
    </view>
</template>

<script>
export default {
    name:'signCode',
    data(){
        return{
            qrPath:''
        }
    },
    mounted(){
        this.getQrcode();
    },
    methods:{
        //获取二维码
        async getQrcode(){
            try {
                let res = await this.request({
                    url:'share/getQR',
                    type:'post',
                    param:{
                        scene:'1011',
                        page:'../../pages/signCode/signCode'
                    }
                })
                if(res[1].data.state==200){
                    this.qrPath = res[1].data.body
                }else{
                    uni.showToast({
                        title: this.$throwStatusCode(res[1].data.state,'获取二维码'),
                        icon:'none'
                    })
                }
            } catch (error) {
                uni.showToast({
                    title: '网络异常，请稍后重试',
                    icon:'none'
                })
            }
            

        }
    }
}
</script>

<style lang='scss' scoped>
page{
    background:white;
}
.signCode{
    width: 750rpx;
    height: 100vh;
    background-color: white;
    .codeBox{
        width: 500rpx;
        height: 500rpx;
        border: solid 1rpx #ccc;
        margin: 0 auto;
        transform: translateY(50rpx);
    }
    .codeText{
        padding-top: 80rpx;
        width: 750rpx;
        text-align: center;
        font-size: 24rpx;
        color: #888585;
        font-weight: 600;
    }
    .shareBtn,.saveBtn{
        width: 690rpx;
        height: 100rpx;
        color: white;
        background-color: #00a680;
        border-radius: 10rpx;
        text-align: center;
        line-height: 100rpx;
        margin: 80rpx auto 20rpx auto;
        font-size: 34rpx;
    }
    .saveBtn{
        margin-top: 20rpx;
        background-color: #666666;
    }
}
</style>