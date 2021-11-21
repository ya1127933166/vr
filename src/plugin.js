/**
 * 全局功能拓展插件
 */

import api from './function/request';
import apiList from './function/api-list';
import config, {debug} from './function/config';
// import uploadOSS from './function/upload-oss';
// import urlMerge from './function/url-merge';
import waiting from './function/waiting';

const install = (Vue) => {
    Vue.prototype.waiting = waiting; // 列队等待控制器
    Vue.prototype.request = api.request; // 通用的网络请求 未做中间监听
    Vue.prototype.$$config = config; // config配置注入到vue
    const vm = new Vue()

    Vue.prototype.request1 = api.request1
    /**
     * 网络请求封装方法
     * 方法内有对未登录请求的列队等待，因此，该方法暂未封装Promise返回内容
     *
     * @param {string} apitype 请求类型
     * @param {object|function} param 请求参数，缺省时为callback参数
     * @param {function} callback 回调函数
     */
    Vue.prototype.$api = function(apitype, param = {}, callback = (() => {})) {
        this.$store.dispatch('updateCustomBar');
        const isLogin = !!this.$store.state.login;
        const isUser = !!this.$store.state.user;
        // 验证登录接口，等待登录成功后执行方法
        const item = apiList[apitype];
        if (api.debug) console.log(item);
        if (item) {
            if (item.waitLogin && !isLogin) {
                this.waiting.login = () => {
                    this.$api(apitype, param, callback);
                    return false;
                };
                return false;
            } else if (item.waitUser && !isUser) {
                this.waiting.userinfo = () => {
                    this.$api(apitype, param, callback);
                    return false;
                };
                return false;
            }
        } else {
            api.debug && console.log(apitype, '未定义');
            uni.showModal({
                content: '接口未定义或定义异常，此功能暂时不能继续为您提供服务',
            });
            return false;
        }
        // $api方法缺省参数兼容处理
        let data = param,
            cb = callback;
        if (typeof param === 'function') {
            data = {};
            cb = param;
        }
        /**
         * 发起请求
         */
        this.request(item.url, item.type, data, (err, result, res) => {
            if (config.debug) console.log('this.request');
            if (config.debug) console.log(err, result, res);
            if (err && `${err.code}` === '-1') {
                this.waiting.userinfo = () => {
                    this.$api(apitype, param, callback);
                    return false;
                };
                if (config.debug) console.log('未登录，需要触发静默登录');
                return this.$quiteLogin((err) => {
                    if (err) {
                        uni.showModal({
                            title: '错误提示',
                            content: `登录验证失败，无法继续操作，错误码：${err.code}`,
                            showCancel: false,
                        });
                    }
                });
            }
            cb(err, result, res);
        });
    };

    /**
     * 静默登录
     */
    Vue.prototype.$quiteLogin = async function(cb) {
        if (config.debug) console.log('触发静默登录，Begin');
        try {

		   let channel=''
		   getEnvironment(res=>{
			  channel = res
			})
            const [, res2] = await uni.login();

            const code = res2.code;
            this.request({
                    type: 'post',
                    url: 'user/code2Session',
                    param: {
                        code: code,
						channel:channel
                    }
                }).then((res) => {
                    if (res[1].data.state == 200) {
                        getEnvironment((environment) => {
                            let channel = environment
                            let headerData = res[1].data.body;
                            let resKey = headerData.key;
                            let header = {
                                uid: headerData.uid,
                                channel
                            };

                            this.$store.commit('setHeaderData',{ info: header, key: resKey, sync: { user: headerData.user_sync, number: headerData.number_sync } })
                            if (headerData.number_sync == 'none') {
                                this.$store.commit('setPhoneStatus', true)
                            }
                            if (headerData.user_sync == 'none') {
                                this.$store.commit('setUserInfoStatus', true)
                            }
					if (config.debug) console.log("headerData.number_sync",headerData.number_sync);
                            if(typeof cb === 'function'){
                                cb({
                                    code:200,
                                });
                            }
                        });
                        // uni.hideLoading()
                    } else {
                        uni.showToast({
                            title: '静默登陆' + $throwStatusCode(res[1].data.state == 200, '登陆'),
                            icon: 'none'
                        })
                    }
                }).catch((e) => {
                    uni.showToast({
                        title: '网络异常，请稍后再试',
                        icon: 'none'
                    })
                })
        } catch (e) {
            // 静默登录 不直接显示错误
            console.warn('$quiteLogin',e);
            if (typeof cb === 'function') {
                cb({
                    code: `小程序异常问题 - ${e}`,
                });
            }
        }
    };
    /**
     * 获取当前运行环境
     */
    var getEnvironment = function(cb) {
        let environment = '';
        uni.getSystemInfo({
            complete: (res) => {
                //微信小程序&&企业微信
                //#ifdef MP-WEIXIN
                if (!!res.environment) {
                    environment = res.system.startsWith('iOS') ? 'iOS-QYXCX' : 'Android-QYXCX';
                } else {
                    environment = res.system.startsWith('iOS') ? 'iOS-XCX' : 'Android-XCX';
                }
                //#endif

                //原生app
                //#ifdef APP-PLUS
                environment = res.system.startsWith('iOS') ? 'iOS' : 'Android';
                //#endif

                //钉钉小程序
                // #ifdef MP-DINGTALK
                environment = res.system.startsWith('iOS') ? 'iOS-DDXCX' : 'Android-DDXCX';
                // #endif
                cb(environment)
            },
        })

    };
    /**
     * 用户登录
     * 跳转登录页面
     */
    Vue.prototype.$login = function() {
        const routes = getCurrentPages();
        const nowRoute = routes[routes.length - 1];
        this.waiting.userinfo = () => {
            // console.log('进入路径判断')
                // 判断返回的路由路径
            if (nowRoute.route.includes('tabbar')) {

                uni.reLaunch({
                    url: `/${nowRoute.route}`,
                });
            } else {
                const param = Object.entries(nowRoute.options)
                    .map(i => `${i[0]}=${i[1]}`);
                let url = `/${nowRoute.route}`;
                if (param.length) {
                    url += `?${param.join('&')}`;
                }
                uni.redirectTo({
                    url
                });
            }
            return false;
        };
        uni.navigateTo({
            url: '/pages/auth/auth',
        });
    };

    /**
     * 验证用户身份
     *
     */
    Vue.prototype.$checkingAuth = async function() {
        try {
            let res = await this.request({
                url: 'registration/confirm',
                type: 'get'
            })

		 if (config.debug)	console.log("身份state:",res[1].data.state);
            if(res[1].data.state==200){
                let result = res[1].data.body
                //如果是新用户，且未被邀请，引导去创建账户
                if (result.length && result.length > 0) {
                    //如果是被邀请，则引导去选择一个身份进入
					// console.log(result.every(ele => ele.selected == 'N'));
                    if (result.every(ele => ele.selected == 'N')) {
                        uni.navigateTo({
                            url: '../../subpackComm/pages/login/selectAuth?type=选择身份'
                        })
                    //进入这里表示已有选择的身份，只是登陆信息过期
                    }else{
                        if(this.$$globalData.jumpPath=='back'){
                            uni.navigateBack({
                                delta:-1
                            })
                        }else{
                            uni.redirectTo({
                                url: this.$$globalData.jumpPath
                            })
                        }
                    }
                    this.$store.commit('setSelectAuthList', result)

                }
                return true
            }else{
                // let str = this.$throwStatusCode(res[1].data.state, '获取账户信息')
                // uni.showToast({
                //     title:str+'checkAuth',
                //     icon:'none'
                // })
            }
        } catch (error) {
            console.warn('$checkingAuth',error);
            uni.showToast({
                title: '网络超时，请稍后再试',
                icon:'none'
            })
            setTimeout(()=>{
                uni.navigateBack({
                    delta:10
                })
            },500)
        }

    }

    /**
     * 上传封装 - 预封装阿里OSS上传 - 公共库上传
     * @param {string} filePath 文件路径
     * @param {number} index 同时触发上传的顺序
     * @param {string} caseName 类型名称
     * @param {function} cb 回调函数
     */
    // Vue.prototype.$uploadOSS = (filePath, index, caseName, cb) => uploadOSS({
    //     caseName,
    //     filePath,
    //     index,
    //     cb
    // });

    /**
     * 上传封装 - 预封装阿里OSS上传 - 私有库上传
     * @param {string} filePath 文件路径
     * @param {number} index 同时触发上传的顺序
     * @param {string} caseName 类型名称
     * @param {function} cb 回调函数
     */
    // Vue.prototype.$uploadPrivateOSS = (filePath, index, caseName, cb) => uploadOSS({
    //     isPrivate: true,
    //     caseName,
    //     filePath,
    //     index,
    //     cb
    // });

    /**
     * 网址合并
     */
    // Vue.prototype.$urlMerge = urlMerge;

    /**
     * 保存图片
     */
    Vue.prototype.$saveImage = async function(url) {
        uni.showLoading({
            title: 'loading...',
            mask: true,
        });
        try {
            const tempFilePath = await this.$downloadFile(url);
            await this.$saveAlbum(tempFilePath);
            uni.hideLoading();
            uni.showToast({
                title: '保存成功',
            });
        } catch (error) {
            uni.hideLoading();
            if (error == '无法保存') {
                uni.showModal({
                    content: '保存失败，未授权或权限不足',
                    showCancel: false,
                });
            } else if (typeof error === 'string') {
                uni.showToast({
                    title: error,
                    icon: 'none',
                });
            } else {
                console.error(error);
            }
        }
    };

    /**
     * 下载文件
     */
    Vue.prototype.$downloadFile = function(url) {
        return new Promise((resolve, reject) => {
            wx.downloadFile({
                url,
                success: (res) => {
                    if (res.statusCode === 200) {
                        resolve(res.tempFilePath);
                    } else {
                        reject('资源不存在或无法下载');
                    }
                },
                fail: () => reject('网络请求失败'),
            });
        });
    };

    /**
     * 保存图片到相册
     */
    Vue.prototype.$saveAlbum = function(filePath) {
        return new Promise((resolve, reject) => {
            uni.saveImageToPhotosAlbum({
                filePath,
                success: (res) => {
                    if (res.errMsg == 'saveImageToPhotosAlbum:ok') {
                        resolve(true);
                    } else {
                        reject('无法保存');
                    }
                },
                fail: () => reject('无法保存'),
            })
        });
    };

    /**
     * 接口抛出状态码检验方法
     */
    Vue.prototype.$throwStatusCode = function(code, text) {
        let str = '未找到该状态码'
        switch (code) {
            case 199:
                str = text + '失败';
                break;
            case 200:
                str = text + '成功';
                break;
            case 101:
                str = 'API没找到';
                break;
            case 102:
                str = debug ? 'token验证失败' : '登录信息已过期，请重新进入小程序';
                break;
            case 103:
                str = debug ? 'token已过期' : '登录信息已过期(103)，请重新进入小程序';
                break;
            case 104:
                str = '参数错误';
                break;
            case 110:
                str = '服务内服错误';
                break;
            case 201:
                str = '手机号码不正确';
                break;
            case 202:
                str = '验证码不正确';
                break;
            case 203:
                str = '密码不匹配';
                break;
            case 204:
                str = '用户不存在';
                break;
            case 205:
                str = '用户已存在';
                break;
            case 206:
                str = '帐号已被冻结';
                break;
            case 207:
                str = '帐号暂停或注销';
                break;
            default:
                break;
        }
        return str
    }
};

export default {
    install,
};
