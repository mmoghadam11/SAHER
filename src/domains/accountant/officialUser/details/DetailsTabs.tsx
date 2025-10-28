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
import { Check, Inventory } from "@mui/icons-material";
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
import MembershipTypeGrid from "./tabs/membershipType/MembershipTypeGrid";
import { MiniInfoItems } from "./MiniInfoItems";
import EDUGrid from "./tabs/education/EDUGrid";


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
const AccountantDetaileTabs = (props: Props) => {
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
      title: "نوع عضویت",
      com: <MembershipTypeGrid/>,
    },
    {
      title: "تحصیلات",
      com: <EDUGrid/>,
    },
  ];

  const formItems = useMemo(
    () => MiniInfoItems(setValue, getValues),
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
          <Inventory fontSize={isMobile ? "medium" : "large"} />
          <Typography variant={isMobile ? "body1" : "h5"}>
            مدیریت جزئیات حسابدار رسمی
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
              <Typography variant="h6">اطلاعات کلی حسابدار رسمی</Typography>
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
      <Grid item md={11} sm={11} xs={12} display={"flex"} justifyContent={"flex-start"} >
        {isMobile ? (
          <Select
            sx={{ width: "25vw", mr: 1, mt: 2 }}
            label={"پنل"}
            value={activeTab}
            size="small"
            onChange={(e) => setActiveTab((e.target.value as number) ?? 0)}
          >
            {tabSteps?.map((option: TOption, index: number) => (
              <MenuItem key={`select-item-${option.value}`} value={index}>
                {option.title}
              </MenuItem>
            ))}
          </Select>
        ) : (
          <Tabs
            sx={{
              mt: 2,
              mr: 1,
              direction:"rtl"
              // maxWidth: "45vw",
              // direction: "rtl",
            }}
            value={activeTab}
            onChange={handleTabChange}
            variant={"scrollable"}
            scrollButtons={"auto"}
          >
            {tabSteps.map((tab, index) => (
              <Tab
                // wrapped
                key={index}
                label={tab.title}
                id={`tab-${index}`}
                aria-controls={`tabpanel-${index}`}
              />
            ))}
          </Tabs>
        )}
      </Grid>
      {tabSteps[activeTab].com}
    </Grid>
  );
};

export default AccountantDetaileTabs;
