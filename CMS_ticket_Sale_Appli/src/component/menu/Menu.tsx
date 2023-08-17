import React from "react";
import img from "../../img/insight.png";

import { Layout, Menu, Row, Col, Dropdown } from "antd";
import { Link } from "react-router-dom";
import {
  HomeIcon,
  SettingIcon,
  TicketIcon,
  TicketListIcon,
} from "../icon/icon";

const { Sider } = Layout;

const MenuLayout: React.FC = () => {
  const menu = (
    <Menu style={{ backgroundColor: "#F1F4F8" }}>
      <Menu.Item >
        <Link to="/DanhsachGoive">Gói dịch vụ</Link>
      </Menu.Item>
    </Menu>
  );

  return (
    <Row>
      <Col span={4}>
        {" "}
        <Sider
          breakpoint="lg"
          collapsedWidth="0"
          style={{ background: "#F1F4F8", minHeight: "100vh" }}
          onBreakpoint={(broken) => {
            console.log(broken);
          }}
          onCollapse={(collapsed, type) => {
            console.log(collapsed, type);
          }}
        >
          <div className="demo-logo-vertical" />
          <img src={img} style={{ objectFit: "cover" }} />
          <Menu
            style={{ background: "#F1F4F8" }}
            mode="inline"
            defaultSelectedKeys={["1"]}
          >
            <Menu.Item key="1" icon={<HomeIcon />}>
              <Link to="/"> Trang chủ</Link>
            </Menu.Item>
            <Menu.Item key="2" icon={<TicketIcon />}>
              <Link to="/DanhsachVe"> Quản lý vé</Link>
            </Menu.Item>
            <Menu.Item key="3" icon={<TicketListIcon />}>
              <Link to="/DoiSoat">Đối soát vé</Link>
            </Menu.Item>

            <Menu.SubMenu key="4" icon={<SettingIcon />} title="Cài đặt">
              {menu}
            </Menu.SubMenu>
          </Menu>
        </Sider>
      </Col>
    </Row>
  );
};

export default MenuLayout;
