<template>
<view class="id-card">
    <view class="edit-mode">
        <view class="mode-name">身份证照片</view>
        <view class="edit-form-group idcard-photos">
            <view class="idcard-photo-item" @tap="uploadFace">
                <view class="idcard-photo-null"
                    v-if="!faceFilePath || faceFilePath.length === 0">
                    <view class="cuIcon-camera"></view>
                    <view class="tips-name">正面</view>
                </view>
                <view class="idcard-photo" v-else>
                    <image :src="faceFilePath" mode="aspectFit"></image>
                    <view class="uploading-tips" v-if="faceUploading">上传中...</view>
                </view>
            </view>
            <view class="idcard-photo-item" @tap="uploadBack">
                <view class="idcard-photo-null"
                    v-if="!backFilePath || backFilePath.length === 0">
                    <view class="cuIcon-camera"></view>
                    <view class="tips-name">反面</view>
                </view>
                <view class="idcard-photo" v-else>
                    <image :src="backFilePath" mode="aspectFit"></image>
                    <view class="uploading-tips" v-if="backUploading">上传中...</view>
                </view>
            </view>
        </view>
        <view class="mode-name">身份证信息</view>
        <view class="edit-form-group">
            <view @tap="clickItem('姓名')" class="form-item">
                <view class="form-item-name">姓名</view>
                <view class="form-item-value">
                    <input @blur="focusObj.name=false" :focus="focusObj.name" type="text" class="form-item-input" v-model.trim="form.cardName" placeholder="姓名" />
                </view>
            </view>
            <view class='cell'></view>
            <view @tap="clickItem('身份证')" class="form-item">
                <view class="form-item-name">身份证号</view>
                <view class="form-item-value">
                    <input @blur="focusObj.name=false" :focus="focusObj.idCard" type="idcard" class="form-item-input" v-model.trim="form.lesseeCertificateNum" placeholder="请填写身份证号码" />
                </view>
            </view>
            <view class='cell'></view>
            <view class="form-item">
                <view class="form-item-name">有效期</view>
                <view class="form-item-value">
                    <picker mode="date"
                        :value="form.cardValidDate"
                        :start="startDate"
                        @change="cardValidDate">
                        <view class="form-item-info null-tips" v-if="!form.cardValidDate">请选择证件有限期</view>
                        <view class="form-item-info" v-else>{{form.cardValidDate}}</view>
                    </picker>
                </view>
                <view class="form-item-arrow">
                    <view class="cuIcon-right"></view>
                </view>
            </view>
        </view>

        <button class="confirm-btn" @tap="backEvt">保存</button>
    </view>
</view>
</template>

<script>
/**
 * 上传身份证组件
 */
import dateFormat from '@/function/date-format';
import {uploadEvt} from "@/function/upload-upyun";
import {pathToBase64} from '../../components/comm/image-tools/index.js';


let fs = null;

const now = new Date();

