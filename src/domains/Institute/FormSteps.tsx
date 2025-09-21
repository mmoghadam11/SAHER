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
import { useNavigate, useParams } from "react-router-dom";
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
  const {id}=useParams()
  const {
    handleSubmit,
    control,
    formState: { errors },
    reset,
    setValue,
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
      formItems: getBasicInfoItems(setValue,cityOptions),
    },
    {
      name: "اطلاعات عضویت و پروانه",
      formItems: membershipInfoItems(setValue),
    },
    {
      name: "اطلاعات مالی و اداری",
      formItems: financialInfoItems(setValue,ownerOptions),
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
      formItems: specialInfoItems(setValue),
    },
    // به همین ترتیب برای مراحل دیگر
  ];
  const handleInputChange = (fieldName: any, value: string) => {
    setFormData((prev: any) => ({
      ...prev,
      [fieldName]: value,
    }));
  };

  const onSubmit = (data: FullInstituteType) => {
    console.log("lastForm=>", data);
    mutate(
      {
        entity: `firm/${id!=="new" ? "update" : "add"}`,
        // entity: `firm/save`,
        method: id!=="new" ? "put" : "post",
        // method:  "post",
        data: {
          ...data,
          registerPlaceId:data?.registerPlaceId?.value
        },
      },
      {
        onSuccess: (res: any) => {
          console.log("res=>",res)
          if (id!=="new")
            snackbar(
              `به روز رسانی موسسه انتخاب شده با موفقیت انجام شد`,
              "success"
            );
          else 
            snackbar(`ایجاد موسسه جدید با موفقیت انجام شد`, "success");
          // refetch();
          //   handleClose();
        },
        onError: () => {
          snackbar("خطا در انجام عملیات", "error");
        },
      }
    );
  };
  const navigate=useNavigate();
  return (
    <Grid container justifyContent={"center"}>
      <Grid md={10.5} sm={11.5} xs={12} item>
        <Paper elevation={3} sx={{ p: 5, mt: 3, width: "100%" }}>
          <form onSubmit={handleSubmit(onSubmit)}>
            <Grid container spacing={4}>
              <Grid item md={12} display={"flex"} justifyContent={"space-between"} mb={1}>
                <Grid item display={"flex"}>
                  <Inventory fontSize="large" />
                  <Typography variant="h5">فرم اطلاعات موسسات</Typography>
                </Grid>
                <BackButton onBack={()=>navigate(-1)}/>
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
