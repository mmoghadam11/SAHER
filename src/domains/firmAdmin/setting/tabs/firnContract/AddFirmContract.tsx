import {
  AddCircle,
  ChangeCircle,
  Man4,
  Map,
  Receipt,
  School,
} from "@mui/icons-material";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  Grid,
  Typography,
  Button,
  IconButton,
  Box,
  Autocomplete,
  TextField,
} from "@mui/material";
import { Close } from "@mui/icons-material";
import { useMutation, useQuery } from "@tanstack/react-query";
import RenderFormInput from "components/render/formInputs/RenderFormInput";
import { useAuth } from "hooks/useAuth";
import { useSnackbar } from "hooks/useSnackbar";
import React, { useEffect, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { useParams } from "react-router-dom";
import { EduFinancialItems } from "../../forms/FinancialItems";
import { FirmContractItems } from "../../forms/FirmContractItems";

interface FormData {
  id?: any;
  termName: string;
  auditingFirmId: string;
  applicatorName: string;
  hour_count: string;
  request_year: string;
  request_month: string;
}

interface FormItem {
  name: keyof FormData;
  inputType: string;
  label: string;
  size: { md: number };
  rules?: any;
  options?: any[];
  elementProps?: any;
}

type Props = {
  refetch: () => void;
  addModalFlag: boolean;
  setAddModalFlag: React.Dispatch<React.SetStateAction<boolean>>;
  editeData: any;
  setEditeData: React.Dispatch<React.SetStateAction<any>>;
};

const AddFirmContract = ({
  addModalFlag,
  setAddModalFlag,
  refetch,
  editeData,
  setEditeData,
}: Props) => {
  const Auth = useAuth();
  const snackbar = useSnackbar();
  const { id } = useParams();

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
  } = useForm<FormData>();
  const {
      data: serviceTypeOptions,
      status: serviceTypeOptions_status,
      refetch: serviceTypeOptions_refetch,
    } = useQuery<any>({
      queryKey: [`common-data/find-by-type-all?typeId=20`],
      queryFn: Auth?.getRequest,
      select: (res: any) => {
        return res?.data;
      },
      enabled: true,
    } as any);
  const {
      data: contractTypeOptions,
      status: contractTypeOptions_status,
      refetch: contractTypeOptions_refetch,
    } = useQuery<any>({
      queryKey: [`common-data/find-by-type-all?typeId=21`],
      queryFn: Auth?.getRequest,
      select: (res: any) => {
        return res?.data;
      },
      enabled: true,
    } as any);
  const {
      data: personalityTypeOptions,
      status: personalityTypeOptions_status,
      refetch: personalityTypeOptions_refetch,
    } = useQuery<any>({
      queryKey: [`common-data/find-by-type-all?typeId=22`],
      queryFn: Auth?.getRequest,
      select: (res: any) => {
        return res?.data;
      },
      enabled: true,
    } as any);
  const {
      data: contractRolesOptions,
      status: contractRolesOptionss_status,
      refetch: contractRolesOptions_refetch,
    } = useQuery<any>({
      queryKey: [`common-data/find-by-type-all?typeId=23`],
      queryFn: Auth?.getRequest,
      select: (res: any) => {
        return res?.data;
      },
      enabled: true,
    } as any);

  const formItems: any[] = FirmContractItems(setValue,{ serviceTypeOptions, contractTypeOptions, personalityTypeOptions,contractRolesOptions});
  useEffect(() => {
    console.log("editeData=>", getValues());
    if (editeData !== null) {
      //   setFormData(editeData);
      reset({
        ...editeData,
      });
    } else
      reset({
        // auditingFirmId یا firmId چی میگه؟
        auditingFirmId: id,
      });
  }, [editeData, addModalFlag]);
  //   useEffect(() => {
  //     console.log("formData=>", formData);
  //   }, [formData]);

  const handleClose = () => {
    setAddModalFlag(false);
    reset();

    setEditeData(null);
  };


  const onSubmit = (data: FormData) => {
    mutate(
      {
        entity: `firm-contract/${!!editeData ? "update" : "save"}`,
        // entity: `firm-director/save`,
        method: !!editeData ? "put" : "post",
        // method:  "post",
        data: {
          ...data,
          // active: true,
          auditingFirmId: id,
        },
      },
      {
        onSuccess: (res: any) => {
          console.log("res=>", res);
          if (id !== "new")
            snackbar(
              `به روز رسانی قرارداد انتخاب شده با موفقیت انجام شد`,
              "success"
            );
          else snackbar(`قرارداد جدید با موفقیت افزوده شد`, "success");
          refetch();
          //   handleClose();
        },
        onError: () => {
          snackbar("خطا در ایجاد قرارداد", "error");
        },
      }
    );
  };

  return (
    <Dialog open={addModalFlag} onClose={handleClose} maxWidth={"md"}>
      <DialogTitle>
        <Box display="flex" justifyContent="space-between" alignItems="center">
          <Box display={"flex"} textAlign={"center"} alignItems={"center"}>
            <Receipt fontSize="large" />
            <Typography variant="h6">
              {editeData
                ? `ویرایش قرارداد انتخاب شده`
                : `ایجاد قرارداد جدید`}
            </Typography>
          </Box>
          <IconButton onClick={handleClose} size="small">
            <Close />
          </IconButton>
        </Box>
      </DialogTitle>

      <DialogContent>
        <form onSubmit={handleSubmit(onSubmit)}>
          <Grid container spacing={3} mt={1}>
            {formItems.map((item) => (
              <Grid item xs={12} md={item.size.md} key={item.name}>
                <Controller
                  name={item.name}
                  control={control}
                  rules={item.rules}
                  render={({ field }) => (
                    <RenderFormInput
                    value={(getValues() as any)[item.name]}
                      controllerField={field}
                      errors={errors}
                      {...item}
                      onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                        // handleInputChange(item.name, e.target.value);
                        field.onChange(e);
                      }}
                    />
                  )}
                />
              </Grid>
            ))}

            <Grid item xs={12} display="flex" justifyContent="flex-end" mt={2}>
              <Button variant="outlined" onClick={handleClose} sx={{ mr: 2 }}>
                بازگشت
              </Button>
              <Button
                variant="contained"
                startIcon={!!editeData ? <ChangeCircle /> : <AddCircle />}
                type="submit"
                disabled={isLoading}
              >
                {isLoading
                  ? !!editeData
                    ? "در حال به روز رسانی..."
                    : "در حال ایجاد..."
                  : !!editeData
                  ? "به روز رسانی"
                  : "ایجاد"}
              </Button>
            </Grid>
          </Grid>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default AddFirmContract