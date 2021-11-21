<template>
    <view :class="['custom-form-row', borderBottom ? 'border-bottom' : '']" hover-class="custom-form-row-hover"
          :style="'padding: 0'+_styleParse(padding || 35)" @tap="_displayBoxClick"
    >
        <view class="label" :style="'width:'+(rowWidth || '50rpx')">
            {{ label || '' }}
        </view>
        <view :class="['custom-form-input',
        inputType==='picker' || inputType==='multiSelector' ? 'absolute-box': '',
        inputType==='displayBox' ? 'custom-form-display-box' : '',
        ]">
            <block v-if="inputType==='picker'">
                <picker class="picker-absolute" :range="element.range" :range-key="`${element.rangeKey}`"
                        ref="picker"
                        @change="inputChange">
                    <view class="picker-value">
                        {{ element.range.find((item)=>item.id == value).val || element.placeholder || '' }}
                    </view>
                    <view class="cuIcon-right"></view>
                </picker>
            </block>
            <block v-else-if="inputType==='datePicker'">
                <view class='start'>
                    <picker mode="date" :fields="element.fields" :value="element.start"
                            @change="(e) =>inputChange(e, 'start')">
                        <view class="picker" v-if="rowStart">{{ rowStart }}</view>
                        <view class="picker" v-else> 起始时间 </view>
                    </picker>
                </view>
                <view class='center'>至</view>
                <view class='end'>
                    <picker mode="date" :fields="element.fields" :value="element.end"
                            @change="(e) =>inputChange(e, 'end')">
                        <view class="picker" v-if="rowEnd">{{ rowEnd  }}</view>
                        <view class="picker" v-else> 截至时间 </view>
                    </picker>
                </view>
                <view class='hack'></view>
            </block>
            <block v-else-if="inputType==='multiSelector'">
                <picker class="picker-absolute" :range="element.range" :range-key="`${element.rangeKey}`"
                        @change="inputChange" mode="multiSelector">
                    <view class="picker-value">
                        <block v-for="(rangeItem, idx) in element.range" :key="idx">
                            {{ rangeItem.find((item)=>+item.id === (+value[idx])).val || (idx === 0 ? element.placeholder : '') }}
                        </block>
                    </view>
                    <view class="cuIcon-right"></view>
                </picker>
            </block>
            <block v-else>
                <view v-if="inputType==='displayBox'" :class="['row-input', 'display-box', value?'':'null-box']">
                    {{value || element.placeholder || ''}}
                </view>
                <input v-else :type="typeofInput" :value="value" @input="inputChange" :placeholder="element.placeholder || ''"
                       :disabled="element.disable" :maxlength="element.maxLength || 25"
                       :class="['row-input',icon ?'width-input': '']" placeholder-style="color:#cccccc"
                />
                <span class="unix-box" v-if="element.textUnix" :style="element.textUnixWidth ? 'width:'+ element.textUnixWidth: null">
                    {{ element.textUnix }}
                </span>
            </block>
        </view>
        <view class="custom-form-btn">
            <image v-if="icon && icon.url"
                   :src="icon.url"
                   @click="_iconClick"
                   class="btn-img"
            ></image>
            <view v-if="(icon && icon.arrow) && (inputType!=='picker' && inputType!=='multiSelector')"
                  @click="_iconClick"
                  class="cuIcon-right">
            </view>
        </view>
    </view>
</template>

