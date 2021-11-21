<template>
  <!-- 通讯录主页 -->
  <view class="addrList"
        :style="'padding-top:'+customHeaderHeight">
    <PageHeader ref="pageHeader"
                :title="'通讯录'"
                @backCallBack="customBack"></PageHeader>
    <view :style="'width:750rpx;height:'+customeheaderInfo.headerHeight"></view>
    <view class='title'>
      <template v-for="(item,index) in boxTitleQueue">
        <view @tap="toSpecify(item)"
              :key="index">{{item.org_name}}</view>
        <view v-if="index!=boxTitleQueue.length-1"
              :key="index"
              class="cuIcon-right"></view>
      </template>
      <!-- {{boxTitle}} -->
    </view>
    <Loading v-if="isShowLoading"
             style="position:absolute;margin-top:30rpx; left: 50%;transform: translateY(-50%);"></Loading>
    <view class='selectBox'
          v-if="addrList.length>0&&isUserInfo">
      <block v-for="(item,index) in addrList"
             :key="index">
        <view @tap="clickOptions(item)"
              class="contacts"
              hover-class="active_box">
          <image mode="aspectFill"
                 class='contactsLeft'
                 style="width:60rpx;height:60rpx;border-radius: 30rpx;"
                 :src="item.staff_id?(item.avatar_url):'https://uss.img.lezhulife.com/xcxicon/department.png'"></image>
          <view class='contactsCenter'
                :style="'border:'+(index==addrList.length-1?'none':'')+';'">
            <view class="centerTop">
              <view :style="'color:'+(item.activate=='N'?'#ccc':'')+';'">{{item.org_name?item.org_name:item.staff_name}}</view>
              <view v-if="item.phone_no=='Y'"
                    style="color:#55b3e4;"
                    class='cuIcon-mobilefill'></view>
              <view v-if="item.wechat_no=='Y'"
                    style="color:#24db5a;"
                    class='cuIcon-weixin'></view>
            </view>
            <view v-if="item.position"
                  class="centerBottom">
              <view class='bottomLeft'>
                <view class='bottomTag'>{{item.position}}</view>
              </view>
            </view>
          </view>
          <view class="contactsRight">
            <view class='bottomRight'>
              <!-- <view v-if="item.creator" class='conractsctive'>{{item.creator=='Y'?'创建人':''}}</view> -->
              <view v-if="item.creator=='Y'"
                    class='conractsctive'>创建人</view>
              <view v-else-if="item.activate&&!item.org_name"
                    class='conractsctive'>{{item.activate=='Y'?'':'未激活'}}</view>
              <view v-else></view>

            </view>
          </view>
        </view>
        <view v-if="index!=addrList.length-1"
              id="cell">
          <view class="line"></view>
        </view>
      </block>
      <view v-show="boxTitle=='企业通讯录'&&memberTotal!=0"
            class="total">共{{memberTotal}}人</view>
    </view>
    <EmptyPrompt :isAuth="isUserInfo"
                 @addButtonCallBack="authUser"
                 :isContent="isUserInfo"
                 :buttonText="'请授权用户头像和昵称'"
                 :isButton="!isUserInfo"
                 :content="isUserInfo==true?'暂无成员':''"
                 v-if="isShowEmpty||!isUserInfo"></EmptyPrompt>
    <view style="width:750rpx;height:120rpx;"></view>
    <view v-if="currentOrganization.permission.organization=='Y'"
          @tap="bottomBarClick"
          class='addBtn'><text>+</text>添加成员</view>

    <!-- 添加部门模态框 -->
    <view class="modal"
          v-show="isShowModal">
      <view @tap="isShowModal=false"
            class="mask"></view>
      <view class="modalBox">
        <view class="modalTitle">添加部门/门店</view>
        <view class="modalText"></view>
        <view class="modalInput">
          <text>部门/门店:</text>
          <input maxlength="10"
                 v-model="department"
                 type="text"
                 placeholder-class="place"
                 placeholder-style="font-size:30rpx;"
                 placeholder="请输入">
        </view>
        <view class="modalBtn">
          <view @tap="isShowModal=false">取消</view>
          <view @tap="addDepartmentBtn">添加</view>
        </view>
      </view>
    </view>
    <Modal1 :isShow="isShowModal1"
            :imgList="imgList"
            @clickCallBack="clickModal1Item"
            @clickMaskCallBack="isShowModal1=false"></Modal1>
  </view>
