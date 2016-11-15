import React from "react";
import {Link} from "react-router";
import $ from "jquery";
import style from "./MsgListPage.css";
import iScroll from "iscroll/build/iscroll-probe"; // 只有这个库支持onScroll,从而支持bounce阶段的事件捕捉
import LoadingLayer from "../LoadingLayer/LoadingLayer";
import loadingImg from "../../common/img/LoadingLayer/loading.svg";

// redux相关
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'
import * as actions from "../../action/MsgListPageAction";

class MsgListPage extends React.Component {
    constructor(props, context) {
        super(props, context);

        this.itemsChanged = false;  // 本次渲染是否发生了文章列表变化，决定iscroll的refresh调用
        this.isTouching = false; // 是否在触屏中

        // 下拉状态文案
        this.pullDownTips = {
            0: '下拉发起刷新',
            1: '继续下拉刷新',
            2: '松手即可刷新',
            3: '正在刷新',
            4: '刷新成功',
            5: '刷新失败'
        };
        // 上拉状态文案
        this.pullUpTips = {
            0: '上拉发起加载',
            1: '松手即可加载',
            2: '正在加载',
            3: '加载成功',
            4: '加载失败'
        };

        // 点击文章跳转处理
        this.onItemClicked = this.onItemClicked.bind(this);

        // iscroll的事件函数
        this.onScroll = this.onScroll.bind(this);   // 滚动中回调
        this.onScrollEnd = this.onScrollEnd.bind(this); // 滚动结束回调

        // 触屏事件
        this.onTouchStart = this.onTouchStart.bind(this);
        this.onTouchEnd = this.onTouchEnd.bind(this);
    }

    componentWillMount() {
        // 尝试加载备份的数据
        // action: MSG_LIST_PAGE_TRY_RESTORE_COMPONENT
        this.props.tryRestoreComponent();
    }

    /**
     * 加载完成后初始化一次iscroll
     */
    ensureIScrollInstalled() {
        if (this.iScrollInstance) {
            return this.iScrollInstance;
        }
        const options = {
            // 默认iscroll会拦截元素的默认事件处理函数，我们需要响应onClick，因此要配置
            preventDefault: false,
            // 禁止缩放
            zoom: false,
            // 支持鼠标事件，因为我开发是PC鼠标模拟的
            mouseWheel: true,
            // 滚动事件的探测灵敏度，1-3，越高越灵敏，兼容性越好，性能越差
            probeType: 3,
            // 拖拽超过上下界后出现弹射动画效果，用于实现下拉/上拉刷新
            bounce: true,
            // 展示滚动条
            scrollbars: true,
        };
        this.iScrollInstance = new iScroll(`#${style.ListOutsite}`, options);
        this.iScrollInstance.on('scroll', this.onScroll);
        this.iScrollInstance.on('scrollEnd', this.onScrollEnd);
        this.iScrollInstance.refresh();
        return this.iScrollInstance;
    }

    /**
     * react组件第一次加载调用
     */
    componentDidMount() {
        // 首次进入列表页，那么异步加载数据
        if (this.props.loadingStatus == 1) {
            this.props.beginRefresh();
        } else {
            this.ensureIScrollInstalled();
            // 非首次进入，那么恢复滚动条的位置 (如果离开页面时处于下拉位置, 那么进行修正)
            let y = this.props.y;
            if (y > -1 * $(this.refs.PullDown).height()) {
                y = -1 * $(this.refs.PullDown).height();
            }
            this.iScrollInstance.scrollTo(0, y);
        }
    }

    /**
     * 点击跳转详情页
     */
    onItemClicked(ev) {
        // 获取对应的DOM节点, 转换成jquery对象
        let item = $(ev.target);
        // 操作router实现页面切换
        this.context.router.push(item.attr('to'));
        this.context.router.goForward();
    }

    onTouchStart(ev) {
        this.isTouching = true;
    }

    onTouchEnd(ev) {
        this.isTouching = false;
    }

    onPullDown() {
        // 手势
        if (this.isTouching) {
            if (this.iScrollInstance.y > 5) {
                this.props.updatePullDownStatus(2);
            } else {
                this.props.updatePullDownStatus(1);
            }
        }
    }

    onPullUp() {
        // 手势
        if (this.isTouching) {
            if (this.iScrollInstance.y <= this.iScrollInstance.maxScrollY - 5) {
                this.props.updatePullUpStatus(1);
            } else {
                this.props.updatePullUpStatus(0);
            }
        }
    }

    onScroll() {
        let pullDown = $(this.refs.PullDown);

        // 上拉区域
        if (this.iScrollInstance.y > -1 * pullDown.height()) {
            this.onPullDown();
        } else {
            this.props.updatePullDownStatus(0);
        }

        // 下拉区域
        if (this.iScrollInstance.y <= this.iScrollInstance.maxScrollY + 5) {
            this.onPullUp();
        } else {
            this.props.updatePullUpStatus(0);
        }
    }