<script>
export default {
    name: "formRow",
    props: {
        label: {
            type: String,
            request: true,
            default: 'label'
        },
        value: {
            default: 'test'
        },
        inputType: {
            default: 'text'
        },
        rowType: {
            type: String,
            default: 'input'
        },
        selectList: {
            type: Array
        },
        change: {
            type: Function,
            request: true,
            default: () => () => console.warn('change function is null!')
        },
        aim: {
            type: String,
            request: true,
            default: '1'
        },
        width: {
            default: '30%'
        },
        padding: {
            default: '30rpx'
        },
        borderBottom: {
            type: Boolean,
            default: true
        },
        icon: {
            type: Object,
            default: () => {
                return {
                    url: '',
                    clickFunc: () => console.log('icon call back')
                }
            }
        },
        formKey: {
            type: String,
            default: ''
        }, // 表格key 用于回调中获得当前表格
        element: {
            default: {
                borderBottom: false, // row 底部横线
                inputType: 'text', // input类别
                rowWidth: '80rpx', // label宽度
                label: '', // row 标题
                placeholder: '请输入', // 空值时的展示内容
                textUnix: '', // 单位
                textUnixWidth: '', // 单位框宽度
                icon: { // 图标
                    url: '', // 图标路径
                    arrow: false // 是否使用箭头图标
                },

                // text
                maxLength: 25, // 输入字符个数上限
                disable: false, // 是否可用

                // picker
                rangeKey: 'id', // pick 以range的哪一项作为key标识
                range: [{ // pick列表
                    id: 1, // 可选项的id 一般从1开始，0为未填
                    val: '11' // 可选择的label
                }],

                // date picker 时间选择器
                fields: '',// 时间精度 day month year
                start: '', // 开始时间
                end: '', // 结束时间
                date0: { // 开始时间配置项
                    start: '2021-10-18', // 时间上限
                    end: '2021-10-19', // 时间下限
                },
                date1: {} // 截至时间配置项

            }
        },
        start: {
            type: String
        },
        end: {
            type: String
        }
    },
    watch: {
        value: {
            handler(newVal, oldVal) {
                // console.log('value watch', newVal, oldVal)
                if (newVal !== oldVal) {
                    this.rowValue = newVal
                }
            }
        },
        'element.start': {
            handler(newVal, oldVal) {
                // uni.showToast({
                //     title: 'start change' +newVal,
                //     icon: 'none',
                //     duration: 3500
                // })
                this.changePackerValue({val:newVal, key: 'rowStart'})
            },
            immediate:true
        },
        'element.end': {
            handler(newVal, oldVal) {
                this.changePackerValue({val:newVal, key: 'rowEnd'})
            },
            immediate:true
        },
    },
    data() {
        return {
            rowValue: '',
            rowWidth: '',
            rowStart: '',
            rowEnd: '',
        }
    },
    mounted() {
        // console.log('receive data', this.element, this.formKey)
        if (this.value !== this.rowValue) {
            this.rowValue = this.value
        }
        this.rowWidth = this._styleParse(this.width);
    },
    computed: {
        typeofInput() {
            const typeMap = {phone: 'number', idNumber: 'number', decimal: 'digit'}
            return typeMap[this.inputType] || this.inputType
        }
    },
    methods: {
        changePackerValue({val, key}) {
            const that = this;
            that[key] = ''
            that.$nextTick(()=> {
                that[key] = val
            })
        },
        _styleParse(str = '') {
            switch (typeof str) {
                case "string":
                    return str;
                case "number":
                    return str +'rpx'
                default:
                    console.warn('illegal style value', str)
            }
        },
        dateStartChange(e) {
            this.inputChange(e, 'start')
        },
        dateEndChange(e) {
            this.inputChange(e, 'end')
        },
        inputChange(e, type = '') {
            const {value} = e.detail
            // if (this.inputType === 'picker') {
            //     const isTimeInRange = (start, current ,end) => {
            //         const currentTime = new Date(current)
            //         return (new Date(start) < currentTime) && (currentTime < new Date(end))
            //     }
            //     const {date0, date1} = this.element;
            //     const valid = type === 'start' ? isTimeInRange(date0.start, value , date0.end)
            //         : isTimeInRange(date1.start, value , date1.end)
            //     if (!valid) {
            //         uni.showToast({
            //             title: type === 'start' ? `该日期需要处于${date0.start}-${date0.end}之间`
            //                 : `该日期需要处于${date1.start}-${date1.end}之间`,
            //             icon:'none'
            //         })
            //         return;
            //     }
            // }

            // picker项的 id 为 picker 项的index+1
            const val = this.inputType === 'picker' ? (+value + 1).toFixed() : value
            if (this.inputType === 'multiSelector') {
                for (let i = 0; i < val.length; i++) {
                    val[i] = (+val[i]) + 1
                }
            }
            // console.log('change', {value, val}, this.aim, this.element)
            this.$emit('change', {value: val, aim: this.aim, type})
            // this.$emit('change', {value, aim: this.aim})
        },
        _displayBoxClick(e) {
            // console.log('_displayBoxClick', e, this.element)
            const {boxClickFuncKey} = this.element;
            if (boxClickFuncKey) {
                const callback = this.$store.state[boxClickFuncKey];
                if (typeof callback === "function") {
                    callback(e, this.formKey);
                } else {
                    console.warn('boxClickFunc of form row has a illegal function boxClickFuncKey=', boxClickFuncKey)
                }
            }
        },
        _iconClick(e) {
            const {clickFuncKey} = this.icon
            // console.log('icon', this.icon, clickFuncKey)
            // return;
            if (clickFuncKey) {
                const callback = this.$store.state[clickFuncKey];
                if (typeof callback === "function") {
                    callback(e, this.formKey);
                } else {
                    console.warn('icon of form row has a illegal function', clickFuncKey)
                }
            }
        }
    }
}
</script>

