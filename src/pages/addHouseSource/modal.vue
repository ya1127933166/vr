<template>
  <view v-if="isShow"
        catchtouchmove='true'
        class='modal1'>
    <view class='modal_box'
          style='width: 750rpx; background-color:#FFFFFF ;'>
      <view class='modal_top'>
        <view class='top_left'
              @tap="clickMaskHandel">取消</view>
        <view class='top_center'>更多设置</view>
        <view class='top_right'
              @tap='clickOk'>确定</view>
      </view>
      <cover-view class="content_module"
                  v-if='type'>
        <cover-view class='house_tpye'>
          <cover-view class="title">房屋类型</cover-view>
          <cover-view class="house_list">
            <block v-for="(item,index) in totalList[0]"
                   :key='index'>
              <cover-view class='house_item'
                          @tap.stop='cilckItemHandel(item,index,0)'
                          @touchmove='getDate'
                          :style="{backgroundColor:(item.status==true?'#00A680':''),color:(item.status==true?'#fff':'')}">{{item.type}}</cover-view>
            </block>
          </cover-view>
        </cover-view>
        <cover-view class='house_tpye'>
          <cover-view class="title">电梯情况</cover-view>
          <cover-view class="house_list">
            <block v-for="(item,index) in totalList[1]"
                   :key='index'>
              <cover-view class='house_item'
                          @tap.stop='cilckItemHandel(item,index,1)'
                          :style="{backgroundColor:(item.status==true?'#00A680':''),color:(item.status==true?'#fff':'')}">{{item.type}}</cover-view>
            </block>
          </cover-view>
        </cover-view>
        <cover-view class='house_tpye'>
          <cover-view class="title">产证年限</cover-view>
          <cover-view class="house_list">
            <block v-for="(item,index) in totalList[2]"
                   :key='index'>
              <cover-view class='house_item'
                          @tap.stop='cilckItemHandel(item,index,2)'
                          :style="{backgroundColor:(item.status==true?'#00A680':''),color:(item.status==true?'#fff':'')}">{{item.type}}</cover-view>
            </block>
          </cover-view>
        </cover-view>
        <cover-view class='house_tpye'>
          <cover-view class="title">产权年限</cover-view>
          <cover-view class="house_list">
            <block v-for="(item,index) in totalList[3]"
                   :key='index'>
              <cover-view class='house_item'
                          @tap.stop='cilckItemHandel(item,index,3)'
                          :style="{backgroundColor:(item.status==true?'#00A680':''),color:(item.status==true?'#fff':'')}">{{item.type}}</cover-view>
            </block>
          </cover-view>
        </cover-view>
        <cover-view class='house_tpye'>
          <cover-view class="title">唯一住房</cover-view>
          <cover-view class="house_list">
            <block v-for="(item,index) in totalList[4]"
                   :key='index'>
              <cover-view class='house_item'
                          @tap.stop='cilckItemHandel(item,index,4)'
                          :style="{backgroundColor:(item.status==true?'#00A680':''),color:(item.status==true?'#fff':'')}">{{item.type}}</cover-view>
            </block>
          </cover-view>
        </cover-view>
        <cover-view class='house_tpye'>
          <cover-view class="title">业主心态</cover-view>
          <cover-view class="house_list">
            <block v-for="(item,index) in totalList[5]"
                   :key='index'>
              <cover-view class='house_item'
                          @tap.stop='cilckItemHandel(item,index,5)'
                          :style="{backgroundColor:(item.status==true?'#00A680':''),color:(item.status==true?'#fff':'')}">{{item.type}}</cover-view>
            </block>
          </cover-view>
        </cover-view>
      </cover-view>
      <cover-view class="content_module"
                  v-else>
        <cover-view class='house_tpye'>
          <cover-view class="title">房屋亮点</cover-view>
          <cover-view class="house_list">
            <block v-for="(item,index) in totalList1[0]"
                   :key='index'>
              <cover-view class='house_item'
                          @tap.stop=' cilckItemHandel(item,index,6)'
                          :style="{backgroundColor:(item.status==true?'#00A680':''),color:(item.status==true?'#fff':'')}">{{item.type}}</cover-view>
            </block>
          </cover-view>
        </cover-view>
        <cover-view class='house_tpye'>
          <cover-view class="title">签约时长</cover-view>
          <cover-view class="house_list">
            <block v-for="(item,index) in totalList1[1]"
                   :key='index'>
              <cover-view class='house_item'
                          @tap.stop='cilckItemHandel(item,index,7)'
                          :style="{backgroundColor:(item.status==true?'#00A680':''),color:(item.status==true?'#fff':'')}">{{item.type}}</cover-view>
            </block>
          </cover-view>
        </cover-view>
        <cover-view class='house_tpye'>
          <cover-view class="title">出租要求</cover-view>
          <cover-view class="house_list">
            <block v-for="(item,index) in totalList1[2]"
                   :key='index'>
              <cover-view class='house_item'
                          @tap.stop=' cilckItemHandel(item,index,8)'
                          :style="{backgroundColor:(item.status==true?'#00A680':''),color:(item.status==true?'#fff':'')}">{{item.type}}</cover-view>
            </block>
          </cover-view>
        </cover-view>
        <cover-view class='house_tpye'>
          <cover-view class="title">房屋看房时间</cover-view>
          <cover-view class="house_list">
            <block v-for="(item,index) in totalList1[3]"
                   :key='index'>
              <cover-view class='house_item'
                          @tap.stop='cilckItemHandel(item,index,9)'
                          :style="{backgroundColor:(item.status==true?'#00A680':''),color:(item.status==true?'#fff':'')}">{{item.type}}</cover-view>
            </block>
          </cover-view>
        </cover-view>

      </cover-view>
    </view>
  </view>
