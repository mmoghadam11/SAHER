import React, { useState, useRef, useEffect, useMemo } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  Typography,
  Button,
  IconButton,
  Box,
  Stack,
  CircularProgress,
  DialogActions,
  Grid,
} from "@mui/material";
import {
  Close,
  CloudUpload,
  PictureAsPdf,
  DeleteOutline,
} from "@mui/icons-material";
import { useMutation, useQuery } from "@tanstack/react-query";
import { useAuth } from "hooks/useAuth";
import { useSnackbar } from "hooks/useSnackbar";
import MyPdfViewer from "components/pdfviewer/MyPdfViewer";
import { PAGINATION_DEFAULT_VALUE } from "shared/paginationValue";
import paramsSerializer from "services/paramsSerializer";
import TavanaDataGrid from "components/dataGrid/TavanaDataGrid";
import TableActions from "components/table/TableActions";
import { GridColDef } from "@mui/x-data-grid";
import { Controller, useForm } from "react-hook-form";
import RenderFormInput from "components/render/formInputs/RenderFormInput";

// Props برای دیالوگ جدید
type Props = {
  open: boolean;
  onClose: () => void;
  // ID یا موجودیتی که فایل به آن ضمیمه می‌شود
  entityId: string | number;
  // یک Callback برای زمانی که آپلود با موفقیت انجام شد
  refetch?: () => void;
};

const MAX_PDF_SIZE_MB = 10; // حداکثر حجم مجاز

