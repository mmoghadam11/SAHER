// /hooks/usePartnerFormItems.ts (یا هر مسیری که صلاح می‌دانید)

import { useMemo, useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { useAuth } from "hooks/useAuth";
import { useDebounce } from "hooks/useDebounce"; // مسیر هوک خود را چک کنید
import paramsSerializer from "services/paramsSerializer"; // مسیر سرویس خود را چک کنید
import { FormItem } from "types/formItem"; // مسیر تایپ خود را چک کنید

// --- توابع کمکی (قبلاً در AddPartner بودند) ---

const buildPersonnelFiltersFromText = (q: string | undefined | null) => {
  const s = (q ?? "").trim();
  if (s.length < 2) return null;
  if (/^\d+$/.test(s)) return { nationalCode: s };
  const parts = s.split(/\s+/);
  if (parts.length >= 2) {
    return { firstName: parts[0], lastName: parts.slice(1).join(" ") };
  }
  return { lastName: s };
};

const mapOption = (item: any) => ({
  value: item?.id,
  title: `${item?.firstName ?? ""} ${item?.lastName ?? ""} - ${
    item?.nationalCode ?? ""
  }`.trim(),
});

// --- Props هوک ---
type HookProps = {
  setValue:any,
  editePartnerData: any; // یا تایپ دقیق‌تر
};

/**
 * این هوک تمام منطق مربوط به فیلدهای فرم شریک (ناظر و مسئول)
 * شامل جستجوی سروری، debounce و مدیریت حالت را کپسوله می‌کند.
 */
export const usePartnerFormItems = ({
  setValue,
  editePartnerData,
}: HookProps): FormItem[] => {
  const Auth = useAuth();

  // --- مدیریت حالت (منتقل شده از AddPartner) ---

  // سرچ شریک
  const [responsibleTyping, setResponsibleTyping] = useState(true);
  const [responsibleSearch, setResponsibleSearch] = useState("");
  const debouncedResponsible = useDebounce(responsibleSearch, 400);

  // سرچ ناظر
  const [supervisorTyping, setSupervisorTyping] = useState(true);
  const [supervisorSearch, setSupervisorSearch] = useState("");
  const debouncedSupervisor = useDebounce(supervisorSearch, 400);

  // --- افکت (منتقل شده از AddPartner) ---
  // این افکت وضعیت تایپ را بر اساس بودن یا نبودن داده ویرایشی تنظیم می‌کند
  useEffect(() => {
    // اگر داده ویرایشی داریم، تایپ غیرفعال است (چون باید ID را فچ کنیم)
    setResponsibleTyping(!editePartnerData?.responsiblePersonId);
    setSupervisorTyping(!editePartnerData?.supervisorPersonId);

    // اگر در حالت "جدید" هستیم (داده ویرایشی نداریم)، جستجوها را پاک کن
    if (!editePartnerData) {
      setResponsibleSearch("");
      setSupervisorSearch("");
    }
  }, [editePartnerData]);

  // --- واکشی داده (منتقل شده از AddPartner) ---

  const responsibleFilters = useMemo(() => {
    if (!responsibleTyping)
      return { id: editePartnerData?.responsiblePersonId };
    else return buildPersonnelFiltersFromText(debouncedResponsible);
  }, [debouncedResponsible, responsibleTyping, editePartnerData?.responsiblePersonId]);

  const supervisorFilters = useMemo(() => {
    if (!supervisorTyping)
      return { id: editePartnerData?.supervisorPersonId };
    else return buildPersonnelFiltersFromText(debouncedSupervisor);
  }, [debouncedSupervisor, supervisorTyping, editePartnerData?.supervisorPersonId]);

  // کوئری اتوکامپلیت شریک
  const {
    data: ResponsiblePersonnel,
    status: Responsible_status,
    isFetching: Responsible_fetching,
    refetch: Responsible_refetch,
  } = useQuery<any>({
    queryKey: [
      `personnel-info/search-all${paramsSerializer(responsibleFilters)}`,
    ],
    queryFn: Auth?.getRequest,
    select: (res: any) => res?.data ?? [],
    enabled: !!responsibleFilters,
    keepPreviousData: true,
    staleTime: 60_000,
  } as any);

  // کوئری اتوکامپلیت ناظر
  const {
    data: SupervisorPersonnel,
    status: Supervisor_status,
    isFetching: Supervisor_fetching,
    refetch: Supervisor_refetch,
  } = useQuery<any>({
    queryKey: [
      `personnel-info/search-all${paramsSerializer(supervisorFilters)}`,
    ],
    queryFn: Auth?.getRequest,
    select: (res: any) => res?.data ?? [],
    enabled: !!supervisorFilters,
    keepPreviousData: true,
    staleTime: 60_000,
  } as any);

  // --- تعریف آیتم‌های فرم (خروجی هوک) ---

  const formItems: FormItem[] = useMemo(
    () => [
      {
        name: "responsiblePersonId",
        inputType: "autocomplete",
        label: "شریک مستقر در شعبه",
        size: { md: 6 },
        options: ResponsiblePersonnel?.map(mapOption) ?? [],
        storeValueAs: "id",
        rules: { required: "انتخاب شریک مستقر در شعبه الزامی است" },
        status: Responsible_status,
        refetch: Responsible_refetch,
        skipClientFilter: true, // فیلتر کلاینتی خاموش
        elementProps: {
          onInputChange: (_e: any, v: string, reason: string) => {
            if (reason === "input") {
              setResponsibleTyping(true);
              setResponsibleSearch(v);
            } else if (reason === "clear") {
              setResponsibleTyping(true);
              setResponsibleSearch("");
            }
          },
          loading: Responsible_fetching&&!!responsibleFilters,
          noOptionsText:
            (responsibleSearch.trim().length < 2 &&
              "برای جستجو حداقل ۲ کاراکتر وارد کنید") ||
            "موردی یافت نشد",
          openOnFocus: true,
        },
        inlineLoading: true,
      },
      // {
      //   name: "supervisorPersonId",
      //   inputType: "autocomplete",
      //   label: "ناظر",
      //   size: { md: 6 },
      //   options: SupervisorPersonnel?.map(mapOption) ?? [],
      //   storeValueAs: "id",
      //   rules: { required: "انتخاب ناظر الزامی است" },
      //   status: Supervisor_status,
      //   refetch: Supervisor_refetch,
      //   skipClientFilter: true, // فیلتر کلاینتی خاموش
      //   elementProps: {
      //     onInputChange: (_e, v, reason) => {
      //       if (reason === "input") {
      //         setSupervisorTyping(true);
      //         setSupervisorSearch(v);
      //       } else if (reason === "clear") {
      //         setSupervisorTyping(true);
      //         setSupervisorSearch("");
      //       }
      //     },
      //     loading: Supervisor_fetching&&!!supervisorFilters,
      //     noOptionsText:
      //       (supervisorSearch.trim().length < 2 &&
      //         "برای جستجو حداقل ۲ کاراکتر وارد کنید") ||
      //       "موردی یافت نشد",
      //     openOnFocus: true,
      //   },
      //   inlineLoading: true,
      // },
      {
    name: "startDate",
    inputType: "date",
    label: "تاریخ اخذ مدرک",
    size: { md: 6 },
    rules: { required: "تاریخ اخذ مدرک الزامی است" },
    elementProps: {
      setDay: (value: any) => {
        setValue("startDate", value);
      },
      value: "",
    },
  },
    ],
    [
      ResponsiblePersonnel,
      Responsible_status,
      Responsible_refetch,
      Responsible_fetching,
      responsibleSearch,
      SupervisorPersonnel,
      Supervisor_status,
      Supervisor_refetch,
      Supervisor_fetching,
      supervisorSearch,
    ]
  );

  return formItems;
};