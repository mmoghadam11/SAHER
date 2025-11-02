// hooks/useDisciplinaryOrderForm.ts

import { useMemo, useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { useMutation, useQuery } from "@tanstack/react-query";
import { useAuth } from "hooks/useAuth";
import { useDebounce } from "hooks/useDebounce";
import { useSnackbar } from "hooks/useSnackbar";
import { FormItem } from "types/formItem";
import paramsSerializer from "services/paramsSerializer";

// --- توابع کمکی ---
const mapAccountantOption = (item: any) => ({
  value: item?.id,
  title: `${item?.firstName ?? ""} ${item?.lastName ?? ""} - ${
    item?.nationalCode ?? ""
  }`.trim(),
});

const buildPersonnelFiltersFromText = (q: string | undefined | null) => {
  const s = (q ?? "").trim();
  if (s.length < 2) return null;
  // اگر فقط عدد باشد، بر اساس کد ملی جستجو کن
  if (/^\d+$/.test(s)) return { nationalCode: s };
  // اگر متن و شامل فاصله باشد، سعی کن بر اساس نام و نام خانوادگی جستجو کنی
  const parts = s.split(/\s+/);
  if (parts.length >= 2) {
    return { firstName: parts[0], lastName: parts.slice(1).join(" ") };
  }
  // در غیر این صورت، بر اساس نام خانوادگی جستجو کن
  return { lastName: s };
};

// --- Props هوک ---
type HookProps = {
  editeData: any;
  setValue:any
};

export const useBasicFormItems = ({ editeData,setValue }: HookProps) => {
  const Auth = useAuth();
  const snackbar = useSnackbar();

  


  const [responsibleTyping, setResponsibleTyping] = useState(true);
  const [responsibleSearch, setResponsibleSearch] = useState("");
  const debouncedResponsible = useDebounce(responsibleSearch, 400);

  // 👇 اصلاح شد: منطق تنظیم cdRespondenTypeId و reset برای حالت ویرایش
  useEffect(() => {
    if (!!editeData) {
      // تعیین نوع پاسخ‌دهنده بر اساس فیلدهای موجود در editeData
      let isPersonCaSet = false;

      if (editeData.auditingFirmId) {
      } else if (editeData.certifiedAccountantId) {
        isPersonCaSet = true;
      }

      // تنظیم حالت تایپ (جستجو) برای حسابدار رسمی: اگر در حال ویرایش داده‌ی موجود هستیم، جستجو خاموش است
      setResponsibleTyping(!isPersonCaSet);

    } else {
      // حالت جدید: مقادیر پیش‌فرض
      setResponsibleTyping(true);
      setResponsibleSearch("");
      
    }
  }, [editeData]);

  const responsibleFilters = useMemo(() => {
    // اگر در حالت نمایش داده ویرایشی هستیم و داده حسابدار رسمی وجود دارد، بر اساس ID فیلتر کن
    if (!responsibleTyping && editeData?.certifiedAccountantId) {
      return { id: editeData.certifiedAccountantId };
    }
    // در غیر این صورت، بر اساس متن جستجوی کاربر فیلتر کن
    return buildPersonnelFiltersFromText(debouncedResponsible);
  }, [debouncedResponsible, responsibleTyping, editeData?.certifiedAccountantId]);

  // --- واکشی داده‌ها با فرمت درخواستی ---


  // 👇 اصلاح شد: تنظیم درست queryFn برای ارسال URL شامل فیلترها به API
  const { data: accountants, isFetching: isAccountantsFetching } =
    useQuery<any>({
      queryKey: [
        `certified-accountant/search-all${paramsSerializer(
          responsibleFilters
        )}`,
      ],
      queryFn: Auth?.getRequest,
      select: (res: any) => res?.data ?? [],
      enabled:
        !!responsibleFilters &&
        Object.keys(responsibleFilters).length > 0,
      keepPreviousData: true,
    } as any);

  
  


  
  const formItems: FormItem[] = useMemo(() => 
    [
      {
        name: "certifiedAccountantId", // 👇 اصلاح شد: نام فیلد 'certifiedAccountantId' شد
        inputType: "autocomplete",
        label: "حسابدار رسمی",
        size: { md: 4 },
        options: accountants?.map(mapAccountantOption) ?? [],
        storeValueAs: "id",
        rules: { required: "انتخاب حسابدار رسمی الزامی است" },
        skipClientFilter: true,
        elementProps: {
          onInputChange: (_: any, v: string, reason: string) => {
            if (reason === "input") {
              setResponsibleTyping(true);
              setResponsibleSearch(v);
            }
            if (reason === "clear") {
              setResponsibleTyping(true);
              setResponsibleSearch("");
            }
          },
          loading: isAccountantsFetching,
          noOptionsText:
            responsibleSearch.trim().length < 2 && responsibleTyping
              ? "برای جستجو حداقل ۲ کاراکتر وارد کنید"
              : "موردی یافت نشد",
        },
      },
      {
        name: "startDate",
        inputType: "date",
        label: "تاریخ شروع",
        size: { md: 4 },
        rules: { required: "تاریخ شروع الزامی است" },
        elementProps: { setDay: (value: any) => setValue("startDate", value) },
      },
      {
        name: "document",
        inputType: "text",
        label: "مستندات",
        size: { md: 4 },
        // rules: { required: "مستندات الزامی است" },
      },
    ]
, [
    editeData,
    accountants,
    isAccountantsFetching,
    responsibleSearch,
    responsibleTyping,
  ]);

  return formItems
};
