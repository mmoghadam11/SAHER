import { useQuery } from "@tanstack/react-query";
import { useAuth } from "hooks/useAuth";
import { FormItem } from "types/formItem";
import { FullInstituteType } from "types/institute";



export const DirectorItems = (
  setValue: (name: any, val: any) => void,
): FormItem[] => {
  return [
    {
      name: "firstName",
      inputType: "text",
      label: "نام مدیرعامل",
      size: { md: 6 },
      rules: { required: "نام مدیرعامل الزامی است" },
    },
    {
      name: "lastName",
      inputType: "text",
      label: "نام خانوادگی مدیرعامل",
      size: { md: 6 },
      rules: { required: "نام خانوادگی الزامی است" },
    },
    {
      name: "nationalCode",
      inputType: "text",
      label: "شناسه ملی",
      size: { md: 6 },
      rules: {
        required: "شناسه ملی الزامی است",
        pattern: {
          value: /^[0-9]{10}$/,
          message: "شناسه ملی باید 10 رقم باشد",
        },
      },
    },
    {
      name: "mobileNo",
      inputType: "text",
      label: "شماره موبایل",
      size: { md: 6 },
      rules: { required: "شماره موبایل الزامی است" },
    },
  ];
};
