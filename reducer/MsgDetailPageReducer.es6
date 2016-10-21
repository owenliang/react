import * as consts from "../common/consts/ActionTypes";

// 组件初始化状态，其实就是把component的constructor的挪到这里就完事了
const initState = {
    contentHeight: 0,
    loadingStatus: 1,
    outerStyle: {height: 0},
    msgTitle: '',
    msgContent: '',
};

function MSG_DETAIL_PAGE_ADJUST_LOADING_HEIGHT_reducer(state, action) {
    return Object.assign({}, state, {
        outerStyle: {height: action.height}
    });
}

function MSG_DETAIL_PAGE_FETCH_DETAIL_SUCCESS_reducer(state, action) {
    return Object.assign({}, state, {
        msgTitle: action.title,
        msgContent: action.content,
        loadingStatus: 2, // 首屏加载完成, 标记loading结束
    });
}

function MSG_DETAIL_PAGE_FETCH_DETAIL_FAIL_reducer(state, action) {
    return Object.assign({}, state, {
        loadingStatus: 3, // 首屏加载完成, 标记loading结束
    });
}

function MSG_DETAIL_PAGE_ADJUST_CONTENT_HEIGHT_reducer(state, action) {
    return Object.assign({}, state, {
        contentHeight: action.contentHeight
    });
}

function MSG_DETAIL_PAGE_INIT_STATE_reducer(state, action) {
    return initState
}

function MSG_DETAIL_PAGE_RESET_LOADING_STATUS_reducer(state, action) {
    return Object.assign({}, state, {loadingStatus: 1});
}

// Reducer函数
// 1, 在redux初始化，路由切换等时机，都会被唤醒，从而有机会返回初始化state，
//    这将领先于componnent从而可以props传递
// 2, 这里redux框架传来的是state对应Reducer的子集合
export default function MsgDetailPageReducer(state = initState, action) {
    switch (action.type) {
        // 调整Loading界面高度
        case consts.MSG_DETAIL_PAGE_ADJUST_LOADING_HEIGHT:
            return MSG_DETAIL_PAGE_ADJUST_LOADING_HEIGHT_reducer(state, action);
        case consts.MSG_DETAIL_PAGE_FETCH_DETAIL_SUCCESS:
            return MSG_DETAIL_PAGE_FETCH_DETAIL_SUCCESS_reducer(state, action);
        case consts.MSG_DETAIL_PAGE_FETCH_DETAIL_FAIL:
            return MSG_DETAIL_PAGE_FETCH_DETAIL_FAIL_reducer(state, action);
        case consts.MSG_DETAIL_PAGE_ADJUST_CONTENT_HEIGHT:
            return MSG_DETAIL_PAGE_ADJUST_CONTENT_HEIGHT_reducer(state, action);
        case consts.MSG_DETAIL_PAGE_INIT_STATE:
            return MSG_DETAIL_PAGE_INIT_STATE_reducer(state, action);
        case consts.MSG_DETAIL_PAGE_RESET_LOADING_STATUS:
            return MSG_DETAIL_PAGE_RESET_LOADING_STATUS_reducer(state, action);
        // 有2类action.type会进入default
        // 1) 你不关心的action，属于其他组件
        // 2）系统的action，例如router切换了location，redux初始化了等等
        default:
            //console.log(action);
            return state;   // 返回当前默认state或者当前state
    }
}