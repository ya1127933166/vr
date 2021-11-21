<template>
    <view class="owner-contract-recorder">
        <housing-info :housing-info="housingInfo" :info-first-title="housingInfo.fullTitle"
                      :has-arrow-right="true" :arrow-func="hrefDetail"
        >
        </housing-info>
        <CustomForm :form-data.sync="ownerForm" form-title="产权人" form-margin="20rpx 0 0" label-width="320rpx"
                    :title-func-text="showCoOwner ? '' : '+ 添加共有人'" @titleFunc="showCoOwner = true"
        ></CustomForm>
        <CustomForm :form-data.sync="coOwnerForm" form-title="产权共有人" form-margin="20rpx 0 0" label-width="320rpx"
                    title-func-style="color: #b85450"
                    :title-func-text="showCoOwner ? '- 删除共有人' : ''" @titleFunc="showCoOwner = false" v-if="showCoOwner"
        >
        </CustomForm>
        <CustomForm :form-data.sync="propertyForm" form-title="产权信息" form-margin="20rpx 0" label-width="320rpx"></CustomForm>
        <CustomForm :form-data.sync="contractForm" form-margin="20rpx 0" label-width="320rpx"></CustomForm>
        <CustomForm :form-data.sync="estateAgencyForm" form-margin="20rpx 0" label-width="320rpx"></CustomForm>
        <button class="form-submit-btn" @tap="_saveData"> 录入合同 </button>
        <popup-confirm :show-popup="showPopup" popup-title="录入合同确认"
                       :content-list="confirmList"
                       :btnList="popupBtnList"
                       @clickPopupMaskCallBack="showPopup=false"
                       @clickPopupCallBack="confirmSubmit"
        >
        </popup-confirm>

    </view>
</template>

<script>
import {mapState,mapMutations} from 'vuex';
import housingInfo from "@/components/comm/housingInfo/housingInfo";
import customForm from "@/components/comm/formInput/customForm";
import PopupConfirm from "@/components/comm/popupConfirm/popupConfirm";
import {strSpan} from "@/utils";
//import {uploadEvt} from "@/function/upload-upyun";

