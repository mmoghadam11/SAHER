import { FormItem } from "types/formItem";

export const PersonnelAssignmentFormItems = (
  setValue: (name: any, val: any) => void,
  options: any
): FormItem[] => [
  {
    name: "startDate",
    inputType: "date",
    label: "تاریخ شروع",
    size: { md: 6 },
    rules: { required: "تاریخ شروع الزامی است" },
    elementProps: {
      setDay: (value: any) => {
        setValue("startDate", value);
      },
      value: "",
    },
  },
  {
    name: "cdProfessionalRankId",
    inputType: "select",
    label: "رده حرفه‌ای",
    size: { md: 6 },
    options: options?.rankOptions?.map((item: any) => ({ 
      value: item?.id, 
      title: item?.value 
    })) ?? [{ value: 0, title: "خالی" }],
    rules: { required: "انتخاب رده حرفه‌ای الزامی است" },
  },
  {
    name: "officePhone",
    inputType: "text",
    label: "تلفن دفتر",
    size: { md: 6 },
    rules: { 
      pattern: {
        value: /^[0-9]{8,11}$/,
        message: "شماره تلفن باید بین 8 تا 11 رقم باشد"
      }
    },
  },
  // {
  //   name: "operationalJob",
  //   inputType: "text",
  //   label: "شغل عملیاتی",
  //   size: { md: 6 },
  //   rules: { required: "شغل عملیاتی الزامی است" },
  // },
  {
    name: "description",
    inputType: "text",
    label: "توضیحات",
    size: { md: 12 },
    elementProps: {
      multiline: true,
      rows: 3,
    },
    rules: { },
  },
];