export default {
    name: 'UploadIDCard',
    data() {
        return {
            imgData: {},
            type: '',
            faceFilePath: '',
            backFilePath: '',
            uploadedPath: {
                face: '',
                back: ''
            },
            faceUploading: false,
            backUploading: false,
            form: {
                lesseeCertificateNum: '',
                cardValidDate: '',
                frontCard: '',
                backCard: '',
                cardName: '',
                sex: '',
                nation: '',
                bornDate: '',
                lesseeDomicileAddress: '',
            },
            startDate: dateFormat.format('yyyy-mm-dd'),
            cloudResult: null,
            backed: false,
            focusObj:{
                name:false,
                idCard:false
            }
        };
    },
    onLoad(options) {
        if (options.type) {
            this.type = options.type;
        } else {
            this.type = 'renterContract';
        }
        fs = uni.getFileSystemManager();
        if (this.$$globalData.IDCardData) {
            const params = ['lesseeCertificateNum', 'cardValidDate', 'frontCard', 'backCard', 'cardName', 'sex', 'bornDate', 'nation', 'lesseeDomicileAddress'];
            params.forEach((i) => {
                const val = this.$$globalData.IDCardData[i];
                if (val) {
                    this.form[i] = val;
                }
            });
            this.faceFilePath = this.$$globalData.IDCardData.frontCard || '';
            this.backFilePath = this.$$globalData.IDCardData.backCard || '';
        }

        // 读取vuex中的证件信息
        const IDCard = this.$store.state.IDCard[this.type];
        if (IDCard) {
            if (this.form.frontCard.length > 0) {
                this.faceFilePath = IDCard.face;
            }
            if (this.form.backCard.length > 0) {
                this.backFilePath = IDCard.back;
            }
        }
    },
    onUnload() {
        if (!this.backed) {
            const { status } = this.validIDCard();
            if (status && this.$$globalMethod.confirmIDCard) {
                this.$$globalMethod.confirmIDCard({...this.form});
                this.imgData = {}
            }
        }
    },
    methods: {
        /**
         * 返回上一页，处理数据提交
         */
        backEvt() {
            const {
                status,
                message,
                type,
            } = this.validIDCard();
            if (status) {
                if (this.$$globalMethod.confirmIDCard) {
                    this.$$globalMethod.confirmIDCard({
                        ...this.form,
                        face: this.faceFilePath,
                        back: this.backFilePath
                    });
                }
                this.backed = true;
                uni.navigateBack({
                    detail: -1,
                });
            } else {
                this.checkEvt(type, message);
            }
        },
        /**
         * 身份证日期变更
         */
        cardValidDate(e) {
            this.form.cardValidDate = e.detail.value;
        },
        //把图片转换成base64
        imgToBase64(data){
            return new Promise((resolve,reject)=>{
                pathToBase64(data).then(base64 => {
                    resolve(base64)
                }).catch(error => {
                    console.error('imgToBase64',error)
                    reject(error)
                })
            })
        },
        /**
         * 选择并检查图片
         * @param {string} side 身份证面标识 face | back
         */
        async selectImage(side = 'face') {
            return new Promise((resole, reject) => {
                let imgPath = '';
                let imgData = '';
                uni.chooseImage({
                    count: 1,
                    sizeType: 'compressed',
                    success: (res) => {
                        // console.log("[选择图片]",res)
                        imgPath = res.tempFilePaths[0]
                        this.imgToBase64(imgPath).then(base64=>{
                            // console.log("[转换成base64]",base64)
                            imgData = base64

                            this.request({
                                url: 'https://dm-51.data.aliyun.com/rest/160601/ocr/ocr_idcard.json',
                                fullUrl: true,
                                type: 'post',
                                contentType: 'application/json; charset=UTF-8',
                                param: {
                                    "image": imgData,
                                    "configure": {side}
                                },
                                header: {
                                    Authorization: 'APPCODE da204e320deb433ba130b7f487bb335c'
                                }
                            }).then((res) => {
                                // console.log('request res', res)
                                const {statusCode} = res[1]
                                if (statusCode !== 200) resole({errMsg: res[1].data, hasError: true, code: statusCode})
                                resole({...(res[1].data), imgPath})
                            }).catch((e)=> reject({...e, hasError: true}))
                        }).catch((e)=> reject({...e, hasError: true}))
                    },
                    fail: (e)=> reject({...e, hasError: true})
                });

            })
        },
        /**
         * 上传正面身份证照片
         */
        async uploadFace() {
            try {
                const imageData = await this.selectImage('face');
                const {imgPath, num, name, hasError} = imageData;
                if (hasError) {
                    uni.showToast({
                        title: '上传身份证有误或识别失败,请确认后再次上传',
                        icon: 'none',
                        duration: 3000
                    });
                    return ;
                }
                this.imgData = {...this.imgData, ...imageData}
                // console.log(imageData)
                this.faceFilePath = imgPath;
                this.faceUploading = true;
                let urlType = ''
                switch (this.type) {
                    case "landlord": {
                        urlType = 'idCard';
                        break;
                    }
                    case "tenant": {
                        urlType = 'tenantIdCard';
                        break;
                    }
                    default:
                        console.warn('unexpect type of this.type', this.type);
                        uni.showToast({
                            title: '数据解析有误,请稍后尝试',
                            icon: 'error'
                        })
                        return;
                }
                const {url:ossFilePath} = await uploadEvt({tempFilePath: imgPath, urlType});
                // // const result = ["/landlord/id/1634374452751.png"];
                // console.log({res, result})
                this.faceUploading = false;
                this.form.frontCard = ossFilePath || 'face';
                this.readIDCard();
                // 保存正面
                this.$store.commit('updateIDCard', {
                    type: this.type,
                    data: {
                        face: this.faceFilePath,
                    },
                });
            } catch (error) {
                if (typeof error === 'string') {
                    uni.showToast({
                        title: error,
                        icon: 'none',
                    });
                }
                console.error('uploadFace',error);
            }
        },
        /**
         * 上传背面身份证照片
         */
        async uploadBack() {
            try {
                const imageData = await this.selectImage('back');
                const {imgPath, hasError} = imageData;
                if (hasError) {
                    uni.showToast({
                        title: '上传身份证有误或识别失败,请确认后再次上传',
                        icon: 'none',
                        duration: 3000
                    });
                    return ;
                }
                this.imgData = {...this.imgData, ...imageData}
                // console.log(imageData)
                this.backFilePath = imgPath;
                this.backUploading = true;
                let urlType = ''
                switch (this.type) {
                    case "landlord": {
                        urlType = 'idCard';
                        break;
                    }
                    case "tenant": {
                        urlType = 'tenantIdCard';
                        break;
                    }
                    default:
                        console.warn('unexpect type of this.type', this.type);
                        uni.showToast({
                            title: '数据解析有误,请稍后尝试',
                            icon: 'error'
                        })
                        return;
                }
                const {url:ossFilePath} = await uploadEvt({tempFilePath: imgPath, urlType});
                // // const result = ["/landlord/id/1634374452751.png"];
                // console.log({res, result})
                this.backUploading = false;
                this.form.backCard = ossFilePath || 'back';
                this.readIDCard();
                // 保存背面
                this.$store.commit('updateIDCard', {
                    type: this.type,
                    data: {
                        back: this.backFilePath,
                    },
                });
            } catch (error) {
                if (typeof error === 'string') {
                    uni.showToast({
                        title: error,
                        icon: 'none',
                    });
                }
                // console.log(error);
            }
        },
        /**
         * 读取身份证的信息
         */
        async readIDCard() {
            // console.log('in readIDCard', this.faceFilePath, this.backFilePath)
            if (this.faceFilePath.length === 0) {
                return null;
            } else if (this.backFilePath.length === 0) {
                return null;
            }
            const imgData = this.imgData;
            this.cloudResult = { ...imgData };
            if (imgData) {
                    const {num, name, sex, nationality, address, birth, end_date} = imgData;
                    this.form.lesseeCertificateNum = num;
                    this.form.cardName = name.replace(/\s/g, '');
                    // 性别
                    this.form.sex = sex;
                    // 民族
                    this.form.nation = nationality;
                    // 户籍
                    this.form.lesseeDomicileAddress = address;
                    this.form.bornDate = dateFormat.numberDateSplit(birth);

                    this.form.cardValidDate = dateFormat.numberDateSplit(end_date);
            }
            // 保存识别信息
            this.$store.commit('updateIDCard', {
                type: this.type,
                data: {
                    number: this.form.lesseeCertificateNum,
                    date: this.form.cardValidDate,
                    name: this.form.cardName,
                    sex: this.form.sex,
                    bornDate: this.form.bornDate,
                    cloud: this.cloudResult,
                },
            });
        },
        /**
         * 验证识别的身份证信息
         */
        validIDCard() {
            const res = {
                status: true,
                message: '',
                type: '',
            };
            if (!this.faceFilePath && !this.backFilePath) {
                return res;
            }
            if (this.form.lesseeCertificateNum.length !== 18) {
                if (!this.faceFilePath) {
                    return {
                        status: false,
                        message: '没有上传身份证正面照片，返回将清除已填写的内容，确认返回吗？',
                        type: 'cardNumFail',
                    };
                }
                if (!this.backFilePath) {
                    return {
                        status: false,
                        message: '没有上传身份证背面照片，返回将清除已填写的内容，确认返回吗？',
                        type: 'cardNumFail',
                    };
                }
                return {
                    status: false,
                    message: '身份证号码填写错误，返回将清除已填写的内容，确认返回吗？',
                    type: 'cardNumFail',
                };
            }
            if (!this.form.cardValidDate) {
                return {
                    status: false,
                    message: '身份证有效期填写错误，返回将清除已填写的内容，确认返回吗？',
                    type: 'cardDateFail',
                };
            }
            const d = dateFormat.parse(this.form.cardValidDate);
            if (d.getTime() < Date.now()) {
                return {
                    status: false,
                    message: '身份证有效期已过期，返回将清除已填写的内容，确认返回吗？',
                    type: 'cardDateValidFail',
                };
            }
            return res;
        },
        /**
         * 确认是否退出
         */
        checkEvt(type, message) {
            uni.showModal({
                content: message,
                cancelText: '取消',
                confirmText: '确认返回',
                success: (res) => {
                    if (res.confirm) {
                        this.form.lesseeCertificateNum = '';
                        this.form.cardValidDate = '';
                        const info = { ...this.form };
                        if (this.$$globalMethod.confirmIDCard) {
                            this.$$globalMethod.confirmIDCard(info);
                        }
                        uni.navigateBack({
                            detail: -1,
                        });
                    }
                },
            });
        },
        clickItem(text){
            if(text=='姓名'){
                setTimeout(()=>{
                    this.focusObj.name = true;
                },200)
            }else{
                setTimeout(()=>{
                    this.focusObj.idCard = true;
                },200)
            }
        }
    },
};
</script>

