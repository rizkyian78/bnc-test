"use client";

import {
  Button,
  Card,
  DatePicker,
  Flex,
  Form,
  Input,
  Select,
  Table,
  TableProps,
  Tag,
  Typography,
} from "antd";
import LayoutPage from "@/view/Layout";
import { useQuery } from "react-query";
import { apiTransactionClient } from "@/server/mutation/api";
import dayjs from "dayjs";
import { useEffect, useState } from "react";
import { EyeOutlined, RedoOutlined, SearchOutlined } from "@ant-design/icons";
import DetailModal from "@/view/DetailModal";
import WithUseQuery from "@/hoc/WrapperTanQuery";
interface DataType {
  key: string;
  name: string;
  age: number;
  address: string;
  tags: string[];
}

function Transaction() {
  const [page, setPage] = useState<number>(1);
  const [limit, setLimit] = useState<number>(10);
  const [open, setOpen] = useState(false);
  const [transactionId, setTransactionId] = useState("");
  const [filter, setFilter] = useState({});

  const [form] = Form.useForm();

  const { data, refetch } = useQuery({
    queryKey: ["transactions"],
    refetchIntervalInBackground: true,
    refetchInterval: 1 * 6000,
    queryFn: () =>
      apiTransactionClient.get(
        `?page=${page}&limit=${limit}&where=${JSON.stringify(filter)}`
      ),
  });

  useEffect(() => {
    refetch();
  }, [page, limit, filter, refetch]);

  const datas = data?.data === undefined ? [] : data?.data.data;

  const handleOk = () => {
    setOpen(false);
  };

  const handleCancel = () => {
    setOpen(false);
  };

  const columns: TableProps<DataType>["columns"] = [
    {
      title: "Reference No",
      dataIndex: "id",
      render: (text) => <Typography.Text strong>{text}</Typography.Text>,
    },
    {
      title: "Total Transfer Amount",
      // dataIndex: "age",
      render: (value) => <>Rp. {value.transferAmount}</>,
    },
    {
      title: "Total Transfer Record",
      dataIndex: "transferRecord",
    },
    {
      title: "From Account No",
      dataIndex: "fromAccount",
    },
    {
      title: "Maker",
      dataIndex: "fromUser",
    },
    {
      title: "Transfer Date",
      render: (value) => <>{dayjs(value.created_at).format("DD-MM-YYYY")}</>,
    },
    {
      title: "Status",
      render: (value) => {
        let color = "geekblue";
        switch (value.status) {
          case "approved":
            color = "green";
            break;
          case "rejected":
            color = "volcano";
            break;
        }
        return <Tag color={color}>{value.status.toUpperCase()}</Tag>;
      },
    },

    {
      title: "Action",
      key: "action",
      fixed: "right",
      render: (value) => {
        return (
          <Button
            onClick={() => {
              setTransactionId(value.id);
              setOpen(true);
            }}
            icon={<EyeOutlined />}
          >
            Detail
          </Button>
        );
      },
    },
  ];

  return (
    <LayoutPage>
      {transactionId.length > 0 && open && (
        <DetailModal
          props={{
            closable: false,
            open,
            onOk: () => {
              handleOk();
            },
            onCancel: () => {
              handleCancel();
            },
          }}
          transactionId={transactionId}
        />
      )}

      <Card
        style={{
          marginBottom: 20,
        }}
      >
        Transaction Detail
      </Card>

      <Card
        style={{
          marginTop: 50,
        }}
      >
        <Form
          layout="vertical"
          form={form}
          initialValues={{
            status: "",
            date: [],
            fromAccountNo: "",
          }}
          onFinish={(data) => {
            setFilter({
              startDate: data.date[0],
              endDate: data.date[1],
              ...data,
            });
            setPage(0);
            setLimit(0);
          }}
        >
          <Flex gap="large" justify="space-between" align="center">
            <Form.Item label="Submit Date And Time" name={"date"}>
              <DatePicker.RangePicker
                style={{
                  minWidth: 500,
                }}
                renderExtraFooter={() => "extra footer"}
              />
            </Form.Item>

            <Form.Item label="From Account No" name={"fromAccountNo"}>
              <Input
                style={{
                  minWidth: 500,
                }}
              />
            </Form.Item>

            <Form.Item label="Status" name={"status"}>
              <Select
                style={{
                  minWidth: 500,
                }}
                options={[
                  { value: "approved", label: "Approved" },
                  { value: "rejected", label: "Rejected" },
                  { value: "pending", label: "Awaiting Approval" },
                ]}
              />
            </Form.Item>
          </Flex>
          <Flex
            justify="flex-end"
            align="end"
            gap={"large"}
            style={{
              marginBottom: 30,
            }}
          >
            <Button
              style={{
                backgroundColor: "#CAB74C",
              }}
              htmlType="submit"
              type="primary"
              icon={<SearchOutlined />}
            >
              Search
            </Button>
            <Button
              style={{
                backgroundColor: "#CAB74C",
              }}
              htmlType="reset"
              type="primary"
              icon={<RedoOutlined />}
            >
              Reset
            </Button>
          </Flex>
        </Form>
        <Table
          columns={columns}
          dataSource={datas}
          onChange={(e) => {
            setPage(e.current || 0);
            setLimit(e.pageSize || 0);
          }}
          pagination={{
            current: page,
            pageSize: 10,
            total: 10 * data?.data.meta.totalPages,
          }}
          scroll={{ y: 500 }}
        />
      </Card>
    </LayoutPage>
  );
}

export default WithUseQuery(Transaction);
