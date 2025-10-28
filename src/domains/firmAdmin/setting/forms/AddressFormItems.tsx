import { FormItem } from "types/formItem";

export const AddressFormItems = (
  setValue: (name: any, val: any) => void,
  options: any
): FormItem[] => [
  {
    name: "placeType",
    inputType: "select",
    label: "نوع دفتر",
    size: { md: 4 },
    // options: options?.orderTypeOptions?.map((item: any) => ({
    //   value: item?.id,
    //   title: item?.value
    // })) ?? [{ value: 0, title: "خالی" }],
    options: [
      { value: "o", title: "موسسه" },
      { value: "b", title: "شعبه" },
    ],
    rules: { required: "انتخاب نوع آدرس الزامی است" },
  },
  {
    name: "branchId",
    inputType: "autocomplete",
    label: "شعبه",
    size: { md: 4 },
    options: options?.branchOptions?.map((item: any) => ({
      value: item?.id,
      title: item?.name
    })) ?? [{ value: 0, title: "خالی" }],
    storeValueAs:"id",
    rules: {
      validate: {
        // 'value' مقدار فعلی فیلد branchId هست
        // 'formValues' شامل تمام مقادیر فرم در لحظه اعتبارسنجی هست
        conditionalRequired: (value:any, formValues:any) => {
          // اگر placeType 'b' (شعبه) باشه:
          if (formValues.placeType === "b") {
            // چک میکنیم که branchId یک مقدار معتبر (غیر صفر و غیر خالی) داشته باشه
            // فرض میکنیم اگر مقدار 0 باشه یعنی "خالی" هست.
            if (!value || value === 0) {
              return "انتخاب شعبه برای نوع دفتر 'شعبه' الزامی است";
            }
          }
          // اگر placeType 'o' (موسسه) باشه:
          if (formValues.placeType === "o") {
            // چک میکنیم که branchId باید خالی باشه
            if (value && value !== 0) {
              return "برای نوع دفتر 'موسسه'، فیلد شعبه باید خالی باشد";
            }
          }
          // در غیر این صورت (مقادیر درست هستند یا شرط خاصی نیست)
          return true;
        },
      },
    },
  },
  {
    name: "cityId",
    inputType: "autocomplete",
    label: "شهر",
    size: { md: 4 },
    options: options?.cityOptions?.map((item: any) => ({
      value: item?.id,
      title: item?.name,
    })) ?? [{ value: 0, title: "" }],
    storeValueAs: "id",
    rules: { required: "انتخاب شهر الزامی است" },
  },
  {
    name: "street",
    inputType: "text",
    label: "خیابان",
    size: { md: 4 },
    rules: { required: "نام خیابان الزامی است" },
  },
  {
    name: "sideStreet",
    inputType: "text",
    label: "خیابان فرعی",
    size: { md: 4 },
    rules: {},
  },
  {
    name: "alley",
    inputType: "text",
    label: "کوچه",
    size: { md: 4 },
    rules: {},
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
        message: "شماره پلاک باید عددی باشد",
      },
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
        message: "شماره واحد باید عددی باشد",
      },
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
        message: "شماره طبقه باید عددی باشد",
      },
    },
  },
  {
    name: "postalCode",
    inputType: "text",
    label: "کد پستی",
    size: { md: 4 },
    rules: {
      required: "کد پستی الزامی است",
      pattern: {
        value: /^[0-9]{10}$/,
        message: "کد پستی باید 10 رقم باشد",
      },
    },
  },
  {
    name: "mailBox",
    inputType: "text",
    label: "صندوق پستی",
    size: { md: 4 },
    rules: {},
  },
];
