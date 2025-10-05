import { FormItem } from "types/formItem";


export const StatusFormItems = (
  setValue: (name: any, val: any) => void,
  options: any
): FormItem[] => [
  {
    name: "cdcitizenshipId",
    inputType: "select",
    label: "تابعیت",
    size: { md: 4 },
    options: options?.countryOptions?.map((item: any) => ({ value: item?.id, title: item?.value })) ?? [{ value: 0, title: "خالی" }],
    rules: { required: "انتخاب تابعیت الزامی است" },
  },
  {
    name: "cooperationStartDate",
    inputType: "date",
    label: "تاریخ شروع همکاری",
    size: { md: 4 },
    rules: { required: "تاریخ شروع همکاری الزامی است" },
    elementProps: {
      setDay: (value: any) => {
        setValue("cooperationStartDate", value);
      },
      value: "",
    },
  },
  {
    name: "cooperationEndDate",
    inputType: "date",
    label: "تاریخ پایان همکاری",
    size: { md: 4 },
    rules: { },
    elementProps: {
      setDay: (value: any) => {
        setValue("cooperationEndDate", value);
      },
      value: "",
    },
  },
  {
    name: "partnershipOfficialNewspaperDate",
    inputType: "date",
    label: "تاریخ روزنامه رسمی شراکت",
    size: { md: 4 },
    rules: { },
    elementProps: {
      setDay: (value: any) => {
        setValue("partnershipOfficialNewspaperDate", value);
      },
      value: "",
    },
  },
  {
    name: "partnershipOfficialNewspaperNo",
    inputType: "text",
    label: "شماره روزنامه رسمی شراکت",
    size: { md: 4 },
    rules: { 
      pattern: {
        value: /^[0-9]+$/,
        message: "باید فقط عدد وارد شود"
      }
    },
  },
  {
    name: "partnershipEndDate",
    inputType: "date",
    label: "تاریخ پایان شراکت",
    size: { md: 4 },
    rules: { },
    elementProps: {
      setDay: (value: any) => {
        setValue("partnershipEndDate", value);
      },
      value: "",
    },
  },
  {
    name: "retired",
    inputType: "checkbox",
    label: "بازنشسته",
    size: { md: 4 },
    rules: { },
  },
  {
    name: "cddutyStatusId",
    inputType: "select",
    label: "وضعیت وظیفه",
    size: { md: 4 },
    options: options?.DutyStatus?.map((item: any) => ({ value: item?.id, title: item?.value })) ?? [{ value: 0, title: "خالی" }],
    rules: { required: "انتخاب وضعیت وظیفه الزامی است" },
  },
];