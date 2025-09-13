import { AddCircle, ChangeCircle, Map } from "@mui/icons-material";
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
  townShipId: string;
  townShipName: string;
  townShip?: any;
  provinceId: string;
  provinceName: string;
  province?: any;
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
    setValue,
  } = useForm<FormData>();

  const [formData, setFormData] = useState<FormData>(
    !!editeData
      ? editeData
      : {
          townShipId: "",
          townShipName: "",
          name: "",
          code: "",
        }
  );

  const formItems: FormItem[] = [
    {
      name: "name",
      inputType: "text",
      label: "نام شهرستان",
      size: { md: 6 },
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
      size: { md: 6 },
      rules: {
        required: "کد الزامی است",
        pattern: {
          value: /^[a-zA-Z0-9_-]+$/,
          message: "کد باید فقط شامل حروف انگلیسی، اعداد، خط تیره و زیرخط باشد",
        },
      },
    },
  ];
  const {
    data: provinceOptions,
    status: provinceOptions_status,
    refetch: provinceOptions_refetch,
  } = useQuery<any>({
    queryKey: [`township/find-province`],
    queryFn: Auth?.getRequest,
    select: (res: any) => {
      return res?.data;
    },
  } as any);
  const {
    data: townShipOptions,
    status: townShipOptions_status,
    refetch: townShipOptions_refetch,
  } = useQuery<any>({
    queryKey: [`township/find-by-province?provinceId=${formData?.provinceId}`],
    queryFn: Auth?.getRequest,
    select: (res: any) => {
      return res?.data;
    },
    enabled: !!formData?.provinceId,
  } as any);

  useEffect(() => {
    if (editeData !== null) {
      setFormData(editeData);
      reset({
        townShip: {
          id: editeData.townShipId,
          name: editeData.townShipName,
        },
        province: {
          id: editeData.provinceId,
          name: editeData.provinceName,
        },
        name: editeData.name || "",
        code: editeData.code || "",
        townShipName: editeData.townShipName || "",
        townShipId: editeData.townShipId || "",
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
      townShipName: "",
      townShipId: "",
      provinceId: "",
      provinceName: "",
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
    // console.log("the FormData=>", data);
    mutate(
      {
        entity: `city/${!!editeData ? "update" : "add"}`,
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
            !!editeData&&handleClose();
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
          <Box display={"flex"} textAlign={"center"} alignItems={"center"}>
            <Map />
            <Typography variant="h6">
              {editeData ? `ویرایش شهر انتخاب شده` : `ایجاد شهر جدید`}
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
            <Grid item xs={12} md={6}>
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
                    onChange={(event: any, newValue: any, reason) => {
                      onChange(newValue); // تغییرات را به react-hook-form گزارش دهید
                      if (newValue?.id) {
                        setFormData((prev: any) => ({
                          ...prev,
                          provinceId: newValue.id,
                          provinceName: newValue.name,
                          townShipId: "",
                          townShipName: "",
                          townShip: null,
                        }));
                      }
                      if (reason === "clear") {
                        setFormData((prev: any) => ({
                          ...prev,
                          provinceId: "",
                          provinceName: "",
                          townShipId: "",
                          townShipName: "",
                          townShip: null,
                        }));
                        setValue("province", null);
                      }
                      setValue("townShip", null);
                    }}
                    value={value || null} // استفاده از value از react-hook-form
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
            {formData?.provinceId && !!townShipOptions && (
              <Grid item xs={12} md={6}>
                <Controller
                  name="townShip"
                  control={control}
                  rules={{
                    required: "انتخاب شهرستان الزامی است",
                  }}
                  render={({ field: { value, onChange, ref }, fieldState }) => (
                    <Autocomplete
                      ref={ref}
                      id="township"
                      onChange={(event: any, newValue: any, reason) => {
                        onChange(newValue); // تغییرات را به react-hook-form گزارش دهید
                        if (newValue?.id) {
                          setFormData((prev: any) => ({
                            ...prev,
                            townShipId: newValue.id,
                            townShipName: newValue.name,
                          }));
                        }
                        if (reason === "clear") {
                          setFormData((prev: any) => ({
                            ...prev,
                            townShipId: "",
                            townShipName: "",
                            townShip: null,
                          }));
                          setValue("townShip", null);
                        }
                      }}
                      value={value || null} // استفاده از value از react-hook-form
                      renderOption={(props: any, option: any) => (
                        <li {...props} key={option.id}>
                          {option.name}
                        </li>
                      )}
                      renderInput={(params) => (
                        <TextField
                          {...params}
                          label="انتخاب شهرستان"
                          error={fieldState.invalid} // اضافه کردن error
                          helperText={fieldState.error?.message} // اضافه کردن helperText
                        />
                      )}
                      clearOnBlur
                      options={townShipOptions?.map((item: any) => ({
                        id: item.id,
                        name: item.name,
                      }))}
                      getOptionLabel={(option: any) => option.name || ""}
                      isOptionEqualToValue={(option: any, value: any) => {
                        return option.id === value?.id;
                      }}
                    />
                  )}
                />
              </Grid>
            )}

            {!!formData?.townShipId &&
              formItems.map((item) => (
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
