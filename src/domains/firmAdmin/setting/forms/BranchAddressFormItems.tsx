import { FormItem } from "types/formItem";

export const BranchAddressFormItems = (
  setValue: (name: any, val: any) => void,
  options: any
): FormItem[] => {
  return [
    {
      name: "cityId",
      inputType: "autocomplete",
      label: "شهر",
      size: { md: 6 },
      options: options?.cityOptions?.map((item: any) => ({ value: item?.id, title: item?.name })) ?? [{ value: 0, title: "خالی" }],
      storeValueAs: 'id',
      rules: { required: "انتخاب شهر الزامی است" },
    },
    {
      name: "street",
      inputType: "text",
      label: "خیابان",
      size: { md: 6 },
      rules: { required: "نام خیابان الزامی است" },
    },
    {
      name: "sideStreet",
      inputType: "text",
      label: "خیابان فرعی",
      size: { md: 6 },
      rules: { },
    },
    {
      name: "alley",
      inputType: "text",
      label: "کوچه",
      size: { md: 6 },
      rules: { },
    },
    {
      name: "plateNo",
      inputType: "text",
      label: "پلاک",
      size: { md: 4 },
      rules: { 
        required: "شماره پلاک الزامی است",
        pattern: {
          value: /^[0-9]+$/,
          message: "شماره پلاک باید عددی باشد"
        }
      },
    },
    {
      name: "unitNo",
      inputType: "text",
      label: "واحد",
      size: { md: 4 },
      rules: { 
        pattern: {
          value: /^[0-9]+$/,
          message: "شماره واحد باید عددی باشد"
        }
      },
    },
    {
      name: "floor",
      inputType: "text",
      label: "طبقه",
      size: { md: 4 },
      rules: { 
        pattern: {
          value: /^[0-9]+$/,
          message: "شماره طبقه باید عددی باشد"
        }
      },
    },
    {
      name: "postalCode",
      inputType: "text",
      label: "کد پستی",
      size: { md: 6 },
      rules: { 
        required: "کد پستی الزامی است",
        pattern: {
          value: /^[0-9]{10}$/,
          message: "کد پستی باید 10 رقم باشد"
        }
      },
    },
    {
      name: "mailBox",
      inputType: "text",
      label: "صندوق پستی",
      size: { md: 6 },
      rules: { },
    },
  ];
};