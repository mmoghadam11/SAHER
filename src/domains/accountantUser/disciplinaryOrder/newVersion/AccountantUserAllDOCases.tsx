import {
  BusinessCenter,
  ChromeReaderModeRounded,
  Close,
  DoneAll,
  FileDownload,
  Gavel,
  GppBad,
  GppGood,
  HistoryEdu,
  MarkEmailRead,
  PanTool,
  People,
  PictureAsPdf,
  ReceiptLong,
  Verified,
  Visibility,
} from "@mui/icons-material";
import {
  Badge,
  Box,
  Button,
  Chip,
  Grid,
  List,
  ListItem,
  ListItemText,
  Paper,
  Tooltip,
  Typography,
} from "@mui/material";
import { GridColDef } from "@mui/x-data-grid";
import { useMutation, useQuery } from "@tanstack/react-query";
import BackButton from "components/buttons/BackButton";
import CreateNewItem from "components/buttons/CreateNewItem";
import TavanaDataGrid from "components/dataGrid/TavanaDataGrid";
import TableActions from "components/table/TableActions";
import { useAuth } from "hooks/useAuth";
import { useSnackbar } from "hooks/useSnackbar";
import React, { useEffect, useMemo, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import paramsSerializer from "services/paramsSerializer";
import { PAGINATION_DEFAULT_VALUE } from "shared/paginationValue";
import ConfirmBox from "components/confirmBox/ConfirmBox";
import { FormItem } from "types/formItem";
import moment from "jalali-moment";
import { useAuthorization } from "hooks/useAutorization";
import NewSearchPannel from "components/form/NewSearchPannel";
import { isMobile } from "react-device-detect";
import VerticalTable from "components/dataGrid/VerticalTable";
import PrRequest from "domains/Institute/disciplinaryOrder/newVersion/protest/PrRequest";
import PrResponse from "domains/Institute/disciplinaryOrder/newVersion/protest/PrResponse";
import AddDOCase from "domains/Institute/disciplinaryOrder/newVersion/AddDOCase";
import AddMeeting from "domains/Institute/disciplinaryOrder/newVersion/AddMeeting";
import AddFirstStepOrder from "domains/Institute/disciplinaryOrder/newVersion/AddFirstStepOrder";
import RenderFormDisplay from "components/render/formInputs/RenderFormDisplay";
import AccountantAllHCases from "../details/AccountantAllHCases";

type Props = {};

const AccountantUserAllDOCases = (props: Props) => {
  const Auth = useAuth();
  const authFunctions = useAuthorization();
  const snackbar = useSnackbar();
  const navigate = useNavigate();
  const [editeData, setEditeData] = useState<editeObjectType | null>(null);
  const [basePDFData, setBasePDFData] = useState<any>(null);
  const [caseData, setCaseData] = useState<any>(null);
  const [firstOrderData, setFirstOrderData] = useState<any>(null);
  const [editable, setEditable] = useState<boolean>(
    authFunctions?.hasPermission("disciplinary-order-edit"),
  );
  const [addModalFlag, setAddModalFlag] = useState(false);
  const [protestRequestFlag, setProtestRequestFlag] = useState(false);
  const [pdfFlag, setPdfFlag] = useState(false);
  const [invitationFlag, setInvitationFlag] = useState(false);
  const [firstOrderFlag, setFirstOrderFlag] = useState(false);
  const [protestResponseFlag, setProtestResponseFlag] = useState(false);
  const [deleteData, setDeleteData] = useState<any>(null);
  const [deleteFlag, setDeleteFlag] = useState(false);

  useEffect(() => {
    console.log("firstOrderData", firstOrderData);
  }, [firstOrderData]);

  const { isLoading, mutate, error } = useMutation({
    mutationFn: Auth?.serverCall,
  });
  const { isLoading: Download_isLoading, mutate: Download_mutate } =
    useMutation({
      mutationFn: Auth?.serverCallGetFile,
    });
  function getExcel() {
    Download_mutate(
      {
        entity: `disciplinary-order/export`,
        method: "get",
      },
      {
        onSuccess: (res: any) => {
          if (res && res instanceof Blob) {
            const url = URL.createObjectURL(res);
            const a = document.createElement("a");
            a.href = url;
            a.download = "گزارش_احکام_انتظامی.xlsx";
            a.click();
            URL.revokeObjectURL(url);
          }
          snackbar(`فایل اکسل با موفقیت دانلود شد`, "success");
        },
        onError: () => {
          snackbar("خطا در دریافت اکسل ", "error");
        },
      },
    );
  }
  const {
    handleSubmit,
    formState: { errors },
    control,
  } = useForm();
  const [filters, setFilters] = useState<any>({
    ...PAGINATION_DEFAULT_VALUE,
    name: "",
    accuserNationalCode: Auth?.userInfo?.nationalCode,
  });
  const [supremeFilters, setSupremeFilters] = useState<any>({
    ...PAGINATION_DEFAULT_VALUE,
    accuserNationalCode: Auth?.userInfo?.nationalCode,
    // disciplinaryCaseId: Auth?.userInfo?.nationalCode,
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
    enabled: !!Auth?.userInfo?.nationalCode && !!filters?.accuserNationalCode,
  } as any);
  // const {
  //   data: supremeData,
  //   status: supremeData_status,
  //   refetch: supremeData_refetch,
  // } = useQuery<any>({
  //   queryKey: [
  //     `disciplinary-supreme/search${paramsSerializer(supremeFilters)}`,
  //   ],
  //   queryFn: Auth?.getRequest,
  //   select: (res: any) => {
  //     return res?.data;
  //   },
  //   enabled: !!Auth?.userInfo?.nationalCode && !!supremeFilters?.accuserNationalCode,
  // } as any);
  useEffect(() => {
    setFilters((prev: any) => ({
      ...prev,
      accuserNationalCode: Auth.userInfo.nationalCode,
    }));
    setSupremeFilters((prev: any) => ({
      ...prev,
      accuserNationalCode: Auth.userInfo.nationalCode,
    }));
  }, [Auth]);
  useEffect(() => {
    console.log("filters", filters);
  }, [filters]);
  const columns: GridColDef[] = [
    // {
    //   field: "respondenType",
    //   headerName: "نوع شخصیت حسابرس",
    //   flex: 1.2,
    //   align: "center",
    //   renderCell: ({ row }: { row: any }) => {
    //     if (row?.cdPersonalityId === 397)
    //       return (
    //         <Tooltip title="حسابدار رسمی">
    //           <Chip
    //             size="small"
    //             label="حسابدار رسمی"
    //             icon={<People fontSize="small" />}
    //             color="info"
    //           />
    //         </Tooltip>
    //       );
    //     if (row?.cdPersonalityId === 396)
    //       return (
    //         <Tooltip title="موسسه">
    //           <Chip
    //             size="small"
    //             label="موسسه"
    //             icon={<BusinessCenter fontSize="small" />}
    //             color="warning"
    //           />
    //         </Tooltip>
    //       );
    //   },
    // },
    // { field: "accuserName", headerName: "نام شخصیت", flex: 1.2 },
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
              icon={<HistoryEdu sx={{ fontSize: "1rem" }} fontSize="small" />}
            />
          );
        if (row?.disciplinaryCaseStage === "CASE_MINISTRY_CONFIRM")
          return (
            <Chip
              label={"در انتظار وزیر"}
              color="warning"
              // icon={<Gavel sx={{ fontSize: "1rem" }} fontSize="small" />}
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
              color="secondary"
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
              label={"ارجاع به عالی"}
              color="success"
              icon={<GppGood sx={{ fontSize: "1rem" }} fontSize="small" />}
            />
          );
        if (row?.disciplinaryCaseStage === "PROTEST_REJECTED")
          return (
            <Chip
              label={"رد"}
              color="error"
              icon={<GppBad sx={{ fontSize: "1rem" }} fontSize="small" />}
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
        if (row?.disciplinaryCaseStage === "SUPREME_CREATED")
          return <Chip label={"اولیه عالی"} color="info" />;
        if (row?.disciplinaryCaseStage === "SUPREME_METTING_REQUEST")
          return (
            <Chip
              label={"دعوتنامه عالی"}
              icon={<HistoryEdu fontSize="small" />}
            />
          );
        if (row?.disciplinaryCaseStage === "SUPREME_MINISTRY_CONFIRM")
          return (
            <Chip
              label={"در انتظار وزیر عالی"}
              color="warning"
              icon={<Gavel fontSize="small" />}
            />
          );
        if (row?.disciplinaryCaseStage === "SUPREME_DONE")
          return (
            <Chip
              label={"حکم عالی"}
              color="info"
              icon={<Gavel fontSize="small" />}
            />
          );
        if (row?.disciplinaryCaseStage === "SUPREME_NOTIFIED")
          return (
            <Chip
              label={"ابلاغ عالی"}
              color="secondary"
              icon={<MarkEmailRead fontSize="small" />}
            />
          );
        if (row?.disciplinaryCaseStage === "SUPREME_FINAL")
          return (
            <Chip
              label={"قطعی عالی"}
              color="secondary"
              icon={<Verified color="secondary" fontSize="small" />}
            />
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
      field: "notificationStatus",
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
              <Tooltip title={row?.noticeDateFr}>
                <Typography variant="caption">
                  {/* {moment(new Date(row?.noticeDate)).format("jYYYY/jMM/jDD")} */}
                  {date?.replaceAll("-", "/") ?? null}
                </Typography>
              </Tooltip>
            </Box>
          );
        } else return <Close color="disabled" />;
      },
    },
    // {
    //   field: "seen",
    //   headerName: "مشاهده شده",
    //   flex: 1,
    //   align: "center",
    //   renderCell: ({ row }: { row: any }) => {
    //     if (row?.seen) {
    //       const [date, time] = row?.seenDateFr?.split(" ") ?? [null, null];
    //       return (
    //         <Box
    //           display={"flex"}
    //           flexDirection={"column"}
    //           alignItems={"center"}
    //         >
    //           <DoneAll color="success" />
    //           {row?.seenDate && (
    //             <Tooltip
    //               title={moment(new Date(row?.seenDate)).format(
    //                 "HH:mm jYYYY/jMM/jDD"
    //               )}
    //             >
    //               {/* <Tooltip title={row?.seenDateFr + " (تاریخ مشاهده)"}> */}
    //               <Typography variant="caption">
    //                 {moment(new Date(row?.seenDate)).format("jYYYY/jMM/jDD")}
    //                 {/* {date?.replaceAll("-", "/") ?? null} */}
    //               </Typography>
    //             </Tooltip>
    //           )}
    //         </Box>
    //       );
    //     }

    //     return <Close color="disabled" />;
    //   },
    // },
    {
      headerName: "عملیات",
      field: "action",
      flex: 1.1,
      headerAlign: "center",
      align: "center",
      renderCell: ({ row }: { row: any }) => {
        if (row?.disciplinaryCaseStage === "CASE_REVIEW")
          return (
            <TableActions
            // onView={() => {
            //   setEditable(false);
            //   setEditeData(row);
            //   setAddModalFlag(true);
            // }}
            />
          );
        else if (row?.disciplinaryCaseStage === "PRIMARY_MEETING_REQUESTED")
          return (
            <TableActions
            // onAdd={{
            //   function: () => {
            //     setEditable(false);
            //     setCaseData(row);
            //     setInvitationFlag(true);
            //   },
            //   title: "دعوتنامه",
            //   icon: (
            //     <HistoryEdu
            //       color={row.hasAttachment ? "success" : "primary"}
            //     />
            //   ),
            // }}
            // onView={() => {
            //   setEditable(false);
            //   setEditeData(row);
            //   setAddModalFlag(true);
            // }}
            />
          );
        else if (row?.disciplinaryCaseStage === "PRIMARY_ORDER_DONE")
          return (
            <TableActions
            // onManage={{
            //   function: () => {
            //     setEditable(false);
            //     setFirstOrderData(row);
            //     setFirstOrderFlag(true);
            //   },
            //   title: "حکم بدوی",
            //   icon: (
            //     // <Badge badgeContent={1} color="primary">
            //     <Gavel color={"primary"} />
            //     // </Badge>
            //   ),
            // }}
            />
          );
        else if (row?.disciplinaryCaseStage === "NOTIFIED")
          return (
            <TableActions
              onManage={{
                function: () => {
                  setEditable(false);
                  setFirstOrderData(row);
                  setFirstOrderFlag(true);
                },
                title: "حکم بدوی",
                icon: (
                  // <Badge badgeContent={1} color="primary">
                  <Visibility color={"primary"} />
                  // </Badge>
                ),
              }}
            />
          );
        else if (row?.disciplinaryCaseStage === "PROTEST_REVIEW")
          return (
            <TableActions
            // onManage={{
            //   function: () => {
            //     setEditable(false);
            //     setEditeData(row);
            //     setProtestRequestFlag(true);
            //   },
            //   title: "اعتراض به حکم بدوی",
            //   icon: (
            //     // <Badge badgeContent={1} color="primary">
            //     <PanTool color={"primary"} fontSize="small" />
            //     // </Badge>
            //   ),
            // }}
            />
          );
        else if (row?.disciplinaryCaseStage === "PROTEST_ACCEPTED")
          return (
            <TableActions
              onAdd={{
                function: () => {
                  setEditeData(row);
                  setProtestResponseFlag(true);
                  setEditable(false);
                },
                title: "مشاهده پاسخ اعتراض",
                icon: (
                  // <Badge badgeContent={1} color="primary">
                  <ChromeReaderModeRounded color={"primary"} fontSize="small" />
                  // </Badge>
                ),
              }}
              onManage={{
                function: () => {
                  setEditable(false);
                  setFirstOrderData(row);
                  setFirstOrderFlag(true);
                },
                title: "حکم بدوی",
                icon: (
                  // <Badge badgeContent={1} color="primary">
                  <Visibility color={"primary"} />
                  // </Badge>
                ),
              }}
            />
          );
        // else if (row?.disciplinaryCaseStage === "FINAL")
        else 
          return (
            <TableActions
              onManage={{
                function: () => {
                  setEditable(false);
                  setFirstOrderData(row);
                  setFirstOrderFlag(true);
                },
                title: "حکم بدوی",
                icon: (
                  // <Badge badgeContent={1} color="primary">
                  <Visibility color={"primary"} />
                  // </Badge>
                ),
              }}
            />
          );
      },
    },
  ];

  interface SearchData {
    name: string;
    code: string;
  }
  const {
    data: orderTypeOptions,
    status: orderTypeOptions_status,
    refetch: orderTypeOptions_refetch,
  } = useQuery<any>({
    queryKey: [`common-data/find-by-type-all?typeId=47`],
    queryFn: Auth?.getRequest,
    select: (res: any) => {
      return res?.data;
    },
    enabled: true,
  } as any);
  const {
    data: workgroupOptions,
    status: workgroupOptions_status,
    refetch: workgroupOptions_refetch,
  } = useQuery<any>({
    queryKey: [`workgroup/search-all`],
    queryFn: Auth?.getRequest,
    select: (res: any) => {
      return res?.data;
    },
    enabled: true,
  } as any);

  type editeObjectType = {
    id: number;
    value: string;
    key: string;
    typeId: number;
    typeName: string;
  };

  useEffect(() => {
    console.log(filters);
  }, [filters]);

  function searching() {
    mutate(
      {
        entity: `/api/v1/common-data/search`,
        method: "post",
        //   data:
      },
      {
        onSuccess: (res: any) => {
          if (res?.status == 200 && res?.data) {
            snackbar(
              "واحد های انتخابی با موفقیت به لیست شما افزوده شد.",
              "success",
            );
            // navigate('/unitselection', { state: {from: "add-unit", noBack: noBack} })
          } else snackbar("خطا در افزودن واحد ها به لیست", "error");
        },
        onError: (err) => {
          snackbar("خطا در افزودن واحد ها به لیست", "error");
        },
      },
    );
  }
  const { reset, getValues } = useForm<any>();
  useEffect(() => {
    reset(Auth.userInfo);
  }, [Auth.userInfo]);
  const formItems = useMemo(
    () => [
      {
        name: "firstName",
        inputType: "text",
        label: "نام",
        size: { md: 4 },
        elementProps: {
          disabled: true,
        },
      },
      {
        name: "lastName",
        inputType: "text",
        label: "نام خانوادگی",
        size: { md: 4 },
        elementProps: {
          disabled: true,
        },
      },
      {
        name: "nationalCode",
        inputType: "text",
        label: "کد ملی",
        size: { md: 4 },
        elementProps: {
          disabled: true,
        },
      },
    ],
    [getValues, Auth.userInfo],
  );
  return (
    <Grid container justifyContent="center">
      <Grid
        item
        md={11}
        sm={11}
        xs={12}
        display={"flex"}
        justifyContent={"space-between"}
        mb={1}
      >
        <Grid item display={"flex"}>
          <ReceiptLong fontSize={isMobile ? "medium" : "large"} />
          <Typography variant={isMobile ? "body1" : "h5"}>
            احکام انتظامی{" "}
            {Auth?.userInfo?.firstName + " " + Auth?.userInfo?.lastName}
          </Typography>
        </Grid>
        <Grid item display={"flex"}>
          <BackButton onBack={() => navigate(-1)} />
        </Grid>
      </Grid>
      <Grid item md={11}>
        <Paper sx={{ width: "100%", p: 5 }}>
          <Grid item container md={12} spacing={2}>
            <Grid item md={12}>
              <Typography variant="h6">اطلاعات کلی حسابدار رسمی</Typography>
            </Grid>
            {formItems?.map((item) => (
              <Grid item xs={12} md={item.size.md} key={item.name}>
                <Controller
                  name={item.name}
                  control={control}
                  render={({ field }) => (
                    // <RenderFormInput
                    //   controllerField={field}
                    //   errors={errors}
                    //   {...item}
                    //   {...field}
                    //   onChange={(e: any) => {
                    //     // if (!isNaN(e.target.value))
                    //     setValue(item.name, e.target.value);
                    //   }}
                    //   value={getValues()[item.name] ?? ""}
                    // />
                    <RenderFormDisplay
                      item={item}
                      value={getValues()[item.name] ?? ""}
                    />
                  )}
                />
              </Grid>
            ))}
          </Grid>
        </Paper>
      </Grid>
      <Grid
        item
        md={11}
        sm={11}
        xs={12}
        display={"flex"}
        justifyContent={"space-between"}
        m={2}
        mt={4}
      >
        <Box display={"flex"} alignItems={"center"} gap={1}>
          <Gavel fontSize="medium" />
          <Typography variant="body1" fontWeight={"bold"}>
            پرونده‌های انتظامی بدوی حسابدار رسمی
          </Typography>
        </Box>
        <Box display={"flex"} justifyContent={"space-between"} gap={1}>
          {/* <BackButton onBack={() => navigate(-1)} /> */}
        </Box>
      </Grid>
      {/* {StatesData_status === "success" && (
        <Grid item md={11} sm={11} xs={12}>
          <Button
            variant="outlined"
            // size="small"
            color="success"
            endIcon={<FileDownload />}
            onClick={getExcel}
          >
            دریافت خروجی اکسل
          </Button>
        </Grid>
      )} */}
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
      <AccountantAllHCases />
      <AddDOCase
        editable={editable}
        refetch={StatesData_refetch}
        addModalFlag={addModalFlag}
        setAddModalFlag={setAddModalFlag}
        editeData={editeData}
        setEditeData={setEditeData}
      />
      {/* )} */}
      {/* {pdfFlag && (
        <UploadPdfDialog
          refetch={StatesData_refetch}
          entityId={basePDFData?.id ?? ""}
          notificationStatus={basePDFData?.notificationStatus ?? null}
          onClose={() => {
            setPdfFlag(false);
          }}
          open={pdfFlag}
        />
      )} */}
      {invitationFlag && (
        <AddMeeting
          refetch={StatesData_refetch}
          editeData={caseData}
          setEditeData={setCaseData}
          editable={editable}
          addModalFlag={invitationFlag}
          setAddModalFlag={setInvitationFlag}
        />
      )}
      {firstOrderData && (
        <AddFirstStepOrder
          refetch={StatesData_refetch}
          editeData={firstOrderData}
          setEditeData={setFirstOrderData}
          editable={editable}
          addModalFlag={firstOrderFlag}
          setAddModalFlag={setFirstOrderFlag}
        />
      )}
      {editeData && (
        <PrRequest
          refetch={StatesData_refetch}
          editeData={editeData}
          setEditeData={setEditeData}
          editable={editable}
          addModalFlag={protestRequestFlag}
          setAddModalFlag={setProtestRequestFlag}
        />
      )}
      {editeData && (
        <PrResponse
          refetch={StatesData_refetch}
          editeData={editeData}
          setEditeData={setEditeData}
          editable={editable}
          addModalFlag={protestResponseFlag}
          setAddModalFlag={setProtestResponseFlag}
        />
      )}
    </Grid>
  );
};

export default AccountantUserAllDOCases;
