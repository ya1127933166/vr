/**
 * 公共正则
 * @param {String} type 正则类型  idNumber phone number decimal
 * @param param decimal时的精度
 * @returns {*} 正则式或warn
 */
export function rulePattern(type = '', param = 2) {
	const patternMap = {
		idNumber: "(^\\d{15}$)|(^\\d{18}$)|(^\\d{17}(\\d|X|x)$)",
		phone: "^(13[0-9]|14[5|7]|(15|17|18|19)[0-9])\\d{8}$",
		number: "^[0-9]*$",
		decimal: "^([0-9]*)+(\\.[0-9]{1,"+ param +"})?$"
	}
	if (type && patternMap[type]) {
		return patternMap[type]
	} else if (type === 'all') {
		return patternMap
	}else {
		console.warn('unexpect ruleRxp type:', {type, patternMap: patternMap[type] || 'can not match'})
		return false
	}

}

/* 防抖函数 */
	let timeout = null
	let flag = true
 // 创建一个标记用来存放定时器的返回值
//!!!!这里一定要把变量设在外面，不然会失效！我搞了好久才搞明白！
export function debounce(fn,delay) {


	return function() {
		clearTimeout(timeout) // 每当用户输入的时候把前一个 setTimeout clear 掉
		if(flag){
			fn.apply(this, arguments)
			flag = false
		}
		timeout = setTimeout(() => {
			flag = true
		}, delay)
	}
}

// 防抖标记
let canThrottle = true;
// 防抖计时器句柄
let throttleHandle = null;

/**
 *	防抖函数 debounce
 * @param {Function} fn 回调
 * @param {Number = 500} delay 延时
 */
export function throttleTool(fn = () => {}, delay = 500) {
	if (canThrottle) {
		if (typeof fn !== "function") {
			console.warn('fn is not a func in throttle')
			return;
		}
		canThrottle = false;
		const clearHandle = () => {
			clearTimeout(throttleHandle);
			throttleHandle = null;
		}
		if (throttleHandle) {
			clearHandle()
		}
		throttleHandle = setTimeout(() => {
			canThrottle = true
			fn()
			clearHandle()
		}, delay || 300)
	}
}

// 首页 home 房源 find 客源 mine
let storePage = '';
/**
 * 保存当前页面
 * @param {String | 'home'| 'find'| 'mine'| 'other'} currentPage
 */
export function storeCurrentPage(currentPage = '') {
	if (currentPage) {
		storePage = currentPage;
		// console.log('storeCurrentPage', currentPage)
	}
}

/**
 * 检查当前页面是否匹配
 * @param {String | 'home'| 'find'| 'mine'} currentPage
 * @returns {boolean|boolean}
 */
export function matchPage(currentPage = '') {
	return storePage ? storePage === currentPage : true
}

/**
 * 字符串插字
 * @param str 指定字符串
 * @param {Array} spanIndexArr 间隔数组
 * @param joinStr 插入字符 默认为英文空格
 * @returns {string}
 */
export function strSpan({str, spanIndexArr, joinStr}) {
	if (!str) return ''
	if (!joinStr) return str
	let resultMap = {}
	let finalArr = []
	let result = ''
	let strArr = String(str).split('')
	// console.log(String(str).split(''), spanIndexArr)
	strArr.forEach((item, idx) => {
		resultMap[idx] = {
			text:item,
			pushItem: []
		}
	})
	const strLength = strArr.length
	spanIndexArr.forEach((item) => {
		if (item >= strLength) {
			finalArr.push(joinStr)
		} else if (item >= 0) {
			const mapItem = resultMap[`${item}`];
			// console.log(mapItem, item)
			mapItem.pushItem.push(joinStr)
		} else {

			const mapItem = resultMap[`${strLength + item}`];
			// console.log(mapItem, strLength + item, strLength, item)
			mapItem.pushItem.push(joinStr)
		}
	})
	for (let i = 0; i < strLength; i++) {
		const {text, pushItem} = resultMap[`${i}`]
		// console.log(resultMap[`${i}`])
		result+=(pushItem.join('') + text)
	}
	result+=finalArr.join('')
	return result
}

/**
 * 生成随机字符串
 * @param e 字符串长度
 * @returns {string}
 */
export function randomString(e) {
	e = e || 32;
	const t = "ABCDEFGHJKMNPQRSTWXYZabcdefhijkmnprstwxyz012345678";
	const a = t.length;
	let n = "";
	for (let i = 0; i < e; i++) n += t.charAt(Math.floor(Math.random() * a));
	return n
}


