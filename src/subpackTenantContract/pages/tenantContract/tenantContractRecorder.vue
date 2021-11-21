<template>
    <view class="tenant-contract-recorder">
        <housing-info :housing-info="housingInfo" :info-first-title="housingInfo.fullTitle"
                      :has-arrow-right="true" :arrow-func="hrefDetail"
        >
        </housing-info>
        <block v-for="(itemForm, idx) in tenantFormList" :key="idx">
            <CustomForm :form-data.sync="itemForm.formData" :form-title="idx === 0 ? '租客信息': '合租人信息'"
                        form-margin="20rpx 0 0" :form-key="itemForm.formKey" label-width="320rpx"
                        :title-func-style="idx > 0 ? 'color: #b85450' : ''"
                        :title-func-text="idx === 0 ?titleFuncText:'- 删除合租人'"
                        @titleFunc="currentTitleFunc(idx)"
            ></CustomForm>
        </block>
        <CustomForm :form-data.sync="contractForm" form-title="合同信息" form-margin="20rpx 0" label-width="320rpx"></CustomForm>
        <CustomForm :form-data.sync="rentForm" form-margin="20rpx 0" label-width="320rpx"></CustomForm>
        <button class="form-submit-btn" @tap="_submitData"> 录入合同 </button>
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
import housingInfo from "@/components/comm/housingInfo/housingInfo";
import customForm from "@/components/comm/formInput/customForm";
import popupConfirm from "@/components/comm/popupConfirm/popupConfirm";
//import {uploadEvt} from "@/function/upload-upyun";


