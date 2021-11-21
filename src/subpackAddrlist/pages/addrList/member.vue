<template>
  <!-- 成员通用页面 -->
  <view class='member'>
    <view class='title'></view>
    <view class='infoBox'>
      <view class='normal'>
        <view class='left'>姓名</view>
        <input v-model="info.name"
               class='center input'
               placeholder-style="color:#cccccc;font-size:30rpx"
               placeholder="请输入" />
      </view>
      <view id="cell">
        <view class="line"></view>
      </view>
      <view class='normal'>
        <view class='left'>性别</view>
        <view class='pickBox'>
          <picker mode="selector"
                  :range="info.sex.range"
                  @change="bindPickerChange($event,'性别')">
            <view class='pickItem'>
              <view :style="'color:'+(info.sex.val=='请选择'?'#cccccc':'black')"
                    class="picker">{{info.sex.val}}</view>
            </view>
          </picker>
        </view>
        <view class='cuIcon-right'></view>
      </view>
      <view id="cell">
        <view class="line"></view>
      </view>
      <view class='normal'>
        <view class='left'>手机</view>
        <input v-model="info.phone"
               class='center input'
               placeholder-style="color:#cccccc;font-size:30rpx"
               placeholder="11位手机号码"
               type="number" />
      </view>
      <view id="cell">
        <view class="line"></view>
      </view>
      <view class='normal'>
        <view class='left'>微信号</view>
        <input v-model="info.weixin"
               class='center input'
               placeholder-style="color:#cccccc;font-size:30rpx"
               placeholder="可选" />
      </view>
    </view>

    <view class='title'></view>
    <view class='infoBox'>
      <view class='normal'>
        <view class='left'>职务</view>
        <input v-model="info.post"
               class='center input'
               placeholder-style="color:#cccccc;font-size:30rpx"
               placeholder="请输入" />
      </view>
      <view id="cell">
        <view class="line"></view>
      </view>
      <view class='normal storeNormal'
            style="height:auto"
            @tap="selectStore">
        <view class='left'>部门/门店</view>
        <view class='center'>
          <view class="centerBox">
            <block v-for="item in info.department"
                   :key="item">
              <view v-if="!(item.org_name=='请选择'&&info.department.length>1)"
                    class="boxItem"
                    :style="'color:'+(item.org_name=='请选择'?'#cccccc':'black')">{{item.org_name}}</view>
            </block>
          </view>
        </view>
        <view class='cuIcon-right'></view>
      </view>
    </view>

    <view class='checkItem'
          v-if="currentType=='添加成员'">
      <checkbox-group @change="bindCheckboxChange">
        <label>
          <checkbox color="#FFCC33"
                    style="transform:scale(0.7)" />
          <view>发送短信邀请通知</view>
        </label>
      </checkbox-group>
    </view>
    <view @tap="saveBtn('修改')"
          v-if="currentType=='编辑成员'"
          :style="'background-color:'+(isChange?'#00a680':'#cccccc')+';'"
          class='saveBtn'>保存</view>

    <view v-if="currentType=='添加成员'"
          class="btnBox">
      <view @tap="saveBtn('保存')"
            :style="'background-color:'+(isChange?'#00a680':'#cccccc')+';'"
            class="btnLeft">保存</view>
      <view @tap="saveBtn('添加')"
            :style="'border:solid 1rpx '+(isChange?'#00a680':'#cccccc')+';color:'+(isChange?'#00a680':'#cccccc')+';'"
            class="btnRight">保存，继续添加</view>
    </view>
    <view @tap="removeBtn()"
          v-if="currentType=='编辑成员'&&memberDetail.creator=='N'"
          class="removeBtn">删除</view>
  </view>
</template>

