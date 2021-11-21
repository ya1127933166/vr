/**
 * 验证规则方法
 * @author 周家俊
 * @update 2019/10/10
 * 
 * 具体类型
 * type: not-empty 不能为空（null, undefined, [], {})为空 isNotEmpty
 * type: isset 是否设置变量 isSetVar
 * type: number 整数验证（不包含小数点）isNumber
 * type: number-fixed 纯数字（不包含小数点）isNumberFixed
 * type: phone 验证国内11位手机号 isPhone
 */

/**
 * 不为空
 * null, undefined, [], {}
 * 均视为空
 * 此方法对Object只检查可枚举属性
 * @param {String|Object|Array} val 验证值
 * @param {Boolean} verifyClass 验证构造类 开启后，非String、Object、Array返回false
 */
const isNotEmpty = (val, verifyClass) => {
    if (val === null) return false;
    if (typeof val === 'undefined') return false;
    // 获取构造函数
    let nativeType = val.constructor.name;
    switch (nativeType) {
        case 'Array':
            return !!val.length;
        case 'String': {
            let str = val.trim();
            return !!str.length;
        }
        case 'Object': {
            let keys = Object.keys(val);
            // 只检查可枚举属性，不可枚举内容，不会发送到服务端
            return !!keys.length;
        }
    }
    // 非String、Object、Array返回false
    return !verifyClass;
};

/**
 * 已设置变量
 * @param {object} val 验证值
 * @param {Boolean} zero Number类型对象，数字为0，也视为有效值，即非NaN均为有效值
 */
const isSetVar = (val, zero) => {
    const varType = (typeof val);
    if (varType === 'undefined') {
        return false;
    }
    // 获取构造函数
    let nativeType = val.constructor.name;
    switch (nativeType) {
        case 'Array':
        case 'String':
        case 'Object':
            return isNotEmpty(val, true);
        case 'Number': {
            if (val === 0) {
                // 根据参数zero，决定数字为0，是否为有效值
                return !!zero;
            }
            return isNaN(val);
        }
    }
    // 其他未定义的判断语句的构造函数，视为有效声明的变量
    return true;
};

/**
 * 域名验证
 * @param {String} val 
 */
const isDomain = (val) => {
    const reg = /^(?=^.{3,255}$)[a-zA-Z0-9][-a-zA-Z0-9]{0,62}(\.[a-zA-Z0-9][-a-zA-Z0-9]{0,62})+$/;
    return reg.test(val);
};

/**
 * IP验证
 * @param {String} val 
 */
const isIPAddress = (val) => {
    const reg = /(?=(\b|\D))(((\d{1,2})|(1\d{1,2})|(2[0-4]\d)|(25[0-5]))\.){3}((\d{1,2})|(1\d{1,2})|(2[0-4]\d)|(25[0-5]))(?=(\b|\D))/;
    return reg.test(val);
};

/**
 * 整数验证
 * @param {Number|String} val 验证值
 * @param {Boolean} positive 正数验证
 */
const isNumber = (val, positive) => {
    let str = val.toString().trim();
    if (!str.length) {
        return false;
    } else if (!positive && str.indexOf('-') === 0) {
        str = str.substring(1);
    }
    return !(/[^0-9]/.test(str));
};

/**
 * 验证浮点数字
 * 验证小数点后几位是允许的
 * @param {Number|String} val 验证值
 * @param {Number} len 小数点后几位
 */
const isNumberFixed = (val, len = 8) => {
    if (len === 0) return isNumber(val);
    let str = `${val}`.trim();
    if (/[^0-9\-\.]/.test(str)) {
        return false;
    } else if (str.indexOf('.') === 0) {
        return false;
    } else if (str.indexOf('.') === str.length - 1) {
        return false;
    }
    if (str.indexOf('-') > -1) {
        str = str.substring(1);
        if (str.indexOf('-') > -1) return false;
    }
    let mth = str.match(/\./g);
    // 如果出现一个以上的小数点，不合法
    if (mth && mth.length > 1) {
        return false;
    } else if (!mth) { // 未匹配到小数点视为整数验证
        return isNumber(val);
    }
    let dotAfter = str.split('.')[1];
    if (dotAfter.length > len) return false;
    return true;
};

/**
 * 验证手机号
 * 中国大陆地区
 * @param {Number|String} val 验证值
 */
const isPhone = (val) => {
    let str = `${val}`.trim();
    if (str.length === 11) {
        return /^1[0-9]{0,10}/.test(str);
    }
    return false;
};

/**
 * 对外暴露方法
 */
export const methods = {
    isNotEmpty,
    isSetVar,
    isDomain,
    isIPAddress,
    isNumber,
    isNumberFixed,
    isPhone,
};

/**
 * 暴露默认方法
 * @param {string} type 验证类型
 * @param val 验证值
 * @param param 验证参数
 */
const verifyRules = (type, val, param) => {
    switch (type) {
        case 'number':
            return isNumber(val, param);
        case 'number-fixed':
            return isNumberFixed(val, param);
        case 'not-empty':
            return isNotEmpty(val, param);
        case 'isset':
            return isSetVar(val, param);
        case 'phone':
            return isPhone(val);
        case 'domain':
            return isDomain(val);
        case 'ip':
            return isIPAddress(val);
    }
    // 默认都是通过
    return true;
};

['isNotEmpty', 'isSetVar', 'isDomain', 'isIPAddress', 'isNumber', 'isNumberFixed', 'isPhone'].forEach((i) => {
    Object.defineProperty(verifyRules, i, {
        value: methods[i],
    });
});

export default verifyRules;
