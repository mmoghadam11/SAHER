import {
  BusinessCenter,
  Close,
  DoneAll,
  Gavel,
  HistoryEdu,
  MarkEmailRead,
  People,
  PictureAsPdf,
  Verified,
  Visibility,
} from "@mui/icons-material";
import { Box, Chip, Grid, Tooltip, Typography } from "@mui/material";
import { GridColDef } from "@mui/x-data-grid";
import { useMutation, useQuery } from "@tanstack/react-query";
import BackButton from "components/buttons/BackButton";
import TavanaDataGrid from "components/dataGrid/TavanaDataGrid";
import TableActions from "components/table/TableActions";
import { useAuth } from "hooks/useAuth";
import { useSnackbar } from "hooks/useSnackbar";
import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import paramsSerializer from "services/paramsSerializer";
import { PAGINATION_DEFAULT_VALUE } from "shared/paginationValue";
import ConfirmBox from "components/confirmBox/ConfirmBox";
import { FormItem } from "types/formItem";
import { useAuthorization } from "hooks/useAutorization";
import NewSearchPannel from "components/form/NewSearchPannel";
import { isMobile } from "react-device-detect";
import VerticalTable from "components/dataGrid/VerticalTable";
import AddDOCase from "domains/Institute/disciplinaryOrder/newVersion/AddDOCase";
import AddHMeeting from "domains/Institute/disciplinaryOrder/newVersion/highOrder/AddHMeeting";
import AddHOrder from "domains/Institute/disciplinaryOrder/newVersion/highOrder/AddHOrder";
import PrRequest from "domains/Institute/disciplinaryOrder/newVersion/protest/PrRequest";
import PrResponse from "domains/Institute/disciplinaryOrder/newVersion/protest/PrResponse";

type Props = {};

