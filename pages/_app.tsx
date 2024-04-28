import "../css/style.css";
import "../css/form.css";
import Link from "next/link";
import type {AppProps} from "next/app";
import {Layout, Menu} from "antd";
import {useRouter} from "next/router";
import {useEffect, useState} from "react";
import {homePath, newHabitPath} from "../shared/constants";

const {Header, Content, Footer} = Layout;

const menuItems = [
    {
        key: homePath,
        label: (
            <Link href={homePath} rel="noopener noreferrer">
                Home
            </Link>
        ),
    },
    {
        key: newHabitPath,
        label: (
            <Link href={newHabitPath} rel="noopener noreferrer">
                Add Habit
            </Link>
        ),
    },
];

function MyApp({Component, pageProps}: AppProps) {
    let currentYear = new Date().getFullYear();
    const router = useRouter();
    const [activeKey, setActiveKey] = useState<string>(router.pathname.slice(1));

    useEffect(() => {
        const handleRouteChange = (route: string) => setActiveKey(route);
        return () => router.events.off('routeChangeComplete', handleRouteChange);
    }, [router]);


    return (
        <Layout>
            <Header style={{position: "sticky", top: 0, zIndex: 1, width: "100%"}}>
                {/*TODO currently, Menu leads to this warning "findDOMNode is deprecated and will be removed in the next major release"
                    this problem cannot be solved due to the current Antd version not compatible with React in strict mode */}
                <Menu
                    theme="dark"
                    mode="horizontal"
                    defaultSelectedKeys={activeKey ? [activeKey] : [homePath]}
                    items={menuItems}
                    selectedKeys={[activeKey]}
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
