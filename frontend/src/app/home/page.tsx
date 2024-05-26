"use client";

import {
  Button,
  Card,
  Flex,
  Space,
  Table,
  TableProps,
  Tag,
  Typography,
} from "antd";
import LayoutPage from "@/view/Layout";
import { useMutation, useQuery } from "react-query";
import { apiTransactionClient, apiUserClient } from "@/server/mutation/user";
import dayjs from "dayjs";
import { useEffect, useState } from "react";
import {
  CheckCircleOutlined,
  CloseCircleOutlined,
  EyeOutlined,
} from "@ant-design/icons";
import DetailModal from "@/view/DetailModal";
import WithUseQuery from "@/hoc/WrapperTanQuery";
import {
  MeResponse,
  MonitorResponse,
  PayloadApproval,
  Transaction,
} from "@/model/model";

function Home() {
  const [page, setPage] = useState<number>(1);
  const [limit, setLimit] = useState<number>(10);
  const [open, setOpen] = useState(false);
  const [transactionId, setTransactionId] = useState("");

  const { data, refetch } = useQuery({
    queryKey: ["monitor-transaction"],
    refetchIntervalInBackground: true,
    queryFn: () =>
      apiTransactionClient.get<MonitorResponse>(
        `/monitor?page=${page}&limit=${limit}`
      ),
  });

  const { data: user } = useQuery({
    queryKey: ["me"],
    refetchIntervalInBackground: true,
    refetchInterval: 5000,
    queryFn: () =>
      apiUserClient
        .get<MeResponse>("/me", {
          headers: {
            Authorization: sessionStorage.getItem("token"),
          },
        })
        .catch((err) => {
          throw err;
        }),
  });

  const mutation = useMutation({
    mutationFn: (data: PayloadApproval) => {
      return apiTransactionClient.patch(
        `/${data.id}`,
        {
          status: data.status,
        },
        {
          headers: {
            Authorization: sessionStorage.getItem("token"),
          },
        }
      );
    },

    onSuccess: () => {
      refetch();
    },
  });

  useEffect(() => {
    refetch();
  }, [page, limit]);

  const datas = data?.data === undefined ? [] : data?.data.data;
  const status = data?.data.status;

  const approved = status && status.find((v) => v.status === "approved");
  const rejected = status && status.find((v) => v.status === "rejected");
  const pending = status && status.find((v) => v.status === "pending");

  const handleOk = () => {
    setOpen(false);
  };

  const handleCancel = () => {
    setOpen(false);
  };

  const columns: TableProps<Transaction>["columns"] = [
    {
      title: "Reference No",
      dataIndex: "id",
      width: 400,
      render: (text) => <Typography.Text strong>{text}</Typography.Text>,
    },
    {
      title: "Total Transfer Amount",
      width: 200,
      render: (value) => <>Rp. {value.transferAmount}</>,
    },
    {
      title: "Total Transfer Record",
      width: 200,
      dataIndex: "transferRecord",
    },
    {
      title: "From Account No",
      width: 200,
      dataIndex: "fromAccount",
    },
    {
      title: "Maker",
      width: 200,
      dataIndex: "fromUser",
    },
    {
      title: "Transfer Date",
      width: 200,
      render: (value) => <>{dayjs(value.created_at).format("DD-MM-YYYY")}</>,
    },
    {
      title: "Status",
      width: 200,
      fixed: "right",
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
      width: 400,
      // responsive:
      render: (value) => {
        if (
          user?.data.role === "maker" ||
          ["approved", "rejected"].includes(value.status)
        ) {
          return (
            <Space>
              <Button
                onClick={() => {
                  setTransactionId(value.id);
                  setOpen(true);
                }}
                icon={<EyeOutlined />}
              >
                Detail
              </Button>
            </Space>
          );
        }
        if (user?.data.role === "approver") {
          return (
            <Space size="middle">
              <Button
                icon={<CheckCircleOutlined />}
                onClick={() => {
                  mutation.mutate({ id: value.id, status: "approved" });
                }}
              >
                Approve
              </Button>
              <Button
                icon={<CloseCircleOutlined />}
                onClick={() => {
                  mutation.mutate({ id: value.id, status: "rejected" });
                }}
              >
                Reject
              </Button>
              <Button
                onClick={() => {
                  setTransactionId(value.id);
                  setOpen(true);
                }}
                icon={<EyeOutlined />}
              >
                Detail
              </Button>
            </Space>
          );
        }
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
        Login last time:{" "}
        <span
          style={{
            fontWeight: "bold",
          }}
        >
          {user?.data.loginTime}
        </span>
      </Card>
      <Card>
        <Card title="Transaction Overview">
          <Flex justify="space-evenly">
            <Card
              style={{
                fontWeight: "bold",
                backgroundColor: "rgb(240, 242, 245)",
                width: 500,
              }}
            >
              Awaiting Approval
              <Typography.Title
                style={{
                  color: "orangered",
                }}
              >
                {pending ? pending.count : 0}
              </Typography.Title>
            </Card>
            <Card
              style={{
                backgroundColor: "rgb(240, 242, 245)",
                fontWeight: "bold",
                width: 500,
              }}
            >
              Approved
              <Typography.Title
                style={{
                  color: "green",
                }}
              >
                {approved ? approved.count : 0}
              </Typography.Title>
            </Card>
            <Card
              style={{
                fontWeight: "bold",
                backgroundColor: "rgb(240, 242, 245)",
                width: 500,
              }}
            >
              Rejected
              <Typography.Title
                style={{
                  color: "red",
                }}
              >
                {rejected ? rejected.count : 0}
              </Typography.Title>
            </Card>
          </Flex>
        </Card>

        <Table
          columns={columns}
          dataSource={datas}
          onChange={(e) => {
            setPage(e.current || 0);
            setLimit(e.pageSize || 0);
          }}
          pagination={{
            pageSize: 10,
            //@ts-ignore
            total: 10 * data?.data.meta.totalPages,
          }}
          scroll={{ y: 500 }}
        />
      </Card>
    </LayoutPage>
  );
}

export default WithUseQuery(Home);
