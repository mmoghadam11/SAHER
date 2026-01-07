import {
  ChromeReaderModeRounded,
  Close,
  Gavel,
  GppBad,
  GppGood,
  HistoryEdu,
  MarkEmailRead,
  PanTool,
  PictureAsPdf,
  Verified,
  Visibility,
} from "@mui/icons-material";
import {
  Box,
  Chip,
  Grid,
  Tooltip,
  Typography,
} from "@mui/material";
import { GridColDef } from "@mui/x-data-grid";
import { useMutation, useQuery } from "@tanstack/react-query";
import TavanaDataGrid from "components/dataGrid/TavanaDataGrid";
import TableActions from "components/table/TableActions";
import { useAuth } from "hooks/useAuth";
import { useSnackbar } from "hooks/useSnackbar";
import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import paramsSerializer from "services/paramsSerializer";
import moment from "jalali-moment";
import { useAuthorization } from "hooks/useAutorization";
import { isMobile } from "react-device-detect";
import VerticalTable from "components/dataGrid/VerticalTable";
import PrRequest from "domains/Institute/disciplinaryOrder/newVersion/protest/PrRequest";
import PrResponse from "domains/Institute/disciplinaryOrder/newVersion/protest/PrResponse";
import AddDOCase from "domains/Institute/disciplinaryOrder/newVersion/AddDOCase";
import AddMeeting from "domains/Institute/disciplinaryOrder/newVersion/AddMeeting";
import AddFirstStepOrder from "domains/Institute/disciplinaryOrder/newVersion/AddFirstStepOrder";

type Props = {
    filters:any;
    setFilters:any;
};

const Pcases = ({filters,setFilters}: Props) => {
  const Auth = useAuth();
  const authFunctions = useAuthorization();
  const snackbar = useSnackbar();
  const navigate = useNavigate();
  const [editeData, setEditeData] = useState<editeObjectType | null>(null);
  const [basePDFData, setBasePDFData] = useState<any>(null);
  const [caseData, setCaseData] = useState<any>(null);
  const [firstOrderData, setFirstOrderData] = useState<any>(null);
  const [editable, setEditable] = useState<boolean>(
    authFunctions?.hasPermission("disciplinary-order-edit")
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
      }
    );
  }
  const {
    handleSubmit,
    formState: { errors },
    control,
  } = useForm();

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
    enabled: !!Auth?.userInfo?.nationalCode && !!filters?.auditingFirmId,
  } as any);
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
          const [date, time] = row?.noticeDateFr?.split(" ") ?? [
            null,
            null,
          ];
          return (
            <Box
              display={"flex"}
              flexDirection={"column"}
              alignItems={"center"}
            >
              <Verified color="secondary" />
              <Tooltip title={row?.noticeDateFr }>
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
        if (authFunctions?.hasPermission("disciplinary-order-edit")) {
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
                //     <Visibility color={"primary"} />
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
                    <ChromeReaderModeRounded
                      color={"primary"}
                      fontSize="small"
                    />
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
          else if (row?.disciplinaryCaseStage === "FINAL")
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
        } else if (authFunctions?.hasPermission("supervisor-pdf"))
          return (
            <TableActions
              onView={() => {
                setEditeData(row);
                setAddModalFlag(true);
              }}
              onAdd={{
                function: () => {
                  setBasePDFData(row);
                  setPdfFlag(true);
                },
                title: "پی دی اف",
                icon: (
                  <PictureAsPdf
                    color={row.hasAttachment ? "success" : "primary"}
                  />
                ),
              }}
            />
          );
        else
          return (
            <TableActions
              onView={() => {
                setEditeData(row);
                setAddModalFlag(true);
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
              "success"
            );
            // navigate('/unitselection', { state: {from: "add-unit", noBack: noBack} })
          } else snackbar("خطا در افزودن واحد ها به لیست", "error");
        },
        onError: (err) => {
          snackbar("خطا در افزودن واحد ها به لیست", "error");
        },
      }
    );
  }
  const { reset, getValues } = useForm<any>();
  useEffect(() => {
    reset(Auth.userInfo);
  }, [Auth.userInfo]);

  return (
    <Grid item md={12} container justifyContent="center">

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
          <Typography variant="body1" fontWeight={"bold"}>پرونده‌های انتظامی بدوی موسسه</Typography>
        </Box>
        <Box display={"flex"} justifyContent={"space-between"} gap={1}>
        </Box>
      </Grid>

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

export default Pcases;
