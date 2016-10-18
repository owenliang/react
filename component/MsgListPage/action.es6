import * as consts from "../../common/consts";
import $ from "jquery";

/**
 * 恢复组件的状态
 * @returns {{type}}
 */
export function tryRestoreComponent() {
    return {
        type: consts.MSG_LIST_PAGE_TRY_RESTORE_COMPONENT
    };
}

function _fetchItems(page, dispatch) {
    setTimeout(() => {  // 模拟延迟0.5秒
        $.ajax({
            url: '/msg-list',
            data: {page: page},
            type: 'GET',
            dataType: 'json',
            success: (response) => {
                dispatch({
                    type: consts.MSG_LIST_PAGE_FETCH_ITEMS,
                    items: response.data.items,
                    page: page,
                });
            }
        });
    }, 500);
}

// 发起刷新
export function beginRefresh() {
    return (dispatch) => {
        // 同步更新下拉状态
        dispatch({
            type: consts.MSG_LIST_PAGE_UPDATE_PULLDOWN_STATUS,
            nextPullDownStatus: 3,
        });
        // 异步网络请求
        _fetchItems(1, dispatch);
    }
}

// 发起加载更多
export function beginLoad() {
    return (dispatch, getState) => {
        // 同步更新下拉状态
        dispatch({
            type: consts.MSG_LIST_PAGE_UPDATE_PULLUP_STATUS,
            nextPullUpStatus: 2,
        });
        // 异步网络请求
        _fetchItems(getState().MsgListPageReducer.page, dispatch);
    };
}

// 更新下拉状态
export function updatePullDownStatus(nextPullDownStatus) {
    return {
        type: consts.MSG_LIST_PAGE_UPDATE_PULLDOWN_STATUS,
        nextPullDownStatus: nextPullDownStatus,
    };
}

// 更新上拉状态
export function updatePullUpStatus(nextPullUpStatus) {
    return {
        type: consts.MSG_LIST_PAGE_UPDATE_PULLUP_STATUS,
        nextPullUpStatus: nextPullUpStatus,
    };
}

// 备份Y轴
export function backupIScrollY(y) {
    return {
        type: consts.MSG_LIST_PAGE_BACKUP_ISCROLL_Y,
        y: y,
    };
}