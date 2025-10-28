import { FormItem } from "types/formItem";

export const PartnerAssignmentFormItems = (
  setValue: (name: any, val: any) => void,
  options: any
): FormItem[] => [
  {
    name: "startDate",
    inputType: "date",
    label: "تاریخ شروع شراکت",
    size: { md: 6 },
    rules: { required: "تاریخ شروع شراکت الزامی است" },
    elementProps: {
      setDay: (value: any) => {
        setValue("startDate", value);
      },
      value: "",
    },
  },
  // {
  //   name: "endDate",
  //   inputType: "date",
  //   label: "تاریخ پایان شراکت",
  //   size: { md: 6 },
  //   rules: { },
  //   elementProps: {
  //     setDay: (value: any) => {
  //       setValue("endDate", value);
  //     },
  //     value: "",
  //   },
  // },
  {
    name: "dang",
    inputType: "text",
    label: "سهم‌الشرکه(به ریال)",
    size: { md: 6 },
    rules: { 
      required: "سهم‌الشرکه(به ریال) الزامی است",
      pattern: {
        value: /^[0-9]+$/,
        message: "باید فقط عدد وارد شود"
      },
      min: {
        value: 0,
        message: "درصد نمی‌تواند منفی باشد"
      },
      max: {
        value: 100,
        message: "درصد نمی‌تواند بیشتر از ۱۰۰ باشد"
      }
    },
  },
  // {
  //   name: "officePhone",
  //   inputType: "text",
  //   label: "تلفن دفتر",
  //   size: { md: 6 },
  //   rules: { 
  //     pattern: {
  //       value: /^[0-9]{8,11}$/,
  //       message: "شماره تلفن باید بین 8 تا 11 رقم باشد"
  //     }
  //   },
  // },
  {
    name: "startOfficialNewspaperNumber",
    inputType: "text",
    label: "شماره روزنامه رسمی شروع",
    size: { md: 6 },
    rules: { 
      required: "شماره روزنامه رسمی شروع الزامی است",
      pattern: {
        value: /^[0-9]+$/,
        message: "باید فقط عدد وارد شود"
      }
    },
  },
  {
    name: "startOfficialNewspaperDate",
    inputType: "date",
    label: "تاریخ روزنامه رسمی شروع",
    size: { md: 6 },
    rules: { required: "تاریخ روزنامه رسمی شروع الزامی است" },
    elementProps: {
      setDay: (value: any) => {
        setValue("startOfficialNewspaperDate", value);
      },
      value: "",
    },
  },
  // {
  //   name: "endOfficialNewspaperNumber",
  //   inputType: "text",
  //   label: "شماره روزنامه رسمی پایان",
  //   size: { md: 6 },
  //   rules: { 
  //     pattern: {
  //       value: /^[0-9]+$/,
  //       message: "باید فقط عدد وارد شود"
  //     }
  //   },
  // },
  // {
  //   name: "endOfficialNewspaperDate",
  //   inputType: "date",
  //   label: "تاریخ روزنامه رسمی پایان",
  //   size: { md: 6 },
  //   rules: { },
  //   elementProps: {
  //     setDay: (value: any) => {
  //       setValue("endOfficialNewspaperDate", value);
  //     },
  //     value: "",
  //   },
  // },
];