import * as consts from "../common/consts/ActionTypes";

// 组件初始化状态，其实就是把component的constructor的挪到这里就完事了
const initState = {
    items: [],          // 文章列表
    pullDownStatus: 3,  // 下拉状态
    pullUpStatus: 0,    // 上拉状态
    isLoading: true,    // 是否处于首屏加载中
    page: 1,
    y: 0, // 上一次滚动偏移量
};

function MSG_LIST_PAGE_TRY_RESTORE_COMPONENT_reducer(state, action) {
    // 计算一下
    return state;
}

function MSG_LIST_PAGE_FETCH_ITEMS_reducer(state, action) {
    let nextState = Object.assign({}, state);

    if (action.page == 1) {    // 刷新操作
        if (state.pullDownStatus == 3) {
            nextState.pullDownStatus = 4;
            nextState.items = action.items;
            nextState.isLoading = false;
            nextState.page = action.page + 1;
        }
    } else {    // 加载操作
        if (state.pullUpStatus == 2) {
            nextState.pullUpStatus = 0;
            nextState.items = state.items.concat(action.items);
            nextState.page = action.page + 1;
        }
    }
    // console.log(nextState);
    return nextState;
}

function MSG_LIST_PAGE_UPDATE_PULLDOWN_STATUS_reducer(state, action) {
    if (state.pullDownStatus != action.nextPullDownStatus) {
        return Object.assign({}, state, {pullDownStatus: action.nextPullDownStatus});
    }
    return state;
}

function MSG_LIST_PAGE_UPDATE_PULLUP_STATUS_reducer(state, action) {
    if (state.pullUpStatus != action.nextPullUpStatus) {
        return Object.assign({}, state, {pullUpStatus: action.nextPullUpStatus});
    }
    return state;
}

function MSG_LIST_PAGE_BACKUP_ISCROLL_Y_reducer(state, action) {
    return Object.assign({}, state, {y: action.y});
}

// Reducer函数
// 1, 在redux初始化，路由切换等时机，都会被唤醒，从而有机会返回初始化state，
//    这将领先于componnent从而可以props传递
// 2, 这里redux框架传来的是state对应Reducer的子集合
export default function MsgListPageReducer(state = initState, action) {
    switch (action.type) {
        case consts.MSG_LIST_PAGE_TRY_RESTORE_COMPONENT:
            return MSG_LIST_PAGE_TRY_RESTORE_COMPONENT_reducer(state, action);
        case consts.MSG_LIST_PAGE_FETCH_ITEMS:
            return MSG_LIST_PAGE_FETCH_ITEMS_reducer(state, action);
        case consts.MSG_LIST_PAGE_UPDATE_PULLDOWN_STATUS:
            return MSG_LIST_PAGE_UPDATE_PULLDOWN_STATUS_reducer(state, action);
        case consts.MSG_LIST_PAGE_UPDATE_PULLUP_STATUS:
            return MSG_LIST_PAGE_UPDATE_PULLUP_STATUS_reducer(state, action);
        case consts.MSG_LIST_PAGE_BACKUP_ISCROLL_Y:
            return MSG_LIST_PAGE_BACKUP_ISCROLL_Y_reducer(state, action);
        // 有2类action.type会进入default
        // 1) 你不关心的action，属于其他组件
        // 2）系统的action，例如router切换了location，redux初始化了等等
        default:
            // console.log(action);
            return state;   // 返回当前默认state或者当前state
    }
}