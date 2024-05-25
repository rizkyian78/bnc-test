"use client";

import { Transaction } from "@/model/model";
import WithUseQuery from "@/hoc/WrapperTanQuery";
import { apiTransactionClient } from "@/server/mutation/user";
import LayoutPage from "@/view/Layout";
import { Button, Card, Divider, Flex, Typography } from "antd";
import { useParams, useRouter } from "next/navigation";
import { useMutation, useQuery } from "react-query";

function ConfirmationPage() {
  const router = useRouter();
  const param = useParams();

  const { data } = useQuery({
    queryKey: ["confirmation"],

    queryFn: () => {
      return apiTransactionClient.get<Transaction>(`/${param?.id}`, {
        headers: {
          Authorization: sessionStorage.getItem("token"),
        },
      });
    },
  });

  const mutation = useMutation({
    mutationKey: ["confirmation"],
    mutationFn: (data) => {
      return apiTransactionClient.post("/confirm", data);
    },
  });

  return (
    <LayoutPage>
      <Card
        style={{
          marginBottom: 20,
        }}
      >
        <Typography.Title level={5}>Confirmation Page</Typography.Title>
      </Card>
      <Card
        style={{
          marginBottom: 20,
          paddingBottom: "40%",
        }}
      >
        <Card
          style={{
            marginBottom: 20,
            backgroundColor: "rgb(240, 242, 245)",
            // paddingBottom: ,
          }}
        >
          <Typography.Text
            strong
            style={{
              color: "GrayText",
            }}
          >
            Total Transfer Record:{" "}
            <span
              style={{
                color: "black",
              }}
            >
              {" "}
              {data?.data.transferRecord}{" "}
            </span>
          </Typography.Text>{" "}
          <br />
          <br />
          <Typography.Text
            strong
            style={{
              color: "GrayText",
            }}
          >
            Total Transfer Amount:{" "}
            <span
              style={{
                color: "black",
              }}
            >
              Rp. {data?.data.transferAmount}{" "}
            </span>
          </Typography.Text>{" "}
          <br />
          <br />
          <Divider />
          <Typography.Text
            strong
            style={{
              color: "GrayText",
            }}
          >
            From Account No:{" "}
            <span
              style={{
                color: "black",
              }}
            >
              {data?.data.fromAccount}{" "}
            </span>
          </Typography.Text>{" "}
          <br />
          <br />
          <Typography.Text
            strong
            style={{
              color: "GrayText",
            }}
          >
            Instruction Type:{" "}
            <span
              style={{
                color: "black",
              }}
            >
              {data?.data.instructionType.toUpperCase()}
            </span>
          </Typography.Text>{" "}
          <br />
          <br />
        </Card>
        <Flex justify="center" align="center">
          <Button
            type="primary"
            style={{
              backgroundColor: "#CAB74C",
            }}
            onClick={() => {
              const formData = {
                transactionId: param?.id,
                totalAmount: data?.data.transferAmount,
                totalRecord: data?.data.transferRecord,
              };
              //@ts-ignore
              mutation.mutate(formData, {
                onSuccess() {
                  router.push(`/home/transfer/finish/${param?.id}`);
                },
              });
            }}
          >
            Confirm
          </Button>
        </Flex>
      </Card>
    </LayoutPage>
  );
}

export default WithUseQuery(ConfirmationPage);
