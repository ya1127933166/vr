//合同通用store
export default {
    namespaced: true,
    state:{
        //页面配置
        pageInfo:{
            type:'',
            title:[],
            processList:[],
            len:[]
        },
		//添加房间
		addHouse:['','','','','','','','',''],
        //合租房间照片展示
        showImage:{show:[],pice:[]},
        //合租房间列表
		addhouseList:[],
		//二手房
        //步骤一
        step1:['',{name:'请选择'},'','请选择','请选择','请选择','请选择','仅自己可见'],
        //步骤二
        step2:['','','请选择','请选择','请选择',[],[]],
        //步骤三
        step3:{

        },
		//租房
		  //步骤一
		 stepHouse1:['','',{name:'请选择'},'','请选择','请选择','请选择','请选择',''],
		//  stepHouse1:["整租房源", "成都", {name:'中和',id:12}, "1", "1居室-1厅-单卫", "东", "毛坯", "1栋1单元1层-共1层1",'id'],
		  stepHouse2:['','请选择','请选择','请选择',[],[]],
		  //选择房间状态
		 totalList:[
		  	{type:"A间",status:false,num:1},{type:"B间",status:false,num:1},{type:"C间",status:false,num:1},{type:"D间",status:false,num:1},{type:"E间",status:false,num:1},{type:"F间",status:false,num:1}
		  ],
    },
    mutations:{
        //设置页面基础配置
        setPageInfo(state,data){
            state.pageInfo = data
        },
        //设置步骤一数据
        setStep1(state,data){
            state.step1 = data
        },
        //设置步骤二数据
        setStep2(state,data){
            state.step2 = data
        },
		 //设置步骤一数据
		setStepHouse1(state,data){
            state.stepHouse1 = data
        },
		//设置步骤二数据
		setStepHouse2(state,data){
		    state.stepHouse2 = data
		},
        //单个房间配置项
        setHouseInfo(state,data){
		    state.addHouse = data
		},
		//设置添加房间列表
		setAddHouse(state,data){
		    state.addhouseList = data
		},
        //合租房间图片修改
        setImage(state,data){
            state.showImage = data 
        },
		//修改选择房间状态
		setTotalList(state,data){
			 state.totalList = data
		}
		
    },
    actions:{},
    getters:{}
}