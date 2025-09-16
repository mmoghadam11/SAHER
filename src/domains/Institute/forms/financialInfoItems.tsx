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

export const financialInfoItems = (setValue: (name: any, val: any) => void): FormItem[] => [
  {
    name: "economicCode",
    inputType: "text",
    label: "کد اقتصادی",
    size: { md: 4 },
    rules: { 
      required: "کد اقتصادی الزامی است",
      pattern: {
        value: /^[0-9]+$/,
        message: "کد اقتصادی باید عددی باشد"
      }
    },
  },
  {
    name: "taxCode",
    inputType: "text",
    label: "کد مالیاتی",
    size: { md: 4 },
    rules: { 
      required: "کد مالیاتی الزامی است",
      pattern: {
        value: /^[0-9]+$/,
        message: "کد مالیاتی باید عددی باشد"
      }
    },
  },
  {
    name: "fiscalYear",
    inputType: "text",
    label: "سال مالی",
    size: { md: 4 },
    rules: { 
      required: "سال مالی الزامی است",
      pattern: {
        value: /^[0-9]{4}$/,
        message: "سال مالی باید 4 رقم باشد"
      }
    },
  },
  {
    name: "fiscalYearStart",
    inputType: "date",
    label: "شروع سال مالی",
    size: { md: 4 },
    rules: { required: "تاریخ شروع سال مالی الزامی است" },
    elementProps: {
      setDay: (value: any) => {
        setValue("fiscalYearStart", value);
      },
      value: "", // مقدار اولیه
    },
  },
  {
    name: "fiscalYearEnd",
    inputType: "date",
    label: "پایان سال مالی",
    size: { md: 4 },
    rules: { required: "تاریخ پایان سال مالی الزامی است" },
    elementProps: {
      setDay: (value: any) => {
        setValue("fiscalYearEnd", value);
      },
      value: "", // مقدار اولیه
    },
  },
  {
    name: "ownershipType",
    inputType: "select",
    label: "نوع مالکیت",
    size: { md: 4 },
    options: [
      { value: "ملکیت", title: "ملکیت" },
      { value: "اجاره", title: "اجاره" },
      { value: "رهن", title: "رهن" },
      { value: "اجاره از شرکا", title: "اجاره از شرکا" },
    ],
    rules: { required: "نوع مالکیت الزامی است" },
  },
  {
    name: "officeArea",
    inputType: "text",
    label: "متراژ فضای اداری (متر مربع)",
    size: { md: 4 },
    rules: { 
      required: "متراژ فضای اداری الزامی است",
      pattern: {
        value: /^[0-9]+$/,
        message: "متراژ باید عددی باشد"
      }
    },
  },
];