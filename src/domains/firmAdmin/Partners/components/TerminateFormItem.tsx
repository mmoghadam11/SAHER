import { FormItem } from "types/formItem";

export const TerminateFormItem = (
  setValue: (name: any, val: any) => void
): FormItem[] => [
  {
    name: "endDate",
    inputType: "date",
    label: "تاریخ پایان شراکت",
    size: { md: 6 },
    rules: {
      required:"تاریخ پایان شراکت الزامیست"
    },
    elementProps: {
      setDay: (value: any) => {
        setValue("endDate", value);
      },
      value: "",
    },
  },
  {
    name: "endOfficialNewspaperNumber",
    inputType: "text",
    label: "شماره روزنامه رسمی پایان",
    size: { md: 6 },
    rules: {
       required:"شماره روزنامه رسمی پایان الزامیست",
      pattern: {
        value: /^[0-9]+$/,
        message: "باید فقط عدد وارد شود",
      },
    },
  },
  {
    name: "endOfficialNewspaperDate",
    inputType: "date",
    label: "تاریخ روزنامه رسمی پایان",
    size: { md: 6 },
    rules: {
      required:"تاریخ روزنامه رسمی پایان الزامیست",
    },
    elementProps: {
      setDay: (value: any) => {
        setValue("endOfficialNewspaperDate", value);
      },
      value: "",
    },
  },
];
