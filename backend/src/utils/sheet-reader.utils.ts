import * as csvtojson from 'csvtojson';
import XLSX from 'xlsx';

export interface CSVData {
  to_bank: string;
  to_account_no: string;
  to_account_name: string;
  transfer_amount: string;
}

export interface RedisSaveValue {
  totalRecord: number;
  totalAmount: number;
  data: CSVData[];
}

export const getJsonCSV = async (
  filepath: string,
  noheader: boolean = false,
): Promise<CSVData[]> => {
  return await csvtojson({ noheader: noheader }).fromFile(filepath);
};

export const getJsonXLSX = (filepath: string) => {
  const workbook = XLSX.readFile(filepath);
  const sheet_name_list = workbook.SheetNames;
  return XLSX.utils.sheet_to_json(workbook.Sheets[sheet_name_list[0]]);
};
