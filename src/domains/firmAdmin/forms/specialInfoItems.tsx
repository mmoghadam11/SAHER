import { FormItem } from "types/formItem";
import { FullInstituteType } from "types/institute";

export const specialInfoItems = (
  setValue: (name: any, val: any) => void,
  relOptions: any
): FormItem[] => [
  {
    name: "burseTrustee",
    inputType: "select",
    label: "معتمد بورس",
    size: { md: 3 },
    options: [
      { value: "true", title: "بله" },
      { value: "false", title: "خیر" },
    ],
    rules: { required: "وضعیت معتمد بورس الزامی است" },
  },
  {
    name: "burseTrustReceiptDate",
    inputType: "date",
    label: "تاریخ اعتماد بورس",
    size: { md: 3 },
    rules: {},
    elementProps: {
      setDay: (value: any) => {
        setValue("burseTrustReceiptDate", value);
      },
      value: "",
    },
  },
  {
    name: "burseRejectionReceiptDate",
    inputType: "date",
    label: "تاریخ رد اعتماد بورس",
    size: { md: 3 },
    rules: {},
    elementProps: {
      setDay: (value: any) => {
        setValue("burseRejectionReceiptDate", value);
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
      { value: "true", title: "بله" },
      { value: "false", title: "خیر" },
    ],
    rules: { required: "وضعیت معتمد بانک مرکزی الزامی است" },
  },
  {
    name: "centralInsuranceTrustee",
    inputType: "select",
    label: "معتمد بیمه مرکزی",
    size: { md: 3 },
    options: [
      { value: "true", title: "بله" },
      { value: "false", title: "خیر" },
    ],
    rules: { required: "وضعیت معتمد بیمه مرکزی الزامی است" },
  },
  {
    name: "courtAccountsTrustee",
    inputType: "select",
    label: "معتمد دیوان محاسبات",
    size: { md: 3 },
    options: [
      { value: "true", title: "بله" },
      { value: "false", title: "خیر" },
    ],
    rules: { required: "وضعیت معتمد دیوان محاسبات الزامی است" },
  },
  {
    name: "moneyLaunderingCombatingManagerName",
    inputType: "text",
    label: "مدیر مبارزه با پولشویی",
    size: { md: 3 },
    rules: {
      required: "نام مدیر مبارزه با پولشویی الزامی است",
    },
  },
  {
    name: "moneyLaunderingCombatingManagerNationalcode",
    inputType: "text",
    label: "کد ملی مدیر مبارزه با پولشویی",
    size: { md: 3 },
    rules: {
      required: "کد ملی مدیر مبارزه با پولشویی الزامی است",
      pattern: {
        value: /^[0-9]{10}$/,
        message: "کد ملی باید 10 رقم باشد",
      },
    },
  },
  {
    name: "cdRelationshipTypeId", // تغییر نام فیلد به province
    inputType: "autocomplete", // تغییر به autocomplete
    label: "نوع ارتباط با جامعه",
    size: { md: 3 },
    options: relOptions?.content?.map((item: any) => ({
      value: item?.id,
      title: item?.value,
    })) ?? [{ value: 0, title: "" }],
    storeValueAs: "id",
    elementProps: {
      disabled: true,
    },
  },
  {
    name: "auditorName",
    inputType: "text",
    label: "نام حسابرس",
    size: { md: 3 },
    elementProps: {
      disabled: true,
    },
  },
  {
    name: "officialNewspaperMergeDate",
    inputType: "date",
    label: "تاریخ ادغام",
    size: { md: 3 },
    rules: {},
    elementProps: {
      setDay: (value: any) => {
        setValue("officialNewspaperMergeDate", value);
      },
      value: "",
      disabled: true,
    },
  },
  {
    name: "mergingInstitutionName",
    inputType: "text",
    label: "نام موسسه ادغام‌شونده",
    size: { md: 3 },
    rules: {},
    elementProps: {
      disabled: true,
    },
  },
  {
    name: "mergingInstitutionMembershipNo",
    inputType: "text",
    label: "شماره عضویت ادغام‌شونده",
    size: { md: 3 },
    rules: {},
    elementProps: {
      disabled: true,
    },
  },
  {
    name: "dissolutionDate",
    inputType: "date",
    label: "تاریخ انحلال",
    size: { md: 3 },
    rules: {},
    elementProps: {
      setDay: (value: any) => {
        setValue("dissolutionDate", value);
      },
      value: "",
      disabled: true,
    },
  },
  {
    name: "dissolutionOfficialNewspaperNo",
    inputType: "text",
    label: "شماره روزنامه انحلال",
    size: { md: 3 },
    rules: {},
    elementProps: {
      disabled: true,
    },
  },
  {
    name: "dissolutionOfficialNewspaperDate",
    inputType: "date",
    label: "تاریخ روزنامه انحلال",
    size: { md: 3 },
    rules: {},
    elementProps: {
      setDay: (value: any) => {
        setValue("dissolutionOfficialNewspaperDate", value);
      },
      value: "",
      disabled: true,
    },
  },
];
// export const specialInfoItems = (setValue: (name: any, val: any) => void): FormItem[] => [
//   {
//     name: "stockExchangeTrustee",
//     inputType: "select",
//     label: "معتمد بورس",
//     size: { md: 3 },
//     options: [
//       { value: true, title: "بله" },
//       { value: false, title: "خیر" },
//     ],
//     rules: { required: "وضعیت معتمد بورس الزامی است" },
//   },
//   {
//     name: "stockExchangeTrusteeDate",
//     inputType: "date",
//     label: "تاریخ اعتماد بورس",
//     size: { md: 3 },
//     rules: { },
//     elementProps: {
//       setDay: (value: any) => {
//         setValue("stockExchangeTrusteeDate", value);
//       },
//       value: "",
//     },
//   },
//   {
//     name: "stockExchangeRejectionDate",
//     inputType: "date",
//     label: "تاریخ رد اعتماد بورس",
//     size: { md: 3 },
//     rules: { },
//     elementProps: {
//       setDay: (value: any) => {
//         setValue("stockExchangeRejectionDate", value);
//       },
//       value: "",
//     },
//   },
//   {
//     name: "centralBankTrustee",
//     inputType: "select",
//     label: "معتمد بانک مرکزی",
//     size: { md: 3 },
//     options: [
//       { value: true, title: "بله" },
//       { value: false, title: "خیر" },
//     ],
//     rules: { required: "وضعیت معتمد بانک مرکزی الزامی است" },
//   },
//   {
//     name: "insuranceTrustee",
//     inputType: "select",
//     label: "معتمد بیمه مرکزی",
//     size: { md: 3 },
//     options: [
//       { value: true, title: "بله" },
//       { value: false, title: "خیر" },
//     ],
//     rules: { required: "وضعیت معتمد بیمه مرکزی الزامی است" },
//   },
//   {
//     name: "auditCourtTrustee",
//     inputType: "select",
//     label: "معتمد دیوان محاسبات",
//     size: { md: 3 },
//     options: [
//       { value: true, title: "بله" },
//       { value: false, title: "خیر" },
//     ],
//     rules: { required: "وضعیت معتمد دیوان محاسبات الزامی است" },
//   },
//   {
//     name: "amlManagerName",
//     inputType: "text",
//     label: "مدیر مبارزه با پولشویی",
//     size: { md: 3 },
//     rules: {
//       required: "نام مدیر مبارزه با پولشویی الزامی است"
//     },
//   },
//   {
//     name: "amlManagerNationalId",
//     inputType: "text",
//     label: "کد ملی مدیر مبارزه با پولشویی",
//     size: { md: 3 },
//     rules: {
//       required: "کد ملی مدیر مبارزه با پولشویی الزامی است",
//       pattern: {
//         value: /^[0-9]{10}$/,
//         message: "کد ملی باید 10 رقم باشد"
//       }
//     },
//   },
//   {
//     name: "societyRelationType",
//     inputType: "text",
//     label: "نوع ارتباط با جامعه",
//     size: { md: 3 },
//     rules: {
//       required: "نوع ارتباط با جامعه الزامی است"
//     },
//   },
//   {
//     name: "auditorName",
//     inputType: "text",
//     label: "نام حسابرس",
//     size: { md: 3 },
//     rules: {
//       required: "نام حسابرس الزامی است"
//     },
//   },
//   {
//     name: "mergerDate",
//     inputType: "date",
//     label: "تاریخ ادغام",
//     size: { md: 3 },
//     rules: { },
//     elementProps: {
//       setDay: (value: any) => {
//         setValue("mergerDate", value);
//       },
//       value: "",
//     },
//   },
//   {
//     name: "mergedInstituteName",
//     inputType: "text",
//     label: "نام موسسه ادغام‌شونده",
//     size: { md: 3 },
//     rules: { },
//   },
//   {
//     name: "mergedInstituteMembership",
//     inputType: "text",
//     label: "شماره عضویت ادغام‌شونده",
//     size: { md: 3 },
//     rules: { },
//   },
//   {
//     name: "dissolutionDate",
//     inputType: "date",
//     label: "تاریخ انحلال",
//     size: { md: 3 },
//     rules: { },
//     elementProps: {
//       setDay: (value: any) => {
//         setValue("dissolutionDate", value);
//       },
//       value: "",
//     },
//   },
//   {
//     name: "dissolutionGazetteNumber",
//     inputType: "text",
//     label: "شماره روزنامه انحلال",
//     size: { md: 3 },
//     rules: { },
//   },
//   {
//     name: "dissolutionGazetteDate",
//     inputType: "date",
//     label: "تاریخ روزنامه انحلال",
//     size: { md: 3 },
//     rules: { },
//     elementProps: {
//       setDay: (value: any) => {
//         setValue("dissolutionGazetteDate", value);
//       },
//       value: "",
//     },
//   },
// ];
