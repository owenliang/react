import React from "react";
import {Link} from "react-router";
import $ from "jquery";
import backImg from "./back.png";
import style from "./ToolBar.css";

export default class ToolBar extends React.Component {
    constructor(props, context) {
        super(props, context);
        this.state = {
        };
    }

    render() {
        return (
            <div id={style.ToolBarContainter} ref="ToolBarContainter">
                <img id={style.BackImg} src={backImg} onClick={this.context.router.goBack}/>
            </div>
        );
    }
}

ToolBar.contextTypes = {
    router: () => { React.PropTypes.object.isRequired }
};
