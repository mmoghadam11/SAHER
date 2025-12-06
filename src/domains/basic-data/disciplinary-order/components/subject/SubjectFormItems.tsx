import { useQuery } from "@tanstack/react-query";
import { useAuth } from "hooks/useAuth";
import { FormItem } from "types/formItem";
import { FullInstituteType } from "types/institute";

export const SubjectFormItems = (
  setValue: (name: any, val: any) => void,
  // options: any
): FormItem[] => {
  return [
    {
      name: "subjectTitle",
      inputType: "text",
      label: "عنوان موضوع",
      size: { md: 6 },
      rules: { required: "عنوان موضوع الزامی است" },
    },
    {
      name: "code",
      inputType: "text",
      label: "کد موضوع",
      size: { md: 6 },
      rules: { required: "عنوان موضوع الزامی است" },
    },
    {
      name: "auditingFirmUsed",
      inputType: "select",
      label: "شامل موسسات",
      size: { md: 6 },
      options: [
        { value: "true", title: "✅ میباشد" },
        { value: "false", title: "❌ نمیباشد" },
      ],
      rules: {
        required: "تایین این فیلد الزامی است",
      },
    },
    {
      name: "cerifiedAccountantUsed",
      inputType: "select",
      label: "شامل حسابدارن رسمی",
      size: { md: 6 },
      options: [
        { value: "true", title: "✅ میباشد" },
        { value: "false", title: "❌ نمیباشد" },
      ],
      rules: {
        required: "تایین این فیلد الزامی است",
      },
    },
    // {
    //   name: "logExtraInfo",
    //   inputType: "text",
    //   label: "توضیحات تکمیلی",
    //   size: { md: 12 },
    //   rules: { required: "عنوان موضوع الزامی است" },
    // },
  ];
};
