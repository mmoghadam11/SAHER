import { FormItem } from "types/formItem";


export const BasicFormItems = (
  setValue: (name: any, val: any) => void,
  options: any
): FormItem[] => [
  {
    name: "name",
    inputType: "text",
    label: "نام کارگروه",
    size: { md: 6 },
    rules: { required: "نام الزامی است" },
  },
  {
    name: "cdWorkgroupSpecialityId",
    inputType: "select",
    label: "زمینه تخصصی کارگروه جامعه",
    size: { md: 6 },
    options: options?.SpecialityOptions?.map((item: any) => ({ value: item?.id, title: item?.value })) ?? [{ value: 0, title: "خالی" }],
    rules: { required: "انتخاب زمینه تخصصی کارگروه جامعه الزامی است" },
  },
];