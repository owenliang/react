import * as consts from "../common/consts/ActionTypes";
import $ from "jquery";

export function initState(imgsCount) {
    return {
        type: consts.SLIDER_INIT_STATE,
        imgsCount: imgsCount
    };
}

export function slide(step) {
    return {
        type: consts.SLIDER_SLIDE,
        step: step,
    };
}