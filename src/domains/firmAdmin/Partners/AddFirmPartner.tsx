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
  Chip,
} from "@mui/material";
import { Controller, FormProvider, useForm } from "react-hook-form";
import { FullInstituteType } from "types/institute";

// کامپوننت‌های مربوط به هر دسته اطلاعات
import {
  Check,
  Close,
  CrisisAlert,
  Inventory,
  PersonSearch,
  Verified,
} from "@mui/icons-material";
import RenderFormInput from "components/render/formInputs/RenderFormInput";
import { useMutation, useQuery } from "@tanstack/react-query";
import { useAuth } from "hooks/useAuth";
import { useSnackbar } from "hooks/useSnackbar";
import FancyTicketDivider from "components/FancyTicketDivider";
import BackButton from "components/buttons/BackButton";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import { FormItem } from "types/formItem";

import RenderFormDisplay from "components/render/formInputs/RenderFormDisplay";
import SearchPannel from "components/form/SearchPannel";
import paramsSerializer from "services/paramsSerializer";
import { PartnerAssignmentFormItems } from "./forms/PartnerAssignmentFormItems";

export default function AddFirmPartner(): JSX.Element {
  const { id, staffId } = useParams();
  const { state } = useLocation();
  const [searchData, setSearchData] = useState({
    nationalCode: "",
    // cdPersonnelTypeId: 112,
    id: staffId === "new" ? "" : staffId,
  });
  const [filters, setFilters] = useState<any>({
    nationalCode:
      staffId !== "new" ? state?.staffData?.personnelNationalCode : "",
    id: staffId === "new" ? "" : staffId,
    // cdPersonnelTypeId: 112,
    // code: "",
  });
  const searchItems: FormItem[] = [
    {
      name: "nationalCode",
      inputType: "text",
      label: "کد ملی",
      size: { md: 6 },
      elementProps: {
        disabled: staffId !== "new",
      },
    },
  ];

  useEffect(() => {
    if (!!state?.staffData) reset(state?.staffData);
  }, [state?.staffData]);

  const {
    handleSubmit,
    control,
    formState: { errors },
    reset,
    setValue,
    getValues,
  } = useForm<any>({});
  const Auth = useAuth();
  const snackbar = useSnackbar();
  const { mutate, isLoading } = useMutation({
    mutationFn: Auth?.serverCall,
  });

  const {
    data: searchResponse,
    status: searchResponse_status,
    refetch: searchResponse_refetch,
  } = useQuery<any>({
    queryKey: [`certified-accountant/search-all${paramsSerializer(filters)}`],
    queryFn: Auth?.getRequest,
    select: (res: any) => {
      return res?.data;
    },
    enabled: !!filters?.nationalCode || !!filters?.personnelId,
  } as any);
  const {
    data: editeData,
    status: editeData_status,
    refetch: editeData_refetch,
  } = useQuery<any>({
    queryKey: [`firm-partner/search-all${paramsSerializer(filters)}`],
    queryFn: Auth?.getRequest,
    select: (res: any) => {
      return res?.data;
    },
    enabled: staffId !== "new",
  } as any);
  const {
    data: rankOptions,
    status: rankOptions_status,
    refetch: rankOptions_refetch,
  } = useQuery<any>({
    queryKey: [`common-data/find-by-type-all?typeId=25`],
    queryFn: Auth?.getRequest,
    select: (res: any) => {
      return res?.data;
    },
  } as any);

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

  const DataFormItems = useMemo(
    () => [
      {
        name: "firstName",
        inputType: "text",
        label: "نام",
        size: { md: 4 },
      },
      {
        name: "lastName",
        inputType: "text",
        label: "نام خانوادگی",
        size: { md: 4 },
      },
      {
        name: "birthDate",
        inputType: "date",
        label: "تاریخ تولد",
        size: { md: 4 },
        rules: { required: "تاریخ تولد الزامی است" },
        elementProps: {
          setDay: (value: any) => {
            setValue("birthDate", value);
          },
          value: "",
        },
      },

      {
        name: "fatherName",
        inputType: "text",
        label: "نام پدر",
        size: { md: 4 },
      },
      {
        name: "nationalCode",
        inputType: "text",
        label: "کد ملی",
        size: { md: 4 },
      },
      {
        name: "idNumber",
        inputType: "text",
        label: "شماره شناسنامه",
        size: { md: 4 },
      },
    ],
    [searchResponse, editeData, state?.accountantData]
  );
  // آرایه مراحل و آیتم‌های فرم
  const formSteps: FormStep[] = useMemo(
    () => [
      {
        name: "اطلاعات شراکت",
        formItems: PartnerAssignmentFormItems(setValue, {
          rankOptions,
        }),
      },
    ],
    [!!searchResponse || !!editeData]
  );

  const onSubmit = (data: FullInstituteType) => {
    console.log("lastForm=>", data);
    mutate(
      {
        entity: `firm-partner/${staffId !== "new" ? "update" : "save"}`,
        // entity: `membership/save`,
        method: staffId !== "new" ? "put" : "post",
        // method:  "post",
        data: {
          ...data,
          // حسابدار رسمی=111
          // کارکنان حرفه ای=112
          // cdPersonnelTypeId: 112,
          partnerStatus: true,
          auditingFirmId: id,
          personnelId: searchResponse?.[0]?.id,
        },
      },
      {
        onSuccess: (res: any) => {
          console.log("res=>", res);
          if (staffId !== "new")
            snackbar(
              `به روز رسانی عضو انتخاب شده با موفقیت انجام شد`,
              "success"
            );
          else snackbar(`ایجاد عضو جدید با موفقیت انجام شد`, "success");
          // refetch();
          //   handleClose();
        },
        onError: (err: any) => {
          console.log("ErrorRes=>", err);
          snackbar("خطا در انجام عملیات", "error");

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
          //   snackbar(finalMessage, "error");
          // snackbar(err.data.message, "error");
          // snackbar(res.data.errors, "error");
        },
      }
    );
  };
  const navigate = useNavigate();

  useEffect(() => {
    console.log("searchResponse", searchResponse);
  }, [searchResponse]);

  return (
    <Grid container justifyContent={"center"}>
      <Grid md={10.5} sm={11.5} xs={12} item>
        <Paper elevation={3} sx={{ p: 5, my: 3, width: "100%" }}>
          <Grid container spacing={4} justifyContent={"center"}>
            <Grid
              item
              md={12}
              display={"flex"}
              justifyContent={"space-between"}
              mb={1}
            >
              <Grid item display={"flex"}>
                <Inventory fontSize="large" />
                <Typography variant="h5">فرم افزودن شریک موسسه</Typography>
              </Grid>
              <BackButton onBack={() => navigate(-1)} />
            </Grid>
            {staffId === "new" && (
              <SearchPannel<any>
                searchItems={searchItems}
                searchData={searchData}
                setSearchData={setSearchData}
                setFilters={setFilters}
                md={12}
              />
            )}
            {/* <Grid item md={12} width={"100vw"}>
                <FancyTicketDivider />
              </Grid> */}
            {!!searchResponse && (
              <Grid
                item
                md={12}
                display={"flex"}
                gap={1}
                justifyContent={"space-between"}
              >
                <Box display={"flex"} gap={1}>
                  <PersonSearch />
                  <Typography variant="h6" fontSize={"large"}>
                    اطلاعات کلی
                  </Typography>
                </Box>
              </Grid>
            )}
            {(!!searchResponse || !!editeData) && (
              <Grid item md={12} sm={12} xs={12}>
                <form name="myForm" onSubmit={handleSubmit(onSubmit)}>
                  <Grid
                    container
                    item
                    md={12}
                    spacing={4}
                    justifyContent={"center"}
                  >
                    {!!searchResponse?.length || editeData?.length ? (
                      DataFormItems?.map((item) => (
                        <Grid item xs={12} md={item.size.md} key={item.name}>
                          <RenderFormDisplay
                            item={item}
                            value={
                              searchResponse?.[0]?.[item.name] ||
                              editeData?.[0]?.[item.name]
                            }
                          />
                        </Grid>
                      ))
                    ) : (
                      <Typography>موردی یافت نشد</Typography>
                    )}

                    {(searchResponse_status === "success" ||
                      editeData_status === "success") &&
                      (!!searchResponse?.length || !!editeData?.length) &&
                      formSteps.map((stepItem, stepIndex) => (
                        <Grid
                          item
                          container
                          md={12}
                          spacing={2}
                          key={stepIndex}
                        >
                          <Grid item md={12} width={"100vw"}>
                            <FancyTicketDivider />
                          </Grid>
                          <Grid item md={12}>
                            <Typography variant="h6" fontSize={"large"}>
                              {stepItem?.name}
                            </Typography>
                          </Grid>
                          {stepItem?.formItems?.map((item) => (
                            <Grid
                              item
                              xs={12}
                              md={item.size.md}
                              key={item.name}
                            >
                              {state?.editable ? (
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
                              ) : (
                                <RenderFormDisplay
                                  item={item}
                                  value={getValues()[item.name]}
                                />
                              )}
                            </Grid>
                          ))}
                        </Grid>
                      ))}

                    {state?.editable &&
                      (!!searchResponse?.length || !!editeData?.length) && (
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
                      )}
                  </Grid>
                </form>
              </Grid>
            )}
          </Grid>
        </Paper>
      </Grid>
    </Grid>
  );
}
