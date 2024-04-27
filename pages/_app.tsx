import "../css/style.css";
import "../css/form.css";
import Link from "next/link";
import type {AppProps} from "next/app";
import {Layout, Menu} from "antd";

const {Header, Content, Footer} = Layout;

const menuItems = [
    {
        key: "home",
        label: (
            <Link href="/" rel="noopener noreferrer">
                Home
            </Link>
        ),
    },
    {
        key: "addHabit",
        label: (
            <Link href="/NewHabit" rel="noopener noreferrer">
                Add Habit
            </Link>
        ),
    },
];

function MyApp({Component, pageProps}: AppProps) {
    let currentYear = new Date().getFullYear();
    return (
        <Layout>
            <Header style={{position: "sticky", top: 0, zIndex: 1, width: "100%"}}>
                <Menu
                    theme="dark"
                    mode="horizontal"
                    defaultSelectedKeys={["home"]}
                    items={menuItems}
                />
            </Header>
            <Content className="site-layout" style={{padding: "0 3%"}}>
                <Component {...pageProps} />
            </Content>
            <Footer style={{textAlign: "center"}}>
                Johannes Ströbele ©{currentYear}, all rights reserved
            </Footer>
        </Layout>
    );
}

export default MyApp;
