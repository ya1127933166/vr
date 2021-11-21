<template>
  <view :style="'margin:'+formMargin || ''">
    <view v-if="formTitle"
          class="form-title"
          :style="'padding: 0 '+_styleParse(padding || 0)">
      {{formTitle || ''}}
      <view v-if="titleFuncText"
            @tap="_tapTitleFunc"
            class="form-title-func-box"
            :style="titleFuncStyle || ''">
        {{titleFuncText}}
      </view>
    </view>
    <view class="form-list"
          v-if="formData && formData.length">
      <FormRow v-for="(element, index) in formData"
               :label="element.label"
               :value.sync="element.val"
               :form-key="formKey || index"
               :aim="element.aim"
               :key="index"
               :icon="element.icon || null"
               :element="element"
               :padding="padding"
               :input-type="element.inputType"
               :style="'margin: 0 '+_styleParse(padding || 0)"
               :border-bottom="(index + 1) !== formData.length"
               :width="labelWidth"
               @change="changeFunc"></FormRow>
    </view>
  </view>
</template>

<script>
import formRow from "@/components/comm/formInput/formRow";
export default {
  name: "customForm",
  components: {
    formRow
  },
  props: {
    formTitle: {
      type: String,
      default: ''
    },
    titleFuncText: {
      type: String,
      default: ''
    },
    submitFunc: {
      type: Function,
      default: () => (value) => {

      }
    },
    formData: {
      type: Array,
      request: true,
      default: () => [
        {
          label: '业主姓名',
          aim: 'name',
          val: '',
          icon: {
            url: '',
            clickFuncKey: ''
          },
          placeholder: '请选择或输入'
        },
        {
          label: '月租金',
          aim: 'rentPrice',
          val: 0,
          textUnix: '元/月'
        },
        {
          label: 'age',
          aim: '2',
          val: 20
        },
        {
          label: '岁',
          aim: '3',
          inputType: 'picker',
          rangeKey: 'id',
          range: [
            {
              id: 1,
              val: 1,
            },
            {
              id: 2,
              val: 2,
            }
          ],
          val: 20
        },
        {
          label: '合同时间',
          aim: 'date',
          inputType: 'datePicker',
          fields: 'day',
          date0: {
            start: '2015-09-01',
            end: '2017-09-01'
          },
          date1: {
            start: '2015-09-01',
            end: '2017-09-01'
          },
          start: '2016-09-01',
          end: '2016-09-02'
        },

      ]
    },
    padding: {
      default: 30
    },
    formMargin: {
      default: 0
    },
    labelWidth: {
      default: '240rpx'
    },
    titleFunc: {
      type: Function,
      default: () => () => { }
    },
    titleFuncStyle: {
      type: String,
      default: ''
    },
    formKey: {
      type: String,
      default: ''
    }
  },
  mounted () {
    this._checkFormData()
    // console.log('formKey', this.formKey)
  },
  methods: {
    _checkFormData () {
      let map = new Map();
      if (!this.formData || !this.formData.length) {
        console.warn('formData is null, please check!!', this.formData)
        return;
      }
      this.formData.forEach((item, idx) => {
        const { aim } = item
        if (map.has(aim)) {
          console.warn('same aim in formData, please check!!', this.formData)
          return;
        } else {
          map.set(aim, true)
        }
      })
    },
    changeFunc ({ aim, value, type }) {
      // console.log('changeFunc',{aim, value, type})
      if (aim) {
        if (!type) {
          this.formData.find((item) => item.aim === aim).val = value
        } else {
          (this.formData.find((item) => item.aim === aim))[type] = value
        }
        // const matchItem =
        // console.log(this.formData)
        this.$emit('update:formData', this.formData)
        // matchItem.value = value
      }
    },
    _styleParse (str = '') {
      switch (typeof str) {
        case "string":
          return str;
        case "number":
          return str + 'rpx'
        default:
          console.warn('illegal style value', str)
      }
    },
    _tapTitleFunc (e) {
      this.$emit('titleFunc', e, this.formKey)
    }
  }
}
</script>

<style lang="scss" scoped>
.form-title {
  color: #939394;
  margin-bottom: 10rpx;
  font-size: 24rpx;
  text-align: left;
  display: flex;
  justify-content: space-between;
  .form-title-func-box {
    color: #004c99;
  }
}
.form-list {
  background-color: #ffffff;
  font-size: 26rpx;
  line-height: 0;
}
</style>
