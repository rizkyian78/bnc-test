import dayjs from "dayjs";

export interface MeResponse {
  id: string;
  userId: string;
  userName: string;
  role: string;
  status: string;
  corporateName: string;
  corporateAccountNo: string;
  phoneNo: string;
  email: string;
  lang: string;
  created_at: string;
  updated_at: string;
  loginTime: string;
  iat: number;
  exp: number;
}

export interface MonitorResponse {
  status: Status[];
  meta: Meta;
  data: Transaction[];
}

export interface Status {
  status: string;
  count: string;
}

export interface Meta {
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export interface Transaction {
  id: string;
  transferAmount: string;
  transferRecord: number;
  fromAccount: string;
  fromUser: string;
  status: string;
  instructionType: string;
  created_at: string;
  updated_at: string;
  expiredDate?: string;
  expiredTime?: string;
  transferType: string;
}

export interface PayloadApproval {
  id: string;
  status: string;
}

export interface PayloadValidate {
  totalRecord: number | undefined;
  transferAmount: string;
  instructionType: string;
  expiredDate: string;
  expiredTime: string;
  transactionId: string | null;
}

export interface ResponsePool {
  ok: boolean;
  message: string;
  transactionId: string | null;
  totalAmount?: number;
  totalRecord?: number;
}

export interface RegisterRequest {
  email: string;
  password: string;
  corporateAccountNo: string;
  corporateName: string;
  userId: string;
  userName: string;
  role: string;
  phoneNo: string;
  verificationOTP: string;
}
