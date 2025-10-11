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
  Tabs,
  Tab,
  MenuItem,
  Select,
} from "@mui/material";
import { Controller, FormProvider, useForm } from "react-hook-form";
import { FullInstituteType } from "types/institute";

// کامپوننت‌های مربوط به هر دسته اطلاعات
import { Check, Inventory, ReceiptLong } from "@mui/icons-material";
import RenderFormInput from "components/render/formInputs/RenderFormInput";
import { useMutation, useQuery } from "@tanstack/react-query";
import { useAuth } from "hooks/useAuth";
import { useSnackbar } from "hooks/useSnackbar";

import FancyTicketDivider from "components/FancyTicketDivider";
import BackButton from "components/buttons/BackButton";
import { useLocation, useNavigate, useParams } from "react-router-dom";

import moment from "jalali-moment";

import { isMobile } from "react-device-detect";
import { TOption } from "types/render";
import DisciplinaryOrderGrid from "./details/DisciplinaryOrderGrid";



type Props = {};
interface FormItem {
  name: keyof FullInstituteType;
  inputType: string;
  label: string;
  size: { md: number };
  rules?: any;
  options?: any[];
  elementProps?: any;
}
interface FormStep {
  name: string;
  formItems: FormItem[];
}
const AccountantDisciplinaryOrderDetaile = (props: Props) => {
  const { id } = useParams();
  const { state } = useLocation();
  const Auth = useAuth();
  const navigate = useNavigate();
  const snackbar = useSnackbar();
  const { mutate, isLoading } = useMutation({
    mutationFn: Auth?.serverCall,
  });
  const {
    handleSubmit,
    control,
    formState: { errors },
    reset,
    setValue,
    getValues,
  } = useForm<any>();
  const [activeTab, setActiveTab] = useState<number>(0);

  useEffect(() => {
    reset(state?.accountantData);
  }, [state?.accountantData]);

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
  const tabSteps = [
    
    {
      title: "احکام انتظامی",
      com: <DisciplinaryOrderGrid setActiveTab={setActiveTab} />,
    },
    
  ];

  const formItems = useMemo(
    () => [
  {
    name: "firstName",
    inputType: "text",
    label: "نام",
    size: { md: 4 },
    elementProps:{
      disabled:true
    }
  },
  {
    name: "lastName",
    inputType: "text",
    label: "نام خانوادگی",
    size: { md: 4 },
    elementProps:{
      disabled:true
    }
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
      disabled:true
    },
  },
  
  
  {
    name: "fatherName",
    inputType: "text",
    label: "نام پدر",
    size: { md: 4 },
    elementProps:{
      disabled:true
    }
  },
  {
    name: "nationalCode",
    inputType: "text",
    label: "کد ملی",
    size: { md: 4 },
    elementProps:{
      disabled:true
    }
  },
  {
    name: "idNumber",
    inputType: "text",
    label: "شماره شناسنامه",
    size: { md: 4 },
    elementProps:{
      disabled:true
    }
  },
],
    [getValues, setValue, state?.accountantData]
  ); // وابستگی‌های useMemo

  const handleTabChange = (event: any, newValue: number) => {
    setActiveTab(newValue);
  };
  return (
    <Grid container justifyContent={"center"}>
      <Grid
        item
        md={11}
        sm={11}
        xs={12}
        display={"flex"}
        justifyContent={"space-between"}
        mb={1}
      >
        <Grid item display={"flex"}>
          <ReceiptLong fontSize={isMobile ? "medium" : "large"} />
          <Typography variant={isMobile ? "body1" : "h5"}>
            احکام انتظامی حسابدار
          </Typography>
        </Grid>
        <Grid item display={"flex"}>
          <BackButton onBack={() => navigate(-1)} />
        </Grid>
      </Grid>
      <Grid item md={11}>
        <Paper sx={{ width: "100%", p: 5 }}>
          <Grid item container md={12} spacing={2}>
            <Grid item md={12}>
              <Typography variant="h6">اطلاعات کلی حسابدار</Typography>
            </Grid>
            {formItems?.map((item) => (
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
                      {...field}
                      onChange={(e: any) => {
                        // if (!isNaN(e.target.value))
                        setValue(item.name, e.target.value);
                      }}
                      value={getValues()[item.name] ?? ""}
                    />
                  )}
                />
              </Grid>
            ))}
          </Grid>
        </Paper>
      </Grid>
      {tabSteps[activeTab].com}
    </Grid>
  );
};

export default AccountantDisciplinaryOrderDetaile;
