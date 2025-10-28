import { FormItem } from "types/formItem";

export const MembershipFormItems = (
  setValue: (name: any, val: any) => void,
  options: any
): FormItem[] => [
  {
    name: "cdMembershipTypeId",
    inputType: "select",
    label: "نوع عضویت",
    size: { md: 6 },
    options: options?.membershipType?.map((item: any) => ({ value: item?.id, title: item?.value })) ?? [{ value: 0, title: "خالی" }],
    rules: { required: "انتخاب نوع عضویت الزامی است" },
  },
//   {
//     name: "membershipDate",
//     inputType: "date",
//     label: "تاریخ عضویت",
//     size: { md: 6 },
//     rules: { required: "تاریخ عضویت الزامی است" },
//     elementProps: {
//       setDay: (value: any) => {
//         setValue("membershipDate", value);
//       },
//       value: "",
//     },
//   },
  {
    name: "changeDate",
    inputType: "date",
    label: "تاریخ تغیر عضویت",
    size: { md: 6 },
    rules: { required: "تاریخ تغیر عضویت الزامی است" },
    elementProps: {
      setDay: (value: any) => {
        setValue("changeDate", value);
      },
      value: "",
    },
  },
  {
    name: "documentNumber",
    inputType: "text",
    label: "مستندات",
    size: { md: 12 },
    rules: { },
  },
];