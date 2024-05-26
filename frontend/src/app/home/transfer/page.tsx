"use client";

import { PayloadValidate, ResponsePool } from "@/model/model";
import WithUseQuery from "@/hoc/WrapperTanQuery";
import { apiTransactionClient } from "@/server/mutation/api";
import ApiErrorParser from "@/utils/ApiErrorParser";
import UploadComponent from "@/utils/upload";
import LayoutPage from "@/view/Layout";
import {
  ExclamationCircleOutlined,
  VerticalAlignBottomOutlined,
} from "@ant-design/icons";
import {
  Alert,
  Button,
  Card,
  DatePicker,
  Flex,
  Form,
  Input,
  Radio,
  TimePicker,
  Typography,
  UploadProps,
  notification,
} from "antd";
import dayjs from "dayjs";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useMutation } from "react-query";

function Transfer() {
  const [form] = Form.useForm<PayloadValidate>();
  const router = useRouter();
  const [modal, contextHolder] = notification.useNotification();
  const [response, setResponse] = useState<ResponsePool>({
    message: "",
    ok: false,
    transactionId: null,
    totalAmount: 0,
    totalRecord: 0,
  });

  const [type, setType] = useState<string>("immediate");

  const props: UploadProps = {
    name: "file",
    action: `${process.env.NEXT_PUBLIC_API_SERVER}/transactions/upload`,
    headers: {
      //@ts-ignore
      authorization: sessionStorage.getItem("token") as string,
    },
    onChange(info) {
      if (info.file.status === "done") {
        if (!info.file.response.ok) {
          setResponse({
            ok: false,
            message: info.file.response.message,
            transactionId: info.file.response.transactionId,
          });
        } else {
          setResponse({
            ok: true,
            message: info.file.response.message,
            transactionId: info.file.response.transactionId,
            totalAmount: info.file.response.totalAmount,
            totalRecord: info.file.response.totalRecord,
          });
        }
      }
      if (info.file.status === "error") {
        modal.open({
          message: "Error",
          description: "Bad file given",
          icon: <ExclamationCircleOutlined style={{ color: "red" }} />,
        });
      }
    },
  };

  const mutation = useMutation({
    mutationFn: (data: PayloadValidate) => {
      return apiTransactionClient.post("/validate", data);
    },
    onError(error) {
      modal.open({
        message: "Error",
        description: new ApiErrorParser(error).toString(),
        icon: <ExclamationCircleOutlined style={{ color: "red" }} />,
      });
    },
    onSuccess(data) {
      router.push(`/home/transfer/confirmation/${data.data.id}`);
    },
  });

  return (
    <LayoutPage>
      {contextHolder}
      <Card
        style={{
          marginBottom: 20,
        }}
      >
        <Typography.Title level={5}>Create Transaction</Typography.Title>
      </Card>
      <Card
        title={
          <div
            style={{
              textAlign: "center",
              padding: 50,
            }}
          >
            <Typography.Title level={3}>
              Please Enter transfer Information
            </Typography.Title>
          </div>
        }
      >
        <Flex
          justify="center"
          align="center"
          vertical
          style={{ minWidth: "70%" }}
        >
          <Form
            form={form}
            layout="vertical"
            onFinish={(data) => {
              if (data.instructionType === "standingInstruction") {
                data.expiredDate = dayjs(data.expiredDate).format("YYYY-MM-DD");
                data.expiredTime = dayjs(data.expiredTime).format("HH:mm:ss");
                data.transferAmount = Number(response.totalAmount).toFixed(2);
                data.totalRecord = response.totalRecord;
              }
              if (data.instructionType === "immediate") {
                data.transferAmount = Number(data.transferAmount).toFixed(2);
              }
              mutation.mutate({
                ...data,
                transactionId: response.transactionId,
              });
            }}
            initialValues={{
              totalRecord: 0,
              transferAmount: "0.00",
              instructionType: "immediate",
              expiredDate: dayjs(),
              expiredTime: dayjs(),
            }}
          >
            <UploadComponent
              {...props}
              name="file"
              maxCount={1}
              multiple={false}
            />
            <Button
              type="text"
              onClick={async () => {
                const { data } = await apiTransactionClient.get<Blob>("files", {
                  responseType: "blob",
                  headers: {
                    Authorization: sessionStorage.getItem("token"),
                  },
                });

                const url = window.URL.createObjectURL(new Blob([data]));
                const a = document.createElement("a");
                a.href = url;
                a.download = "template.csv";
                document.body.appendChild(a);
                a.click();
                a.remove();
                window.URL.revokeObjectURL(url);
              }}
              style={{ marginRight: "20%", color: "yellowgreen" }}
            >
              <VerticalAlignBottomOutlined
                style={{
                  fontSize: 16,
                  paddingTop: 2,
                  marginRight: 8,
                }}
              />{" "}
              Download template
            </Button>

            {response.message.length > 0 ? (
              <Alert
                message={<>{response.message}</>}
                type={response.ok ? "warning" : "error"}
              />
            ) : null}

            <Form.Item name="instructionType" label="Instruction Type" required>
              <Radio.Group
                defaultValue={type}
                onChange={(e) => setType(e.target.value)}
              >
                <Radio
                  value="immediate"
                  style={{ borderRadius: "0 !important" }}
                >
                  Immediate
                </Radio>
                <Radio value="standingInstruction">Standing Instruction</Radio>
              </Radio.Group>
            </Form.Item>

            {type !== "immediate" ? (
              <>
                <Form.Item
                  name="expiredDate"
                  label="Transfer Date"
                  rules={[
                    {
                      required: type !== "immediate",
                      message: "Please input Date!",
                    },
                  ]}
                >
                  <DatePicker
                    style={{
                      minWidth: "100%",
                    }}
                  />
                </Form.Item>
                <Form.Item
                  name="expiredTime"
                  label="Transfer Time"
                  rules={[
                    {
                      required: type !== "immediate",
                      message: "Please input Time!",
                    },
                  ]}
                >
                  <TimePicker
                    style={{
                      minWidth: "100%",
                    }}
                    defaultOpenValue={dayjs("00:00:00", "HH:mm:ss")}
                  />
                </Form.Item>
              </>
            ) : (
              <>
                <Form.Item
                  name="totalRecord"
                  label="Total Transfer Record"
                  rules={[
                    {
                      required: type === "immediate",
                      message: "Please input Total Record!",
                    },
                  ]}
                >
                  <Input placeholder="0" />
                </Form.Item>
                <Form.Item
                  name="transferAmount"
                  label="Transfer Amount"
                  rules={[
                    {
                      required: type === "immediate",
                      message: "Please input Transfer Amount",
                    },
                  ]}
                >
                  <Input placeholder="0" />
                </Form.Item>
              </>
            )}
            <Form.Item>
              <Button
                style={{
                  backgroundColor: "#CAB74C",
                }}
                htmlType="submit"
                type="primary"
              >
                Next
              </Button>
            </Form.Item>
          </Form>
        </Flex>
      </Card>
    </LayoutPage>
  );
}

export default WithUseQuery(Transfer);
