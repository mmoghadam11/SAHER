import { useQuery } from "@tanstack/react-query";
import { useAuth } from "hooks/useAuth";
import { FormItem } from "types/formItem";
import { FullInstituteType } from "types/institute";



export const MiniInfoItems = (
  setValue: (name: any, val: any) => void,
  getValues:() => any,
): FormItem[] => {
  return [
      {
        name: "firstName",
        inputType: "text",
        label: "نام",
        size: { md: 3 },
        rules: { required: "نام حسابدار الزامی است" },
        elementProps:{
          disabled:true
        }
      },
      {
        name: "lastName",
        inputType: "text",
        label: "نام خانوادگی",
        size: { md: 3 },
        elementProps:{
          disabled:true
        }
      },
      {
        name: "fatherName",
        inputType: "text",
        label: "نام پدر",
        size: { md: 3 },
        elementProps:{
          disabled:true
        }
      },
      {
        name: "nationalCode",
        inputType: "text",
        label: "کد ملی",
        size: { md: 3 },
        elementProps:{
          disabled:true
        }
      },
      // {
      //   name: "registerDate",
      //   inputType: "date",
      //   label: "تاریخ ثبت",
      //   size: { md: 3 },
      //   rules: { required: "تاریخ ثبت الزامی است" },
      //   elementProps: {
      //     setDay: (value: any) => {
      //       console.log("setDay=========>", value);
      //       setValue("registerDate", value);
      //     },
      //     value: "",
      //     disabled:true
      //   },
      // },
    ]
  
};
