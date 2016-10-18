import React from "react";
import Slider from "../Slider/Slider";

// 导入所有轮播图片
import * as imgs from "../../common/img/slider";

export default class MsgCreatePage extends React.Component {
    constructor(props, context) {
        super(props, context);
    }

    render() {
        // 将轮播图片转换成数组
        let imgsArr = [];
        for (var key in imgs) {
            imgsArr.push(imgs[key]);
        }

        // 定义轮播区域高度，内部使用Slider组件实现轮播
        return (
            <div>
                <Slider imgs={imgsArr} options={
                    {
                        height: "130px",
                        width: window.innerWidth,
                        interval: 3500
                    }
                }/>
            </div>
        );
    }
}

MsgCreatePage.contextTypes = {
    router: () => { React.PropTypes.object.isRequired }
};