</template>

<script>

export default {
  props: {
    type: {
      type: Boolean,
      default: true
    },
    normal: {
      type: Array,
      default: () => ([])
    },
    isShow: {
      type: Boolean,
      default: false
    },
    clickCallBack: {
      type: Function,
      default: () => () => { }
    },
    clickMaskCallBack: {
      type: Function,
      default: () => () => { }
    },
    propertyArr: {
      type: Array,
      default: ''
    }
  },
  data () {
    return {
      selectorIndex: '',
      totalList: [
        [{ type: "住宅", status: false }, { type: "公寓", status: false }, { type: "别墅", status: false }, { type: "商住", status: false }, { type: "写字楼", status: false }, { type: "车位", status: false }],
        [{ type: "有电梯", status: false }, { type: "无电梯", status: false }],
        [{ type: "不满2年", status: false }, { type: "满2年", status: false }, { type: "满5年", status: false },],
        [{ type: "70年", status: false }, { type: "50年", status: false }, { type: "40年", status: false },],
        [{ type: "不唯一", status: false }, { type: "唯一", status: false }],
        [{ type: "急售", status: false }, { type: "稳定", status: false }, { type: "观望", status: false }, { type: "不急售", status: false }],
      ],
      totalList1: [
        [{ type: "南北通透", status: false }, { type: "首次出租", status: false }, { type: "有阳台", status: false }, { type: "民水明电", status: false }],
        [{ type: "1月起签", status: false }, { type: "3月起签", status: false }, { type: "半年起签", status: false }, { type: "1年起签", status: false }],
        [{ type: "只限女生", status: false }, { type: "禁养宠物", status: false }, { type: "禁烟", status: false }, { type: "作息稳定", status: false }],
        [{ type: "随时看房", status: false }, { type: "仅限工作日", status: false }, { type: "仅周末", status: false }, { type: "工作日晚上和周末", status: false }]],
      okList: [],
    }
  },
  created () {
    if (!this.type && this.propertyArr.length) {
      this.totalList1.forEach((ele, i) => {
        ele.forEach(v => {
          this.propertyArr[i].forEach(element => {
            if (element === v.type) {
              v.status = true
            }
          })
        })
      })
    } else if (this.type && this.propertyArr.length) {
      this.totalList.forEach((ele, i) => {
        ele.forEach(v => {
          if (this.propertyArr[this.propertyArr.length - 1 - i] === v.type) {
            v.status = true
          }
        })
      })

    }
  },
  mounted () {

  },
  components: {

  },
  methods: {
    //选项点击事件

    cilckItemHandel (item, index, num) {
      this.$utils.debounce(() => {
        switch (num) {
          case 0:
            this.totalList[0].forEach((ele, i) => {
              if (ele.status == true) {
                ele.status = false
              }
            })
            item.status = !item.status
            break;
          case 1:
            this.totalList[1].forEach(ele => {
              ele.status = false
            })
            item.status = !item.status
            break;
          case 2:
            this.totalList[2].forEach(ele => {
              ele.status = false
            })
            item.status = !item.status
            break;
          case 3:
            this.totalList[3].forEach(ele => {
              ele.status = false
            })
            item.status = !item.status
            break;
          case 4:
            this.totalList[4].forEach(ele => {
              ele.status = false
            })
            item.status = !item.status
            break;
          case 5:
            this.totalList[5].forEach(ele => {
              ele.status = false
            })
            item.status = !item.status
            break;
          case 6:
            item.status = !item.status
            break;
          case 7:
            this.totalList1[1].forEach(ele => {
              ele.status = false
            })
            item.status = !item.status
            break;
          case 8:
            this.totalList1[2].forEach(ele => {
              if (ele.type === item.type) {
                ele.status = !ele.status
              }
            })
            break;
          case 9:
            this.totalList1[3].forEach(ele => {
              ele.status = false
            })
            item.status = !item.status
            break;
          default:
            break;

        }
      }, 100)()


    },

    clickOk () {
      if (this.type) {
        this.totalList.forEach((ele, i) => {
          this.okList[i] = ele.filter(v => {
            return v.status == true
          })
        })
      } else {
        this.totalList1.forEach((ele, i) => {
          this.okList[i] = ele.filter(v => {
            return v.status == true
          })
        })
      }
      let a = []
      this.okList.forEach(v => {
        let b = v.every(ele => {
          ele.status != true
        })
        a.push(b)
      })
      let flag = a.every(v => {
        return v == false
      })
      if (flag) {
        // this.okList.reverse()

        this.$emit('clickCallBack', this.okList)

      } else {
        uni.showToast({
          title: '请填写完整',
          icon: 'none',
          duration: 400
        })
      }

    },
    //遮罩点击事件
    clickMaskHandel () {
      this.$emit('clickMaskCallBack', '')
    }
  }
}
</script>

