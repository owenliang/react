import * as consts from "../common/consts/ActionTypes";
import $ from "jquery";

/**
 * 调整loading界面的高度
 */
export function adjustLoadingHeight(height) {
    // 隐式的dispatch：
    //      直接返回action对象，这是同步dispatch的最简单套路，
    //      框架会立即交给reducer，立即生效到props
    return {
        type: consts.MSG_DETAIL_PAGE_ADJUST_LOADING_HEIGHT,
        height: height
    };
}

/**
 * 请求文章内容
 */
export function fetchDetail(msgId) {
    // 显式的diapatch
    //      基于react-thunk实现，支持返回function从而获得dispatch上下文，异步的发送action
    return (dispatch) => {
        setTimeout(() => {
            $.ajax({
                type: 'GET',
                url: 'test/msg-detail',
                data: {'msgId': msgId},
                dataType: 'json',
                success: (response) => {
                    dispatch({
                        type: consts.MSG_DETAIL_PAGE_FETCH_DETAIL_SUCCESS,
                        title: response.data.title,
                        content: response.data.content,
                    });
                    console.log(`msg-detail?msgId=${msgId} 请求成功, msgContent=${response.data.content}`);
                },
                error: () => {
                    console.log(`msg-detail?msgId=${msgId} 请求异常`);
                    dispatch({
                        type: consts.MSG_DETAIL_PAGE_FETCH_DETAIL_FAIL,
                    });
                }
            });
        }, 1000);
    }
}

/**
 * 调整文章最小高度
 * @param height
 * @returns {{type, contentHeight: *}}
 */
export function adjustContentHeight(height) {
    return {
        type: consts.MSG_DETAIL_PAGE_ADJUST_CONTENT_HEIGHT,
        contentHeight: height,
    };
}

/**
 * 重置状态, 因为第2次访问同一个组件会导致访问到第1次访问遗留的state
 * @returns {{type}}
 */
export function initState() {
    return {
        type: consts.MSG_DETAIL_PAGE_INIT_STATE
    };
}

export function resetLoadingStatus() {
    return {
        type: consts.MSG_DETAIL_PAGE_RESET_LOADING_STATUS
    };
}
