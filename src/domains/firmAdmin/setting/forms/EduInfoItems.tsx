import { useQuery } from "@tanstack/react-query";
import { useAuth } from "hooks/useAuth";
import { FullInstituteType } from "types/institute";

interface FormItem {
  name: string;
  inputType: string;
  label: string;
  size: { md: number };
  rules?: any;
  options?: any[];
  elementProps?: any;
}

export const EduInfoItems = (
  setValue: (name: any, val: any) => void
): FormItem[] => {
  return [
    {
      name: "termName",
      inputType: "text",
      label: "نام ترم",
      size: { md: 6 },
      rules: { required: "نام مدیرعامل الزامی است" },
    },
    {
      name: "applicatorName",
      inputType: "text",
      label: "نام درخواست کننده",
      size: { md: 6 },
      rules: { required: "نام خانوادگی الزامی است" },
    },
    {
      name: "name",
      inputType: "titleDivider",
      label: "",
      size: { md: 12 },
    },
    {
      name: "hour_count",
      inputType: "text",
      label: "مقدار ساعات",
      size: { md: 4 },
      rules: {
        required: "مقدار ساعات الزامی است",
        pattern: {
          value: /^[0-9]/,
          message: "ساعات به عدد وارد شود",
        },
      },
    },
    {
      name: "request_year",
      inputType: "text",
      label: "سال درخواست",
      size: { md: 4 },
      rules: {
        required: "سال درخواست الزامی است",
        pattern: {
          value: /^[0-9]{4}$/,
          message: "سال درخواست باید 4 رقم باشد",
        },
      },
    },
    {
      name: "request_month",
      inputType: "text",
      label: "ماه درخواست",
      size: { md: 4 },
      rules: {
        required: "ماه درخواست الزامی است",
        pattern: {
          value: /^[0-9]{2}$/,
          message: "ماه درخواست باید 2 رقم باشد",
        },
      },
    },
  ];
};

export default EduInfoItems;
