import { FullInstituteType } from "types/institute";

interface FormItem {
    name: keyof FullInstituteType;
    inputType: string;
    label: string;
    size: { md: number };
    rules?: any;
    options?: any[];
    elementProps?: any;
  }

export const membershipInfoItems:FormItem[] = [
  {
    name: "membershipNumber",
    inputType: "text",
    label: "شماره عضویت",
    size: { md: 6 },
    rules: { required: "شماره عضویت الزامی است" },
  },
  {
    name: "membershipDate",
    inputType: "date",
    label: "تاریخ عضویت",
    size: { md: 6 },
    rules: { required: "تاریخ عضویت الزامی است" },
    elementProps: {
      setDay: (value: any) => {
        // این تابع باید در کامپوننت والد تعریف شود
      },
      value: "", // مقدار اولیه
    },
  },
  {
    name: "licenseNumber",
    inputType: "text",
    label: "شماره پروانه",
    size: { md: 6 },
    rules: { required: "شماره پروانه الزامی است" },
  },
  {
    name: "licenseDate",
    inputType: "date",
    label: "تاریخ پروانه",
    size: { md: 6 },
    rules: { required: "تاریخ پروانه الزامی است" },
    elementProps: {
      setDay: (value: any) => {
        // این تابع باید در کامپوننت والد تعریف شود
      },
      value: "", // مقدار اولیه
    },
  },
  {
    name: "licenseExpiry",
    inputType: "date",
    label: "پایان اعتبار",
    size: { md: 6 },
    rules: { required: "تاریخ پایان اعتبار الزامی است" },
    elementProps: {
      setDay: (value: any) => {
        // این تابع باید در کامپوننت والد تعریف شود
      },
      value: "", // مقدار اولیه
    },
  },
  {
    name: "lastLicenseDate",
    inputType: "date",
    label: "آخرین پروانه",
    size: { md: 6 },
    rules: { required: "تاریخ آخرین پروانه الزامی است" },
    elementProps: {
      setDay: (value: any) => {
        // این تابع باید در کامپوننت والد تعریف شود
      },
      value: "", // مقدار اولیه
    },
  },
];