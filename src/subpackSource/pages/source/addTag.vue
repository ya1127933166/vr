<template>
  <!-- 新建标签组 -->
  <view class='addTag'>
    <view class='addTitle'>标签组名称</view>
    <view class='addItem'>
      <input :disabled="isEdit==0"
             v-model="tagGroup"
             type="text"
             placeholder="标签组名称">
    </view>

    <view class='addTitle'>标签</view>
    <block v-for="(item,index) in tagList"
           :key="index">
      <view class='addItem'>
        <view @tap="removeTag(item)"
              :style="'background-color:'+(isEdit==0?'#ccc':(item.status?'#36ab60':'#dd4c28'))+';'"
              class="cut">
          <view :class="[item.status?'cuIcon-add':'cuIcon-move']"></view>
        </view>
        <input :disabled="!item.status"
               :hold-keyboard="true"
               @focus="item.foc=true"
               v-model="item.text"
               placeholder="请输入">
      </view>
      <view id="cell">
        <view class="line"></view>
      </view>
    </block>
    <view class='addItem'>
      <view @tap="removeTag(item)"
            :style="'background-color:'+(isEdit==0?'#ccc':(true?'#36ab60':'#dd4c28'))+';'"
            class="cut">
        <view :class="[true?'cuIcon-add':'cuIcon-move']"></view>
      </view>
      <input maxlength="10"
             @blur="bindBlur"
             @focus="bindFocus"
             :adjust-position="false"
             :hold-keyboard="true"
             :focus="isFocus1"
             cursor-spacing="40"
             v-model="inputText"
             placeholder="请输入">
      <view @tap="addTag"
            v-if="isShowTag2"
            class="confirm">完成</view>
    </view>

    <view :style="'background-color:'+(isEdit==0?'#ccc':'#00a680')+';'"
          @tap="saveBtn"
          class='saveBtn'>保存</view>
    <view v-if="currentType!='新建标签组'"
          @tap="removeBtn"
          class='removeBtn'
          :style="'background-color:'+(isEdit==0?'#ccc':'#ea6b66')+';'">删除标签组</view>
    <view v-if="isShowCell"
          class=""
          :style="'height:50vh;width:750rpx;'"></view>
  </view>
</template>

<script>
import { createNamespacedHelpers } from 'vuex';
const { mapState, mapMutations, mapActions } = createNamespacedHelpers('source');
export default {
  name: 'addTag',
  data () {
    return {
      tagGroup: '',
      tagName: '',
      tagList: [],
      isFocus1: false,
      currentType: '',
      isEdit: -1,
      tagName2: '',
      isShowTag2: false,
      curText: '',
      inp1: '',
      inp2: '',
      isFocus2: '',
      inputText: '',
      isShowCell: false,
      focusObj: {
        title: true,
        tag: true
      },
      sys: '',
      tagId: ''
    }
  },
  onLoad (options) {
    this.sys = this.$$globalData.systemInfo
    uni.setNavigationBarTitle({
      title: options.type
    })
    //判断并设置是否可删除，可编辑标签组
    if (options.edit) {
      this.isEdit = options.edit == '企业标签' ? 0 : 1
    }

    //如果选择的是删除标签，则渲染需要删除的数据
    this.currentType = options.type
    if (this.currentType != '新建标签组') {
      this.tagList = this.currentTags.list.map(ele => {
        return { text: ele.text, status: false, val: 2 }
      })
      this.tagGroup = this.currentTags.title
      this.tagId = this.currentTags.id
    }
  },
  onShow () {
  },
  watch: {
    inputText (newValue, oldValue) {
      if (newValue.trim()) {
        this.isShowTag2 = true
      } else {
        this.isShowTag2 = false
      }
    }
  },
  computed: {
    ...mapState({
      personalTag: state => state.personalTag,
      currentTags: state => state.currentTags
    })
  },
  methods: {
    ...mapMutations(['updateTagList', 'updatePersonalTag']),
    ...mapActions(['getTagList']),
    //删除标签
    removeTag (item) {
      //确认是否不可编辑
      if (this.isEdit == 0) {
        return
      }
      if (item.status == true) {
        return
      }
      let index = this.tagList.indexOf(item);
      if (index != -1) {
        this.tagList.splice(index, 1)
        // if(this.currentType!='新建标签组'){
        //     this.removeTags.list.splice(index,1)
        // }
      }
    },
    //添加标签
    addTag (e, item) {
      if (this.tagList.length > 19) {
        wx.showToast({
          title: '单个标签组最多20个标签',
          icon: 'none'
        })
        return
      }
      this.tagList.push({ text: this.inputText, status: false, foc: false })
      this.inputText = '';
      this.isFocus1 = true;
      uni.pageScrollTo({
        scrollTop: 100000,
        duration: 300
      });
    },
    //获取焦点
    bindFocus () {
      setTimeout(() => {
        uni.pageScrollTo({
          scrollTop: 100000,
          duration: 300
        });
      }, 300)
      this.isShowCell = true
    },
    //失去焦点
    bindBlur () {
      this.isShowCell = false
    },
    //保存按钮
    saveBtn () {
      if (this.isEdit == 0) {
        return
      }

      if (!this.tagGroup.trim()) {
        wx.showToast({
          title: '请输入标签组名称',
          icon: 'none'
        })
        return
      }
      let temp = this.tagList.filter(ele => ele.text != '')
      this.personalTag.push({
        title: this.tagGroup,
        list: temp.map(ele => {
          return { text: ele.text, status: false }
        })
      })
      this.saveTag(temp)
      this.updateTagList({ personalTag: this.personalTag })
    },
    //删除标签组按钮
    removeBtn () {
      const that = this;
      //确认是否不可编辑
      if (this.isEdit == 0) {
        return
      }
      wx.showModal({
        title: '提示',
        content: '确定删除该标签组？',
        success: function (res) {
          if (res.confirm) {
            that.removeTags();
          }
        }
      })
    },
    //将标签存入
    async saveTag (temp) {
      const that = this;
      let tag = temp.map(ele => {
        return ele.text
      }).join(',');
      try {
        let res = await this.request({
          url: 'customer/tag/update',
          type: 'post',
          param: {
            id: this.tagId,
            group_name: this.tagGroup,
            label: tag
          }
        })

        if (res[1].data.state == 200) {
          uni.showToast({
            title: '添加成功'
          })
          setTimeout(() => {
            //刷新标签组
            that.getTagList();
            uni.navigateBack({
              delta: -1
            })
          }, 1000)

        } else {
          uni.showToast({
            title: this.$throwStatusCode(res[1].data.state, '新增标签'),
            icon: 'none'
          })
        }
      } catch (error) {
        console.log(erroe);
      }
    },
    //删除标签组
    async removeTags () {
      try {
        let res = await this.request({
          url: 'customer/tag/delete',
          type: 'get',
          param: {
            id: this.currentTags.id
          }
        })
        if (res[1].data.state == 200) {
          //刷新标签组
          this.getTagList();
          uni.showToast({
            title: '删除成功'
          })
          setTimeout(() => {
            uni.navigateBack({
              delta: -1
            })
          }, 1000)
        } else {
          uni.showToast({
            title: this.$throwStatusCode(res[1].data.state, '删除标签组'),
            icon: 'none'
          })
        }
      } catch (error) {
        console.log(error);
      }
    }
    // keyboardheightchange(e){
    //     this.keyboardHeight = e.detail.height;
    //     // wx.showToast({
    //     //     title: `${e.detail.height}`,
    //     // })

    // }
  },
  onUnload () {
    // if(this.currentType!='新建标签组'){
    //     //更新标签数据
    //     if(this.tagGroup.trim()){
    //         this.currentTags.title = this.tagGroup
    //         let temp = this.tagList.filter(ele=>ele.text!='').map(ele=>{
    //             return {text:ele.text,status:false}
    //         })
    //         this.currentTags.list = temp;
    //     }
    //     this.updatePersonalTag(this.currentTags);
    // }
  }
}
</script>

