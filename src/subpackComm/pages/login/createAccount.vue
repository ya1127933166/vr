<template>
  <!-- 创建账户 -->
  <view class="createAccount">
    <view class='accountTop'>完善信息全新创建</view>
    <view class="itemBox"
          v-if="currentType!='个人'">
      <view class="itemLeft">{{currentType=='企业'?'企业名称':'所在单位'}}</view>
      <input class="input"
             v-model="info.enterprise"
             type="text"
             placeholder-style="color:#cccccc;font-size:30rpx;z-index:0;"
             maxlength="50"
             placeholder-class="itemCenter"
             :placeholder="`请输入所在${currentType=='企业'?'企业':'单位'}名称`" />
    </view>
    <view v-if="currentType!='个人'"
          id="cell">
      <view class="line"></view>
    </view>

    <view class="itemBox"
          v-if="currentType!='个人'">
      <view class="itemLeft">行业类型</view>
      <picker class="itemCenter"
              mode="selector"
              :range="industry"
              @change="bindPickeChange($event,'行业类型')">
        <view :style="'color:'+(info.industryText=='请选择'?'#cccccc':'black')+';'"
              class="uni-input">{{info.industryText}}</view>
      </picker>
      <view class="cuIcon-right"></view>
    </view>
    <view v-if="currentType!='个人'"
          id="cell">
      <view class="line"></view>
    </view>

    <view class="itemBox"
          v-if="currentType!='个人'">
      <view class="itemLeft">人员规模</view>
      <picker class="itemCenter"
              mode="selector"
              :range="scale"
              @change="bindPickeChange($event,'人员规模')">
        <view :style="'color:'+(info.scaleText=='请选择'?'#cccccc':'black')+';'"
              class="uni-input">{{info.scaleText}}</view>
      </picker>
      <view class="cuIcon-right"></view>
    </view>
    <view v-if="currentType!='个人'"
          id="cell">
      <view class="line"></view>
    </view>

    <view class="itemBox">
      <view class="itemLeft">姓名</view>
      <input class="input"
             maxlength="30"
             type="text"
             v-model="info.names"
             placeholder-style="color:#cccccc;font-size:30rpx;z-index:0;"
             placeholder-class="itemCenter"
             placeholder="请输入真实姓名" />
    </view>
    <view id="cell">
      <view class="line"></view>
    </view>
    <view class="itemBox"
          v-if="currentType=='个人'">
      <view class="itemLeft">我的身份</view>
      <picker class="itemCenter"
              mode="selector"
              :range="identity"
              @change="bindPickeChange($event,'我的身份')">
        <view :style="'color:'+(info.identityText=='请选择'?'#cccccc':'black')+';'"
              class="uni-input">{{info.identityText}}</view>
      </picker>
      <view class="cuIcon-right"></view>
    </view>
    <view v-if="currentType=='个人'"
          id="cell">
      <view class="line"></view>
    </view>

    <view @tap="addBtm"
          hover-class="active"
          class="createBtn"
          :style="'background-color:'+(isChange?'#00a680':'#cccccc')+';'">创建</view>
    <view class="invitation">
      <view>{{invitationCode}}</view>
      <view @tap="openModal">邀请码</view>
    </view>

    <view class="modal"
          v-show="isShowModal">
      <view @tap="closeModal"
            class="mask"></view>
      <view class="modalBox">
        <view class="modalTitle">输入邀请码</view>
        <view class="modalText">可以让老用户或代理人分享邀请码给你:</view>
        <view class="modalInput">
          <text>邀请码:</text>
          <input maxlength="5"
                 v-model="invitation"
                 type="text"
                 placeholder-class="place"
                 placeholder="请输入">
        </view>
        <view class="modalBtn">
          <view @tap="closeModal">取消</view>
          <view @tap="confirmBtn">确定</view>
        </view>
      </view>
    </view>
  </view>
</template>

