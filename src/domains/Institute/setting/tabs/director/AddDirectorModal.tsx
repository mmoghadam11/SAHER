import { AddCircle, ChangeCircle, Man4, Map } from "@mui/icons-material";
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
import { DirectorItems } from "../../forms/DirectorItems";

interface FormData {
  id?: any;
  name: string;
  code: string;
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

const AddDirectorModal = ({
  addModalFlag,
  setAddModalFlag,
  refetch,
  editeData,
  setEditeData,
}: Props) => {
  const Auth = useAuth();
  const snackbar = useSnackbar();
  const {id}=useParams()

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

  
  const formItems: any[] = DirectorItems(setValue);
  useEffect(() => {
    if (editeData !== null) {
      setFormData(editeData);
      reset({
        ...editeData
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
        entity: `firm-director/${id!=="new" ? "update" : "save"}`,
        // entity: `firm-director/save`,
        method: id!=="new" ? "put" : "post",
        // method:  "post",
        data: {
          ...data,
          active: true,
          firmId:id,
        },
      },
      {
        onSuccess: (res: any) => {
          console.log("res=>",res)
          if (id!=="new")
            snackbar(
              `به روز رسانی موسسه انتخاب شده با موفقیت انجام شد`,
              "success"
            );
          else 
            snackbar(`مدیرعامل جدید با موفقیت افزوده شد`, "success");
          refetch();
          //   handleClose();
        },
        onError: () => {
          snackbar("خطا در ایجاد مدیرعامل", "error");
        },
      }
    );
  };

  return (
    <Dialog open={addModalFlag} onClose={handleClose} maxWidth={"md"}>
      <DialogTitle>
        <Box display="flex" justifyContent="space-between" alignItems="center">
          <Box display={"flex"} textAlign={"center"} alignItems={"center"}>
            <Man4 fontSize="large"/>
            <Typography variant="h6">
              {editeData ? `ویرایش مدیرعامل انتخاب شده` : `ایجاد مدیرعامل جدید`}
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
                            value={(formData as any)[item.name]}
                            onChange={(
                              e: React.ChangeEvent<HTMLInputElement>
                            ) => {
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

export default AddDirectorModal;
