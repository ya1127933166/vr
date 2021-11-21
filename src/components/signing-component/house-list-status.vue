<template>
<view class="house-list-status-group">
    <view class="house-list-status" :class="'type-'+type">
        <view class="status-item" @tap="activeFilterSelected('houseViewType')">
            <view class="status-item-name">
                <text v-if="houseViewTypeItem.label">{{houseViewTypeItem.label}}</text>
                <text v-else class="active-color">{{houseViewTypeItem.name}}</text>
            </view>
            <view class="status-icon cuIcon-unfold" :class="{rotate: filterVisible === 'houseViewType'}"></view>
            <block v-if="filterVisible === 'houseViewType'">
                <view class="filter-mode-arrow-up"></view>
                <view class="filter-mode-arrow-down"></view>
            </block>
        </view>
        <view class="status-item" @tap="activeFilterSelected('region')">
            <view class="status-item-name">
                <text v-if="regionList.length == 0">位置</text>
                <text v-else-if="regionItem.label">{{regionItem.label}}</text>
                <text v-else class="active-color">{{regionItem.name}}</text>
            </view>
            <view class="status-icon cuIcon-unfold" :class="{rotate: filterVisible === 'region'}"></view>
            <block v-if="filterVisible === 'region'">
                <view class="filter-mode-arrow-up"></view>
                <view class="filter-mode-arrow-down"></view>
            </block>
        </view>
        <view class="status-item" @tap="activeFilterSelected('price')">
            <view class="status-item-name">
                <text v-if="selected.priceIndex == -1" class="active-color">
                    租金
                </text>
                <text v-else-if="priceItem.label">
                    {{priceItem.label}}
                </text>
                <text v-else class="active-color">
                    {{priceItem.name}}
                </text>
            </view>
            <view class="status-icon cuIcon-unfold" :class="{rotate: filterVisible === 'price'}"></view>
            <block v-if="filterVisible === 'price'">
                <view class="filter-mode-arrow-up"></view>
                <view class="filter-mode-arrow-down"></view>
            </block>
        </view>
        <view class="status-item"
            v-if="selected.houseViewTypeIndex === 0"
            @tap="activeFilterSelected('processStatus')">
            <view class="status-item-name">
                <text v-if="processStatusItem.label">{{processStatusItem.label}}</text>
                <text v-else class="active-color">{{processStatusItem.name}}</text>
            </view>
            <view class="status-icon cuIcon-unfold" :class="{rotate: filterVisible === 'processStatus'}"></view>
            <block v-if="filterVisible === 'processStatus'">
                <view class="filter-mode-arrow-up"></view>
                <view class="filter-mode-arrow-down"></view>
            </block>
        </view>
        <view class="status-item"
            v-else-if="selected.houseViewTypeIndex === 1"
            @tap="activeFilterSelected('contractStatus')">
            <view class="status-item-name">
                <text v-if="contractStatusItem.label">{{contractStatusItem.label}}</text>
                <text v-else class="active-color">{{contractStatusItem.name}}</text>
            </view>
            <view class="status-icon cuIcon-unfold" :class="{rotate: filterVisible === 'contractStatus'}"></view>
            <block v-if="filterVisible === 'contractStatus'">
                <view class="filter-mode-arrow-up"></view>
                <view class="filter-mode-arrow-down"></view>
            </block>
        </view>
    </view>
    <view v-if="filterVisible"
        :style="'top:' + filterModeTop + 'px;'"
        class="filter-mode-group-bg"
        @tap="closeFilterVisible"
        @touchmove.stop=""></view>
    <view class="filter-mode-group"
        v-if="filterVisible">
        <view class="mode-list-container"
            v-if="filterVisible === 'houseViewType'">
            <view class="mode-item"
                v-for="(item, index) in houseViewTypeList"
                :class="{active: index === selected.houseViewTypeIndex}"
                @tap="filterSelect('houseViewType', item, index)"
                :key="index">{{item.name}}</view>
        </view>
        <scroll-view class="mode-list-container region-list-contariner"
            v-else-if="filterVisible === 'region'"
            :scroll-y="true">
            <view class="mode-item"
                v-for="(item, index) in regionList"
                :class="{active: index === selected.regionIndex}"
                @tap="filterSelect('region', item, index)"
                :key="index">{{item.name}}</view>
        </scroll-view>
        <view class="mode-list-container" v-else-if="filterVisible === 'price'">
            <view class="mode-item"
                v-for="(item, index) in priceList"
                :class="{active: index === selected.priceIndex}"
                @tap="filterSelect('price', item, index)"
                :key="index">{{item.name}}</view>
            <view class="price-slider-group" v-if="priceSlider">
                <view class="price-slider-value">
                    <text>{{priceSlider.value[0]}}元</text>
                    <text style="margin: 0 10rpx;">-</text>
                    <text v-if="priceSlider.value[1] !== priceSlider.max">{{priceSlider.value[1]}}元</text>
                    <text v-else>无限</text>
                </view>
                <slider-range
                    :value="priceSlider.value"
                    :min="priceSlider.min"
                    :max="priceSlider.max"
                    :step="priceSlider.step"
                    :bar-height="priceSlider.barHeight"
                    :block-size="priceSlider.blockSize"
                    :background-color="priceSlider.backgroundColor"
                    :active-color="priceSlider.activeColor"
                    :format="priceFormat"
                    :decorationVisible="priceSlider.decorationVisible"
                    :tip-visible="priceSlider.tipVisible"
                    @change="priceSliderChange"></slider-range>
            </view>
            <view class="price-option-group" v-if="priceSlider">
                <view class="price-option-btn reset-btn" @tap="resetPrice">重置</view>
                <view class="price-option-btn submit-btn" @tap="confirmPriceSlider">确定</view>
            </view>
        </view>
        <scroll-view class="mode-list-container"
            v-else-if="filterVisible === 'processStatus'"
            :scroll-y="true">
            <view class="mode-item"
                v-for="(item, index) in processStatusList"
                :class="{active: index === selected.processStatusIndex}"
                @tap="filterSelect('processStatus', item, index)"
                :key="index">{{item.name}}</view>
        </scroll-view>
        <scroll-view class="mode-list-container"
            v-else-if="filterVisible === 'contractStatus'"
            :scroll-y="true">
            <view class="mode-item"
                v-for="(item, index) in contractStatusList"
                :class="{active: index === selected.contractStatusIndex}"
                @tap="filterSelect('contractStatus', item, index)"
                :key="index">{{item.name}}</view>
        </scroll-view>
    </view>
