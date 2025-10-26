import {
  AddCircle,
  ChangeCircle,
  EventNote,
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
import { ContinuingEduItems } from "../../forms/ContinuingEduItems";

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

const AddContiniuingEdu = ({
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
    data: EduOptions,
    status: EduOptions_status,
    refetch: EduOptions_refetch,
  } = useQuery<any>({
    queryKey: [`common-data/find-by-type-all?typeId=18`],
    queryFn: Auth?.getRequest,
    select: (res: any) => {
      return res?.data;
    },
    enabled: true,
  } as any);
  const {
    data: EduTypeOptions,
    status: EduTypeOptions_status,
    refetch: EduTypeOptions_refetch,
  } = useQuery<any>({
    queryKey: [`common-data/find-by-type-all?typeId=19`],
    queryFn: Auth?.getRequest,
    select: (res: any) => {
      return res?.data;
    },
    enabled: true,
  } as any);

  const formItems: any[] = ContinuingEduItems(setValue,EduOptions,EduTypeOptions);
  useEffect(() => {
    console.log("editeData=>", getValues());
    if (editeData !== null) {
      reset({
        ...editeData,
      });
    } else
      reset({
        auditingFirmId: id,
      });
  }, [editeData, addModalFlag]);

  const handleClose = () => {
    setAddModalFlag(false);
    reset();

    setEditeData(null);
  };

  const onSubmit = (data: FormData) => {
    mutate(
      {
        entity: `firm-prof-edu/${!!editeData ? "update" : "save"}`,
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
          if (!!editeData)
            snackbar(
              `به روز رسانی موسسه انتخاب شده با موفقیت انجام شد`,
              "success"
            );
          else
            snackbar(`سوابق مستمر آموزشی جدید با موفقیت افزوده شد`, "success");
          refetch();
          //   handleClose();
        },
        onError: () => {
          snackbar("خطا در ایجاد سوابق مستمر آموزشی", "error");
        },
      }
    );
  };

  return (
    <Dialog open={addModalFlag} onClose={handleClose} maxWidth={"md"}
    PaperProps={{
        sx: {
          overflow: "visible", // اجازه به محتوای Dialog برای بیرون زدن
        },
      }}
    >
      <DialogTitle>
        <Box display="flex" justifyContent="space-between" alignItems="center">
          <Box display={"flex"} textAlign={"center"} alignItems={"center"}>
            <EventNote fontSize="large" />
            <Typography variant="h6">
              {editeData
                ? `ویرایش سوابق مستمر آموزشی انتخاب شده`
                : `ایجاد سوابق مستمر آموزشی جدید`}
            </Typography>
          </Box>
          <IconButton onClick={handleClose} size="small">
            <Close />
          </IconButton>
        </Box>
      </DialogTitle>

      <DialogContent sx={{overflow:"visible"}}>
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

export default AddContiniuingEdu;
