import { FormItem } from "types/formItem";


export const FirmContractItems = (
  setValue: (name: any, val: any) => void,
  Options?: any
): FormItem[] => {
  return [
    // {
    //   name: "auditingFirmId",
    //   inputType: "text",
    //   label: "شناسه موسسه حسابرسی",
    //   size: { md: 4 },
    // },
    {
      name: "clientRequestNo",
      inputType: "text",
      label: "شماره درخواست مشتری",
      size: { md: 4 },
    },
    {
      name: "clientRequestDate",
      inputType: "date",
      label: "تاریخ درخواست مشتری",
      size: { md: 4 },
      elementProps: {
        setDay: (v: any) => setValue("clientRequestDate", v),
        value: "",
      },
    },
    {
      name: "cdServiceTypeId",
      inputType: "select",
      label: "شناسه نوع خدمت",
      size: { md: 4 },
      options: Options?.serviceTypeOptions?.map((i: any) => ({
        value: i?.id,
        title: i?.value,
      })) ?? [{ value: 0, title: "خالی" }],
      placeholder: "فقط عدد",
      rules: {
        required: "شناسه نوع خدمت الزامی است",
        pattern: { value: /^[0-9]+$/, message: "باید فقط عدد وارد شود" },
      },
    },
    {
      name: "applicatorFirstName",
      inputType: "text",
      label: "نام متقاضی",
      size: { md: 3 },
    },
    {
      name: "applicatorLastName",
      inputType: "text",
      label: "نام خانوادگی متقاضی",
      size: { md: 3 },
    },
    {
      name: "applicatorNationalCode",
      inputType: "text",
      label: "کد ملی متقاضی",
      size: { md: 3 },
      rules:{
        pattern: {
        value: /^[0-9]{10}$/,
        message: "کد ملی باید 10 رقم باشد"
      }
      }
      
    },
    {
      name: "applicatorRrole",
      inputType: "text",
      label: "نقش متقاضی",
      size: { md: 3 },
    },
    {
      name: "acceptRefuseJob",
      inputType: "select",
      label: "قبول/رد کار",
      size: { md: 4 },
      options: [
        { value: "true", title: "قبول" },
        { value: "false", title: "رد" },
      ],
      rules: {
        required: "تایین قبولی الزامی است",
      },
    },
    {
      name: "refuseReason",
      inputType: "text",
      label: "دلیل رد",
      size: { md: 4 },
    },
    {
      name: "cdContractTypeId",
      inputType: "select",
      label: "شناسه نوع قرارداد",
      size: { md: 4 },
      options: Options?.contractTypeOptions?.map((i: any) => ({
        value: i?.id,
        title: i?.value,
      })) ?? [{ value: 0, title: "خالی" }],
      placeholder: "فقط عدد",
      rules: {
        required: "شناسه نوع قرارداد الزامی است",
        pattern: { value: /^[0-9]+$/, message: "باید فقط عدد وارد شود" },
      },
    },
    {
      name: "contractPreparationDate",
      inputType: "date",
      label: "تاریخ تنظیم قرارداد",
      size: { md: 4 },
      elementProps: {
        setDay: (v: any) => setValue("contractPreparationDate", v),
        value: "",
      },
    },
    {
      name: "contractConclusionDate",
      inputType: "date",
      label: "تاریخ انعقاد قرارداد",
      size: { md: 4 },
      elementProps: {
        setDay: (v: any) => setValue("contractConclusionDate", v),
        value: "",
      },
    },
    {
      name: "returnSignedContractDate",
      inputType: "date",
      label: "تاریخ عودت قرارداد امضا شده",
      size: { md: 4 },
      elementProps: {
        setDay: (v: any) => setValue("returnSignedContractDate", v),
        value: "",
      },
    },
    {
      name: "registeredContractTerminationDate",
      inputType: "date",
      label: "تاریخ خاتمه ثبت قرارداد",
      size: { md: 4 },
      elementProps: {
        setDay: (v: any) => setValue("registeredContractTerminationDate", v),
        value: "",
      },
    },
    {
      name: "contractSystemRegistrationDate",
      inputType: "date",
      label: "تاریخ ثبت در سیستم",
      size: { md: 4 },
      elementProps: {
        setDay: (v: any) => setValue("contractSystemRegistrationDate", v),
        value: "",
      },
    },
    {
      name: "contractSystemRegistrationDelay",
      inputType: "text",
      label: "تاخیر ثبت در سیستم",
      size: { md: 4 },
      placeholder: "به عدد وارد شود",
    },
    {
      name: "startFiscalYear",
      inputType: "date",
      label: "شروع سال مالی",
      size: { md: 4 },
      rules: { required: "شروع سال مالی الزامی است" },
      elementProps: {
        setDay: (v: any) => setValue("startFiscalYear", v),
        value: "",
      },
    },
    {
      name: "endFiscalYear",
      inputType: "date",
      label: "پایان سال مالی",
      size: { md: 4 },
      rules: { required: "پایان سال مالی الزامی است" },
      elementProps: {
        setDay: (v: any) => setValue("endFiscalYear", v),
        value: "",
      },
    },
    {
      name: "inventoryCountingStartDate",
      inputType: "date",
      label: "شروع شمارش موجودی",
      size: { md: 4 },
      elementProps: {
        setDay: (v: any) => setValue("inventoryCountingStartDate", v),
        value: "",
      },
    },
    {
      name: "inventoryCountingEndDate",
      inputType: "date",
      label: "پایان شمارش موجودی",
      size: { md: 4 },
      elementProps: {
        setDay: (v: any) => setValue("inventoryCountingEndDate", v),
        value: "",
      },
    },
    {
      name: "auditTeamDispatchDateImplicit",
      inputType: "date",
      label: "تاریخ اعزام ضمنی تیم حسابرسی",
      size: { md: 4 },
      elementProps: {
        setDay: (v: any) => setValue("auditTeamDispatchDateImplicit", v),
        value: "",
      },
    },
    {
      name: "auditTeamDispatchTerminateDateImplicit",
      inputType: "date",
      label: "تاریخ خاتمه اعزام ضمنی",
      size: { md: 4 },
      elementProps: {
        setDay: (v: any) =>
          setValue("auditTeamDispatchTerminateDateImplicit", v),
        value: "",
      },
    },
    {
      name: "auditTeamDispatchDateFinal",
      inputType: "date",
      label: "تاریخ اعزام نهایی تیم حسابرسی",
      size: { md: 4 },
      elementProps: {
        setDay: (v: any) => setValue("auditTeamDispatchDateFinal", v),
        value: "",
      },
    },
    {
      name: "auditTeamDispatchTerminateDateFinal",
      inputType: "date",
      label: "تاریخ خاتمه اعزام نهایی",
      size: { md: 4 },
      elementProps: {
        setDay: (v: any) => setValue("auditTeamDispatchTerminateDateFinal", v),
        value: "",
      },
    },
    {
      name: "invoiceDate",
      inputType: "date",
      label: "تاریخ فاکتور",
      size: { md: 4 },
      elementProps: {
        setDay: (v: any) => setValue("invoiceDate", v),
        value: "",
      },
    },
    {
      name: "finalInvoiceHour",
      inputType: "text",
      label: "ساعات فاکتور نهایی",
      size: { md: 3 },
      placeholder: "به عدد وارد شود",
    },
    {
      name: "finalInvoiceAmount",
      inputType: "text",
      label: "مبلغ نهایی فاکتور",
      size: { md: 3 },
      placeholder: "به عدد وارد شود",
    },
    {
      name: "invoiceIssueTitle",
      inputType: "text",
      label: "عنوان صدور فاکتور",
      size: { md: 6 },
    },
    {
      name: "cdPersonalityTypeId",
      inputType: "select",
      label: "نوع شخصیت",
      size: { md: 4 },
      options: Options?.personalityTypeOptions?.map((i: any) => ({
        value: i?.id,
        title: i?.value,
      })) ?? [{ value: 0, title: "خالی" }],
      placeholder: "فقط عدد",
      rules: {
        required: "نوع شخصیت الزامی است",
        pattern: { value: /^[0-9]+$/, message: "باید فقط عدد وارد شود" },
      },
    },
    {
      name: "invoiceIssueDate",
      inputType: "date",
      label: "تاریخ صدور فاکتور",
      size: { md: 4 },
      elementProps: {
        setDay: (v: any) => setValue("invoiceIssueDate", v),
        value: "",
      },
    },
    {
      name: "invoiceAmount",
      inputType: "text",
      label: "مبلغ فاکتور",
      size: { md: 4 },
      placeholder: "به عدد وارد شود",
    },
    {
      name: "contractFirstSignName",
      inputType: "text",
      label: "نام امضا اول",
      size: { md: 4 },
    },
    {
      name: "contractFirstSignDate",
      inputType: "date",
      label: "تاریخ امضا اول قرارداد",
      size: { md: 4 },
      elementProps: {
        setDay: (v: any) => setValue("contractFirstSignDate", v),
        value: "",
      },
    },
    {
      name: "cdContractFirstSignRoleId",
      inputType: "select",
      label: "نقش امضا اول قرارداد",
      size: { md: 4 },
      options: Options?.contractRolesOptions?.map((i: any) => ({
        value: i?.id,
        title: i?.value,
      })) ?? [{ value: 0, title: "خالی" }],
      placeholder: "فقط عدد",
      rules: {
        required: "نقش امضا اول الزامی است",
        pattern: { value: /^[0-9]+$/, message: "باید فقط عدد وارد شود" },
      },
    },
    {
      name: "contract_secondSignName",
      inputType: "text",
      label: "نام امضا دوم",
      size: { md: 4 },
    },
    {
      name: "contractSecondSignDate",
      inputType: "date",
      label: "تاریخ امضا دوم قرارداد",
      size: { md: 4 },
      elementProps: {
        setDay: (v: any) => setValue("contractSecondSignDate", v),
        value: "",
      },
    },
    {
      name: "cdContractSecondSignRoleId",
      inputType: "select",
      label: "نقش امضا دوم قرارداد",
      size: { md: 4 },
      options: Options?.contractRolesOptions?.map((i: any) => ({
        value: i?.id,
        title: i?.value,
      })) ?? [{ value: 0, title: "خالی" }],
      placeholder: "فقط عدد",
      rules: {
        required: "نقش امضا دوم الزامی است",
        pattern: { value: /^[0-9]+$/, message: "باید فقط عدد وارد شود" },
      },
    },
    {
      name: "previousFirmIssuingAuditingReportName",
      inputType: "text",
      label: "نام موسسه قبلی",
      size: { md: 6 },
    },
    {
      name: "previousFirmIssuingAuditingReportMembershipNo",
      inputType: "text",
      label: "شماره عضویت موسسه قبلی",
      size: { md: 6 },
    },
    {
      name: "contractFirstSignManagerName",
      inputType: "text",
      label: "نام مدیر امضا اول",
      size: { md: 6 },
    },
    {
      name: "contractFirstSignManagerMembershipNo",
      inputType: "text",
      label: "شماره عضویت مدیر امضا اول",
      size: { md: 6 },
    },
    {
      name: "contractSecondSignManagerName",
      inputType: "text",
      label: "نام مدیر امضا دوم",
      size: { md: 6 },
    },
    {
      name: "contractSecondSignManagerMembershipNo",
      inputType: "text",
      label: "شماره عضویت مدیر امضا دوم",
      size: { md: 6 },
    },
    {
      name: "currentCaseCount",
      inputType: "text",
      label: "تعداد پرونده جاری",
      size: { md: 4 },
      placeholder: "به عدد وارد شود",
    },
    {
      name: "fixedCaseCount",
      inputType: "text",
      label: "تعداد پرونده قطعی",
      size: { md: 4 },
      placeholder: "به عدد وارد شود",
    },
  ];
};
