import * as consts from "../common/consts/ActionTypes";

// 组件初始化状态，其实就是把component的constructor的挪到这里就完事了
const initState = {
    curIndex: 0,    // 多余1个图片的情况下，第0个图片是用于衔接的图片
    imgsCount: 0,   // 真实的图片数量加上头尾2个衔接的图片
    step: 0, // 本次移动的方向, -2: 头部衔接 -1：显示左边的图片，0：没有动作，1：显示右边的图片 2:尾部衔接
};

function SLIDER_INIT_STATE_reducer(state, action) {
    let count = action.imgsCount;
    let curIndex = 0;
    if (count > 1) {
        count += 2;
        curIndex = 1;
    }
    return Object.assign({}, initState, {
        curIndex: curIndex,
        imgsCount: count,
        step: 0
    });
}

function SLIDER_SLIDE_reducer(state, action) {
    let nextIndex = (state.curIndex + state.imgsCount + action.step) % state.imgsCount;
    return Object.assign({}, state, {
        curIndex: nextIndex,
        step: action.step,
    });
}

// Reducer函数
// 1, 在redux初始化，路由切换等时机，都会被唤醒，从而有机会返回初始化state，
//    这将领先于componnent从而可以props传递
// 2, 这里redux框架传来的是state对应Reducer的子集合
export default function SliderReducer(state = initState, action) {
    switch (action.type) {
        case consts.SLIDER_INIT_STATE:
            return SLIDER_INIT_STATE_reducer(state, action);
        case consts.SLIDER_SLIDE:
            return SLIDER_SLIDE_reducer(state, action);
        // 有2类action.type会进入default
        // 1) 你不关心的action，属于其他组件
        // 2）系统的action，例如router切换了location，redux初始化了等等
        default:
            //console.log(action);
            return state;   // 返回当前默认state或者当前state
    }
}