import { FormItem } from "types/formItem";

export const DisciplinaryOrderFormItems = (
  setValue: (name: any, val: any) => void,
  options: any
): FormItem[] => {
  return [
    {
      name: "cdSubjectTypeId",
      inputType: "autocomplete",
      label: "موضوع",
      size: { md: 6 },
      options: options?.orderSubjectOptions?.map((item: any) => ({ 
        value: item?.id, 
        title: item?.value 
      })) ?? [{ value: 0, title: "خالی" }],
      storeValueAs: 'id',
      rules: { required: "موضوع الزامی است" },
    },
    {
      name: "claimant",
      inputType: "text",
      label: "شاکی",
      size: { md: 6 },
      rules: { required: "شاکی الزامی است" },
    },
    {
      name: "workgroupId",
      inputType: "autocomplete",
      label: "کارگروه",
      size: { md: 6 },
      options: options?.workgroupOptions?.map((item: any) => ({ 
        value: item?.id, 
        title: item?.name 
      })) ?? [{ value: 0, title: "خالی" }],
      storeValueAs: 'id',
      rules: { required: "انتخاب کارگروه الزامی است" },
    },
    {
      name: "cdOrderTypeId",
      inputType: "select",
      label: "نوع حکم",
      size: { md: 6 },
      options: options?.orderTypeOptions?.map((item: any) => ({ 
        value: item?.id, 
        title: item?.value 
      })) ?? [{ value: 0, title: "خالی" }],
      rules: { required: "انتخاب نوع حکم الزامی است" },
    },
    {
      name: "orderNumber",
      inputType: "text",
    //   label: "شماره دستور",
      label: "شماره حکم",
      size: { md: 6 },
      rules: { 
        required: "شماره حکم الزامی است",
        pattern: {
          value: /^[0-9]+$/,
          message: "شماره حکم باید عددی باشد"
        }
      },
    },
    {
      name: "receiptDate",
      inputType: "date",
      label: "تاریخ دریافت حکم",
      size: { md: 6 },
      rules: { required: "تاریخ دریافت حکم الزامی است" },
      elementProps: {
        setDay: (value: any) => setValue("receiptDate", value),
        value: "",
      },
    },
    // {
    //   name: "suspensionDate",
    //   inputType: "date",
    //   label: "تاریخ تعلیق",
    //   size: { md: 6 },
    //   rules: { },
    //   elementProps: {
    //     setDay: (value: any) => setValue("suspensionDate", value),
    //     value: "",
    //   },
    // },
    {
      name: "startDate",
      inputType: "date",
      label: "تاریخ شروع حکم",
      size: { md: 6 },
      rules: { required: "تاریخ شروع الزامی است" },
      elementProps: {
        setDay: (value: any) => setValue("startDate", value),
        value: "",
      },
    },
    {
      name: "endDate",
      inputType: "date",
      label: "تاریخ پایان حکم",
      size: { md: 6 },
      rules: { },
      elementProps: {
        setDay: (value: any) => setValue("endDate", value),
        value: "",
      },
    },
    {
      name: "fileCreationDate",
      inputType: "date",
      label: "تاریخ تشکیل پرونده",
      size: { md: 6 },
      rules: { required: "تاریخ تشکیل پرونده الزامی است" },
      elementProps: {
        setDay: (value: any) => setValue("fileCreationDate", value),
        value: "",
      },
    },
    {
      name: "fileTerminationDate",
      inputType: "date",
      label: "تاریخ خاتمه پرونده",
      size: { md: 6 },
      rules: { },
      elementProps: {
        setDay: (value: any) => setValue("fileTerminationDate", value),
        value: "",
      },
    },
    // {
    //   name: "personnelCaId",
    //   inputType: "autocomplete",
    //   label: "نام شریک یا مدیر",
    //   size: { md: 6 },
    //   options: options?.personnelOptions?.map((item: any) => ({ 
    //     value: item?.id, 
    //     title: `${item?.firstName} ${item?.lastName} - ${item?.nationalCode}`
    //   })) ?? [{ value: 0, title: "خالی" }],
    //   storeValueAs: 'id',
    //   rules: { required: "انتخاب پرسنل مربوطه الزامی است" },
    // },
  ];
};