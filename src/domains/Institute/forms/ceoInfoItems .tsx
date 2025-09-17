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

export const ceoInfoItems = (setValue: (name: any, val: any) => void): FormItem[] => [
  {
    name: "directorFirstName",
    inputType: "text",
    label: "نام",
    size: { md: 4 },
    rules: { 
      required: "نام مدیرعامل الزامی است",
      minLength: {
        value: 2,
        message: "نام باید حداقل 2 کاراکتر باشد"
      }
    },
  },
  {
    name: "directorLastName",
    inputType: "text",
    label: "نام خانوادگی",
    size: { md: 4 },
    rules: { 
      required: "نام خانوادگی مدیرعامل الزامی است",
      minLength: {
        value: 2,
        message: "نام خانوادگی باید حداقل 2 کاراکتر باشد"
      }
    },
  },
  {
    name: "directorNationalCode",
    inputType: "text",
    label: "کد ملی",
    size: { md: 4 },
    rules: { 
      required: "کد ملی مدیرعامل الزامی است",
      pattern: {
        value: /^[0-9]{10}$/,
        message: "کد ملی باید 10 رقم باشد"
      }
    },
  },
  {
    name: "directorAcceptanceDate",
    inputType: "date",
    label: "تاریخ شروع",
    size: { md: 4 },
    rules: { required: "تاریخ شروع مدیریت الزامی است" },
    elementProps: {
      setDay: (value: any) => {
        setValue("directorAcceptanceDate", value);
      },
      value: "", // مقدار اولیه
    },
  },
  {
    name: "directorTerminateDate",
    inputType: "date",
    label: "تاریخ پایان",
    size: { md: 4 },
    rules: { },
    elementProps: {
      setDay: (value: any) => {
        setValue("directorTerminateDate", value);
      },
      value: "", // مقدار اولیه
    },
  },
  {
    name: "directorMobileNo",
    inputType: "text",
    label: "تلفن همراه",
    size: { md: 4 },
    rules: { 
      required: "تلفن همراه مدیرعامل الزامی است",
      pattern: {
        value: /^09[0-9]{9}$/,
        message: "شماره موبایل باید با 09 شروع شده و 11 رقم باشد"
      }
    },
  },
];
// export const ceoInfoItems = (setValue: (name: any, val: any) => void): FormItem[] => [
//   {
//     name: "ceoFirstName",
//     inputType: "text",
//     label: "نام",
//     size: { md: 4 },
//     rules: { 
//       required: "نام مدیرعامل الزامی است",
//       minLength: {
//         value: 2,
//         message: "نام باید حداقل 2 کاراکتر باشد"
//       }
//     },
//   },
//   {
//     name: "ceoLastName",
//     inputType: "text",
//     label: "نام خانوادگی",
//     size: { md: 4 },
//     rules: { 
//       required: "نام خانوادگی مدیرعامل الزامی است",
//       minLength: {
//         value: 2,
//         message: "نام خانوادگی باید حداقل 2 کاراکتر باشد"
//       }
//     },
//   },
//   {
//     name: "ceoNationalId",
//     inputType: "text",
//     label: "کد ملی",
//     size: { md: 4 },
//     rules: { 
//       required: "کد ملی مدیرعامل الزامی است",
//       pattern: {
//         value: /^[0-9]{10}$/,
//         message: "کد ملی باید 10 رقم باشد"
//       }
//     },
//   },
//   {
//     name: "ceoStartDate",
//     inputType: "date",
//     label: "تاریخ شروع",
//     size: { md: 4 },
//     rules: { required: "تاریخ شروع مدیریت الزامی است" },
//     elementProps: {
//       setDay: (value: any) => {
//         setValue("ceoStartDate", value);
//       },
//       value: "", // مقدار اولیه
//     },
//   },
//   {
//     name: "ceoEndDate",
//     inputType: "date",
//     label: "تاریخ پایان",
//     size: { md: 4 },
//     rules: { },
//     elementProps: {
//       setDay: (value: any) => {
//         setValue("ceoEndDate", value);
//       },
//       value: "", // مقدار اولیه
//     },
//   },
//   {
//     name: "ceoMobile",
//     inputType: "text",
//     label: "تلفن همراه",
//     size: { md: 4 },
//     rules: { 
//       required: "تلفن همراه مدیرعامل الزامی است",
//       pattern: {
//         value: /^09[0-9]{9}$/,
//         message: "شماره موبایل باید با 09 شروع شده و 11 رقم باشد"
//       }
//     },
//   },
// ];