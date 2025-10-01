import React, { useEffect, useState } from "react";
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
import { useMutation, useQuery } from "@tanstack/react-query";
import { useAuth } from "hooks/useAuth";
import { useSnackbar } from "hooks/useSnackbar";
import FancyTicketDivider from "components/FancyTicketDivider";
import BackButton from "components/buttons/BackButton";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import { FormItem } from "domains/Institute/setting/forms/DirectorItems";
import { BasicFormItems } from "./forms/BasicFormItems";


export default function AddWorkgroup(): JSX.Element {
  const { id } = useParams();
  const { state } = useLocation();
  const {
    handleSubmit,
    control,
    formState: { errors },
    reset,
    setValue,
    getValues,
  } = useForm<any>({
    defaultValues: {
    // مقادیر اولیه برای تمام checkbox ها
    workingGroupMembership: false,
    internationalAssociations: false,
    professionalAssociations: false,
    retired: false,
    faculty: false,
  }
  });
  const Auth = useAuth();
  const snackbar = useSnackbar();
  const { mutate, isLoading } = useMutation({
    mutationFn: Auth?.serverCall,
  });

  const {
    data: cityOptions,
    status: cityOptions_status,
    refetch: cityOptions_refetch,
  } = useQuery<any>({
    queryKey: [`city/search-all`],
    queryFn: Auth?.getRequest,
    select: (res: any) => {
      return res?.data;
    },
  } as any);
  const {
    data: relOptions,
    status: relOptions_status,
    refetch: relOptions_refetch,
  } = useQuery<any>({
    queryKey: [`common-data/find-by-type-all?typeId=16`],
    queryFn: Auth?.getRequest,
    select: (res: any) => {
      return res?.data;
    },
  } as any);
  const {
    data: SpecialityOptions,
    status: SpecialityOptions_status,
    refetch: SpecialityOptions_refetch,
  } = useQuery<any>({
    queryKey: [`common-data/find-by-type-all?typeId=34`],
    queryFn: Auth?.getRequest,
    select: (res: any) => {
      return res?.data;
    },
  } as any);
  const {
    data: firmOptions,
    status: firmOptions_status,
    refetch: firmOptions_refetch,
  } = useQuery<any>({
    queryKey: [`firm/search-all`],
    queryFn: Auth?.getRequest,
    select: (res: any) => {
      return res?.data;
    },
  } as any);
  // const [formData, setFormData] = useState<{
  //   [K in keyof FullInstituteType]: string;
  // }>({} as { [K in keyof FullInstituteType]: string });
  interface FormData {
    id?: any;
    name: string;
    code: string;
    provinceId: string;
    provinceName: string;
    province?: any;
  }
  

  // تعریف نوع برای هر مرحله
  interface FormStep {
    name: string;
    formItems: FormItem[];
  }

  // آرایه مراحل و آیتم‌های فرم
  const formSteps: FormStep[] = [
    {
      name: "اطلاعات کارگروه",
      formItems: BasicFormItems(setValue, {firmOptions,SpecialityOptions}),
    },
  ];
  // const handleInputChange = (fieldName: any, value: string) => {
  //   setFormData((prev: any) => ({
  //     ...prev,
  //     [fieldName]: value,
  //   }));
  // };

  const onSubmit = (data: FullInstituteType) => {
    console.log("lastForm=>", data);
    mutate(
      {
        entity: `workgroup/${id !== "new" ? "update" : "save"}`,
        // entity: `firm/save`,
        method: id !== "new" ? "put" : "post",
        // method:  "post",
        data: {
          ...data,
          activityStatus:true
        },
      },
      {
        onSuccess: (res: any) => {
          console.log("res=>", res);
          if (id !== "new")
            snackbar(
              `به روز رسانی کارگروه انتخاب شده با موفقیت انجام شد`,
              "success"
            );
          else snackbar(`ایجاد کارگروه جدید با موفقیت انجام شد`, "success");
          // refetch();
          //   handleClose();
        },
        onError: (err: any) => {
          console.log("ErrorRes=>", err);
          // snackbar("خطا در انجام عملیات", "error");
         
          // پیام کلی
          const mainMessage = err?.data?.message || "خطایی رخ داده است";
          // ارورهای جزئی توی data.errors
          const errors = err?.data?.errors ? Object.values(err?.data.errors) : [];
          // همه پیام‌ها رو یکی کن
          const finalMessage = [...errors].join(" - ");
          // enqueueSnackbar(finalMessage, { variant: "error" });
          snackbar(mainMessage+": ", "error");
          snackbar(finalMessage, "error");
          // snackbar(err.data.message, "error");
          // snackbar(res.data.errors, "error");
        },
      }
    );
  };
  const navigate = useNavigate();
  useEffect(() => {
    if (state?.firmData) {
      const registerPlaceObject = cityOptions?.find(
        (city: any) => city.id === state.firmData.cdRegisterPlaceId
      );

      // پیدا کردن آبجکت کامل نوع ارتباط بر اساس ID
      const relationshipTypeObject = relOptions?.content?.find(
        (rel: any) => rel.id === state.firmData.cdRelationshipTypeId
      );
      console.log("registerPlaceObject", {
        value: registerPlaceObject?.id,
        title: registerPlaceObject?.name,
      });
      console.log("relationshipTypeObject", {
        value: registerPlaceObject?.id,
        title: registerPlaceObject?.value,
      });

      // ساختن کپی اصلاح شده
      const cleanedFirmData = Object.fromEntries(
        Object.entries(state.firmData).map(([key, value]) => {
          if (value === false) {
            return [key, "false"]; // تغییر false به استرینگ
          }
          return [key, value];
        })
      );

      reset({
        ...cleanedFirmData,
        cdRegisterPlaceId: {
          value: registerPlaceObject?.id,
          title: registerPlaceObject?.name,
        },
        cdRelationshipTypeId: {
          value: relationshipTypeObject?.id,
          title: relationshipTypeObject?.value,
        },
      });
    }
  }, [state, cityOptions, relOptions, reset]);
  // useEffect(() => {
  //   snackbar("1","error")
  //   snackbar("2","error")
  //   snackbar("3","info")
  // }, [])
  
  return (
    <Grid container justifyContent={"center"}>
      <Grid md={10.5} sm={11.5} xs={12} item>
        <Paper elevation={3} sx={{ p: 5, mt: 3, width: "100%" }}>
          <form onSubmit={handleSubmit(onSubmit)}>
            <Grid container spacing={4}>
              <Grid
                item
                md={12}
                display={"flex"}
                justifyContent={"space-between"}
                mb={1}
              >
                <Grid item display={"flex"}>
                  <Inventory fontSize="large" />
                  <Typography variant="h5">فرم اطلاعات کارگروه</Typography>
                </Grid>
                <BackButton onBack={() => navigate(-1)} />
              </Grid>
              {formSteps.map((stepItem, stepIndex) => (
                <Grid item container md={12} spacing={2} key={stepIndex}>
                  <Grid item md={12} width={"100vw"}>
                    <FancyTicketDivider />
                  </Grid>
                  <Grid item md={12}>
                    <Typography variant="h6" fontSize={"large"}>
                      {stepItem?.name}
                    </Typography>
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
                            // value={formData[item.name]}
                            value={getValues()[item.name] ?? ""}
                            onChange={(
                              e: React.ChangeEvent<HTMLInputElement>
                            ) => {
                              // handleInputChange(item.name, e.target.value);
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
                <Button
                  sx={{ minWidth: "25%" }}
                  variant="contained"
                  startIcon={<Check />}
                  type="submit"
                >
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

