/**
 * 网络请求
 * 按照项目设定进行封装
 */

 import config from './config';
 const sha1 = require('sha1');
 const {
     host,
     debug
 } = config;

 /**
  * 更新cookie
  * @param {object} res 是xxx.request返回的res
  */
 const syncCookie = (res) => {
     let cookie = '';
     const keys = Object.keys(res.header);
     for (let i = 0, n = keys.length; i < n; i += 1) {
         const key = keys[i];
         if (key.toLowerCase() == 'set-cookie') {
             cookie = res.header[key];
             break;
         }
     }
     if (cookie.length) uni.setStorageSync('cookie', cookie);
 }

 /**
  * 请求方法
  *
  * @param {string} url 请求的相对路径
  * @param {Boolean} fullUrl 请求是否是绝对路径
  * @param {string} type 请求的Method
  * @param {object|function} param 请求参数 | 缺省为callback参数
  * @param {function} callback 回调函数
  */
 const request = function ({url, fullUrl = false, type, param = {}, contentType, header: headerParams = {}, requestThis = null}) {
	 //token加密
	 let headerInfo = requestThis ? requestThis.$store.state.headerData : this.$store.state.headerData
	 let header = {'content-type': contentType ? contentType : 'application/x-www-form-urlencoded;charset=utf-8'};
	 if (headerInfo != '') {
		 let uid = headerInfo.info.uid;
		 let channel = headerInfo.info.channel;
		 let time = new Date().getTime();
		 let key = headerInfo.key;
		 let result = [];
		 if (!contentType) {
			 let params = {uid, channel, time, ...param};
			 for (let item in params) {
				 result.push(`${item}=${params[item] === '' ? '' : params[item]}`)
			 }
		 } else {
			 let params = {uid, channel, time};
			 for (let item in params) {
				 result.push(`${item}=${params[item] === '' ? '' : params[item]}`)
			 }
			 result.push(param)
		 }
		 result.sort();
		 if (config.debug) console.log('result', result.join('&') + '&' + key);
		 let token = sha1(result.join('&') + '&' + key);
		 if (config.debug) console.log('token', token);
		 header = {
			 'content-type': contentType ? contentType : 'application/x-www-form-urlencoded;charset=utf-8',
			 uid,
			 channel,
			 time,
			 token
		 }
		 //  console.log('headerInfo',headerInfo.key);
	 }
	 const rootRequest = request
	 const that = requestThis || this;
	//发送请求
	 return new Promise((resolve, reject) => {
		 uni.request({
			 method: type || 'get',
			 url: fullUrl ? url : `${host}${url}`,
			 data: param || {},
			 dataType: 'json',
			 timeout: 20000,
			 header: {...header, ...(headerParams || {})}
		 }).then((res) => {
			 if (config.debug) {
				 // console.log('url', url);
				 console.log('param', param);
				 console.log(url, JSON.stringify(res[1].data));
				 console.log(url, JSON.stringify(res[1].data.state));
			 }
			 // 阿里身份证读取接口不会返回state 但是会返回success
			 let {state: requestState, success} = res[1].data;
			 requestState = +requestState;
			 if (requestState !== 200 && !success) {
				 switch (requestState) {
					 case 102: {
						 that.$utils.throttleTool(() => {
							 that.$quiteLogin(() => {
								 that.$checkingAuth().then((authRes) => {
										 // console.log({authRes})
										 if (authRes === true) {
											 let params = {
												 url: url || '',
												 fullUrl: fullUrl || '',
												 type: type || '',
												 param: param || {},
												 contentType: contentType || '',
												 header: headerParams || {},
												 requestThis: requestThis || that
											 }
											 resolve(rootRequest(params))
										 } else {
											 reject(res)
										 }
									 }
								 );
							 })
						 })
						 break;
					 }
					 case 204: {
						 uni.navigateTo({
							 url: '/pages/auth/auth'
						 })
						 reject(res)
						 break;
					 }
					 case 301: {
						 // console.log('无身份信息', requestState)
						 let arr = ["/", "../", "../../", "../../../", "../../../../", "../../../../../"]
						 let breakFlag = false
						 arr.forEach((v) => {
							 const url = `${v}subpackComm/pages/login/login?type=未找到`
							 uni.reLaunch({
								 url,
								 success: function () {
									 breakFlag = true
								 }, fail: function (e) {
									 console.warn(e, url)
								 }
							 })
						 })
						 // uni.reLaunch({
						 // 		url: '../../subpackComm/pages/login/login?type=未找到'
						 // })
						 console.log('无身份信息')
						 reject(res);
						 break;
					 }
					 default: {
						 reject(res)
					 }
				 }
			 } else {
				 if (url === 'registration/confirm') {
					 let result = res[1].data.body
					 debug && console.log(result)
					 //如果是新用户，且未被邀请，引导去创建账户
					 if (result.length && result.length > 0) {
						 //如果是被邀请，则引导去选择一个身份进入
						 debug && console.log(result)
						 // console.log(result.every(ele => ele.selected == 'N'));
						 if (result.every(ele => ele.selected == 'N')) {
							 uni.navigateTo({
								 url: '../../subpackComm/pages/login/selectAuth?type=选择身份'
							 })
							 // uni.navigateBack({
							 // 	delta:-1
							 // })
							 //进入这里表示已有选择的身份，只是登陆信息过期
						 } else {
							 if (this.$$globalData.jumpPath == 'back') {
								 uni.navigateBack({
									 delta: -1
								 })
							 } else {
								 uni.navigateTo({
									 url: '../pages/tabbar/home.vue'
								 })
							 }
						 }
						 // console.log('这里存储')
						 //  this.$store.commit('setSelectAuthList', result)
					 }
					 // 	 else if(res[1].data.state==301){
					 // 		setTimeout(() => {
					 // 			uni.reLaunch({
					 // 				url: '../../subpackComm/pages/login/login?type=未找到'
					 // 			})
					 // 		}, 400);
					 // 	return
					 // }
				 }
				 resolve(res)
			 }
		 }).catch((e) => {
			 reject(e)
		 })
	 })
 };


  /**
   * 搜索方法
   *
   * @param {string} url 请求的相对路径
   * @param {object|function} param 请求参数 | 缺省为callback参数
   * @param {any} mockData mock数据 存在值时直接返回mock数据，不再发送请求
   */
const request1 =function({url, param, mockData}){
	let baseUrl = 'https://s.lelinkage.com/es'
	let header ={
		'content-type':'application/x-www-form-urlencoded;charset=utf-8'
	}
	return new Promise((resolve,reject)=>{
		if (mockData) {
			console.log('mock params', param)
			resolve(mockData)
			return;
		}
		uni.request({
			method:'get',
			url : `${baseUrl}`+`${url}`,
			data : param,
			header,
		}).then(res=>{
			resolve(res)
		}).catch(e=>{
			reject(e)
		})
	})
};

 //搜索引擎

 /**
  * 对外暴露
  */
 export default {
     request,
     // syncCookie,
	 request1, //搜索
     debug,
     config,
 };
