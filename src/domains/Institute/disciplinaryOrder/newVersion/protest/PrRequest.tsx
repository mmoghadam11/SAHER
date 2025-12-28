import {
  AddCircle,
  Close,
  PanTool,
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
import paramsSerializer from "services/paramsSerializer";
import { PAGINATION_DEFAULT_VALUE } from "shared/paginationValue";
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

const PrRequest = ({
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
  const MAX_PDF_SIZE_MB = 10; // حداکثر حجم مجاز
  const LetterfileInputRef = useRef<HTMLInputElement | null>(null);
  const [selectedLetterImage, setSelectedLetterImage] = useState<File | null>(
    null
  );
  const [letterID, setLetterId] = useState(null);
  const [showPDFFlag, setShowPDFFlag] = useState<boolean>(false);
  const [PdfUrl, setPdfUrl] = useState<string | undefined>("");
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
    handleSubmit,
    control,
    formState: { errors },
    reset,
    setValue,
    getValues,
    watch,
  } = useForm<any>();
  const {
    data: PDFList,
    status: PDFList_status,
    refetch: PDFList_refetch,
  } = useQuery<any>({
    queryKey: [
      `disciplinary-case/uploaded-protest-letter-file${paramsSerializer(
        filters
      )}`,
    ],
    queryFn: Auth?.getRequest,
    select: (res: any) => {
      return res.data.content;
    },
    enabled: !!filters?.entityId && addModalFlag,
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
    if(!!PDFList)
    setLetterId(
      PDFList?.find((item: any) => item?.fileTag === "PROTEST-LETTER-FILE")
        ?.id ?? null
    );
  }, [PDFList]);
  const {
    data: objectionData,
    status: objectionData_status,
    refetch: objectionData_refetch,
  } = useQuery<any>({
    queryKey: [
      `disciplinary-case/find-objection?disciplinaryCaseId=${editeData?.id}`,
    ],
    queryFn: Auth?.getRequest,
    select: (res: any) => {
      return res?.data;
    },
    enabled: !!editeData && addModalFlag,
  } as any);

  const { mutate, isLoading } = useMutation({
    mutationFn: Auth?.serverCallUpload,
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
    setFilters((prev: any) => ({
      ...prev,
      entityId: null,
    }));
    reset({
      objectionLetterNumber: "",
      objectionLetterDate: "",
      objectionDate: "",
      objectionText: "",
    });
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

    e.currentTarget.value = ""; // اجازه انتخاب مجدد همان فایل
  };
  const handleChooseClick = (name: string) =>
    LetterfileInputRef.current?.click();

  const onSubmit = (data: any) => {
    if (!selectedLetterImage) {
      snackbar("ابتدا فایل PDF نامه اعتراض را انتخاب کنید", "warning");
      return;
    }
    const {
      objectionLetterNumber,
      objectionLetterDate,
      objectionDate,
      objectionText,
      ...restOfData
    } = data;
    const submissionData = {
      objectionLetterNumber,
      objectionLetterDate,
      objectionDate,
      objectionText,
      disciplinaryCaseId: editeData?.id ?? null,
    };
    const formData = new FormData();
    formData.append("file", selectedLetterImage);
    // 3. تبدیل DTO به Blob و افزودن به FormData
    formData.append(
      "data",
      new Blob([JSON.stringify(submissionData)], { type: "application/json" })
    );
    console.log("submissionData", submissionData);
    mutate({
      entity: `disciplinary-case/register-objection`,
      method:  "put" ,
      data: formData,
    });
  };
  // فراخوانی هوک سفارشی با تمام منطق
  const formItems: FormItem[] = useMemo(
    () => [
      {
        name: "objectionLetterNumber",
        inputType: "text",
        label: "شماره نامه",
        size: { md: 4 },
        // rules: { required: "شاکی الزامی است" },
      },
      {
        name: "objectionLetterDate",
        inputType: "date",
        label: "تاریخ نامه",
        size: { md: 4 },
        elementProps: {
          setDay: (value: any) => setValue("accuserPrimaryMeetingDate", value),
        },
      },
      {
        name: "objectionDate",
        inputType: "date",
        label: "تاریخ اعتراض",
        size: { md: 4 },
        elementProps: {
          setDay: (value: any) => setValue("boardMeetingDate", value),
        },
      },
      {
        name: "objectionText",
        inputType: "text",
        label: "متن اعتراض",
        size: { md: 12 },
        elementProps: {
          multiline: true,
          rows: 3,
        },
        // rules: { required: "شاکی الزامی است" },
      },
    ],
    [objectionData, reset, editeData]
  );

  useEffect(() => {
    reset(
      objectionData ?? {
        objectionLetterNumber: "",
        objectionLetterDate: "",
        objectionDate: "",
        objectionText: "",
      }
    );
  }, [editeData, reset, objectionData]);

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
            <PanTool fontSize="medium" />
            <Typography variant="body1" fontSize={"large"}>
              درخواست اعتراض به حکم انتظامی بدوی
            </Typography>
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
                        value={(getValues() as any)[item.name] ?? ""}
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
            <Grid item xs={12}>
              <Box
                sx={{
                  border: "1px dashed",
                  borderColor: "divider",
                  padding: 2,
                  borderRadius: 1,
                  mt: 1,
                  width: { md: "100%", xs: "100%" },
                  alignContent: "center",
                }}
              >
                <input
                  ref={LetterfileInputRef}
                  type="file"
                  accept="application/pdf"
                  onChange={(e) => handleFileChange(e, "letter")}
                  hidden
                />
                <Stack spacing={2} direction="row" alignItems="center">
                  {editable ? (
                    <Button
                      variant="outlined"
                      onClick={() => handleChooseClick("letter")}
                      startIcon={<PictureAsPdf />}
                      disabled={isLoading}
                    >
                      انتخاب فایل PDF نامه اعتراض
                    </Button>
                  ) : (
                    <Typography>PDF نامه اعتراض</Typography>
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
                          objectUrl = URL.createObjectURL(selectedLetterImage);
                          setPdfUrl(objectUrl);
                          setShowPDFFlag((prev) => !prev);
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
            </Grid>
            <Grid item md={12} sm={12} xs={12}>
              {!!PdfUrl && showPDFFlag && (
                <MyPdfViewer PdfUrl={PdfUrl ?? ""} sx={{ width: "100%" }} />
              )}
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

export default PrRequest;
