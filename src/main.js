import Vue from 'vue';
import App from './App';
import store from './store';
import plugin from './plugin';
// import cuCustom from './colorui/components/cu-custom.vue';
import Loading from './components/module/loading.vue';
import config from './function/config.js';
import vueFormCheck from 'vue-form-check';
import * as utils from './utils.js';

// Vue.component('cu-custom', cuCustom);
Vue.component('loading', Loading);
Vue.use(plugin);
Vue.use(utils)

Vue.use(vueFormCheck);//表单校验插件

Vue.config.productionTip = false;
// 注入vuex
Vue.prototype.$store = store;
// 全局数据
Vue.prototype.$$globalData = {};
// 全局方法
Vue.prototype.$$globalMethod = {};
//防抖函数
Vue.prototype.$utils = utils;

//事件总线
var EventBus = new Vue();
Object.defineProperties(Vue.prototype, {
    $bus: {
        get: function () {
            return EventBus
        }
    }
})

//全局图标路径
Vue.prototype.$baseURL = config.baseURL;
Vue.prototype.$imageSmall = config.imageSmall
Vue.prototype.$imageLarge = config.imageLarge
Vue.prototype.$imageMiddle = config.imageMiddle
Vue.prototype.$imageSuperSmall = config.imageSuperSmall

App.mpType = 'app';

const app = new Vue({
    ...App,
});
app.$mount();
