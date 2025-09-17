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

export const contactInfoItems = (setValue: (name: any, val: any) => void): FormItem[] => [
  {
    name: "officePhoneNo",
    inputType: "text",
    label: "تلفن",
    size: { md: 4 },
    rules: { 
      required: "تلفن الزامی است",
      pattern: {
        value: /^[0-9]{8,11}$/,
        message: "شماره تلفن باید بین 8 تا 11 رقم باشد"
      }
    },
  },
  {
    name: "officeFaxNo",
    inputType: "text",
    label: "نمابر",
    size: { md: 4 },
    rules: { 
      pattern: {
        value: /^[0-9]{8,11}$/,
        message: "شماره نمابر باید بین 8 تا 11 رقم باشد"
      }
    },
  },
  {
    name: "officeEmail",
    inputType: "text",
    label: "ایمیل",
    size: { md: 4 },
    rules: { 
      required: "ایمیل الزامی است",
      pattern: {
        value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
        message: "فرمت ایمیل نامعتبر است"
      }
    },
  },
  {
    name: "officeWebSite",
    inputType: "text",
    label: "وب‌سایت",
    size: { md: 4 },
    rules: { 
      pattern: {
        value: /^(https?:\/\/)?([\da-z.-]+)\.([a-z.]{2,4})([/\w .-]*)*\/?$/,
        message: "فرمت وب‌سایت نامعتبر است"
      }
    },
  },
];
// export const contactInfoItems = (setValue: (name: any, val: any) => void): FormItem[] => [
//   {
//     name: "phone",
//     inputType: "text",
//     label: "تلفن",
//     size: { md: 4 },
//     rules: { 
//       required: "تلفن الزامی است",
//       pattern: {
//         value: /^[0-9]{8,11}$/,
//         message: "شماره تلفن باید بین 8 تا 11 رقم باشد"
//       }
//     },
//   },
//   {
//     name: "fax",
//     inputType: "text",
//     label: "نمابر",
//     size: { md: 4 },
//     rules: { 
//       pattern: {
//         value: /^[0-9]{8,11}$/,
//         message: "شماره نمابر باید بین 8 تا 11 رقم باشد"
//       }
//     },
//   },
//   {
//     name: "email",
//     inputType: "text",
//     label: "ایمیل",
//     size: { md: 4 },
//     rules: { 
//       required: "ایمیل الزامی است",
//       pattern: {
//         value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
//         message: "فرمت ایمیل نامعتبر است"
//       }
//     },
//   },
//   {
//     name: "website",
//     inputType: "text",
//     label: "وب‌سایت",
//     size: { md: 4 },
//     rules: { 
//       pattern: {
//         value: /^(https?:\/\/)?([\da-z.-]+)\.([a-z.]{2,4})([/\w .-]*)*\/?$/,
//         message: "فرمت وب‌سایت نامعتبر است"
//       }
//     },
//   },
// ];