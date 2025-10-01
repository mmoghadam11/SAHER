import { useQuery } from "@tanstack/react-query";
import { useAuth } from "hooks/useAuth";
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

export const getBasicInfoItems = (
  setValue: (name: any, val: any) => void,
  city:any
): FormItem[] => {
  return [
    {
      name: "name",
      inputType: "text",
      label: "نام موسسه",
      size: { md: 3 },
      rules: { required: "نام موسسه الزامی است" },
    },
    {
      name: "latinName",
      inputType: "text",
      label: "نام لاتین",
      size: { md: 3 },
      rules: { required: "نام لاتین الزامی است" },
    },
    {
      name: "nationalId",
      inputType: "text",
      label: "شناسه ملی",
      size: { md: 3 },
      rules: {
        required: "شناسه ملی الزامی است",
        pattern: {
          value: /^[0-9]{10}$/,
          message: "شناسه ملی باید 10 رقم باشد",
        },
      },
    },
    {
      name: "registerNo",
      inputType: "text",
      label: "شماره ثبت",
      size: { md: 3 },
      rules: { required: "شماره ثبت الزامی است" },
    },
    {
      name: "registerDate",
      inputType: "date",
      label: "تاریخ ثبت",
      size: { md: 3 },
      rules: { required: "تاریخ ثبت الزامی است" },
      elementProps: {
        setDay: (value: any) => {
          setValue("registerDate", value);
          // این تابع باید در کامپوننت والد تعریف شود
        },
        value: "", // مقدار اولیه
      },
    },
    // {
    //   name: "registrationLocation",
    //   inputType: "text",
    //   label: "محل ثبت",
    //   size: { md: 3 },
    //   rules: { required: "محل ثبت الزامی است" },
    // },
    {
      name: "establishmentDate",
      inputType: "date",
      label: "تاریخ تأسیس",
      size: { md: 3 },
      rules: { required: "تاریخ تأسیس الزامی است" },
      elementProps: {
        setDay: (value: any) => {
          // این تابع باید در کامپوننت والد تعریف شود
          setValue("establishmentDate", value);
        },
        value: "", // مقدار اولیه
      },
    },
    {
      name: "cdRegisterPlaceId", // تغییر نام فیلد به province
      inputType: "autocomplete", // تغییر به autocomplete
      label: "شهر",
      size: { md: 3 },
      options: city?.map((item:any)=>({value:item?.id,title:item?.name}))??[{value:0,title:""}],
      rules: {
        required: "انتخاب شهر الزامی است",
      },
    },
  ];
 
};
