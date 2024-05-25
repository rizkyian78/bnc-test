import React from "react";
import { InboxOutlined, UploadOutlined } from "@ant-design/icons";
import type { UploadProps } from "antd";
import {
  Button,
  Flex,
  message,
  Popconfirm,
  Space,
  Typography,
  Upload,
} from "antd";

const { Dragger } = Upload;

const UploadComponent: React.FC<UploadProps> = ({ ...props }) => (
  <Dragger {...props} style={{ minWidth: 500 }} type="drag">
    <p className="ant-upload-drag-icon">
      <InboxOutlined
        sizes="large"
        style={{
          fontSize: "150px",
          color: "#C2B44F",
        }}
      />
    </p>
    <Typography.Text strong className="ant-upload-text">
      Choose Your Template
    </Typography.Text>
    <Typography className="ant-upload-hint">
      Only CSV format is support
    </Typography>
  </Dragger>
);

export default UploadComponent;