<style lang="scss">
page {
    background: #f8f8f8;
}
.edit-mode {
    .mode-name {
        padding: 40rpx 30rpx 16rpx;
        font-size: 26rpx;
        line-height: 1.2;
        color: #888;
    }
}

.idcard-photos {
    position: relative;
    padding: 20rpx 30rpx;
    background: #fff;
    &::before {
        content: '';
        position: absolute;
        top: 0;
        left: 0;
        right: 0;
        height: 1rpx;
        background: #eee;
    }
    &::after {
        content: '';
        position: absolute;
        left: 0;
        right: 0;
        bottom: 0;
        height: 1rpx;
        background: #eee;
    }
}

$itemSize: 80rpx;
.form-item {
    position: relative;
    display: flex;
    flex-wrap: wrap;
    flex-direction: row;
    justify-content: center;
    height: 100rpx;
    align-items: center;
    padding: 0rpx 40rpx;
    font-size: 30rpx;
    background: #fff;
    border-bottom: solid calc(1px / 2.5) #d9d9d9;
    // &:first-child::before {
    //     content: '';
    //     position: absolute;
    //     top: 0;
    //     left: 0;
    //     right: 0;
    //     height: 1rpx;
    //     background: #eee;
    // }
    // &::after {
    //     content: '';
    //     position: absolute;
    //     left: 30rpx;
    //     right: 0;
    //     bottom: 0;
    //     height: 1rpx;
    //     background: #eee;
    // }
    // &:last-child::after {
    //     left: 0;
    // }
    &:last-child{
        border-bottom: none;
    }
    &:active{
        background-color: #fafafa;
    }
}
.form-item-name {
    width: 200rpx;
    line-height: $itemSize;
}
.form-item-value {
    flex: 1;
}
.form-item-info {
    line-height: $itemSize;
    color: #333;
    &.null-tips {
        width: 100%;
        height: $itemSize;
        color: #888;
    }
}
.form-item-input {
    width: 100%;
    height: $itemSize;
    padding: 20rpx 0;
    line-height: ($itemSize - 40rpx);
    box-sizing: border-box;
}
.form-item-arrow {
    width: 40rpx;
    height: $itemSize;
    line-height: $itemSize;
    font-size: 32rpx;
    text-align: right;
    color: #aaa;
}
.form-item-sybmol {
    text-align: right;
}

