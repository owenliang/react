import React from "react";
import {Link} from "react-router";
import $ from "jquery";
import style from "./MsgDetailPage.css";
import ToolBar from "../ToolBar/ToolBar";
import LoadingLayer from "../LoadingLayer/LoadingLayer";

// redux相关
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'
import * as actions from "../../action/MsgDetailPageAction";

class MsgDetailPage extends React.Component {
    constructor(props, context) {
        super(props, context);

        // 在这里先重置上一次阅读留下的state信息
        // action: MSG_DETAIL_PAGE_INIT_STATE
        this.props.initState();
    }

    componentDidMount() {
        // 调整Loading界面高度
        // action: MSG_DETAIL_PAGE_ADJUST_LOADING_HEIGHT
        let ToolBar = $(this.refs.ToolBar.refs.ToolBarContainter);
        this.props.adjustLoadingHeight(window.innerHeight - ToolBar.height());

        // 发起数据加载(setTimeout模拟延迟)
        // action: MSG_DETAIL_PAGE_FETCH_DETAIL
        this.props.fetchDetail(this.props.msgId);
    }

    componentDidUpdate() {
        // 加载完成
        if (!this.props.isLoading) {
            let title = $(this.refs.MsgTitle);
            let container = $(this.refs.MsgContainer);
            let ToolBar = $(this.refs.ToolBar.refs.ToolBarContainter);

            // 上半部分总高度
            let height = title.height() + parseInt(title.css('padding-top')) +
                parseInt(title.css('padding-bottom')) +
                parseInt(container.css("padding-top")) +
                parseInt(container.css("padding-bottom")) +
                parseInt(ToolBar.height());

            // 窗口高度-上半部分总高度作为文章的最小高度
            if (this.props.contentHeight != window.innerHeight - height) { // 如果一样则不要setState避免递归渲染
                // 调整文章部分最小高度
                // action: MSG_DETAIL_PAGE_ADJUST_CONTENT_HEIGHT
                this.props.adjustContentHeight(window.innerHeight - height);
            }
        }
    }

    renderLoading() {
        return (
            <div>
                <ToolBar ref="ToolBar"/>
                <LoadingLayer outerStyle={this.props.outerStyle}/>
            </div>
        );
    }

    renderPage() {
        // refs属性会捕获对应的原生的Dom节点，会在componentDidUpdate中访问Dom来动态计算高度
        return (
            <div>
                <ToolBar ref="ToolBar"/>
                <h1 id={style.MsgTitle} ref="MsgTitle">{this.props.msgTitle}</h1>
                <div id={style.MsgContainer} ref="MsgContainer" style={{minHeight: this.props.contentHeight}}>
                    <p id={style.MsgContent}>{this.props.msgContent}</p>
                </div>
            </div>
        );
    }

    render() {
        if (this.props.isLoading) {
            return this.renderLoading();
        } else {
            return this.renderPage();
        }
    }
}

MsgDetailPage.contextTypes = {
    router: () => { React.PropTypes.object.isRequired }
};

// 将redux store里的state映射到本组件的Props上
// 注：这里传来的state是全局store，从而可以共享所有全局状态的访问!
function mapStateToProps(state, ownProps) {
    console.log(state);
    return {
        msgId: ownProps.params.msgId,   // 访问react-router的参数是可以的
        contentHeight: state.MsgDetailPageReducer.contentHeight,
        isLoading: state.MsgDetailPageReducer.isLoading,
        outerStyle: state.MsgDetailPageReducer.outerStyle,
        msgTitle: state.MsgDetailPageReducer.msgTitle,
        msgContent: state.MsgDetailPageReducer.msgContent,
    };
}

// 将实现的若干action方法映射到本组件的Props上，后续用来实现逻辑，触发redux事件流
function mapDispatchToProps(dispatch) {
    return bindActionCreators(actions, dispatch);
}

//通过react-redux提供的connect方法将我们需要的state中的数据和actions中的方法绑定到props上
export default connect(mapStateToProps, mapDispatchToProps)(MsgDetailPage);