</template>

<script>
import Modal1 from '../../../components/comm/modal1/modal1.vue';
import PageHeader from '../../../components/comm/pageHeader/pageHeader.vue';
import EmptyPrompt from '../../../components/comm/emptyPrompt/emptyPrompt.vue';
import Loading from '../../../components/module/loading.vue';
import { mapState, mapMutations, createNamespacedHelpers, mapActions } from 'vuex';
const { mapState: addrListState, mapMutations: addrListMutations } = createNamespacedHelpers('addrList');
const { mapState: sourceState } = createNamespacedHelpers('source');
export default {
  name: 'addrList',
  data () {
    return {
      isShowModal: false,
      department: '',
      boxTitle: '企业通讯录',
      isShowModal1: false,
      imgList: [{ text: '成员', path: 'https://uss.img.lezhulife.com/xcxicon/home-addrBook.png' }, { text: '部门/门店', path: 'https://uss.img.lezhulife.com/xcxicon/department.png' }],
      addrList: [],
      customHeaderHeight: -1,
      memberTotal: 0,
      isShowLoading: true,
      currentDepartment: {},//当前所选择部门
      pageQueue: [],//当前所选择部门的队列
      boxTitleQueue: [{ org_name: '企业通讯录' }],
      departmentQueue: [],//当前选择部门队列
      isShowEmpty: false,//是否显示暂无数据
      isSelect: false,//是否是选择客户
      tag: '',//当前的更新类型
    }
  },
  created () {
    //刷新列表
    this.$bus.$on('updateStafflist', (tag) => {
      // console.log(this.currentDepartment,this.pageQueue,);
      if (tag) {
        this.tag = tag;
      }
      this.getStaffList(this.currentDepartment.org_id, () => { });
    })
  },
  onLoad (options) {
    //测试
    this.getnewewregistration();
    if (options && options.type == '选择客户') {
      this.isSelect = true
    }
  },
  mounted () {
    //获取自定义头部高度
    this.customHeaderHeight = this.$$globalData.customHeaderHeight
  },
  onShow () {
    // console.log('in show')
    // console.log('this.currentDepartment.org_id', this.currentDepartment.org_id)
    // console.log('onShow', this.pageQueue.length, this.pageQueue, this.memberDetail, this.currentDepartment.org_id)
    // if (this.pageQueue.length === 1 && this.memberDetail && this.memberDetail.isEdit) {
    //   this.getStaffList(this.currentDepartment.org_id);
    // } else {
    //   this.getStaffList(this.currentDepartment.org_id, () => { });
    // }
    // this.isShowModal1 = false;
  },
  beforeDestroy () {
    //注销事件总线
    this.$bus.$off('updateStafflist')
  },
  computed: {
    ...mapState({
      //获取当前所选择顶层部门
      currentOrganization (state) {
        //默认初始化当前选择部门为顶层部门
        this.currentDepartment = state.currentOrganization;
        return state.currentOrganization
      },
      customeheaderInfo: state => state.customeheaderInfo,
      //用户是否授权昵称和头像
      isUserInfo: state => state.isUserInfo
    }),
    ...addrListState({
      //当前被编辑的成员
      memberDetail (state) {
        return state.memberDetail
      }
    }),
    ...sourceState({
      userDetail: state => state.userDetail
    })
  },
  watch: {
    currentOrganization: {
      handler (newValue, oldValue) {
        //当检测到状态机中数据改变再去发送请求
        this.getStaffList();
      },
      deep: true
    }
  },
  methods: {
    ...addrListMutations(['setOrganization']),
    ...mapActions(['getnewewregistration']),
    ...mapMutations(['setUserInfoStatus']),
    //获取所有成员和部门
    async getStaffList (organizationId = undefined, cb) {
      this.isShowLoading = true

      // this.$refs.pageHeader.showLoading();
      let param = { staff_id: this.currentOrganization.staff_id, org_id: '' };
      if (organizationId != undefined) {
        param = { staff_id: this.currentOrganization.staff_id, org_id: organizationId }
      }

      try {
        let res = await this.request({
          url: 'staff/list',
          type: 'get',
          param: param
        })
        // console.log(res,'----','获取成员');
        if (res[1].data.state == 200) {
          this.addrList = [...res[1].data.body.organizations, ...res[1].data.body.staffs];
          if (organizationId == undefined) {
            this.pageQueue = []
            this.pageQueue.push(this.addrList)
            this.departmentQueue.push(this.currentOrganization)
          }
          //根据不同的更新类别更改缓存数组
          if (this.tag != '') {
            let index = this.tag.val.indexOf(organizationId - 0);
            let staffId = this.addrList[0].staff_id
            if (index != -1) {
              for (let i = 0; i < this.pageQueue.length; i++) {
                if (this.tag.type == '添加成员' && this.pageQueue[i].length + 1 == this.addrList.length) {
                  this.pageQueue[i] = this.addrList;
                  break;
                }
                if (this.tag.type == '删除成员' && this.pageQueue[i].length - 1 == this.addrList.length) {
                  this.pageQueue[i] = this.addrList;
                  break;
                }
                if (this.tag.type == '修改成员') {
                  this.pageQueue[i].forEach((ele, index) => {
                    if (staffId == ele.staff_id) {
                      this.pageQueue[i][index] = this.addrList[0]
                    }
                  })
                }
              }
            }

          }
          if (typeof cb == 'function') {
            cb(this.addrList)
          }
          //设置总人数
          this.memberTotal = res[1].data.body.staff_count
        } else {
          let title = res[1].data.state == 199 ? '获取所有部门和成员失败' : res[1].data.msg
          uni.showToast({
            title: `${title}`,
            icon: 'none'
          })
        }
        this.isShowLoading = false;
        // this.$refs.pageHeader.closeLoading();
        if (res[1].data.body.organizations.length < 1 && res[1].data.body.staffs.length < 1) {
          this.isShowEmpty = true;
        } else {
          this.isShowEmpty = false;
        }
      } catch (error) {
        console.log(error);
      }
    },
    //列表选项点击事件
    clickOptions (item) {

      const that = this;
      if (this.isSelect == true && item.staff_id && item.staff_id != '') {
        uni.showModal({
          title: '分享给同事',
          content: `确定将${this.userDetail.customer_name}分享给${item.staff_name}?`,
          complete: function (res) {
            if (res.confirm == true) {
              that.shareColleagues(item)
            }
          }
        })
        return
      }
      if (item.org_id && item.org_id != '') {
        this.getStaffList(item.org_id, (addrList) => {
          //将每次获取到的数据推进队列
          that.pageQueue.push(addrList)
          that.boxTitleQueue.push(item)
          that.departmentQueue.push(item)
          that.currentDepartment = this.departmentQueue[this.departmentQueue.length - 1]
        })
        // this.boxTitle = item.org_name;
        // this.currentDepartment = item;

      }
      if (item.staff_id && item.staff_staff_name != '') {
        uni.navigateTo({
          url: `../../../subpackAddrlist/pages/addrList/memberInfo?staff_id=${item.staff_id}`
        })
      }
    },
    //分享给同事
    async shareColleagues (item) {
      try {
        let res = await this.request({
          url: 'customer/share',
          type: 'post',
          param: {
            customer_id: this.userDetail.customer_id,
            share_staff_id: item.staff_id
          }
        })
        // console.log(res);
        if (res[1].data.state == 200) {
          uni.showToast({
            title: '分享成功'
          })
        } else {
          uni.showToast({
            title: this.$throwStatusCod(res[1].data.state, '分享'),
            icon: 'none'
          })
        }
        setTimeout(() => {
          uni.navigateBack({
            delta: -1
          })
        }, 1000)
      } catch (error) {
        console.log(error);
      }

    },
    //模态框选项点击回调
    clickModal1Item (item) {
      let text = item.currentTarget.dataset.item.text;
      // uni.hideLoading();
      // return;
      if (text === '成员') {
        uni.navigateTo({
          url: '../../../subpackAddrlist/pages/addrList/member?type=添加成员&department=' + JSON.stringify(this.currentDepartment),
        })
      } else {
        this.isShowModal1 = false;
        this.isShowModal = true;
      }
      uni.hideLoading();
    },
    //添加按钮
    async addDepartmentBtn () {
      if (!this.department.trim()) {
        uni.showToast({
          title: '请输入部门/门店名称',
          icon: 'none'
        })
        return
      }
      try {
        let res = await this.request({
          url: 'organization/add',
          type: 'post',
          param: {
            org_name: this.department,
            parent_id: this.currentDepartment.org_id
          }

        })
        if (res[1].data.state == 200) {
          uni.showToast({
            title: '添加成功'
          })
          this.getStaffList(this.currentDepartment.org_id)
        } else {
          uni.showToast({
            title: res[1].data.msg,
            icon: 'none'
          })
        }
        this.isShowModal = false;
        this.department = '';
      } catch (error) {

      }
    },
    //跳转到指定点击的面包屑页面
    toSpecify (item) {
      let index = this.boxTitleQueue.indexOf(item);
      if (index != -1) {
        this.pageQueue.length = index + 1;
        this.boxTitleQueue.length = index + 1;
        this.departmentQueue.length = index + 1;
        this.pageQueue.length = index + 1;
        this.addrList = this.pageQueue[index]
        // this.currentDepartment=this.departmentQueue[index]
        this.currentDepartment = this.boxTitleQueue[index]
        this.isShowEmpty = this.addrList.length > 0 ? false : true;
        if (this.boxTitleQueue[index].org_name == '企业通讯录') {
          this.getStaffList();
        } else {
          this.getStaffList(this.boxTitleQueue[index].org_id);
        }
      }
    },
    //自定义头部回退按钮
    customBack () {
      //如果改变了数据且回到第一页，再次刷新数据
      if (this.pageQueue.length === 1 && this.memberDetail && this.memberDetail.isEdit == true) {
        this.getStaffList();
      }
      if (this.boxTitleQueue.length >= 2) {
        this.pageQueue.pop();
        this.addrList = this.pageQueue[this.pageQueue.length - 1]
        this.boxTitleQueue.pop()
        this.getStaffList(this.boxTitleQueue[this.boxTitleQueue.length - 1].org_id);
        this.departmentQueue.pop()
        this.currentDepartment = this.departmentQueue[this.departmentQueue.length - 1]
        this.isShowEmpty = this.addrList.length > 0 ? false : true;
      } else if (this.boxTitleQueue.length <= 1) {
        uni.navigateBack({
          delta: -1
        })
      }
    },
    //底部添加按钮回调
    bottomBarClick () {
      this.isShowModal1 = true;
      if (this.boxTitleQueue.length > 2) {
        this.imgList = [{ text: '成员', path: 'https://uss.img.lezhulife.com/xcxicon/home-addrBook.png' }]
      } else {
        this.imgList = [{ text: '成员', path: 'https://uss.img.lezhulife.com/xcxicon/home-addrBook.png' }, { text: '部门/门店', path: 'https://uss.img.lezhulife.com/xcxicon/department.png' }]
      }
    },
    //授权用户昵称和头像
    async authUser (res) {
      this.$utils.debounce(() => {

        if (this.isUserInfo == false) {
          this.request({
            url: 'push/wxuser',
            type: 'post',
            param: {
              encryptedData: res.encryptedData,
              iv: res.iv
            },
          }).then((res) => {
            if (res[1].data.state == 200) {
              this.$store.commit('setUserInfoStatus', true)
              uni.showToast({
                title: '授权成功',
                icon: 'success'
              })
            } else {
              uni.showToast({
                title: this.$throwStatusCode(res[1].data.state, '授权用户信息'),
                icon: 'none'
              })
            }
          })
        }
      }, 600)()
    }
  },
  components: {
    Modal1,
    PageHeader,
    Loading,
    EmptyPrompt
  }
}
</script>

