import { AddCircle, Close, Gavel, PictureAsPdf } from "@mui/icons-material";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  Grid,
  Typography,
  Button,
  IconButton,
  Box,
  Stack,
} from "@mui/material";
import RenderFormInput from "components/render/formInputs/RenderFormInput";
import React, { useEffect, useMemo, useRef, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { useMutation, useQuery } from "@tanstack/react-query";
import { useAuth } from "hooks/useAuth";
import { useSnackbar } from "hooks/useSnackbar";
import RenderFormDisplay from "components/render/formInputs/RenderFormDisplay";
import { FormItem } from "types/formItem";
import { useAuthorization } from "hooks/useAutorization";
import paramsSerializer from "services/paramsSerializer";
import { PAGINATION_DEFAULT_VALUE } from "shared/paginationValue";
import TavanaDataGrid from "components/dataGrid/TavanaDataGrid";
import TableActions from "components/table/TableActions";
import { GridColDef } from "@mui/x-data-grid";
import MyPdfViewer from "components/pdfviewer/MyPdfViewer";
import TicketDivider from "components/FancyTicketDivider";

// مسیر هوک را بر اساس ساختار پروژه خودتان تنظیم کنید

type Props = {
  editable: boolean;
  refetch: () => void;
  addModalFlag: boolean;
  setAddModalFlag: React.Dispatch<React.SetStateAction<boolean>>;
  editeData: any;
  setEditeData: React.Dispatch<React.SetStateAction<any>>;
};

const AddHOrder = ({
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
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [PdfUrl, setPdfUrl] = useState<string | undefined>("");
  const [showPDFFlag, setShowPDFFlag] = useState<boolean>(false);
  const [selectedPDF, setSelectedPDF] = useState(null);
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const MAX_PDF_SIZE_MB = 10; // حداکثر حجم مجاز
  const { hasPermission } = useAuthorization();
  const {
    handleSubmit,
    control,
    formState: { errors },
    reset,
    setValue,
    getValues,
  } = useForm<any>();
  const [filters, setFilters] = useState<any>({
    ...PAGINATION_DEFAULT_VALUE,
    entityId: editeData?.id,
  });
  console.log("filters", filters);
  const {
    data: PDFList,
    status: PDFList_status,
    refetch: PDFList_refetch,
  } = useQuery<any>({
    queryKey: [
      `disciplinary-supreme/uploaded-order-file${paramsSerializer(filters)}`,
    ],
    queryFn: Auth?.getRequest,
    select: (res: any) => {
      return res.data;
    },
    enabled: !!editeData?.id,
  } as any);
  const { data: orderTypeOptions } = useQuery<any>({
    queryKey: [`disciplinary-order-base/search-all`],
    queryFn: Auth?.getRequest,
    select: (res: any) => res?.data,
  } as any);
  const {
    data: uploadedPDF,
    status: uploadedPDF_status,
    refetch: uploadedPDF_refetch,
  } = useQuery<any>({
    queryKey: [`disciplinary-supreme/download-order-file?id=${selectedPDF}`],
    queryFn: Auth?.getRequestDownloadFile,
    select: (res: any) => {
      return res;
    },
    enabled: !!selectedPDF,
  } as any);
  const { mutate:noticeMutate, isLoading:isLoadingNotice } = useMutation({
    mutationFn: Auth.serverCall, // استفاده از تابع آپلود سراسری
  });
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
      setSelectedPDF(null)
      setSelectedFile(null)
    },
    onError: () => {
      snackbar("خطا در حذف فایل", "error");
    },
  });
  const handleClose = () => {
    setAddModalFlag(false);
    setEditeData(null);
    reset({});
  };
  useEffect(() => {
    if(!!PDFList)
      setSelectedPDF(PDFList?.content?.[0]?.id)
    setValue("fileDescription",PDFList?.content?.[0]?.description)
  }, [PDFList])
  
  useEffect(() => {
    let objectUrl: string | null = null;

    // 1. چک کنید که داده‌ی تصویر وجود دارد و از نوع Blob است
    if (
      uploadedPDF &&
      uploadedPDF instanceof Blob &&
      uploadedPDF.type.startsWith("application/pdf")
    ) {
      const file = new File(
        [uploadedPDF],
        PDFList?.content?.[0]?.originalFileName ??
          "primaryOrder.pdf",
        {
          type: uploadedPDF.type,
          lastModified: Date.now(),
        }
      );
      setSelectedFile(file);
      objectUrl = URL.createObjectURL(uploadedPDF);
      setPdfUrl(objectUrl);
      refetch()
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
        if (
          (!hasPermission("supervisor-pdf") ||
          hasPermission("disciplinary-order-edit"))
          &&editable
        )
          return (
            <TableActions
              onView={() => {
                setSelectedPDF(row.id);
                setShowPDFFlag((prev) => !prev);
              }}
              onDelete={() => {
                deleteMutate({
                  entity: `disciplinary-supreme/remove-file?id=${row.id}`, // ❗️
                  method: "delete",
                });
              }}
            />
          );
        else
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
  // فراخوانی هوک سفارشی با تمام منطق
  const formItems: FormItem[] = useMemo(
    () => [
      {
        name: "orderNumber",
        inputType: "text",
        label: "شماره حکم",
        size: { md: 6 },
        // rules: { required: "شاکی الزامی است" },
      },
      {
        name: "orderDate",
        inputType: "date",
        label: "تاریخ حکم",
        size: { md: 6 },
        elementProps: {
          setDay: (value: any) => setValue("orderDate", value),
        },
      },
      {
        name: "startDate",
        inputType: "date",
        label: "تاریخ شروع حکم",
        size: { md: 6 },
        elementProps: {
          setDay: (value: any) => setValue("startDate", value),
        },
      },
      {
        name: "endDate",
        inputType: "date",
        label: "تاریخ پایان حکم",
        size: { md: 6 },
        elementProps: {
          setDay: (value: any) => setValue("endDate", value),
        },
      },
      {
        name: "orderDeadline",
        inputType: "text",
        label: "مدت حکم",
        size: { md: 6 },
        // rules: { required: "شاکی الزامی است" },
      },
      {
        name: "supremeOrderId",
        inputType: "select",
        label: "نوع تنبیه",
        size: { md: 6 },
        options:
          orderTypeOptions?.map((item: any) => ({
            value: item?.id,
            title: item?.orderName,
          })) ?? [],
        rules: { required: "انتخاب نوع حکم الزامی است" },
      },
      // {
      //   name: "divider",
      //   inputType: "titleDivider",
      //   label: "",
      //   size: { md: 12 },
      //   // rules: { required: "شاکی الزامی است" },
      // },
    ],
    [orderTypeOptions]
  );
  const formItems2 = useMemo(
    () => [
      {
        name: "fileDescription",
        inputType: "text",
        label: "توضیحات",
        size: { md: 5 },
        rules: { required: "توضیحات الزامی است" },
      },
    ],
    []
  );

  useEffect(() => {
    if (!!editeData) {
      reset({
        ...editeData,
      });
    } else {
      // حالت جدید: مقادیر پیش‌فرض
      reset({});
    }
  }, [editeData, reset]);

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

  const handleUploadSubmit = (data: any) => {
    if(!!PdfUrl && showPDFFlag){
      noticeMutate(
      {
        entity: `disciplinary-supreme/notice-order?id=${editeData.id}`,
        method: "put",
      },
      {
        onSuccess: (res: any) => {
          snackbar("حکم بدوی با موفقیت ابلاغ شد", "success");
          refetch?.(); // اجرای Callback
          PDFList_refetch();
          handleClearSelection();
          //   uploadedPDF_refetch();
          //   onClose(); // بستن دیالوگ
        },
        onError: () => {
          snackbar("خطا در ابلاغ حکم", "error");
        },
      }
    );
    return;
    }
    if (!selectedFile) {
      snackbar("ابتدا یک فایل PDF انتخاب کنید", "warning");
      return;
    }
    const {
      orderNumber,
      orderDate,
      startDate,
      endDate,
      orderDeadline,
      fileDescription,
      supremeOrderId,
      ...restOfData
    } = data;
    const submissionData = {
      orderNumber,
      orderDate,
      startDate,
      endDate,
      orderDeadline,
      supremeOrderId,
      fileDescription,
      supremeId: editeData?.id ?? null,
    };

    // 1. ساخت FormData
    const formData = new FormData();
    formData.append("orderImage", selectedFile);

    // 3. تبدیل DTO به Blob و افزودن به FormData
    formData.append(
      "dto",
      new Blob([JSON.stringify(submissionData)], { type: "application/json" })
    );
    // console.log("formData",formData)
    // 4. فراخوانی Mutate
    mutate(
      {
        entity: `disciplinary-supreme/create-order`,
        method: "put",
        data: formData,
      },
      {
        onSuccess: (res: any) => {
          snackbar("حکم بدوی با موفقیت ثبت شد", "success");
          refetch?.(); // اجرای Callback
          PDFList_refetch();
          handleClearSelection();
          //   uploadedPDF_refetch();
          handleClose();
        },
        onError: () => {
          snackbar("خطا در ثبت حکم", "error");
        },
      }
    );
  };
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
            <Gavel fontSize="large" />
            <Typography variant="h6">حکم عالی پرونده</Typography>
          </Box>
          <IconButton onClick={handleClose} size="small">
            <Close />
          </IconButton>
        </Box>
      </DialogTitle>

      <DialogContent
      // sx={editable ? { overflowx: "visible", overflowY: "auto" } : {}}
      // sx={{ overflow: "visible" }}
      >
        <form onSubmit={handleSubmit(handleUploadSubmit)}>
          <Grid container spacing={3} mt={1}>
            {formItems.map((item) => (
              <Grid item xs={12} md={item.size.md} key={item.name}>
                <Controller
                  name={item.name}
                  control={control}
                  rules={item?.rules}
                  render={({ field }) =>
                    // editable&&!PDFList?.content?.length ? (
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

            <Grid item md={12}><TicketDivider/></Grid>
            
            <Grid container item md={12} justifyContent={"center"}>
              {hasPermission("disciplinary-order-edit") &&
                !PDFList?.content?.length && 
                (
                  <Grid item md={12} sm={12} xs={12}>
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
                          <Typography
                            variant="body2"
                            sx={{ flexGrow: 1 }}
                            noWrap
                          >
                            {selectedFile.name}
                          </Typography>
                        )}
                        {selectedFile &&
                          formItems2?.map((item) => (
                            <Grid
                              item
                              xs={12}
                              md={item.size.md}
                              key={item.name}
                            >
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
              <Grid item md={12} sm={12} xs={12}>
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
              <Grid item md={12} sm={12} xs={12}>
                {!!PdfUrl && showPDFFlag && (
                  <MyPdfViewer PdfUrl={PdfUrl ?? ""} sx={{ width: "100%" }} />
                )}
              </Grid>
            </Grid>

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
                  {(!!PdfUrl && showPDFFlag)?"ابلاغ":isLoading ? "در حال ثبت..." : "ثبت"}
                </Button>
              )}
            </Grid>
          </Grid>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default AddHOrder;
