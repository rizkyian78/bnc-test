"use client";

import { MeResponse } from "@/model/model";
import { UserOutlined } from "@ant-design/icons";
import { Flex, Button, Switch } from "antd";

interface IHeader {
  user: MeResponse;
  refetch: () => void;
}

export default function HeaderPage({ user, refetch }: IHeader) {
  return (
    <>
      <Flex justify={"flex-end"}>
        <Flex
          justify="center"
          style={{
            paddingTop: "1%",
            marginRight: "3%",
          }}
        >
          <Button
            type="text"
            icon={<UserOutlined />}
            style={{
              marginRight: 20,
            }}
          >
            [{user.userName}]
          </Button>
          <Button
            type="text"
            style={{
              marginRight: 20,
            }}
            onClick={() => {
              sessionStorage.removeItem("token");
              refetch();
            }}
          >
            Logout
          </Button>
          <Switch
            style={{
              // width: 200,
              marginTop: 5,
            }}
            // checked={language === "id"}
            // onChange={handleLanguageChange}
            checkedChildren={<>English</>}
            unCheckedChildren={<>Indonesia</>}
          />
        </Flex>
      </Flex>
    </>
  );
}
