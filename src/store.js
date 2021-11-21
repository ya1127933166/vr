import Vue from "vue";
import Vuex from "vuex";
import contract from "./storeModule/contract.js";
import source from "./storeModule/source.js";
import addrList from "./storeModule/addrList";
Vue.use(Vuex);

import * as config from "@/function/config";

/**
 * ColorUI 自定义导航栏内容获取
 * 目前兼容范围 微信 & 企业微信
 */
const sys = uni.getSystemInfoSync();
let custom = {};
try {
  custom = wx.getMenuButtonBoundingClientRect();
} catch (e) {}

const store = new Vuex.Store({
  state: {
    //定位城市信息
    currentCityInfo: { name: "定位中" },
    //位置信息
    locationInfo: { name: "定位中" },
    //城市列表
    cityList: [],
    // 选择位置
    location:
      config.dev === "user"
        ? {
            name: "成都市",
            id: 2383,
            regionNo: "322100",
          }
        : null,
    locationList:
      config.dev === "user"
        ? [
            {
              name: "成都市",
              id: 2383,
              regionNo: "322100",
            },
          ]
        : [],
    // 登录状态
    login: config.dev === "user",
    // 是否为合法用户
    user: config.dev === "user",
    //是否授权手机号码
    isPhone: false,
    //是否授权用户头像和昵称
    isUserInfo: false,
    //是否已经拥有身份
    isCheckingAuth: false,
    //可选身份信息
    selectAuthList: [],
    //初始化onshow显示
    init: false,
    //当前选择组织
    currentOrganization: {},
    //自定义头部数据
    customeheaderInfo: {},
    // 用户信息
    userinfo: {},
    // 品牌信息
    brand:
      config.dev === "user"
        ? {
            name: "海螺星寓",
            abbrName: "海螺",
          }
        : {},
    // 自定义导航栏相关
    sys,
    custom,
    // 房间配置
    houseMaterial: {
      electricAppliance: [],
      furniture: [],
      KeyCert: [],
      costOfLiving: [],
      RentalContractFee: [],
    },
    // 证件
    IDCard: {
      // 租客证件
      renterContract: {
        face: "", // 正面
        back: "", // 背面
        number: "", // 证件号
        date: "", // 有效期
        name: "", // 姓名
        cloud: null,
      },
    },
    //请求头信息
    headerData: "",
    //房源楼栋门牌信息
    houseNumber: {
      bound: "",
      unit: "",
      floor: "请选择",
      room: "",
    },
    houseNumber1: {
      bound: "",
      unit: "",
      floor: "请选择",
      room: "",
    },
    //上传的临时数组
    upTempImageList: [[], [], [], [0]],
    //上传回显图片
    showImageList: [[], [], [], [0]],
    //交割单数据
    deliveryList: [[], [], [], []],
  },
  mutations: {
    //设置请求头信息
    setHeaderData: (state, data) => {
      state.headerData = data;
    },
    //更新定位信息
    updateLocationInfo: (state, data) => {
      state.locationInfo = data;
    },
    //设置当前定位城市
    setCurrentCity: (state, data) => {
      state.currentCityInfo = data;
    },
    //设置城市列表
    setCityList: (state, data) => {
      state.cityList = data;
    },
    //设置选择组织的数组
    setSelectAuthList: (state, data) => {
      state.selectAuthList = data;
      //设置当前用户选中的组织
      state.currentOrganization = data.filter((ele) => ele.selected == "Y")[0];
    },
    //设置初始化 onshow
    setinit: (state, data) => {
      state.init = data;
    },
    //设置当前用户选择的数组
    setCurrentOrganization: (state, data) => {
      state.currentOrganization = data;
    },
    // 更新登录状态
    updateLogin: (state, status) => {
      state.login = status;
    },
    //更新身份确认信息
    updateisCheckingAuth: (state, status) => {
      state.isCheckingAuth = status;
    },
    //初始化头部信息
    initCustomeheaderInfo: (state, data) => {
      state.customeheaderInfo = data;
    },
    //设置交割单数据
    setDeliveryList(state, data) {
      state.deliveryList = data;
    },
    // 设置用户信息
    setUserinfo: (state, info) => {
      state.userinfo = {
        id: info.id,
        avatar: info.avatar,
        name: info.realName,
        phone: info.phone,
        email: info.email,
        permission: info.permission,
        createDate: info.createDate,
      };
      state.brand = {
        id: info.companyId,
        name: info.companyName,
        abbrName: info.companyJcName,
      };
      state.user = info.companyId * 1 > 0;
    },
    //设置获取手机号码状态
    setPhoneStatus: (state, status) => {
      state.isPhone = status;
    },
    //设置获取用户信息状态
    setUserInfoStatus: (state, status) => {
      state.isUserInfo = status;
    },
    setLocationList: (state, list) => {
      state.locationList = list;
    },
    updateLocation: (state, info) => (state.location = info),
    // 设置自定义导航相关
    setCustom: (state, info) => {
      state.custom = info;
    },
    // 更新自定义导航数据内容
    updateCustom: (state, info) => {
      if (info.left > 0 && info.left != state.custom.left) {
        state.custom = info;
      }
    },
    /**
     * 更新房屋配置
     */
    updateHouseMaterial(state, { type, list }) {
      state.houseMaterial[type] = list;
    },
    /**
     * 初始化房屋配置
     */
    initHouseMaterial(state) {
      state.houseMaterial = {
        electricAppliance: [],
        furniture: [],
        KeyCert: [],
        costOfLiving: [],
        RentalContractFee: [],
      };
    },
    /**
     * 更新证件信息
     */
    updateIDCard(state, { type, data }) {
      if (type === "renter" || type === "renterContract") {
        const renter = state.IDCard.renterContract;
        Object.keys(data).forEach((k) => {
          renter[k] = data[k];
        });
      }
    },
    /**
     * 初始化证件信息
     */
    initIDCard(state, type) {
      if (type === "renter" || type === "renterContract") {
        state.IDCard.renterContract = {
          face: "", // 正面
          back: "", // 背面
          number: "", // 证件号
          date: "", // 有效期
          name: "", // 姓名
          cloud: null,
        };
      }
    },
    /**
     * 设置当前选择的门牌号
     */
    setHouseNumber(state, data) {
      state.houseNumber = data;
    },

    setHouseNumber1(state, data) {
      state.houseNumber1 = data;
    },
    //设置上传的图片临时数组
    setupTempImageList(state, data) {
      state.upTempImageList = data;
    },
    //设置图片回显 数组
    setshowImageList(state, data) {
      state.showImageList = data;
    },
  },
  actions: {
    /**
     * 初始化自定义导航栏高度问题
     */
    initCustom: ({ commit, dispatch }) => {
      setTimeout(() => {
        try {
          const custom2 = wx.getMenuButtonBoundingClientRect();
          commit("setCustom", custom2);
        } catch (e) {
          dispatch("initCustom");
        }
      }, 1000);
    },
    updateCustomBar: ({ commit }) => {
      try {
        const custom2 = wx.getMenuButtonBoundingClientRect();
        commit("updateCustom", custom2);
      } catch (e) {
        setTimeout(() => {
          const custom2 = wx.getMenuButtonBoundingClientRect();
          commit("updateCustom", custom2);
        }, 1000);
      }
    },
    //确认身份
    async getnewewregistration({ commit }, cb) {
      const app = getApp();
      setTimeout(async () => {
        try {
          let res = await app.$vm.request({
            url: "registration/confirm",
            type: "get",
          });
          if (res[1].data.state == 200) {
            let result = res[1].data.body;
            //二次确认身份
            if (
              result.length > 0 &&
              result.some((ele) => ele.selected == "Y")
            ) {
              commit("updateisCheckingAuth", true);
            }
            commit("setSelectAuthList", result);
            if (typeof cb == "function") {
              cb();
            }
          } else {
            let str = app.$vm.$throwStatusCode(
              res[1].data.state,
              "获取账户信息"
            );
            uni.showToast({
              title: str + "get",
              icon: "none",
            });
          }
        } catch (error) {
          console.log(error);
          uni.showToast({
            title: "网络异常，请稍后再试",
            icon: "none",
          });
        }
      }, 0);
    },
  },
  modules: {
    contract,
    source,
    addrList,
  },
});

export default store;
