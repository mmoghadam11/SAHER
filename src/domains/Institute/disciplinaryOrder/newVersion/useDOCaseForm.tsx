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
import * as jalali from "jalali-moment";
import jalaliMonthDiff from "components/jalali/Diff";

// --- توابع کمکی ---
const mapAccountantOption = (item: any) => ({
  value: item?.id,
  title: `${item?.firstName ?? ""} ${item?.lastName ?? ""} - ${
    item?.membershipNo ?? ""
  }`.trim(),
});

const buildPersonnelFiltersFromText = (q: string | undefined | null) => {
  const s = (q ?? "").trim();
  if (s.length < 2) return null;
  // اگر فقط عدد باشد، بر اساس کد ملی جستجو کن
  if (/^\d+$/.test(s)) return { membershipNo: s };
  // اگر متن و شامل فاصله باشد، سعی کن بر اساس نام و نام خانوادگی جستجو کنی
  const parts = s.split(/\s+/);
  if (parts.length >= 2) {
    return { firstName: parts[0], lastName: parts.slice(1).join(" ") };
  }
  // در غیر این صورت، بر اساس نام خانوادگی جستجو کن
  return { lastName: s };
};
const buildDICFiltersFromText = (q: string | undefined | null) => {
  const s = (q ?? "").trim();
  if (s.length < 2) return null;
  // اگر فقط عدد باشد، بر اساس کد ملی جستجو کن
  // if (/^\d+$/.test(s)) return { orderNo: s };
  if (/^\d+$/.test(s)) return { orderNumber: s };
  // اگر متن و شامل فاصله باشد، سعی کن بر اساس نام و نام خانوادگی جستجو کنی
  // const parts = s.split(/\s+/);
  // if (parts.length >= 2) {
  //   return { firstName: parts[0], lastName: parts.slice(1).join(" ") };
  // }
  // در غیر این صورت، بر اساس نام خانوادگی جستجو کن
  return { subject: s };
};

// --- Props هوک ---
type HookProps = {
  editeData: any;
  watch: UseFormWatch<any>;
  setValue: any;
  reset: any;
  responsibleTyping: any;
  setResponsibleTyping: any;
  DICTyping?: any;
  setDICTyping?: any;
};

