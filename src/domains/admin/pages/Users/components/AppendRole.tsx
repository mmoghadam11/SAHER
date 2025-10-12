import { AddCircle, ChangeCircle, Map, Psychology } from "@mui/icons-material";
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
  Chip,
} from "@mui/material";
import { Close } from "@mui/icons-material";
import { useMutation, useQuery } from "@tanstack/react-query";
import RenderFormInput from "components/render/formInputs/RenderFormInput";
import { useAuth } from "hooks/useAuth";
import { useSnackbar } from "hooks/useSnackbar";
import React, { useEffect, useState } from "react";
import { Controller, set, useForm } from "react-hook-form";
import { useParams } from "react-router-dom";
import RenderFormDisplay from "components/render/formInputs/RenderFormDisplay";
import { FormItem } from "types/formItem";

interface FormData {
  roles: any[];
}



type Props = {
  refetch: () => void;
  appendRoleFlag: boolean;
  setAppendRoleFlag: React.Dispatch<React.SetStateAction<boolean>>;
  editeData: any;
  setEditeData: React.Dispatch<React.SetStateAction<any>>;
};

const AppendRole = ({
  appendRoleFlag,
  setAppendRoleFlag,
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
    getValues
  } = useForm<FormData>();

 
  const [formData, setFormData] = useState<FormData>(
    !!editeData ? editeData?.roleDtos : []
  );
  const {
    data: roleOptions,
    status: roleOptions_status,
    refetch: roleOptions_refetch,
  } = useQuery<any>({
    queryKey: [`role/find-by-name-all`],
    queryFn: Auth?.getRequest,
    select: (res: any) => {
      return res?.data;
    },
    enabled: true,
  } as any);
  useEffect(() => {
    if (editeData !== null) {
      setFormData(editeData?.roleDtos ?? []);
      reset({
        roles: editeData?.roleDtos || [],
      });
    }
  }, [editeData, appendRoleFlag]);
   const rolesFormItem: FormItem = {
  name: "roles",
  inputType: "autocomplete",
  label: "نقش‌ها",
  size: { md: 12 }, // یا هر سایز دلخواه دیگر
  rules: {
    required: "انتخاب نقش الزامی است",
    validate: (value:any) => value.length > 0 || "انتخاب حداقل یک نقش الزامی است",
  },
  
  // 🔹 نکته کلیدی: تبدیل آپشن‌ها به فرمت استاندارد
  // RenderFormDisplay انتظار ساختار { value, title } را دارد
  options: roleOptions?.map((role: any) => ({
    value: role.id, // یا خود آبجکت role اگر نیاز دارید
    title: role.name,
  })) ?? [],

  // 🔹 مشخص کردن نوع ذخیره‌سازی مقدار
  // چون مقدار ذخیره شده در فرم، یک آرایه از آبجکت‌هاست
  storeValueAs: "object",

  // 🔹 پاس دادن پراپرتی‌های خاص Autocomplete
  elementProps: {
    multiple: true,
    limitTags: 2,
    // filterSelectedOptions: true, // اگر نیاز بود
    // getOptionLabel, isOptionEqualToValue و ... را می‌توان در RenderFormInput هندل کرد
    // تا کامپوننت اصلی تمیز بماند.
  },
};
  useEffect(() => {
    console.log("formData=>", formData);
  }, [formData]);

  const handleClose = () => {
    setAppendRoleFlag(false);
    reset();
    setFormData({
      roles: [],
    });
    setEditeData(null);
    // setTimeout(() => setEditeData(null), 500);
  };

  const onSubmit = (data: FormData) => {
    console.log("lastData=", data);
    mutate(
      {
        entity: `user/modify-role?userId=${editeData?.id}`,
        method: "post",
        data: [...data.roles],
      },
      {
        onSuccess: (res: any) => {
          if (!!editeData)
            snackbar(
              `به روز رسانی کاربر با نقش های انتخاب شده با موفقیت انجام شد`,
              "success"
            );
          else snackbar(`ایجاد نقش جدید با موفقیت انجام شد`, "success");
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
    <Dialog open={appendRoleFlag} onClose={handleClose} fullWidth>
      <DialogTitle>
        <Box display="flex" justifyContent="space-between" alignItems="center">
          <Box display={"flex"} textAlign={"center"} alignItems={"center"}>
            <Psychology fontSize="large" />
            <Typography variant="h6">
              {editeData ? `مدیریت نقش های کاربر انتخاب شده` : `ایجاد نقش جدید`}
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
            <Grid item xs={12} md={12}>
              <Controller
                name="roles"
                control={control}
                rules={{
                  required: "انتخاب نقش الزامی است",
                }}
                render={({ field: { value, onChange, ref }, fieldState }) => (
                  <Autocomplete
                    multiple
                    ref={ref}
                    id="roleId"
                    onChange={(event, newValue) => {
                      onChange(newValue);
                    }}
                    value={value || []}
                    limitTags={2} // 🔹 محدودیت نمایش تگ‌ها
                    // filterSelectedOptions // 🔹 عدم نمایش گزینه‌های انتخاب شده در لیست
                    renderTags={(value, getTagProps) =>
                      value.map((option, index) => (
                        <Chip
                          label={option.name}
                          {...getTagProps({ index })}
                          //   disabled={index === 0} // 🔹 می‌توانید تگ خاصی را غیرفعال کنید
                          size="small"
                        />
                      ))
                    }
                    renderOption={(props, option) => (
                      <li {...props} key={option.id}>
                        {option.name}
                      </li>
                    )}
                    renderInput={(params) => (
                      <TextField
                        {...params}
                        label="انتخاب نقش"
                        error={fieldState.invalid}
                        helperText={fieldState.error?.message}
                      />
                    )}
                    options={roleOptions?.map((item: any) => ({
                      id: item.id,
                      name: item.name,
                    }))}
                    getOptionLabel={(option) => option.name || ""}
                    isOptionEqualToValue={(option, value) =>
                      option.id === value.id
                    }
                  />
                )}
              />
              {/* <RenderFormDisplay item={rolesFormItem} value={getValues(rolesFormItem.name as any)} /> */}
            </Grid>

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

export default AppendRole;