</view>
</template>

<script>
import {
    mapState
} from 'vuex';
import SliderRange from '@/plugins/primewind-sliderrange/index.vue';
import verifyRules from '@/function/verify-rules';
const sys = uni.getSystemInfoSync();

const processStatusList = [{
    name: '全部',
    value: '8',
    label: '状态',
}, {
    name: '待审批',
    value: '0',
}, {
    name: '已通过',
    value: '1',
}, {
    name: '已拒绝',
    value: '3',
}, {
    name: '待修改',
    value: '2',
}, {
    name: '待提交',
    value: '5',
}, {
    name: '已作废',
    value: '7',
}];

const contractStatusList = [{
    name: '全部',
    value: '5',
    label: '状态',
}, {
    name: '待签约',
    value: '2',
}, {
    name: '已签约',
    value: '3',
}, {
    name: '已结束',
    value: '4',
}, {
    name: '已作废',
    value: '1',
}];

export default {
    name: 'HouseListStatusBar',
    components: {
        SliderRange,
    },
    props: {
        type: {
            type: String,
            default: '0',
        },
    },
    data() {
        return {
            // filterVisible: 'price',
            filterVisible: null,
            filter: {
                houseViewType: '0',
                region: null,
                priceMin: null,
                priceMax: null,
                contractSignedStatus: '5',
                processStatus: '8',
            },
            selected: {
                houseViewTypeIndex: 0,
                regionIndex: 0,
                priceIndex: 0,
                contractStatusIndex: 0,
                processStatusIndex: 0,
            },
            houseViewTypeList: [{
                name: '预审批',
                value: '0',
            }, {
                name: '出租合同',
                value: '1',
            // }, {
            //     name: '房东合同',
            //     value: '2',
            }],
            regionList: [],
            priceList: [{
                min: '',
                max: '',
                name: '全部',
                label: '租金',
            }, {
                min: 0,
                max: 1001,
                name: '1000元以下',
            }, {
                min: 1000,
                max: 1501,
                name: '1000 - 1500元',
            }, {
                min: 1500,
                max: 2001,
                name: '1500 - 2000元',
            }, {
                min: 2000,
                max: 3001,
                name: '2000 - 3000元',
            }],
            processStatusList,
            contractStatusList,
            priceSlider: null,
        };
    },
    mounted() {
        this.resetPriceSlider();
        if (this.location && this.location.id) {
            this.loadRegionList();
        }
        this.syncFilter();
    },
    computed: {
        ...mapState({
            filterModeTop(state) {
                return (state.custom.bottom + (state.custom.top - state.sys.statusBarHeight)) + (80 / 2) * (sys.pixelRatio / 2);
            },
            location: state => state.location,
        }),
        houseViewTypeItem() {
            return this.houseViewTypeList[this.selected.houseViewTypeIndex];
        },
        regionItem() {
            return this.regionList[this.selected.regionIndex];
        },
        priceItem() {
            return this.priceList[this.selected.priceIndex];
        },
        processStatusItem() {
            return this.processStatusList[this.selected.processStatusIndex];
        },
        contractStatusItem() {
            return this.contractStatusList[this.selected.contractStatusIndex];
        },
    },
    methods: {
        loadRegionList() {
            this.$api('getRegionList', {
                regionNo: this.location.regionNo,
            }, (err, res) => {
                if (res) {
                    const list = res.map((i) => {
                        return {
                            name: i.name,
                            value: i.regionNo,
                        };
                    });
                    list.reverse();
                    this.regionList = [{
                        name: '全部区域',
                        value: null,
                        label: '位置',
                    }].concat(list);
                } else {
                    uni.showToast({
                        title: err.message,
                        icon: 'none',
                    });
                }
            });
        },
        /**
         * 激活过滤选择器
         *
         * @param {String} type 激活类型
         */
        activeFilterSelected(type) {
            if (this.filterVisible === type) {
                this.filterVisible = null;
            } else {
                this.filterVisible = type;
            }
        },
        /**
         * 关闭过滤选择器
         */
        closeFilterVisible() {
            this.filterVisible = null;
        },
        /**
         * sliderRange组件需要的format
         */
        priceFormat(val) {
            return val;
        },
        /**
         * 过滤内容选择
         * 
         * @param {String} type 筛选类型
         * @param {Object} item 单项
         * @param {Number} index 索引
         */
        filterSelect(type, item, index) {
            switch(type) {
                case 'houseViewType':
                    this.selected.houseViewTypeIndex = index;
                    this.filter.houseViewType = item.value;
                    // 针对这个状态的切换，其他选项同步初始化
                    this.selected.regionIndex = 0;
                    this.selected.priceIndex = 0;
                    this.selected.contractStatusIndex = 0;
                    this.selected.processStatusIndex = 0;
                    this.filter.region = null;
                    this.filter.priceMin = '';
                    this.filter.priceMax = '';
                    this.filter.processStatus = '8';
                    this.filter.contractSignedStatus = '5';
                break;
                case 'region':
                    this.selected.regionIndex = index;
                    this.filter.region = item.value;
                break;
                case 'price':
                    this.selected.priceIndex = index;
                    this.filter.priceMin = item.min;
                    this.filter.priceMax = item.max;
                    this.resetPriceSlider();
                break;
                case 'contractStatus':
                    this.selected.contractStatusIndex = index;
                    this.filter.contractSignedStatus = item.value;
                break;
                case 'processStatus':
                    this.selected.processStatusIndex = index;
                    this.filter.processStatus = item.value;
                break;
            }
            this.filterVisible = null;
            this.syncFilter();
        },
        /**
         * 价格slider的变更
         */
        priceSliderChange(val) {
            this.priceSlider.value = val;
        },
        /**
         * 重置/初始化价格SliderRange配置
         */
        resetPriceSlider() {
            this.priceSlider = {
                value: [0, 20000],
                min: 0,
                max: 20000,
                step: 100,
                height: 30,
                barHeight: 2,
                backgroundColor: '#aaa',
                activeColor: '#00a680',
                blockColor: '#fff',
                blockSize: 20,
                tipVisible: false,
            };
        },
        /**
         * 重置按钮
         */
        resetPrice() {
            if (this.priceSlider.value[0] === this.priceSlider.min && this.priceSlider.value[1] === this.priceSlider.max) {
                this.selected.priceIndex = 0;
                this.filter.priceMin = '';
                this.filter.priceMax = '';
                this.filterVisible = null;
                this.syncFilter();
            } else {
                this.resetPriceSlider();
            }
        },
        /**
         * 确认价格范围
         */
        confirmPriceSlider() {
            this.selected.priceIndex = -1;
            this.filter.priceMin = this.priceSlider.value[0];
            this.filter.priceMax = (this.priceSlider.value[1] === this.priceSlider.max) ? '' : this.priceSlider.value[1];
            this.filterVisible = null;
            this.syncFilter();
        },
        /**
         * 同步筛选条件
         */
        syncFilter() {
            const filter = { ...this.filter };
            Object.keys(filter).forEach((i) => {
                if (!verifyRules.isNotEmpty(filter[i])) {
                    delete filter[i];
                }
            });
            this.$emit('confirm', filter);
        },
    },
    watch: {
        location() {
            this.loadRegionList();
        },
    },
};
</script>

