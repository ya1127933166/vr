<template>
  <!-- 上传图片  别用这个页面了  废了废了 -->
  <view class='upload'>
    <view class='uploadTitle'
          v-if="isShow">
      <!--     <view class='titleTop'>天鹅湖二期 <text>2室1厅1卫</text></view>
            <view class='titleBottom'>12-2-2001</view> -->
      <view class='titleTop'>{{contentTitle[0]}} <text>{{contentTitle[1]}}</text></view>
      <view class='titleBottom'>{{contentTitle[2]}}</view>
    </view>
    <view class=""
          v-if='numType ==3 || numType==1||numType==2||numType==5||numType=="agency"||numType=="rent"'>
      <view class="uploadItemBox"
            style='margin-top: 20rpx;'>
        {{titleList[0]}}照片({{tempList1.length}}/{{len}})
      </view>
      <view class='uploadItemBox'>
        <!-- 	    <view class='itemTitle'>照片 <text>({{tempList1.length}}/10)</text></view> -->
        <view class='itemBox'>
          <block v-for="item in tempList1"
                 :key="item">
            <view class='imageBox'>
              <image class='itemImage'
                     mode="aspectFill"
                     style="width:100rpx;height:100rpx;"
                     :src='item'></image>
              <view @tap="removePreviewListItem(item,1)"
                    class='cross cuIcon-roundclosefill'></view>
            </view>
          </block>
          <view v-if="tempList1.length<len"
                class='addItem'
                @tap="uploadHandel(0)">
            <view class="cuIcon-camera"></view>
          </view>
        </view>
      </view>
    </view>
    <view class=""
          v-if='numType==1||numType==3 ||numType==4||numType=="property"'>
      <view class="uploadItemBox"
            style='margin-top: 20rpx;'>
        {{titleList[1]}}照片({{tempList2.length}}/{{len}})
      </view>
      <view class='uploadItemBox'>
        <!--   <view class='itemTitle'>照片 <text></text></view> -->
        <view class='itemBox'>
          <block v-for="item in tempList2"
                 :key="item">
            <view class='imageBox'>
              <image class='itemImage'
                     mode="aspectFill"
                     style="width:110rpx;height:110rpx;"
                     :src='item'></image>
              <view @tap="removePreviewListItem(item,2)"
                    class='cross cuIcon-roundclosefill'></view>
            </view>
          </block>
          <view v-if="tempList2.length<len"
                class='addItem'
                @tap="uploadHandel(1)">
            <view class="cuIcon-camera"></view>
          </view>
        </view>
      </view>
    </view>
    <view class=""
          v-if='numType==3'>
      <view class="uploadItemBox"
            style='margin-top: 20rpx;'>
        {{titleList[2]}}照片({{tempList3.length}}/{{len}})
      </view>
      <view class='uploadItemBox'>
        <!--  <view class='itemTitle'>照片 <text>({{tempList3.length}}/10)</text></view> -->
        <view class='itemBox'>
          <block v-for="item in tempList3"
                 :key="item">
            <view class='imageBox'>
              <image class='itemImage'
                     mode="aspectFill"
                     style="width:110rpx;height:110rpx;"
                     :src='item'></image>
              <view @tap="removePreviewListItem(item,3)"
                    class='cross cuIcon-roundclosefill'></view>
            </view>
          </block>
          <view v-if="tempList3.length<len"
                class='addItem'
                @tap="uploadHandel(2)">
            <view class="cuIcon-camera"></view>
          </view>
        </view>
      </view>
    </view>

    <!-- <view @tap="clickItem" class='describe'>
            <view class='describeTitle'>
                <view class='titleLeft'>描述</view>
                <view class='titleRight'>为图片添加描述</view>
            </view>
            <textarea :focus="areaFocus" @blur="areaFocus=false" class='textArea' maxlength="-1" name="" id="" cols="3" rows="1"></textarea>
        </view> -->
    <view @tap="saveBtn"
          class='save'>保存</view>
  </view>
