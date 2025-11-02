// AddPartner.tsx (نسخه خلوت شده)

import {
  AddCircle,
  ChangeCircle,
  Diversity3,
  // ... سایر آیکون‌ها
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
  // Autocomplete و TextField دیگر اینجا لازم نیستند
} from "@mui/material";
import { Close } from "@mui/icons-material";
import { useMutation } from "@tanstack/react-query"; // useQuery حذف شد
import RenderFormInput from "components/render/formInputs/RenderFormInput";
import { useAuth } from "hooks/useAuth";
import { useSnackbar } from "hooks/useSnackbar";
import React, { useEffect } from "react"; // useState, useMemo حذف شدند
import { Controller, useForm } from "react-hook-form";
import { useParams } from "react-router-dom";
import { useBasicFormItems } from "./forms/useBasicFormItems";

type Props = {
  refetch: () => void;
  addModalFlag: boolean;
  setAddModalFlag: React.Dispatch<React.SetStateAction<boolean>>;
  editeData: any;
  setEditeData: React.Dispatch<React.SetStateAction<any>>;
};

const AddCAOrganization = ({
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
    getValues,
    setValue,
  } = useForm<any>();

  // --- تمام منطق جستجو، debounce، فیلتر، useQuery و ... حذف شد ---

  // --- استفاده از هوک جدید ---
  // این یک خط، جایگزین حدود ۸۰ خط منطق قبلی شما شده است
  const formItems = useBasicFormItems({ editeData, setValue });

  // --- useEffect خلوت شده ---
  useEffect(() => {
    // منطق setResponsibleTyping و setSupervisorTyping به هوک منتقل شد
    if (editeData !== null) {
      reset({
        ...editeData,
      });
    } else reset({});
  }, [editeData, addModalFlag, reset, id]); // reset و id به وابستگی‌ها اضافه شد

  // --- handleClose خلوت شده ---
  const handleClose = () => {
    setAddModalFlag(false);
    reset();
    setEditeData(null);
    // setResponsibleTyping و setSupervisorTyping حذف شدند
    // هوک usePartnerFormItems خودش با null شدنِ editeData ریست می‌شود
  };

  // --- onSubmit (بدون تغییر) ---
  const onSubmit = (data: any) => {
    // console.log("data", data);
    mutate(
      {
        entity: `auditing-organization/${!!editeData ? "update" : "save"}`,
        method: !!editeData ? "put" : "post",
        data: data,
      },
      {
        onSuccess: () => {
          snackbar(
            !!editeData
              ? `شاغل سازمان حسابرسی با موفقیت به‌روزرسانی شد`
              : `شاغل سازمان حسابرسی با موفقیت افزوده شد`,
            "success"
          );
          refetch();
        },
        onError: () => {
          snackbar("خطا در ثبت حکم انتظامی", "error");
        },
      }
    );
  };

  // --- JSX (بدون تغییر) ---
  return (
    <Dialog
      open={addModalFlag}
      onClose={handleClose}
      maxWidth={"sm"}
      PaperProps={{
        sx: {
          overflow: "visible", // اجازه به محتوای Dialog برای بیرون زدن
        },
      }}
    >
      <DialogTitle>
        <Box display="flex" justifyContent="space-between" alignItems="center">
          <Box
            display={"flex"}
            textAlign={"center"}
            alignItems={"center"}
            gap={1}
          >
            <Diversity3 fontSize="large" />
            <Typography variant="h6">
              {editeData
                ? `ویرایش شاغل سازمان حسابرسی انتخاب شده`
                : `افزودن شاغل سازمان حسابرسی جدید`}
            </Typography>
          </Box>
          <IconButton onClick={handleClose} size="small">
            <Close />
          </IconButton>
        </Box>
      </DialogTitle>

      <DialogContent sx={{ overflow: "visible" }}>
        <form onSubmit={handleSubmit(onSubmit)}>
          <Grid container spacing={3} mt={1}>
            {formItems.map((item: any) => (
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
                    : "در حال افزودن..."
                  : !!editeData
                  ? "به روز رسانی"
                  : "افزودن"}
              </Button>
            </Grid>
          </Grid>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default AddCAOrganization;
