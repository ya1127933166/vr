<script>
import {
  mapActions, mapState
} from 'vuex';
export default {
  onLaunch () {
    uni.showLoading({
      title: '加载中...',
      mask: true
    });
    this.getSystemInfo()
    this.$quiteLogin(() => {
      this.getLocationInfo();
      setTimeout(() => {

        // this.$checkingAuth();
        if (this.isCheckingAuth) {
          uni.$emit('getMyData')
        }
      }, 900)

    });
    this.initCustom();
  },
  onShow () {

  },
  computed: {
    ...mapState({
      isCheckingAuth: state => state.isCheckingAuth,
      locationInfo: state => state.locationInfo,
      headerData: state => state.headerData
    })
  },
  methods: {
    ...mapActions(['initCustom']),
    //获取系统信息
    getSystemInfo () {
      try {
        let res = uni.getSystemInfoSync();
        this.$$globalData.systemInfo = res
        this.initCustomHeader()
      } catch (e) {
        //TODO handle the exception
      }

    },
    //获取定位信息
    getLocationInfo () {
      const that = this;
      uni.getLocation({
        type: 'wgs84',
        altitude: 'true',
        success: function (res) {
          uni.setStorageSync('locationInfo', res)
          that.setLocationInfo();
        },
        fail: function (e) {
          that.setLocationInfo();
        }
      })
    },
    //设置定位信息
    setLocationInfo () {
      let locate = uni.getStorageSync('locationInfo');
      let param = locate && locate != undefined ? { lat: locate.latitude, lng: locate.longitude } : { lat: '', lng: '' };
      this.request({
        url: `cities/v1`,
        type: 'get',
        param
      }).then((res) => {
        let data = res[1].data;
        let locationData = { name: '定位中' };
        if (data.msg == '成功') {
          this.$store.commit('setCityList', data.body.regions)
          setTimeout(() => {
            if (this.headerData.key != '' && this.locationInfo.id != 'undefined') {
              uni.hideLoading()
            } else {
              uni.hideLoading()
              uni.showToast({
                title: '获取用户信息失败'
              })
            }
          }, 1000)
          if (data.body.location.id != '0') {
            locationData = data.body.location
          } else if (data.body.location.id == '0' && data.body.prevSelected != '{}') {
            locationData = data.body.prevSelected
          } else {
            locationData = data.body.regions[0]
          }
        } else {
          console.log('设置定位信息失败')

        }
        this.$store.commit('updateLocationInfo', locationData)
        this.$store.commit('setCurrentCity', locationData)
      }).catch((e) => {
        console.log(e, '失败');
      })

    },
    //初始化头自定义部信息
    initCustomHeader () {
      //初始化自定义头部配置
      const systemInfo = this.$$globalData.systemInfo;
      this.statusHeight = systemInfo.statusBarHeight;
      const bound = uni.getMenuButtonBoundingClientRect()
      this.boudingHieght = bound.height;
      this.boudingTop = bound.top;
      this.headerHeight = bound.top - 0 + bound.height - 0;
      let info = { bound, headerHeight: `calc( 14rpx + ${this.headerHeight}px );` }
      this.$store.commit('initCustomeheaderInfo', info)
    }
  },
}
</script>

<style lang='scss'>
@import 'colorui/main.css';
@import 'colorui/icon.css';
:root {
  $ss: #00a680;
  --pageBgColor: #f7f7f7;
  --borderColor: #e9e9e9;
  --placerColor: #cccccc;
  --titleColor: #888888;
  --greenColor: #00a680;
}

#cell {
  height: 1px;
  background-color: white;
  .line {
    border-top: 1px solid #d9d9d9;
    -webkit-transform-origin: 0 0;
    transform-origin: 0 0;
    -webkit-transform: scaleY(0.4);
    transform: scaleY(0.4);
    left: 0;
    z-index: 2;
  }
}
</style>