.idcard-photos {
    display: flex;
    flex-wrap: wrap;
    flex-direction: row;
    justify-content: space-between;
    .idcard-photo-item {
        width: 50%;
        padding: 0 30rpx;
        text-align: center;
        image {
            width: 100%;
            height: 100%;
            min-height: 200rpx;
        }
    }
    .idcard-photo-item:first-child {
        border-right: 1rpx dashed #ddd;
    }
    .idcard-photo-null {
        width: 128rpx;
        height: 128rpx;
        padding: 20rpx 0;
        margin: 30rpx auto;
        text-align: center;
        border: 1rpx solid #eee;
        color: #333;
        box-sizing: border-box;
        .cuIcon-camera {
            font-size: 48rpx;
        }
    }
    .tips-name {
        line-height: 40rpx;
        font-size: 24rpx;
        color: #333;
    }
    .idcard-photo {
        position: relative;
        width: 100%;
        height: 100%;
    }
    .uploading-tips {
        position: absolute;
        top: 50%;
        right: 0;
        left: 0;
        height: 60rpx;
        margin-top: -30rpx;
        line-height: 60rpx;
        font-size: 24rpx;
        text-align: center;
        color: #fff;
        background: rgba(0, 0, 0, .5);
    }
}
.edit-mode .idcard-photos {
    padding: 30rpx 0;
}

.confirm-btn {
    width: 690rpx;
    height: 100rpx;
    margin: 60rpx auto;
    padding: 0;
    line-height: 100rpx;
    font-size: 34rpx;
    color: #fff;
    background: #00a680;
    &:active{
        background-color: #007e5e;
    }
}
</style>

