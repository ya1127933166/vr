//通讯录通用store
export default {
    namespaced: true,
    state:{
        selectStoreList:[{org_id:'c',org_name:'请选择'}],//选中的部门
        memberDetail:{}//成员详细信息
    },
    mutations:{
        //设置选中的部门
        setSelectStoreList(state,data){
            state.selectStoreList = data
        },
        //设置成员详细信息
        setMemberDetail(state,data){
            state.memberDetail = data
        }
    },
    actions:{},
    getters:{}
}