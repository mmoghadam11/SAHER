import { FormItem } from "types/formItem";

export const EducationalCertificateFormItems = (
  setValue: (name: any, val: any) => void,
  options: any
): FormItem[] => [
  {
    name: "personnelId",
    inputType: "autocomplete",
    label: "پرسنل",
    size: { md: 6 },
    options: options?.personnelOptions?.map((item: any) => ({ 
      value: item?.id, 
      title: `${item?.firstName} ${item?.lastName} - ${item?.nationalCode}`
    })) ?? [{ value: 0, title: "خالی" }],
    storeValueAs: 'id',
    rules: { required: "انتخاب پرسنل الزامی است" },
  },
  {
    name: "certificateNo",
    inputType: "text",
    label: "شماره مدرک",
    size: { md: 6 },
    rules: { 
      required: "شماره مدرک الزامی است"
    },
  },
  {
    name: "certificateDate",
    inputType: "date",
    label: "تاریخ اخذ مدرک",
    size: { md: 6 },
    rules: { required: "تاریخ اخذ مدرک الزامی است" },
    elementProps: {
      setDay: (value: any) => {
        setValue("certificateDate", value);
      },
      value: "",
    },
  },
  {
    name: "termScore",
    inputType: "text",
    label: "امتیاز دوره",
    size: { md: 6 },
    rules: { 
      pattern: {
        value: /^[0-9]+(\.[0-9]{1,2})?$/,
        message: "معدل باید عددی باشد (مثال: 17.5)"
      },
      min: {
        value: 0,
        message: "معدل نمی‌تواند منفی باشد"
      },
      max: {
        value: 20,
        message: "معدل نمی‌تواند بیشتر از ۲۰ باشد"
      }
    },
  },
];