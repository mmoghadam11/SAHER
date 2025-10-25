import { FormItem } from "types/formItem";

export const BranchFormItems = (
  setValue: (name: any, val: any) => void,
  options: any
): FormItem[] => {
  return [
    {
      name: "name",
      inputType: "text",
      label: "نام شعبه",
      size: { md: 6 },
      rules: { required: "نام شعبه الزامی است" },
    },
    {
      name: "cdOwnershipTypeId",
      inputType: "select",
      label: "نوع مالکیت",
      size: { md: 6 },
      options: options?.ownershipTypeOptions?.map((item: any) => ({ value: item?.id, title: item?.value })) ?? [{ value: 0, title: "خالی" }],
      rules: { required: "انتخاب نوع مالکیت الزامی است" },
    },
    {
      name: "newspaperNotificationNo",
      inputType: "text",
      label: "شماره آگهی",
      size: { md: 6 },
      rules: {
        required: "شماره آگهی الزامی است",
        pattern: {
          value: /^[0-9]+$/,
          message: "شماره آگهی باید عدد باشد",
        },
      },
    },
    {
      name: "newspaperNotificationDate",
      inputType: "date",
      label: "تاریخ آگهی",
      size: { md: 6 },
      rules: { required: "تاریخ آگهی الزامی است" },
      elementProps: {
        setDay: (value: any) => setValue("newspaperNotificationDate", value),
        value: "",
      },
    },
    {
      name: "morguePlace",
      inputType: "text",
      label: "محل نگهداری اسناد",
      size: { md: 6 },
      rules: { required: "محل نگهداری اسناد الزامی است" },
    },
    {
      name: "responsiblePersonId",
      inputType: "autocomplete",
      label: "مدیر مسئول شعبه",
      size: { md: 6 },
      options: options?.PersonnelInfo?.map((item: any) => ({ 
        value: item?.id, 
        title: `${item?.firstName} ${item?.lastName} - ${item?.nationalCode}`
      })) ?? [{ value: 0, title: "خالی" }],
      storeValueAs: 'id',
      rules: { required: "انتخاب مدیر مسئول شعبه الزامی است" },
    },
    {
      name: "supervisorPersonId",
      inputType: "autocomplete",
      label: "ناظر",
      size: { md: 6 },
      options: options?.PersonnelInfo?.map((item: any) => ({ 
        value: item?.id, 
        title: `${item?.firstName} ${item?.lastName} - ${item?.nationalCode}`
      })) ?? [{ value: 0, title: "خالی" }],
      storeValueAs: 'id',
      rules: { required: "انتخاب ناظر الزامی است" },
    },
  ];
};