export default {
    name: "tenantContractRecorder",
    components: {
        customForm,
        housingInfo,
        popupConfirm
    },
    data (){
        const payTypeArr = ['一','二','三','四','五','六','七','八','九','十','十一','十二']
        const callIdPage = (key ='') => (formKey)=>{this.hrefToID(key, formKey)}
        const selectHuman = (key = '')=> (param)=> {this._hrefToSelectHuman(key, param)}
        return {
            tenantIdx: 0,
            // 租客信息
            tenantFormList: [],
            // 合同信息
            contractForm: [
                {
                    label: '合同时间',
                    aim: 'contractTime',
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
                    label: '付款方式',
                    aim: 'payType',
                    val: 0,
                    isRequest: true,
                    icon: {
                        arrow: true,
                        clickFuncKey: 'updateId'
                    },
                    inputType: 'multiSelector',
                    placeholder: '请选择',
                    stringPatten: ['押','付'],
                    rangeKey: 'val',
                    // range: this._packUpPickList(payTypeArr),
                    range: [
                        this._packUpPickList(payTypeArr.map(item=>'押'+ item)),
                        this._packUpPickList(payTypeArr.map(item=>'付'+ item)),
                    ],
                },
                {
                    label: '月租金',
                    aim: 'rentPrice',
                    inputType: 'decimal',
                    rule: this.$utils.rulePattern('decimal', 2),
                    isRequest: true,
                    textUnix: '元/月',
                    textUnixWidth: '100rpx',
                    val: '',
                    placeholder: '请填写 最多2位小数',
                },
                {
                    label: '押金',
                    aim: 'deposit',
                    isRequest: true,
                    inputType: 'decimal',
                    rule: this.$utils.rulePattern('decimal', 2),
                    textUnix: '元',
                    val: '',
                    placeholder: '请填写 最多2位小数',
                },
                {
                    label: '佣金',
                    aim: 'commission',
                    // isRequest: true,
                    zeroAllow: true,
                    rule: this.$utils.rulePattern('decimal', 2),
                    inputType: 'decimal',
                    textUnix: '元',
                    val: '',
                    placeholder: '选填 最多2位小数',
                },
            ],
            // 租客合同
            rentForm: [
                {
                    label: '租客合同附件',
                    aim: 'rentContract',
                    inputType: 'displayBox',
                    val: '',
                    isRequest: true,
                    icon: {
                        arrow: true,
                        clickFuncKey: 'updateRentPhoto'
                    },
                    boxClickFuncKey: 'updateRentPhoto',
                    placeholder: '请上传'
                },
                {
                    label: '合同编号',
                    aim: 'contractNo',
                    maxLength: 35,
                    val: '',
                    placeholder: '可选',
                },
            ],
            storeFuncList: [
                {
                    name: 'callBackTenantId',
                    func: (e, formKey)=>{callIdPage('tenant')(formKey)}
                },
                {
                    name: 'selectTenant',
                    func: (e, param)=>{selectHuman('tenant')(param)}
                },
                {
                    name: 'selectCoOwner',
                    func: ()=>{selectHuman('coOwner')()}
                },
                {
                    name: 'updateRentPhoto',
                    func: ()=>{this.hrefToUpLoad('rent')}
                }
            ],
            housingInfo: {},
            payTypeArr,
            confirmList: [],
            showPopup: false,
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
            imgList: {
                propertyContracts: [],
                rentContracts: []
            },
            requestParam: {},
            titleFuncText: '+ 添加合租人'
        }
    },
    created(){
        uni.$on('upPice',res=>{
            // console.log('传过来zp',res.agency)
            if (res.type === 'rent') {
                if(res.agency.length){
                    this.imgList.rentContracts = res.agency;
                     this.rentForm[0].val = '已上传'
                }else{
                    this.imgList.rentContracts = []
                    this.rentForm[0].val =''
                }
            }
        })
    },
    mounted() {
        // this.$store.state.findPageClickItem = {"houseId":283,"rentId":238,"title":"合租·保利金香槟 2室1厅1卫 2-1-1 公区","xqName":"保利金香槟","tags":[],"houseUnit":"2室1厅1卫","houseNo":"2-1-1","orientation":"东","size":"89","price":"3,000","type":"share-rent","houseImage":"https://uss.img.lezhulife.com/houses/1634107873309.png","payStr":"押1付3","pledge":"3000","commission":"3,000","areaSize":"89","publicPics":["https://uss.img.lezhulife.com/houses/1634107873309.png"],"listPrice":"3,000","fullTitle":"合租·保利金香槟 2室1厅1卫 2-1-1 公区","payType":"押1付3","rentalType":"sharerent","rentalTypeStr":"合租","property":[],"priceUnit":"元","area":"成都 · 青羊 · 外金沙 · 蜀鑫东路51号"}
        const {findPageClickItem} = this.$store.state;
        const {payType, listPrice, pledge, commission, houseNo} = findPageClickItem  || {}
        // console.log(JSON.stringify(findPageClickItem))
        this.housingInfo = {...findPageClickItem, fullTitle: '', houseNumber: houseNo || '', isFlag: true}  || {}

        this._reloadData({payType, listPrice, pledge, commission});
        delete this.$store.state.findPageClickItem
        // 绑定全局函数
        this.storeFuncList.forEach((item) => {
            const {name, func} = item;
            // console.log({name, func})
            this.$store.state[name] = func
        })
        this._createTenant()
    },
    onUnload(){
          // 卸载全局函数
        this.storeFuncList.forEach((item) => {
            const {name, func} = item;
            this.$store.state[name] = undefined
        })
        uni.$off('upPice')
    },
    methods: {
        _reloadData({payType = '', listPrice, pledge, commission}) {
            const parseNum = (str) => +(str.replace(',', '')) || ''
            if (payType) {
                const payTypeRow = this.contractForm.find(row=>row.aim==='payType');
                const {stringPatten} = payTypeRow
                const isNum = !isNaN(payType[1])
                let matchCase = []
                if (isNum) {
                    ['押','付'].forEach((charItem) => {
                        for (let i = 1; i < 13; i++) {
                            if (payType.indexOf(`${charItem}${i}`) > -1) {
                                matchCase.push(i);
                                break;
                            }
                        }
                    })
                } else {
                    const payTypeArr = this.payTypeArr;
                    stringPatten.forEach((charItem) => {
                        for (let i = 1; i < 13; i++) {
                            if (payType.indexOf(`${charItem}${payTypeArr[i-1]}`) > -1) {
                                matchCase.push(i);
                                break;
                            }
                        }
                    })
                }
                payTypeRow.val = matchCase
            }
            if (listPrice) {
                this.contractForm.find(item=>item.aim === 'rentPrice').val = parseNum(listPrice)
            }
            if (pledge) {
                this.contractForm.find(item=>item.aim === 'deposit').val = parseNum(pledge)
            }
            if (commission) {
                this.contractForm.find(item=>item.aim === 'commission').val = parseNum(commission)
            }
        },
        _packUpPickList(arr = []) {
            return [...arr.map((item, idx) => ({id: idx + 1, val: item}))]
        },
        currentTitleFunc(idx) {
            // console.log(idx)
            return idx === 0 ? this._createTenant() : this.removeTenant(idx)
        },
        removeTenant(idx) {
            // console.log('removeTenant',idx)
            this.titleFuncText = '+ 添加合租人'
            this.tenantFormList.splice(idx, 1);
        },
        _createTenant() {
            // 最多添加一位
            if (this.tenantFormList.length < 2) {
                const formKey = this.tenantIdx.toFixed() + this.$utils.randomString(3)
                this.tenantFormList.push({
                    formKey,
                    formData: this._tenantModel(formKey)
                })
                this.titleFuncText = this.tenantFormList.length === 1 ? '+ 添加合租人' : '';
                this.tenantIdx += 1
            }
        },
        _tenantModel(id = '') {
            return [
                {
                    label: '租客姓名',
                    aim: `tenantName${id}`,
                    val: '',
                    isRequest: true,
                    icon: {
                        url: this.$baseURL+'xcxicon/home-addrBook.png',
                        clickFuncKey: 'selectTenant'
                    },
                    placeholder: '请选择或输入'
                },
                {
                    label: '手机号码',
                    aim: `tenantTel${id}`,
                    inputType: 'phone',
                    isRequest: true,
                    val: '',
                    placeholder: '请填写',
                },
                {
                    label: '身份证件',
                    aim: `tenantId${id}`,
                    inputType: 'displayBox',
                    val: '',
                    isRequest: true,
                    icon: {
                        arrow: true,
                        clickFuncKey: 'callBackTenantId'
                    },
                    boxClickFuncKey: 'callBackTenantId',
                    placeholder: '请上传'
                },
            ]
        },
        confirmSubmit(btnItem) {
            // console.log('confirmSubmit',btnItem)
            const {tapKey} = btnItem
            if (tapKey!=='confirm') {
                this.showPopup = false
                return;
            }
            const that = this;
            const {houseId, rentId, fullTitle, title} = this.housingInfo || {}
            this.request({
                url:'contract/rent/import',
                type:'POST',
                contentType: 'application/json;charset=utf-8',
                param: JSON.stringify(this.requestParam)
            }).then((res)=> {
                // console.log('success',res)
                const {data} = res[1];
                const {state, body} = data
                if (state == 200) {
                    this.$$globalData.jumpPath = '/pages/contractApplication/contractApplication'
                    uni.reLaunch({
                        url:`/pages/addHouseSource/finish?type=${JSON.stringify({houseId, name: fullTitle || title || '', rentId})}&origin=contract&contractId=${body.contractId || 0}`
                    })
                } else {
                    // console.warn('import error', res)
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

        _submitData(e) {
            const IS_DEV = false;
            let requestParam = !IS_DEV ? {} : {}
                // {"houseId":134,"rentId":129,"contract":{"contractNo":"1129308120938102","startDate":"20210719","endDate":"20221019"},"rent":{"rentCustomerId":0,"coRentCustomerId":0,"payMethod":"3","price":2000,"pledge":1000.88,"commission":0.01,"attachUri":"/landlord/contract/1634627240870.png"},"idCards":[{"idNo":"513902199201250037","phone":"13511111111","name":"李宇坤","sex":"男","birth":"19920125","address":"成都市天府新区华阳天府大道南段2716号17栋1单元12楼1204号","nationality":"汉","endDate":"20320222","faceUri":"/landlord/id/1634627176221.png","backUri":"/landlord/id/1634627179685.png","frontFlag":"rent"},{"idNo":"513902199201250037","phone":"13622222222","name":"李宇坤2","sex":"男","birth":"19920125","address":"成都市天府新区华阳天府大道南段2716号17栋1单元12楼1204号","nationality":"汉","endDate":"20320222","faceUri":"/landlord/id/1634627201867.png","backUri":"/landlord/id/1634627205509.png","frontFlag":"co-rent"}]}
            const {houseId, rentId, fullTitle, title} = this.housingInfo || {}
            if (!houseId || !rentId) {
                uni.showToast({
                    title: '房屋信息缺失,请重新进入本页面',
                    icon: 'none',
                    duration: 3500
                })
                return;
            }
            if (!IS_DEV) {
                const result = this._packUpData([
                    ...this.tenantFormList.map((item)=> item.formData),
                    this.contractForm, this.rentForm])
                // console.log('final submit', result, this.imgList)
                // return;
                // 信息不完整 不继续提交
                if (!result) return;
                const {rentContracts} = this.imgList;
                const cleanUri = (url) => {
                    // 适配两种图片头
                    const headIndex = Math.max(url.indexOf('/landlord/id'), url.indexOf('/tenant/id'));
                    return headIndex > -1 ? url.slice(headIndex) : url
                }
                const {
                    contractNo,
                    contractTime,
                    payType,
                    rentPrice,
                    deposit,
                    commission,
                } = result;
                const errorToast = (title) => {
                    uni.showToast({
                        title: `请上传完整的${title}照片`,
                        icon: 'none',
                        duration: 3500
                    })
                }
                // 身份证信息是否完善 flag
                let valid = true;
                requestParam = {
                    "houseId": houseId, // "房源ID"
                    rentId, // "租赁ID"
                    "contract": {
                        "contractNo": contractNo, // "合同编号"
                        "startDate": this._formatDate(contractTime.start), // "合同起始日期, 如: 20210921"
                        "endDate": this._formatDate(contractTime.end), // "合同截止日期, 如: 20220920"
                    },
                    "rent": {
                        "rentCustomerId": 0, // "租客customer ID, 没有则为: 0"
                        "coRentCustomerId": 0, // 合租人id没有则为: 0
                        "payMethod": payType,  // 付款方式，如押1付3、押2付6等
                        "price": +((+rentPrice).toFixed(2)), // 月租金 最多2位小数
                        "pledge": +((+deposit).toFixed(2)), // 押金金额 最多2位小数
                        "commission": +((+commission).toFixed(2)), // 佣金金额 最多2位小数
                        "attachUri": rentContracts && rentContracts.length ? rentContracts.join(',') : '', // "合同附件，多张用,分隔"

                    },
                    "idCards": []
                };

                let confirmList = []
                const {pledge, price, commission: rentCommission} = requestParam.rent;
                this.tenantFormList.forEach((formItem, idx) => {
                    const {formData} = formItem;
                    const [nameRow, phoneRow, idRow] = formData;
                    const currentHuman = idx === 0 ? '租客' : '合租人'
                    // console.log('formData',formData)
                    const {val: phone} = phoneRow
                    const {
                        cardName,
                        faceUri,
                        backUri,
                        endDate,
                        birth,
                        sex,
                        address,
                        nationality,
                        val: idNumber,
                        customerId
                    } = idRow
                    if (customerId) {
                        requestParam.rent[`${idx === 0 ? 'r' : 'coR'}entCustomerId`] = customerId;
                    }
                    if (faceUri && backUri) {
                        confirmList.push({
                            text: `${currentHuman}姓名: ${cardName} (${this.$utils.strSpan({
                                str: idNumber,
                                spanIndexArr: [3, 6, -4],
                                joinStr: ' '
                            })})\n手机号码: ${this.$utils.strSpan({str: phone, spanIndexArr: [3, 7, -4], joinStr: ' '})}`
                        })
                        requestParam.idCards.push({
                            "idNo": idNumber, // "18位身份证号"
                            "phone": phone, // "11位手机号"
                            "name": cardName, // "身份证姓名"
                            "sex": sex, // "性别"
                            "birth": this._formatDate(birth), // "生日, 如19901201"
                            "address": address, // "身份证住址"
                            "nationality": nationality, // "民族, 如:汉"
                            "endDate": this._formatDate(endDate), // "有效截止日期: 如: 20350131"
                            "faceUri": cleanUri(faceUri), // "正面照片路径"
                            "backUri": cleanUri(backUri), //"反面照片路径"
                            "frontFlag": idx === 0 ? 'rent' : 'co-rent', // 租客 rent | 合租 co-rent
                        })
                    } else {
                        errorToast(currentHuman + '身份证')
                        valid = false;
                        return;
                    }
                })
                if (!valid) return;
                confirmList[confirmList.length -1].needSpan = true;
                confirmList.push({
                    text: `月租金:   ${price}元 \n付款方式: ${payType} \n押金:     ${pledge}元\n佣金:     ${rentCommission}元`,
                })
                confirmList.push({
                    text: `合同时间: ${contractTime.start} 至 ${contractTime.end} \n合同附件: 已上传`,
                })
                this.confirmList = confirmList;
                this.showPopup = true;
            }
            // console.log('requestParam',requestParam)
            // console.log(JSON.stringify(requestParam))
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
                if (!valid) return false;
                formItem.forEach((rowItem) => {
                    if (!valid) return false;
                    const {aim, val, inputType, start, end, isRequest, label, rule, zeroAllow} = rowItem;
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
                                        title: label + ' 开始和结束时间不能是同一天',
                                        icon: 'none',
                                        duration: 3500
                                    })
                                    valid = false;
                                    return false;
                                } else if (timeStart > timeEnd) {
                                    uni.showToast({
                                        title: label + ' 开始时间不能在结束时间之后',
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
                            const parseNum = +val
                            if (!checkValid({isRequest, val, rule: rule || numRule, label})) {
                                valid = false;
                                return false;
                            }
                            if (!zeroAllow && val && (isNaN(parseNum) || parseNum === 0)) {
                                uni.showToast({
                                    title: label + '格式不正确且需要大于0',
                                    icon: 'none',
                                    duration: 3500
                                })
                                valid = false;
                                return false;
                            }
                            if (parseNum > 999999.99) {
                                uni.showToast({
                                    title: label + '过大,不能大于999999.99',
                                    icon: 'none',
                                    duration: 3500
                                })
                                valid = false;
                                return false;
                            }
                            result[aim] = val
                            break;
                        }
                        case 'phone': {
                            if (!checkValid({isRequest, val, rule: rule || phoneRule, label})) {
                                valid = false;
                                return false;
                            }
                            result[aim] = val
                            break;
                        }
                        case 'idNumber': {
                            if (!checkValid({isRequest, val, rule: rule || idRule, label})) {
                                valid = false;
                                return false;
                            }
                            result[aim] = val
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
                            rowItem.stringPatten.forEach((item, idx) => {
                                multiSelectorResult += `${item}${val[idx]}`
                            })
                            result[aim] = multiSelectorResult
                            break;
                        }
                        default: {
                            if (!checkValid({isRequest, val, rule: rule || '', label})) {
                                valid = false;
                                return false;
                            }
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
        hrefToID(key='', formKey = '') {
            // console.log('in hrefToID', key, formKey)
            // return;
            this.$$globalMethod.confirmIDCard = (data) => {
                // console.log('confirmIDCard', data)
                const {cardName, lesseeCertificateNum, frontCard, backCard, cardValidDate, bornDate,
                    lesseeDomicileAddress, nation, sex} = data
                // return;
                if (cardName && lesseeCertificateNum) {
                    if (key === 'tenant') {
                        const {formData} = this.tenantFormList.find((formItem)=> formItem.formKey === formKey)
                        const idRow = formData[2];
                        // 懒得分变量了干脆一起装了
                        // console.log('match', formData)
                        // !formData[0].val && (formData[0].val = cardName)
                        idRow.cardName = cardName
                        idRow.val = lesseeCertificateNum
                        idRow.faceUri = frontCard;
                        idRow.backUri = backCard;
                        idRow.endDate = cardValidDate;
                        idRow.birth = bornDate
                        idRow.sex = sex
                        idRow.address = lesseeDomicileAddress
                        idRow.nationality = nation
                        // console.log(this.tenantFormList, formData)
                    }
                }
                // this.hrefToUpLoad('after confirmIDCard')
            }

            const dataReload = (obj) => {
                const {cardName, sex, birth, address, val,
                    nationality, endDate, faceUri, backUri} = obj || {};
                const checkDate = (str) => str ? (str[4] === '-' ? str : this.$utils.strSpan({
                    str: str,
                    spanIndexArr: [4, 6],
                    joinStr: '-'
                })) : ''
                // console.log('dataReload',obj)
                const imgBaseUrl = this.$baseURL;
                const frontCard = faceUri ? (faceUri.indexOf('http') > -1 ? faceUri : imgBaseUrl + faceUri) : ''
                const backCard = backUri ? (backUri.indexOf('http') > -1 ? backUri : imgBaseUrl + backUri) : ''
                this.$$globalData.IDCardData = {
                    lesseeCertificateNum: val || '',
                    cardValidDate: checkDate(endDate),
                    frontCard,
                    backCard,
                    cardName: cardName || '',
                    sex: sex || '',
                    bornDate: checkDate(birth),
                    nation: nationality || '',
                    lesseeDomicileAddress: address || ''
                }
            }
            if (key === 'tenant') {
                const {formData} = this.tenantFormList.find((formItem)=> formItem.formKey === formKey)
                const idRow = formData[2];
                dataReload(idRow)
            }
            uni.navigateTo({
                // url: '../../pages/uploadIdCard/uploadIdCard?type=tenant', // in page
                url: '../../../pages/uploadIdCard/uploadIdCard?type=tenant', // in sub pack
            })
        },
        _hrefToSelectHuman(key='', formKey= '') {
            // console.log('_hrefToSelectHuman', {key, formKey})
            const errorToast = (humanType) => {
                setTimeout(() => {
                    uni.showToast({
                        duration: 3000,
                        icon: 'none',
                        title: `所选人员不能与${humanType}是同一人`,
                        // complete: (e)=> console.warn(e)
                    })
                }, 500)

            }
            let currentIdx = 0;
            for (let i = 0; i < this.tenantFormList.length; i++) {
                const item = this.tenantFormList[i]
                if (item.formKey === formKey) {
                    currentIdx = i;
                    break;
                }
            }
            this.$store.state.selectHumanCallBack = (info) => {
                // console.log('selectHumanCallBack', info)
                const {name, customer_id: customerId} = info
                if (customerId && formKey) {
                    const otherForm = this.tenantFormList.filter((item) => item.formKey !== formKey);
                    // console.warn('otherForm',otherForm)
                    if (otherForm.length) {
                        const matchForm = otherForm.find((formItem) => {
                            const idRow = formItem.formData.find((row)=> row.aim === `tenantId${formItem.formKey}`);
                            const {customerId: othersId} = idRow || {}
                            return othersId && othersId === customerId
                        })
                        // console.warn('matchForm',matchForm)
                        if (matchForm) {
                            errorToast(currentIdx > 0 ? '租客' : '合租人')
                            return;
                        }
                    }
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
                            const {avatar_url, idCard, name: storeName, phoneNumber} = body || {}
                            const {idNo, name, phone, sex, birth,
                                address, nationality, endDate, faceUrl, backUrl
                            } = idCard || {}
                            // console.log('customer/getfull', body, idNo)
                            const matchForm = this.tenantFormList.find((item) => item.formKey === formKey);
                            const idRow = matchForm.formData.find((row)=> row.aim === `tenantId${formKey}`);
                            // console.log('matchForm', matchForm);
                            matchForm.formData.find((row)=> row.aim === `tenantName${formKey}`).val = storeName || '';
                            matchForm.formData.find((row)=> row.aim === `tenantTel${formKey}`).val = phone || phoneNumber || '';
                            idRow.cardName = name || ''
                            idRow.val = idNo || ''
                            idRow.customerId = customerId || '';
                            idRow.faceUri = faceUrl || '';
                            idRow.backUri = backUrl || '';
                            idRow.endDate = endDate ? endDate+'' : '';
                            idRow.birth = birth ? birth + '' : ''
                            idRow.sex = sex || ''
                            idRow.address = address || ''
                            idRow.nationality = nationality || ''
                            this.$nextTick(() => {
                                uni.hideLoading();
                                delete this.$store.state.selectHumanCallBack
                            })
                        }
                    })
                }
            }
            uni.navigateTo({
                // url: '../../subpackSource/pages/source/selectCustomer?callbackKey=selectHumanCallBack', // in page
                url: '../../../subpackSource/pages/source/selectCustomer?callbackKey=selectHumanCallBack', // in sub pack
                // complete: (e) => {console.warn('selectCustomer',e)}
            })
        },
        hrefToUpLoad(key='') {
            let arr = this.imgList.rentContracts.map(ele=>{
                    return this.$baseURL + ele.substring(1)
            })
            // console.log(arr)
            this.$store.state.reloadUrl =  arr ||''
            if(key==='rent'){
                uni.navigateTo({
                    url: '/pages/upload/upload?type=租客合同附件&numType=rent',
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
            //                 tempFilePath: item.path,
            //                 urlType: 'contract',
            //                 // isDebug: true
            //             }).then((res)=> {
            //                 // console.log('done', res)
            //                 resolve(res)
            //             })
            //         )));
            //         const resultList = await Promise.all(promiseList).then((res)=> {
            //             // console.log('resultList then',res)
            //             return res
            //         })
            //         // console.log({resultList})
            //         this.imgList.rentContracts = resultList.map((item) => item.url || '')
            //         this.rentForm[0].val = '已上传'
            //     }
            // })
        },
        hrefDetail(e) {
            // console.log('hrefDetail', this.housingInfo)
            const {rentId, fullTitle, xqName} = this.housingInfo
            const obj = {
                name: fullTitle || xqName,
                id: rentId
            }
            uni.navigateTo({
                url: '../../../subpackComm/pages/viewHousing/viewHousing1?type=0&houseId='+JSON.stringify(obj),
                complete: (e)=> console.log(e)
            })
        },
    }

}
</script>

<style lang="scss" scoped>
.tenant-contract-recorder {
    padding-bottom: 50rpx;
    .form-submit-btn {
        width: calc(100% - 20rpx);
        padding: 10rpx;
        background-color: #00a57f;
        color: #ffffff;
        font-size: 26rpx;
        margin: 10rpx 10rpx;
    }
}
</style>
