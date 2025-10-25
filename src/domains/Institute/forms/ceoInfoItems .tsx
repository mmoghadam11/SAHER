import { FullInstituteType } from "types/institute";
import { FormItem } from "types/formItem";

export const ceoInfoItems = (
  setValue: (name: any, val: any) => void,
  options: any
): FormItem[] => [
  {
    name: "directorPersonnelId",
    inputType: "autocomplete",
    label: "مدیرعامل",
    size: { md: 6 },
    options: options?.personnelOptions?.map((item: any) => ({
      value: item?.id,
      title: `${item?.firstName} ${item?.lastName} - ${item?.nationalCode}`,
    })) ?? [{ value: 0, title: "خالی" }],
    storeValueAs: "id",
    rules: { required: "انتخاب پرسنل الزامی است" },
  },
  {
    name: "directorAcceptanceDate",
    inputType: "date",
    label: "تاریخ شروع مدیریت",
    size: { md: 6 },
    rules: { required: "تاریخ شروع مدیریت الزامی است" },
    tempRules: { required: "تاریخ شروع مدیریت الزامی است" },
    elementProps: {
      setDay: (value: any) => {
        setValue("registerDate", value);
        // این تابع باید در کامپوننت والد تعریف شود
      },
      value: "", // مقدار اولیه
    },
  },
];

// [
//   {
//     name: "directorFirstName",
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
//     tempRules: {
//       required: "نام مدیرعامل الزامی است",
//       minLength: {
//         value: 2,
//         message: "نام باید حداقل 2 کاراکتر باشد"
//       }
//     },
//   },
//   {
//     name: "directorLastName",
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
//     tempRules: {
//       required: "نام خانوادگی مدیرعامل الزامی است",
//       minLength: {
//         value: 2,
//         message: "نام خانوادگی باید حداقل 2 کاراکتر باشد"
//       }
//     },
//   },
//   {
//     name: "directorNationalCode",
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
//     tempRules: {
//       required: "کد ملی مدیرعامل الزامی است",
//       pattern: {
//         value: /^[0-9]{10}$/,
//         message: "کد ملی باید 10 رقم باشد"
//       }
//     },
//   },
//   {
//     name: "directorAcceptanceDate",
//     inputType: "date",
//     label: "تاریخ شروع",
//     size: { md: 4 },
//     rules: { required: "تاریخ شروع مدیریت الزامی است" },
//     elementProps: {
//       setDay: (value: any) => {
//         setValue("directorAcceptanceDate", value);
//       },
//       value: "", // مقدار اولیه
//     },
//   },
//   {
//     name: "directorTerminateDate",
//     inputType: "date",
//     label: "تاریخ پایان",
//     size: { md: 4 },
//     rules: { },
//     elementProps: {
//       setDay: (value: any) => {
//         setValue("directorTerminateDate", value);
//       },
//       value: "", // مقدار اولیه
//     },
//   },
//   {
//     name: "directorMobileNo",
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
