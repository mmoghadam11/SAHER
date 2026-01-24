import { FormItem } from "types/formItem";

export const AccountantAssignmentFormItems = (
  setValue: (name: any, val: any) => void,
  options: any
): FormItem[] => [
  {
    name: "cooperationStartDate",
    inputType: "date",
    label: "تاریخ شروع",
    size: { md: 6 },
    rules: { required: "تاریخ شروع الزامی است" },
    elementProps: {
      setDay: (value: any) => {
        setValue("cooperationStartDate", value);
      },
      value: "",
    },
  },
  {
    name: "lastMembershipCardIssuanceDate",
    inputType: "date",
    label: "تاریخ صدور کارت",
    size: { md: 6 },
    rules: { required: "تاریخ صدور کارت الزامی است" },
    elementProps: {
      setDay: (value: any) => {
        setValue("lastMembershipCardIssuanceDate", value);
      },
      value: "",
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
  // {
  //   name: "personnelEmail",
  //   inputType: "text",
  //   label: "ایمیل",
  //   size: { md: 6 },
  //   rules: { 
  //     pattern: {
  //       value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
  //       message: "فرمت ایمیل نامعتبر است"
  //     }
  //   },
  // },
];