</template>

<script>
import { mapMutations, mapState, createNamespacedHelpers } from 'vuex';
const { mapState: contractState, mapMutations: contractMutation } = createNamespacedHelpers('contract');
import upy from '../../function/upload-upyun.js'
export default {
  data () {
    return {
      contentTitle: ['', '', ''],
      titleList: ['室内', '户型', "户外"],
      previewList: [],
      areaFocus: false,
      tempList1: [],
      tempList2: [],
      tempList3: [],
      showPice1: [],
      showPice2: [],
      showPice3: [],
      upList: [],
      total: [],
      imageUrL: '/houses',
      isShow: true,
      len: 10, //图片张数
      numType: 3,
      one: true,
      starValue: [],
      endValue: [],
      indexCurry: {
        tempOne: [],
        tempTwe: [],
        tempThr: []
      }
      //合租 照片
    }
  },
  onLoad (options) {
    const { reloadUrl } = this.$store.state || {}
    this.numType = options.numType
    //租房 拍摄照片 numType 1 整租 2 合租
    if (options.numType == 1 || options.numType == 2) {
      this.contentTitle[0] = this.stepHouse1[2].val
      this.contentTitle[1] = this.stepHouse1[4]
      this.contentTitle[2] = this.stepHouse1[7]
      if (options.numType == 1) {
        this.titleList = ['公区', '室内']
      } else if (options.numType == 2) {
        this.titleList = ['公区', '房间']
        this.tempList1 = this.showImageList[0]
        this.upTempImageList[0].forEach((ele, i) => {
          let num = ele.indexOf('/houses')
          this.showPice1[i] = ele.slice(num)
        })
        if (options.num == 5) {
          this.tempList2 = this.showImage.show
          this.showPice2 = this.showImage.pice
          this.numType = 4
        }
      }
      //跟进记录
    } else if (options.numType == 5) {
      this.isShow = false
      this.imageUrL = '/followup'
      this.len = 4
      this.titleList = ['跟进记录']
    } else if (options.numType == 3) {
      //二手房
      this.contentTitle[0] = this.step1[1].val
      this.contentTitle[1] = this.step1[3]
      this.contentTitle[2] = this.step1[6]
    } else if (options.numType == 'agency' || options.numType == 'property' || options.numType == 'rent') {
      //合同页面

      this.isShow = false
      this.len = 10
      this.imageUrL = options.numType === 'rent' ? '/tenant/contract' : '/landlord/contract'
      if (options.numType == 'rent' || options.numType == 'agency') {
        this.tempList1 = reloadUrl
        delete this.$store.state.reloadUrl
        this.tempList1.forEach((ele, i) => {
          let flag = ele.indexOf(this.$baseURL)
          if (flag > -1) {
            let num = ele.indexOf('/landlord/contract')
            this.showPice1[i] = ele.slice(num)
          } else {
            this.showPice1[i] = ele
          }
        })

        this.titleList = [`${options.type}`]
      }
      if (options.numType == 'property') {
        this.tempList2 = reloadUrl
        delete this.$store.state.reloadUrl
        this.tempList2.forEach((ele, i) => {
          let flag = ele.indexOf(this.$baseURL)
          if (flag > -1) {
            let num = ele.indexOf('/landlord/contract')
            this.showPice2[i] = ele.slice(num)
          } else {
            this.showPice2[i] = ele
          }
        })
        this.titleList = ['', `${options.type}`]
      }
    }
    if (options.numType != 2 && options.numType != 'rent' && options.numType != 'property' && options.numType != 'agency') {
      this.tempList1 = this.showImageList[0]
      this.tempList2 = this.showImageList[1]
      this.tempList3 = this.showImageList[2]
      this.upTempImageList[0].forEach((ele, i) => {
        let num = ele.indexOf('/houses')
        this.showPice1[i] = ele.slice(num)
      })
      this.upTempImageList[1].forEach((ele, i) => {
        let num = ele.indexOf('/houses')
        this.showPice2[i] = ele.slice(num)
      })
      this.upTempImageList[2].forEach((ele, i) => {
        let num = ele.indexOf('/houses')
        this.showPice3[i] = ele.slice(num)
      })
    }

    uni.setNavigationBarTitle({
      title: options.type
    })
  },
  onShow () {
  },
  computed: {
    ...mapState({
      showImageList: function (state) {
        this.previewList = state.showImageList
        return state.showImageList
      },
      upTempImageList: state => state.upTempImageList
    }),
    ...contractState({
      step1: state => state.step1,
      stepHouse1: state => state.stepHouse1,
      addHouse: state => state.addHouse,
      showImage: state => state.showImage
    })
  },
  watch: {
    tempList1: {
      handler (newValue, oldValue) {
        this.endValue = newValue
        if (this.one) {
          this.starValue = newValue
          this.one = false
        }
        let temp = this.endValue.map((ele, i) => {
          if (ele === this.starValue[i]) {
            return i
          } else {
            return -1
          }
        })
        this.indexCurry.tempOne = temp.filter((ele, i, arr) => {
          return ele > -1
        })
      },
      deep: true,
      immediate: false,
    },
    tempList2: {
      handler (newValue, oldValue) {
        this.endValue = newValue
        if (this.one) {
          this.starValue = newValue
          this.one = false
        }
        let temp = this.endValue.map((ele, i) => {
          if (ele === this.starValue[i]) {
            return i
          } else {
            return -1
          }
        })
        this.indexCurry.tempTwe = temp.filter((ele, i, arr) => {
          return ele > -1
        })
      },
      deep: true,
      immediate: false,
    },
    tempList3: {
      handler (newValue, oldValue) {
        this.endValue = newValue
        if (this.one) {
          this.starValue = newValue
          this.one = false
        }
        let temp = this.endValue.map((ele, i) => {
          if (ele === this.starValue[i]) {
            return i
          } else {
            return -1
          }
        })
        this.indexCurry.tempThr = temp.filter((ele, i, arr) => {
          return ele > -1
        })
      },
      deep: true,
      immediate: false,
    }
  },
  methods: {
    ...contractMutation(['setHouseInfo', 'setImage']),
    ...mapMutations(['setupTempImageList', 'setshowImageList']),
    //上传图片
    async uploadHandel (num) {
      switch (num) {
        case 0:
          try {
            let Nuber = this.len - this.tempList1.length
            let data = await this.uploadFiles(Nuber);
            this.upList[num] = data.tempFiles.map(ele => ele.tempFilePath);
            // this.total[num] = [...this.total[num], ...this.upList[num]]
            if (this.upList[num] > this.len) {
              uni.showToast({
                title: `单次最多上传${this.len}张`,
                icon: 'none'
              })
              return
            }
            if (Number(this.tempList1.length) + this.upList[num].length <= this.len) {
              this.tempList1 = [...this.tempList1, ...this.upList[num]];
            } else {
              //  if(this.tempList1.length>this.len){
              uni.showToast({
                title: `最多上传${this.len}张`,
                icon: 'none'
              })
              return
            }
          } catch (error) {
            uni.hideLoading()
            console.log(error)
          }
          break
        case 1:
          try {
            let Nuber = this.len - this.tempList2.length
            let data = await this.uploadFiles(Nuber);
            this.upList[num] = data.tempFiles.map(ele => ele.tempFilePath);
            if (this.upList[num].length > this.len) {
              uni.showToast({
                title: `单次最多上传${this.len}张`,
                icon: 'none'
              })
              return
            }
            if (Number(this.tempList2.length) + this.upList[num].length <= this.len) {
              this.tempList2 = [...this.tempList2, ...this.upList[num]];
            } else {
              uni.showToast({
                title: `最多上传${this.len}张`,
                icon: 'none'
              })
              return
            }
          } catch (error) {
            console.log(error)
          }
          break
        case 2:
          try {
            let Nuber = this.len - this.tempList3.length
            let data = await this.uploadFiles(Nuber);
            this.upList[num] = data.tempFiles.map(ele => ele.tempFilePath);
            if (this.upList[num].length > this.len) {
              uni.showToast({
                title: `单次最多上传${this.len}张`,
                icon: 'none'
              })
              return
            }
            if (Number(this.tempList3.length) + this.upList[num].length <= this.len) {
              this.tempList3 = [...this.tempList3, ... this.upList[num]];
            } else {
              uni.showToast({
                title: `最多上传${this.len}张`,
                icon: 'none'
              })
              return
            }
          } catch (error) {
            console.log(error)
          }
          break
      }
    },
    //删除图片
    removePreviewListItem (src, index) {
      switch (index) {
        case 1:
          let temp1 = this.tempList1.filter((ele, i) => {
            return ele == src
          });
          temp1 = temp1.toString()
          let num1 = this.tempList1.indexOf(temp1)
          this.showPice1.splice(num1, 1)
          this.tempList1.splice(num1, 1)
          break;
        case 2:
          let temp2 = this.tempList2.filter((ele, i) => {
            return ele == src
          });
          temp2 = temp2.toString()
          let num2 = this.tempList2.indexOf(temp2)
          this.showPice2.splice(num2, 1)
          this.tempList2.splice(num2, 1)
          break;
        case 3:
          let temp3 = this.tempList3.filter((ele, i) => {
            return ele == src
          });
          temp3 = temp3.toString()
          let num3 = this.tempList3.indexOf(temp3)
          this.showPice3.splice(num3, 1)
          this.tempList3.splice(num3, 1)
          break;

      }

    },
    /**
     * 保存按钮
     */
    saveBtn () {
      //保存 后 图片上传
      let p = []
      if (this.indexCurry.tempOne.length > 0) {
        this.upList[0] = this.tempList1.filter((ele, i) => {
          if (i > this.indexCurry.tempOne.length - 1) {
            return ele
          }
        })
      }
      // return
      if (this.indexCurry.tempTwe.length > 0) {
        this.upList[1] = this.tempList2.filter((ele, i) => {
          if (i > this.indexCurry.tempTwe.length - 1) {
            return ele
          }
        })
      }
      if (this.indexCurry.tempThr.length > 0) {
        this.upList[2] = this.tempList3.filter((ele, i) => {
          if (i > this.indexCurry.tempThr.length - 1) {
            return ele
          }
        })
      }
      this.upList.forEach((ele, i) => {

        if (ele.length <= this.len) {
          uni.showLoading({ title: '上传中...', mask: true })
          p[i] = upy(ele, this.imageUrL)
        }
      })
      Promise.all([p[0], p[1], p[2]]).then(res => {
        if (res[0]) this.showPice1 = [...this.showPice1, ...res[0]]
        if (res[1]) this.showPice2 = [...this.showPice2, ...res[1]]
        if (res[2]) this.showPice3 = [...this.showPice3, ...res[2]]
        uni.hideLoading()
        let len = Number(this.tempList1.length) + Number(this.tempList2.length) + Number(this.tempList3.length)
        this.previewList = [this.showPice1, this.showPice2, this.showPice3, [len]]
        if (this.numType == 4) {
          let temp = this.addHouse
          this.setImage({ show: this.tempList2, pice: this.showPice2, val: this.tempList2.length > 0 ? `共${this.tempList2.length}张` : '请上传' })
          temp[4] = this.showImage
          this.setHouseInfo(temp)
          uni.$emit('upPice', '房间照片')
        } else if (this.numType == 'agency' || this.numType == 'property' || this.numType == 'rent') {
          this.showPice1.forEach((ele, i) => {
            let flag = ele.indexOf(this.$baseURL)
            if (flag > -1) {
              let num = ele.indexOf('/landlord/contract')
              this.showPice1[i] = ele.slice(num)
            } else {
              this.showPice1[i] = ele
            }
          })
          let obj = { type: this.numType, agency: this.showPice1, property: this.showPice2 }
          uni.$emit('upPice', obj)
        } else {

          this.setshowImageList([this.tempList1, this.tempList2, this.tempList3, [len]])
          this.setupTempImageList(this.previewList)
          uni.$emit('upPice')
        }
        // if(this.numType == 4){
        // 	console.log(this.showPice2);
        // }

        uni.navigateBack({
          delta: -1
        })
      })

    },
    /**
     * 上传至oos
     */
    uploadPhoto (filePath, index, res) {
    },
    //封装上传方法
    uploadFiles (num) {
      return new Promise((reslove, reject) => {
        uni.chooseMedia({
          //ios兼容
          count: num > 9 ? 9 : num,
          success: function (res) {
            reslove(res)
          },
          fail: function (e) {
            reject(e)
          }
        })
      })
    }
  }
}
</script>

