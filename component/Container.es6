import React from "react";

export default class Container extends React.Component {
    constructor(props, context) {
        super(props, context);
    }

    componentWillMount() {
        document.body.style.margin = "0px";
        // 这是防止页面被拖拽
        document.body.addEventListener('touchmove', (ev) => {
            ev.preventDefault();
        });
    }

    render() {
        return (
            <div id="reactContainer">
                {
                    this.props.children
                }
            </div>
        );
    }
}
