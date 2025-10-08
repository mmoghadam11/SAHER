import { FormItem } from "types/formItem";

export const PartnerFormItems = (
    options:any
): FormItem[] => [
    {
      name: "responsiblePersonId",
      inputType: "autocomplete",
      label: "شریک",
      size: { md: 6 },
      options: options?.PersonnelInfo?.map((item: any) => ({ 
        value: item?.id, 
        title: `${item?.firstName} ${item?.lastName} - ${item?.nationalCode}`
      })) ?? [{ value: 0, title: "خالی" }],
      storeValueAs: 'id',
      rules: { required: "انتخاب شخص مسئول الزامی است" },
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