export const useDOCaseForm = ({
  editeData,
  watch,
  setValue,
  reset,
  responsibleTyping,
  setResponsibleTyping,
  DICTyping,
  setDICTyping,
}: HookProps) => {
  const Auth = useAuth();
  const snackbar = useSnackbar();

  const watchedReferralType = watch("cdReferralTypeId");
  const watchedTypeOrder = watch("cdPersonalityId");
  const watchedAccountantMemberShip = watch("currentCdMembershipTypeId");
  const startDate = watch("startDate");
  const endDate = watch("endDate");

  const [searchKey, setSearchKey] = useState("");
  const [selectedItems, setSelectedItems] = useState<any[]>([]);
  const [responsibleSearch, setResponsibleSearch] = useState("");
  const debouncedResponsible = useDebounce(responsibleSearch, 400);
  const [DICSearch, setDICSearch] = useState("");
  const debouncedDIC = useDebounce(DICSearch, 400);

  // 👇 اصلاح شد: منطق تنظیم cdPersonalityId و reset برای حالت ویرایش

  const responsibleFilters = useMemo(() => {
    // اگر در حالت نمایش داده ویرایشی هستیم و داده حسابدار رسمی وجود دارد، بر اساس ID فیلتر کن
    if (!responsibleTyping && editeData?.accuserId) {
      return { id: editeData.accuserId };
    }
    // در غیر این صورت، بر اساس متن جستجوی کاربر فیلتر کن
    return buildPersonnelFiltersFromText(debouncedResponsible);
  }, [debouncedResponsible, responsibleTyping, editeData?.accuserId]);
  const DICFilters = useMemo(() => {
    if (!DICTyping && editeData?.supremeId) {
      return { id: editeData.supremeId };
    }
    // در غیر این صورت، بر اساس متن جستجوی کاربر فیلتر کن
    return buildDICFiltersFromText(debouncedDIC);
  }, [debouncedDIC, DICTyping, editeData?.supremeId]);

  // --- واکشی داده‌ها با فرمت درخواستی ---

  const { data: firmOptions } = useQuery<any>({
    queryKey: [`firm/search-all`],
    queryFn: Auth?.getRequest,
    select: (res: any) => res?.data,
    // enabled: watchedTypeOrder === 396,
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
  const { data: basicOrders, isFetching: isBasicOrdersFetching } =
    useQuery<any>({
      queryKey: [
        `disciplinary-order/primary-order-all${paramsSerializer(DICFilters)}`,
      ],
      queryFn: Auth?.getRequest,
      select: (res: any) => res?.data ?? [],
      enabled: !!DICFilters,
      keepPreviousData: true,
    } as any);

  const { data: referralTypeOptions } = useQuery<any>({
    queryKey: [`common-data/find-by-type-all?typeId=53`],
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
  const { data: membershipType } = useQuery<any>({
    queryKey: [`common-data/find-by-type-all?typeId=26`],
    queryFn: Auth?.getRequest,
    select: (res: any) => res?.data,
  } as any);

  const {
    data: orderSubjectOptions,
    refetch: searchRefetch,
    isFetching: isSearching,
  } = useQuery<any>({
    // queryKey: [`common-data/find-by-type-all?typeId=48`],
    queryKey: [`common-data/find-by-key?typeId=48&key=${searchKey}`],
    queryFn: Auth?.getRequest,
    select: (res: any) => res?.data,
    enabled: false,
  } as any);
  const handleSearchClick = () => {
    if (searchKey.length >= 1) {
      searchRefetch();
    }
  };
  useEffect(() => {
    if (editeData && editeData.subjectTypeList) {
      // فرض بر این است که دیتای سرور آرایه‌ای به نام relatedPersonnels دارد
      setSelectedItems(editeData.subjectTypeList);
    }
  }, [editeData]);
  const handleAddItem = (item: any) => {
    // جلوگیری از تکراری بودن
    const exists = selectedItems.find((i) => i.id === item.id);
    if (!exists) {
      setSelectedItems((prev) => [...prev, item]);
    }
  };
  const handleRemoveItem = (id: any) => {
    setSelectedItems((prev) => prev.filter((i) => i.id !== id));
  };

  const { data: workgroupOptions } = useQuery<any>({
    queryKey: [`workgroup/search-all`],
    queryFn: Auth?.getRequest,
    select: (res: any) => res?.data,
  } as any);

  useEffect(() => {
    if (startDate && endDate) {
      const diff = new Date(endDate).getDate() - new Date(startDate).getDate();
      // const days = moment(endDate).diff(moment(startDate), "days");
      const days = moment(endDate).diff(moment(startDate), "month");
      const MonthDiff: number = jalaliMonthDiff(
        moment(startDate),
        moment(endDate)
      );
      setValue("orderDuration", MonthDiff);
    } else {
      setValue("orderDuration", null);
    }
  }, [startDate, endDate, setValue]);
  const formItems: FormItem[] = useMemo(() => {
    const baseItems: FormItem[] = [
      {
        name: "cdPersonalityId",
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

      // {
      //   name: "subject",
      //   inputType: "text",
      //   label: "موضوع",
      //   size: { md: 6 },
      //   rules: { required: "موضوع الزامی است" },
      // },
      // {
      //   name: "cdSubjectTypeId",
      //   inputType: "autocomplete",
      //   label: "ردیف - موضوع تخلف",
      //   size: { md: 6 },
      //   options:
      //     orderSubjectOptions?.map((item: any) => ({
      //       value: item?.id,
      //       title: `${item?.key} - ${item?.value}`,
      //       key:item.key
      //     })) ?? [],
      //   storeValueAs: "id",
      //   // elementProps:{
      //   //   multiple:true
      //   // },
      //   rules: { required: "موضوع الزامی است" },
      // },
      {
        name: "complainant",
        inputType: "text",
        label: "شاکی",
        size: { md: 6 },
        // rules: { required: "شاکی الزامی است" },
      },
      {
        name: "cdReferralTypeId",
        inputType: "autocomplete",
        label: "نوع ارجاع دهنده",
        size: { md: 6 },
        options: referralTypeOptions?.map((item: any) => ({
          value: item?.id,
          title: item?.value,
        })) ?? [
          { value: 1, title: "کارگروه" },
          { value: 2, title: "هیئت عالی نظارت" },
        ],
        storeValueAs: "id",
        rules: { required: "انتخاب کارگروه الزامی است" },
      },
      {
        name: "referralId",
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
        name: "referralNumber",
        inputType: "text",
        label: "شماره ارجاع",
        size: { md: 6 },
        rules: { required: "شماره ارجاع الزامی است" },
      },
      {
        name: "referralDate",
        inputType: "date",
        label: "تاریخ ارجاع",
        size: { md: 6 },
        elementProps: {
          setDay: (value: any) => setValue("referralDate", value),
        },
        rules: { required: "تاریخ ارجاع الزامی است" },
      },

      {
        name: "titleDivider",
        inputType: "titleDivider",
        label: "",
        size: { md: 12 },
      },
      {
        name: "boardMeetingRecordDate",
        inputType: "date",
        label: "تاریخ صورتجلسه",
        size: { md: 4 },
        rules: { required: "تاریخ صورتجلسه الزامی است" },
        elementProps: {
          setDay: (value: any) => setValue("fileCreationDate", value),
        },
      },
      {
        name: "boardMeetingRecordNumber",
        inputType: "text",
        label: "شماره صورتجلسه",
        size: { md: 4 },
        rules: { required: "شماره صورتجلسه الزامی است" },
      },
      {
        name: "titleDivider2",
        inputType: "titleDivider",
        label: "",
        size: { md: 12 },
      },
    ];

    // جستجوی فیلد بر اساس نام cdPersonalityId
    const targetIndex = baseItems.findIndex(
      (item) => item.name === "cdPersonalityId"
    );
    const targetReferralTypeIndex = baseItems.findIndex(
      (item) => item.name === "cdReferralTypeId"
    );
    // if (targetReferralTypeIndex > -1) {
    //   if (watchedReferralType === 1085) {
    //     baseItems.splice(targetReferralTypeIndex + 1, 0, {
    //       name: "referralId",
    //       inputType: "autocomplete",
    //       label: "ارجاع دهنده",
    //       size: { md: 6 },
    //       options:
    //         workgroupOptions?.map((item: any) => ({
    //           value: item?.id,
    //           title: item?.name,
    //         })) ?? [],
    //       storeValueAs: "id",
    //       rules: { required: "انتخاب کارگروه الزامی است" },
    //     });
    //   }
    // }
    if (targetIndex > -1) {
      if (watchedTypeOrder === 396) {
        baseItems.splice(targetIndex + 1, 0, {
          name: "accuserId",
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
        baseItems.splice(
          targetIndex + 1,
          0,
          {
            name: "accuserId", // 👇 اصلاح شد: نام فیلد 'personnelCaId' شد
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
          },
          {
            name: "currentCdMembershipTypeId",
            inputType: "select",
            label: "وضعیت حسابدار رسمی",
            size: { md: 6 },
            options: membershipType?.map((item: any) => ({
              value: item?.id,
              title: item?.value,
            })) ?? [{ value: 0, title: "خالی" }],
            rules: { required: "انتخاب وضعیت الزامی است" },
          }
        );
        if (
          watchedAccountantMemberShip === 63 ||
          watchedAccountantMemberShip === 64
        ) {
          baseItems.splice(targetIndex + 3, 0, {
            name: "currentAuditingFirmId",
            inputType: "autocomplete",
            label: "موسسه",
            size: { md: 6 },
            options:
              firmOptions?.map((item: any) => ({
                value: item.id,
                title: item.name,
              })) ?? [],
            storeValueAs: "id",
            // rules: { required: "انتخاب موسسه الزامی است" },
          });
        }
      }
    }
    return baseItems;
  }, [
    editeData,
    watchedReferralType,
    watchedTypeOrder,
    endDate,
    watchedAccountantMemberShip,
    startDate,
    accountants,
    isAccountantsFetching,
    isBasicOrdersFetching,
    responsibleSearch,
    DICSearch,
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
