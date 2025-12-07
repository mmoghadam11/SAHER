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
import { useDOCaseForm } from "./useDOCaseForm";
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

const AddMeeting = ({
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
  const [responsibleTyping, setResponsibleTyping] = useState(true);
  const [DICTyping, setDICTyping] = useState(true);
  const [PdfUrl, setPdfUrl] = useState<string | undefined>("");
  const [PdfViewFlag, setPdfViewFlag] = useState<boolean>(false);
  const { mutate, isLoading } = useMutation({
    mutationFn: Auth?.serverCall,
    onSuccess: () => {
      snackbar(
        !!editeData
          ? `دعوتنامه با موفقیت به‌روزرسانی شد`
          : `دعوتنامه جدید با موفقیت افزوده شد`,
        "success"
      );
      setResponsibleTyping(true);
      setDICTyping(true);
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
    setResponsibleTyping(true);
    setDICTyping(true);
    reset({});
    setPdfUrl("");
    setPdfViewFlag(false);
  };
  const onSubmit = (data: any) => {
    const {
      accuserPrimaryMeetingMumber,
      accuserPrimaryMeetingDate,
      boardPrimaryMeetingMumber,
      boardPrimaryMeetingDate,
      boardMeetingDate,
      ...restOfData
    } = data;
    // if (selectedItems.length === 0) {
    //   snackbar("لیست موضوعات تخلف خالی میباشد", "error");
    //   return 0;
    // }
    const submissionData = {
      accuserPrimaryMeetingMumber,
      accuserPrimaryMeetingDate,
      boardPrimaryMeetingMumber,
      boardPrimaryMeetingDate,
      boardMeetingDate,
      disciplinaryCaseId: editeData?.id ?? null,
    };

    console.log("submissionData", submissionData);
    mutate({
      entity: `disciplinary-case/create-meeting`,
      method: "post",
      data: submissionData,
    });
  };
  // فراخوانی هوک سفارشی با تمام منطق
  const formItems: FormItem[] = useMemo(
    () => [
      {
        name: "accuserPrimaryMeetingMumber",
        inputType: "text",
        label: "شماره دعوتنامه",
        size: { md: 6 },
        // rules: { required: "شاکی الزامی است" },
      },
      {
        name: "accuserPrimaryMeetingDate",
        inputType: "date",
        label: "تاریخ دعوتنامه",
        size: { md: 6 },
        elementProps: {
          setDay: (value: any) => setValue("accuserPrimaryMeetingDate", value),
        },
      },
      {
        name: "boardPrimaryMeetingMumber",
        inputType: "text",
        label: "شماره دعوتنامه هیئت بدوی انتظامی",
        size: { md: 6 },
        // rules: { required: "شاکی الزامی است" },
      },
      {
        name: "boardPrimaryMeetingDate",
        inputType: "date",
        label: "تاریخ دعوتنامه هیئت بدوی انتظامی",
        size: { md: 6 },
        elementProps: {
          setDay: (value: any) => setValue("boardPrimaryMeetingDate", value),
        },
      },
      {
        name: "boardMeetingDate",
        inputType: "date",
        label: "تاریخ دعوتنامه",
        size: { md: 6 },
        elementProps: {
          setDay: (value: any) => setValue("boardMeetingDate", value),
        },
      },
    ],
    []
  );

  useEffect(() => {
    if (!!editeData) {
      let initialRespondenType = undefined;

      if (editeData.auditingFirmId) {
        initialRespondenType = 396;
      } else if (editeData.personnelCaId) {
        initialRespondenType = 397;
        setResponsibleTyping(false);
        setDICTyping(false);
      }

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
            <Typography variant="h6">دعوتنامه</Typography>
          </Box>
          <IconButton onClick={handleClose} size="small">
            <Close />
          </IconButton>
        </Box>
      </DialogTitle>

      <DialogContent
      // sx={editable ? { overflowx: "visible", overflowY: "auto" } : {}}
      // sx={editable ? { overflow: "visible"} : {}}
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

export default AddMeeting;
