// hooks/useDisciplinaryOrderForm.ts

import { useMemo, useState, useEffect } from "react";
import { useForm, UseFormWatch } from "react-hook-form";
import { useMutation, useQuery } from "@tanstack/react-query";
import { useAuth } from "hooks/useAuth";
import { useDebounce } from "hooks/useDebounce";
import { useSnackbar } from "hooks/useSnackbar";
import { FormItem } from "types/formItem";
import paramsSerializer from "services/paramsSerializer";
import moment from "jalali-moment";

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
  watch: UseFormWatch<any>;
  setValue: any;
  reset: any;
  responsibleTyping: any;
  setResponsibleTyping: any;
};

export const useDisciplinaryOrderForm = ({
  editeData,
  watch,
  setValue,
  reset,
  responsibleTyping,
  setResponsibleTyping,
}: HookProps) => {
  const Auth = useAuth();
  const snackbar = useSnackbar();

  const watchedTypeOrder = watch("cdRespondenTypeId");
  const watched = watch("cdClaimantTypeId");
  const startDate = watch("startDate");
  const endDate = watch("endDate");

  const [responsibleSearch, setResponsibleSearch] = useState("");
  const debouncedResponsible = useDebounce(responsibleSearch, 400);

  // 👇 اصلاح شد: منطق تنظیم cdRespondenTypeId و reset برای حالت ویرایش

  const responsibleFilters = useMemo(() => {
    // اگر در حالت نمایش داده ویرایشی هستیم و داده حسابدار رسمی وجود دارد، بر اساس ID فیلتر کن
    if (!responsibleTyping && editeData?.personnelCaId) {
      return { id: editeData.personnelCaId };
    }
    // در غیر این صورت، بر اساس متن جستجوی کاربر فیلتر کن
    return buildPersonnelFiltersFromText(debouncedResponsible);
  }, [debouncedResponsible, responsibleTyping, editeData?.personnelCaId]);

  // --- واکشی داده‌ها با فرمت درخواستی ---

  const { data: firmOptions } = useQuery<any>({
    queryKey: [`firm/search-all`],
    queryFn: Auth?.getRequest,
    select: (res: any) => res?.data,
    enabled: watchedTypeOrder === 396,
  } as any);

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
        watchedTypeOrder === 397 &&
        !!responsibleFilters &&
        Object.keys(responsibleFilters).length > 0,
      keepPreviousData: true,
    } as any);

  const { data: claimantTypeIdOptions } = useQuery<any>({
    queryKey: [`common-data/find-by-type-all?typeId=51`],
    queryFn: Auth?.getRequest,
    select: (res: any) => res?.data,
  } as any);
  const { data: RespondenType } = useQuery<any>({
    queryKey: [`common-data/find-by-type-all?typeId=50`],
    queryFn: Auth?.getRequest,
    select: (res: any) => res?.data,
  } as any);
  const { data: orderTypeOptions } = useQuery<any>({
    queryKey: [`common-data/find-by-type-all?typeId=47`],
    queryFn: Auth?.getRequest,
    select: (res: any) => res?.data,
  } as any);

  const { data: orderSubjectOptions } = useQuery<any>({
    queryKey: [`common-data/find-by-type-all?typeId=48`],
    queryFn: Auth?.getRequest,
    select: (res: any) => res?.data,
  } as any);

  const { data: workgroupOptions } = useQuery<any>({
    queryKey: [`workgroup/search-all`],
    queryFn: Auth?.getRequest,
    select: (res: any) => res?.data,
  } as any);

  // --- بقیه منطق هوک ---

  // 👇 اصلاح شد: حذف cdRespondenTypeId از payload و تنظیم درست auditingFirmId/personnelCaId
  const onSubmit = (data: any) => {
    const { cdRespondenTypeId, ...restOfData } = data; // حذف cdRespondenTypeId

    const submissionData = {
      ...data,
      // فقط فیلد مربوط به نوع پاسخ‌دهنده انتخاب شده را ارسال کن
      auditingFirmId:
        cdRespondenTypeId === 396 ? restOfData.auditingFirmId : null,
      personnelCaId:
        cdRespondenTypeId === 397 ? restOfData.personnelCaId : null,
    };

  };
  useEffect(() => {
    if (startDate && endDate) {
      const diff = new Date(endDate).getDate()-new Date(startDate).getDate() ;
      // const days = moment(endDate).diff(moment(startDate), "days");
      const days = moment(endDate).diff(moment(startDate), "months");
      setValue("orderDuration", days);
    } else {
      setValue("orderDuration", null);
    }
  }, [startDate, endDate, setValue]);
  const formItems: FormItem[] = useMemo(() => {
    const baseItems: FormItem[] = [
      {
        name: "cdRespondenTypeId",
        inputType: "select",
        label: "نوع شخصیت حسابرس",
        size: { md: 6 },
        options: RespondenType?.map((item: any) => ({
          value: item?.id,
          title: item?.value,
        })) ?? [
          { value: 396, title: "حکم برای موسسه" },
          { value: 397, title: "حکم برای حسابدار رسمی" },
        ],
        rules: { required: "انتخاب نوع حکم الزامی است" },
      },
      {
        name: "titleDivider1",
        inputType: "titleDivider",
        label: "",
        size: { md: 12 },
      },
      {
        name: "cdClaimantTypeId",
        inputType: "select",
        label: "نوع حکم",
        size: { md: 6 },
        options: claimantTypeIdOptions?.map((item: any) => ({
          value: item?.id,
          title: item?.value,
        })) ?? [
          { value: 398, title: "بدوی" },
          { value: 399, title: "عالی" },
        ],
        rules: { required: "انتخاب نوع حکم الزامی است" },
      },
      {
        name: "cdSubjectTypeId",
        inputType: "autocomplete",
        label: "موضوع",
        size: { md: 6 },
        options:
          orderSubjectOptions?.map((item: any) => ({
            value: item?.id,
            title: item?.value,
          })) ?? [],
        storeValueAs: "id",
        rules: { required: "موضوع الزامی است" },
      },
      {
        name: "claimant",
        inputType: "text",
        label: "شاکی",
        size: { md: 6 },
        // rules: { required: "شاکی الزامی است" },
      },
      {
        name: "workgroupId",
        inputType: "autocomplete",
        label: "کارگروه",
        size: { md: 6 },
        options:
          workgroupOptions?.map((item: any) => ({
            value: item?.id,
            title: item?.name,
          })) ?? [],
        storeValueAs: "id",
        rules: { required: "انتخاب کارگروه الزامی است" },
      },
      {
        name: "cdOrderTypeId",
        inputType: "select",
        label: "نوع تنبیه",
        size: { md: 6 },
        options:
          orderTypeOptions?.map((item: any) => ({
            value: item?.id,
            title: item?.value,
          })) ?? [],
        rules: { required: "انتخاب نوع حکم الزامی است" },
      },
      {
        name: "titleDivider",
        inputType: "titleDivider",
        label: "",
        size: { md: 12 },
      },
      {
        name: "recordDate",
        inputType: "date",
        label: "تاریخ صورتجلسه",
        size: { md: 4 },
        // rules: { required: "تاریخ صورتجلسه الزامی است" },
        elementProps: {
          setDay: (value: any) => setValue("fileCreationDate", value),
        },
      },
      {
        name: "recordNumber",
        inputType: "text",
        label: "شماره صورتجلسه",
        size: { md: 4 },
        // rules: { required: "تاریخ صورتجلسه الزامی است" },
      },
      {
        name: "orderNumber",
        inputType: "text",
        label: "شماره حکم",
        size: { md: 4 },
        rules: {
          required: "شماره حکم الزامی است",
          // pattern: { value: /^[0-9]+$/, message: "شماره حکم باید عددی باشد" },
        },
      },
      {
        name: "orderDate",
        inputType: "date",
        label: "تاریخ حکم",
        size: { md: 4 },
        rules: { required: "تاریخ حکم الزامی است" },
        elementProps: {
          setDay: (value: any) => {
            setValue("orderDate", value);
          },
        },
      },
      
      // {
      //   name: "fileCreationDate",
      //   inputType: "date",
      //   label: "تاریخ تشکیل پرونده",
      //   size: { md: 4 },
      //   rules: { required: "تاریخ تشکیل پرونده الزامی است" },
      //   elementProps: {
      //     setDay: (value: any) => setValue("fileCreationDate", value),
      //   },
      // },
      // {
      //   name: "fileTerminationDate",
      //   inputType: "date",
      //   label: "تاریخ خاتمه پرونده",
      //   size: { md: 4 },
      //   rules: {},
      //   elementProps: {
      //     setDay: (value: any) => setValue("fileTerminationDate", value),
      //   },
      // },
    ];

    // جستجوی فیلد بر اساس نام cdRespondenTypeId
    const targetIndex = baseItems.findIndex(
      (item) => item.name === "cdRespondenTypeId"
    );
    const targetIndex2 = baseItems.findIndex(
    (item) => item.name === "orderDate"
    );
    const targetIndexcdOrderTypeId = baseItems.findIndex(
      (item) => item.name === "cdOrderTypeId"
    );

    if (targetIndex > -1) {
      if (watchedTypeOrder === 396) {
        baseItems.splice(targetIndex + 1, 0, {
          name: "auditingFirmId",
          inputType: "autocomplete",
          label: "موسسه",
          size: { md: 6 },
          options:
            firmOptions?.map((item: any) => ({
              value: item.id,
              title: item.name,
            })) ?? [],
          storeValueAs: "id",
          rules: { required: "انتخاب موسسه الزامی است" },
        });
      } else if (watchedTypeOrder === 397) {
        baseItems.splice(targetIndex + 1, 0, {
          name: "personnelCaId", // 👇 اصلاح شد: نام فیلد 'personnelCaId' شد
          inputType: "autocomplete",
          label: "حسابدار رسمی",
          size: { md: 6 },
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
        });
      }
    }
    if (targetIndex2 > -1) {
      if (watched === 399) {
        baseItems.splice(
          targetIndex2 + 1,
          0,
          {
            name: "startDate",
            inputType: "date",
            label: "تاریخ شروع حکم",
            size: { md: 4 },
            rules: { required: "تاریخ شروع الزامی است" },
            elementProps: {
              setDay: (value: any) => setValue("startDate", value),
            },
          },
          {
            name: "endDate",
            inputType: "date",
            label: "تاریخ پایان حکم",
            size: { md: 4 },
            rules: {},
            elementProps: {
              setDay: (value: any) => setValue("endDate", value),
            },
          }
        );
      }
    }
    if (targetIndexcdOrderTypeId > -1) {
      if (startDate && endDate) {
        baseItems.splice(targetIndexcdOrderTypeId + 1, 0, {
          name: "orderDuration",
          inputType: "text",
          label: "مدت زمان حکم (ماه)",
          size: { md: 6 },
          elementProps:{
            disabled: true,
          }
        });
      }
    }
    return baseItems;
  }, [
    editeData,
    watchedTypeOrder,
    watched,
    endDate,
    startDate,
    accountants,
    isAccountantsFetching,
    responsibleSearch,
    responsibleTyping,
    firmOptions,
    orderTypeOptions,
    orderSubjectOptions,
    workgroupOptions,
    setValue,
    reset,
  ]);

  return {
    formItems,
  };
};