<script>
import { mapActions } from 'vuex';
export default {
  name: 'createAccount',
  data () {
    return {
      isShowModal: false,
      currentType: '',
      scale: ['1-20人', '21-50人', '51-100人', '101-200人', '201-500人', '501-1000人', '1001及以上'],
      industry: ['长租公寓', '中介机构', '商办机构', '产业园区'],
      identityText: '请选择',
      scaleText: '请选择',
      industryText: '请选择',
      names: '',
      invitation: '',
      invitationCode: '',
      enterprise: '',
      info: {
        identityText: '请选择',
        scaleText: '请选择',
        industryText: '请选择',
        names: '',
        enterprise: '',
      },
      isChange: false,//用户是否写入数据
      industryId: [],//用于查找行业类型ID
      scaleId: [],//查找人员规模ID
      // identity:['经纪人','招商经理','业主'],
      identity: []//查找身份ID
    }
  },
  onLoad (options) {
    this.currentType = options.type;
    this.initInfo = JSON.stringify(this.info);
    this.initData();
  },
  onShow () {
  },
  computed: {
    watchInfo () {
      return JSON.stringify(this.info)
    }
  },
  watch: {
    watchInfo (newValue, oldValue) {
      if (this.watchInfo != this.initInfo) {
        this.isChange = true
      } else {
        this.isChange = false
      }
    }
  },
  methods: {
    ...mapActions(['getnewewregistration']),
    openModal () {
      this.isShowModal = true
    },
    closeModal () {
      this.isShowModal = false
    },
    /**
     * 初始化页面配置
     */
    async initData () {
      //行业类型&&人员规模&&身份
      if (this.currentType != '个人') {
        let ID = `${this.currentType == '企业' ? 1 : (this.currentType == '政府' ? 2 : '')}`
        try {
          let res = await Promise.all([this.request({
            url: `registration/industry/${ID}`,
            type: 'get',
          }), this.request({
            url: `registration/staffsize/${ID}`,
            type: 'get'
          })]);
          if (res[0][1].data.state == 200 && res[1][1].data.state == 200) {
            this.industry = res[0][1].data.body.map(ele => ele.name)
            this.industryId = res[0][1].data.body
            this.scale = res[1][1].data.body.map(ele => ele.name)
            this.scaleId = res[1][1].data.body
          } else {
            uni.showToast({
              title: this.$throwStatusCode(res[0][1].data.state, '获取信息'),
              icon: 'none'
            })
          }
        } catch (error) {
          uni.showToast({
            title: '网络异常，请稍后再试',
            icon: 'none'
          })
        }
      } else {
        try {
          let res = await this.request({
            url: 'registration/personal/role',
            type: 'get'
          })

          if (res[1].data.state == 200) {
            this.identity = res[1].data.body.map(ele => ele.name)
            this.identityId = res[1].data.body
          } else {
            uni.showToast({
              title: this.$throwStatusCode(res[0][1].data.state, '获取信息'),
              icon: 'none'
            })
          }
        } catch (error) {
          uni.showToast({
            title: '网络异常，请稍后再试',
            icon: 'none'
          })
        }
      }
    },
    //下拉框选择事件
    bindPickeChange (e, text) {
      switch (text) {
        case '行业类型':
          this.info.industryText = this.industry[e.detail.value]
          break;
        case '人员规模':
          this.info.scaleText = this.scale[e.detail.value]
          break;
        case '我的身份':
          this.info.identityText = this.identity[e.detail.value]
          break;
      }
    },
    //防抖解决重复添加
    addBtm () {
      this.$utils.debounce(() => {
        this.createBtn()
      }, 1500)()
    },
    //创建按钮
    async createBtn () {
      if (!this.isChange) {
        return
      }
      //表单校验
      let res = this.checkForm();
      if (res == false) {
        return
      }

      //创建用户
      let industryId = -1;
      let scaleId = -1;
      let identityId = -1;
      let param = {};
      let typeId = this.currentType == '企业' ? 1 : (this.currentType == '政府' ? 2 : 3);
      param.type = typeId;
      param.name = this.info.names;
      if (this.currentType != '个人') {
        industryId = this.getOptionsById(this.industryId, this.info.industryText);
        scaleId = this.getOptionsById(this.scaleId, this.info.scaleText);
        param = { ...param, industry: industryId, staffSize: scaleId, company: this.info.enterprise, invitation: this.invitationCode }
      } else {
        identityId = this.getOptionsById(this.identityId, this.info.identityText)
        param = { ...param, personalRole: identityId, invitation: this.invitationCode }
      }
      try {
        let result = await this.request({
          url: 'registration/create',
          type: 'post',
          param
        })
        if (result[1].data.state == 200) {
          uni.showToast({
            title: `创建成功`
          })

          setTimeout(() => {
            this.getnewewregistration();
            uni.reLaunch({
              url: '/pages/tabbar/home'
            });
          }, 400)
        } else {
          uni.showToast({
            title: this.$throwStatusCode(result[1].data.state, '创建身份'),
            icon: 'none'
          })
        }
      } catch (error) {
      }
    },
    //表单校验
    checkForm () {
      const that = this;
      let tooShort = false;
      let obj = this.$checkForm(this.info, {
        enterprise: {
          alias: `${that.currentType === '企业' ? '企业' : '单位'}名称`,
          type: 'string',
          required: true,
          depend () {
            if (that.currentType != '个人') {
              return true
            }
            return false
          },
          callback (value) {
            // console.log(value);
            if (value.trim() != '' && value.length > 1) {
              return true
            }
            tooShort = true;
            return false
          }
        },
        industryText: {
          alias: '行业类型',
          type: 'string',
          required: true,
          depend () {
            if (that.currentType != '个人') {
              return true
            }
            return false
          },
          callback (value) {
            if (value != '请选择') {
              return true
            }
            return false
          }
        },
        scaleText: {
          alias: '人员规模',
          type: 'string',
          required: true,
          depend () {
            if (that.currentType != '个人') {
              return true
            }
            return false
          },
          callback (value) {
            if (value != '请选择') {
              return true
            }
            return false
          }
        },
        names: {
          alias: '姓名',
          type: 'string',
          required: true,
          // rule:/^(?:[\u4e00-\u9fa5·]{2,16})$/
        },
        identityText: {
          alias: '身份',
          type: 'string',
          required: true,
          depend () {
            if (that.currentType == '个人') {
              return true
            }
            return false
          },
          callback (value) {
            if (value != '请选择') {
              return true
            }
            return false
          }
        }
      })
      const length = Object.keys(obj).length;
      if (length === 0) {
        return true
      }

      if (tooShort) {
        uni.showToast({
          title: `输入${obj.alias}过于简单`,
          icon: 'none'
        })
        return false;
      }
      switch (obj.type) {
        case 'type':
          uni.showToast({
            title: `${obj.alias}类型错误`,
            icon: 'none'
          })
          break;
        case 'required':
          uni.showToast({
            title: `请输入${obj.alias}`,
            icon: 'none'
          })
          break;
        case 'rule':
          let title = '';
          if (obj.alias == '姓名') {
            title = `${obj.alias}输入不符合规范`
          } else if (obj.alias == '企业名称') {
            title = `请输入${obj.alias}`
          } else {
            title = `请选择${obj.alias}`
          }
          uni.showToast({
            title,
            icon: 'none'
          })
          break;
        default:
          break;
      }

      return false
    },
    //弹框确认按钮
    confirmBtn () {
      // let reg = /^[A-Za-z0-9]+$/
      if (!this.invitation.trim()) {
        uni.showToast({
          title: '请输入邀请码',
          icon: 'none'
        })
        this.invitation = '';
        this.closeModal();
        return;
      }

      this.invitationCode = this.invitation
      this.invitation = '';
      this.closeModal();
    },
    //选择选项ID查找
    getOptionsById (arr, text) {
      let id = -1;
      arr.forEach(ele => {
        if (ele.name == text) {
          id = ele.id
        }
      })
      return id
    },
    //创建用户
    createUser () {
      let industryId = '';
      let staffSizeId = '';
    }
  },
  components: {

  }
}
</script>

