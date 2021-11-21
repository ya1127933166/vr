/**
 * 地图周边配置
 */
const mapPoiType = [{
        name: '交通',
        filter: 'category=地铁站',
    },
    {
        name: '教育',
        filter: 'category=大学,中学,小学,幼儿园',
    },
    {
        name: '医疗',
        filter: 'category=综合医院,急救中心',
        pages: 3,
    },
    {
        name: '购物',
        filter: 'category=超市,综合商场,购物中心',
        pages: 5,
    },
    {
        name: '生活',
        pages: 8,
    },
    {
        name: '娱乐',
        pages: 8,
    }
];

export default mapPoiType;