<style lang='scss' scoped>
.modal1 {
  height: 100vh;
  width: 750rpx;
  position: fixed;
  left: 0;
  top: 0;
  background-color: rgba(0, 0, 0, 0.4);
  z-index: 99;
  animation: mask 0.1s ease-in-out;
  .modal_box {
    width: 750rpx;
    // padding: 50rpx 0;
    // height: 50vh;
    // height: 100%;
    // height: 50vh;

    border-radius: 20rpx 20rpx 0rpx 0rpx;
    background-color: white;
    position: fixed;
    margin: auto;
    left: 0;
    bottom: -12rpx;
    animation: modal 0.1s ease-in-out;
    // overflow: auto;
    // overflow-y: scroll;
    font-size: 32rpx;

    .modal_top {
      display: flex;
      .top_left {
        width: 20%;
        height: 50rpx;
        margin-top: 20rpx;
        color: #000;
        text-align: center;
      }
      .top_center {
        width: 60%;
        height: 50rpx;
        margin-top: 20rpx;
        color: #000;
        text-align: center;
      }
      .top_right {
        width: 20%;
        height: 50rpx;
        margin-top: 20rpx;
        color: #00a680;
        text-align: center;
      }
    }
    .content_module {
      min-height: 45vh;
      max-height: 70vh;
      // padding: 0 0 80rpx 0;
      overflow-y: scroll;
    }
    .house_tpye {
      margin-top: 15rpx;
      margin-left: 40rpx;
      width: 750rpx;
      &:last-child {
        margin-bottom: 80rpx;
      }
      .house_list {
        margin-top: 10rpx;
        margin-bottom: 10rpx;
        display: flex;
        width: 90%;
        flex-wrap: wrap;
        .house_item {
          min-width: 120rpx;
          height: 60rpx;
          font-size: 24rpx;
          line-height: 60rpx;
          text-align: center;
          margin: 10rpx 20rpx 15rpx 0;
          padding: 0 6rpx;
          background-color: #eee;
        }
      }
    }
  }
}
.title {
  font-weight: 800;
  margin: 20rpx 0 10rpx 0;
  font-size: 24rpx;
}
@keyframes mask {
  0% {
    opacity: 0;
  }
  100% {
    opacity: 1;
  }
}
@keyframes modal {
  0% {
    transform: translateY(100%);
  }
  100% {
    transform: translateY(0%);
  }
}

@keyframes downs {
  0% {
    transform: translateY(0%);
  }
  100% {
    transform: translateY(100%);
  }
}
</style>