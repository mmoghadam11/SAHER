import React, { useEffect, useMemo, useState } from "react";
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
import { membershipInfoItems } from "./forms/MembershipInfo";
import { getBasicInfoItems } from "./forms/BasicInfo";
import { financialInfoItems } from "./forms/financialInfoItems";
import { contactInfoItems } from "./forms/contactInfoItems";
import { ceoInfoItems } from "./forms/ceoInfoItems ";
import { boardInfoItems } from "./forms/boardInfoItems ";
import { ratingInfoItems } from "./forms/ratingInfoItems";
import { specialInfoItems } from "./forms/specialInfoItems";
import FancyTicketDivider from "components/FancyTicketDivider";
import BackButton from "components/buttons/BackButton";
import { useLocation, useNavigate, useParams } from "react-router-dom";

export default function FormSteps(): JSX.Element {
  const { id } = useParams();
  const { state } = useLocation();
  const [isTemporarySave, setIsTemporarySave] = useState(true);
  const {
    handleSubmit,
    control,
    formState: { errors },
    reset,
    setValue,
    getValues,
    trigger,
    clearErrors,
  } = useForm<any>();
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
    // queryKey: [process.env.REACT_APP_API_URL + `/api/unit-allocations${paramsSerializer(filters)}`],
    // queryKey: [`/api/v1/common-type/find-all${paramsSerializer(filters)}`],
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
    queryKey: [`common-data/search?size=10&page=1&typeId=16`],
    queryFn: Auth?.getRequest,
    select: (res: any) => {
      return res?.data;
    },
  } as any);
  const {
    data: ownerOptions,
    status: ownerOptions_status,
    refetch: ownerOptions_refetch,
  } = useQuery<any>({
    // queryKey: [process.env.REACT_APP_API_URL + `/api/unit-allocations${paramsSerializer(filters)}`],
    // queryKey: [`/api/v1/common-type/find-all${paramsSerializer(filters)}`],
    queryKey: [`common-data/search?size=10&page=1&typeId=15`],
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
  interface FormItem {
    name: string;
    inputType: string;
    label: string;
    size: { md: number };
    rules?: any;
    tempRules?: any;
    options?: any[];
    elementProps?: any;
    placeholder?: string;
    storeValueAs?: string;
  }

  // تعریف نوع برای هر مرحله
  interface FormStep {
    name: string;
    formItems: FormItem[];
  }
  const formSteps: FormStep[] = useMemo(
    () => [
      {
        name: "اطلاعات پایه موسسه",
        formItems: getBasicInfoItems(setValue, cityOptions),
      },
      {
        name: "اطلاعات عضویت و پروانه",
        formItems: membershipInfoItems(setValue),
      },
      {
        name: "اطلاعات مالی و اداری",
        formItems: financialInfoItems(setValue, ownerOptions),
      },
      {
        name: "اطلاعات تماس",
        formItems: contactInfoItems(setValue),
      },
      {
        name: "اطلاعات مدیرعامل",
        formItems: ceoInfoItems(setValue),
      },
      // {
      //   name: "اطلاعات هیئت مدیره",
      //   formItems: boardInfoItems(setValue)
      // },
      {
        name: "رتبه‌بندی و کنترل",
        formItems: ratingInfoItems(setValue),
      },
      {
        name: "اطلاعات تخصصی",
        formItems: specialInfoItems(setValue, relOptions),
      },
    ],
    [isTemporarySave, cityOptions]
  );
  // آرایه مراحل و آیتم‌های فرم
  // const formSteps: FormStep[] =
  // [
  //   {
  //     name: "اطلاعات پایه موسسه",
  //     formItems: getBasicInfoItems(setValue, cityOptions),
  //   },
  //   {
  //     name: "اطلاعات عضویت و پروانه",
  //     formItems: membershipInfoItems(setValue),
  //   },
  //   {
  //     name: "اطلاعات مالی و اداری",
  //     formItems: financialInfoItems(setValue, ownerOptions),
  //   },
  //   {
  //     name: "اطلاعات تماس",
  //     formItems: contactInfoItems(setValue),
  //   },
  //   {
  //     name: "اطلاعات مدیرعامل",
  //     formItems: ceoInfoItems(setValue),
  //   },
  //   // {
  //   //   name: "اطلاعات هیئت مدیره",
  //   //   formItems: boardInfoItems(setValue)
  //   // },
  //   {
  //     name: "رتبه‌بندی و کنترل",
  //     formItems: ratingInfoItems(setValue),
  //   },
  //   {
  //     name: "اطلاعات تخصصی",
  //     formItems: specialInfoItems(setValue, relOptions),
  //   },
  // ];

  // useEffect(() => {
  //   const currentValues = getValues();
  //   console.log('خطاهای فعلی:', Object.keys(errors).length);
  //   clearErrors();
  //   reset(currentValues);
  //   setTimeout(() => {
  //     trigger();
  //   }, 100);
  // }, [isTemporarySave]);
  // تابع برای دریافت قوانین بر اساس نوع ثبت
  const getRules = (item: FormItem) => {
    if (isTemporarySave) {
      return item.tempRules || {};
    }
    return item.rules || {};
  };
  const handleTemporarySave = async () => {
    clearErrors();
    setIsTemporarySave(true);
    const currentValues = getValues();
    reset(currentValues);

    // اعتبارسنجی با قوانین ساده‌تر
    setTimeout(async () => {
      const isValid = await trigger();
      // if (isValid) {
      handleSubmit(onSubmit)();
      // } else {
      // snackbar("لطفا فیلدهای ضروری را پر کنید", "warning");
      // setIsTemporarySave(true);
      // }
    }, 100);
  };

  // تابع برای ثبت دائم
  const handlePermanentSave = async () => {
    clearErrors();
    setIsTemporarySave(false);
    const currentValues = getValues();
    reset(currentValues);

    // اعتبارسنجی با قوانین کامل
    setTimeout(async () => {
      const isValid = await trigger();
      // if (isValid) {
      handleSubmit(onSubmit)();
      // } else {
      //   snackbar("لطفا تمام فیلدهای الزامی را به درستی پر کنید", "warning");
      // }
    }, 100);
  };
  const onSubmit = (data: FullInstituteType) => {
    console.log("lastForm=>", data);
    console.log("نوع ثبت:", isTemporarySave ? "موقت" : "دائم");
    mutate(
      {
        entity: `firm/${
          id !== "new" ? (isTemporarySave ? "update" : "confirm-user") : "save"
        }`,
        // entity: `firm/save`,
        method: id !== "new" ? "put" : "post",
        // method:  "post",
        data: {
          ...data,
          cdRegisterPlaceId: data?.cdRegisterPlaceId?.value,
          cdRelationshipTypeId: data?.cdRelationshipTypeId?.value,
        },
      },
      {
        onSuccess: (res: any) => {
          console.log("res=>", res);
          if (id !== "new")
            snackbar(
              `به روز رسانی موسسه انتخاب شده با موفقیت انجام شد`,
              "success"
            );
          else snackbar(`ایجاد موسسه جدید با موفقیت انجام شد`, "success");
          // refetch();
          //   handleClose();
        },
        onError: (err: any) => {
          console.log("ErrorRes=>", err);
          // snackbar("خطا در انجام عملیات", "error");

          // پیام کلی
          const mainMessage = err?.data?.message || "خطایی رخ داده است";
          // ارورهای جزئی توی data.errors
          const errors = err?.data?.errors
            ? Object.values(err?.data.errors)
            : [];
          // همه پیام‌ها رو یکی کن
          const finalMessage = [...errors].join(" - ");
          // enqueueSnackbar(finalMessage, { variant: "error" });
          snackbar(mainMessage + ": ", "error");
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
                  <Typography variant="h5">فرم اطلاعات موسسات</Typography>
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
                        // rules={item.rules}
                        rules={getRules(item)}
                        render={({ field }) => (
                          <RenderFormInput
                            controllerField={field}
                            errors={errors}
                            {...item}
                            value={getValues()[item.name] ?? ""}
                            onBlur={() => trigger()}
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
                gap={1}
              >
                <Button
                  sx={{ minWidth: "25%" }}
                  variant="contained"
                  startIcon={<Check />}
                  // type="submit"
                  onClick={handleTemporarySave}
                  color="secondary"
                >
                  ثبت موقت
                </Button>
                <Button
                  sx={{ minWidth: "25%" }}
                  variant="contained"
                  startIcon={<Check />}
                  onClick={handlePermanentSave}
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