<style lang='scss' scoped>
.upload {
  background-color: #f7f7f7;
  .uploadTitle {
    width: 750rpx;
    height: 160rpx;
    background-color: white;
    text-align: center;
    padding-top: 30rpx;
    box-sizing: border-box;
    border-bottom: solid 4rpx #f1efef;
    .titleTop {
      font-size: 34rpx;
      font-weight: 600;
      text {
        font-size: 30rpx;
        font-weight: 500;
        padding-left: 10rpx;
      }
    }
    .titleBottom {
      font-size: 30rpx;
    }
  }
  .uploadItemBox {
    /*    margin-top: 60rpx; */
    background-color: white;
    box-sizing: border-box;
    padding: 20rpx 0rpx 20rpx 30rpx;
    .itemTitle {
      font-size: 30rpx;
      padding-bottom: 40rpx;
      padding-right: 30rpx;
      text {
        font-size: 26rpx;
        color: #979494;
        letter-spacing: 4rpx;
        padding-left: 14rpx;
      }
    }
    .itemBox {
      display: flex;
      flex-wrap: wrap;
      .itemImage {
        border-radius: 10rpx;
      }
      .imageBox {
        position: relative;
        margin-right: 20rpx;
        margin-bottom: 20rpx;
        .cross {
          position: absolute;
          right: -10rpx;
          top: -10rpx;
          // width: 30rpx;
          // height: 30rpx;
          // background-color: red;
          // border-radius: 15rpx;
          // text-align: center;
          // line-height: 30rpx;
          // color: white;
          // font-weight: 700;
          color: red;
        }
      }
      .addItem {
        width: 100rpx;
        height: 100rpx;
        background-color: #e2e1e3;
        /* 	border: dashed  4rpx  #dfdfdf; */
        /*     border: solid 4rpx #dfdfdf; */
        border-radius: 10rpx;
        display: flex;
        justify-content: center;
        align-items: center;
        .cuIcon-camera {
          font-size: 40rpx;
        }
      }
    }
  }
  .describe {
    margin-top: 30rpx;
    padding: 30rpx;
    background-color: white;
    box-sizing: border-box;
    .describeTitle {
      display: flex;
      justify-content: space-between;
      .titleLeft {
        font-size: 30rpx;
      }
      .titleRight {
        color: #cfcbcb;
      }
    }
    .textArea {
      padding-top: 20rpx;
      width: 100%;
      height: 150rpx;
    }
    &:active {
      background-color: #fafafa;
    }
  }
  .save {
    width: 690rpx;
    height: 100rpx;
    margin: 0 auto;
    background-color: #00a680;
    text-align: center;
    line-height: 100rpx;
    color: white;
    font-size: 34rpx;
    // font-weight: 600;
    margin-top: 40rpx;
    border-radius: 10rpx;
    &:active {
      background-color: #007e5e;
    }
  }
}
</style>
