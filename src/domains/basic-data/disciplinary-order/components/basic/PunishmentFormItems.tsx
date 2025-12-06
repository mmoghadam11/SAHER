import { useQuery } from "@tanstack/react-query";
import { useAuth } from "hooks/useAuth";
import { FormItem } from "types/formItem";
import { FullInstituteType } from "types/institute";

export const PunishmentFormItems = (
  setValue: (name: any, val: any) => void,
  // options: any
): FormItem[] => {
  return [
    {
      name: "orderName",
      inputType: "text",
      label: "عنوان تنبیه",
      size: { md: 6 },
      rules: { required: "عنوان موضوع الزامی است" },
    },
    {
      name: "code",
      inputType: "text",
      label: "کد تنبیه",
      size: { md: 6 },
      rules: { required: "عنوان موضوع الزامی است" },
    },
    {
      name: "contestable",
      inputType: "select",
      label: "قابل اعتراض",
      size: { md: 6 },
      options: [
        { value: "true", title: "✅ میباشد" },
        { value: "false", title: "❌ نمیباشد" },
      ],
      rules: {
        required: "تایین این فیلد الزامی است",
      },
    },
  ];
};