<style lang='scss' scoped>
$pageBgColor: #f7f7f7;
$borderColor: #e9e9e9;
$placerColor: #cccccc;
$titleColor: #888888;
$greenColor: #00a680;
.addrList {
  .title {
    color: $titleColor;
    padding: 40rpx 30rpx 20rpx 30rpx;
    font-size: 26rpx;
    display: flex;
    align-items: center;
    .cuIcon-right {
      margin: 0rpx 20rpx;
    }
  }
  .selectBox {
    .contacts {
      padding: 10rpx 0rpx 10rpx 0rpx;
      display: flex;
      // height: 100rpx;
      align-items: center;
      background-color: white;
      position: relative;
      .contactsLeft {
        margin-right: 30rpx;
        margin-left: 30rpx;
      }
      .contactsCenter {
        flex-grow: 1;
        height: 100rpx;
        display: flex;
        flex-direction: column;
        justify-content: center;
        font-size: 30rpx;
        .centerTop {
          display: flex;
          align-items: center;
          box-sizing: border-box;
          view {
            margin-right: 20rpx;
          }
        }
        .centerBottom {
          display: flex;
          align-items: center;
          .bottomLeft {
            display: flex;
            justify-content: space-between;
            .bottomTag {
              font-size: 28rpx;
              color: $titleColor;
              margin-right: 20rpx;
              margin-top: 10rpx;
            }
          }
        }
      }
      .contactsRight {
        .bottomRight {
          flex-grow: 1;
          text-align: right;
          margin-right: 30rpx;
          color: $titleColor;
          font-size: 28rpx;
        }
      }
    }
    .total {
      width: 750rpx;
      height: 100rpx;
      text-align: center;
      line-height: 100rpx;
      color: $titleColor;
      font-size: 26rpx;
    }
  }
  .addBtn {
    position: fixed;
    left: 0rpx;
    bottom: 0rpx;
    background-color: white;
    width: 750rpx;
    height: 120rpx;
    text-align: center;
    font-size: 34rpx;
    display: flex;
    align-items: center;
    justify-content: center;
    border-top: solid calc(1px / 2.5) #cccc;
    text {
      font-size: 60rpx;
      margin-right: 30rpx;
      margin-top: 6rpx;
    }
  }

  .modal {
    animation: fade 0.1s ease-in-out;
    .mask {
      width: 750rpx;
      height: 100vh;
      background-color: rgba(0, 0, 0, 0.4);
      position: fixed;
      top: 0;
      left: 0;
    }
    .modalBox {
      width: 650rpx;
      height: 400rpx;
      background-color: white;
      position: fixed;
      left: 0;
      right: 0;
      top: 0;
      bottom: 0;
      margin: auto;
      border-radius: 20rpx;
      display: flex;
      flex-direction: column;

      .modalTitle {
        width: 100%;
        text-align: center;
        color: $titleColor;
        font-size: 26rpx;
        padding: 30rpx 0rpx;
      }
      .modalText {
        width: 580rpx;
        margin: 0 auto;
      }
      .modalInput {
        display: flex;
        width: 580rpx;
        margin: 40rpx auto 40rpx auto;
        flex-grow: 1;
        align-items: center;
        text {
          font-size: 30rpx;
        }
        input {
          margin-left: 10rpx;
          flex-grow: 1;
        }
        .place {
          color: $placerColor;
          margin-left: 10rpx;
        }
      }
      .modalBtn {
        display: flex;
        border-top: solid 1rpx $borderColor;
        view {
          width: 50%;
          height: 100rpx;
          text-align: center;
          line-height: 100rpx;
          font-size: 30rpx;
        }
        view:nth-child(1) {
          border-right: solid 1rpx $borderColor;
        }
        view:nth-child(2) {
          color: $greenColor;
        }
      }
    }
  }
}
@keyframes fade {
  0% {
    opacity: 0;
  }
  100% {
    opacity: 1;
  }
}
</style>
