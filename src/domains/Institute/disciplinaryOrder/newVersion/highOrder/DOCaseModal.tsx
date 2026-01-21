import {
  AddCircle,
  ChangeCircle,
  GavelOutlined,
  Close,
  Add,
  Delete,
  Search,
  HistoryEdu,
  MenuBook,
  People,
  BusinessCenter,
  Gavel,
  GppGood,
  MarkEmailRead,
  PanTool,
  Verified,
  GppBad,
  CheckCircle,
  DoneAll,
  Mail,
  PictureAsPdf,
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
  Chip,
  Stack,
  DialogActions,
} from "@mui/material";
import RenderFormInput from "components/render/formInputs/RenderFormInput";
import React, { useEffect, useMemo, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { useMutation, useQuery } from "@tanstack/react-query";
import { useAuth } from "hooks/useAuth";
import { useSnackbar } from "hooks/useSnackbar";
import RenderFormDisplay from "components/render/formInputs/RenderFormDisplay";
import { FormItem } from "types/formItem";
import paramsSerializer from "services/paramsSerializer";
import TavanaDataGrid from "components/dataGrid/TavanaDataGrid";
import VerticalTable from "components/dataGrid/VerticalTable";
import { isMobile } from "react-device-detect";
import { GridColDef } from "@mui/x-data-grid";
import { PAGINATION_DEFAULT_VALUE } from "shared/paginationValue";
import jalaliMoment from "jalali-moment";
import moment from "moment-timezone";
import TicketDivider from "components/FancyTicketDivider";
import MyPdfViewer from "components/pdfviewer/MyPdfViewer";
import SubjectTable from "../components/SubjectTable";

// مسیر هوک را بر اساس ساختار پروژه خودتان تنظیم کنید

type Props = {
  editable: boolean;
  refetch: () => void;
  addModalFlag: boolean;
  setAddModalFlag: React.Dispatch<React.SetStateAction<boolean>>;
  editeData: any;
  setEditeData: React.Dispatch<React.SetStateAction<any>>;
};

const DOCaseModal = ({
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
  const [selectedItems, setSelectedItems] = useState<any[]>([]);
  const {
    handleSubmit,
    control,
    formState: { errors },
    reset,
    setValue,
    getValues,
  } = useForm<any>();
  const { data: orderTypeOptions } = useQuery<any>({
    queryKey: [`disciplinary-order-base/search-all`],
    queryFn: Auth?.getRequest,
    select: (res: any) => res?.data,
  } as any);
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
          setDay: (value: any) => setValue("accuserPrimaryMeetingDate", value),
        },
      },
      {
        name: "orderDuration",
        inputType: "text",
        label: "مدت حکم",
        size: { md: 6 },
        // rules: { required: "شاکی الزامی است" },
      },
      {
        name: "disciplinaryOrderId",
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
      {
        name: "divider",
        inputType: "titleDivider",
        label: "",
        size: { md: 12 },
        // rules: { required: "شاکی الزامی است" },
      },
    ],
    [orderTypeOptions]
  );
  const [filters, setFilters] = useState<any>({
    ...PAGINATION_DEFAULT_VALUE,
    id: editeData?.disciplinaryCaseId,
  });
  const {
    data: StatesData,
    status: StatesData_status,
    refetch: StatesData_refetch,
  } = useQuery<any>({
    queryKey: [`disciplinary-case/search${paramsSerializer(filters)}`],
    queryFn: Auth?.getRequest,
    select: (res: any) => {
      return res?.data;
    },
    enabled: true,
  } as any);
  const { mutate, isLoading } = useMutation({
    mutationFn: Auth?.serverCall,
    onSuccess: () => {
      snackbar(
        !!editeData
          ? `گزارشات با موفقیت به‌روزرسانی شد`
          : `گزارشات جدید با موفقیت افزوده شد`,
        "success"
      );
      refetch();
      handleClose();
    },
    onError: () => {
      snackbar("خطا در ثبت گزارشات", "error");
    },
  });
  const handleClose = () => {
    setAddModalFlag(false);
    setEditeData(null);
  };

  const columns: GridColDef[] = [
    {
      field: "respondenType",
      headerName: "نوع شخصیت حسابرس",
      flex: 1.2,
      align: "center",
      renderCell: ({ row }: { row: any }) => {
        if (row?.cdPersonalityId === 397)
          return (
            <Tooltip title="حسابدار رسمی">
              <Chip
                size="small"
                label="حسابدار رسمی"
                icon={<People fontSize="small" />}
                color="info"
              />
            </Tooltip>
          );
        if (row?.cdPersonalityId === 396)
          return (
            <Tooltip title="موسسه">
              <Chip
                size="small"
                label="موسسه"
                icon={<BusinessCenter fontSize="small" />}
                color="warning"
              />
            </Tooltip>
          );
      },
    },
    { field: "accuserName", headerName: "نام شخصیت", flex: 1.2 },
    {
      field: "complainant",
      headerName: "شاکی",
      flex: 1,
      cellClassName: () => "font-13",
    },
    {
      field: "referralNumber",
      headerName: "شماره ارجاع",
      flex: 1,
      cellClassName: () => "font-13",
    },
    {
      field: "referralDate",
      headerName: "تاریخ ارجاع",
      flex: 1,
      renderCell: ({ row }: { row: any }) => {
        if (!!row?.referralDate)
          return (
            <Typography variant="caption">
              {moment(new Date(row?.referralDate)).format("jYYYY/jMM/jDD")}
            </Typography>
          );
      },
    },

    {
      field: "referralName",
      headerName: "نام ارجاع دهنده",
      flex: 1,
      align: "center",
      cellClassName: () => "font-13",
    },
    {
      field: "disciplinaryCaseStage",
      headerName: "وضعیت پرونده",
      flex: 1.5,
      align: "center",
      renderCell: ({ row }: { row: any }) => {
        if (row?.disciplinaryCaseStage === "CASE_REVIEW")
          return <Chip label={"اولیه بدوی"} color="info" />;
        if (row?.disciplinaryCaseStage === "PRIMARY_MEETING_REQUESTED")
          return (
            <Chip
              label={"دعوتنامه"}
              icon={<Mail sx={{ fontSize: "1rem" }} fontSize="small" />}
            />
          );
        if (row?.disciplinaryCaseStage === "CASE_MINISTRY_CONFIRM")
          return (
            <Chip
              label={"در انتظار وزیر"}
              color="warning"
              // icon={<PendingActions sx={{ fontSize: "1rem" }} fontSize="small" />}
            />
          );
        if (row?.disciplinaryCaseStage === "PRIMARY_ORDER_DONE")
          return (
            <Chip
              label={"بدوی"}
              color="info"
              icon={<Gavel sx={{ fontSize: "1rem" }} fontSize="small" />}
            />
          );
        if (row?.disciplinaryCaseStage === "NOTIFIED")
          return (
            <Chip
              label={"ابلاغ"}
              color={row?.protestOverTime ? "error" : "secondary"}
              icon={
                <MarkEmailRead sx={{ fontSize: "1rem" }} fontSize="small" />
              }
            />
          );

        if (row?.disciplinaryCaseStage === "PROTEST_REVIEW")
          return (
            <Chip
              label={"اعتراض"}
              color="warning"
              icon={<PanTool sx={{ fontSize: "1rem" }} fontSize="small" />}
            />
          );
        if (row?.disciplinaryCaseStage === "PROTEST_ACCEPTED")
          return (
            <Chip
              // label={"تایید اعتراض"}
              label={"ارجاع‌به‌عالی"}
              color="success"
              icon={<GppGood sx={{ fontSize: "1rem" }} fontSize="small" />}
            />
          );
        if (row?.disciplinaryCaseStage === "FINAL")
          return (
            <Chip
              label={"قطعی بدوی"}
              color="secondary"
              icon={
                <Verified
                  color="secondary"
                  sx={{ fontSize: "1rem" }}
                  fontSize="small"
                />
              }
            />
          );
      },
    },
    {
      field: "noticeDate",
      headerName: "ابلاغ",
      flex: 1,
      align: "center",
      renderCell: ({ row }: { row: any }) => {
        if (row?.noticeDate) {
          const [date, time] = row?.noticeDateFr?.split(" ") ?? [null, null];
          return (
            <Box
              display={"flex"}
              flexDirection={"column"}
              alignItems={"center"}
            >
              <Verified color="secondary" />
              <Tooltip title={row?.noticeDateFr + " (تاریخ ابلاغ)"}>
                {/* <Tooltip title={moment(new Date(row?.noticeDate)).format("hh:mm jYYYY/jMM/jDD")}> */}
                <Typography variant="caption">
                  {/* {moment(new Date(row?.noticeDate)).format("hh:mm a jYYYY/jMM/jDD")} */}
                  {date?.replaceAll("-", "/") ?? null}
                </Typography>
              </Tooltip>
            </Box>
          );
        } else return <Close color="disabled" />;
      },
    },
    {
      field: "seenDate",
      headerName: "مشاهده شده",
      flex: 1,
      align: "center",
      renderCell: ({ row }: { row: any }) => {
        if (row?.seen) {
          const [date, time] = row?.seenDateFr?.split(" ") ?? [null, null];
          return (
            <Box
              display={"flex"}
              flexDirection={"column"}
              alignItems={"center"}
            >
              <DoneAll color="success" />
              {row?.seenDate && (
                <Tooltip title={row?.seenDateFr + " (تاریخ مشاهده)"}>
                  {/* <Tooltip
                    title={moment(new Date(row?.seenDate)).format(
                      "hh:mm jYYYY/jMM/jDD"
                    )}
                  > */}
                  <Typography variant="caption">
                    {/* {moment(new Date(row?.seenDate)).format("jYYYY/jMM/jDD")} */}
                    {date?.replaceAll("-", "/") ?? null}
                  </Typography>
                </Tooltip>
              )}
            </Box>
          );
        }

        return <Close color="disabled" />;
      },
    },
  ];
  useEffect(() => {
    if (
      StatesData?.content &&
      StatesData?.content?.[0].disciplinaryCaseSubjects
    ) {
      // فرض بر این است که دیتای سرور آرایه‌ای به نام relatedPersonnels دارد
      setSelectedItems(
        StatesData?.content?.[0].disciplinaryCaseSubjects.map((item: any) => ({
          ...item,
          subjectTitle: item?.disciplinaryBaseSubjectTitle,
          id: item?.subjectId ?? "",
        }))
      );
    }
    if (!!StatesData?.content?.[0]) {
      reset({
        ...StatesData?.content?.[0],
      });
    } else {
      // حالت جدید: مقادیر پیش‌فرض
      reset({});
    }
  }, [editeData, reset]);
  return (
    <Dialog
      open={addModalFlag}
      onClose={handleClose}
      maxWidth={"md"}
      PaperProps={{ sx: { overflow: "visible" } }}
      fullWidth
    >
      <DialogTitle>
        <Box display="flex" justifyContent="space-between" alignItems="center">
          <Box display="flex" textAlign="center" alignItems="center" gap={1}>
            {/* <MenuBook fontSize="large" /> */}
            <Gavel />
            <Typography variant="h6">حکم بدوی پرونده</Typography>
          </Box>
          <IconButton onClick={handleClose} size="small">
            <Close />
          </IconButton>
        </Box>
      </DialogTitle>

      <DialogContent
        // sx={editable ? { overflowx: "visible", overflowY: "auto" } : {}}
        sx={{ display: "flex", justifyContent: "center" }}
      >
        <Grid container justifyContent={"center"}>
          <Grid item md={11} sm={11} xs={12}>
            {StatesData_status === "success" ? (
              isMobile ? (
                <VerticalTable
                  rows={StatesData?.content}
                  columns={columns}
                  filters={filters}
                  setFilters={setFilters}
                  rowCount={StatesData?.totalElements}
                />
              ) : (
                <TavanaDataGrid
                  rows={StatesData?.content}
                  columns={columns}
                  filters={filters}
                  setFilters={setFilters}
                  rowCount={StatesData?.totalElements}
                  getRowHeight={() => "auto"}
                  autoHeight
                  hideToolbar
                />
              )
            ) : null}
          </Grid>
          <Grid item md={11}>
            <TicketDivider />
          </Grid>
          <Grid item md={11} pb={3}>
            <form>
              <Grid container spacing={3}>
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
                            onChange={(
                              e: React.ChangeEvent<HTMLInputElement>
                            ) => {
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
                <SubjectTable
                  // editable={editable&&!PDFList?.content?.length}
                  editeData={editeData}
                  editable={false}
                  selectedItems={selectedItems}
                  setSelectedItems={setSelectedItems}
                />
                {/* <Grid item md={12}><TicketDivider/></Grid> */}

                {/* <Grid container item md={12} justifyContent={"center"}>
              
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
            </Grid> */}
              </Grid>
            </form>
          </Grid>
        </Grid>
      </DialogContent>

      <DialogActions>
        <Grid item xs={12} display="flex" justifyContent="flex-end">
          <Button variant="outlined" onClick={handleClose} sx={{ mr: 2 }}>
            بازگشت
          </Button>
        </Grid>
      </DialogActions>
    </Dialog>
  );
};

export default DOCaseModal;
