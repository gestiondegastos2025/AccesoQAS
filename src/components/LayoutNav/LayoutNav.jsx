import React, { useEffect, useState } from "react";
import {
  HomeOutlined,
  FormOutlined,
  FileSearchOutlined,
  UnorderedListOutlined,
  UserOutlined,
  PlusOutlined
} from "@ant-design/icons";
import { Layout, Menu } from "antd";
import { NavLink, Outlet } from "react-router-dom";
import "./LayoutNav.css";
import { sp_api_get_json } from "../../api/sp_api_json";
import Config from "../../configEnv.js";

const { Header, Content, Footer } = Layout;
const { SubMenu } = Menu;

function LayoutNav() {
  const [current, setCurrent] = useState("form");
  const [currentUserName, setCurrentUserName] = useState("");
  const [currentUserEmail, setCurrentUserEmail] = useState("");
  const [userProfileImage, setUserProfileImage] = useState("");
  const [isMobile, setIsMobile] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    async function getCurrentUser() {
      try {
        const json = await sp_api_get_json(Config.winLocationRefLink+"/_api/web/CurrentUser");
        console.log("jsonCurrentUser: " + json);
        setCurrentUserName(json.Title);
        setCurrentUserEmail(json.Email);

        const imagenPerfilURL =
          "https://universidaduandes.sharepoint.com/_layouts/15/userphoto.aspx?size=S&accountname=" +
          encodeURIComponent(json.Email);
        setUserProfileImage(imagenPerfilURL);

      } catch (error) {
        console.log("Error", error);
      }
    }
    getCurrentUser();

    setIsMobile(window.innerWidth <= 768);
  }, [currentUserEmail]);

  const onClick = (e) => {
    setCurrent(e.key);
  };

  const renderUserProfile = () => {
    const userNameDisplay = `Bienvenido, ${currentUserName}`;

    // Renderizar la imagen de perfil junto con el mensaje de bienvenida si la URL de la imagen está disponible
    if (userProfileImage && !isMobile) {
      return (
        <Menu.Item disabled style={{ marginLeft: "auto", marginRight: "2px" }}>
          <span className="ant-menu-title-content user-profile-container">
            <span style={{ color: "yellow" }}>{userNameDisplay}</span>
            <img
              src={userProfileImage} // URL de la imagen de perfil del usuario
              alt="Imagen de perfil"
              style={{
                width: "40px",
                height: "40px",
                borderRadius: "50%",
                marginRight: "4px",
                marginLeft: "1px",
                marginTop: "-5px",
              }}
            />
          </span>
        </Menu.Item>
      );
    } else {
      return null;
    }
  };

  const currentYear = new Date().getFullYear();

  return (
    <Layout style={{ minHeight: "98vh" }}>
      <Header className="menu-horizontal">
        <div className="demo-logo-vertical" />
        {/* eslint-disable-next-line */}
        <a href="#/" className="logoUandes"></a>
        <Menu
          theme="dark"
          onClick={onClick}
          selectedKeys={[current]}
          mode="horizontal"
        >
          <Menu.Item key="1" icon={<HomeOutlined />}>
            <NavLink to="/">Inicio</NavLink>
          </Menu.Item>
          <Menu.Item
            key="2"
            icon={<FormOutlined style={{ marginRight: "2px" }} />}
          >
            <NavLink to="/formMesaDeAyudaSAPS4HANA">Crear Ticket</NavLink>
          </Menu.Item>
          <Menu.Item key="4" icon={<FileSearchOutlined />}>
            <NavLink to="/misTickets">Mis Tickets</NavLink>
          </Menu.Item>
          <Menu.Item key="5" icon={<UnorderedListOutlined />}>
            <NavLink to="/listTickets">Gestión de Key User</NavLink>
          </Menu.Item>
          <Menu.Item key="6" icon={<PlusOutlined />}>
            <NavLink to="/acceso-qas">Acceso QAS</NavLink>
          </Menu.Item>
          {renderUserProfile()}
        </Menu>
      </Header>

      <Layout>
        <Content
          style={{
            margin: "24px 16px 0",
          }}
        >
          <div
            style={{
              padding: 24,
              minHeight: 360,
            }}
          >
            <Outlet />
          </div>
        </Content>
        <Footer
          style={{
            textAlign: "center",
          }}
        >
          Universidad de los Andes ©{currentYear} Dirección de TI
        </Footer>
      </Layout>
    </Layout>
  );
}

export default LayoutNav;
