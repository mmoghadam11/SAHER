import { AddCircle, Check, ChromeReaderModeRounded, Close, PanTool } from "@mui/icons-material";
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
import RenderFormInput from "components/render/formInputs/RenderFormInput";
import React, { useEffect, useMemo, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { useMutation } from "@tanstack/react-query";
import { useAuth } from "hooks/useAuth";
import { useSnackbar } from "hooks/useSnackbar";
import RenderFormDisplay from "components/render/formInputs/RenderFormDisplay";
import { FormItem } from "types/formItem";

// مسیر هوک را بر اساس ساختار پروژه خودتان تنظیم کنید

type Props = {
  editable: boolean;
  refetch: () => void;
  addModalFlag: boolean;
  setAddModalFlag: React.Dispatch<React.SetStateAction<boolean>>;
  editeData: any;
  setEditeData: React.Dispatch<React.SetStateAction<any>>;
};

const PrResponse = ({
  editable,
  addModalFlag,
  setAddModalFlag,
  refetch,
  editeData,
  setEditeData,
}: Props) => {
  // دیگر نیازی به id از useParams در این کامپوننت نیست
  // const { id } = useParams();
  const Auth = useAuth();
  const snackbar = useSnackbar();
  const [response, setResponse] = useState("reject")
  const {
    handleSubmit,
    control,
    formState: { errors },
    reset,
    setValue,
    getValues,
    watch,
  } = useForm<any>();

  const { mutate, isLoading } = useMutation({
    mutationFn: Auth?.serverCall,
    onSuccess: () => {
      snackbar(`پاسخ اعتراض با موفقیت ثبت شد`,"success");
      refetch();
      handleClose();
    },
    onError: () => {
      snackbar("خطا در ثبت دعوتنامه", "error");
    },
  });
  const handleClose = () => {
    setAddModalFlag(false);
    setEditeData(null);
    reset({});
  };
  const onSubmit = (data: any) => {
    const {
      rejectionReason,
      actionDate,
      ...restOfData
    } = data;
    const submissionData = {
      rejectionReason,
      actionDate,
      disciplinaryCaseId: editeData?.id ?? null,
    };

    console.log("submissionData", submissionData);
    console.log("response", response);
    mutate({
      entity: `disciplinary-case/${response}-objection`,
      method: "put",
      data: submissionData,
    });
  };
  // فراخوانی هوک سفارشی با تمام منطق
  const formItems: FormItem[] = useMemo(
    () => [
      {
        name: "rejectionReason",
        inputType: "text",
        label: "توضیحات",
        size: { md: 8 },
        // rules: { required: "شاکی الزامی است" },
      },
      {
        name: "actionDate",
        inputType: "date",
        label: "تاریخ پاسخ",
        size: { md: 4 },
        elementProps: {
          setDay: (value: any) => setValue("boardMeetingDate", value),
        },
      },
    ],
    []
  );

  useEffect(() => {
    if (!!editeData) {
      // reset کردن فرم با داده‌های editeData و نوع پاسخ‌دهنده تعیین شده
      reset({
        ...editeData,
      });
    } else {
      // حالت جدید: مقادیر پیش‌فرض
      reset({});
    }
  }, [editeData, reset]);

  return (
    <Dialog
      open={addModalFlag}
      onClose={handleClose}
      maxWidth={"sm"}
      PaperProps={{ sx: { overflow: "visible" } }}
    >
      <DialogTitle minWidth={"50vw"}>
        <Box display="flex" justifyContent="space-between" alignItems="center" >
          <Box display="flex" textAlign="center" alignItems="center" gap={1} >
            <ChromeReaderModeRounded fontSize="medium" />
            <Typography variant="body1" fontSize={"large"}>
              پاسخ اعتراض به حکم انتظامی بدوی
            </Typography>
          </Box>
          <IconButton onClick={handleClose} size="small">
            <Close />
          </IconButton>
        </Box>
      </DialogTitle>

      <DialogContent
        // sx={editable ? { overflowx: "visible", overflowY: "auto" } : {}}
        sx={{ overflow: "visible" }}
      >
        <form onSubmit={handleSubmit(onSubmit)}>
          <Grid container spacing={3} mt={1}>
            {formItems.map((item) => (
              <Grid item xs={12} md={item.size.md} key={item.name}>
                <Controller
                  name={item.name}
                  control={control}
                  rules={item?.rules}
                  render={({ field }) =>
                    editable ? (
                      <RenderFormInput
                        controllerField={field}
                        errors={errors}
                        {...item}
                        onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                          // handleInputChange(item.name, e.target.value);
                          field.onChange(e);
                        }}
                        value={(getValues() as any)[item.name]}
                      />
                    ) : (
                      <RenderFormDisplay
                        item={item}
                        value={(getValues() as any)[item.name]}
                      />
                    )
                  }
                />
              </Grid>
            ))}

            <Grid item xs={12} display="flex" justifyContent="space-between" mt={2}>
              <Button variant="outlined" onClick={handleClose} sx={{ mr: 2 }}>
                بازگشت
              </Button>
              <Box display={"flex"}>
                {editable && (
                <Button
                  variant="contained"
                  startIcon={<Check/>}
                  type="submit"
                  disabled={isLoading}
                  onClick={()=>setResponse("accept")}
                >
                  {isLoading ? "در حال ثبت..." : "تایید"}
                </Button>
              )}
              {editable && (
                <Button
                  variant="contained"
                  color="error"
                  startIcon={<Close />}
                  type="submit"
                  disabled={isLoading}
                  onClick={()=>setResponse("reject")}
                >
                  {isLoading ? "در حال ثبت..." : "رد درخواست"}
                </Button>
              )}
              </Box>
              
            </Grid>
          </Grid>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default PrResponse;
