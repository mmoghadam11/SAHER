import { AddCircle, ChangeCircle, Gavel } from "@mui/icons-material";
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
import React, { useEffect } from "react";
import { Controller, useForm } from "react-hook-form";
import { PunishmentFormItems } from "./PunishmentFormItems";

interface FormData {
  id?: any;
  name: string;
  code: string;
  provinceId: string;
  provinceName: string;
  province?: any;
}


type Props = {
  refetch: () => void;
  addModalFlag: boolean;
  setAddModalFlag: React.Dispatch<React.SetStateAction<boolean>>;
  editeData: any;
  setEditeData: React.Dispatch<React.SetStateAction<any>>;
};

const AddPunishmentModal = ({
  addModalFlag,
  setAddModalFlag,
  refetch,
  editeData,
  setEditeData,
}: Props) => {
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
    setValue,
  } = useForm<FormData>();

  

  
  const formItems: any[] = PunishmentFormItems(setValue);
  useEffect(() => {
    if (editeData !== null) {
      reset({
        ...editeData,
        auditingFirmUsed:editeData?.auditingFirmUsed?"true":"false",
        cerifiedAccountantUsed:editeData?.cerifiedAccountantUsed?"true":"false"
      });
    }
    else reset({});
  }, [editeData, addModalFlag]);


  const handleClose = () => {
    setAddModalFlag(false);
    reset({});
    setEditeData(null);
    // setTimeout(() => setEditeData(null), 500);
  };


  const onSubmit = (data: FormData) => {
    mutate(
      {
        entity: `disciplinary-order-base/${!!editeData ? "update" : "save"}`,
        // entity: `firm-director/save`,
        method: !!editeData ? "put" : "post",
        // method:  "post",
        data: {
          ...data,
        },
      },
      {
        onSuccess: (res: any) => {
          console.log("res=>",res)
          if (!!editeData)
            snackbar(
              `به روز رسانی تنبیه انتخاب شده با موفقیت انجام شد`,
              "success"
            );
          else 
            snackbar(`تنبیه انتظامی جدید با موفقیت افزوده شد`, "success");
          refetch();
          //   handleClose();
        },
        onError: () => {
          snackbar("خطا در ایجاد تنبیه انتظامی", "error");
        },
      }
    );
  };

  return (
    <Dialog open={addModalFlag} onClose={handleClose} maxWidth={"sm"} 
    PaperProps={{
        sx: {
          overflow: "visible", // اجازه به محتوای Dialog برای بیرون زدن
        },
      }}
    >
      <DialogTitle>
        <Box display="flex" justifyContent="space-between" alignItems="center">
          <Box display={"flex"} textAlign={"center"} alignItems={"center"}>
            <Gavel fontSize="large"/>
            <Typography variant="h6">
              {editeData ? `ویرایش تنبیه انتظامی انتخاب شده` : `ایجاد تنبیه جدید`}
            </Typography>
          </Box>
          <IconButton onClick={handleClose} size="small">
            <Close />
          </IconButton>
        </Box>
      </DialogTitle>

      <DialogContent sx={{ overflow: "visible" }}>
        <form onSubmit={handleSubmit(onSubmit)}>
          <Grid container spacing={3} mt={1} overflow={"visible"} sx={{overflow:"visible",height:"100%"}}>
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
                            // value={(formData as any)[item.name]}
                            onChange={(
                              e: React.ChangeEvent<HTMLInputElement>
                            ) => {
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

export default AddPunishmentModal;
