import {
    qqmapkey
} from './config';
import QQMapWX from './libs/qqmap-wx-jssdk.min';
import poiTypeList from './map-poi-type';

/**
 * 腾讯地图操作类的二次封装
 * 目前适配的微信小程序
 */
class MapTool {
    constructor() {
        this.map = new QQMapWX({
            key: qqmapkey
        });
        this.poiCache = {};
        this.data = {
            markers: [],
        };
    }

    /**
     * 设置定位
     * @param {Object} data 定位数据
     */
    set location(data) {
        this.mapLocation = {
            latitude: data.lat,
            longitude: data.lng,
        };
    }

    /**
     * 获取定位
     */
    get location() {
        return {
            lat: this.mapLocation.latitude,
            lng: this.mapLocation.longitude,
        };
    }

    /**
     * 创建marker单项
     * @param {Object} i 搜索结果点
     */
    createMarker(i) {
        this.markerIcon(i);
        this.poiCache[i.id] = i;
        const item = {};
        item.latitude = i.location.lat;
        item.longitude = i.location.lng;
        ['id', 'iconPath', 'width', 'height'].forEach((key) => {
            item[key] = i[key];
        });
        return item;
    }

    /**
     * 处理marker的图标
     * @param {Object} item 图标单项数据
     * @param {Boolean} selected 选中状态 *未处理
     */
    markerIcon(item, selected) {
        item.iconPath = (() => {
            if (item.type == 1) {
                return '/static/marker/marker-bus.png';
            } else if (item.type == 2) {
                return '/static/marker/marker-metro.png';
            } else if (this.data.poiTypeIndex == 2) {
                return '/static/marker/marker-hospital.png';
            } else if (this.data.poiTypeIndex == 1) {
                return '/static/marker/marker-school.png';
            } else if (item.type === 'house') {
                return '/static/marker/marker-home.png';
            }
            return '/static/marker/marker-default.png';
        })();
        item.width = 36;
        item.height = 36;
    }

    /**
     * 搜索Poi数据
     * 根据预设的Poi类型搜索数据
     * https://lbs.qq.com/qqmap_wx_jssdk/method-search.html
     * @param {number} poiTypeIndex 预设Poi类型的索引
     */
    async searchPoi(poiTypeIndex) {
        const poiType = poiTypeList[poiTypeIndex];
        if (this.data.poiTypeIndex != poiTypeIndex) {
            this.data.poiTypeIndex = poiTypeIndex;
            const n = poiType.pages || 4;
            for (let i = 0; i < n; i += 1) {
                const status = await this.getSearchPoi(poiType, i + 1);
                if (!status) break;
            }
        }
        return this.data.markers;
    }

    /**
     * 获取搜索兴趣点列表
     * @param {object} poiType Poi类型对象
     * @param {number} page 列表页数
     */
    getSearchPoi(poiType, page = 1) {
        const options = {
            keyword: poiType.name,
            location: this.mapLocation,
            page_index: page,
            page_size: 20,
        };
        if (poiType.filter) {
            options.filter = poiType.filter;
        }
        return new Promise((resolve, reject) => {
            this.map.search({
                ...options,
                success: (res) => {
                    if (res.status === 0) {
                        if (page == 1) this.data.markers = [];
                        this.data.markers = this.data.markers.concat(res.data.map(i => this.createMarker(i)));
                        res.count < page * 20 ? resolve(false) : resolve(true);
                    } else {
                        resolve(false);
                    }
                },
                fail: () => resolve(false),
            });
        });
    }

    /**
     * 根据marker的ID获取缓存的marker点对象
     * @param {string} id
     */
    getMarker(id) {
        return this.poiCache[id];
    }

    /**
     * 根据marker的ID获取对应的弹窗信息内容
     * @param {string} id
     */
    getMarkerPopup(id) {
        const marker = this.getMarker(id);
        if (!marker) return null;
        return {
            title: marker.title,
            address: marker.address,
            distance: marker._distance,
        };
    }

    /**
     * 操作选中后替换marker图标
     * @param {string} id
     */
    selectedMarker(id) {
        const markers = this.markers.slice();
        const item = markers.find(i => i.id == id);
        this.markerIcon(item, true);
        return markers;
    }
}

export default {
    MapTool,
    poiTypeList: poiTypeList.map(i => i.name),
};
