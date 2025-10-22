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
import FancyTicketDivider from "components/FancyTicketDivider";
import BackButton from "components/buttons/BackButton";
import { useNavigate, useParams } from "react-router-dom";
import { getBasicInfoItems } from "domains/Institute/forms/BasicInfo";
import { DirectorItems } from "../../forms/DirectorItems";
// import MembershipInfo from './MembershipInfo';
// import FinancialInfo from './FinancialInfo';
// import ContactInfo from './ContactInfo';
// import CEOInfo from './CEOInfo';
// import BoardInfo from './BoardInfo';
// import RatingInfo from './RatingInfo';
// import SpecialInfo from './SpecialInfo';

type Props = {};

const Director = (props: Props) => {
  const { id } = useParams();
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
    formItems: any[];
  }

  const {
    data: personnelOptions,
    status: personnelOptions_status,
    refetch: personnelOptions_refetch,
  } = useQuery<any>({
    queryKey: [`personnel-info/search-all?auditingFirmId=${id}`],
    queryFn: Auth?.getRequest,
    select: (res: any) => {
      return res?.data;
    },
  } as any);
  // آرایه مراحل و آیتم‌های فرم
  const formSteps: FormStep[] = [
    {
      name: "اطلاعات مدیرعامل",
      formItems: DirectorItems(setValue, { personnelOptions }),
    },
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
        // entity: `firm-director/${id!=="new" ? "update" : "save"}`,
        entity: `firm-director/save`,
        // method: id!=="new" ? "put" : "post",
        method: "post",
        data: {
          ...data,
          active: true,
          firmId: id,
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
          else snackbar(`مدیرعامل جدید با موفقیت افزوده شد`, "success");
          // refetch();
          //   handleClose();
        },
        onError: () => {
          snackbar("خطا در ایجاد مدیرعامل", "error");
        },
      }
    );
  };
  const navigate = useNavigate();
  return (
    <Grid container justifyContent={"center"}>
      <Grid md={11} sm={11.5} xs={12} item>
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
                  {/* <Inventory fontSize="large" /> */}
                  <Typography variant="h5">مدیرعامل</Typography>
                </Grid>
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
                            value={(formData as any)[item.name]}
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
};

export default Director;
