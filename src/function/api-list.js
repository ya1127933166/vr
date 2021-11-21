export default {
    demo: {
        url: '/api/get-userinfo', // api的相对地址
        type: 'get', // 请求方式
        waitLogin: true, // 是否需要登录以后才能继续
        waitUser: true, // 是否需要完善用户信息以后才能继续
    },
    // 获取阿里云OSS上传签名数据
    getAliossSignature: {
        url: '/oss/getUploadSign',
        type: 'post',
        waitUser: true,
    },
    // 获取阿里云OSS的URL签名
    getAliossUrlSigned: {
        url: '/contract/getOssUrl',
        type: 'post',
        waitUser: true,
    },
    // 获取地点城市列表
    getLocationList: {
        url: '/main/region',
        type: 'post',
        waitUser: true,
    },
    // 获取城市下区域列表
    getRegionList: {
        url: '/region/listByRegionNo',
        type: 'post',
        waitUser: true,
    },
    // 首页获取我的数据
    getHomeMyData: {
        url: '/main/myHomeData',
        type: 'get',
        waitUser: true,
    },
    // 发现页 昨日数据
    getFindYesterday: {
        url: '/houseAna/yesterday',
        type: 'get',
        waitUser: true,
    },
    // 发现页 区域列表
    getFindRegion: {
        url: '/houseAna/areaList',
        type: 'get',
        waitUser: true,
    },
    // 发现页 区域数据
    getFindRegionData: {
        url: '/houseAna/top',
        type: 'get',
        waitUser: true,
    },
    // 更多小区
    getRegionData: {
        url: '/houseAna/top',
        type: 'get',
        waitUser: true,
    },
    // 获取房源配置
    getHouseConfigures: {
        url: '/houseApproval/houseConfig',
        type: 'get',
        waitUser: true,
    },
    // 提交房源申请
    postApplication: {
        url: '/houseApproval/saveDepositHouse',
        type: 'post',
        waitUser: true,
    },
    // 确认提交房源申请
    confirmPostApplication: {
        url: '/houseApproval/submitDepositHouse',
        type: 'get',
        waitUser: true,
    },
    // 获取房源信息
    getHouseData: {
        url: '/houseApproval/detail',
        type: 'get',
        waitUser: true,
    },
    // 搜索小区
    searchXiaoqu: {
        url: '/house/getDistrict',
        type: 'get',
        waitUser: true,
    },
    // 获取小区详情
    getXiaoqu: {
        url: '/houseAna/districtAna',
        type: 'get',
        waitUser: true,
    },
    // 状态数据 - 例如审批数量
    getStatusData: {
        url: '/houseApproval/getHouseApprovalNumber',
        type: 'get',
        waitUser: true,
    },
    // 签约列表
    getSigningList: {
        // url: '/houseApproval/getHouseApprovalList', old
        url: '/houseApproval/listByPageData',
        type: 'post',
        waitUser: true,
    },
    // 签约房源详情
    getSigningHouse: {
        url: '/houseApproval/detail',
        type: 'get',
        waitUser: true,
    },
    /**
     * 获取抄送人列表
     */
    getReviewCCList: {
        url: '/authUser/getCopyPerson',
        type: 'get',
        waitUser: true,
    },
    // 审批列表
    getCheckList: {
        // url: '/houseApproval/getHouseApprovalList', old
        url: '/houseApproval/listByPageData',
        type: 'post',
        waitUser: true,
    },
    // 驳回申请
    rejectSigningHouse: {
        url: '/houseApproval/approval',
        type: 'post',
        waitUser: true,
    },
    /**
     * 通过申请
     */
    checkSigningHouse: {
        url: '/houseApproval/approval',
        type: 'post',
        waitUser: true,
    },
    /**
     * 撤销申请
     */
    revokeHouse: {
        url: '/houseApproval/cancelApproval',
        type: 'get',
        waitUser: true,
    },
    /**
     * 缓存租房合同数据
     */
    getCacheRentContractData: {
        url: '/contract/getCacheData',
        type: 'post',
        waitUser: true,
    },
    /**
     * 缓存租房合同数据
     */
    cacheRentContractData: {
        url: '/contract/cacheData',
        type: 'post',
        waitUser: true,
    },
    /**
     * 保存租房合同数据
     */
    saveRentContractData: {
        url: '/contract/save',
        type: 'post',
        waitUser: true,
    },
    /**
     * 变更租房合同状态
     */
    updateRentContract: {
        url: '/contract/update',
        type: 'post',
        waitUser: true,
    },
    /**
     * 读取合同数据
     */
    getRentContract: {
        url: '/contract/getContractInfo',
        type: 'post',
        waitUser: true,
    },
    /**
     * 租房合同的生活费用列表接口
     */
    costListByRentContract: {
        url: '/contract/getContractLiveFee',
        type: 'post',
        waitUser: true,
    },
    /**
     * 交割单列表接口
     */
    materialList: {
        url: '/contract/costListsByType',
        type: 'get',
        waitUser: true,
    },
    /**
     * 在合同页获取房源列表
     */
    contractGetHouseList: {
        url: '/contract/list',
        type: 'post',
        waitUser: true,
    },
    /**
     * 读取身份证号码信息
     */
    readIDCard: {
        url: '/contract/idCardOut',
        type: 'post',
        waitUser: true,
    },
    /**
     * 查询线下二维码是否绑定
     */
    queryOfflineQrcodeBind: {
        url: '/common/queryBinding.htm',
        type: 'get',
        waitUser: true,
    },
    /**
     * 提交门店激活信息
     */
    submitActiveStoreInfo: {
        url: '/common/binding.htm',
        type: 'post',
        waitUser: true,
    },
    /**
     * 获取房东信息列表
     */
    getOfflineList: {
        url: '/common/list.htm',
        type: 'post',
        waitUser: true,
    },
};
