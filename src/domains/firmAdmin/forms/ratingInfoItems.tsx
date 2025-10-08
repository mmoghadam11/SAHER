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

export const ratingInfoItems = (
  setValue: (name: any, val: any) => void
): FormItem[] => [
  {
    name: "statusControlRank",
    inputType: "text",
    label: "رتبه کنترل وضعیت",
    size: { md: 3 },
    // rules: {
    //   required: "رتبه کنترل وضعیت الزامی است",
    // },
    elementProps: {
      disabled: true,
    },
  },
  {
    name: "statusControlScore",
    inputType: "text",
    label: "امتیاز وضعیت",
    size: { md: 3 },
    // rules: {
    //   required: "امتیاز وضعیت الزامی است",
    //   pattern: {
    //     value: /^[0-9]+$/,
    //     message: "امتیاز باید عددی باشد",
    //   },
    // },
    elementProps: {
      disabled: true,
    },
  },
  {
    name: "statusControlRankReceiptDate",
    inputType: "date",
    label: "تاریخ دریافت رتبه وضعیت",
    size: { md: 3 },
    // rules: { required: "تاریخ دریافت رتبه وضعیت الزامی است" },
    elementProps: {
      setDay: (value: any) => {
        setValue("statusControlRankReceiptDate", value);
      },
      value: "",
      disabled: true,
    },
  },
  {
    name: "statusControlRankReceiptLetterNo",
    inputType: "text",
    label: "شماره نامه رتبه وضعیت",
    size: { md: 3 },
    // rules: {
    //   required: "شماره نامه رتبه وضعیت الزامی است",
    // },
    elementProps: {
      disabled: true,
    },
  },
  {
    name: "qcRank",
    inputType: "text",
    label: "رتبه کنترل کیفیت",
    size: { md: 3 },
    // rules: {
    //   required: "رتبه کنترل کیفیت الزامی است",
    // },
    elementProps: {
      disabled: true,
    },
  },
  {
    name: "qcScore",
    inputType: "text",
    label: "امتیاز کیفیت",
    size: { md: 3 },
    // rules: {
    //   required: "امتیاز کیفیت الزامی است",
    //   pattern: {
    //     value: /^[0-9]+$/,
    //     message: "امتیاز باید عددی باشد",
    //   },
    // },
    elementProps: {
      disabled: true,
    },
  },
  {
    name: "qcRankReceiptDate",
    inputType: "date",
    label: "تاریخ دریافت رتبه کیفیت",
    size: { md: 3 },
    // rules: { required: "تاریخ دریافت رتبه کیفیت الزامی است" },
    elementProps: {
      setDay: (value: any) => {
        setValue("qcRankReceiptDate", value);
      },
      value: "",
      disabled: true,
    },
  },
  {
    name: "qcRankReceiptLetterNo",
    inputType: "text",
    label: "شماره نامه رتبه کیفیت",
    size: { md: 3 },
    // rules: {
    //   required: "شماره نامه رتبه کیفیت الزامی است",
    // },
    elementProps: {
      disabled: true,
    },
  },
];
// export const ratingInfoItems = (setValue: (name: any, val: any) => void): FormItem[] => [
//   {
//     name: "statusRank",
//     inputType: "text",
//     label: "رتبه کنترل وضعیت",
//     size: { md: 3 },
//     rules: {
//       required: "رتبه کنترل وضعیت الزامی است"
//     },
//   },
//   {
//     name: "statusScore",
//     inputType: "text",
//     label: "امتیاز وضعیت",
//     size: { md: 3 },
//     rules: {
//       required: "امتیاز وضعیت الزامی است",
//       pattern: {
//         value: /^[0-9]+$/,
//         message: "امتیاز باید عددی باشد"
//       }
//     },
//   },
//   {
//     name: "statusRankDate",
//     inputType: "date",
//     label: "تاریخ دریافت رتبه وضعیت",
//     size: { md: 3 },
//     rules: { required: "تاریخ دریافت رتبه وضعیت الزامی است" },
//     elementProps: {
//       setDay: (value: any) => {
//         setValue("statusRankDate", value);
//       },
//       value: "",
//     },
//   },
//   {
//     name: "statusRankLetterNumber",
//     inputType: "text",
//     label: "شماره نامه رتبه وضعیت",
//     size: { md: 3 },
//     rules: {
//       required: "شماره نامه رتبه وضعیت الزامی است"
//     },
//   },
//   {
//     name: "qualityRank",
//     inputType: "text",
//     label: "رتبه کنترل کیفیت",
//     size: { md: 3 },
//     rules: {
//       required: "رتبه کنترل کیفیت الزامی است"
//     },
//   },
//   {
//     name: "qualityScore",
//     inputType: "text",
//     label: "امتیاز کیفیت",
//     size: { md: 3 },
//     rules: {
//       required: "امتیاز کیفیت الزامی است",
//       pattern: {
//         value: /^[0-9]+$/,
//         message: "امتیاز باید عددی باشد"
//       }
//     },
//   },
//   {
//     name: "qualityRankDate",
//     inputType: "date",
//     label: "تاریخ دریافت رتبه کیفیت",
//     size: { md: 3 },
//     rules: { required: "تاریخ دریافت رتبه کیفیت الزامی است" },
//     elementProps: {
//       setDay: (value: any) => {
//         setValue("qualityRankDate", value);
//       },
//       value: "",
//     },
//   },
//   {
//     name: "qualityRankLetterNumber",
//     inputType: "text",
//     label: "شماره نامه رتبه کیفیت",
//     size: { md: 3 },
//     rules: {
//       required: "شماره نامه رتبه کیفیت الزامی است"
//     },
//   },
// ];
