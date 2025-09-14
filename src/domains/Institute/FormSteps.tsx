import React, { useState } from "react";
import {
  Stepper,
  Step,
  StepLabel,
  Button,
  Typography,
  Box,
  Paper,
  Container,
  Grid,
} from "@mui/material";
import { Controller, FormProvider, useForm } from "react-hook-form";
import { FullInstituteType } from "types/institute";

// کامپوننت‌های مربوط به هر دسته اطلاعات
import { Check, Inventory } from "@mui/icons-material";
import RenderFormInput from "components/render/formInputs/RenderFormInput";
import { useMutation } from "@tanstack/react-query";
import { useAuth } from "hooks/useAuth";
import { useSnackbar } from "hooks/useSnackbar";
import { membershipInfoItems } from "./forms/MembershipInfo";
import { basicInfoItems } from "./forms/BasicInfo";
// import MembershipInfo from './MembershipInfo';
// import FinancialInfo from './FinancialInfo';
// import ContactInfo from './ContactInfo';
// import CEOInfo from './CEOInfo';
// import BoardInfo from './BoardInfo';
// import RatingInfo from './RatingInfo';
// import SpecialInfo from './SpecialInfo';

const steps: string[] = [
  "اطلاعات پایه موسسه",
  "اطلاعات عضویت و پروانه",
  "اطلاعات مالی و اداری",
  "اطلاعات تماس",
  "اطلاعات مدیرعامل",
  "اطلاعات هیئت مدیره",
  "رتبه‌بندی و کنترل",
  "اطلاعات تخصصی",
];

export default function FormSteps(): JSX.Element {
  const {
    handleSubmit,
    control,
    formState: { errors },
    reset,
  } = useForm<any>();
  const Auth = useAuth();
  const snackbar = useSnackbar();
  const { mutate, isLoading } = useMutation({
    mutationFn: Auth?.serverCall,
  });

  const [formData, setFormData] = useState<{
    [K in keyof FullInstituteType]: string;
  }>({} as { [K in keyof FullInstituteType]: string });
  interface FormData {
    id?: any;
    name: string;
    code: string;
    provinceId: string;
    provinceName: string;
    province?: any;
  }
  interface FormItem {
    name: keyof FullInstituteType;
    inputType: string;
    label: string;
    size: { md: number };
    rules?: any;
    options?: any[];
    elementProps?: any;
  }

  // تعریف نوع برای هر مرحله
  interface FormStep {
    name: string;
    formItems: FormItem[];
  }

  // آرایه مراحل و آیتم‌های فرم
  const formSteps: FormStep[] = [
    {
      name: "اطلاعات پایه موسسه",
      formItems: basicInfoItems
    },
    {
      name: "اطلاعات عضویت و پروانه",
      formItems: membershipInfoItems,
    },
    {
      name: "اطلاعات مالی و اداری",
      formItems: [
        // آیتم‌های مربوط به این مرحله را اینجا قرار دهید
      ],
    },
    {
      name: "اطلاعات تماس",
      formItems: [
        // آیتم‌های مربوط به این مرحله را اینجا قرار دهید
      ],
    },
    {
      name: "اطلاعات مدیرعامل",
      formItems: [
        // آیتم‌های مربوط به این مرحله را اینجا قرار دهید
      ],
    },
    {
      name: "اطلاعات هیئت مدیره",
      formItems: [
        // آیتم‌های مربوط به این مرحله را اینجا قرار دهید
      ],
    },
    {
      name: "رتبه‌بندی و کنترل",
      formItems: [
        // آیتم‌های مربوط به این مرحله را اینجا قرار دهید
      ],
    },
    {
      name: "اطلاعات تخصصی",
      formItems: [
        // آیتم‌های مربوط به این مرحله را اینجا قرار دهید
      ],
    },
    // به همین ترتیب برای مراحل دیگر
  ];
  const handleInputChange = (fieldName: any, value: string) => {
    setFormData((prev: any) => ({
      ...prev,
      [fieldName]: value,
    }));
  };

  const onSubmit = (data: FormData) => {
    // mutate(
    //   {
    //     entity: `township/${!!editeData ? "update" : "add"}`,
    //     method: !!editeData ? "put" : "post",
    //     data: formData,
    //   },
    //   {
    //     onSuccess: (res: any) => {
    //       if (!!editeData)
    //         snackbar(
    //           `به روز رسانی شهرستان انتخاب شده با موفقیت انجام شد`,
    //           "success"
    //         );
    //       else snackbar(`ایجاد شهرستان جدید با موفقیت انجام شد`, "success");
    //       refetch();
    //       //   handleClose();
    //     },
    //     onError: () => {
    //       snackbar("خطا در انجام عملیات", "error");
    //     },
    //   }
    // );
  };
  return (
    <Grid container justifyContent={"center"}>
      <Grid item md={11}></Grid>
      <Grid md={11} item>
        <Paper elevation={3} sx={{ p: 3, mt: 3, width: "100%" }}>
          <form onSubmit={handleSubmit(onSubmit)}>
            <Grid container spacing={3}>
              <Grid item md={11} display={"flex"}>
                <Inventory fontSize="large" />
                <Typography variant="h5">فرم اطلاعات موسسات</Typography>
              </Grid>
              {formSteps.map((stepItem, stepIndex) => (
                <Grid item container md={12} spacing={1}>
                  <Grid item md={12}>
                    <Typography variant="h6">{steps[stepIndex]}</Typography>
                  </Grid>
                  {stepItem?.formItems?.map((item) => (
                    <Grid item xs={12} md={item.size.md} key={item.name}>
                      <Controller
                        name={item.name}
                        control={control}
                        rules={item.rules}
                        render={({ field }) => (
                          <RenderFormInput
                            controllerField={field}
                            errors={errors}
                            {...item}
                            value={formData[item.name]}
                            onChange={(
                              e: React.ChangeEvent<HTMLInputElement>
                            ) => {
                              handleInputChange(item.name, e.target.value);
                              field.onChange(e);
                            }}
                          />
                        )}
                      />
                    </Grid>
                  ))}
                </Grid>
              ))}

              <Grid
                item
                xs={12}
                display="flex"
                justifyContent="flex-end"
                mt={2}
              >
                <Button variant="contained" startIcon={<Check />} type="submit">
                  ثبت
                </Button>
              </Grid>
            </Grid>
          </form>
        </Paper>
      </Grid>
    </Grid>
  );
}