export default {
    name: "ownerContractRecorder",
    components: {
        customForm,
        housingInfo,
        PopupConfirm
    },
    data (){
        const propertyTypeArr = ['产权证','购房合同','协议','公证书','新证','老证']
        const propertyRentStatusArr = ['无租赁','已租赁']
        const propertyMortgageStatusArr = ['无抵押','有抵押']
        const callIdPage = (key ='') => ()=>{this.hrefToID(key)}
        const packUpPickList = (arr = []) => [...arr.map((item, idx) => ({id: idx + 1, val: item}))]
        const selectHuman = (key = '')=> ()=> {this._hrefToSelectHuman(key)}
        return {
            showCoOwner: false,
            ownerForm: [
                {
                    label: '业主姓名',
                    aim: 'ownerName',
                    val: '',
                    isRequest: true,
                    icon: {
                        url: this.$baseURL+'xcxicon/home-addrBook.png',
                        clickFuncKey: 'selectOwner'
                    },
                    placeholder: '请选择或输入'
                },
                {
                    label: '手机号码',
                    aim: 'ownerTel',
                    inputType: 'phone',
                    isRequest: true,
                    val: '',
                    placeholder: '请填写',
                },
                {
                    label: '身份证件',
                    aim: 'ownerId',
                    inputType: 'displayBox',
                    val: '',
                    isRequest: true,
                    disable: true,
                    icon: {
                        arrow: true,
                        clickFuncKey: 'callBackOwnerId'
                    },
                    boxClickFuncKey: 'callBackOwnerId',
                    placeholder: '请上传'
                },

            ], // 产权人
            coOwnerForm: [
                {
                    label: '共有人姓名',
                    aim: 'coOwnerName',
                    val: '',
                    icon: {
                        url: this.$baseURL+'xcxicon/home-addrBook.png',
                        clickFuncKey: 'selectCoOwner'
                    },
                    placeholder: '请选择或输入'
                },
                {
                    label: '手机号码',
                    aim: 'coOwnerTel',
                    inputType: 'phone',
                    rule: this.$utils.rulePattern('phone'), // 非必填但是填入后需要验证就可以加入rule但!isRequest
                    val: '',
                    placeholder: '请填写',
                },
                {
                    label: '身份证件',
                    aim: 'coOwnerId',
                    inputType: 'displayBox',
                    val: '',
                    rule: this.$utils.rulePattern('idNumber'), // 非必填但是填入后需要验证就可以加入rule但!isRequest
                    disable: true,
                    icon: {
                        arrow: true,
                        clickFuncKey: 'callBackCoOwnerId'
                    },
                    boxClickFuncKey: 'callBackCoOwnerId',
                    placeholder: '请上传'
                },
            ], // 产权共有人
            propertyForm: [
                {
                    label: '产权类型',
                    aim: 'propertyType',
                    val: 1,
                    icon: {
                        arrow: true,
                        clickFuncKey: 'updateId'
                    },
                    inputType: 'picker',
                    placeholder: '请选择',
                    rangeKey: 'val',
                    range: packUpPickList(propertyTypeArr),
                },
                {
                    label: '产权证号',
                    aim: 'propertyNo',
                    inputType: 'text',
                    val: '',
                    placeholder: '请填写',
                },
                {
                    label: '租赁情况',
                    aim: 'propertyRentState',
                    val: 1,
                    icon: {
                        arrow: true,
                        clickFuncKey: 'updateId'
                    },
                    inputType: 'picker',
                    placeholder: '请选择',
                    rangeKey: 'val',
                    range: packUpPickList(propertyRentStatusArr),
                },
                {
                    label: '抵押情况',
                    aim: 'propertyMortgageStatusArr',
                    val: 1,
                    icon: {
                        arrow: true,
                        clickFuncKey: 'updateId'
                    },
                    inputType: 'picker',
                    placeholder: '请选择',
                    rangeKey: 'val',
                    range: packUpPickList(propertyMortgageStatusArr),
                },
                {
                    label: '抵押银行',
                    aim: 'mortgageBank',
                    maxLength: '10',
                    isRequest: false,
                    val: '',
                    placeholder: '选填',
                },
            ], // 产权信息
            contractForm: [
                {
                    label: '产权证照/合同',
                    aim: 'propertyPhoto',
                    val: '',
                    inputType: 'displayBox',
                    isRequest: true,
                    disable: true,
                    icon: {
                        arrow: true,
                        clickFuncKey: 'updatePropertyPhoto'
                    },
                    boxClickFuncKey: 'updatePropertyPhoto',
                    placeholder: '请上传'
                },
            ], // 产权合同拍照
            estateAgencyForm: [
                {
                    label: '成交价格',
                    aim: 'salePrice',
                    inputType: 'decimal',
                    rule: this.$utils.rulePattern('decimal', 2),
                    isRequest: true,
                    textUnix: '万',
                    textUnixWidth: '70rpx',
                    val: '',
                    placeholder: '请填写',
                },
                {
                    label: '佣金比例',
                    aim: 'commissionRate',
                    inputType: 'decimal',
                    rule: this.$utils.rulePattern('decimal', 1),
                    isRequest: true,
                    textUnix: '%',
                    textUnixWidth: '70rpx',
                    val: '',
                    placeholder: '请填写 1-100, 最多1位小数',
                },
                {
                    label: '代理时间',
                    aim: 'agencyTime',
                    inputType: 'datePicker',
                    fields: 'day',
                    isRequest: true,
                    date0: {
                        start: '2000-01-01',
                        end: '2099-09-01'
                    },
                    date1: {
                        start: '2000-01-01',
                        end: '2099-09-01'
                    },
                    start: '',
                    end: ''
                },
                {
                    label: '代理合同附件',
                    aim: 'propertyContract',
                    val: '',
                    disable: true,
                    inputType: 'displayBox',
                    isRequest: true,
                    icon: {
                        arrow: true,
                        clickFuncKey: 'updateAgencyPhoto'
                    },
                    boxClickFuncKey: 'updateAgencyPhoto',
                    placeholder: '请上传'
                },
                {
                    label: '合同编号',
                    aim: 'contractNo',
                    maxLength: 35,
                    val: '',
                    placeholder: '可选',
                },
            ], // 代理表格
            storeFuncList: [
                {
                    name: 'callBackOwnerId',
                    func: ()=>{callIdPage('owner')()}
                },
                {
                    name: 'callBackCoOwnerId',
                    func: ()=>{callIdPage('coOwner')()}
                },
                {
                    name: 'selectOwner',
                    func: ()=>{selectHuman('owner')()}
                },
                {
                    name: 'selectCoOwner',
                    func: ()=>{selectHuman('coOwner')()}
                },
                {
                    name: 'updatePropertyPhoto',
                    func: ()=>{this.hrefToUpLoad('property')}
                },
                {
                    name: 'updateAgencyPhoto',
                    func: ()=>{this.hrefToUpLoad('agency')}
                }
            ],
            housingInfo: {},
            imgList: {
                owner: {
                    frontCard: '', backCard: ''
                },
                coOwner: {
                    frontCard: '', backCard: ''
                },
                propertyContracts: [],
                agencyContracts: []
            },
            popupBtnList: [
                {
                    text: '取消',
                    tapKey: 'cancel'
                },
                {
                    text: '确定录入',
                    tapKey: 'confirm'
                },
            ],
            ownerInfo: {},
            coOwnerInfo: {},
            confirmList: [],
            showPopup: false,
            requestParam: {}
        }
    },
    created(){
        uni.$on('upPice',(res)=>{
            // console.log(res)
            // console.log(res)
             if (res.type === 'property') {
                 if(res.property.length){
                     this.imgList.propertyContracts = res.property;
                     this.contractForm.find(item => item.aim === 'propertyPhoto').val = '已上传'
                 }else{
                      this.imgList.propertyContracts =[]
                       this.contractForm.find(item => item.aim === 'propertyPhoto').val = ''
                 }

            } else if (res.type === 'agency') {
                if(res.agency.length){
                      this.imgList.agencyContracts = res.agency
                      this.estateAgencyForm.find(item=>item.aim === 'propertyContract').val ='已上传'
                }else{
                     this.imgList.agencyContracts = []
                    this.estateAgencyForm.find(item=>item.aim === 'propertyContract').val =''
                }

            }
        })
    },
    mounted() {

        // this.$store.state.findPageClickItem = {
        //     "houseId": 404,
        //     "saleId": 121,
        //     "title": "保利金香槟 2室6厅2卫 2-6-702",
        //     "xqName": "保利金香槟",
        //     "tags": [],
        //     "houseUnit": "2室6厅2卫",
        //     "houseNo": "2-6-702",
        //     "orientation": "东北",
        //     "size": "22",
        //     "price": "2,868",
        //     "type": "sale",
        //     "houseImage": "https://uss.img.lezhulife.com/houses/1635345560955.png",
        //     "avgPrice": "1303636",
        //     "commissionRate": "5",
        //     "publicPics": ["https://uss.img.lezhulife.com/houses/1635345560955.png"],
        //     "rentalType": "sale",
        //     "rentalTypeStr": "二手房",
        //     "property": [],
        //     "sellPrice": "2,868",
        //     "houseSale": {"listPrice": "2,868"},
        //     "house": {"name": "保利金香槟 2室6厅2卫 2-6-702", "orientation": "东北", "areaSize": "22"},
        //     "areaSize": "22",
        //     "listPrice": "2,868",
        //     "fullTitle": "保利金香槟 2室6厅2卫 2-6-702",
        //     "priceUnit": "万",
        //     "area": "成都 · 青羊 · 外金沙 "
        // }
        const {findPageClickItem} = this.$store.state
        const {listPrice, commissionRate, houseNo} = findPageClickItem || {}
        // console.log('mounted',JSON.stringify(findPageClickItem))
        this.housingInfo = {...findPageClickItem, fullTitle: '', isFlag: true, houseNumber: houseNo || ''}
        if (listPrice) {
            const parseNum = +(listPrice.replace(',', ''))
            this.estateAgencyForm.find(item=>item.aim === 'salePrice').val = parseNum || ''
        }
        if (commissionRate) {
            const parseNum = +(commissionRate)
            this.estateAgencyForm.find(item=>item.aim === 'commissionRate').val = parseNum || ''
        }
        delete this.$store.state.findPageClickItem
        // 绑定全局函数
        this.storeFuncList.forEach((item) => {
            const {name, func} = item;
            // console.log({name, func})
            this.$store.state[name] = func
        })
    },
    onUnload(){
          // 卸载全局函数
        this.storeFuncList.forEach((item) => {
            const {name, func} = item;
            this.$store.state[name] = undefined
        })
        uni.$off('upPice')
    },
    watch: {
        'propertyForm': {
            handler(newValue, oldValue) {
                // console.log('newValue', newValue, oldValue)
                const propertyTypeRow = newValue.find((item) => item.aim==='propertyType')
                const {val: propertyTypeStatus, range: propertyTypeRange} = propertyTypeRow || {}
                const oldPropertyTypeRow = oldValue.find((item) => item.aim==='propertyType')
                const {val: oldPropertyType} = oldPropertyTypeRow || {}
                const mortgageStatusRow = newValue.find((item) => item.aim==='propertyMortgageStatusArr')
                const {val: mortgageStatus, range} = mortgageStatusRow || {}
                const oldMortgageStatusRow = oldValue.find((item) => item.aim==='propertyMortgageStatusArr')
                const {val: oldStatus} = oldMortgageStatusRow || {}
                // 有抵押的时候抵押银行是必填
                if (mortgageStatusRow !== oldStatus) {
                    const {val: matchRangeVal} = range.find((item) => {
                        // console.log(item)
                        return +item.id === +mortgageStatus
                    }) || {}
                    const bankRow = newValue.find((item) => item.aim === 'mortgageBank') || {};
                    bankRow.isRequest = matchRangeVal === '有抵押'
                    bankRow.placeholder = matchRangeVal === '有抵押' ? '请填写' : '选填';
                }
                // 产权证 新证 老证 -> 产权证号; 购房合同 -> 合同编号; 协议 -> 协议号; 公证书 -> 公证书号;
                if (propertyTypeStatus !== oldPropertyType) {
                    const {val: matchRangeVal} = propertyTypeRange.find((item) => {
                        // console.log(item)
                        return +item.id === +propertyTypeStatus
                    }) || {}
                    // console.log({matchRangeVal})
                    let propertyNoRow = newValue.find((item) => item.aim==='propertyNo')
                    switch (matchRangeVal) {
                        case '购房合同': {
                            propertyNoRow.label = '合同编号'
                            break;
                        }
                        case '协议': {
                            propertyNoRow.label = '协议号'
                            break;
                        }
                        case '公证书': {
                            propertyNoRow.label = '公证书号'
                            break;
                        }
                        case '产权证':
                        case '老证':
                        case '新证': {
                            propertyNoRow.label = '产权证号'
                            break;
                        }
                    }
                }
            },
            deep: true
        },
        showCoOwner: {
            handler(newValue, oldValue) {
                if (!newValue) {
                    this.coOwnerForm.forEach((item) => {
                        item.val = ''
                    })
                    this.coOwnerInfo = {}
                    this.requestParam = {}
                    this.imgList.coOwner = {
                        frontCard: '', backCard: ''
                    }
                }
            },
        }
    },
    methods: {
        ...mapState(['upTempImageList']),
        confirmSubmit(btnItem) {
            // console.log('confirmSubmit',btnItem)
            const {tapKey} = btnItem
            if (tapKey!=='confirm') {
                this.showPopup = false
                return;
            }
            const that = this;
            const {houseId, saleId, fullTitle, title} = this.housingInfo || {}
            this.request({
                url:'contract/agent/import',
                type:'POST',
                contentType: 'application/json;charset=utf-8',
                param: JSON.stringify(that.requestParam)
            }).then((res)=> {
                // console.log('success',res)
                const {data} = res[1];
                const {state, body} = data
                if (+state === 200) {
                    that.$$globalData.jumpPath = '/pages/contractApplication/contractApplication'
                    uni.reLaunch({
                        url:`/pages/addHouseSource/finish?type=${JSON.stringify({houseId, saleId, name: fullTitle || title || ''})}&origin=contract&contractId=${body.contractId || 0}`
                    })
                } else {
                    console.warn('import error', res)
                    uni.showToast({
                        title: '未录入成功,请稍后尝试',
                        icon: 'none',
                        duration: 3500
                    })
                }
            }).finally(()=> {
                that.requestParam = {}
                that.showPopup = false
            })

        },
        _saveData(e) {
            const IS_DEV = false;
            let requestParam = !IS_DEV ? {} : {}
                // {"houseId":134,"contract":{"contractNo":"","startDate":"20151018","endDate":"20211018"},"agent":{"ownerCustomerId":0,"coOwnerCustomerId":0,"ownerNo":"123123","ownerType":1,"ownerAttachUri":"/landlord/contract/1634525530293.png","rent":1,"mortgage":1,"mortgageBy":"bank","commissionRate":1,"attachUri":"/landlord/contract/1634525542827.png"},"idCards":[{"idNo":"513902199201250037","phone":"13313331333","name":"李宇坤","sex":"男","birth":"19920125","address":"成都市天府新区华阳天府大道南段2716号17栋1单元12楼1204号","nationality":"汉","endDate":"20320222","faceUri":"/landlord/id/1634525562084.png","backUri":"/landlord/id/1634525565243.png","frontFlag":"owner"},{"idNo":"513902199201250037","phone":"15515551555","name":"李宇坤","sex":"男","birth":"19920125","address":"成都市天府新区华阳天府大道南段2716号17栋1单元12楼1204号","nationality":"汉","endDate":"20320222","faceUri":"/landlord/id/1634525583705.png","backUri":"/landlord/id/1634525586974.png","frontFlag":"co-owner"}]}
            const {houseId, saleId} = this.housingInfo || {}
            if (!IS_DEV) {
                const result = this._packUpData([
                    this.ownerForm, this.coOwnerForm, this.propertyForm, this.contractForm, this.estateAgencyForm])
                // console.log('final submit', result, this.imgList)
                if (!result) return;
                const cleanUri = (url) => {
                    // 适配两种图片头
                    const headIndex = Math.max(url.indexOf('/landlord/id'), url.indexOf('/tenant/id'));
                    return headIndex > -1 ? url.slice(headIndex) : url
                }
                const ownerInfo = this.ownerInfo;
                const coOwnerInfo = this.coOwnerInfo;
                const {owner, coOwner, propertyContracts, agencyContracts} = this.imgList
                let {
                    // ownerName,
                    // coOwnerName,
                    contractNo,
                    agencyTime,
                    propertyNo,
                    salePrice,
                    propertyType,
                    propertyRentState,
                    propertyMortgageStatusArr,
                    mortgageBank,
                    ownerTel,
                    coOwnerTel,
                    commissionRate,
                } = result;
                const {name:ownerName, idNo: ownerId} = ownerInfo
                const {name:coOwnerName, idNo: coOwnerId} = coOwnerInfo
                let confirmList = [
                    {
                        text: `业主姓名: ${ownerName} (${this.$utils.strSpan({
                            str: ownerId,
                            spanIndexArr: [3, 6, -4],
                            joinStr: ' '
                        })})\n手机号码: ${this.$utils.strSpan({str: ownerTel, spanIndexArr: [3, 7, -4], joinStr: ' '})}`
                    }
                ]
                const errorToast = (title) => {
                    uni.showToast({
                        title: `请上传完整的${title}照片`,
                        icon: 'none',
                        duration: 3500
                    })
                }

                if (!ownerInfo.faceUri || !ownerInfo.backUri) {
                    errorToast('业主');
                    return;
                }
                commissionRate = (+commissionRate)
                if (!((1 <= commissionRate) && (commissionRate < 100))) {
                    uni.showToast({
                        title: `佣金比例需要在1-100之间`,
                        icon: 'none',
                        duration: 3500
                    })
                    return;
                }
                requestParam = {
                    "houseId": houseId, // "房源ID"
                    "saleId": saleId, // "二手房Sale ID"
                    "contract": {
                        "contractNo": contractNo || '', // "合同编号"
                        "startDate": this._formatDate(agencyTime.start), // "合同起始日期, 如: 20210921"
                        "endDate": this._formatDate(agencyTime.end), // "合同截止日期, 如: 20220920"
                    },
                    "agent": {
                        salePrice: salePrice || 0, // 实际售价
                        "ownerCustomerId": ownerInfo.customerId || 0, // "业主customer ID, 没有则为: 0"
                        "coOwnerCustomerId": coOwnerInfo.customerId || 0, // "共有人customer ID, 没有则为: 0"
                        "ownerNo": propertyNo,  // "权属编号/产权证号"
                        "ownerType": propertyType, // "1:产权证；2:购房合同；3:协议；4:公证书；5:新证；6:老证"
                        "ownerAttachUri": propertyContracts && propertyContracts.length ? propertyContracts.join(',') : '', // "产权证照/合同，多张,分隔"
                        "rent": propertyRentState, // "1:无租赁；2:有租赁"
                        "mortgage": propertyMortgageStatusArr, //"1:无抵押；2:有抵押"
                        "mortgageBy": mortgageBank, // "抵押银行名称"
                        "commissionRate": commissionRate, // "佣金比例(取值范围: 1-100, 允许1位小数)"
                        "attachUri": agencyContracts && agencyContracts.length ? agencyContracts.join(',') : '', // "合同附件，多张用,分隔"
                    },
                    "idCards": [
                        {
                            ...ownerInfo,
                            name: ownerName,
                            faceUri: cleanUri(ownerInfo.faceUri),
                            backUri: cleanUri(ownerInfo.backUri),
                            "phone": ownerTel, // "11位手机号"
                            "birth": this._formatDate(ownerInfo.birth), // "生日, 如19901201"
                            "endDate": this._formatDate(ownerInfo.endDate), // "有效截止日期: 如: 20350131"
                            "frontFlag": 'owner', // "业主: owner, 业主共有人: co-owner"
                        }
                    ]
                };
                if (Object.keys(coOwnerInfo).length) {
                    if (!coOwnerInfo.faceUri || !coOwnerInfo.backUri) {
                        errorToast('共有人');
                        return;
                    }
                    if (!coOwnerTel) {
                        uni.showToast({
                            title: `请完善共有人手机号码`,
                            icon: 'none',
                            duration: 3500
                        })
                        return;
                    }
                    requestParam.idCards.push({
                        ...coOwnerInfo,
                        name: coOwnerName,
                        faceUri: cleanUri(coOwnerInfo.faceUri),
                        backUri: cleanUri(coOwnerInfo.backUri),
                        "phone": coOwnerTel, // "11位手机号"
                        "birth": this._formatDate(coOwnerInfo.birth), // "生日, 如19901201"
                        "endDate": this._formatDate(coOwnerInfo.endDate), // "有效截止日期: 如: 20350131"
                        "frontFlag": 'co-owner', // "业主: owner, 业主共有人: co-owner"
                    })
                    confirmList.push({
                        text: `共有人姓名: ${coOwnerName} (${this.$utils.strSpan({
                            str: coOwnerId,
                            spanIndexArr: [3, 6, -4],
                            joinStr: ' '
                        })})\n手机号码: ${this.$utils.strSpan({str: coOwnerTel, spanIndexArr: [3, 7, -4], joinStr: ' '})}`,
                    })
                }
                confirmList[confirmList.length -1].needSpan = true;
                confirmList.push({
                    text: `合同附件: 已上传\n 代理时间: ${agencyTime.start} 至 ${agencyTime.end}`,
                })
                this.confirmList = confirmList
                this.showPopup = true;
            }
            // console.log('requestParam',requestParam)
            this.requestParam = requestParam
        },
        // 扁平化数据表格
        _packUpData(formDataList = []) {
            let result = {}
            const {
                idNumber: idRule,
                phone: phoneRule,
                number: numRule
            } = this.$utils.rulePattern('all')
            const errorToast = (title) => {
                uni.showToast({
                    title: title,
                    icon: 'error'
                })
            }
            let valid = true; // 是否验证通过 datePick等深obj时需要使用 否则还是会返回已验证通过的result回去
            // 表单校验
            const checkValid = ({isRequest, val, rule, label}) => {
                try {
                    if (isRequest && !val) {
                        errorToast('请完善' + label)
                        valid = false;
                        return false;
                    } else if (val) {
                        // console.log({rule, label, val, isRequest}, typeof rule.test)
                        if (rule) {
                            const reg = new RegExp(rule)
                            if (!(reg.test(val))) {
                                errorToast(label + '不符合规范,请检查')
                                valid = false;
                                return false;
                            }
                        }
                    }
                    return true;
                } catch (e) {
                    console.warn(e)
                    return false
                }
            }
            formDataList.forEach((formItem) => {
                formItem.forEach((rowItem) => {
                    const {aim, val, inputType, start, end, isRequest, label, rule} = rowItem;
                    // aim查重
                    if (result[aim] !== undefined) {
                        console.warn('Duplicate keyword! please check!', aim)
                        return false
                    }
                    switch (inputType) {
                        case 'datePicker': {
                            // console.warn('datePicker', rowItem, isRequest && (!start || !end), label)
                            if (isRequest && (!start || !end)) {
                                errorToast('请完善' + label)
                                valid = false;
                                return false;
                            } else {
                                const timeStart = new Date(start).getTime()
                                const timeEnd = new Date(end).getTime()
                                if (timeStart === timeEnd) {
                                    uni.showToast({
                                        title: label+' 开始和结束时间不能是同一天',
                                        icon: 'none',
                                        duration: 3500
                                    })
                                    valid = false;
                                    return false;
                                } else if (timeStart > timeEnd) {
                                    uni.showToast({
                                        title: label+' 开始时间不能在结束时间之后',
                                        icon: 'none',
                                        duration: 3500
                                    })
                                    valid = false;
                                    return false;
                                }
                                result[aim] = {start, end}
                                break;
                            }
                        }
                        case 'decimal':
                        case 'number': {
                            if (!checkValid({isRequest, val, rule: rule || numRule, label})) return false;
                            result[aim] = val
                            break;
                        }
                        case 'phone': {
                            if (!checkValid({isRequest, val, rule: rule || phoneRule, label})) return false;
                            result[aim] = val
                            break;
                        }
                        case 'idNumber': {
                            if (!checkValid({isRequest, val, rule: rule || idRule, label})) return false;
                            break;
                        }
                        case 'multiSelector': {
                            let multiSelectorResult = ''
                            // console.log('multiSelector',val)
                            for (const valElement of val) {
                                // console.log('valElement',valElement)
                                if (!checkValid({isRequest, val: valElement, rule: rule || '', label})) {
                                    valid = false;
                                    return false;
                                }
                            }
                            rowItem.stringPatten.forEach((item,idx) => {
                                multiSelectorResult += `${item}${val[idx]}`
                            })
                            result[aim] = multiSelectorResult
                            break;
                        }
                        default: {
                            if (!checkValid({isRequest, val, rule: rule || '', label})) return false;
                            result[aim] = val
                        }
                    }
                    // console.log('result',aim,'=',result[aim])
                })
            })
            return valid ? result : false
        },
        // 时间格式化 依需要更改
        _formatDate(dateStr) {
            return (dateStr || '').replaceAll('-','')
        },
        hrefDetail(e) {
            // console.log('hrefDetail', this.housingInfo)
            const {saleId, fullTitle, xqName} = this.housingInfo
            const obj = {
                name: fullTitle || xqName,
                id: saleId
            }
            uni.navigateTo({
                url: '../../subpackComm/pages/viewHousing/viewHousing?type=0&houseId='+JSON.stringify(obj),
                // complete: (e)=> console.log(e)
            })
        },
        _packUpInfoData(obj, receivedCardData) {
            const { cardName, lesseeCertificateNum, frontCard, nation, cardValidDate,
                backCard, sex, bornDate, lesseeDomicileAddress
            } = receivedCardData
            return {
                ...obj,
                idNo: lesseeCertificateNum,
                name: cardName,
                sex,
                birth: bornDate,
                address: lesseeDomicileAddress,
                nationality: nation,
                endDate: cardValidDate,
                faceUri: frontCard,
                backUri: backCard
            }
        },
        hrefToID(key='') {
            // console.log('in hrefToID', key)
            const that = this;
            this.$$globalMethod.confirmIDCard = (data) => {
                // console.log('confirmIDCard', data)
                const {cardName, lesseeCertificateNum, frontCard, backCard} = data
                if (cardName && lesseeCertificateNum && key) {
                    if (key === 'owner') {
                        // const ownerNameRow = this.ownerForm.find(row=> row.aim === 'ownerName');
                        // !ownerNameRow.val && (ownerNameRow.val = cardName)
                        const idRow = that.ownerForm.find(row=> row.aim === 'ownerId')
                        idRow.val = lesseeCertificateNum
                        that.ownerInfo = that._packUpInfoData(that.ownerInfo, data)
                    }
                    if (key === 'coOwner') {
                        // const coOwnerNameRow = this.coOwnerForm.find(row=> row.aim === 'coOwnerName');
                        // !coOwnerNameRow.val && (coOwnerNameRow.val = cardName)
                        const idRow = that.coOwnerForm.find(row=> row.aim === 'coOwnerId')
                        idRow.val = lesseeCertificateNum
                        that.coOwnerInfo = that._packUpInfoData(this.coOwnerInfo, data)
                    }
                    this.imgList[key] = {
                        frontCard, backCard
                    }
                }
                // this.hrefToUpLoad('after confirmIDCard')
            }
            const dataReload = (obj) => {
                const {idNo, name, sex, birth, address,
                    nationality, endDate, faceUri, backUri} = obj || {};
                const checkDate = (str) => str ? (str[4] === '-' ? str : this.$utils.strSpan({
                    str: str,
                    spanIndexArr: [4, 6],
                    joinStr: '-'
                })) : ''
                const imgBaseUrl = this.$baseURL;
                const frontCard = faceUri ? (faceUri.indexOf('http') > -1 ? faceUri : imgBaseUrl + faceUri) : ''
                const backCard = backUri ? (backUri.indexOf('http') > -1 ? backUri : imgBaseUrl + backUri) : ''
                this.$$globalData.IDCardData = {
                    lesseeCertificateNum: idNo || '',
                    cardValidDate: checkDate(endDate),
                    frontCard,
                    backCard,
                    cardName: name || '',
                    sex: sex || '',
                    bornDate: checkDate(birth),
                    nation: nationality || '',
                    lesseeDomicileAddress: address || ''
                }
            }
            if (key === 'owner') {
                dataReload(this.ownerInfo)
            } else if (key === 'coOwner') {
                dataReload(this.coOwnerInfo)
            }
            uni.navigateTo({
                url: '../../pages/uploadIdCard/uploadIdCard?type=landlord',
            })
        },
        _hrefToSelectHuman(key='') {
            // console.log('_hrefToSelectHuman', key)
            const errorToast = (humanType) => {
                setTimeout(() => {
                    uni.showToast({
                        duration: 3000,
                        icon: 'none',
                        title: `所选人员不能与${humanType}是同一人`,
                    })
                }, 500)

            }
            this.$store.state.selectHumanCallBack = (info) => {
                // console.log('selectHumanCallBack', info, this.ownerInfo)
                const {name, customer_id: customerId} = info

                if (key === 'owner') {
                    const {customerId: coOwnerId} = this.coOwnerInfo
                    if (customerId === coOwnerId) {
                        errorToast('产权共有人')
                        return;
                    }
                } else if (key === 'coOwner') {
                    const {customerId: ownerId} = this.ownerInfo
                    if (customerId === ownerId) {
                        errorToast('产权人')
                        return;
                    }
                }
                if (customerId) {
                    uni.showLoading({
                        title: '加载中...',
                    });
                    this.request({
                        url:'customer/getfull/'+customerId,
                        type:'GET',
                        // contentType: 'application/json;charset=utf-8',
                        // param: {customerId}
                    }).then(res=> {
                        const {body, state} = res[1].data
                        // console.log(res[1])
                        if (state === 200) {
                            const {avatar_url, idCard, name: bookName, phoneNumber} = body || {}
                            const {idNo, name, phone, sex, birth,
                                address, nationality, endDate, faceUrl, backUrl
                            } = idCard || {}
                            // console.log('customer/getfull', body, idNo)

                            if (key === 'owner') {
                                const nameRow = this.ownerForm.find((row) => row.aim === 'ownerName')
                                const telRow = this.ownerForm.find((row) => row.aim === 'ownerTel')
                                const IdRow = this.ownerForm.find((row) => row.aim === 'ownerId')
                                nameRow.val = bookName || ''
                                telRow.val = phone || phoneNumber || ''
                                IdRow.val = idNo || ''
                                this.ownerInfo = {
                                    ...this.ownerInfo,
                                    customerId,
                                    idNo, name, sex, birth,
                                    address, nationality,
                                    endDate:endDate && endDate.toString() || '', faceUri: faceUrl || '', backUri: backUrl || ''
                                };
                                // console.log('this.ownerInfo',this.ownerInfo)
                            } else if (key === 'coOwner') {
                                const nameRow = this.coOwnerForm.find((row) => row.aim === 'coOwnerName')
                                const telRow = this.coOwnerForm.find((row) => row.aim === 'coOwnerTel')
                                const IdRow = this.coOwnerForm.find((row) => row.aim === 'coOwnerId')
                                // console.log('IdRow',IdRow)
                                nameRow.val = bookName || ''
                                telRow.val = phone || phoneNumber || ''
                                IdRow.val = idNo || ''
                                this.coOwnerInfo = {
                                    ...this.ownerInfo,
                                    customerId,
                                    idNo, name, sex, birth,
                                    address, nationality,
                                    endDate:endDate && endDate.toString() || '', faceUri: faceUrl || '', backUri: backUrl || ''
                                };
                                // console.log('this.coOwnerInfo',this.coOwnerInfo)
                            }
                            this.$nextTick(() => {
                                uni.hideLoading();
                                delete this.$store.state.selectHumanCallBack
                            })
                        }
                    })
                }
            }
            uni.navigateTo({
                url: '../../subpackSource/pages/source/selectCustomer?callbackKey=selectHumanCallBack',
                // complete: (e) => {console.warn('selectCustomer',e)}
            })
        },
        hrefToUpLoad(key='') {
             if(key==='agency'){
                let arr = this.imgList.agencyContracts.map(ele=>{
                    return this.$baseURL + ele.substring(1)
                })
                // console.log(arr)
                this.$store.state.reloadUrl =  arr ||''
                uni.navigateTo({
                    url: '/pages/upload/upload?type=上传合同附件&numType=agency',
                })
             }
             if(key==='property'){
                let arr = this.imgList.propertyContracts.map(ele=>{
                    return this.$baseURL + ele.substring(1)
                })
                // console.log(arr)
                this.$store.state.reloadUrl =  arr ||''
                uni.navigateTo({
                    url: '/pages/upload/upload?type=产权证照&numType=property',
                })
             }
            // console.log('in hrefToUpLoad', key)
            // uni.chooseImage({
            //     // count: 3,
            //     sizeType: 'compressed',
            //     success: async (res) => {
            //         // console.log('choose', res)
            //         const {tempFiles} = res;
            //         const promiseList = tempFiles.map(item =>new Promise(((resolve, reject) => uploadEvt({
            //             tempFilePath: item.path,
            //             urlType: 'contract',
            //             // isDebug: true
            //         }).then((res)=> {
            //                 // console.log('done', res)
            //                 resolve(res)
            //             })
            //         )));
            //         const resultList = await Promise.all(promiseList).then((res)=> {
            //             // console.log('resultList then',res)
            //             return res
            //         })
            //         // console.log({resultList})
            //         const contractList = resultList.map((item) => item.url || '')

                    // if (key === 'property') {
                    //     this.imgList.propertyContracts = this.upTempImageList[0];
                    //     this.contractForm.find(item => item.aim === 'propertyPhoto').val = '已上传'
                    // } else if (key === 'agency') {
                    //     this.imgList.agencyContracts = this.upTempImageList[0]
                    //     this.estateAgencyForm.find(item=>item.aim === 'propertyContract').val ='已上传'
                    // }
            //     }
            // })

        },
    }
}
</script>

<style lang="scss" scoped>
.owner-contract-recorder {
    padding-bottom: 50rpx;
    .form-submit-btn {
        width: calc(100% - 20rpx);
        padding: 10rpx;
        background-color: #00a57f;
        color: #ffffff;
        font-size: 30rpx;
        margin: 50rpx 10rpx;
    }
}
</style>
