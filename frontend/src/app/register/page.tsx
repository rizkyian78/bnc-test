"use client";

import WithUseQuery from "@/hoc/WrapperTanQuery";
import { apiUserClient } from "@/server/mutation/api";
import { Button, Card, Flex, Form, Input, Select, message } from "antd";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useMutation } from "react-query";
import { RegisterRequest } from "../../model/model";

function Register() {
  const router = useRouter();
  const [form] = Form.useForm<RegisterRequest>();
  const [messageApi, contextHolder] = message.useMessage();

  const emailWatch = Form.useWatch("email", form);
  const mutationOtp = useMutation({
    mutationKey: ["otp"],
    mutationFn: (data) => {
      return apiUserClient.post("/validate", data);
    },
  });

  const mutationRegister = useMutation({
    mutationKey: ["register"],
    mutationFn: (data) => {
      return apiUserClient.post("/submit", data);
    },
  });

  const success = (email: string) => {
    messageApi.open({
      type: "success",
      content: `Success send email to ${email}`,
    });
  };

  return (
    <Flex
      justify="center"
      align="center"
      vertical
      style={{
        marginTop: "5%",
      }}
    >
      {contextHolder}

      <Card
        title="REGISTER"
        style={{
          width: 620,
        }}
      >
        <Form
          form={form}
          name="trigger"
          layout="vertical"
          autoComplete="off"
          initialValues={{}}
          onFinish={(data) => {
            const formData = {
              ...data,
              phoneNo: "+62" + data.phoneNo,
            };
            //@ts-ignore
            mutationRegister.mutate(formData, {
              onSuccess(data, variables, context) {
                router.push("/");
              },
            });
          }}
        >
          <Form.Item
            label="Corporate Account No"
            name="corporateAccountNo"
            rules={[
              { required: true, message: "Please Input Corporate Account No" },
            ]}
          >
            <Input />
          </Form.Item>

          <Form.Item
            label="Corporate Name"
            name="corporateName"
            rules={[{ required: true, message: "Please Input Corporate Name" }]}
          >
            <Input />
          </Form.Item>

          <Form.Item
            label="User ID"
            name="userId"
            rules={[{ required: true, message: "Please Input User ID" }]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            label="User Name"
            name="userName"
            rules={[{ required: true, message: "Please Input User Name" }]}
          >
            <Input />
          </Form.Item>

          <Form.Item
            name="role"
            label="Role"
            rules={[{ required: true, message: "Please Select Role" }]}
          >
            <Select placeholder="Approver">
              <Select.Option value="maker">Maker</Select.Option>
              <Select.Option value="approver">Approver</Select.Option>
            </Select>
          </Form.Item>

          <Form.Item
            name="phoneNo"
            label="Phone Number"
            rules={[
              {
                required: true,
                message: "Please input your phone number!",
                pattern: /^[0-9]+$/,
              },
            ]}
          >
            <Input addonBefore={"+62"} style={{ width: "100%" }} />
          </Form.Item>

          <Form.Item
            label="Email"
            name="email"
            rules={[
              { required: true, message: "Please Proper Email", type: "email" },
            ]}
          >
            <Input />
          </Form.Item>

          <Form.Item
            label="Password"
            name="password"
            rules={[{ required: true, message: "Please input password" }]}
          >
            <Input.Password />
          </Form.Item>

          <Form.Item
            label="OTP"
            name="verificationOTP"
            rules={[{ required: true, message: "Please Input OTP" }]}
          >
            <Input
              addonAfter={
                <a
                  onClick={() => {
                    mutationOtp.mutate(
                      //@ts-ignore
                      { email: emailWatch },
                      {
                        onSuccess() {
                          success(emailWatch);
                        },
                      }
                    );
                  }}
                >
                  SEND OTP
                </a>
              }
            />
          </Form.Item>
          <Form.Item>
            <Button
              type="primary"
              htmlType="submit"
              style={{
                minWidth: "100%",
                backgroundColor: "#CAB74C",
              }}
            >
              Submit
            </Button>
          </Form.Item>
        </Form>
        Already have an account ? <Link href={"/"}>Login Now </Link>
      </Card>
    </Flex>
  );
}

export default WithUseQuery(Register);
