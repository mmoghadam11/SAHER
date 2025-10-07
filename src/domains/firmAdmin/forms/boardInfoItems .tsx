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

export const boardInfoItems = (setValue: (name: any, val: any) => void): FormItem[] => [
  {
    name: "boardMembers",
    inputType: "text",
    label: "اسامی اعضا (با کاما جدا کنید)",
    size: { md: 3 },
    rules: { 
      required: "اسامی اعضای هیئت مدیره الزامی است",
      minLength: {
        value: 3,
        message: "حداقل یک عضو باید وارد شود"
      }
    },
    elementProps: {
      multiline: true,
      rows: 3,
      placeholder: "نام و نام خانوادگی اعضا را با کاما از هم جدا کنید",
    },
  },
  {
    name: "boardMembersNationalIds",
    inputType: "text",
    label: "کد ملی اعضا (با کاما جدا کنید)",
    size: { md: 3 },
    rules: { 
      required: "کد ملی اعضای هیئت مدیره الزامی است",
      validate: (value: string) => {
        if (value) {
          const ids = value.split(',');
          const valid = ids.every(id => /^[0-9]{10}$/.test(id.trim()));
          return valid || "کد ملی ها باید 10 رقمی و با کاما جدا شوند";
        }
        return true;
      }
    },
    elementProps: {
      multiline: true,
      rows: 3,
      placeholder: "کدهای ملی را با کاما از هم جدا کنید",
    },
  },
  {
    name: "boardMembersStartDate",
    inputType: "text",
    label: "تاریخ شروع عضویت (با کاما جدا کنید)",
    size: { md: 3 },
    rules: { 
      required: "تاریخ شروع عضویت الزامی است",
    },
    elementProps: {
      multiline: true,
      rows: 3,
      placeholder: "تاریخ‌ها را با کاما از هم جدا کنید",
    },
  },
  {
    name: "boardMembersEndDate",
    inputType: "text",
    label: "تاریخ پایان عضویت (با کاما جدا کنید)",
    size: { md: 3 },
    rules: { },
    elementProps: {
      multiline: true,
      rows: 3,
      placeholder: "تاریخ‌ها را با کاما از هم جدا کنید",
    },
  },
];