import { FormItem } from "types/formItem";

export const AddressFormItemsDTO = (
  setValue: (name: any, val: any) => void,
  options: any,
  disabled?:boolean
): FormItem[] => [
  {
    name: "cityIdAddress",
    inputType: "autocomplete",
    label: "شهر",
    size: { md: 4 },
    options: options?.cityOptions?.map((item:any)=>({value:item?.id,title:item?.name}))??[{value:0,title:""}],    storeValueAs: 'id',
    rules: { required: "انتخاب شهر الزامی است" },
    elementProps:{
      disabled:disabled
    }
  },
  {
    name: "streetAddress",
    inputType: "text",
    label: "خیابان",
    size: { md: 4 },
    rules: { required: "نام خیابان الزامی است" },
    elementProps:{
      disabled:disabled
    }
  },
  {
    name: "sideStreetAddress",
    inputType: "text",
    label: "خیابان فرعی",
    size: { md: 4 },
    rules: { },
    elementProps:{
      disabled:disabled
    }
  },
  {
    name: "alleyAddress",
    inputType: "text",
    label: "کوچه",
    size: { md: 4 },
    rules: { },
    elementProps:{
      disabled:disabled
    }
  },
  {
    name: "plateNoAddress",
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
    elementProps:{
      disabled:disabled
    }
  },
  {
    name: "unitNoAddress",
    inputType: "text",
    label: "واحد",
    size: { md: 4 },
    rules: { 
      pattern: {
        value: /^[0-9]+$/,
        message: "شماره واحد باید عددی باشد"
      }
    },
    elementProps:{
      disabled:disabled
    }
  },
  {
    name: "floorAddress",
    inputType: "text",
    label: "طبقه",
    size: { md: 4 },
    rules: { 
      pattern: {
        value: /^[0-9]+$/,
        message: "شماره طبقه باید عددی باشد"
      }
    },
    elementProps:{
      disabled:disabled
    }
  },
  {
    name: "postalCodeAddress",
    inputType: "text",
    label: "کد پستی",
    size: { md: 4 },
    rules: { 
      required: "کد پستی الزامی است",
      pattern: {
        value: /^[0-9]{10}$/,
        message: "کد پستی باید 10 رقم باشد"
      }
    },
    elementProps:{
      disabled:disabled
    }
  },
  {
    name: "mailBoxAddress",
    inputType: "text",
    label: "صندوق پستی",
    size: { md: 4 },
    rules: { },
    elementProps:{
      disabled:disabled
    }
  },
];