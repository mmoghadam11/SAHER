import { AddCircle, ChangeCircle } from "@mui/icons-material";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  Grid,
  Typography,
  Button,
  IconButton,
  Box,
} from "@mui/material";
import { Close } from "@mui/icons-material";
import { useMutation } from "@tanstack/react-query";
import RenderFormInput from "components/render/formInputs/RenderFormInput";
import { useAuth } from "hooks/useAuth";
import { useSnackbar } from "hooks/useSnackbar";
import React, { useEffect, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { useParams } from "react-router-dom";

interface FormData {
  id?: any;
  value: string;
  key: string;
  typeId?: string;
  typeName?: string;
  className?:any;
}

interface FormItem {
  name: keyof FormData;
  inputType: string;
  label: string;
  size: { md: number };
  rules?: any;
}

type Props = {
  refetch: () => void;
  addModalFlag: boolean;
  setAddModalFlag: React.Dispatch<React.SetStateAction<boolean>>;
  editeData: any;
  setEditeData: React.Dispatch<React.SetStateAction<any>>;
};

const AddPublicData = ({
  addModalFlag,
  setAddModalFlag,
  refetch,
  editeData,
  setEditeData,
}: Props) => {
  const { id, typeName } = useParams();
  const Auth = useAuth();
  const snackbar = useSnackbar();

  const { mutate, isLoading } = useMutation({
    mutationFn: Auth?.serverCall,
  });

  const {
    handleSubmit,
    control,
    formState: { errors },
    reset,
    getValues
  } = useForm<FormData>();


  const formItems: FormItem[] = [
    {
      name: "typeName",
      inputType: "text",
      label: "عنوان",
      size: { md: 6 },
      rules: {
        required: "عنوان الزامی است",
        minLength: {
          value: 2,
          message: "عنوان باید حداقل ۲ کاراکتر باشد",
        },
      },
    },
    {
      name: "className",
      inputType: "text",
      label: "کلید",
      size: { md: 6 },
      rules: {
        required: "کلید الزامی است",
        pattern: {
          value: /^[a-zA-Z0-9_-]+$/,
          message:
            "کلید باید فقط شامل حروف انگلیسی، اعداد، خط تیره و زیرخط باشد",
        },
      },
    },
  ];

  useEffect(() => {
    if (editeData !== null) {
      reset({
        typeName: editeData.typeName || "",
        className: editeData.className || "",
        id: editeData.id,
      });
    } 
  }, [editeData,addModalFlag]);

  const handleClose = () => {
    setAddModalFlag(false);
    reset();
    setEditeData(null)
    // setTimeout(()=>, 200);
  };



  const onSubmit = (data: FormData) => {
    // console.log("data",data)
    mutate(
      {
        entity: `common-type/${!!editeData ? "update" : "add"}`,
        method: !!editeData ? "put" : "post",
        data: data,
      },
      {
        onSuccess: (res: any) => {
          if (!!editeData)
            snackbar(
              `به روز رسانی اطلاعات پایه انتخاب شده با موفقیت انجام شد`,
              "success"
            );
          else snackbar(`ایجاد اطلاعات پایه جدید با موفقیت انجام شد`, "success");
          refetch();
          //   handleClose();
        },
        onError: () => {
          snackbar("خطا در انجام عملیات", "error");
        },
      }
    );
  };

  return (
    <Dialog open={addModalFlag} onClose={handleClose}  fullWidth>
      <DialogTitle>
        <Box display="flex" justifyContent="space-between" alignItems="center">
          <Typography variant="h6">
            {editeData ? `ویرایش اطلاعات پایه انتخاب شده` : `ایجاد اطلاعات پایه جدید`}
          </Typography>
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
                      controllerField={field}
                      errors={errors}
                      {...item}
                      value={(getValues() as any)[item.name]}
                      onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
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
                startIcon={!!editeData?<ChangeCircle/>:<AddCircle />}
                type="submit"
                disabled={isLoading}
              >
                {isLoading 
                  ? (!!editeData ? "در حال به روز رسانی..." : "در حال ایجاد...")
                  : (!!editeData ? "به روز رسانی" : "ایجاد")}
              </Button>
            </Grid>
          </Grid>
        </form>
      </DialogContent>
    </Dialog>
  );
};


export default AddPublicData