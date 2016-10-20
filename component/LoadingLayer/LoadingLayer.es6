import React from "react";
import $ from "jquery";
import style from "./LoadingLayer.css";
import loadingImg from "../../common/img/LoadingLayer/loading.svg";

export default class LoadingLayer extends React.Component {
    constructor(props, context) {
        super(props, context);
        this.state = {

        };
    }

    render() {
        let outerStyle = this.props.outerStyle ? this.props.outerStyle : {};
        let innerStyle = this.props.innerStyle ? this.props.innerStyle : {};

        return (
            <div id={style.outer} style={outerStyle}>
                <div id={style.inner} style={innerStyle}>
                    <img src={loadingImg}/>
                </div>
            </div>
        );
    }
}

LoadingLayer.contextTypes = {
    router: () => { React.PropTypes.object.isRequired }
};
