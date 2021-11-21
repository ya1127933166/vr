# 斑马管房
uni-app + color ui

## Start
```bash
npm install
// or
yarn install

// 开发运行
npm run dev:mp-weixin
// 发行构建
npm run build:mp-weixin
```
更多关于uniapp与vue的差异化，参阅[uniapp](https://uniapp.dcloud.io/)  

## 代码风格
ESLint ES6 Airbnb Base 不严格标准 | 4空格缩进

## 关于框架
2019/09 ColorUI 已二次修改，请不要轻易同步框架新内容；--修改人：周家俊   

## 项目文件结构图
```
/colorui ColorUI框架相关 - 只记录修改了什么
    /components
        |- cu-custom.vue 改动了很多，正在考虑自己重新制作一个custom-bar，满足项目需求
/components 组件目录
    /contract-component 合同页组件
        |- house-list-status.vue 房源列表的状态栏组件
        |- house-list.vue 房源列表的组件
        |- qrcode-box.vue 二维码弹窗
        |- rent-contract-modal.vue 租房合同确认弹窗
    /find-component 发现页组件
        |- region.vue 区域组件
    /form-component 预封装form组件
        |- form-item-input.vue 输入框节点组件
        |- form-item-picker.vue picker选择器节点组件
        |- form-item.vue 普通信息节点组件
        |- form-money-input.vue 货币金额纯输入框组件
    /module
        |- loading.vue Loading组件
    /signing-component 签约页组件
        |- house-list-status.vue 房源列表的状态栏组件
        |- house-list.vue 房源列表的组件
    |- get-location.vue 快速获取定位组件
    |- map-poi-box.vue 地图周边组件
    |- tab-flow.vue	托管申请的tab流程组件
    |- video-player-box.vue 视频播放弹窗
    |- video-player.vue 视频播放器
/function 方法与配置
    /libs 第三方库或已成对公的库
    |- api-list.js 登录以外的接口列表配置
    |- config.js 常量配置
    |- date-format.js 时间工具
    |- map-poi-type.js 地图周边分类配置
    |- map-tool.js 腾讯地图SDK二次封装
    |- request.js 网络请求方法
    |- upload-oss.js 上传文件到阿里云OSS
    |- url-merge.js 请求网址合并方法 - 处理相对路径的合并
    |- verify-rules.js 验证方法
    |- waiting.js 等待执行任务类
/pages 页面目录 -> 看页面地图
/plugins 第三方插件 -> uniapp插件
/static 静态资源目录
|- App.vue 项目主组件
|- main.js vue初始化
|- manifest.js 多端配置
|- pages.json 项目配置
|- plugin.js vue全局拓展
|- store.js vuex配置
|- utils.js 防抖函数

```

## 页面地图
优先级按照TabBar > 子页面排序（index优先）
```
/pages/tabbar/find.vue 发现页
/pages/tabbar/home.vue 首页
/pages/tabbar/mine.vue 我的
/pages/addHouseSource/configList.vue  交割单列表
/pages/addHouseSource/finish.vue    添加房源成功页面
/pages/addHouseSource/houseAlias.vue  房间编号
/pages/addHouseSource/modal.vue   配置房屋属性
/pages/addHouseSource/shareList.vue  合租房间配置
/pages/addHouseSource/shareStep.vue   合租添加步骤2
/pages/addHouseSource/step1.vue   租房添加步骤1
/pages/addHouseSource/step2.vue   整租添加步骤2
/pages/addHouseSource/stephouse1.vue  二手房添加步骤1
/pages/addHouseSource/stephouse2.vue  二手房添加步骤2
/pages/application/index.vue 签约申请
/pages/auth/auth.vue 登录授权
/pages/contract/house-material-item.vue 房屋交割清单，单项填写页面
/pages/contract/house-material-list.vue 房屋交割清单，大分类列表
/pages/contract/house-material.vue 房屋交割清单，大分类导航
/pages/contract/post-rent.vue 发布租房合同
/pages/contract/rent.vue 租房合同详情页
/pages/contract/select-house.vue 选择房源
/pages/contract/upload-idcard.vue 上传身份证
/pages/deposit/district.vue 小区选择
/pages/deposit/house-num.vue 门牌号填写
/pages/deposit/post.vue 发布托管房源
/pages/village/village.vue 搜索小区
/pages/select-location/select-city.vue 选择城市定位
/pages/signing/index.vue 管理签约
/pages/signing/house.vue 托管房源的详情页面
/pages/signing/review.vue 待审批列表
/pages/village/village.vue  搜索页面
/pages/xiaoqu/item.vue 小区详情页面
/pages/xiaoqu/list.vue 小区列表
/pages/xiaoqu/map-poi.vue 小区周边配套页面

/storeModule/addrList.js  通讯录模块VueX存储
/storeModule/contract.js  房源添加Vuex存储
/storeModule/source.js    客户模块vuex存储 

subcontractPages/subpackSource 房源模块分包
pages/source/follow/followContent.vue 跟进内容
pages/source/follow/addFollow.vue 新增跟进
pages/source/follow/record.vue 跟进记录
pages/source/addTag.vue 新建标签组
pages/source/tag.vue 标签
pages/source/addCustomer.vue 添加客户
pages/source/customerInfo.vue 客户信息
pages/source/selectCustomer.vue 选择客户

subcontractPages/subpackAdminHousing 房源管理模块
pages/adminHousing/income/billDetail.vue 账单详情
pages/adminHousing/income/addCost.vue 添加费用
pages/adminHousing/adminHousing.vue 管理房源主页面
pages/adminHousing/room/addRoom.vue 增加房间
pages/adminHousing/tenants/historyTenant/bill.vue 账单
pages/adminHousing/tenants/historyTenant/historyTenant.vue 历史租客
pages/adminHousing/tenants/rentRefund.vue 退租
pages/adminHousing/tenants/renewal.vue 续租
pages/adminHousing/tenants/addTenant.vue 添加租客
pages/adminHousing/tenants/editTennat.vue 编辑租客
pages/adminHousing/tenants/tenantsInfo.vue 租客信息
pages/adminHousing/theOwner/termination.vue 解约合同
pages/adminHousing/theOwner/renew.vue 续签合同
pages/adminHousing/theOwner/bankCard.vue 银行卡信息
pages/adminHousing/theOwner/ownerInfo 业主信息

subcontractPages/subpackAddrlist 通讯录模块
pages/addrList/selectMember.vue 选择成员
pages/addrList/selectStore.vue 选择部门/门店
pages/addrList/memberInfo.vue 成员信息
pages/addrList/member.vue 添加成员
pages/addrList/addrList.vue 通讯录主页面

subcontractPages/subpackTenantContract 合同模块
pages/tenantContract/constractList.vue 合同管理列表
pages/tenantContract/delivery.vue 房屋交割单
pages/tenantContract/tenantContract.vue 租客合同
pages/tenantContract/lifePrice.vue 生活费用
pages/tenantContract/deliverylist.vue 房屋交割单
pages/tenantContract/detailsContract.vue 合同详情
pages/tenantContract/signPane.vue 签名页面

subcontractPages/subpackComm 公用模块
pages/viewHousing/viewHousing.vue 查看二手房房源
pages/viewHousing/viewHousing1.vue 查看租房房源
pages/viewHousing/hosueadd.vue  房源管理
pages/approval/tenantContract.vue 租客合同
pages/approval/refuse.vue 拒绝原因
pages/approval/approval.vue 待审批
pages/myMessage/business.vue 业务通知
pages/myMessage/noticeDetail.vue 公告详情
pages/myMessage/myMessage.vue 我的消息
pages/login/createAccount.vue 创建账户
pages/login/login.vue 初始进入页面
pages/login/selectAuth.vue 选择身份
pages/upload/upload.vue 上传图片
pages/uploadIdCard/uploadIdCard.vue 上传身份证
pages/ownerContract/ownerContractInfo.vue 合同信息
pages/ownerContract/ownerContractRecorder.vue 录入代理合同
pages/ownerContract/ownerContract.vue 业主合同

```

## AliOSS 上传路径设定
```javascript
/**
 * 参数定义
 * path         服务端设定路径前缀
 * caseNaem     主要针对私有仓库保存的类型名称 类似身份证: idcard
 * userIdCode   用户ID 固定的6位进制码 | 算法来源/function/libs/get-code.js
 * date         日期
 * locationCode 用户定位 前5位进制码为lat，后5位进制码为lng，所得数字除以(10 ** 5) | 算法来源/function/libs/get-code.js
 * datestamp    上传的时间戳
 * index        同时上传的顺序
 * ext          读取文件路径所得文件格式名
 */
`${path}wxa/banma/${caseNaem}${$userIdCode}${date}_${locationCode}_${datestamp}_${index}${ext}`
```
# vr
