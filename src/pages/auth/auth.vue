<template>
  <view class="auth-page">
    <PageHeader @backCallBack="backClick"></PageHeader>
    <view :style="'width:100%;height:'+customeheaderInfo.headerHeight"></view>
    <view class="user-avatar">
      <open-data type="userAvatarUrl"></open-data>
    </view>
    <view class="user-info">你好，<open-data type="userNickName"></open-data>
    </view>
    <block v-if="authStep2">
      <view class="auth-content"></view>
      <view class="auth-btn-group">
        <button class="auth-btn"
                v-if="wxwork"
                @tap="getPhoneNumberByWXWork">微信登录</button>
        <button class="auth-btn"
                v-else
                open-type="getPhoneNumber"
                @getphonenumber="getPhoneNumber">微信登录</button>
      </view>
    </block>
    <block v-else-if="authStep1">
      <view class="auth-content">我们需使用您的基本信息验证身份</view>
      <view class="auth-btn-group">
        <button class="auth-btn"
                @tap="getUserProfile">授权使用基本信息</button>
      </view>

    </block>

  </view>
</template>

<script>
import PageHeader from '../../components/comm/pageHeader/pageHeader.vue';
import { mapState, mapMutations } from 'vuex';
export default {
  name: 'Auth',
  data () {
    return {
      authStep1: false,
      authStep2: true,
      // authStep1: true,
      // authStep2: false,
      wxwork: false,
    };
  },
  onLoad () {
    uni.hideLoading()
    // (async () => {
    //     uni.showLoading({
    //         title: 'loding...',
    //     });
    //     try {
    //         // this.authStep1 = true;
    //         this.authStep2 = true;
    //     } catch (err) {
    //         uni.showToast({
    //             title: err.message,
    //             icon: 'none',
    //         });
    //     }
    //     uni.hideLoading();
    // })();
    const systemInfo = uni.getSystemInfoSync();
    if (systemInfo.hasOwnProperty('environment')) {
      this.wxwork = systemInfo.environment === 'wxwork';
    }
  },
  onShow () {
    this.$store.dispatch('updateCustomBar');
  },
  computed: {
    ...mapState({
      isPhone: state => state.isPhone,
      isCheckingAuth: state => state.isCheckingAuth,
      customeheaderInfo: state => state.customeheaderInfo
    }),
  },
  methods: {
    //自定义回退按钮
    backClick () {
      uni.navigateBack({
        delta: -1
      })
    },
    /**
     * 提交获取的用户信息
     */
    getUserProfile () {
      uni.showLoading({
        title: '加载中...',
      });
      let that = this;
      wx.getUserProfile({
        desc: '用于完善用户资料',
        lang: 'zh_CN',
        success: function (res) {
          console.log('wx.getUserProfile=>用户允许了授权')
          const {
            encryptedData,
            iv
          } = res
          that.request({
            url: 'push/wxuser',
            type: 'post',
            param: {
              encryptedData,
              iv
            },
          }).then(res => {

            console.log(res);
            if (res[1].data.state == 200) {
              this.$store.commit('setUserInfoStatus', true)
              uni.showToast({
                title: '授权成功',
                icon: 'none',
              });
              that.$checkingAuth();
            }
          })
        },
        fail: function (res) {
          console.warn('wx.getUserProfile=>用户拒绝了授权', res);
        },
        complete: () => {
          uni.hideLoading()
        }
      });



      // if (e.detail.errMsg == 'getUserInfo:ok') {
      // 	uni.showLoading({
      // 		title: 'loading...',
      // 		mask: true,
      // 	});
      // 	const {
      // 		encryptedData,
      // 		iv
      // 	} = e.detail;
      // 	console.log(iv);
      // 	this.request('push/wxuser', 'post', {
      // 		encryptedData,
      // 		iv,
      // 	}, (err, res) => {
      // 		uni.hideLoading();
      // 		if (err) {
      // 			uni.showModal({
      // 				content: err.message,
      // 				showCancel: false,
      // 			});
      // 		} else {
      // 			uni.showToast({
      // 				title: '授权成功，请继续授权获取手机号码',
      // 				icon: 'none',
      // 			});
      // 			this.authStep1 = false;
      // 			this.authStep2 = true;
      // 		}
      // 	});
      // }
    },
    /**
     * 提交获取的手机号码
     */
    async getPhoneNumber (e) {

      const that = this;
      this.$utils.debounce(() => {
        if (that.isPhone == false) {
          console.log(e);
          if (e.detail.errMsg == 'getPhoneNumber:ok') {
            uni.showLoading({
              title: '加载中...',
              mask: true,
            });
            this.request({
              url: 'push/wxuser',
              type: 'post',
              param: {
                encryptedData: e.detail.encryptedData,
                iv: e.detail.iv
              },
            }).then((res) => {
              console.log('授权', res[1].data.state)
              uni.navigateBack({
                delta: -1
              })
              if (res[1].data.state == 200) {
                this.$store.commit('setPhoneStatus', true)
                uni.showToast({
                  title: '授权成功',
                  icon: 'success'
                })
                console.log(123456)
                that.$checkingAuth();
              } else {
                uni.showToast({
                  title: this.$throwStatusCode(res[1].data.state, '授权手机号'),
                  icon: 'none'
                })
              }
            }).catch((e) => {
              uni.showToast({
                title: '网络错误，请稍后再试',
                icon: 'none'
              })
            })
          } else {
            uni.showToast({
              title: '授权失败',
              icon: 'none'
            })
            setTimeout(() => {
              uni.navigateBack({
                delta: -1
              })
            }, 1500)
          }
        } else {
          uni.showToast({
            title: '未获取到登陆信息,请重新进入小程序重试',
            icon: 'none'
          })
          setTimeout(() => {
            uni.navigateBack({
              delta: -1
            })
          }, 1500)
        }
      }, 1000)()
      //判断用户身份是否过期确定是否再次登录
      // let header = uni.getStorageSync('header');
      // console.log(header&&header.sync.number=='sync');
      // console.log(header);

    },
    /**
     * 推送更新用户电话号码
     */
    pushUserNumber (e) {
      this.request({
        url: 'push/wxuser',
        type: 'post',
        param: {
          encryptedData: e.detail.encryptedData,
          iv: e.detail.iv
        },
      }).then((res) => {
        if (res[1].data.msg == '成功') {
          this.$store.commit('setPhoneStatus', true)
          uni.showToast({
            title: '授权成功',
            icon: 'success'
          })
          console.log('globalData', this.$$globalData.jumpPath);
          setTimeout(() => {
            uni.redirectTo({
              url: this.$$globalData.jumpPath
            })
          }, 500)
        }
      }).catch((e) => {
        console.log(e)
      })
    },
    /**
     * 企业微信登录
     */
    wxworkLogin () {
      return new Promise((resolve, reject) => {
        wx.qy.login({
          success: (res) => {
            resolve(res.code);
          },
          fail: () => {
            reject();
          },
        });
      });
    },
    /**
     * 确认session
     */
    wxworkCheck () {
      return new Promise((resolve, reject) => {
        wx.qy.checkSession({
          success: (e) => {
            resolve();
          },
          fail: () => {
            reject();
            console.log('过期了');
          },
        });
      });
    },
    /**
     * 获取手机号码
     */
    wxworkGetPhone () {
      return new Promise((resolve, reject) => {
        wx.qy.getMobile({
          success: (res) => {
            resolve(res);
          },
          fail: () => {
            reject();
          },
        });
      });
    },
    /**
     * 解密企业微信手机号码
     */
    async getPhoneNumberByWXWork () {
      console.log(123456);
      uni.showLoading();
      try {
        let code = await this.wxworkLogin();
        await this.request('/business/qy_silence_login', 'post', {
          code,
        });
        const {
          encryptedData,
          iv
        } = await this.wxworkGetPhone();
        // todo需要修改为企业微信登录
        this.request('/business/qy_login', 'post', {
          encryptedData,
          iv,
          // code,
        }, (err, res) => {
          uni.hideLoading();
          if (err) {
            uni.showModal({
              content: err.message,
              showCancel: false,
            });
          } else if (res) {
            uni.showToast({
              title: '登录成功',
            });
            // 登录成功
            this.$store.commit('updateLogin', true);
            this.waiting.loginSuccess();
            if (res.id > 0) {
              this.$store.commit('setUserinfo', res);
              this.waiting.userinfoSuccess();
              this.$store.dispatch('getLocationList');
            }
          }
        });
      } catch (e) {
        uni.hideLoading();
        uni.showModal({
          content: '登录失败，环境异常',
          showCancel: false,
        });
      }
    },
  },
  components: {
    PageHeader
  }
}
</script>

<style lang="scss">
page {
  background: #fff;
}

.auth-page {
  padding: 18vh 0;
  text-align: center;
}

.user-avatar {
  width: 128rpx;
  height: 128rpx;
  margin: 60rpx auto;
  border-radius: 12rpx;
  overflow: hidden;
}

.user-info {
  margin: 60rpx auto;
  line-height: 100rp;
  font-size: 32rpx;
}

.auth-content {
  margin-bottom: 60rpx;
  font-size: 28rpx;
  color: #888;
}

.auth-btn-group {
  .auth-btn {
    width: 400rpx;
    height: 90rpx;
    line-height: 90rpx;
    padding: 0;
    margin: 0 auto;
    font-size: 32rpx;
    color: #fff;
    background: #00a680;
  }
}
</style>
