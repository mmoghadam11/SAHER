import { useQuery } from "@tanstack/react-query";
import { useAuth } from "hooks/useAuth";
import { FormItem } from "types/formItem";
import { FullInstituteType } from "types/institute";



export const DirectorItems = (
  setValue: (name: any, val: any) => void,
  options:any
): FormItem[] => {
  return [
    {
    name: "directorPersonnelId",
    inputType: "autocomplete",
    label: "مدیرعامل",
    size: { md: 6 },
    options: options?.personnelOptions?.map((item: any) => ({
      value: item?.id,
      title: `${item?.firstName} ${item?.lastName} - ${item?.nationalCode}`,
    })) ?? [{ value: 0, title: "خالی" }],
    storeValueAs: "id",
    rules: { required: "انتخاب پرسنل الزامی است" },
  },
  {
    name: "directorAcceptanceDate",
    inputType: "date",
    label: "تاریخ شروع مدیریت",
    size: { md: 6 },
    rules: { required: "تاریخ شروع مدیریت الزامی است" },
    tempRules: { required: "تاریخ شروع مدیریت الزامی است" },
    elementProps: {
      setDay: (value: any) => {
        setValue("registerDate", value);
        // این تابع باید در کامپوننت والد تعریف شود
      },
      value: "", // مقدار اولیه
    },
  },
  ];
};
