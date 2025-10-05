import { FormItem } from "types/formItem";


export const ProfessionalFormItems = (
  setValue: (name: any, val: any) => void,
  options: any
): FormItem[] => [
  {
    name: "dang",
    inputType: "text",
    label: "درصد سهم الشرکه شریک",
    size: { md: 4 },
    rules: { 
      pattern: {
        value: /^[0-9]+$/,
        message: "باید فقط عدد وارد شود"
      }
    },
  },
  {
    name: "workshopCode",
    inputType: "text",
    label: "کد کارگاه",
    size: { md: 4 },
    rules: { },
  },
  {
    name: "workingGroupMembership",
    inputType: "checkbox",
    label: "عضویت در گروه‌های کاری",
    size: { md: 4 },
    rules: { },
    elementProps: {
      value: false,
    },
  },
  {
    name: "internationalAssociations",
    inputType: "checkbox",
    label: "انجمن‌های بین‌المللی",
    size: { md: 4 },
    rules: { },
    elementProps: {
      value: false,
    },
  },
  {
    name: "professionalAssociations",
    inputType: "checkbox",
    label: "انجمن‌های حرفه‌ای",
    size: { md: 4 },
    rules: { },
    elementProps: {
      value: true,
    },
  },
  {
    name: "itSkillHistory",
    inputType: "text",
    label: "سابقه مهارت‌های فناوری اطلاعات",
    size: { md: 6 },
    elementProps: {
      multiline: true,
      rows: 3,
    },
    rules: { },
  },
  {
    name: "professionalHistory",
    inputType: "text",
    label: "سوابق حرفه‌ای",
    size: { md: 6 },
    elementProps: {
      multiline: true,
      rows: 3,
    },
    rules: { },
  },
];