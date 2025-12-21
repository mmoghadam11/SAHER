import {
  AddCircle,
  ChangeCircle,
  GavelOutlined,
  Close,
  Add,
  Delete,
  Search,
  HistoryEdu,
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
  CircularProgress,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TextField,
  Tooltip,
} from "@mui/material";
import RenderFormInput from "components/render/formInputs/RenderFormInput";
import React, { useEffect, useMemo, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { useMutation, useQuery } from "@tanstack/react-query";
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

const AddHMeeting = ({
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
      snackbar(
        !!editeData
          ? `دعوتنامه با موفقیت به‌روزرسانی شد`
          : `دعوتنامه جدید با موفقیت افزوده شد`,
        "success"
      );
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
      boardSupremeMeetingNumber,
      boardSupremeMeetingDate,
      meetingDate,
      ...restOfData
    } = data;
    // if (selectedItems.length === 0) {
    //   snackbar("لیست موضوعات تخلف خالی میباشد", "error");
    //   return 0;
    // }
    const submissionData = {
      boardSupremeMeetingNumber,
      boardSupremeMeetingDate,
      meetingDate,
      supremeId: editeData?.id ?? null,
    };

    console.log("submissionData", submissionData);
    mutate({
      entity: `disciplinary-supreme/create-meeting`,
      method: "put",
      data: submissionData,
    });
  };
  // فراخوانی هوک سفارشی با تمام منطق
  const formItems: FormItem[] = useMemo(
    () => [
      {
        name: "boardSupremeMeetingNumber",
        inputType: "text",
        label: "شماره دعوتنامه",
        size: { md: 6 },
        rules: { required: "شماره دعوتنامه الزامی است" },
      },
      {
        name: "boardSupremeMeetingDate",
        inputType: "date",
        label: "تاریخ دعوتنامه",
        size: { md: 6 },
        elementProps: {
          setDay: (value: any) => setValue("boardSupremeMeetingDate", value),
        },
        rules: { required: "تاریخ دعوتنامه الزامی است" },
      },
      {
        name: "meetingDate",
        inputType: "date",
        label: "تاریخ تشکیل جلسه",
        size: { md: 6 },
        elementProps: {
          setDay: (value: any) => setValue("meetingDate", value),
        },
        rules: { required: "تاریخ تشکیل جلسه الزامی است" },
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
      <DialogTitle>
        <Box display="flex" justifyContent="space-between" alignItems="center">
          <Box display="flex" textAlign="center" alignItems="center" gap={1}>
            <HistoryEdu fontSize="large" />
            <Typography variant="h6">دعوتنامه جلسه عالی</Typography>
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

            <Grid item xs={12} display="flex" justifyContent="flex-end" mt={2}>
              <Button variant="outlined" onClick={handleClose} sx={{ mr: 2 }}>
                بازگشت
              </Button>
              {editable && (
                <Button
                  variant="contained"
                  startIcon={<AddCircle />}
                  type="submit"
                  disabled={isLoading}
                >
                  {isLoading ? "در حال ثبت..." : "ثبت"}
                </Button>
              )}
            </Grid>
          </Grid>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default AddHMeeting;
