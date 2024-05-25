"use client";

import { Card } from "antd";
import { Footer } from "antd/es/layout/layout";

export default function FooterPage() {
  return (
    <>
      <Footer style={{ textAlign: "center", minWidth: 100 }}>
        <Card>
          PT Bank Neo Commerce Tbk is licensed and supervised by the Indonesia
          Financial Service Authority (OJK) and an insured member of Deposit
          Insurance Corporation (LPS)
        </Card>
      </Footer>
    </>
  );
}
