import { Layout, Menu } from "antd";
import React, { useState } from "react";
import HeaderPage from "./HeaderPage";
import Image from "next/image";
import BNCLogo from "@/assets/bnc-logo.png";
import { useRouter } from "next/navigation";
import { useQuery } from "react-query";
import { apiUserClient } from "@/server/mutation/user";
import Footer from "./Footer";

const { Header, Content, Sider } = Layout;

interface ILayout {
  children: React.ReactNode;
}

const Layouts: React.FC<ILayout> = ({ children }) => {
  const router = useRouter();
  const { data, isSuccess, refetch } = useQuery({
    queryKey: ["me"],
    refetchIntervalInBackground: true,
    refetchInterval: 5000,
    // staleTime: 5 * 1000,
    queryFn: () =>
      apiUserClient
        .get("/me", {
          headers: {
            Authorization: sessionStorage.getItem("token"),
          },
        })
        .catch((err) => {
          if (err.response.status === 401) {
            router.push("/");
          }
          throw err;
        }),
  });

  return (
    <Layout style={{ minHeight: "100vh" }}>
      <Sider collapsed={false}>
        <div
          style={{
            paddingTop: 30,
          }}
        />
        <Image
          src={BNCLogo}
          alt="BNC Logo"
          width={200}
          height={90}
          style={{
            backgroundColor: "#001529",
          }}
        />
        <Menu theme="dark" mode="inline">
          <Menu.Item
            key="1"
            onClick={() => {
              router.push("/home");
            }}
          >
            Home
          </Menu.Item>
          <Menu.Item
            key="2"
            onClick={() => {
              router.push("/home/transfer");
            }}
          >
            Fund Transfer
          </Menu.Item>
          <Menu.Item
            key="3"
            onClick={() => {
              router.push("/home/transaction");
            }}
          >
            Transaction List
          </Menu.Item>
        </Menu>
      </Sider>
      <Layout>
        <Header style={{ padding: 0, background: "transparent" }}>
          <HeaderPage
            user={isSuccess ? data.data : {}}
            refetch={() => refetch()}
          />
        </Header>
        <Content style={{ margin: "0 16px" }}>{children}</Content>
        <Footer />
      </Layout>
    </Layout>
  );
};

export default Layouts;
