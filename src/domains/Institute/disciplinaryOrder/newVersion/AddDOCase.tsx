import {
  AddCircle,
  ChangeCircle,
  GavelOutlined,
  Close,
  Add,
  Delete,
  Search,
  Article,
  PictureAsPdf,
  Visibility,
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
  Stack,
} from "@mui/material";
import RenderFormInput from "components/render/formInputs/RenderFormInput";
import React, { useEffect, useRef, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { useMutation, useQuery } from "@tanstack/react-query";
import { useAuth } from "hooks/useAuth";
import { useSnackbar } from "hooks/useSnackbar";
import RenderFormDisplay from "components/render/formInputs/RenderFormDisplay";
import { useDOCaseForm } from "./useDOCaseForm";
import TavanaDataGrid from "components/dataGrid/TavanaDataGrid";
import MyPdfViewer from "components/pdfviewer/MyPdfViewer";
import { useAuthorization } from "hooks/useAutorization";
import { PAGINATION_DEFAULT_VALUE } from "shared/paginationValue";
import paramsSerializer from "services/paramsSerializer";
import { GridColDef } from "@mui/x-data-grid";
import TableActions from "components/table/TableActions";

// مسیر هوک را بر اساس ساختار پروژه خودتان تنظیم کنید

type Props = {
  editable: boolean;
  temporary?: boolean;
  refetch: () => void;
  addModalFlag: boolean;
  setAddModalFlag: React.Dispatch<React.SetStateAction<boolean>>;
  editeData: any;
  setEditeData: React.Dispatch<React.SetStateAction<any>>;
};

const AddDOCase = ({
  editable,
  temporary=false,
  addModalFlag,
  setAddModalFlag,
  refetch,
  editeData,
  setEditeData,
}: Props) => {
  // دیگر نیازی به id از useParams در این کامپوننت نیست
  // const { id } = useParams();
  const Auth = useAuth();
  const { hasPermission } = useAuthorization();
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
  const [selectedLetterImage, setSelectedLetterImage] = useState<File | null>(
    null
  );
  const [selectedRecordImage, setSelectedRecordImage] = useState<File | null>(
    null
  );
  const [letterID, setLetterId] = useState(null);
  const [recordId, setRecordId] = useState(null);
  const [selectedPDF, setSelectedPDF] = useState<string | null>(null);
  const LetterfileInputRef = useRef<HTMLInputElement | null>(null);
  const RecordfileInputRef = useRef<HTMLInputElement | null>(null);
  const MAX_PDF_SIZE_MB = 10; // حداکثر حجم مجاز
  const [responsibleTyping, setResponsibleTyping] = useState(true);
  const [DICTyping, setDICTyping] = useState(true);
  const [PdfUrl, setPdfUrl] = useState<string | undefined>("");
  const [showPDFFlag, setShowPDFFlag] = useState<boolean>(false);
  const [filters, setFilters] = useState<any>({
    ...PAGINATION_DEFAULT_VALUE,
    entityId: editeData?.id,
  });
  useEffect(() => {
    if (!!editeData)
      setFilters((prev: any) => ({
        ...prev,
        entityId: editeData?.id,
      }));
  }, [editeData]);

  const {
    data: PDFList,
    status: PDFList_status,
    refetch: PDFList_refetch,
  } = useQuery<any>({
    queryKey: [
      `disciplinary-case/uploaded-primary-file${paramsSerializer(filters)}`,
    ],
    queryFn: Auth?.getRequest,
    select: (res: any) => {
      return res.data;
    },
    enabled: !!filters?.entityId&&addModalFlag,
  } as any);
  const {
    data: letterPDF,
    status: letterPDF_status,
    refetch: letterPDF_refetch,
  } = useQuery<any>({
    queryKey: [`disciplinary-case/download-order-file?id=${letterID}`],
    queryFn: Auth?.getRequestDownloadFile,
    enabled: !!letterID,
  } as any);
  const {
    data: RecordPDF,
    status: RecordPDF_status,
    refetch: RecordPDF_refetch,
  } = useQuery<any>({
    queryKey: [`disciplinary-case/download-order-file?id=${recordId}`],
    queryFn: Auth?.getRequestDownloadFile,
    enabled: !!recordId,
  } as any);
  useEffect(() => {
    setLetterId(
      PDFList?.find((item: any) => item?.fileTag === "ORDER-LETTER-IMAGE")
        ?.id ?? null
    );
    setRecordId(
      PDFList?.find(
        (item: any) => item?.fileTag === "ORDER-WORKFLOW-RECORD-IMAGE"
      )?.id ?? null
    );
  }, [PDFList]);
  useEffect(() => {
    // 1. چک کنید که داده‌ی تصویر وجود دارد و از نوع Blob است
    if (
      letterPDF &&
      letterPDF instanceof Blob &&
      letterPDF.type.startsWith("application/pdf")
    ) {
      const file = new File(
        [letterPDF],
        PDFList?.find((item: any) => item?.id === letterID)?.originalFileName ??
          "letter.pdf",
        {
          type: letterPDF.type,
          lastModified: Date.now(),
        }
      );
      setSelectedLetterImage(file);
    } else;
  }, [letterPDF]);
  useEffect(() => {
    // 1. چک کنید که داده‌ی تصویر وجود دارد و از نوع Blob است
    if (
      RecordPDF &&
      RecordPDF instanceof Blob &&
      RecordPDF.type.startsWith("application/pdf")
    ) {
      const file = new File(
        [RecordPDF],
        PDFList?.find((item: any) => item?.id === recordId)?.originalFileName ??
          "record.pdf",
        {
          type: RecordPDF.type,
          lastModified: Date.now(),
        }
      );
      setSelectedRecordImage(file);
    } else;
  }, [RecordPDF]);

  // const columns: GridColDef[] = [
  //   { field: "originalFileName", headerName: "نام فایل", flex: 1 },
  //   { field: "description", headerName: "توضیحات", flex: 2 },
  //   {
  //     headerName: "عملیات",
  //     field: "action",
  //     flex: 1.1,
  //     headerAlign: "center",
  //     align: "center",
  //     renderCell: ({ row }: { row: any }) => {
  //       if (
  //         !hasPermission("supervisor-pdf") ||
  //         hasPermission("disciplinary-order-edit")
  //       )
  //         return (
  //           <TableActions
  //             onView={() => {
  //               setSelectedPDF(row.id);
  //               setShowPDFFlag((prev) => !prev);
  //             }}
  //             onDelete={() => {
  //               deleteMutate({
  //                 entity: `disciplinary-case/remove-file?id=${row.id}`, // ❗️
  //                 method: "delete",
  //               });
  //             }}
  //           />
  //         );
  //       else
  //         return (
  //           <TableActions
  //             onView={() => {
  //               setSelectedPDF(row.id);
  //               setShowPDFFlag((prev) => !prev);
  //             }}
  //           />
  //         );
  //     },
  //   },
  // ];
  const { mutate, isLoading } = useMutation({
    mutationFn: Auth?.serverCallUpload,
    onSuccess: () => {
      snackbar(
        !!editeData
          ? `پرونده انتظامی با موفقیت به‌روزرسانی شد`
          : `پرونده انتظامی جدید با موفقیت افزوده شد`,
        "success"
      );
      setResponsibleTyping(true);
      setDICTyping(true);
      refetch();
      handleClose();
    },
    onError: () => {
      snackbar("خطا در ثبت پرونده انتظامی", "error");
    },
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
  const handleClose = () => {
    setAddModalFlag(false);
    setEditeData(null);
    setFilters((prev: any) => ({
      ...prev,
      entityId: null,
    }));
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
      cdOrderTypeId: "", // نوع پرونده
      orderNumber: "", // شماره پرونده
      receiptDate: null, // تاریخ‌ها
      startDate: null,
      endDate: null,
      fileCreationDate: null,
      fileTerminationDate: null,
      setSelectedItems: null,
      boardMeetingRecordDate: null,
      boardMeetingRecordNumber: null,
      orderDate: null,
    });
    setPdfUrl("");
    setShowPDFFlag(false);
    handleClearSelection();
  };
  const handleFileChange = (
    e: React.ChangeEvent<HTMLInputElement>,
    name: string
  ) => {
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
    if (name === "letter") setSelectedLetterImage(file);
    else setSelectedRecordImage(file);
    e.currentTarget.value = ""; // اجازه انتخاب مجدد همان فایل
  };
  const handleChooseClick = (name: string) =>
    name === "letter"
      ? LetterfileInputRef.current?.click()
      : RecordfileInputRef.current?.click();

  const handleClearSelection = (name?: string) => {
    if (name === "letter") setSelectedLetterImage(null);
    else if (name === "record") setSelectedRecordImage(null);
    else {
      setSelectedLetterImage(null);
      setSelectedRecordImage(null);
    }
  };
  const onSubmit = (data: any) => {
    if (!selectedLetterImage) {
      snackbar("ابتدا فایل PDF نامه ارجاع را انتخاب کنید", "warning");
      return;
    }
    if (!selectedRecordImage) {
      snackbar("ابتدا فایل PDF صورتجلسه انتخاب کنید", "warning");
      return;
    }
    const submissionData = {
      ...data,
    };
    const formData = new FormData();
    formData.append("letterImage", selectedLetterImage);
    formData.append("recordImage", selectedRecordImage);

    // 3. تبدیل DTO به Blob و افزودن به FormData
    formData.append(
      "dto",
      new Blob([JSON.stringify(submissionData)], { type: "application/json" })
    );
    console.log("submissionData", submissionData);
    mutate({
      // entity: `disciplinary-case/${!!editeData ? temporary?"temporary-update":  "update" : "save"}`,
      entity: `disciplinary-case/${!!editeData ? "update" : "save"}`,
      method: !!editeData ? "put" : "post",
      data: formData,
    });
  };
  // فراخوانی هوک سفارشی با تمام منطق
  const { formItems } = useDOCaseForm({
    editeData,
    watch,
    setValue,
    reset,
    responsibleTyping,
    setResponsibleTyping,
    DICTyping,
    setDICTyping,
  });

  useEffect(() => {
    if (!!editeData) {
      if (editeData.accuserId && editeData?.cdPersonalityId === 397) {
        setResponsibleTyping(false);
        setDICTyping(false);
      }

      // reset کردن فرم با داده‌های editeData و نوع پاسخ‌دهنده تعیین شده
      reset({
        ...editeData,
        // cdClaimantTypeId: !!editeData?.startDate ? 399 : 398,
      });
    } else {
      // حالت جدید: مقادیر پیش‌فرض
      reset({
        complainant: null,
        cdReferralTypeId: null,
        referralId: "",
        referralNumber: null,
        referralDate: null,
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
        boardMeetingRecordDate: null,
        boardMeetingRecordNumber: null,
        orderDate: null,
      });
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
            <Article fontSize="large" />
            <Typography variant="h6">
              {!editable
                ? "مشاهده پرونده انتظامی"
                : editeData
                ? `ویرایش پرونده انتظامی`
                : `ایجاد پرونده انتظامی جدید`}
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
            <Grid container item md={12} justifyContent={"center"}>
              {(hasPermission("disciplinary-order-edit")||hasPermission("supervisor-pdf")) && (
                // PDFList?.length !== 2 &&
                <Grid
                  item
                  md={12}
                  sm={12}
                  xs={12}
                  display={{ md: "flex", xs: "block" }}
                >
                  <input
                    ref={LetterfileInputRef}
                    type="file"
                    accept="application/pdf"
                    onChange={(e) => handleFileChange(e, "letter")}
                    hidden
                  />
                  <Box
                    sx={{
                      border: "1px dashed",
                      borderColor: "divider",
                      padding: 2,
                      borderRadius: 1,
                      mt: 1,
                      width: { md: "50%", xs: "100%" },
                      alignContent: "center",
                    }}
                  >
                    <Stack spacing={2} direction="row" alignItems="center">
                      {editable ? (
                        <Button
                          variant="outlined"
                          onClick={() => handleChooseClick("letter")}
                          startIcon={<PictureAsPdf />}
                          disabled={isLoading}
                        >
                          انتخاب فایل PDF نامه ارجاع
                        </Button>
                      ) : (
                        <Typography>PDF نامه ارجاع</Typography>
                      )}
                      {selectedLetterImage && (
                        <Box display={"flex"} alignItems={"center"}>
                          <Typography
                            variant="body2"
                            sx={{ flexGrow: 1, color: "primary.main" }}
                            noWrap
                          >
                            {selectedLetterImage.name}
                          </Typography>
                          <IconButton
                            onClick={() => {
                              let objectUrl: string | null = null;
                              objectUrl =
                                URL.createObjectURL(selectedLetterImage);
                              setPdfUrl(objectUrl);
                              if (
                                selectedPDF !== "letter" &&
                                showPDFFlag === true
                              ) {
                                setSelectedPDF("letter");
                                return;
                              }
                              setShowPDFFlag((prev) => !prev);
                              setSelectedPDF("letter");
                            }}
                          >
                            <Visibility />
                          </IconButton>
                        </Box>
                      )}
                      {/* {selectedLetterImage &&
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
                          ))} */}
                      {!selectedLetterImage && (
                        <Typography
                          variant="caption"
                          color="text.secondary"
                          sx={{ mt: 2, display: "block" }}
                        >
                          حداکثر حجم مجاز: {MAX_PDF_SIZE_MB} مگابایت
                        </Typography>
                      )}
                    </Stack>
                  </Box>
                  <input
                    ref={RecordfileInputRef}
                    type="file"
                    accept="application/pdf"
                    onChange={(e) => handleFileChange(e, "record")}
                    hidden
                  />
                  <Box
                    sx={{
                      border: "1px dashed",
                      borderColor: "divider",
                      padding: 2,
                      borderRadius: 1,
                      mt: 1,
                      width: { md: "50%", xs: "100%" },
                      alignContent: "center",
                    }}
                  >
                    <Stack spacing={2} direction="row" alignItems="center">
                      {editable ? (
                        <Button
                          // color={selectedRecordImage?"primary":"inherit"}
                          variant="outlined"
                          onClick={() => handleChooseClick("record")}
                          startIcon={<PictureAsPdf />}
                          disabled={isLoading}
                        >
                          انتخاب فایل PDF صورت جلسه
                        </Button>
                      ) : (
                        <Typography>PDF صورت جلسه</Typography>
                      )}

                      {selectedRecordImage && (
                        <Box display={"flex"} alignItems={"center"}>
                          <Typography
                            variant="body2"
                            sx={{ flexGrow: 1, color: "primary.main" }}
                            noWrap
                          >
                            {selectedRecordImage.name}
                          </Typography>
                          <IconButton
                            onClick={() => {
                              let objectUrl: string | null = null;
                              objectUrl =
                                URL.createObjectURL(selectedRecordImage);
                              setPdfUrl(objectUrl);
                              if (
                                selectedPDF !== "record" &&
                                showPDFFlag === true
                              ) {
                                setSelectedPDF("record");
                                return;
                              }
                              setShowPDFFlag((prev) => !prev);
                              setSelectedPDF("record");
                            }}
                          >
                            <Visibility />
                          </IconButton>
                        </Box>
                      )}
                      {!selectedRecordImage && (
                        <Typography
                          variant="caption"
                          color="text.secondary"
                          sx={{ mt: 2, display: "block" }}
                        >
                          حداکثر حجم مجاز: {MAX_PDF_SIZE_MB} مگابایت
                        </Typography>
                      )}
                    </Stack>
                  </Box>
                </Grid>
              )}
              {/* <Grid item md={12} sm={12} xs={12}>
                {PDFList_status === "success" && !!PDFList?.length && (
                  <TavanaDataGrid
                    rows={PDFList ?? []}
                    columns={columns}
                    filters={filters}
                    setFilters={setFilters}
                    rowCount={PDFList?.length}
                    getRowHeight={() => "auto"}
                    autoHeight
                    hideToolbar
                  />
                )}
              </Grid> */}
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
