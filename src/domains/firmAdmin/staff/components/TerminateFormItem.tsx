import { FormItem } from "types/formItem";

export const TerminateFormItem = (
  setValue: (name: any, val: any) => void,
): FormItem[] => [
  {
    name: "endDate",
    inputType: "date",
    label: "تاریخ پایان همکاری",
    size: { md: 6 },
    rules: { required: "تاریخ پایان همکاری الزامی است" },
    elementProps: {
      setDay: (value: any) => {
        setValue("endDate", value);
      },
      value: "",
    },
  },
];