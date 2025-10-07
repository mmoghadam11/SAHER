import { useQuery } from "@tanstack/react-query";
import { useAuth } from "hooks/useAuth";
import { FormItem } from "types/formItem";
import { FullInstituteType } from "types/institute";



export const BranchFormItems = (
  setValue: (name: any, val: any) => void,
): FormItem[] => {
  return [
    {
      name: "newspaperNotificationNo",
      inputType: "text",
      label: "شماره آگهی",
      size: { md: 6 },
      rules: {
        required: "شماره آگهی الزامی است",
        pattern: {
          value: /^[0-9]{10}$/,
          message: "شماره آگهی باید 10 رقم باشد",
        },
      },
    },
    {
      name: "newspaperNotificationDate",
      inputType: "date",
      label: "تاریخ آگهی",
      size: { md: 4 },
      rules: { required: "تاریخ آگهی الزامی است" },
      elementProps: {
        setDay: (value: any) => setValue("newspaperNotificationDate", value),
        value: "",
      },
    },
    {
      name: "morguePlace",
      inputType: "text",
      label: "محل نگهداری اسناد",
      size: { md: 6 },
      rules: { required: "محل نگهداری اسناد الزامی است" },
    },
  ];
};