const AccountantAllHCases = (props: Props) => {
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
  const [protestResponseFlag, setProtestResponseFlag] = useState(false);
  const [pdfFlag, setPdfFlag] = useState(false);
  const [invitationFlag, setInvitationFlag] = useState(false);
  const [firstOrderFlag, setFirstOrderFlag] = useState(false);

  const [searchData, setSearchData] = useState({
    name: "",
    code: "",
  });
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
    accuserNationalCode: Auth?.userInfo?.nationalCode,
    // disciplinaryCaseId: Auth?.userInfo?.nationalCode,
  });
  const {
    data: StatesData,
    status: StatesData_status,
    refetch: StatesData_refetch,
  } = useQuery<any>({
    queryKey: [`disciplinary-supreme/search${paramsSerializer(filters)}`],
    queryFn: Auth?.getRequest,
    select: (res: any) => {
      return res?.data;
    },
    enabled: !!Auth.userInfo.nationalCode && !!filters?.accuserNationalCode,
  } as any);
  useEffect(() => {
    setFilters((prev: any) => ({
      ...prev,
      accuserNationalCode: Auth.userInfo.nationalCode,
    }));
  }, [Auth]);
  const columns: GridColDef[] = [
    // {
    //   field: "respondenType",
    //   headerName: "نوع شخصیت حسابرس",
    //   flex: 1.2,
    //   align: "center",
    //   renderCell: ({ row }: { row: any }) => {
    //     if (row?.primaryPersonalityName === "حسابدار رسمی")
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
    //     if (row?.primaryPersonalityName === "موسسه")
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
    // {
    //   field: "disciplinaryCaseAccuserName",
    //   headerName: "نام شخصیت",
    //   flex: 1.2,
    // },
    {
      field: "complainant",
      headerName: "شاکی",
      flex: 1,
      cellClassName: () => "font-13",
    },
    {
      field: "primaryOrderNumber",
      headerName: "شماره حکم",
      flex: 1,
      cellClassName: () => "font-13",
    },
    {
      field: "primaryOrderDateFr",
      headerName: "تاریخ حکم بدوی",
      flex: 1,
      renderCell: ({ row }: { row: any }) => {
        if (!!row?.primaryOrderDateFr) {
          const [date, time] = row?.primaryOrderDateFr?.split(" ") ?? [
            null,
            null,
          ];
          return (
            <Tooltip title={row?.primaryOrderDateFr + " (تاریخ حکم بدوی)"}>
              <Typography variant="caption">
                {/* {moment(new Date(row?.notificationDate)).format(
                                    "jYYYY/jMM/jDD"
                                  )} */}
                {date?.replaceAll("-", "/") ?? row?.primaryOrderDateFr}
              </Typography>
            </Tooltip>
          );
        }
      },
    },
    {
      field: "processStage",
      headerName: "وضعیت پرونده",
      flex: 1.5,
      align: "center",
      renderCell: ({ row }: { row: any }) => {
        if (row?.processStage === "SUPREME_CREATED")
          return <Chip label={"اولیه عالی"} color="info" />;
        if (row?.processStage === "SUPREME_METTING_REQUEST")
          return (
            <Chip label={"دعوتنامه"} icon={<HistoryEdu fontSize="small" />} />
          );
        if (row?.processStage === "SUPREME_MINISTRY_CONFIRM")
          return (
            <Chip
              label={"در انتظار وزیر"}
              color="warning"
              // icon={<Gavel fontSize="small" />}
            />
          );
        if (row?.processStage === "SUPREME_DONE")
          return (
            <Chip
              label={"عالی"}
              color="info"
              icon={<Gavel fontSize="small" />}
            />
          );

        if (row?.processStage === "NOTIFIED")
          return (
            <Chip
              sx={{ fontSize: ".75rem" }}
              label={"مهلت قانونی"}
              color="secondary"
              icon={<MarkEmailRead fontSize="small" />}
            />
          );
        if (
          row?.processStage === "FINAL" ||
          row?.processStage === "SUPREME_FINAL"
        )
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
      field: "notificationStatus",
      headerName: "ابلاغ",
      flex: 0.5,
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
    //     if (row?.seenDateFr) {
    //       const [date, time] = row?.seenDateFr?.split(" ") ?? [null, null];
    //       return (
    //         <Box
    //           display={"flex"}
    //           flexDirection={"column"}
    //           alignItems={"center"}
    //         >
    //           <DoneAll color="success" />
    //           {row?.seenDate && (
    //             <Tooltip title={row?.seenDateFr + " (تاریخ مشاهده)"}>
    //             {/* <Tooltip
    //               title={moment(new Date(row?.seenDate)).format(
    //                 "hh:mm jYYYY/jMM/jDD"
    //               )}
    //             > */}
    //               <Typography variant="caption">
    //                 {/* {moment(new Date(row?.seenDate)).format("jYYYY/jMM/jDD")} */}
    //                 {date?.replaceAll("-", "/") ?? null}
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
        if (row?.processStage === "SUPREME_CREATED")
          return (
            <TableActions
            // onEdit={() => {
            //   setEditable(true);
            //   setEditeData(row);
            //   setAddModalFlag(true);
            // }}
            // onView={() => {
            //   setEditable(false);
            //   setEditeData(row);
            //   setAddModalFlag(true);
            // }}
            // onAdd={{
            //   function: () => {
            //     setEditable(true);
            //     setCaseData(row);
            //     setInvitationFlag(true);
            //   },
            //   title: "ثبت دعوتنامه",
            //   icon: (
            //     <HistoryEdu
            //       color={row.hasAttachment ? "success" : "primary"}
            //     />
            //   ),
            // }}
            />
          );
        else if (row?.processStage === "SUPREME_METTING_REQUEST")
          return (
            <TableActions
            // onManage={{
            //   function: () => {
            //     setEditable(true);
            //     setFirstOrderData(row);
            //     setFirstOrderFlag(true);
            //   },
            //   title: "ثبت حکم عالی",
            //   icon: (
            //     // <Badge badgeContent={1} color="primary">
            //     <Gavel color={"primary"} />
            //     // </Badge>
            //   ),
            // }}
            // onAdd={{
            //   function: () => {
            //     setEditable(false);
            //     setCaseData(row);
            //     setInvitationFlag(true);
            //   },
            //   title: "مشاهده دعوتنامه",
            //   icon: (
            //     <HistoryEdu
            //       color={row.hasAttachment ? "success" : "primary"}
            //     />
            //   ),
            // }}
            />
          );
        else if (row?.processStage === "SUPREME_DONE")
          return (
            <TableActions
            // onManage={{
            //   function: () => {
            //     setEditable(false);
            //     setFirstOrderData(row);
            //     setFirstOrderFlag(true);
            //   },
            //   title: "مشاهده حکم عالی",
            //   icon: (
            //     // <Badge badgeContent={1} color="primary">
            //     <Gavel color={"primary"} />
            //     // </Badge>
            //   ),
            // }}
            />
          );
        else if (row?.processStage === "NOTIFIED")
          return (
            <TableActions
              onManage={{
                function: () => {
                  setEditable(false);
                  setFirstOrderData(row);
                  setFirstOrderFlag(true);
                },
                title: "مشاهده حکم عالی",
                icon: (
                  // <Badge badgeContent={1} color="primary">
                  <Visibility color={"primary"} />
                  // </Badge>
                ),
              }}
            />
          );
        else if (
          row?.processStage === "FINAL" ||
          row?.processStage === "SUPREME_FINAL"
        )
          return (
            <TableActions
              // onView={() => {
              //   setEditable(false);
              //   setEditeData(row);
              //   setAddModalFlag(true);
              // }}
              onManage={{
                function: () => {
                  setEditable(false);
                  setFirstOrderData(row);
                  setFirstOrderFlag(true);
                },
                title: "مشاهده حکم عالی",
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

  const searchItems: FormItem[] = [
    {
      name: "accuserName",
      inputType: "text",
      label: "شخصیت",
      size: { md: 4 },
    },
    {
      name: "referralNumber",
      inputType: "text",
      label: "شماره ارجاع",
      size: { md: 4 },
    },
    {
      name: "objectionTimeOver",
      inputType: "select",
      label: "مهلت اعتراض",
      size: { md: 4 },
      options: [
        { value: "true", title: "گذشته" },
        { value: "false", title: "نگذشته" },
      ],
    },
  ];
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
  return (
    <Grid container justifyContent="center">
      <Grid py={2} item md={11} sm={11} xs={12}>
        <Box display={"flex"} alignItems={"center"} gap={1}>
          <Gavel fontSize="medium" />
          <Typography variant="body1" fontWeight={"bold"}>
            پرونده‌های انتظامی عالی حسابدار رسمی
          </Typography>
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
              // getRowHeight={() => "auto"}
              autoHeight
              hideToolbar
            />
          )
        ) : null}
      </Grid>
      {/* {editeData && ( */}
      <AddDOCase
        editable={false}
        refetch={StatesData_refetch}
        addModalFlag={addModalFlag}
        setAddModalFlag={setAddModalFlag}
        editeData={editeData}
        setEditeData={setEditeData}
      />
      {invitationFlag && (
        <AddHMeeting
          refetch={StatesData_refetch}
          editeData={caseData}
          setEditeData={setCaseData}
          editable={false}
          addModalFlag={invitationFlag}
          setAddModalFlag={setInvitationFlag}
        />
      )}
      {firstOrderData && (
        <AddHOrder
          refetch={StatesData_refetch}
          editeData={firstOrderData}
          setEditeData={setFirstOrderData}
          editable={false}
          addModalFlag={firstOrderFlag}
          setAddModalFlag={setFirstOrderFlag}
        />
      )}
      {editeData && (
        <PrRequest
          refetch={StatesData_refetch}
          editeData={editeData}
          setEditeData={setEditeData}
          editable={false}
          addModalFlag={protestRequestFlag}
          setAddModalFlag={setProtestRequestFlag}
        />
      )}
      {editeData && (
        <PrResponse
          refetch={StatesData_refetch}
          editeData={editeData}
          setEditeData={setEditeData}
          editable={false}
          addModalFlag={protestResponseFlag}
          setAddModalFlag={setProtestResponseFlag}
        />
      )}
    </Grid>
  );
};

export default AccountantAllHCases;