<script>
import { createNamespacedHelpers } from 'vuex';
const { mapState: addrState, mapMutations: addrMutations } = createNamespacedHelpers('addrList');
export default {
  name: "member",
  data () {
    return {
      info: {
        name: '',
        sex: { val: '请选择', range: ['男', '女'] },
        phone: '',
        weixin: '',
        post: '',
        department: [{ org_id: 'c', org_name: '请选择' }],
        isSend: false,
        text: ''
      },
      initInfo: '',//监听数据
      isChange: false,//初始数据是否改动
      currentType: ''
    }
  },
  onLoad (options) {
    uni.setNavigationBarTitle({
      title: options.type,
    })
    this.currentType = options.type
    if (this.currentType == '添加成员') {
      this.info.department[0] = JSON.parse(options.department)
    }
    if (this.memberDetail != {} && this.currentType == '编辑成员') {
      let { staff_name, gender, phone_no, wechat_no, position, organization } = this.memberDetail
      this.info.name = staff_name;
      this.info.sex.val = gender == 2 ? '女' : '男';
      this.info.phone = phone_no;
      this.info.weixin = wechat_no;
      this.info.post = position;
      this.info.department = organization;
      this.info.department.unshift({ org_id: 'c', org_name: '请选择' })
    }
  },
  onShow () {
    // console.log(this.currentType);
    // console.log(this.memberDetail);
    // console.log(this.currentType=='编辑成员'&&this.memberDetail.creator=='N');
  },
  mounted () {
    this.initInfo = JSON.stringify(this.info);
  },
  computed: {
    ...addrState({
      selectStoreList (state) {
        this.info.department = state.selectStoreList
        return state.selectStoreList
      },
      memberDetail (state) {
        return state.memberDetail
      }
    }),
    watchInfo () {
      return JSON.stringify(this.info)
    }
  },
  watch: {
    watchInfo (newValue, oldValue) {
      if (newValue != this.initInfo) {
        this.isChange = true;
      } else {
        this.isChange = false;
      }
    },
    organization (newValue, oldValue) {
      // console.log(newValue,oldValue);
    }
  },
  methods: {
    ...addrMutations(['setSelectStoreList', 'setMemberDetail']),
    //下拉菜单选择事件
    bindPickerChange (e, text) {
      if (text == '性别') {
        this.info.sex.val = this.info.sex.range[e.detail.value]
      } else {
        this.info.department.val = this.info.department.range[e.detail.value]
      }
    },
    //选择部门
    selectStore () {
      if (this.currentType == '编辑成员') {
        this.setSelectStoreList(this.info.department)
      }
      uni.navigateTo({
        url: '../../../subpackAddrlist/pages/addrList/selectStore',
      })
    },
    //单选按钮改变
    bindCheckboxChange (e) {
      if (e.detail.value.length == 1) {
        this.info.isSend = true
      } else {
        this.info.isSend = false
      }
    },
    //保存按钮
    async saveBtn (text) {
      let res = this.checkRule()
      if (res != true) {
        return
      }
      if (this.isChange == false) {
        return
      }
      if (this.info.department.length == 1 && this.info.department[0].org_name == '请选择') {
        uni.showToast({
          title: '请选择部门/门店',
          icon: 'none'
        })
        return
      }

      //对比修改成员数据是否有变动，如未发生改变则直接返回
      if (this.currentType == '编辑成员') {

        let { staff_name, gender, organization, phone_no, position, wechat_no } = this.memberDetail;
        let { name, sex, phone, weixin, post, department } = this.info;
        if (staff_name == name && (gender == 1 ? '男' : '女') == sex.val && phone_no == phone && JSON.stringify(organization) == JSON.stringify(department) && position == post && weixin == wechat_no) {
          uni.navigateBack({
            delta: -1
          })
          return
        }
      }
      try {
        let param = {};
        let { name, sex, phone, weixin, post, department, isSend } = this.info;
        param.staff_name = name;
        param.gender = sex.val == '男' ? 1 : 2;
        param.phone_no = phone;
        param.wechat_no = weixin;
        param.position = post;
        let temp = [];
        department.forEach(ele => {
          if (ele.org_id != 'c' && ele.org_name != '请选择') {
            temp.push(ele.org_id)
          }
        })
        param.org_id = temp.join(',');
        let url = '';
        if (this.currentType == '添加成员') {
          param.sms_checked = isSend ? 'Y' : 'N';
          url = 'staff/add';
        } else {
          param.staff_id = this.memberDetail.staff_id;
          url = 'staff/update';
        }


        let res = await this.request({
          url,
          type: 'post',
          param
        })
        this.text = temp
        if (res[1].data.state == 200) {
          uni.showToast({
            title: `${this.currentType == '添加成员' ? '添加成员' : '修改成员'}成功`
          })
          if (this.currentType == '添加成员') {
            this.$bus.$emit('updateStafflist', { val: this.text, type: '添加成员' })
          } else {
            this.$bus.$emit('updateStafflist', { val: this.text, type: '修改成员' })
          }
          // this.$bus.$emit('updateStafflist',this.currentType)
          if (text == '保存' || text == '修改') {
            setTimeout(() => {
              uni.navigateBack({
                delta: -1
              })
            }, 1000)
          }

          let temp = this.memberDetail;
          temp.isEdit = true
          this.setMemberDetail(temp)
          this.info.name = '';
          this.info.sex.val = '请选择';
          this.info.phone = '';
          this.info.weixin = '';
          this.info.post = '';
          this.info.isSend = false;
          this.setSelectStoreList([{ org_id: 'c', org_name: '请选择' }]);

        } else {
          let title = res[1].data.state == 199 ? `${this.currentType == '添加成员' ? '添加成员' : '修改成员'}失败` : res[1].data.msg;
          uni.showToast({
            title,
            icon: 'none'
          })
        }
      } catch (error) {
        console.log(error);
      }
    },
    //删除按钮
    removeBtn () {
      const that = this;
      uni.showModal({
        title: '提示',
        content: '确定删除该成员？',
        success: function (res) {
          if (res.confirm) {
            that.request({
              url: 'staff/delete',
              type: 'post',
              param: {
                staff_id: that.memberDetail.staff_id
              }
            }).then((res) => {
              if (res[1].data.state == 200) {
                uni.showToast({
                  title: '删除成功'
                })

                let temp = that.memberDetail;
                let arr = []
                temp.organization.forEach((v, i) => {
                  arr[i] = v.org_id
                })
                that.$bus.$emit('updateStafflist', { val: arr, type: '删除成员' })
                temp.isEdit = true
                that.setMemberDetail(temp)
                setTimeout(() => {
                  uni.navigateBack({
                    delta: 2
                  })
                }, 1000)

              } else {
                let title = res[1].data.state == 199 ? '删除失败' : res[1].data.msg
                uni.showToast({
                  title,
                  icon: 'none'
                })
              }
            }).catch((e) => {
              console.log(e);
            })
          } else if (res.cancel) {
            console.log('用户点击取消');
          }
        }
      });
    },
    //修改成员
    undateMember (text) {
      if (text == '保存') {
        let check = this.checkRule();
      }
    },
    //表单校验
    checkRule () {
      if (!this.isChange) {
        return
      }
      const that = this;
      //表单校验 兼容ios
      if (!(/^1[3456789]{1}[0-9]{9}$/.test(this.info.phone))) {
        uni.showToast({
          title: '电话输入不规范',
          icon: 'none'
        })
        return false;
      }
      let obj = this.$checkForm(this.info, {
        name: {
          alias: '姓名',
          type: 'string',
          required: true,
          // rule:/^(?:[\u4e00-\u9fa5·]{2,16})$/
        },
        'sex.val': {
          alias: '性别',
          type: 'string',
          required: true,
          callback (value) {
            if (value != '请选择') {
              return true;
            }
            return false;
          }
        },
        phone: {
          alias: '手机',
          type: 'string',
          required: true,
          rule: /^1[3456789]{1}[0-9]{9}$/,
        },
        weixin: {
          alias: '微信号',
          type: 'string',
          // rule:/^[a-zA-Z][-_a-zA-Z0-9]{5,19}$/,
          depend () {
            if (that.info.weixin != '' && that.info.weixin.length > 1) {
              return true
            }
            return false
          }
        },
        post: {
          alias: '职务',
          type: 'string',
          depend () {
            if (that.info.post.trim()) {
              return true
            }
            return false
          }
        }
      })

      const length = Object.keys(obj).length;
      if (length === 0) {
        return true;
      }

      switch (obj.type) {
        case 'required':
          uni.showToast({
            title: `请输入${obj.alias}`,
            icon: 'none'
          })
          break;
        case 'rule':
          let title = `${obj.alias}输入不符合规范`;
          if (obj.alias == '性别' || obj.alias == '部门/门店') {
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
      return false;
    }
  },
  onUnload () {
    this.setSelectStoreList([{ org_id: 'c', org_name: '请选择' }]);
  }
}
</script>

<style lang='scss' scoped>
$pageBgColor: #f7f7f7;
$borderColor: #e9e9e9;
$placerColor: #cccccc;
$titleColor: #888888;
$greenColor: #00a680;
.member {
  .title {
    font-size: 26rpx;
    color: #6d6c6c;
    padding: 20rpx 0rpx 20rpx 20px;
  }
  .infoBox {
    background-color: white;
    box-sizing: border-box;
    .normal {
      padding: 0rpx 40rpx 0rpx 40rpx;
      box-sizing: border-box;
      display: flex;
      justify-content: space-between;
      align-items: center;
      height: 100rpx;
      position: relative;
      .input {
        position: absolute;
        left: 0;
        top: 0;
        width: 100%;
        height: 100%;
        padding-left: 300rpx;
      }
      .pickBox {
        flex-grow: 1;
        display: flex;
        justify-content: space-between;
        // background-color: yellow;
        width: 100rpx;
        .pickItem {
          position: absolute;
          height: 100%;
          width: 100%;
          display: flex;
          padding-left: 300rpx;
          left: 0;
          top: 0;
          align-items: center;
          .picker {
            padding-right: 20rpx;
            color: black;
            font-size: 30rpx;
          }
        }
      }
      .left {
        width: 260rpx;
        display: flex;
        align-items: center;
        font-size: 30rpx;
        view:nth-child(2) {
          margin-left: 20rpx;
        }
      }
      .center {
        flex-grow: 1;
        // color: #cccccc;
        font-size: 30rpx;
        .tag {
          display: inline-block;
          color: #6666ff;
          background-color: #dae8fc;
          font-size: 30rpx;
          text-align: center;
          padding: 4rpx 10rpx;
        }
        .btnBox {
          display: flex;
          view {
            width: 150rpx;
            height: 50rpx;
            border-radius: 30rpx;
            font-size: 28rpx;
            text-align: center;
            line-height: 50rpx;
            margin-right: 20rpx;
          }
          view:nth-child(1) {
            border: solid 1rpx $titleColor;
            color: black;
          }
          view:nth-child(2) {
            border: solid 1rpx $greenColor;
            color: $greenColor;
          }
        }
      }
      .right {
        display: flex;
        align-items: center;
        view {
          color: black;
          font-weight: 600;
        }
        image {
          margin-left: 20rpx;
        }
      }
      &:active {
        background-color: #fafafa;
      }
    }
    .storeNormal {
      align-items: flex-start;
      padding: 30rpx 40rpx;
      box-sizing: border-box;
      .center {
        flex-grow: 1;
        max-width: 500rpx;
        .centerBox {
          display: flex;
          flex-wrap: wrap;
          .boxItem {
            margin-right: 20rpx;
          }
        }
      }
    }
    .normal:last-child {
      border: none;
    }
    .note {
      border: none;
      .center {
        text-align: right;
      }
    }
    .noteArea {
      height: 100rpx;
    }
    .cell {
      position: absolute;
      bottom: 0;
      left: 0;
      width: 1670rpx;
      height: 1rpx;
      background-color: $borderColor;
      // margin: 40rpx 0rpx 40rpx 0rpx;
      transform: scale(0.4) translateY(-100%);
      transform-origin: left top;
    }
  }
  .buttomBox {
    padding-top: 60rpx;
    width: 680rpx;
    margin: 0 auto;
    display: flex;
    justify-content: space-between;
    view {
      width: 300rpx;
      height: 80rpx;
      text-align: center;
      line-height: 80rpx;
      border-radius: 10rpx;
      font-size: 28rpx;
      font-weight: 600;
    }
    view:nth-child(1) {
      background-color: $greenColor;
      color: white;
    }
    view:nth-child(2) {
      border: solid 1rpx $greenColor;
      color: $greenColor;
    }
  }
  .checkItem {
    padding: 30rpx;
    color: $titleColor;
    label {
      display: flex;
      align-items: center;
      view {
        margin-left: 16rpx;
      }
    }
  }
  .removeBtn,
  .saveBtn {
    width: 690rpx;
    height: 100rpx;
    color: #ea716c;
    font-size: 34rpx;
    text-align: center;
    background-color: white;
    margin: 60rpx auto;
    line-height: 100rpx;
    border-radius: 10rpx;
  }
  .saveBtn {
    color: white;
    &:active {
      background-color: #007e5e !important;
    }
  }
  .btnBox {
    width: 690rpx;
    height: 100rpx;
    font-size: 36rpx;
    display: flex;
    justify-content: space-between;
    margin: 30rpx auto;
    .btnLeft,
    .btnRight {
      width: 320rpx;
      height: 100%;
      text-align: center;
      line-height: 100rpx;
      border-radius: 10rpx;
    }
    .btnLeft {
      background-color: $greenColor;
      color: white;
      &:active {
        background-color: #007e5e !important;
      }
    }
    .btnRight {
      border: solid 1rpx $greenColor;
      color: $greenColor;
      &:active {
        background-color: #fafafa;
        color: white;
      }
    }
  }
}
</style>
