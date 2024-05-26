"use client";

import { MeResponse, Transaction } from "@/model/model";
import WithUseQuery from "@/hoc/WrapperTanQuery";
import { apiTransactionClient, apiUserClient } from "@/server/mutation/api";
import LayoutPage from "@/view/Layout";

import { Button, Card, Divider, Flex, Result, Typography } from "antd";
import { useParams, useRouter } from "next/navigation";
import { useQuery } from "react-query";

function Finish() {
  const router = useRouter();

  const param = useParams();

  const { data } = useQuery({
    queryKey: ["confirmation"],

    queryFn: () => {
      return apiTransactionClient.get<Transaction>(`/${param?.id}`);
    },
  });

  const { data: user } = useQuery({
    queryKey: ["me"],

    queryFn: () => {
      return apiUserClient.get<MeResponse>(`/me`, {
        headers: {
          Authorization: sessionStorage.getItem("token"),
        },
      });
    },
  });

  let primaryMessage = "Submitted Successfully, waiting for review";
  let secondaryMessage =
    "The Transfer application will be invalidated on 23:59, please notify approver for review in time";

  if (data?.data.instructionType !== "immediate") {
    secondaryMessage = `The Transfer application will be invalidated on ${data?.data.expiredDate} ${data?.data.expiredTime}, please notify approver for review in time`;
  }

  if (user && user.data.role === "approver") {
    primaryMessage = "Submitted Successfully, and approved";
    secondaryMessage = ``;
  }

  return (
    <LayoutPage>
      <Card
        style={{
          marginBottom: 20,
        }}
      >
        <Typography.Title level={5}>Final Page</Typography.Title>
      </Card>

      <Card
        style={{
          paddingBottom: "10%",
        }}
      >
        <Result
          status="success"
          title={primaryMessage}
          subTitle={secondaryMessage}
        />
        <Card
          style={{
            minWidth: "50%",
            marginTop: 30,
            backgroundColor: "rgb(240, 242, 245)",
          }}
        >
          <Flex justify="start" gap={"large"} vertical>
            <Typography.Text>
              Total Transfer Record: <b>{data?.data.transferRecord}</b>{" "}
            </Typography.Text>
            <Typography.Text>
              Total Transfer Amount: <b>Rp. {data?.data.transferAmount}</b>{" "}
            </Typography.Text>
            <Divider />
            <Typography.Text>
              From Account No: <b>{data?.data.fromAccount}</b>{" "}
            </Typography.Text>
            <Typography.Text>
              Instruction Type:{" "}
              <b>{data?.data.instructionType.toUpperCase()}</b>{" "}
            </Typography.Text>
            <Typography.Text>
              Transfer Type: <b>{data?.data.transferType.toUpperCase()}</b>
            </Typography.Text>
            <Typography.Text>
              Reference No: <b>{data?.data.id}</b>
            </Typography.Text>
          </Flex>
        </Card>
        <Flex
          justify="center"
          align="center"
          gap="large"
          style={{
            marginTop: 30,
          }}
        >
          <Button
            style={{
              backgroundColor: "#CAB74C",
            }}
            type="primary"
            onClick={() => router.push("/home/transfer")}
          >
            Transfer One More Time
          </Button>
          <Button
            style={{
              backgroundColor: "#CAB74C",
            }}
            type="primary"
            onClick={() => router.push("/home")}
          >
            Back Home
          </Button>
        </Flex>
      </Card>
    </LayoutPage>
  );
}

export default WithUseQuery(Finish);
