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
    // {
    //   name: "status",
    //   inputType: "select",
    //   label: "وضعیت",
    //   size: { md: 3 },
    //   options: [
    //     { value: "true", title: "فعال" },
    //     { value: "false", title: "غیرفعال" },
    //   ],
    //   rules: { required: "وضعیت الزامی است" },
    // },
    {
      name: "registerPlaceId", // تغییر نام فیلد به province
      inputType: "autocomplete", // تغییر به autocomplete
      label: "شهر",
      size: { md: 3 },
      options: city?.map((item:any)=>({value:item?.id,title:item?.name}))??[{value:0,title:""}],
      rules: {
        required: "انتخاب شهر الزامی است",
      },
      elementProps: {
        // اضافه کردن propsهای خاص برای Autocomplete
        renderOption: (props: any, option: any) => (
          <li {...props} key={option.value}>
            {option.title}
          </li>
        ),
        isOptionEqualToValue: (option: any, value: any) => {
          return option.value === value?.value;
        },
        getOptionLabel: (option: any) => option.title || "",
      },
    },
  ];
  // return [
  //   {
  //     name: "instituteName",
  //     inputType: "text",
  //     label: "نام موسسه",
  //     size: { md: 3 },
  //     rules: { required: "نام موسسه الزامی است" },
  //   },
  //   {
  //     name: "englishName",
  //     inputType: "text",
  //     label: "نام لاتین",
  //     size: { md: 3 },
  //     rules: { required: "نام لاتین الزامی است" },
  //   },
  //   {
  //     name: "nationalId",
  //     inputType: "text",
  //     label: "شناسه ملی",
  //     size: { md: 3 },
  //     rules: {
  //       required: "شناسه ملی الزامی است",
  //       pattern: {
  //         value: /^[0-9]{11}$/,
  //         message: "شناسه ملی باید 11 رقم باشد",
  //       },
  //     },
  //   },
  //   {
  //     name: "registrationNumber",
  //     inputType: "text",
  //     label: "شماره ثبت",
  //     size: { md: 3 },
  //     rules: { required: "شماره ثبت الزامی است" },
  //   },
  //   {
  //     name: "registrationDate",
  //     inputType: "date",
  //     label: "تاریخ ثبت",
  //     size: { md: 3 },
  //     rules: { required: "تاریخ ثبت الزامی است" },
  //     elementProps: {
  //       setDay: (value: any) => {
  //         setValue("registrationDate",value);
  //         // این تابع باید در کامپوننت والد تعریف شود
  //       },
  //       value: "", // مقدار اولیه
  //     },
  //   },
  //   {
  //     name: "registrationLocation",
  //     inputType: "text",
  //     label: "محل ثبت",
  //     size: { md: 3 },
  //     rules: { required: "محل ثبت الزامی است" },
  //   },
  //   {
  //     name: "establishmentDate",
  //     inputType: "date",
  //     label: "تاریخ تأسیس",
  //     size: { md: 3 },
  //     rules: { required: "تاریخ تأسیس الزامی است" },
  //     elementProps: {
  //       setDay: (value: any) => {
  //         // این تابع باید در کامپوننت والد تعریف شود
  //         setValue("establishmentDate",value)
  //       },
  //       value: "", // مقدار اولیه
  //     },
  //   },
  //   {
  //     name: "status",
  //     inputType: "select",
  //     label: "وضعیت",
  //     size: { md: 3 },
  //     options: [
  //       { value: "فعال", title: "فعال" },
  //       { value: "غیرفعال", title: "غیرفعال" },
  //     ],
  //     rules: { required: "وضعیت الزامی است" },
  //   },
  // ];
};
