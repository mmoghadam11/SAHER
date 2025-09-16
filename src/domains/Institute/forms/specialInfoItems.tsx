import { FullInstituteType } from "types/institute";

interface FormItem {
  name: keyof FullInstituteType;
  inputType: string;
  label: string;
  size: { md: number };
  rules?: any;
  options?: any[];
  elementProps?: any;
}

export const specialInfoItems = (setValue: (name: any, val: any) => void): FormItem[] => [
  {
    name: "stockExchangeTrustee",
    inputType: "select",
    label: "معتمد بورس",
    size: { md: 3 },
    options: [
      { value: true, title: "بله" },
      { value: false, title: "خیر" },
    ],
    rules: { required: "وضعیت معتمد بورس الزامی است" },
  },
  {
    name: "stockExchangeTrusteeDate",
    inputType: "date",
    label: "تاریخ اعتماد بورس",
    size: { md: 3 },
    rules: { },
    elementProps: {
      setDay: (value: any) => {
        setValue("stockExchangeTrusteeDate", value);
      },
      value: "",
    },
  },
  {
    name: "stockExchangeRejectionDate",
    inputType: "date",
    label: "تاریخ رد اعتماد بورس",
    size: { md: 3 },
    rules: { },
    elementProps: {
      setDay: (value: any) => {
        setValue("stockExchangeRejectionDate", value);
      },
      value: "",
    },
  },
  {
    name: "centralBankTrustee",
    inputType: "select",
    label: "معتمد بانک مرکزی",
    size: { md: 3 },
    options: [
      { value: true, title: "بله" },
      { value: false, title: "خیر" },
    ],
    rules: { required: "وضعیت معتمد بانک مرکزی الزامی است" },
  },
  {
    name: "insuranceTrustee",
    inputType: "select",
    label: "معتمد بیمه مرکزی",
    size: { md: 3 },
    options: [
      { value: true, title: "بله" },
      { value: false, title: "خیر" },
    ],
    rules: { required: "وضعیت معتمد بیمه مرکزی الزامی است" },
  },
  {
    name: "auditCourtTrustee",
    inputType: "select",
    label: "معتمد دیوان محاسبات",
    size: { md: 3 },
    options: [
      { value: true, title: "بله" },
      { value: false, title: "خیر" },
    ],
    rules: { required: "وضعیت معتمد دیوان محاسبات الزامی است" },
  },
  {
    name: "amlManagerName",
    inputType: "text",
    label: "مدیر مبارزه با پولشویی",
    size: { md: 3 },
    rules: { 
      required: "نام مدیر مبارزه با پولشویی الزامی است"
    },
  },
  {
    name: "amlManagerNationalId",
    inputType: "text",
    label: "کد ملی مدیر مبارزه با پولشویی",
    size: { md: 3 },
    rules: { 
      required: "کد ملی مدیر مبارزه با پولشویی الزامی است",
      pattern: {
        value: /^[0-9]{10}$/,
        message: "کد ملی باید 10 رقم باشد"
      }
    },
  },
  {
    name: "societyRelationType",
    inputType: "text",
    label: "نوع ارتباط با جامعه",
    size: { md: 3 },
    rules: { 
      required: "نوع ارتباط با جامعه الزامی است"
    },
  },
  {
    name: "auditorName",
    inputType: "text",
    label: "نام حسابرس",
    size: { md: 3 },
    rules: { 
      required: "نام حسابرس الزامی است"
    },
  },
  {
    name: "mergerDate",
    inputType: "date",
    label: "تاریخ ادغام",
    size: { md: 3 },
    rules: { },
    elementProps: {
      setDay: (value: any) => {
        setValue("mergerDate", value);
      },
      value: "",
    },
  },
  {
    name: "mergedInstituteName",
    inputType: "text",
    label: "نام موسسه ادغام‌شونده",
    size: { md: 3 },
    rules: { },
  },
  {
    name: "mergedInstituteMembership",
    inputType: "text",
    label: "شماره عضویت ادغام‌شونده",
    size: { md: 3 },
    rules: { },
  },
  {
    name: "dissolutionDate",
    inputType: "date",
    label: "تاریخ انحلال",
    size: { md: 3 },
    rules: { },
    elementProps: {
      setDay: (value: any) => {
        setValue("dissolutionDate", value);
      },
      value: "",
    },
  },
  {
    name: "dissolutionGazetteNumber",
    inputType: "text",
    label: "شماره روزنامه انحلال",
    size: { md: 3 },
    rules: { },
  },
  {
    name: "dissolutionGazetteDate",
    inputType: "date",
    label: "تاریخ روزنامه انحلال",
    size: { md: 3 },
    rules: { },
    elementProps: {
      setDay: (value: any) => {
        setValue("dissolutionGazetteDate", value);
      },
      value: "",
    },
  },
];