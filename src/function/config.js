// api接口通用请求地址
const mode = 'test';
const hostPaths = {
    // Front-sunshine的本机
    dev: 'http://192.168.3.106:88',
    // 测试环境
    test: 'https://xcx.bmgf.lezhulife.com/api/',
    // 生产环境
    production: 'https://xcx.bmgf.lezhulife.com/web-api',
};
export const host = hostPaths[mode];
// console.log(`当前模式：${mode}`);
// console.log(`请求地址：${host}`);

// 腾讯地图key - 正在使用 - 当前为开发key | 未申请企业key
export const qqmapkey = 'PZKBZ-SRG6R-3ENWI-WAM4B-SM5CO-6NBON';

export const dev = 'none'; // user伪装是登录用户 | none正常上线状态
export const devVersion = '1.0.6'; // 当前开发版本识别号 - 20200110
export const debug = false; // debug状态

// 阿里云OSS Host
export const aliossHost = 'https://lezhu-file.oss-cn-beijing.aliyuncs.com';
// 阿里云OSS 公共读Bucket
export const aliossBucket = 'lezhu-file';
export const aliossBucketParamName = 'LEZHUFILE';
// 阿里云OSS 私有Host
export const aliossPrivateHost = 'https://lezhu-contract.oss-cn-beijing.aliyuncs.com';
// 阿里云OSS 私有Bucket
export const aliossPrivateBucket = 'lezhu-contract';
export const aliossPrivateBucketParamName = 'LEZHUCONTRACT';

//全局图片前缀又拍云地址
export const baseURL = 'https://uss.img.lezhulife.com/';
export const imageSuperSmall =  '!v88x66';
export const imageSmall = '!v165x123';
export const imageMiddle = '!v600x336';
export const imageLarge = '!v1000x750';


/**
 * 租房合同的常量定义
 */
export const rentContract = {
    /**
     * 房屋交割单
     */
    houseMaterial: {
        // 电器类
        electricAppliance: {
            name: '电器类',
            queryType: '0',
            formType: 2,
            backKey: 'electrical',
        },
        // 家具类
        furniture: {
            name: '家具类',
            queryType: '1',
            formType: 2,
            backKey: 'furniture',
        },
        // 钥匙凭证
        KeyCert: {
            name: '钥匙凭证',
            queryType: '2',
            formType: 2,
            backKey: 'keyDocuments',
        },
        // 生活费用
        costOfLiving: {
            name: '生活费用信息',
            queryType: '3',
            formType: 1,
            backKey: 'life',
        },
        // 租房合同费用
        RentalContractFee: {
            name: '租房合同费用',
            queryType: '4',
            formType: 1,
            backKey: 'rentContractLiveFees',
        },
    },
};

/**
 * 对外
 */
export default {
    host,
    qqmapkey,
    debug,
    dev,
    devVersion,
    aliossBucket,
    aliossBucketParamName,
    aliossHost,
    aliossPrivateBucket,
    aliossPrivateBucketParamName,
    aliossPrivateHost,
    rentContract,
    baseURL,
    imageSmall,
    imageLarge,
    imageMiddle,
    imageSuperSmall
};
