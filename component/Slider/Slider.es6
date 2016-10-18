import React from "react";
import $ from "jquery";
import style from "./Slider.css";

// redux相关
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'
import * as actions from "./action";

class Slider extends React.Component {
    constructor(props, context) {
        super(props, context);

        // 整体原则：手势期间禁止定时器发起动画，动画期间禁止手势操作

        // 是否正在手势操作
        this.isTouching = false;

        // 触屏开始和结束位置
        this.startX = 0;
        this.endX = 0;

        // 是否正在动画操作
        this.isAnamating = false;
    }

    // 手势滚动
    moveSlider(step) {
        if (this.props.imgs.length <=1 || this.isAnamating) {
            console.log("动画期间，手势被忽略");
            return;
        }
        // 手势触发滚动
        this.props.slide(step);
    }

    // 接触屏幕
    onTouchStart(ev) {
        // 正在手势操作
        this.isTouching = true;
        // 记录起点
        this.startX = this.endX = ev.touches[0].clientX;
        // 停止自动轮播
        this.stopAuto();
    }

    // 拖拽中
    onTouchMove(ev) {
        this.endX = ev.touches[0].clientX;
        if (!this.isAnamating && this.props.imgs.length > 1) { // 动画期间，手势被屏蔽
            let offset = this.endX - this.startX;
            let curLeft = -1 * (this.props.curIndex * this.props.options.width);
            let newLeft = curLeft + offset;
            //console.log(`${offset} ${curLeft} ${newLeft}`);

            $(this.refs.SliderList).css("left", `${newLeft}px`);
        }
    }

    // 离开屏幕
    onTouchEnd(ev) {
        let offsetX = this.endX - this.startX;
        this.isTouching = false;

        // console.log(offsetX);

        // 向右滑
        if (offsetX > 1) {
            console.log("to right");
            this.moveSlider(-1);
        } else if (offsetX < -1) { // 向左滑
            console.log("to left");
            this.moveSlider(1);
        } else { // 点击跳转
            // 恢复轮播
            this.tryStartAuto();
            console.log("onclick");
        }
    }

    // 启动轮播
    tryStartAuto() {
        // 手势和动画期间，不能启动轮播
        if (this.autoTimer ||
            this.props.imgs.length <=1 ||
            this.isTouching ||
            this.isAnamating) {
            console.log("手势和动画期间，不能启动轮播");
            return;
        }
        this.autoTimer = setInterval(
            () => {
                this.props.slide(1);
            }, this.props.options.interval
        );
        console.log("启动定时器成功");
    }

    // 停止轮播
    stopAuto() {
        if (this.autoTimer) {
            clearInterval(this.autoTimer);
            this.autoTimer = null;
            console.log("停止定时器成功");
        } else {
            console.log("停止定时器，但定时器不存在");
        }
    }

    // 重置组件状态
    resetSlider() {
        this.props.initState(this.props.imgs.length);

        // 取消之前的定时器
        this.stopAuto();

        // 至少2张图片，才能启动轮播
        this.tryStartAuto();
    }

    componentDidMount() {
        this.resetSlider();
    }

    shouldComponentUpdate(nextProps, nextState) {
        // 本次渲染是否因为图片滚动引起
        this.isSliding = nextProps.curIndex != this.props.curIndex;
        // 本次渲染是否因为上层参数变化引起(图片数量或者宽度改变）
        this.paramsChanged =
            nextProps.imgs.length != this.props.imgs.length ||
            nextProps.options.width != this.props.options.width;
        return true;
    }

