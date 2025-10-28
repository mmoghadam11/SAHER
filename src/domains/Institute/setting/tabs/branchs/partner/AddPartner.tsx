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
// import { PartnerFormItems } from "./PartnerFormItems"; // حذف شد
import { usePartnerFormItems } from "./usePartnerFormItems"; // هوک جدید جایگزین شد
// import { useDebounce } from "hooks/useDebounce"; // حذف شد
// import paramsSerializer from "services/paramsSerializer"; // حذف شد

type Props = {
  refetch: () => void;
  addPartnerFlag: boolean;
  setAddPartnerFlag: React.Dispatch<React.SetStateAction<boolean>>;
  editePartnerData: any;
  setEditePartnerData: React.Dispatch<React.SetStateAction<any>>;
  selectedBranch: any;
};

const AddPartner = ({
  selectedBranch,
  addPartnerFlag,
  setAddPartnerFlag,
  refetch,
  editePartnerData,
  setEditePartnerData,
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
  const formItems = usePartnerFormItems({ setValue, editePartnerData });

  // --- useEffect خلوت شده ---
  useEffect(() => {
    // منطق setResponsibleTyping و setSupervisorTyping به هوک منتقل شد
    if (editePartnerData !== null) {
      reset({
        ...editePartnerData,
      });
    } else
      reset({
        auditingFirmId: id,
      });
  }, [editePartnerData, addPartnerFlag, reset, id]); // reset و id به وابستگی‌ها اضافه شد

  // --- handleClose خلوت شده ---
  const handleClose = () => {
    setAddPartnerFlag(false);
    reset();
    setEditePartnerData(null);
    // setResponsibleTyping و setSupervisorTyping حذف شدند
    // هوک usePartnerFormItems خودش با null شدنِ editePartnerData ریست می‌شود
  };

  // --- onSubmit (بدون تغییر) ---
  const onSubmit = (data: any) => {
    mutate(
      {
        entity: `audited-firm-branch/${
          !!editePartnerData ? "update" : "save"
        }-partner`,
        method: !!editePartnerData ? "put" : "post",
        data: {
          ...data,
          auditingFirmBranchId: selectedBranch?.id,
          auditingFirmId: id,
        },
      },
      {
        onSuccess: (res: any) => {
          console.log("res=>", res);
          if (!!editePartnerData)
            snackbar(
              `به روز رسانی شریک انتخاب شده با موفقیت انجام شد`,
              "success"
            );
          else snackbar(`شریک جدید با موفقیت افزوده شد`, "success");
          refetch();
          //  handleClose(); // اگر می‌خواهید بعد از ثبت بسته شود
        },
        onError: () => {
          snackbar("خطا در ایجاد شریک", "error");
        },
      }
    );
  };

  // --- JSX (بدون تغییر) ---
  return (
    <Dialog
      open={addPartnerFlag}
      onClose={handleClose}
      maxWidth={"md"}
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
              {editePartnerData ? `ویرایش شریک انتخاب شده` : `ایجاد شریک جدید`}
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
                startIcon={
                  !!editePartnerData ? <ChangeCircle /> : <AddCircle />
                }
                type="submit"
                disabled={isLoading}
              >
                {isLoading
                  ? !!editePartnerData
                    ? "در حال به روز رسانی..."
                    : "در حال ایجاد..."
                  : !!editePartnerData
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

export default AddPartner;