<style lang='scss' scoped>
$pageBgColor: #f7f7f7;
$borderColor: #e9e9e9;
$placerColor: #cccccc;
$titleColor: #888888;
$greenColor: #00a680;
.createAccount {
  min-height: 100vh;
  background-color: white;
  .accountTop {
    font-size: 42rpx;
    padding: 60rpx 30rpx 60rpx 30rpx;
  }
  .itemBox {
    display: flex;
    height: 100rpx;
    align-items: center;
    width: 750rpx;
    padding: 0rpx 30rpx;
    box-sizing: border-box;
    margin: 0 auto;
    position: relative;
    .itemLeft {
      width: 240rpx;
      font-size: 30rpx;
    }
    .itemCenter {
      flex-grow: 1;
      font-size: 30rpx;
      color: $placerColor;
      height: 100rpx;
      line-height: 100rpx;
    }
    &:active {
      background-color: #fafafa;
    }
    .input {
      position: absolute;
      padding-left: 270rpx;
      left: 0;
      top: 0;
      width: 100%;
      height: 100%;
    }
  }
  .createBtn {
    width: 680rpx;
    height: 100rpx;
    background-color: $greenColor;
    color: white;
    text-align: center;
    line-height: 100rpx;
    border-radius: 10rpx;
    margin: 90rpx auto;
    font-size: 34rpx;
    &:active {
      background-color: #007e5e !important;
    }
  }

  .invitation {
    width: 750rpx;
    position: fixed;
    bottom: 40rpx;
    left: 0rpx;
    text-align: center;
    font-size: 28rpx;
    view:nth-child(1) {
      font-size: 26rpx;
    }
    view:nth-child(2) {
      color: #468fd9;
    }
  }

  .modal {
    animation: fade 0.3s ease-in-out;
    z-index: 100;
    .mask {
      width: 750rpx;
      height: 100vh;
      background-color: rgba(0, 0, 0, 0.4);
      position: fixed;
      top: 0;
      left: 0;
      z-index: 1000;
    }
    .modalBox {
      width: 650rpx;
      height: 400rpx;
      background-color: white;
      position: fixed;
      left: 0;
      right: 0;
      top: -30vh;
      bottom: 0;
      margin: auto;
      border-radius: 20rpx;
      display: flex;
      flex-direction: column;
      z-index: 1001;
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
        font-size: 30rpx;
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
