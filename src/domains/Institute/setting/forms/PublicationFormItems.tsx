import { FormItem } from "domains/Institute/setting/forms/DirectorItems";

export const PublicationFormItems = (
  setValue: (name: any, val: any) => void,
  options: any
): FormItem[] => [
  {
    name: "name",
    inputType: "text",
    label: "نام",
    size: { md: 4 },
    rules: { required: "نام الزامی است" },
  },
  {
    name: "cdPublicationTypeId",
    inputType: "select",
    label: "نوع نشریه",
    size: { md: 4 },
    options: options?.PublicationType?.map((item: any) => ({ value: item?.id, title: item?.value })) ?? [{ value: 0, title: "خالی" }],
    rules: { required: "موسسه حسابرسی الزامی است" },
  },
  {
    name: "author",
    inputType: "text",
    label: "ناشر",
    size: { md: 4 },
    rules: { required: "نام ناشر الزامی است" },
  },
  {
    name: "publishDate",
    inputType: "date",
    label: "تاریخ انتشار",
    size: { md: 4 },
    rules: { required: "تاریخ انتشار الزامی است" },
    elementProps: {
      setDay: (value: any) => {
        setValue("publishDate", value);
      },
      value: "",
    },
  },
];