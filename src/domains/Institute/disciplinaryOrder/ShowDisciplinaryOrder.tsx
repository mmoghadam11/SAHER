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
import { useDisciplinaryOrderForm } from "./details/useDisciplinaryOrderForm";
import { useMutation, useQuery } from "@tanstack/react-query";
import { useAuth } from "hooks/useAuth";
import { useSnackbar } from "hooks/useSnackbar";
import RenderFormDisplay from "components/render/formInputs/RenderFormDisplay";
import PdfUploadForm from "./details/PdfUploadForm";
import MyPdfViewer from "components/pdfviewer/MyPdfViewer";
// مسیر هوک را بر اساس ساختار پروژه خودتان تنظیم کنید

type Props = {
  editable: boolean;
  refetch: () => void;
  addModalFlag: boolean;
  setAddModalFlag: React.Dispatch<React.SetStateAction<boolean>>;
  editeData: any;
  setEditeData: React.Dispatch<React.SetStateAction<any>>;
};

const ShowDisciplinaryOrder = ({
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
    if (selectedItems.length === 0) {
      snackbar("لیست موضوعات تخلف خالی میباشد", "error");
      return 0;
    }
    const { cdRespondenTypeId, ...restOfData } = data; // حذف cdRespondenTypeId
    const { orderDuration, ...formData } = data; // حذف orderDuration

    const submissionData = {
      ...data,
      // فقط فیلد مربوط به نوع پاسخ‌دهنده انتخاب شده را ارسال کن
      auditingFirmId:
        cdRespondenTypeId === 396 ? restOfData.auditingFirmId : null,
      personnelCaId:
        cdRespondenTypeId === 397 ? restOfData.personnelCaId : null,
      // ✅ ارسال لیست آیتم‌های جدول پایین
      cdSubjectTypeId: selectedItems.map((i: any) => i.id),
    };

    console.log("submissionData", submissionData);
    if (selectedItems.length > 0)
      mutate({
        entity: `disciplinary-order/${!!editeData ? "update" : "save"}`,
        method: !!editeData ? "put" : "post",
        data: submissionData,
      });
  };
  // فراخوانی هوک سفارشی با تمام منطق
  const { formItems, listLogic } = useDisciplinaryOrderForm({
    editeData,
    watch,
    setValue,
    reset,
    responsibleTyping,
    setResponsibleTyping,
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
            {editable && (
              <Grid container item xs={12} spacing={2}>
                {/* ستون چپ: جستجو و نتایج */}
                <Grid item xs={12} md={6}>
                  <Paper variant="outlined" sx={{ p: 2, height: "100%" }}>
                    <Typography
                      variant="subtitle1"
                      gutterBottom
                      sx={{ fontWeight: "bold" }}
                    >
                      جستجو و افزودن ردیف موضوع تخلف
                    </Typography>

                    {/* باکس جستجو */}
                    <Box display="flex" gap={1} mb={2}>
                      <TextField
                        label="ردیف موضوع را وارد کنید"
                        size="small"
                        fullWidth
                        value={searchKey}
                        onChange={(e) => setSearchKey(e.target.value)}
                        onKeyDown={(e) => {
                          if (e.key === "Enter") {
                            e.preventDefault();
                            handleSearchClick();
                          }
                        }}
                      />
                      <Button
                        variant="contained"
                        onClick={handleSearchClick}
                        disabled={isSearching}
                      >
                        {isSearching ? (
                          <CircularProgress size={24} color="inherit" />
                        ) : (
                          <Search />
                        )}
                      </Button>
                    </Box>

                    {/* جدول نتایج جستجو */}
                    <TableContainer sx={{ maxHeight: 300 }}>
                      <Table stickyHeader size="small">
                        <TableHead>
                          <TableRow>
                            <TableCell>نام</TableCell>
                            <TableCell align="center">افزودن</TableCell>
                          </TableRow>
                        </TableHead>
                        <TableBody>
                          {orderSubjectOptions ? (
                            // orderSubjectOptions?.map((row: any, index: number) => (
                            <TableRow key={1} hover>
                              <TableCell>
                                <Tooltip title={orderSubjectOptions.value}>
                                  <Typography variant="caption">
                                    {orderSubjectOptions.value}
                                  </Typography>
                                </Tooltip>
                              </TableCell>
                              <TableCell align="center">
                                <IconButton
                                  color="primary"
                                  size="small"
                                  onClick={() =>
                                    handleAddItem(orderSubjectOptions)
                                  }
                                >
                                  <Add />
                                </IconButton>
                              </TableCell>
                            </TableRow>
                          ) : (
                            // ))
                            <TableRow>
                              <TableCell colSpan={3} align="center">
                                {isSearching
                                  ? "در حال جستجو..."
                                  : "موردی یافت نشد / جستجو کنید"}
                              </TableCell>
                            </TableRow>
                          )}
                        </TableBody>
                      </Table>
                    </TableContainer>
                  </Paper>
                </Grid>

                {/* ستون راست: لیست انتخاب شده‌ها */}
                <Grid item xs={12} md={6}>
                  <Paper
                    variant="outlined"
                    sx={{
                      p: 2,
                      height: "100%",
                      bgcolor: (theme) =>
                        theme.palette.mode === "light"
                          ? "#f9f9f9"
                          : "#494949ff",
                    }}
                  >
                    <Typography
                      variant="subtitle1"
                      gutterBottom
                      sx={{ fontWeight: "bold", color: "primary.main" }}
                    >
                      لیست نهایی (انتخاب شده) موضوعات تخلف
                    </Typography>

                    <TableContainer sx={{ maxHeight: 365 }}>
                      <Table stickyHeader size="small">
                        <TableHead>
                          <TableRow>
                            <TableCell>نام</TableCell>
                            <TableCell align="center">حذف</TableCell>
                          </TableRow>
                        </TableHead>
                        <TableBody>
                          {selectedItems && selectedItems.length > 0 ? (
                            selectedItems.map((row: any, index: number) => (
                              <TableRow key={index}>
                                <TableCell>
                                  <Tooltip title={row.value}>
                                    {row.value}
                                  </Tooltip>
                                </TableCell>
                                <TableCell align="center">
                                  <Tooltip title="حذف">
                                    <IconButton
                                      color="error"
                                      size="small"
                                      onClick={() => handleRemoveItem(row.id)}
                                    >
                                      <Delete fontSize="small" />
                                    </IconButton>
                                  </Tooltip>
                                </TableCell>
                              </TableRow>
                            ))
                          ) : (
                            <TableRow>
                              <TableCell
                                colSpan={3}
                                align="center"
                                sx={{ color: "text.secondary" }}
                              >
                                هنوز موردی اضافه نشده است
                              </TableCell>
                            </TableRow>
                          )}
                        </TableBody>
                      </Table>
                    </TableContainer>
                  </Paper>
                </Grid>
              </Grid>
            )}

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

export default ShowDisciplinaryOrder;