<style lang="scss" scoped>
$iconSize: 50rpx;
$padding: 20rpx 0rpx;
.custom-form-row {
    display: flex;
    justify-content: space-between;
    align-items: center;
    background-color: #ffffff;
    transition: background-color 0.25s;
    height: 100rpx;
    font-size: 30rpx;
    line-height: 0;
    width: 100%;
    padding: $padding;
    //box-sizing: content-box;
    &.border-bottom {
        border-bottom: #e9e9e9 1rpx solid;
    }

    .label {
        margin-right: 15rpx;
        box-sizing: border-box;
        line-height: 0;
    }

    .custom-form-input {
        width: 100%;
        display: flex;
        justify-content: space-between;
        line-height: 0;
        $rowHeight: 40rpx;
        &.absolute-box {
            position: relative;
            height: 100%;
            align-items: center;
        }
        &.custom-form-display-box {
            height: 100%;
            padding-left: 10rpx;
        }

        .row-input {
            width: 100%;
            &.width-input {
                padding-left: 12rpx;
            }
            &.display-box {
                display: flex;
                justify-content: space-between;
                align-items: center;
                min-height: $rowHeight;
            }
            &.null-box {
                color: #cccccc;
            }
        }

        .picker-absolute {
            width: 100%;
            position: relative;
            //display: flex;
            z-index: 2;
            height: 100%;
            align-items: center;
            .picker-value {
                height: $rowHeight;
                line-height: $rowHeight;
                //background-color: #33333344;
                width: 100%;
            }
        }

        .cuIcon-right {
            position: absolute;
            right: 0;
            z-index: 0;
            top: 50%;
            //width: $iconSize;
            //height: $iconSize;
        }
        .unix-box {
            display: flex;
            justify-content: center;
            align-items: center;
        }
        .start, .center, .end {
            height: $rowHeight;
            line-height: $rowHeight;
        }
        .start, .end {
            min-width: 150rpx;
            //background-color: #b85450;
            text-align: center;
            white-space: nowrap;
            text-overflow: ellipsis;
            overflow: hidden;
        }
    }

    .custom-form-btn {
        display: flex;
        justify-content: space-between;
        align-items: center;

        .btn-img {
            width: $iconSize;
            height: $iconSize;
        }
    }
}

.custom-form-row-hover {
    background-color: #fafafa;
}
</style>
