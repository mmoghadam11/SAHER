// components/PdfUploadForm.tsx
import React, { useState, useRef } from "react";
import {
  Stack,
  Button,
  Typography,
  Box,
  CircularProgress,
} from "@mui/material";
import {
  CloudUpload,
  Visibility,
  PictureAsPdf,
  DeleteOutline,
} from "@mui/icons-material";

// --- ایمپورت‌های مورد نیاز برای منطق داخلی ---
import { useMutation } from "@tanstack/react-query";
import { useAuth } from "hooks/useAuth";
import { useSnackbar } from "hooks/useSnackbar";

// --- 1. تعریف Props جدید (شبیه به UploadPdfDialog) ---
type Props = {
  PdfViewFlag: boolean;
  // URL فایلی که از قبل آپلود شده (اگر وجود دارد)
  existingPdfUrl?: string | null;

  // ID موجودیتی که فایل به آن ضمیمه می‌شود (برای آپلود جدید)
  entityId: string | number;

  // تابعی که هنگام کلیک روی "مشاهده" صدا زده می‌شود
  onViewClick: () => void;

  // تابعی برای حذف فایل (اختیاری)
  onRemoveClick?: () => void;

  // یک Callback برای زمانی که آپلود با موفقیت انجام شد
  refetch?: () => void;

  // پراپرتی برای غیرفعال کردن دکمه حذف (اگر در حال لود شدن حذف باشد)
  isRemoveLoading?: boolean;
};

const MAX_PDF_SIZE_MB = 10;

const PdfUploadForm: React.FC<Props> = ({
  PdfViewFlag,
  existingPdfUrl,
  entityId,
  onViewClick,
  onRemoveClick,
  refetch,
  isRemoveLoading = false, // پراپرتی جدید برای مدیریت حذف
}) => {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  // --- 2. افزودن هوک‌های Auth, Snackbar و Mutation ---
  const Auth = useAuth();
  const snackbar = useSnackbar();

  const { mutate, isLoading } = useMutation({
    // isLoading اکنون داخلی است
    mutationFn: Auth?.serverCallUpload,
    onSuccess: (res: any) => {
      snackbar("فایل PDF با موفقیت آپلود شد", "success");
      refetch?.(); // اجرای Callback
      setSelectedFile(null); // پاک کردن فایل پس از آپلود
    },
    onError: () => {
      snackbar("خطا در آپلود فایل", "error");
    },
  });

  // --- 3. توابع مدیریت فایل (بدون تغییر) ---
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] ?? null;
    if (!file) {
      setSelectedFile(null);
      return;
    }
    if (file.type !== "application/pdf") {
      snackbar("فقط فایل PDF مجاز است.", "warning");
      setSelectedFile(null);
      e.currentTarget.value = "";
      return;
    }
    if (file.size > MAX_PDF_SIZE_MB * 1024 * 1024) {
      snackbar(`حداکثر حجم فایل ${MAX_PDF_SIZE_MB}MB است.`, "warning");
      setSelectedFile(null);
      e.currentTarget.value = "";
      return;
    }
    setSelectedFile(file);
    e.currentTarget.value = "";
  };

  const handleChooseClick = () => {
    fileInputRef.current?.click();
  };

  const handleClearSelection = () => {
    setSelectedFile(null);
  };

  // --- 4. بازنویسی handleUploadClick (منطق آپلود داخلی شد) ---
  const handleUploadClick = () => {
    if (!selectedFile) {
      snackbar("ابتدا یک فایل PDF انتخاب کنید", "info");
      return;
    }

    const formData = new FormData();
    formData.append("file", selectedFile);

    const dto = {
      id: entityId,
      description: "disciplinary_order_pdf",
    };

    formData.append(
      "data",
      new Blob([JSON.stringify(dto)], { type: "application/json" })
    );

    mutate({
      // ❗️ مسیر API را مطابق با نیاز خود تنظیم کنید
      entity: `disciplinary-order/upload-order-file`,
      method: "post",
      data: formData,
    });
  };

  // --- 5. JSX (بدون تغییر منطق، فقط متغیر isLoading داخلی شد) ---

  // --- حالت نمایش فایل (فایل از قبل وجود دارد) ---
  if (existingPdfUrl) {
    return (
      <Box
        sx={{
          border: "1px dashed",
          borderColor: "divider",
          padding: 2,
          borderRadius: 1,
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <Typography variant="body2" color="text.secondary">
          فایل پیوست آپلود شده است.
        </Typography>
        <Box>
          {onRemoveClick && (
            <Button
              color="error"
              onClick={onRemoveClick}
              sx={{ mr: 1 }}
              disabled={isLoading || isRemoveLoading} // غیرفعال هنگام آپلود یا حذف
            >
              {isRemoveLoading ? "درحال حذف..." : "حذف"}
            </Button>
          )}
          <Button
            variant="contained"
            color="secondary"
            onClick={onViewClick}
            startIcon={<Visibility />}
            disabled={isLoading || isRemoveLoading} // غیرفعال هنگام هرگونه لودینگ
          >
            {PdfViewFlag ? "عدم نمایش PDF" : "مشاهده PDF"}
          </Button>
        </Box>
      </Box>
    );
  }

  // --- حالت آپلود (فایلی وجود ندارد) ---
  return (
    <Box
      sx={{
        border: "1px dashed",
        borderColor: "divider",
        padding: 2,
        borderRadius: 1,
      }}
    >
      <input
        ref={fileInputRef}
        type="file"
        accept="application/pdf"
        onChange={handleFileChange}
        hidden
      />

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
          <>
            <Typography variant="body2" sx={{ flexGrow: 1 }} noWrap>
              {selectedFile.name}
            </Typography>
            <Button
              color="inherit"
              onClick={handleClearSelection}
              startIcon={<DeleteOutline />}
              disabled={isLoading}
            >
              لغو
            </Button>
            <Button
              variant="contained"
              onClick={handleUploadClick} // <- به تابع داخلی متصل شد
              startIcon={
                isLoading ? ( // <- از متغیر داخلی استفاده می‌کند
                  <CircularProgress size={20} color="inherit" />
                ) : (
                  <CloudUpload />
                )
              }
              disabled={isLoading} // <- از متغیر داخلی استفاده می‌کند
            >
              {isLoading ? "در حال آپلود..." : "آپلود"}
            </Button>
          </>
        )}
      </Stack>

      {!selectedFile && (
        <Typography
          variant="caption"
          color="text.secondary"
          sx={{ mt: 1, display: "block" }}
        >
          حداکثر حجم مجاز: {MAX_PDF_SIZE_MB} مگابایت
        </Typography>
      )}
    </Box>
  );
};

export default PdfUploadForm;
