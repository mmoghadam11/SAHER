import {
  AddCircle,
  ChangeCircle,
  GavelOutlined,
  Close,
  Add,
  Delete,
  Search,
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
import React, { useEffect, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { useMutation, useQuery } from "@tanstack/react-query";
import { useAuth } from "hooks/useAuth";
import { useSnackbar } from "hooks/useSnackbar";
import RenderFormDisplay from "components/render/formInputs/RenderFormDisplay";
import { useDOCaseForm } from "./useDOCaseForm";

// مسیر هوک را بر اساس ساختار پروژه خودتان تنظیم کنید

type Props = {
  editable: boolean;
  refetch: () => void;
  addModalFlag: boolean;
  setAddModalFlag: React.Dispatch<React.SetStateAction<boolean>>;
  editeData: any;
  setEditeData: React.Dispatch<React.SetStateAction<any>>;
};

const AddDOCase = ({
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
          ? `حکم انتظامی با موفقیت به‌روزرسانی شد`
          : `حکم انتظامی جدید با موفقیت افزوده شد`,
        "success"
      );
      setResponsibleTyping(true);
      setDICTyping(true);
      refetch();
      handleClose();
    },
    onError: () => {
      snackbar("خطا در ثبت حکم انتظامی", "error");
    },
  });
  const handleClose = () => {
    setAddModalFlag(false);
    setEditeData(null);
    setResponsibleTyping(true);
    setDICTyping(true);
    reset({
      cdClaimantTypeId: null,
      cdRespondenTypeId: null, // نوع پاسخ‌دهنده
      cdSubjectTypeId: "", // موضوع
      auditingFirmId: undefined, // موسسه (اگر وجود داشته باشد)
      personnelCaId: undefined, // حسابدار رسمی (اگر وجود داشته باشد)
      claimant: "", // شاکی (رشته خالی)
      workgroupId: "", // کارگروه
      cdOrderTypeId: "", // نوع حکم
      orderNumber: "", // شماره حکم
      receiptDate: null, // تاریخ‌ها
      startDate: null,
      endDate: null,
      fileCreationDate: null,
      fileTerminationDate: null,
      setSelectedItems: null,
      recordDate: null,
      recordNumber: null,
      orderDate: null,
    });
    setSearchKey("");
    setSelectedItems([]);
    setPdfUrl("");
    setPdfViewFlag(false);
  };
  const onSubmit = (data: any) => {
    // if (selectedItems.length === 0) {
    //   snackbar("لیست موضوعات تخلف خالی میباشد", "error");
    //   return 0;
    // }
    const { cdRespondenTypeId, ...restOfData } = data; // حذف cdRespondenTypeId
    const { orderDuration, ...formData } = data; // حذف orderDuration

    const submissionData = {
      ...data,
    };

    console.log("submissionData", submissionData);
      mutate({
        entity: `disciplinary-case/${!!editeData ? "update" : "save"}`,
        method: !!editeData ? "put" : "post",
        data: submissionData,
      });
  };
  // فراخوانی هوک سفارشی با تمام منطق
  const { formItems, listLogic } = useDOCaseForm({
    editeData,
    watch,
    setValue,
    reset,
    responsibleTyping,
    setResponsibleTyping,
    DICTyping,
    setDICTyping,
  });
  const {
    searchKey,
    setSearchKey,
    orderSubjectOptions,
    isSearching,
    handleSearchClick,
    selectedItems,
    setSelectedItems,
    handleAddItem,
    handleRemoveItem,
  } = listLogic;

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
        cdRespondenTypeId: initialRespondenType,
        // cdClaimantTypeId: !!editeData?.startDate ? 399 : 398,
      });
    } else {
      // حالت جدید: مقادیر پیش‌فرض
      reset({
        cdClaimantTypeId: null,
        cdRespondenTypeId: null,
        cdSubjectTypeId: "",
        auditingFirmId: null,
        personnelCaId: null,
        claimant: "",
        workgroupId: "",
        cdOrderTypeId: "",
        orderNumber: "",
        receiptDate: null,
        startDate: null,
        endDate: null,
        fileCreationDate: null,
        fileTerminationDate: null,
        setSelectedItems: null,
        recordDate: null,
        recordNumber: null,
        orderDate: null,
      });
      setSearchKey("");
      setSelectedItems([]);
    }
  }, [editeData, reset]);

  return (
    <Dialog
      open={addModalFlag}
      onClose={handleClose}
      maxWidth={"md"}
      PaperProps={{ sx: { overflow: "visible" } }}
    >
      <DialogTitle>
        <Box display="flex" justifyContent="space-between" alignItems="center">
          <Box display="flex" textAlign="center" alignItems="center" gap={1}>
            <GavelOutlined fontSize="large" />
            <Typography variant="h6">
              {!editable
                ? "مشاهده حکم انتظامی"
                : editeData
                ? `ویرایش حکم انتظامی`
                : `ایجاد حکم انتظامی جدید`}
            </Typography>
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
                  rules={item.rules}
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
                  startIcon={!!editeData ? <ChangeCircle /> : <AddCircle />}
                  type="submit"
                  disabled={isLoading}
                >
                  {isLoading
                    ? !!editeData
                      ? "در حال به‌روزرسانی..."
                      : "در حال ایجاد..."
                    : !!editeData
                    ? "به‌روزرسانی"
                    : "ایجاد"}
                </Button>
              )}
            </Grid>
          </Grid>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default AddDOCase;
