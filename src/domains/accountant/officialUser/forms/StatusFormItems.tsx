import { FormItem } from "types/formItem";


export const StatusFormItems = (
  setValue: (name: any, val: any) => void,
  options: any
): FormItem[] => [
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
  // {
  //   name: "cdproffesionalRankId",
  //   inputType: "select",
  //   label: "رده حرفه‌ای",
  //   size: { md: 4 },
  //   options: options?.rankOptions?.map((item: any) => ({ value: item?.id, title: item?.value })) ?? [{ value: 0, title: "خالی" }],
  //   rules: { required: "انتخاب رده حرفه‌ای الزامی است" },
  // },
];
