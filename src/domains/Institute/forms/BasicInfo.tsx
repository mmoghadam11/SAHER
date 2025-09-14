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

export const basicInfoItems:FormItem[] = [
        {
          name: "instituteName",
          inputType: "text",
          label: "نام موسسه",
          size: { md: 6 },
          rules: { required: "نام موسسه الزامی است" },
        },
        {
          name: "englishName",
          inputType: "text",
          label: "نام لاتین",
          size: { md: 6 },
          rules: { required: "نام لاتین الزامی است" },
        },
        {
          name: "nationalId",
          inputType: "text",
          label: "شناسه ملی",
          size: { md: 6 },
          rules: {
            required: "شناسه ملی الزامی است",
            pattern: {
              value: /^[0-9]{11}$/,
              message: "شناسه ملی باید 11 رقم باشد",
            },
          },
        },
        {
          name: "registrationNumber",
          inputType: "text",
          label: "شماره ثبت",
          size: { md: 6 },
          rules: { required: "شماره ثبت الزامی است" },
        },
        {
          name: "registrationDate",
          inputType: "date",
          label: "تاریخ ثبت",
          size: { md: 6 },
          rules: { required: "تاریخ ثبت الزامی است" },
          elementProps: {
            setDay: (value: any) => {
              // این تابع باید در کامپوننت والد تعریف شود
            },
            value: "", // مقدار اولیه
          },
        },
        {
          name: "registrationLocation",
          inputType: "text",
          label: "محل ثبت",
          size: { md: 6 },
          rules: { required: "محل ثبت الزامی است" },
        },
        {
          name: "establishmentDate",
          inputType: "date",
          label: "تاریخ تأسیس",
          size: { md: 6 },
          rules: { required: "تاریخ تأسیس الزامی است" },
          elementProps: {
            setDay: (value: any) => {
              // این تابع باید در کامپوننت والد تعریف شود
            },
            value: "", // مقدار اولیه
          },
        },
        {
          name: "status",
          inputType: "select",
          label: "وضعیت",
          size: { md: 6 },
          options: [
            { value: "فعال", title: "فعال" },
            { value: "غیرفعال", title: "غیرفعال" },
          ],
          rules: { required: "وضعیت الزامی است" },
        },
      ];