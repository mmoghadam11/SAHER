import {
  AddCircle,
  ChangeCircle,
  Man4,
  Map,
  PersonRemove,
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
import { TerminateFormItem } from "./TerminateFormItem";

interface FormData {
  id?: any;
  termName?: string;
  auditingFirmId: string;
  applicatorName?: string;
  hour_count?: string;
  request_year?: string;
  request_month?: string;
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

const TerminateCooprationModal = ({
  addModalFlag,
  setAddModalFlag,
  refetch,
  editeData,
  setEditeData,
}: Props) => {
  const Auth = useAuth();
  const snackbar = useSnackbar();
  const { id,staffId } = useParams();

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

  //   const [formData, setFormData] = useState<FormData>(
  //     !!editeData
  //       ? editeData
  //       : {
  //           termName: "",
  //           auditingFirmId: id,
  //           applicatorName: "",
  //           hour_count:  "",
  //           request_year:  "",
  //           request_month:  "",
  //         }
  //   );

  const formItems: any[] = TerminateFormItem(setValue);
  useEffect(() => {
    console.log("editeData=>", getValues());
   
  }, [editeData, addModalFlag]);


  const handleClose = () => {
    setAddModalFlag(false);
    reset();
    setEditeData(null);
  };

  const onSubmit = (data: FormData) => {
    mutate(
      {
        entity: `professional-staff/terminate-cooperation`,
        // entity: `firm-director/save`,
        method: "put",
        // method:  "post",
        data: {
          ...data,
          personnelId: editeData?.personnelId,
          auditingFirmId: id??editeData?.auditingFirmId,
        },
      },
      {
        onSuccess: (res: any) => {
          console.log("res=>", res);
          if (!!editeData){
            snackbar(
              `به روز رسانی همکاری شخص با موسسه انتخاب شده با موفقیت انجام شد`,
              "success"
            );
            handleClose();
          }
          else snackbar(`اطلاعات آموزشی جدید با موفقیت افزوده شد`, "success");
          refetch();
          //   handleClose();
        },
        onError: () => {
          snackbar("خطا در ایجاد اطلاعات آموزشی", "error");
        },
      }
    );
  };

  return (
    <Dialog PaperProps={{
        sx: {
          overflow: "visible", // اجازه به محتوای Dialog برای بیرون زدن
        },
      }} open={addModalFlag} onClose={handleClose} maxWidth={"sm"}>
      <DialogTitle>
        <Box display="flex" justifyContent="space-between" alignItems="center">
          <Box display={"flex"} textAlign={"center"} alignItems={"center"}>
            <PersonRemove  />
            <Typography variant="body1">
              {editeData
                ? `درخواست اتمام همکاری با${editeData?.personnelFirstName} ${editeData?.personnelLastName}`
                : `ایجاد اطلاعات آموزشی جدید`}
            </Typography>
          </Box>
          <IconButton onClick={handleClose} size="small">
            <Close />
          </IconButton>
        </Box>
      </DialogTitle>

      <DialogContent sx={{overflow:"visible"}}>
        <form onSubmit={handleSubmit(onSubmit)}>
          <Grid container spacing={3} mt={1} justifyContent={"center"}>
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
                color="warning"
                type="submit"
                disabled={isLoading}
              >
                {isLoading
                  ? !!editeData
                    ? "در حال به روز رسانی..."
                    : "در حال ایجاد..."
                  : !!editeData
                  ? "تایید"
                  : "ایجاد"}
              </Button>
            </Grid>
          </Grid>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default TerminateCooprationModal;
