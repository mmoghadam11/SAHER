import { useQuery } from "@tanstack/react-query";
import { FormItem } from "./DirectorItems";
import { useAuth } from "hooks/useAuth";

export const EduFinancialItems = (
  setValue: (name: any, val: any) => void,
  methodOptions:any
): FormItem[] => {
  return [
    {
      name: "signatoryName",
      inputType: "text",
      label: "نام امضاءکننده",
      size: { md: 4 },
      rules: { required: "نام امضاءکننده الزامی است" },
    },
    {
      name: "boardApprovalDate",
      inputType: "date",
      label: "تاریخ تصویب هیئت مدیره",
      size: { md: 4 },
      rules: { required: "تاریخ تصویب الزامی است" },
      elementProps: {
        setDay: (value: any) => setValue("boardApprovalDate", value),
        value: "",
      },
    },
    {
      name: "partnerApprovalDate",
      inputType: "date",
      label: "تاریخ تصویب شرکا",
      size: { md: 4 },
      rules: { required: "تاریخ تصویب شرکا الزامی است" },
      elementProps: {
        setDay: (value: any) => setValue("partnerApprovalDate", value),
        value: "",
      },
    },
    {
      name: "uploadDate",
      inputType: "date",
      label: "تاریخ بارگذاری",
      size: { md: 4 },
      rules: { required: "تاریخ بارگذاری الزامی است" },
      elementProps: {
        setDay: (value: any) => setValue("uploadDate", value),
        value: "",
      },
    },
    {
      name: "auditingReportUploadDate",
      inputType: "date",
      label: "تاریخ بارگذاری گزارش حسابرسی",
      size: { md: 4 },
      rules: { required: "تاریخ بارگذاری گزارش حسابرسی الزامی است" },
      elementProps: {
        setDay: (value: any) => setValue("auditingReportUploadDate", value),
        value: "",
      },
    },
    {
      name: "submissionDate",
      inputType: "date",
      label: "تاریخ ارسال",
      size: { md: 4 },
      rules: { required: "تاریخ ارسال الزامی است" },
      elementProps: {
        setDay: (value: any) => setValue("submissionDate", value),
        value: "",
      },
    },
    // {
    //   name: "auditingFirmName",
    //   inputType: "text",
    //   label: "نام موسسه حسابرسی",
    //   size: { md: 4 },
    //   rules: { required: "نام موسسه حسابرسی الزامی است" },
    // },
    {
      name: "fiscalYear",
      inputType: "text",
      label: "سال مالی",
      size: { md: 3 },
      placeholder:"شمسی به عدد",
      rules: {
        required: "سال مالی الزامی است",
        pattern: { value: /^[0-9]+$/, message: "باید فقط عدد وارد شود" },
        min: {
          value: 1350,
          message: "سال نباید قبل از 1350 باشد",
        },
        max: {
          value: 1440,
          message: "سال نباید بعد از 1440 باشد",
        },
      },
    },
    {
      name: "operatinIncome",
      inputType: "text",
      label: "درآمد عملیاتی",
      size: { md: 3 },
      placeholder:"مقدار ریال به عدد",
      rules: {
        required: "درآمد عملیاتی الزامی است",
        pattern: { value: /^[0-9]+$/, message: "باید فقط عدد وارد شود" },
      },
    },
    {
      name: "impureProfitLoos",
      inputType: "text",
      label: "سود/زیان ناخالص",
      size: { md: 3 },
      placeholder:"مقدار ریال به عدد",
      rules: {
        required: "سود/زیان ناخالص الزامی است",
        pattern: { value: /^[0-9]+$/, message: "باید فقط عدد وارد شود" },
      },
    },
    {
      name: "administrativeCosts",
      inputType: "text",
      label: "هزینه‌های اداری",
      placeholder:"مقدار ریال به عدد",
      size: { md: 3 },
      rules: {
        required: "هزینه‌های اداری الزامی است",
        pattern: { value: /^[0-9]+$/, message: "باید فقط عدد وارد شود" },
      },
    },
    {
      name: "otherIncome",
      inputType: "text",
      label: "سایر درآمدها",
      placeholder:"مقدار ریال به عدد",
      size: { md: 3 },
      rules: {
        required: "سایر درآمدها الزامی است",
        pattern: { value: /^[0-9]+$/, message: "باید فقط عدد وارد شود" },
      },
    },
    {
      name: "taxCost",
      inputType: "text",
      label: "هزینه مالیات",
      placeholder:"مقدار ریال به عدد",
      size: { md: 3 },
      rules: {
        required: "هزینه مالیات الزامی است",
        pattern: { value: /^[0-9]+$/, message: "باید فقط عدد وارد شود" },
      },
    },
    {
      name: "pureProfitLoos",
      inputType: "text",
      label: "سود/زیان خالص",
      placeholder:"مقدار ریال به عدد",
      size: { md: 3 },
      rules: {
        required: "سود/زیان خالص الزامی است",
        pattern: { value: /^[0-9]+$/, message: "باید فقط عدد وارد شود" },
      },
    },
    {
      name: "totalAsset",
      inputType: "text",
      label: "جمع دارایی‌ها",
      placeholder:"مقدار ریال به عدد",
      size: { md: 3 },
      rules: {
        required: "جمع دارایی‌ها الزامی است",
        pattern: { value: /^[0-9]+$/, message: "باید فقط عدد وارد شود" },
      },
    },
    {
      name: "totalDebt",
      inputType: "text",
      label: "جمع بدهی‌ها",
      placeholder:"مقدار ریال به عدد",
      size: { md: 3 },
      rules: {
        required: "جمع بدهی‌ها الزامی است",
        pattern: { value: /^[0-9]+$/, message: "باید فقط عدد وارد شود" },
      },
    },
    {
      name: "fascalYearFacilityBalance",
      inputType: "text",
      label: "مانده تسهیلات سال مالی",
      placeholder:"مقدار ریال به عدد",
      size: { md: 3 },
      rules: {
        required: "مانده تسهیلات سال مالی الزامی است",
        pattern: { value: /^[0-9]+$/, message: "باید فقط عدد وارد شود" },
      },
    },
    {
      name: "fascalYearFacilityUseMethod",
      inputType: "select",
      options: methodOptions?.map((item:any)=>({value:item?.id,title:item?.value}))??[{value:0,title:"خالی"}],
      label: "روش استفاده از تسهیلات سال مالی",
      size: { md: 3 },
      rules: {
        required: "روش استفاده از تسهیلات سال مالی الزامی است",
        // pattern: { value: /^[0-9]+$/, message: "باید فقط عدد وارد شود" },
      },
    },
    {
      name: "accumulatedProfitLossBalance",
      inputType: "text",
      label: "مانده سود/زیان انباشته",
      placeholder:"مقدار ریال به عدد",
      size: { md: 3 },
      rules: {
        required: "مانده سود/زیان انباشته الزامی است",
        pattern: { value: /^[0-9]+$/, message: "باید فقط عدد وارد شود" },
      },
    },
    {
      name: "operationCash",
      inputType: "text",
      label: "وجه نقد عملیاتی",
      placeholder:"مقدار ریال به عدد",
      size: { md: 3 },
      rules: {
        required: "وجه نقد عملیاتی الزامی است",
        pattern: { value: /^[0-9]+$/, message: "باید فقط عدد وارد شود" },
      },
    },
    {
      name: "impureSalary",
      inputType: "text",
      label: "حقوق ناخالص",
      placeholder:"مقدار ریال به عدد",
      size: { md: 3 },
      rules: {
        required: "حقوق ناخالص الزامی است",
        pattern: { value: /^[0-9]+$/, message: "باید فقط عدد وارد شود" },
      },
    },
    {
      name: "beggingYearInprogressWork",
      inputType: "text",
      label: "کار در جریان ابتدای سال",
      size: { md: 6 },
      rules: { required: "کار در جریان ابتدای سال الزامی است" },
    },
    {
      name: "endYearInprogressWork",
      inputType: "text",
      label: "کار در جریان پایان سال",
      size: { md: 6 },
      rules: { required: "کار در جریان پایان سال الزامی است" },
    },
  ];
};
