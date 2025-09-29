import { FormItem } from "./DirectorItems";

export const ContinuingEduItems = (
  setValue: (name: any, val: any) => void,
  EduOptions: any,
  EduTypeOptions: any
): FormItem[] => {
  return [
    {
      name: "cdTermId",
      inputType: "select",
      label: "شناسه ترم",
      size: { md: 3 },
      options: EduOptions?.map((item: any) => ({
        value: item?.id,
        title: item?.value,
      })) ?? [{ value: 0, title: "خالی" }],
      placeholder: "فقط عدد",
      rules: {
        required: "شناسه ترم الزامی است",
        pattern: { value: /^[0-9]+$/, message: "باید فقط عدد وارد شود" },
      },
    },
    {
      name: "termCode",
      inputType: "text",
      label: "کد ترم",
      size: { md: 3 },
      rules: { required: "کد ترم الزامی است" },
    },
    {
      name: "termDate",
      inputType: "date",
      label: "تاریخ ترم",
      size: { md: 4 },
      rules: { required: "تاریخ ترم الزامی است" },
      elementProps: {
        setDay: (value: any) => setValue("termDate", value),
        value: "",
      },
    },
    {
      name: "termDuration",
      inputType: "text",
      label: "مدت زمان ترم (روز)",
      size: { md: 3 },
      placeholder: "به عدد وارد شود",
      rules: {
        required: "مدت زمان ترم الزامی است",
        pattern: { value: /^[0-9]+$/, message: "باید فقط عدد وارد شود" },
      },
    },
    {
      name: "certificateNo",
      inputType: "text",
      label: "شماره گواهینامه",
      size: { md: 3 },
      rules: { required: "شماره گواهینامه الزامی است" },
    },
    {
      name: "certificateDate",
      inputType: "date",
      label: "تاریخ گواهینامه",
      size: { md: 4 },
      rules: { required: "تاریخ گواهینامه الزامی است" },
      elementProps: {
        setDay: (value: any) => setValue("certificateDate", value),
        value: "",
      },
    },
    {
      name: "cdEducationTypeId",
      inputType: "select",
      label: "شناسه نوع آموزش",
      options: EduTypeOptions?.map((item: any) => ({
        value: item?.id,
        title: item?.value,
      })) ?? [{ value: 0, title: "خالی" }],
      size: { md: 3 },
      placeholder: "فقط عدد",
      rules: {
        required: "شناسه نوع آموزش الزامی است",
        pattern: { value: /^[0-9]+$/, message: "باید فقط عدد وارد شود" },
      },
    },
  ];
};
