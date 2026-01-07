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
import RenderFormDisplay from "components/render/formInputs/RenderFormDisplay";
import MyPdfViewer from "components/pdfviewer/MyPdfViewer";
import Pcases from "./components/Pcases";
import Hcases from "./components/Hcases";
import { PAGINATION_DEFAULT_VALUE } from "shared/paginationValue";

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
const DirectorDisciplinayOrder = (props: Props) => {
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
  const [filters, setFilters] = useState<any>({
      ...PAGINATION_DEFAULT_VALUE,
      auditingFirmId:localStorage?.getItem("director"),
    });
  const [supremefilters, setSupremeFilters] = useState<any>({
      ...PAGINATION_DEFAULT_VALUE,
      auditingFirmId:localStorage?.getItem("director"),
    });
    const {
    data: StatesData,
    status: StatesData_status,
    refetch: StatesData_refetch,
  } = useQuery<any>({
    queryKey: [`firm/search-all?id=${filters.auditingFirmId}`],
    queryFn: Auth?.getRequest,
    select: (res: any) => {
      return res?.data;
    },
    enabled: !!Auth?.userInfo?.nationalCode && !!filters?.auditingFirmId,
  } as any);
  useEffect(() => {
    reset(Auth.userInfo);
  }, [Auth.userInfo]);
  const formItems = useMemo(
    () => [
      {
        name: "firstName",
        inputType: "text",
        label: "نام",
        size: { md: 4 },
        elementProps: {
          disabled: true,
        },
      },
      {
        name: "lastName",
        inputType: "text",
        label: "نام خانوادگی",
        size: { md: 4 },
        elementProps: {
          disabled: true,
        },
      },
      {
        name: "nationalCode",
        inputType: "text",
        label: "کد ملی",
        size: { md: 4 },
        elementProps: {
          disabled: true,
        },
      },
    ],
    [getValues, setValue, Auth.userInfo]
  ); // وابستگی‌های useMemo

  useEffect(() => {
      setFilters((prev: any) => ({
        ...prev,
        auditingFirmId:localStorage?.getItem("director"),
      }));
      setSupremeFilters((prev: any) => ({
        ...prev,
        auditingFirmId:localStorage?.getItem("director"),
      }));
    }, [Auth]);
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
            احکام انتظامی موسسه شما
          </Typography>
        </Grid>
        <Grid item display={"flex"}>
          {/* <BackButton onBack={() => navigate(-1)} /> */}
        </Grid>
      </Grid>
      <Grid item md={11}>
        <Paper sx={{ width: "100%", p: 5 }}>
          <Grid item container md={12} spacing={2}>
            <Grid item md={12}>
              <Typography variant="h6">اطلاعات کلی مدیرعامل</Typography>
            </Grid>
            {formItems?.map((item) => (
              <Grid item xs={12} md={item.size.md} key={item.name}>
                <Controller
                  name={item.name}
                  control={control}
                  render={({ field }) => (
                    // <RenderFormInput
                    //   controllerField={field}
                    //   errors={errors}
                    //   {...item}
                    //   {...field}
                    //   onChange={(e: any) => {
                    //     // if (!isNaN(e.target.value))
                    //     setValue(item.name, e.target.value);
                    //   }}
                    //   value={getValues()[item.name] ?? ""}
                    // />
                    <RenderFormDisplay
                      item={item}
                      value={getValues()[item.name] ?? ""}
                    />
                  )}
                />
              </Grid>
            ))}
          </Grid>
        </Paper>
      </Grid>
      <Pcases filters={filters} setFilters={setFilters}/>
      <Hcases filters={supremefilters} setFilters={setSupremeFilters}/>
    </Grid>
  );
};

export default DirectorDisciplinayOrder;
