import {
  AddCircle,
  ChangeCircle,
  GavelOutlined,
  Close,
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
      handleClose()
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
    });
    setPdfUrl("");
    setPdfViewFlag(false)
  };
  const onSubmit = (data: any) => {
    const { cdRespondenTypeId, ...restOfData } = data; // حذف cdRespondenTypeId
    const { orderDuration, ...formData } = data; // حذف orderDuration

    const submissionData = {
      ...formData,
      // فقط فیلد مربوط به نوع پاسخ‌دهنده انتخاب شده را ارسال کن
      auditingFirmId:
        cdRespondenTypeId === 396 ? restOfData.auditingFirmId : null,
      personnelCaId:
        cdRespondenTypeId === 397 ? restOfData.personnelCaId : null,
    };

    console.log("submissionData", submissionData);

    mutate({
      entity: `disciplinary-order/${!!editeData ? "update" : "save"}`,
      method: !!editeData ? "put" : "post",
      data: submissionData,
    });
  };
  // فراخوانی هوک سفارشی با تمام منطق
  const { formItems } = useDisciplinaryOrderForm({
    editeData,
    watch,
    setValue,
    reset,
    responsibleTyping,
    setResponsibleTyping,
  });

  const {
    data: uploadedPDF,
    status: uploadedPDF_status,
    refetch: uploadedPDF_refetch,
  } = useQuery<any>({
    queryKey: [`disciplinary-order/download-order-file?id=${editeData?.id}`],
    queryFn: Auth?.getRequestDownloadFile,
    select: (res: any) => {
      return res;
    },
    enabled: !!editeData,
  } as any);
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
        cdClaimantTypeId: !!editeData?.startDate ? 399 : 398,
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
      });
    }
  }, [editeData, reset]);
  useEffect(() => {
    let objectUrl: string | null = null;

    // 1. چک کنید که داده‌ی تصویر وجود دارد و از نوع Blob است
    if (
      uploadedPDF &&
      uploadedPDF instanceof Blob &&
      uploadedPDF.type.startsWith("application/pdf")
    ) {
      // 2. یک URL موقت از Blob بسازید
      objectUrl = URL.createObjectURL(uploadedPDF);
      // 3. URL ساخته شده را در استیت قرار دهید
      setPdfUrl(objectUrl);
    }
    //   if (image && image instanceof Blob&&!image.type.startsWith("image/")) {
    //     // 2. یک URL موقت از Blob بسازید
    //     objectUrl = "";
    //     // 3. URL ساخته شده را در استیت قرار دهید
    //     setAvatarUrl(objectUrl);
    //   }

    // 4. (مهم) تابع پاک‌سازی:
    // این تابع زمانی اجرا می‌شود که کامپوننت unmount شود یا 'image' تغییر کند
    return () => {
      if (objectUrl) {
        // URL موقت قبلی را از حافظه مرورگر پاک می‌کند
        URL.revokeObjectURL(objectUrl);
      }
    };
  }, [uploadedPDF]);
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
        sx={editable ? { overflow: "visible" } : {}}
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
            {!editable && !!PdfUrl &&(
              <Grid item xs={12}>
                <PdfUploadForm
                  PdfViewFlag={PdfViewFlag}
                  entityId={editeData?.id ?? ""}
                  onViewClick={() => {
                    setPdfViewFlag((prev) => !prev);
                  }}
                  refetch={uploadedPDF_refetch}
                  existingPdfUrl={PdfUrl ?? ""}
                />
              </Grid>
            )}

            {PdfViewFlag && !!PdfUrl && (
              <Grid item xs={12}>
                <MyPdfViewer PdfUrl={PdfUrl} sx={{width: "100%"}}/>
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
