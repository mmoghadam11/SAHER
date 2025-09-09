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

interface FormData {
  id?: any;
  name: string;
  code: string;
  provinceId: string;
  provinceName: string;
  province?:any
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

const AddModal = ({
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
  } = useForm<FormData>();

  const [formData, setFormData] = useState<FormData>(
    !!editeData
      ? editeData
      : {
          provinceId: "1",
          provinceName: "تهران",
          name: "",
          code: "",
        }
  );

  const formItems: FormItem[] = [
    {
      name: "name",
      inputType: "text",
      label: "نام شهرستان",
      size: { md: 4 },
      rules: {
        required: "نام شهرستان الزامی است",
        minLength: {
          value: 2,
          message: "نام شهرستان باید حداقل ۲ کاراکتر باشد",
        },
      },
    },
    {
      name: "code",
      inputType: "text",
      label: "کد",
      size: { md: 4 },
      rules: {
        required: "کد الزامی است",
        pattern: {
          value: /^[a-zA-Z0-9_-]+$/,
          message: "کد باید فقط شامل حروف انگلیسی، اعداد، خط تیره و زیرخط باشد",
        },
      },
    },
    /** استفاده مستقیم */
    // {
    //   name: "provinceName", // تغییر نام فیلد به province
    //   inputType: "autocomplete", // تغییر به autocomplete
    //   label: "استان",
    //   size: { md: 4 },
    //   options: [
    //     // اضافه کردن options
    //     { value: 1, title: "تهران" },
    //     { value: 2, title: "اصفهان" },
    //     { value: 3, title: "شیراز" },
    //     { value: 4, title: "مشهد" },
    //     { value: 5, title: "تبریز" },
    //   ],
    //   rules: {
    //     required: "انتخاب استان الزامی است",
    //   },
    //   elementProps: {
    //     // اضافه کردن propsهای خاص برای Autocomplete
    //     renderOption: (props: any, option: any) => (
    //       <li {...props} key={option.value}>
    //         {option.title}
    //       </li>
    //     ),
    //     isOptionEqualToValue: (option: any, value: any) => {
    //       return option.value === value?.value;
    //     },
    //     getOptionLabel: (option: any) => option.title || "",
    //   },
    // },
  ];
  const {
    data: provinceOptions,
    status: provinceOptions_status,
    refetch: provinceOptions_refetch,
  } = useQuery<any>({
    // queryKey: [process.env.REACT_APP_API_URL + `/api/unit-allocations${paramsSerializer(filters)}`],
    // queryKey: [`/api/v1/common-type/find-all${paramsSerializer(filters)}`],
    queryKey: [`township/find-province`],
    queryFn: Auth?.getRequest,
    select: (res: any) => {
      return res?.data;
    },
  } as any);

  useEffect(() => {
    if (editeData !== null) {
      setFormData(editeData);
      reset({
        province: { 
          id: editeData.provinceId, 
          name: editeData.provinceName 
        },
        name: editeData.name || "",
        code: editeData.code || "",
        provinceName: editeData.provinceName || "",
        provinceId: editeData.provinceId || "",
        id: editeData.id,
      });
    }
  }, [editeData, addModalFlag]);
  useEffect(() => {
    console.log("formData=>", formData);
  }, [formData]);

  const handleClose = () => {
    setAddModalFlag(false);
    reset();
    setFormData({
      name: "",
      code: "",
      provinceName: "",
      provinceId: "",
    });
    setEditeData(null);
    // setTimeout(() => setEditeData(null), 500);
  };

  const handleInputChange = (fieldName: keyof FormData, value: string) => {
    setFormData((prev) => ({
      ...prev,
      [fieldName]: value,
    }));
  };

  const onSubmit = (data: FormData) => {
    mutate(
      {
        entity: `township/${!!editeData ? "update" : "add"}`,
        method: !!editeData ? "put" : "post",
        data: formData,
      },
      {
        onSuccess: (res: any) => {
          if (!!editeData)
            snackbar(
              `به روز رسانی شهرستان انتخاب شده با موفقیت انجام شد`,
              "success"
            );
          else snackbar(`ایجاد شهرستان جدید با موفقیت انجام شد`, "success");
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
    <Dialog open={addModalFlag} onClose={handleClose} fullWidth>
      <DialogTitle>
        <Box display="flex" justifyContent="space-between" alignItems="center">
          <Typography variant="h6">
            {editeData ? `ویرایش شهرستان انتخاب شده` : `ایجاد شهرستان جدید`}
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
                      value={formData[item.name]}
                      onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                        handleInputChange(item.name, e.target.value);
                        field.onChange(e);
                      }}
                    />
                  )}
                />
              </Grid>
            ))}
            <Grid item xs={12} md={4}>
              <Controller
                name="province"
                control={control}
                rules={{
                  required: "انتخاب استان الزامی است",
                }}
                render={({ field: { value, onChange, ref }, fieldState }) => (
                  <Autocomplete
                    ref={ref}
                    id="province"
                    onChange={(event: any, newValue: any) => {
                      onChange(newValue); // تغییرات را به react-hook-form گزارش دهید
                      if (newValue?.id) {
                        setFormData((prev: any) => ({
                          ...prev,
                          provinceId: newValue.id,
                          provinceName: newValue.name,
                        }));
                      }
                    }}
                    value={value|| null} // استفاده از value از react-hook-form
                    renderOption={(props: any, option: any) => (
                      <li {...props} key={option.id}>
                        {option.name}
                      </li>
                    )}
                    renderInput={(params) => (
                      <TextField
                        {...params}
                        label="انتخاب استان"
                        error={fieldState.invalid} // اضافه کردن error
                        helperText={fieldState.error?.message} // اضافه کردن helperText
                      />
                    )}
                    clearOnBlur
                    options={provinceOptions?.map((item: any) => ({
                      id: item.id,
                      name: item.value,
                    }))}
                    getOptionLabel={(option: any) => option.name || ""}
                    isOptionEqualToValue={(option: any, value: any) => {
                      return option.id === value?.id;
                    }}
                  />
                )}
              />
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

export default AddModal;