const ShowUploadedPDF: React.FC<Props> = ({
  open,
  onClose,
  entityId,
  refetch,
}) => {
  const Auth = useAuth();
  const snackbar = useSnackbar();
  const {
    handleSubmit,
    control,
    formState: { errors },
    reset,
    setValue,
    getValues,
  } = useForm<any>({
    defaultValues: {
      description: "بدوی", // <-- 💡 مقدار اولیه اینجا تنظیم شود
    },
  });
  // استیت و Ref برای مدیریت فایل
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [PdfUrl, setPdfUrl] = useState<string | undefined>("");
  const [showPDFFlag, setShowPDFFlag] = useState<boolean>(false);
  const [selectedPDF, setSelectedPDF] = useState(null);
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const formItems = useMemo(
    () => [
      {
        name: "description",
        inputType: "select",
        label: "نوع حکم",
        size: { md: 4 },
        options: [
          { value: "بدوی", title: "بدوی" },
          { value: "عالی", title: "عالی" },
        ],
        rules: { required: "انتخاب نوع حکم الزامی است" },
      },
    ],
    []
  );
  const columns: GridColDef[] = [
    { field: "originalFileName", headerName: "نام فایل", flex: 1 },
    { field: "description", headerName: "توضیحات", flex: 2 },
    {
      headerName: "عملیات",
      field: "action",
      flex: 1.1,
      headerAlign: "center",
      align: "center",
      renderCell: ({ row }: { row: any }) => {
        return (
          <TableActions
            onView={() => {
              setSelectedPDF(row.id);
              setShowPDFFlag((prev) => !prev);
            }}
          />
        );
      },
    },
  ];
  // پاک کردن فایل انتخاب شده با هر بار باز شدن دیالوگ
  useEffect(() => {
    if (open) {
      setSelectedFile(null);
    }
  }, [open]);

  const [filters, setFilters] = useState<any>({
    ...PAGINATION_DEFAULT_VALUE,
    entityId: entityId,
  });
  const {
    data: PDFList,
    status: PDFList_status,
    refetch: PDFList_refetch,
  } = useQuery<any>({
    queryKey: [
      `disciplinary-order/uploaded-order-file${paramsSerializer(filters)}`,
    ],
    queryFn: Auth?.getRequest,
    select: (res: any) => {
      return res.data;
    },
    enabled: !!entityId,
  } as any);
  const {
    data: uploadedPDF,
    status: uploadedPDF_status,
    refetch: uploadedPDF_refetch,
  } = useQuery<any>({
    queryKey: [
      `disciplinary-order/download-order-file-by-attachment-id?attachmentId=${selectedPDF}`,
    ],
    queryFn: Auth?.getRequestDownloadFile,
    select: (res: any) => {
      return res;
    },
    enabled: !!selectedPDF,
  } as any);
  //     data: uploadedPDF,
  //     status: uploadedPDF_status,
  //     refetch: uploadedPDF_refetch,
  //   } = useQuery<any>({
  //     queryKey: [`disciplinary-order/download-order-file?id=${entityId}`],
  //     queryFn: Auth?.getRequestDownloadFile,
  //     select: (res: any) => {
  //       return res;
  //     },
  //     enabled: !!entityId,
  //   } as any);
  useEffect(() => {
    let objectUrl: string | null = null;

    // 1. چک کنید که داده‌ی تصویر وجود دارد و از نوع Blob است
    if (
      uploadedPDF &&
      uploadedPDF instanceof Blob &&
      uploadedPDF.type.startsWith("application/pdf")
    ) {
      objectUrl = URL.createObjectURL(uploadedPDF);
      setPdfUrl(objectUrl);
    } else setPdfUrl("");
    //   if (uploadedPDF && uploadedPDF instanceof Blob&&!uploadedPDF.type.startsWith("image/")) {
    //     objectUrl = "";
    //     setPdfUrl(objectUrl);
    //   }

    // 4. (مهم) تابع پاک‌سازی:
    // این تابع زمانی اجرا می‌شود که کامپوننت unmount شود یا 'uploadedPDF' تغییر کند
    return () => {
      if (objectUrl) {
        // URL موقت قبلی را از حافظه مرورگر پاک می‌کند
        URL.revokeObjectURL(objectUrl);
      }
    };
  }, [uploadedPDF]);
  // Mutation برای آپلود فایل
  const { mutate, isLoading } = useMutation({
    mutationFn: Auth?.serverCallUpload, // استفاده از تابع آپلود سراسری
    onSuccess: (res: any) => {
      snackbar("فایل PDF با موفقیت آپلود شد", "success");
      refetch?.(); // اجرای Callback
      PDFList_refetch();
      handleClearSelection();
      //   uploadedPDF_refetch();
      //   onClose(); // بستن دیالوگ
    },
    onError: () => {
      snackbar("خطا در آپلود فایل", "error");
    },
  });

  // --- توابع مدیریت فایل ---

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] ?? null;
    if (!file) return;

    // ولیدیشن نوع فایل
    if (file.type !== "application/pdf") {
      snackbar("فقط فایل PDF مجاز است.", "warning");
      e.currentTarget.value = "";
      return;
    }
    // ولیدیشن حجم
    if (file.size > MAX_PDF_SIZE_MB * 1024 * 1024) {
      snackbar(`حداکثر حجم فایل ${MAX_PDF_SIZE_MB}MB است.`, "warning");
      e.currentTarget.value = "";
      return;
    }

    setSelectedFile(file);
    e.currentTarget.value = ""; // اجازه انتخاب مجدد همان فایل
  };

  const handleChooseClick = () => fileInputRef.current?.click();

  const handleClearSelection = () => setSelectedFile(null);

  // --- تابع اصلی ارسال ---

  const handleUploadSubmit = () => {
    if (!selectedFile) {
      snackbar("ابتدا یک فایل PDF انتخاب کنید", "info");
      return;
    }

    // 1. ساخت FormData
    const formData = new FormData();
    formData.append("file", selectedFile);

    // 2. ساخت DTO (دیتای JSON همراه فایل)
    const dto = {
      //   entity_name: "disciplinary_order", // مثال: نام موجودیت
      //   id: entityId, // ID رکورد مربوطه
      id: entityId, // ID رکورد مربوطه
      //   description: "disciplinary_order_pdf", // تگ فایل
      description: getValues("description"), // تگ فایل
      fileTag: "attachment", // تگ فایل
    };

    // 3. تبدیل DTO به Blob و افزودن به FormData
    formData.append(
      "data",
      new Blob([JSON.stringify(dto)], { type: "application/json" })
    );

    // 4. فراخوانی Mutate
    mutate({
      entity: `disciplinary-order/upload-order-file`, // ❗️
      method: "post",
      data: formData,
    });
  };

  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth={!!PDFList?.content?.length ? "md" : "sm"} // برای آپلود، سایز کوچک کافی است
      fullWidth
      PaperProps={{ sx: { overflow: "visible" } }}
    >
      <DialogTitle>
        <Box display="flex" justifyContent="space-between" alignItems="center">
          <Box display="flex" textAlign="center" alignItems="center" gap={1}>
            <PictureAsPdf fontSize="large" />
            <Typography variant="h6">فایل PDF حکم انتظامی </Typography>
          </Box>
          <IconButton onClick={onClose} size="small" disabled={isLoading}>
            <Close />
          </IconButton>
        </Box>
      </DialogTitle>

      {/* 2. DialogContent (محتوای آپلودر) */}

      <DialogContent>
        <Grid container justifyContent={"center"}>
          <Grid item md={11} sm={11} xs={12} display={"flex"} justifyContent={"center"}>
            {PDFList_status === "success" && !!PDFList?.content?.length ? (
              <TavanaDataGrid
                rows={PDFList?.content ?? []}
                columns={columns}
                filters={filters}
                setFilters={setFilters}
                rowCount={PDFList?.totalElements}
                getRowHeight={() => "auto"}
                autoHeight
                hideToolbar
              />
            ):(
                <Typography variant="body2">فایلی برای این حکم بارگزاری نشده است</Typography>
            )}
          </Grid>
          <Grid item md={11} sm={11} xs={12}>
            {!!PdfUrl && showPDFFlag && (
              <MyPdfViewer PdfUrl={PdfUrl ?? ""} sx={{ width: "100%" }} />
            )}
          </Grid>
        </Grid>
      </DialogContent>

      {/* 3. DialogActions (دکمه‌های پایین) */}
      <DialogActions
        sx={{ p: 2, display: "flex", justifyContent: "space-between", gap: 1 }}
      >
        {selectedFile ? (
          <Button
            color="inherit"
            onClick={handleClearSelection}
            startIcon={<DeleteOutline />}
            disabled={isLoading}
          >
            لغو انتخاب
          </Button>
        ) : (
          <Box /> // (Placeholder to align buttons to right)
        )}

        <Box sx={!!PDFList?.content?.length ? { mr: 3 } : {}}>
          <Button
            variant="outlined"
            onClick={onClose}
            disabled={isLoading}
            sx={{ mr: 1 }}
          >
            بازگشت
          </Button>
        </Box>
      </DialogActions>
    </Dialog>
  );
};

export default ShowUploadedPDF;
