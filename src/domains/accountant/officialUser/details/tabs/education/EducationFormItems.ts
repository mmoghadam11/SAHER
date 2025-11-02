import { FormItem } from "types/formItem";


export const EducationFormItems = (
  setValue: (name: any, val: any) => void,
  options: any
): FormItem[] => [ 
  {
    name: "cdEducationalCertificateId",
    inputType: "select",
    label: "مدرک تحصیلی",
    size: { md: 6 },
    options: options?.eduCertificate?.map((item: any) => ({ value: item?.id, title: item?.value })) ?? [{ value: 0, title: "خالی" }],
    rules: { required: "انتخاب مدرک تحصیلی الزامی است" },
  },
  {
    name: "cdEducationalFieldId",
    inputType: "select",
    label: "رشته تحصیلی",
    size: { md: 6 },
    options: options?.educationalFieldOptions?.map((item: any) => ({ value: item?.id, title: item?.value })) ?? [{ value: 0, title: "خالی" }],
    rules: { required: "انتخاب رشته تحصیلی الزامی است" },
  },
  {
    name: "cdUniversityId",
    inputType: "select",
    label: "دانشگاه",
    size: { md: 6 },
    options: options?.universityOptions?.map((item: any) => ({ value: item?.id, title: item?.value })) ?? [{ value: 0, title: "خالی" }],
    rules: { required: "انتخاب دانشگاه الزامی است" },
  },
  {
    name: "educationCertificateDate",
    inputType: "date",
    label: "تاریخ اخذ مدرک",
    size: { md: 6 },
    rules: { required: "تاریخ اخذ مدرک الزامی است" },
    elementProps: {
      setDay: (value: any) => {
        setValue("educationCertificateDate", value);
      },
      value: "",
    },
  },
  {
    name: "description",
    inputType: "text",
    label: "توضیحات",
    size: { md: 12 },
    rules: { },
  },
];