<style lang="scss">
.house-list-status {
    display: flex;
    flex-wrap: wrap;
    flex-direction: row;
    justify-content: space-between;
    &.type-0 {
        border-top: 1rpx solid #ddd;
    }
    &.type-1 {
        border-bottom: 1rpx solid #ddd;
    }
    .status-item {
        position: relative;
        width: 25%;
        height: 80rpx;
        padding: 0 6rpx;
        line-height: 80rpx;
        color: #555;
        z-index: 101;
        display: flex;
        flex-wrap: wrap;
        flex-direction: row;
        justify-content: center;
        .status-item-name {
            max-width: calc(100% - 30rpx);
            text-overflow: ellipsis;
            white-space: nowrap;
            overflow: hidden;
        }
        .active-color {
            color: #00a680;
        }
    }
    .status-icon {
        width: 30rpx;
        text-align: center;
        color: #939393;
        transition: all 100ms linear;
        &.rotate {
            transform: rotate(180deg);
        }
    }
}
.house-list-status-group {
    position: relative;
    padding: 0 30rpx;
}
.filter-mode-arrow-up {
    position: absolute;
    left: 50%;
    bottom: -1rpx;
    margin-left: -10rpx;
    border-left: 10rpx solid transparent;
    border-right: 10rpx solid transparent;
    border-top: 8rpx solid transparent;
    border-bottom: 8rpx solid #fff;
    z-index: 1;
}
.filter-mode-arrow-down {
    position: absolute;
    left: 50%;
    bottom: -1rpx;
    margin-left: -14rpx;
    border-left: 14rpx solid transparent;
    border-right: 14rpx solid transparent;
    border-top: 10rpx solid transparent;
    border-bottom: 10rpx solid #eee;
    z-index: 0;
}
.filter-mode-group {
    position: absolute;
    top: 80rpx;
    left: 20rpx;
    width: 710rpx;
    height: 350px;
    padding: 15px;
    border-radius: 8rpx;
    border: 1rpx solid #eee;
    background: #fff;
    z-index: 100;
}
.filter-mode-group-bg {
    position: fixed;
    left: 0;
    right: 0;
    bottom: 0;
    z-index: 90;
}
.mode-list-container {
    position: relative;
    width: 100%;
    height: 100%;
    padding: 0 10rpx;
    .mode-item {
        height: 42px;
        line-height: 42px;
        font-size: 16px;
        overflow: hidden;
        &.active {
            color: #00a680;
        }
    }
}
.price-option-group {
    position: relative;
}
.price-slider-value {
    position: absolute;
    left: 0;
    right: 0;
    text-align: center;
}
.price-option-group {
    display: flex;
    flex-wrap: wrap;
    flex-direction: row;
    justify-content: space-between;
    padding: 0 10rpx;
    .price-option-btn {
        width: 280rpx;
        height: 70rpx;
        text-align: center;
        border-radius: 35rpx;
    }
    .reset-btn {
        line-height: 68rpx;
        font-size: 28rpx;
        border: 1rpx solid #ddd;
        color: #444;
        background: #fff;
    }
    .submit-btn {
        line-height: 70rpx;
        font-size: 28rpx;
        color: #fff;
        background: #00a680;
    }
}
</style>
