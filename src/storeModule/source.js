//添加客户
export default {
  namespaced: true,
  state: {
    //标签组信息
    enterpriseTag: [
      {
        title: "客户身份",
        list: [
          { text: "租客", status: false },
          { text: "业主", status: false },
          { text: "企业客户", status: false },
        ],
      },
      {
        title: "客户状态",
        list: [
          { text: "潜在客户", status: false },
          { text: "初步接触", status: false },
          { text: "持续跟进", status: false },
          { text: "成交客户", status: false },
          { text: "退租客户", status: false },
          { text: "流失客户", status: false },
          { text: "无效客户", status: false },
        ],
      },
      {
        title: "客户来源",
        list: [
          { text: "网络推广", status: false },
          { text: "电话销售", status: false },
          { text: "渠道客户", status: false },
          { text: "同行介绍", status: false },
        ],
      },
    ],
    personalTag: [
      {
        title: "客户行业",
        list: [
          { text: "金融", status: false },
          { text: "工程", status: false },
        ],
      },
    ],
    currentTags: {}, //当前被选中的标签组
    userDetail: {},
    followList: [], //跟进记录表
    currentFollowUser: { customer_id: "", customer_name: "" }, //当前需要新增跟进的用户
  },
  mutations: {
    //更新标签
    updateTagList(state, data) {
      state.enterpriseTag = data.enterpriseTag
        ? data.enterpriseTag
        : state.enterpriseTag;
      state.personalTag = data.personalTag;
    },
    //设置当前选中的标签组
    setCurrentTags(state, data) {
      state.currentTags = data;
    },
    //设置初始选中的标签
    setInitTag(state, data) {
      let temp = data.split(",");
      state.enterpriseTag.forEach((ele) => {
        ele.list.forEach((item) => {
          if (temp.indexOf(item.text) != -1) {
            item.status = true;
          }
        });
      });

      state.personalTag.forEach((ele) => {
        ele.list.forEach((item) => {
          if (temp.indexOf(item.text) != -1) {
            item.status = true;
          }
        });
      });
    },
    //将标签组全部置为未选中状态
    resetTags(state) {
      state.personalTag.forEach((ele) => {
        ele.list.forEach((item) => {
          item.status = false;
        });
      });
      state.enterpriseTag.forEach((ele) => {
        ele.list.forEach((item) => {
          item.status = false;
        });
      });
    },
    //更新编辑过后的个人标签数组
    updatePersonalTag(state, data) {
      let index = -1;
      state.personalTag.forEach((ele, i) => {
        if (ele.title == data.title) {
          index = i;
        }
      });
      state.personalTag[index] = data;
    },
    //删除标签组
    removeTagList(state, data) {
      let index = -1;
      state.personalTag.forEach((ele, i) => {
        if (ele.title == data.title) {
          index = i;
        }
      });
      state.personalTag.splice(index, 1);
    },
    //设置当前用户详情
    setUserDetail(state, data) {
      state.userDetail = data;
    },
    //设置跟进记录列表
    setFollowList(state, data) {
      state.followList = data;
    },
    //设置当前新增跟进用户
    setCurerntFollowUser(state, data) {
      state.currentFollowUser = data;
    },
  },
  actions: {
    //获取跟进记录
    async getFollowList({ commit }, data) {
      const app = getApp();
      try {
        let res = await app.$vm.request({
          url: "followup/list",
          type: "get",
          param: {
            customer_id: data && data.customer_id ? data.customer_id : "",
            page: data && data.page ? data.page : 1,
          },
        });
        if (res[1].data.state == 200) {
          commit("setFollowList", res[1].data.body);
        } else {
          uni.showToast({
            title: app.$vm.$throwStatusCode(res[1].data.state, "跟进记录获取"),
            icon: "none",
          });
        }
        console.log(res, "跟进列表");
      } catch (error) {
        console.log(error);
      }
    },
    //获取标签组
    async getTagList({ commit }) {
      const app = getApp();
      try {
        let res = await app.$vm.request({
          url: "customer/tag/list",
          type: "get",
        });

        if (res[1].data.state == 200) {
          let data = res[1].data.body;
          let enterpriseTemp = [];
          let personalTemp = [];
          data.forEach((ele) => {
            if (ele.type_desc == "company") {
              enterpriseTemp.push(ele);
            } else {
              personalTemp.push(ele);
            }
          });
          let enterpriseTab = enterpriseTemp.map((ele) => {
            return {
              title: ele.group_name,
              id: ele.id,
              list: ele.labels.map((ele) => {
                return { text: ele, status: false };
              }),
            };
          });
          let personalTag = personalTemp.map((ele) => {
            return {
              title: ele.group_name,
              id: ele.id,
              list: ele.labels.map((ele) => {
                return { text: ele, status: false };
              }),
            };
          });
          commit("updateTagList", { enterpriseTab, personalTag });
        } else {
          uni.showToast({
            title: app.$vm.$throwStatusCode(res[1].data.state, "标签获取"),
            icon: "none",
          });
        }
      } catch (error) {
        console.log(error);
      }
    },
  },
  getters: {
    //选中的标签
    selectTag(state) {
      let selectedList = [];
      state.enterpriseTag.forEach((ele) => {
        let temp = ele.list.filter((ele) => ele.status);
        selectedList = [...selectedList, ...temp];
      });
      state.personalTag.forEach((ele) => {
        let temp = ele.list.filter((ele) => ele.status);
        selectedList = [...selectedList, ...temp];
      });
      return selectedList;
    },
    sourceUserDetail(state) {
      return state.userDetail;
    },
  },
};
