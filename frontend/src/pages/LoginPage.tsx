import { useMutation } from "react-query";

import {
  Button,
  Card,
  Flex,
  Form,
  Input,
  Typography,
  notification,
} from "antd";
import { apiUserClient } from "@/server/mutation/user";
import { ExclamationCircleOutlined } from "@ant-design/icons";
import ApiErrorParser from "@/utils/ApiErrorParser";
import { useRouter } from "next/navigation";
import Link from "next/link";
type FieldType = {
  userId?: string;
  password?: string;
  corporateAccountNo?: string;
};

export default function LoginPage() {
  const controller = new AbortController();
  const signal = controller.signal;
  const router = useRouter();
  const [modal, contextHolder] = notification.useNotification();
  const [form] = Form.useForm();

  const mutation = useMutation({
    mutationFn: (data) => {
      return apiUserClient.post("/login", data, { signal });
    },
    onError: (err) => {
      modal.open({
        message: "Error",
        description: new ApiErrorParser(err).toString(),
        icon: <ExclamationCircleOutlined style={{ color: "red" }} />,
      });
    },
    onSuccess: (data) => {
      sessionStorage.setItem(
        "token",
        data.data.type + " " + data.data.access_token
      );
      setTimeout(() => {
        router.push("/home");
      }, 2000);
    },
  });

  return (
    <Flex
      justify={"center"}
      align={"center"}
      style={{
        paddingTop: "20%",
      }}
    >
      {contextHolder}
      <Card
        title={<Flex justify="center">LOGIN PAGE</Flex>}
        hoverable={false}
        style={{
          width: 620,
        }}
      >
        <Form
          name="basic"
          form={form}
          initialValues={{
            corporateAccountNo: "",
            userId: "",
            password: "",
          }}
          onFinish={(values) => {
            mutation.mutate(values);
          }}
        >
          Corporate Account No
          <Form.Item<FieldType>
            name="corporateAccountNo"
            rules={[
              {
                required: true,
                message: "Please input your Corporate Account No!",
              },
            ]}
          >
            <Input type="input" placeholder="Corporate Account No" />
          </Form.Item>
          User ID
          <Form.Item<FieldType>
            name="userId"
            rules={[
              {
                required: true,
                message: "Please input your UserId!",
              },
            ]}
          >
            <Input />
          </Form.Item>
          Password
          <Form.Item<FieldType>
            name="password"
            rules={[{ required: true, message: "Please input your Password!" }]}
          >
            <Input.Password />
          </Form.Item>
          <Form.Item>
            <Button
              loading={mutation.isSuccess}
              style={{
                minWidth: "100%",
                backgroundColor: "#b58900",
              }}
              type="primary"
              htmlType="submit"
            >
              <span
                style={{
                  color: "black",
                  fontWeight: "bolder",
                }}
              >
                Login
              </span>
            </Button>
          </Form.Item>
          <div
            style={{
              justifyContent: "center",
              display: "flex",
            }}
          >
            <Typography>
              Without account ? <Link href={"/register"}>Register Here</Link>
            </Typography>
          </div>
        </Form>
      </Card>
    </Flex>
  );
}
