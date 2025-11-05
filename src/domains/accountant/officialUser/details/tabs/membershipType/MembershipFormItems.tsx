import { FormItem } from "types/formItem";

export const MembershipFormItems = (
  setValue: (name: any, val: any) => void,
  options: any,
  watchedValues: any 
): FormItem[] => {
const formItems: FormItem[] =[
  {
    // name: "cdMembershipTypeId",
    name: "cdServiceTypeId",
    inputType: "select",
    label: "نوع عضویت",
    size: { md: 6 },
    options: options?.membershipType?.map((item: any) => ({
      value: item?.id,
      title: item?.value,
    })) ?? [{ value: 0, title: "خالی" }],
    rules: { required: "انتخاب نوع عضویت الزامی است" },
  },
  {
    name: "changeDate",
    inputType: "date",
    label: "تاریخ تغییر عضویت",
    size: { md: 6 },
    rules: { required: "تاریخ تغییر عضویت الزامی است" },
    elementProps: {
      setDay: (value: any) => {
        setValue("changeDate", value);
      },
      value: "",
    },
  },
  {
    // name: "documentNumber",
    name: "document",
    inputType: "text",
    label: "مستندات",
    size: { md: 12 },
    rules: {},
  },
];

if (Number(watchedValues) === 63||Number(watchedValues) === 64 ) {
    formItems.push({
      name: "auditingFirmId",
      inputType: "autocomplete",
      label: "موسسه",
      size: { md: 12 }, 
      options: options?.firmOptions?.map((item: any) => ({ value: item.id, title: item.name })) ?? [{ value: 0, title: "خالی" }],
      storeValueAs: "id",
      rules: { required: "انتخاب موسسه الزامی است" },
    });
  }

  return formItems
}
  
  


