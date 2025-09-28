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

export const MiniInfoItems = (
  setValue: (name: any, val: any) => void,
  getValues:() => any,
): FormItem[] => {
  return [
      {
        name: "name",
        inputType: "text",
        label: "نام موسسه",
        size: { md: 3 },
        rules: { required: "نام موسسه الزامی است" },
        elementProps:{
          disabled:true
        }
      },
      {
        name: "latinName",
        inputType: "text",
        label: "نام لاتین",
        size: { md: 3 },
        rules: { required: "نام لاتین الزامی است" },
        elementProps:{
          disabled:true
        }
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
        elementProps:{
          disabled:true
        }
      },
      // {
      //   name: "registerNo",
      //   inputType: "text",
      //   label: "شماره ثبت",
      //   size: { md: 3 },
      //   rules: { required: "شماره ثبت الزامی است" },
      //   elementProps:{
      //     disabled:true
      //   }
      // },
      {
        name: "registerDate",
        inputType: "date",
        label: "تاریخ ثبت",
        size: { md: 3 },
        rules: { required: "تاریخ ثبت الزامی است" },
        elementProps: {
          setDay: (value: any) => {
            console.log("setDay=========>", value);
            setValue("registerDate", value);
          },
          // value: new Date()?.toISOString(),
          // value: moment(new Date()).format("jYYYY/jMM/jDD"),
          // value: getValues()["registerDate"],
          value: "2025-10-17T11:39:13.670Z",
          disabled:true
        },
      },
    ]
  
};