<style lang='scss' scoped>
$pageBgColor: #f7f7f7;
$borderColor: #e9e9e9;
$placerColor: #cccccc;
$titleColor: #888888;
$greenColor: #00a680;
.addTag {
  min-height: 100vh;
  .addTitle {
    padding: 40rpx 30rpx 20rpx 40rpx;
    color: $titleColor;
    font-size: 26rpx;
    height: 100rpx;
    box-sizing: border-box;
  }
  .addItem {
    background-color: white;
    height: 100rpx;
    display: flex;
    align-items: center;
    padding: 0rpx 40rpx 0rpx 40rpx;
    box-sizing: border-box;
    font-size: 30rpx;
    // border-bottom: solid 2rpx $pageBgColor;
    input {
      flex-grow: 1;
      height: 100rpx;
    }
    .cut {
      background-color: #dd4c28;
      width: 36rpx;
      height: 36rpx;
      border-radius: 18rpx;
      color: white;
      font-size: 20rpx;
      // display: flex;
      // justify-content: center;
      // align-items: center;
      text-align: center;
      line-height: 36rpx;
      margin-right: 20rpx;
      font-weight: 700;
      text {
        transform: scale(1.38);
      }
    }
    .add {
      background-color: #36ab60;
      width: 36rpx;
      height: 36rpx;
      border-radius: 18rpx;
      color: white;
      font-size: 34rpx;
      display: flex;
      justify-content: center;
      // align-items: center;
      line-height: 38rpx;
      margin-right: 20rpx;
      font-weight: 500;
    }
    .confirm {
      width: 100rpx;
      height: 50rpx;
      background-color: $greenColor;
      text-align: center;
      line-height: 50rpx;
      color: white;
      border-radius: 10rpx;
    }
    &:active {
      background-color: #fafafa;
    }
  }

  .saveBtn,
  .removeBtn {
    width: 690rpx;
    height: 100rpx;
    text-align: center;
    line-height: 100rpx;
    font-size: 34rpx;
    color: white;
    border-radius: 10rpx;
    margin: 30rpx auto;
  }
  .saveBtn {
    background-color: $greenColor;
    &:active {
      background-color: #007e5e;
    }
  }
  .removeBtn {
    background-color: #ea6b66;
    &:active {
      background-color: #fafafa;
    }
  }
}
</style>