    componentDidUpdate() {
        // 渲染参数改变，必须重新计算并重置
        if (this.paramsChanged) {
            return this.resetSlider();
        }

        // 非图片滚动引起
        if (!this.isSliding) {
            return;
        }

        // 右侧图片滑入
        if (this.props.step == 1 || this.props.step == -1) {
            // 停止轮播，进行动画，完成后恢复动画
            this.stopAuto();
            this.isAnamating = true;

            $(this.refs.SliderList).animate({
                left: -1 * this.props.curIndex * this.props.options.width,
            }, {
                complete: () => {
                    if (this.props.curIndex == this.props.imgs.length + 1) {
                        this.props.slide(2);
                    } else if (this.props.curIndex == 0) {
                        this.props.slide(-2);
                    }
                    this.isAnamating = false; // 动画完成
                    this.tryStartAuto(); // 恢复轮播
                }
            });
        } else if (this.props.step == 2) {  // 右侧图片穷尽，重置位置到数组头部
            $(this.refs.SliderList).css("left", `${-1 * this.props.options.width}px`);
        } else if (this.props.step == -2) { // 左侧图片穷尽，重置位置到数组尾部
            $(this.refs.SliderList).css("left",
                `${-1 * this.props.imgs.length * this.props.options.width}px`);
        }
    }

    componentWillUnmount() {
        // 销毁前记得销毁定时器
        this.stopAuto();
    }

    render() {
        // 没有图片，那么组件不渲染任何dom
        if (!this.props.imgs.length) {
            return false;
        }

        let wrapStyle = {
            height: this.props.options.height,
            width:this.props.options.width
        };

        let listStyle = {
            left: 0,
        };

        // 至少有2个图片才轮播
        // 一个设计技巧：为了循环滚动的视觉效果，需要为数组头尾增加衔接的图片
        let imgs = [];
        if (this.props.imgs.length > 1) {
            imgs.push(this.props.imgs[this.props.imgs.length - 1]); // 左边放一个尾巴
            imgs = imgs.concat(this.props.imgs);
            imgs.push(this.props.imgs[0]); // 右边放一个头部

            // 跳过衔接图片
            listStyle.left = `${-1 * this.props.options.width}px`;
        } else {
            imgs = this.props.imgs;
        }

        // 图片列表
        let imgBlocks = imgs.map((src, index) => {
            let refName = `IMG_${index}`;
            return (
                <li key={index}>
                    <img
                        src={src}
                        ref={refName}
                        style={wrapStyle}
                    />
                </li>
            );
        });

        // 进度小圆点列表
        let curIndex = this.props.curIndex;
        if (curIndex > 0 && curIndex < this.props.imgs.length + 1) { // 衔接图片index修正
            --curIndex;
        } else if (curIndex == 0) {
            curIndex = this.props.imgs.length - 1; // 头部衔接的最后一张图片
        } else { // 尾部衔接的第一张图片
            curIndex = 0;
        }
        let progBlocks = this.props.imgs.map((src, index) => {
            return (
                <li key={index} className={curIndex == index ? style.Active : undefined}>
                </li>
            );
        });
        // 右浮动的ul在视觉上是相反的，所以数组逆转一下
        progBlocks.reverse();

        return (
            <div id={style.SliderWrapper}
                 ref="SliderWrapper"
                 style={wrapStyle}>
                <ul id={style.SliderList}
                    ref="SliderList"
                    style={listStyle}
                    onTouchStart={this.onTouchStart.bind(this)}
                    onTouchMove={this.onTouchMove.bind(this)}
                    onTouchEnd={this.onTouchEnd.bind(this)}
                >
                    {imgBlocks}
                </ul>
                <ul id={style.SliderProgress}
                    style={{width: this.props.options.width}}
                >
                    {progBlocks}
                </ul>
            </div>
        );
    }
}

Slider.contextTypes = {
    router: () => { React.PropTypes.object.isRequired }
};

// 将redux store里的state映射到本组件的Props上
// 注：这里传来的state是全局store，从而可以共享所有全局状态的访问!
function mapStateToProps(state, ownProps) {
    return {
        curIndex: state.SliderReducer.curIndex,
        step: state.SliderReducer.step,
    };
}

// 将实现的若干action方法映射到本组件的Props上，后续用来实现逻辑，触发redux事件流
function mapDispatchToProps(dispatch) {
    return bindActionCreators(actions, dispatch);
}

//通过react-redux提供的connect方法将我们需要的state中的数据和actions中的方法绑定到props上
export default connect(mapStateToProps, mapDispatchToProps)(Slider);
