<template>
  <!-- 公关详情 -->
  <!-- <scroll-view scroll-y class="noticeDetail">
        <view class='detailHeader'>
            <view class="detailTitle">关于春节放假通知</view>
            <view class="detailTime">2020年12月30日 12:23</view>
        </view>
        <view class="detailText">
            公司2020年春节放假已经安排，请各位小伙伴查看，并安排春节出行balabalabalabalabalalbqqqqqeaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaabababababababaab
        </view>
    </scroll-view> -->
  <div class="webBox">
    <web-view class="webview"
              style="width: 100px;height: 100px;"
              :src="addUrl"></web-view>
  </div>
</template>

<script>
export default {
  data () {
    return {
      addUrl: ''
    }
  },
  onLoad (options) {
    this.addUrl = JSON.parse(options.addUrl)
  }
}
</script>

<style lang='scss' scoped>
$pageBgColor: #f7f7f7;
$borderColor: #e9e9e9;
$placerColor: #cccccc;
$titleColor: #888888;
$greenColor: #00a680;
page {
  background-color: white !important;
}
.webview {
  width: 100px;
  height: 100px;
}
</style>