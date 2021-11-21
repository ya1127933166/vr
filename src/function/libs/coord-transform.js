/**
 * Created by Wandergis on 2015/7/8.
 * 提供了百度坐标（BD09）、国测局坐标（火星坐标，GCJ02）、和WGS84坐标系之间的转换
 */
//UMD魔法代码
// if the module has no dependencies, the above pattern can be simplified to
(function (root, factory) {
    if (typeof define === 'function' && define.amd) {
        // AMD. Register as an anonymous module.
        define([], factory);
    } else if (typeof module === 'object' && module.exports) {
        // Node. Does not work with strict CommonJS, but
        // only CommonJS-like environments that support module.exports,
        // like Node.
        module.exports = factory();
    } else {
        // Browser globals (root is window)
        root.coordtransform = factory();
    }
}(this, function () {
    //定义一些常量
    const x_PI = 3.14159265358979324 * 3000.0 / 180.0;
    const PI = 3.1415926535897932384626;
    const a = 6378245.0;
    const ee = 0.00669342162296594323;
    /**
     * 百度坐标系 (BD-09) 与 火星坐标系 (GCJ-02)的转换
     * 即 百度 转 谷歌、高德
     * @param bd_lon
     * @param bd_lat
     * @returns {*[]}
     */
    const bd09togcj02 = (bd_lon, bd_lat) => {
        const bdLon = +bd_lon;
        const bdLat = +bd_lat;
        const x = bdLon - 0.0065;
        const y = bdLat - 0.006;
        const z = Math.sqrt(x * x + y * y) - 0.00002 * Math.sin(y * x_PI);
        const theta = Math.atan2(y, x) - 0.000003 * Math.cos(x * x_PI);
        const ggLng = z * Math.cos(theta);
        const ggLat = z * Math.sin(theta);
        return [ggLng, ggLat];
    };

    /**
     * 火星坐标系 (GCJ-02) 与百度坐标系 (BD-09) 的转换
     * 即谷歌、高德 转 百度
     * @param lng
     * @param lat
     * @returns {*[]}
     */
    const gcj02tobd09 = (lng, lat) => {
        const Lat = +lat;
        const Lng = +lng;
        const z = Math.sqrt(Lng * Lng + Lat * Lat) + 0.00002 * Math.sin(Lat * x_PI);
        const theta = Math.atan2(Lat, Lng) + 0.000003 * Math.cos(Lng * x_PI);
        const bdLng = z * Math.cos(theta) + 0.0065;
        const bdLat = z * Math.sin(theta) + 0.006;
        return [bdLng, bdLat];
    };

    /**
     * WGS84转GCj02
     * @param lng
     * @param lat
     * @returns {*[]}
     */
    const wgs84togcj02 = (lng, lat) => {
        const Lat = +lat;
        const Lng = +lng;
        if (outOfChina(Lng, Lat)) {
            return [Lng, Lat];
        }
        const radLat = Lat / 180.0 * PI;
        let magic = Math.sin(radLat);
        magic = 1 - ee * magic * magic;
        const sqrtmagic = Math.sqrt(magic);
        let dLat = transformlat(Lng - 105.0, Lat - 35.0);
        let dLng = transformlng(Lng - 105.0, Lat - 35.0);
        dLat = (dLat * 180.0) / ((a * (1 - ee)) / (magic * sqrtmagic) * PI);
        dLng = (dLng * 180.0) / (a / sqrtmagic * Math.cos(radLat) * PI);
        const mglat = Lat + dLat;
        const mglng = Lng + dLng;
        return [mglng, mglat];
    };

    /**
     * GCJ02 转换为 WGS84
     * @param lng
     * @param lat
     * @returns {*[]}
     */
    const gcj02towgs84 = (lng, lat) => {
        const Lat = +lat;
        const Lng = +lng;
        if (outOfChina(Lng, Lat)) {
            return [Lng, Lat];
        }
        const radlat = Lat / 180.0 * PI;
        let dlat = transformlat(Lng - 105.0, Lat - 35.0);
        let dlng = transformlng(Lng - 105.0, Lat - 35.0);
        let magic = Math.sin(radlat);
        magic = 1 - ee * magic * magic;
        const sqrtmagic = Math.sqrt(magic);
        dlat = (dlat * 180.0) / ((a * (1 - ee)) / (magic * sqrtmagic) * PI);
        dlng = (dlng * 180.0) / (a / sqrtmagic * Math.cos(radlat) * PI);
        const mglat = Lat + dlat;
        const mglng = Lng + dlng;
        return [Lng * 2 - mglng, Lat * 2 - mglat]
    };

    const transformlat = (lng1, lat1) => {
        const lat = +lat1;
        const lng = +lng1;
        let ret = -100.0 + 2.0 * lng + 3.0 * lat + 0.2 * lat * lat + 0.1 * lng * lat + 0.2 * Math.sqrt(Math.abs(lng));
        ret += (20.0 * Math.sin(6.0 * lng * PI) + 20.0 * Math.sin(2.0 * lng * PI)) * 2.0 / 3.0;
        ret += (20.0 * Math.sin(lat * PI) + 40.0 * Math.sin(lat / 3.0 * PI)) * 2.0 / 3.0;
        ret += (160.0 * Math.sin(lat / 12.0 * PI) + 320 * Math.sin(lat * PI / 30.0)) * 2.0 / 3.0;
        return ret;
    };

    const transformlng = (lng1, lat1) => {
        const lat = +lat1;
        const lng = +lng1;
        let ret = 300.0 + lng + 2.0 * lat + 0.1 * lng * lng + 0.1 * lng * lat + 0.1 * Math.sqrt(Math.abs(lng));
        ret += (20.0 * Math.sin(6.0 * lng * PI) + 20.0 * Math.sin(2.0 * lng * PI)) * 2.0 / 3.0;
        ret += (20.0 * Math.sin(lng * PI) + 40.0 * Math.sin(lng / 3.0 * PI)) * 2.0 / 3.0;
        ret += (150.0 * Math.sin(lng / 12.0 * PI) + 300.0 * Math.sin(lng / 30.0 * PI)) * 2.0 / 3.0;
        return ret
    };

    /**
     * 判断是否在国内，不在国内则不做偏移
     * @param lng
     * @param lat
     * @returns {boolean}
     */
    const outOfChina = (lng1, lat1) => {
        const lat = +lat1;
        const lng = +lng1;
        // 纬度3.86~53.55,经度73.66~135.05 
        return !(lng > 73.66 && lng < 135.05 && lat > 3.86 && lat < 53.55);
    };

    return {
        bd09togcj02,
        gcj02tobd09,
        wgs84togcj02,
        gcj02towgs84,
    };
}));
