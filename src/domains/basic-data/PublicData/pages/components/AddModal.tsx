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

const AddModal = ({
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
  } = useForm<FormData>();

  const [formData, setFormData] = useState<FormData>(
    !!editeData
      ? editeData
      : {
          value: "",
          key: "",
          typeId: id,
          typeName: typeName,
        }
  );

  const formItems: FormItem[] = [
    {
      name: "value",
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
      name: "key",
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
      setFormData(editeData);
      reset({
        value: editeData.value || "",
        key: editeData.key || "",
        typeId: editeData.typeId || id,
        typeName: editeData.typeName || typeName,
        id: editeData.id,
      });
    } 
  }, [editeData,addModalFlag]);

  const handleClose = () => {
    setAddModalFlag(false);
    reset();
    setFormData({
      value: "",
      key: "",
      typeId: id,
      typeName: typeName,
    });
    setTimeout(()=>setEditeData(null), 500);
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
        entity: `common-data/${!!editeData ? "update" : "add"}`,
        method: !!editeData ? "put" : "post",
        data: formData,
      },
      {
        onSuccess: (res: any) => {
          if (!!editeData)
            snackbar(
              `به روز رسانی ${typeName} انتخاب شده با موفقیت انجام شد`,
              "success"
            );
          else snackbar(`ایجاد ${typeName} جدید با موفقیت انجام شد`, "success");
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
            {editeData ? `ویرایش ${typeName} انتخاب شده` : `ایجاد ${typeName} جدید`}
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

export default AddModal;
