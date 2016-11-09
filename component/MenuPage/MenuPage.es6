import React from "react";
import $ from "jquery";
import style from "./MenuPage.css";

export default class MenuPage extends React.Component {
    constructor(props, context) {
        super(props, context);

        this.onMenuClicked = this.onMenuClicked.bind(this);
    }

    onMenuClicked(ev) {
        // 被点击的<h1>
        let node = $(ev.target);

        // 属于<h1>的相邻子菜单列表
        let subMenu = node.next();

        // 显示/隐藏这个列表
        subMenu.css("display", subMenu.css('display') == "none" ? "block" : "none");
    }

    /**
     * 递归生成菜单
     * @param menuObj
     * @returns {Array}
     */
    generateMenu(menuObj) {
        let vdom = [];

        if (menuObj instanceof Array) {
            let list = [];
            for (var item of menuObj) {
                list.push(this.generateMenu(item));
            }
            vdom.push(
                <ul key="single">
                    {list}
                </ul>
            );
        } else {
            vdom.push(
                <li key={menuObj.menuId}>
                    <h1 onClick={this.onMenuClicked}>
                        {menuObj.name}
                    </h1>
                    {this.generateMenu(menuObj.children)}
                </li>
            );
        }
        return vdom;
    }

    render() {
        let data = [
            {
                menuId: 1,
                name: '员工管理',
                children: [
                    {
                        menuId: 3,
                        name: '添加员工',
                        children: []
                    },
                    {
                        menuId: 4,
                        name: '删除员工',
                        children: [
                            {
                                menuId: 6,
                                name: '按姓名删除',
                                children: []
                            },
                            {
                                menuId: 7,
                                name: '按工号删除',
                                children: []
                            }
                        ]
                    }
                ],
            },
            {
                menuId: 2,
                name: '工资管理',
                children: [
                    {
                        menuId: 5,
                        name: '修改工资',
                        children: []
                    }
                ],
            },
        ];

        return (
            <div>
                {this.generateMenu(data)}
            </div>
        );
    }
}

MenuPage.contextTypes = {
    router: () => { React.PropTypes.object.isRequired }
};