    onScrollEnd() {
        //console.log("onScrollEnd" + this.props.pullDownStatus);

        let pullDown = $(this.refs.PullDown);

        // 滑动结束后，停在刷新区域
        if (this.iScrollInstance.y > -1 * pullDown.height()) {
            if (this.props.pullDownStatus <= 1) {   // 没有发起刷新,那么弹回去
                this.iScrollInstance.scrollTo(0, -1 * $(this.refs.PullDown).height(), 200);
            } else if (this.props.pullDownStatus == 2) { // 发起了刷新,那么更新状态
                this.props.beginRefresh();
            }
        }

        // 滑动结束后，停在加载区域
        if (this.iScrollInstance.y <= this.iScrollInstance.maxScrollY) {
            if (this.props.pullUpStatus == 1) { // 发起了加载，那么更新状态
                this.props.beginLoad();
            }
        }
    }

    shouldComponentUpdate(nextProps, nextState) {
        // 列表对象变化，或者内容变化
        this.itemsChanged = nextProps.items !== this.props.items;
        return true;
    }

    componentDidUpdate() {
        // 加载屏结束,才可以初始化iscroll
        if (this.props.loadingStatus == 2) {
            this.ensureIScrollInstalled();
            // 当列表发生了变更 ，才调用iscroll的refresh重新计算滚动条信息
            if (this.itemsChanged) {
                this.iScrollInstance.refresh();
                // 此前是刷新操作，需要回弹
                if (this.props.pullDownStatus == 4 || this.props.pullDownStatus == 5) {
                    this.iScrollInstance.scrollTo(0, -1 * $(this.refs.PullDown).height(), 500);
                }
            }
        }
        return true;
    }

    componentWillUnmount() {
        if (this.props.loadingStatus == 2) {    // 首屏成功刷出，则备份y
            this.props.backupIScrollY(this.iScrollInstance.y);
        }
    }

    // retry if loading failed
    onRetryLoading() {
        console.log("retry loading");
        this.props.updateLoadingStatus(1); // 恢复loading界面
        this.props.beginRefresh(); // 发起数据刷新
    }

    renderLoading() {
        let outerStyle = {
            height: window.innerHeight,
        };
        return (
            <div>
                <LoadingLayer
                    outerStyle={outerStyle}
                    onRetry={this.onRetryLoading.bind(this)}
                    loadingStatus={this.props.loadingStatus}
                />
            </div>
        );
    }

    renderPage() {
        let lis = this.props.items.map((item, index) => {
            return (
                <li key={index} to={`/msg-detail-page/${index}`} onClick={this.onItemClicked}>
                    {item.title}{index}
                </li>
            );
        });

        // 外层容器要固定高度，才能使用滚动条
        return (
            <div>
                <div id={style.ListOutsite} style={{height: window.innerHeight}}
                     onTouchStart={this.onTouchStart} onTouchEnd={this.onTouchEnd}>
                    <ul id={style.ListInside}>
                        <p ref="PullDown" id={style.PullDown}>{this.pullDownTips[this.props.pullDownStatus]}</p>
                        {lis}
                        <p ref="PullUp" id={style.PullUp}>{this.pullUpTips[this.props.pullUpStatus]}</p>
                    </ul>
                </div>
            </div>
        );
    }

    render() {
        // 首屏没有加载成功，那么均展示loading效果
        if (this.props.loadingStatus != 2) {
            return this.renderLoading();
        } else {
            return this.renderPage();
        }
    }
}

MsgListPage.contextTypes = {
    router: () => { React.PropTypes.object.isRequired },
};

// 将redux store里的state映射到本组件的Props上
// 注：这里传来的state是全局store，从而可以共享所有全局状态的访问!
function mapStateToProps(state, ownProps) {
    return {
        items: state.MsgListPageReducer.items,
        pullDownStatus: state.MsgListPageReducer.pullDownStatus,  // 下拉状态
        pullUpStatus: state.MsgListPageReducer.pullUpStatus,    // 上拉状态
        loadingStatus: state.MsgListPageReducer.loadingStatus,   // 首屏加载状态
        page: state.MsgListPageReducer.page,
        y: state.MsgListPageReducer.y,
    };
}

// 将实现的若干action方法映射到本组件的Props上，后续用来实现逻辑，触发redux事件流
function mapDispatchToProps(dispatch) {
    return bindActionCreators(actions, dispatch);
}

//通过react-redux提供的connect方法将我们需要的state中的数据和actions中的方法绑定到props上
export default connect(mapStateToProps, mapDispatchToProps)(MsgListPage);