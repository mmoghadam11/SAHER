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
import { useAuthorization } from "hooks/useAutorization";

// Props برای دیالوگ جدید
type Props = {
  open: boolean;
  onClose: () => void;
  // ID یا موجودیتی که فایل به آن ضمیمه می‌شود
  entityId: string | number;
  // یک Callback برای زمانی که آپلود با موفقیت انجام شد
  refetch?: () => void;
  notificationStatus?: boolean;
};

const MAX_PDF_SIZE_MB = 10; // حداکثر حجم مجاز

const UploadPdfDialog: React.FC<Props> = ({
  open,
  onClose,
  entityId,
  refetch,
  notificationStatus,
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
      description: "", // <-- 💡 مقدار اولیه اینجا تنظیم شود
    },
  });
  // استیت و Ref برای مدیریت فایل
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [PdfUrl, setPdfUrl] = useState<string | undefined>("");
  const [showPDFFlag, setShowPDFFlag] = useState<boolean>(false);
  const [selectedPDF, setSelectedPDF] = useState(null);
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const authFunctions = useAuthorization();

  const formItems = useMemo(
    () => [
      {
        name: "description",
        inputType: "text",
        label: "توضیحات",
        size: { md: 5 },
        rules: { required: "توضیحات الزامی است" },
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
        if (!notificationStatus)
          return (
            <TableActions
              onView={() => {
                setSelectedPDF(row.id);
                setShowPDFFlag((prev) => !prev);
              }}
              onDelete={() => {
                deleteMutate({
                  entity: `disciplinary-order/remove-order-image?id=${row.id}`, // ❗️
                  method: "delete",
                });
              }}
            />
          );
        else
          if(authFunctions?.hasPermission("disciplinary-order-edit"))
          return (
            <TableActions
              onView={() => {
                setSelectedPDF(row.id);
                setShowPDFFlag((prev) => !prev);
              }}
              onDelete={() => {
                deleteMutate({
                  entity: `disciplinary-order/remove-order-image?id=${row.id}`, // ❗️
                  method: "delete",
                });
              }}
            />
          );
          else return (
            <TableActions
              onView={() => {
                setSelectedPDF(row.id);
                setShowPDFFlag((prev) => !prev);
              }}
              // onDelete={() => {
              //   deleteMutate({
              //     entity: `disciplinary-order/remove-order-image?id=${row.id}`, // ❗️
              //     method: "delete",
              //   });
              // }}
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
  });
  const { mutate: deleteMutate, isLoading: deleteIsLoading } = useMutation({
    mutationFn: Auth?.serverCall, // استفاده از تابع آپلود سراسری
    onSuccess: (res: any) => {
      snackbar("فایل PDF مورد نظر حذف شد", "warning");
      //   uploadedPDF_refetch();
      PDFList_refetch();
      refetch?.();
      setShowPDFFlag(false);
    },
    onError: () => {
      snackbar("خطا در حذف فایل", "error");
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
    mutate(
      {
        entity: `disciplinary-order/upload-order-file`, // ❗️
        method: "post",
        data: formData,
      },
      {
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
      }
    );
  };

  function noticOrdr(params: any) {
    mutate(
      {
        entity: `disciplinary-order/notice-order?id=${entityId}`,
        method: "post",
        // data: formData,
      },
      {
        onSuccess: (res: any) => {
          snackbar("پیامک اطلاع رسانی ارسال شد ✉", "success");
          refetch?.(); // اجرای Callback
          PDFList_refetch();
          handleClearSelection();
          //   uploadedPDF_refetch();
          //   onClose(); // بستن دیالوگ
        },
        onError: () => {
          snackbar("خطا در ارسال پیامک ✉", "error");
        },
      }
    );
  }
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
          {!notificationStatus && authFunctions?.hasPermission("disciplinary-order-edit")&& (
            <Grid item md={11} sm={11} xs={12}>
              <input
                ref={fileInputRef}
                type="file"
                accept="application/pdf"
                onChange={handleFileChange}
                hidden
              />
              <Box
                sx={{
                  border: "1px dashed",
                  borderColor: "divider",
                  padding: 2,
                  borderRadius: 1,
                  mt: 1,
                }}
              >
                <Stack spacing={2} direction="row" alignItems="center">
                  <Button
                    variant="outlined"
                    onClick={handleChooseClick}
                    startIcon={<PictureAsPdf />}
                    disabled={isLoading}
                  >
                    انتخاب فایل PDF
                  </Button>

                  {selectedFile && (
                    <Typography variant="body2" sx={{ flexGrow: 1 }} noWrap>
                      {selectedFile.name}
                    </Typography>
                  )}

                  {selectedFile &&
                    formItems?.map((item) => (
                      <Grid item xs={12} md={item.size.md} key={item.name}>
                        <Controller
                          name={item.name}
                          control={control}
                          render={({ field }) => (
                            <RenderFormInput
                              controllerField={field}
                              errors={errors}
                              {...item}
                              {...field}
                              // value={description ?? "عالی"}
                            />
                          )}
                        />
                      </Grid>
                    ))}
                </Stack>

                {!selectedFile && (
                  <Typography
                    variant="caption"
                    color="text.secondary"
                    sx={{ mt: 2, display: "block" }}
                  >
                    حداکثر حجم مجاز: {MAX_PDF_SIZE_MB} مگابایت
                  </Typography>
                )}
              </Box>
            </Grid>
          )}
          <Grid item md={11} sm={11} xs={12}>
            {PDFList_status === "success" && !!PDFList?.content?.length && (
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
            )}
          </Grid>
          <Grid item md={11} sm={11} xs={12}>
            {!!PdfUrl && showPDFFlag && (
              <MyPdfViewer PdfUrl={PdfUrl ?? ""} sx={{ width: "100%" }} />
            )}
          </Grid>
        </Grid>
      </DialogContent>

      {/* // <DialogContent>
        //   <input
        //     ref={fileInputRef}
        //     type="file"
        //     accept="application/pdf"
        //     onChange={handleFileChange}
        //     hidden
        //   />
        //   <Box
        //     sx={{
        //       border: "1px dashed",
        //       borderColor: "divider",
        //       padding: 2,
        //       borderRadius: 1,
        //       mt: 1,
        //     }}
        //   >
        //     <Stack spacing={2} direction="row" alignItems="center">
        //       <Button
        //         variant="outlined"
        //         onClick={handleChooseClick}
        //         startIcon={<PictureAsPdf />}
        //         disabled={isLoading}
        //       >
        //         انتخاب فایل PDF
        //       </Button>

        //       {selectedFile && (
        //         <Typography variant="body2" sx={{ flexGrow: 1 }} noWrap>
        //           {selectedFile.name}
        //         </Typography>
        //       )}
        //     </Stack>

        //     {!selectedFile && (
        //       <Typography
        //         variant="caption"
        //         color="text.secondary"
        //         sx={{ mt: 2, display: "block" }}
        //       >
        //         حداکثر حجم مجاز: {MAX_PDF_SIZE_MB} مگابایت
        //       </Typography>
        //     )}
        //   </Box>
        // </DialogContent> */}

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
          {PdfUrl && showPDFFlag &&authFunctions?.hasPermission("disciplinary-order-edit")&& (
            <Button
              variant="outlined"
              color="warning"
              onClick={noticOrdr}
              disabled={isLoading}
              sx={{ mr: 1 }}
            >
              ابلاغ حکم
            </Button>
          )}
          <Button
            variant="outlined"
            onClick={onClose}
            disabled={isLoading}
            sx={{ mr: 1 }}
          >
            انصراف
          </Button>
          {authFunctions?.hasPermission("disciplinary-order-edit")&&
          <Button
            variant="contained"
            startIcon={
              isLoading ? (
                <CircularProgress size={20} color="inherit" />
              ) : (
                <CloudUpload />
              )
            }
            onClick={handleUploadSubmit}
            disabled={isLoading || !selectedFile}
          >
            {isLoading ? "در حال آپلود..." : "آپلود"}
          </Button>}
        </Box>
      </DialogActions>
    </Dialog>
  );
};

export default UploadPdfDialog;
