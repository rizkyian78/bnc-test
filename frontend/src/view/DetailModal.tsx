"use client";

import { apiTransactionClient } from "@/server/mutation/api";

import {
  Flex,
  Modal,
  ModalProps,
  Table,
  TableProps,
  Tag,
  Typography,
  Card,
  Skeleton,
} from "antd";
import dayjs from "dayjs";
import { useEffect, useState } from "react";
import { useQuery } from "react-query";

interface IModal {
  props: ModalProps;
  transactionId: string;
  children?: React.ReactNode;
}

interface DataType {
  key: string;
  name: string;
  age: number;
  address: string;
  tags: string;
}

const datas: DataType[] = [
  {
    age: 11,
    address: "asdas",
    key: "1",
    name: "asd",
    tags: "asd",
  },
];

export default function DetailModal({ props, transactionId }: IModal) {
  const [page, setPage] = useState<number>(1);
  const [limit, setLimit] = useState<number>(5);
  const { data, refetch, isLoading, isSuccess } = useQuery({
    queryKey: ["monitor"],
    refetchInterval: 1 * 300000,

    queryFn: () => {
      return apiTransactionClient.get(
        `/${transactionId}/transaction-detail?page=${page}&limit=${limit}`
      );
    },
  });

  useEffect(() => {
    refetch();
  }, [page, limit, transactionId]);

  const transaction =
    data?.data && isSuccess === undefined ? {} : data?.data.transaction;

  const columns: TableProps<DataType>["columns"] = [
    {
      title: "No",
      dataIndex: "id",
    },
    {
      title: "To Account No",
      dataIndex: "toAccount",
    },
    {
      title: "To Account Name",
      dataIndex: "toAccountName",
    },
    {
      title: "To Account Bank",
      dataIndex: "toBankName",
    },
    {
      title: "Transfer Amount",
      render: (value) => <>Rp. {value.transferAmount}</>,
    },
    {
      title: "Status",
      render: () => {
        let color = "geekblue";
        let text = "Awaiting Approval";
        switch (transaction.status) {
          case "approved":
            color = "green";
            text = "Approved";
            break;
          case "rejected":
            color = "volcano";
            text = "Rejected";
            break;
        }
        return <Tag color={color}>{text}</Tag>;
      },
    },
  ];

  return (
    <Modal {...props} width={1000}>
      {isLoading && <Skeleton active />}
      {isSuccess && (
        <>
          <Card
            style={{
              backgroundColor: "rgb(240, 242, 245)",
            }}
          >
            <Flex justify="space-between">
              <Flex vertical gap={"middle"}>
                <Typography.Text>
                  From Account No: <b> {transaction.fromAccount}</b>
                </Typography.Text>
                <Typography.Text>
                  Submit Date and Time:{" "}
                  <b>
                    {dayjs(transaction.created_at).format(
                      "DD MMM YYYY, HH:mm:ss"
                    )}
                  </b>
                </Typography.Text>
                <Typography.Text>
                  Transfer Date:{" "}
                  <b>{dayjs(transaction.created_at).format("DD MMM YYYY")}</b>
                </Typography.Text>
                <Typography.Text>
                  Instruction Type: <b>{transaction.instructionType}</b>
                </Typography.Text>
              </Flex>
              <Flex vertical gap={"middle"}>
                <Typography.Text>
                  Maker: <b>{transaction.fromUser}</b>
                </Typography.Text>
                <Typography.Text>
                  Reference No: <b>{transaction.id}</b>
                </Typography.Text>
                <Typography.Text>
                  Transfer Type: <b>{transaction.transferType}</b>
                </Typography.Text>
              </Flex>
            </Flex>
          </Card>
          <Flex
            justify="flex-start"
            align="flex-start"
            gap={"large"}
            style={{
              marginTop: 30,
            }}
          >
            <Typography.Text>
              Total Transfer Record: <b> {transaction.transferRecord}</b>
            </Typography.Text>
            <Typography.Text>
              Total Amount: <b>Rp. {transaction.transferAmount}</b>
            </Typography.Text>
            <Typography.Text>
              Estimated Service Fee: <b>Rp. 0</b>
            </Typography.Text>
          </Flex>
          <Table
            style={{
              marginTop: 30,
            }}
            columns={columns}
            dataSource={data?.data.data}
            onChange={(e) => {
              setPage(e.current || 0);
              setLimit(e.pageSize || 0);
            }}
            pagination={{
              pageSize: 5,
              total: 5 * data?.data.meta.totalPages,
            }}
          />
        </>
      )}
    </Modal>
  );
}
