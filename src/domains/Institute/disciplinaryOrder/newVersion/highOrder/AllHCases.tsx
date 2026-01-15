import {
  AutoStories,
  BusinessCenter,
  CheckCircle,
  Close,
  DoneAll,
  FileDownload,
  Gavel,
  HistoryEdu,
  MarkEmailRead,
  MenuBook,
  People,
  PictureAsPdf,
  Verified,
  Visibility,
} from "@mui/icons-material";
import { Box, Button, Chip, Grid, Tooltip, Typography } from "@mui/material";
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
import AddDOCase from "../AddDOCase";
import PrRequest from "../protest/PrRequest";
import PrResponse from "../protest/PrResponse";
import AddHMeeting from "./AddHMeeting";
import AddHOrder from "./AddHOrder";
import Logs from "../components/Logs";
import DOCaseModal from "./DOCaseModal";

type Props = {};

const AllHCases = (props: Props) => {
  const Auth = useAuth();
  const authFunctions = useAuthorization();
  const snackbar = useSnackbar();
  const navigate = useNavigate();
  const [editeData, setEditeData] = useState<editeObjectType | null>(null);
  const [basePDFData, setBasePDFData] = useState<any>(null);
  const [caseData, setCaseData] = useState<any>(null);
  const [firstOrderData, setFirstOrderData] = useState<any>(null);
  const [logFlag, setLogFlag] = useState<boolean>(false);
  const [DOCaseModalFlag, setDOCaseModalFlag] = useState<boolean>(false);

  const [editable, setEditable] = useState<boolean>(
    authFunctions?.hasPermission("disciplinary-order-edit")
  );
  const [addModalFlag, setAddModalFlag] = useState(false);
  const [protestRequestFlag, setProtestRequestFlag] = useState(false);
  const [protestResponseFlag, setProtestResponseFlag] = useState(false);
  const [pdfFlag, setPdfFlag] = useState(false);
  const [invitationFlag, setInvitationFlag] = useState(false);
  const [firstOrderFlag, setFirstOrderFlag] = useState(false);
  const [deleteData, setDeleteData] = useState<any>(null);
  const [deleteFlag, setDeleteFlag] = useState(false);
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
        entity: `disciplinary-supreme/export`,
        method: "get",
      },
      {
        onSuccess: (res: any) => {
          if (res && res instanceof Blob) {
            const url = URL.createObjectURL(res);
            const a = document.createElement("a");
            a.href = url;
            a.download = "گزارش_احکام_انتظامی_عالی.xlsx";
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
  const [filters, setFilters] = useState<any>({
    ...PAGINATION_DEFAULT_VALUE,
    name: "",
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
    enabled: true,
  } as any);
  const columns: GridColDef[] = [
    {
      field: "respondenType",
      headerName: "نوع شخصیت حسابرس",
      flex: 1.2,
      align: "center",
      renderCell: ({ row }: { row: any }) => {
        if (row?.primaryPersonalityName === "حسابدار رسمی")
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
        if (row?.primaryPersonalityName === "موسسه")
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
    // {
    //   field: "primaryPersonalityName",
    //   headerName: "نوع شخصیت حسابرس",
    //   flex: 1.2,
    //   align: "center",
    // },
    {
      field: "disciplinaryCaseAccuserName",
      headerName: "نام شخصیت",
      flex: 1.2,
    },
    {
      field: "complainant",
      headerName: "شاکی",
      flex: 1,
      cellClassName: () => "font-13",
    },
    {
      field: "primaryOrderNumber",
      headerName: "شماره حکم بدوی",
      flex: 1.2,
      cellClassName: () => "font-13",
    },
    {
      field: "orderNumber",
      headerName: "شماره حکم عالی ",
      flex: 1.2,
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
        if (row?.processStage === "CASE_MINISTRY_CONFIRM")
          return (
            <Chip
              label={"در انتظار وزیر"}
              color="warning"
              icon={<Gavel fontSize="small" />}
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
        if (row?.disciplinaryCaseStage === "CASE_MINISTRY_CONFIRM")
          return (
            <Chip
              label={"در انتظار وزیر"}
              color="warning"
              // icon={<PendingActions sx={{ fontSize: "1rem" }} fontSize="small" />}
            />
          );
        if (row?.processStage === "SUPREME_NOTIFIED")
          return (
            <Chip
              label={"ابلاغ"}
              color="secondary"
              icon={<MarkEmailRead fontSize="small" />}
            />
          );
        if (row?.processStage === "FINAL" || row?.processStage === " قطعی ")
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
      field: "noticeDate",
      headerName: "ابلاغ",
      flex: 0.9,
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
    {
      field: "seenDate",
      headerName: "مشاهده شده",
      flex: 0.9,
      align: "center",
      renderCell: ({ row }: { row: any }) => {
        if (row?.seenDateFr) {
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
    {
      headerName: "عملیات",
      field: "action",
      flex: 1.1,
      headerAlign: "center",
      align: "center",
      renderCell: ({ row }: { row: any }) => {
        if (authFunctions?.hasPermission("disciplinary-order-edit")) {
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
                onAdd={{
                  function: () => {
                    setEditable(true);
                    setCaseData(row);
                    setInvitationFlag(true);
                  },
                  title: "ثبت دعوتنامه",
                  icon: (
                    <HistoryEdu
                      color={row.hasAttachment ? "success" : "primary"}
                    />
                  ),
                }}
              />
            );
          else if (row?.processStage === "SUPREME_METTING_REQUEST")
            return (
              <TableActions
                onManage={{
                  function: () => {
                    setEditable(true);
                    setFirstOrderData(row);
                    setFirstOrderFlag(true);
                  },
                  title: "ثبت حکم عالی",
                  icon: (
                    // <Badge badgeContent={1} color="primary">
                    <Gavel color={"primary"} />
                    // </Badge>
                  ),
                }}
                onAdd={{
                  function: () => {
                    setEditable(true);
                    setCaseData(row);
                    setInvitationFlag(true);
                  },
                  title: "ویرایش دعوتنامه",
                  icon: (
                    <HistoryEdu
                      color={row.hasAttachment ? "success" : "primary"}
                    />
                  ),
                }}
              />
            );
          else if (row?.processStage === "SUPREME_DONE")
            return (
              <TableActions
                onManage={{
                  function: () => {
                    setEditable(true);
                    setFirstOrderData(row);
                    setFirstOrderFlag(true);
                  },
                  title: "ویرایش حکم عالی",
                  icon: (
                    // <Badge badgeContent={1} color="primary">
                    <Gavel color={"primary"} />
                    // </Badge>
                  ),
                }}
              />
            );
          else if (row?.processStage === "CASE_MINISTRY_CONFIRM")
            return (
              <TableActions
                onManage={{
                  function: () => {
                    mutate(
                      {
                        entity: `disciplinary-supreme/confirm-ministry?id=${row.id}`,
                        method: "put",
                        //   data:
                      },
                      {
                        onSuccess: (res: any) => {
                          if (res?.status == 200 && res?.data) {
                            snackbar("تایید وزیر ثبت شد", "success");
                            StatesData_refetch();
                          } else snackbar("خطا در تغیر وضعیت پرونده", "error");
                        },
                        onError: (err) => {
                          snackbar("خطا در تغیر وضعیت پرونده", "error");
                        },
                      }
                    );
                  },
                  title: "تایید حکم",
                  icon: <CheckCircle color={"primary"} />,
                }}
                onAdd={{
                  function: () => {
                    setEditable(false);
                    setEditeData(row);
                    setDOCaseModalFlag(true);
                  },
                  title: "مشاهده حکم بدوی",
                  icon: (
                    // <Badge badgeContent={1} color="primary">
                    <Visibility color={"info"} />
                    // </Badge>
                  ),
                }}
              />
            );
          else if (row?.disciplinaryCaseStage === "CASE_MINISTRY_CONFIRM")
            return (
              <TableActions
                // onDelete={() => {
                //   setDeleteData(row);
                //   setDeleteFlag(true);
                // }}
                onAdd={{
                  function: () => {
                    setEditable(false);
                    setEditeData(row);
                    setDOCaseModalFlag(true);
                  },
                  title: "مشاهده حکم بدوی",
                  icon: (
                    // <Badge badgeContent={1} color="primary">
                    <Visibility color={"info"} />
                    // </Badge>
                  ),
                }}
                onManage={{
                  function: () => {
                    mutate(
                      {
                        entity: `disciplinary-case/confirm-ministry?id=${row.id}`,
                        method: "put",
                        //   data:
                      },
                      {
                        onSuccess: (res: any) => {
                          if (res?.status == 200 && res?.data) {
                            snackbar("تایید وزیر ثبت شد", "success");
                            StatesData_refetch();
                          } else snackbar("خطا در تغیر وضعیت پرونده", "error");
                        },
                        onError: (err) => {
                          snackbar("خطا در تغیر وضعیت پرونده", "error");
                        },
                      }
                    );
                  },
                  title: "تایید حکم",
                  icon: (
                    // <Badge badgeContent={1} color="primary">
                    <CheckCircle color={"primary"} />
                    // </Badge>
                  ),
                }}
              />
            );
          else if (row?.processStage === "SUPREME_NOTIFIED")
            return (
              <TableActions
                onManage={{
                  function: () => {
                    mutate(
                      {
                        entity: `disciplinary-supreme/done-supreme-order?id=${row?.id}`,
                        method: "put",
                      },
                      {
                        onSuccess: (res: any) => {
                          snackbar(
                            `پرونده انتظامی انتخاب شده با موفقیت تایید شد`,
                            "success"
                          );
                          StatesData_refetch();
                          setDeleteFlag(false);
                        },
                        onError: () => {
                          snackbar("خطا در تایید نهایی ", "error");
                        },
                      }
                    );
                  },
                  title: "تایید نهایی",
                  icon: (
                    // <Badge badgeContent={1} color="primary">
                    <Verified color={"primary"} />
                    // </Badge>
                  ),
                }}
                onAdd={{
                  function: () => {
                    setEditable(false);
                    setEditeData(row);
                    setDOCaseModalFlag(true);
                  },
                  title: "مشاهده حکم بدوی",
                  icon: (
                    // <Badge badgeContent={1} color="primary">
                    <Visibility color={"info"} />
                    // </Badge>
                  ),
                }}
              />
            );
          else if (
            row?.processStage === "FINAL" ||
            row?.processStage === " قطعی "
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
                    // setEditeData(row);
                    setFirstOrderData(row);
                    setFirstOrderFlag(true);
                  },
                  title: "مشاهده حکم عالی",
                  icon: (
                    // <Badge badgeContent={1} color="primary">
                    <Gavel color={"info"} />
                    // </Badge>
                  ),
                }}
                onAdd={{
                  function: () => {
                    setEditable(false);
                    setEditeData(row);
                    setDOCaseModalFlag(true);
                  },
                  title: "مشاهده حکم بدوی",
                  icon: (
                    // <Badge badgeContent={1} color="primary">
                    <Visibility color={"info"} />
                    // </Badge>
                  ),
                }}
                onRead={{
                  function: () => {
                    setEditable(false);
                    setEditeData(row);
                    setLogFlag(true);
                  },
                  title: "گزارشات",
                  icon: <AutoStories color={"info"} />,
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

  const searchItems: FormItem[] = [
    {
      name: "disciplinaryCaseAccuserName",
      inputType: "text",
      label: "شخصیت",
      size: { md: 3 },
    },
    {
      name: "primaryOrderNumber",
      inputType: "text",
      label: "شماره حکم بدوی",
      size: { md: 3 },
    },
    {
      name: "orderNumber",
      inputType: "text",
      label: "شماره حکم عالی",
      size: { md: 3 },
    },
    {
      name: "processStage",
      inputType: "autocomplete",
      label: "وضعیت",
      size: { md: 3 },
      storeValueAs: "id",
      options: [
        { value: "SUPREME_CREATED", title: "اولیه" },
        { value: "SUPREME_METTING_REQUEST", title: "دعوتنامه" },
        { value: "SUPREME_DONE", title: "حکم عالی" },
        { value: "CASE_MINISTRY_CONFIRM", title: "در انتظار وزیر" },
        { value: "FINAL", title: "قطعی" },
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
  return (
    <Grid container justifyContent="center">
      <Grid
        item
        md={11}
        sm={11}
        xs={12}
        display={"flex"}
        justifyContent={"space-between"}
        m={2}
        mb={0}
      >
        <Box display={"flex"}>
          <Gavel fontSize="large" />
          <Typography variant="h5">پرونده‌های انتظامی عالی</Typography>
        </Box>
        <Box display={"flex"} justifyContent={"space-between"} gap={1}>
          {/* {authFunctions?.hasPermission("disciplinary-order-edit") && (
            <CreateNewItem
              title="پرونده انتظامی جدید"
              onClick={() => {
                setEditeData(null);
                setEditable(true);
                setAddModalFlag(true);
              }}
            />
          )} */}

          <BackButton onBack={() => navigate(-1)} />
        </Box>
      </Grid>
      <NewSearchPannel<SearchData>
        searchItems={searchItems}
        searchData={searchData}
        setSearchData={setSearchData}
        setFilters={setFilters}
      />
      {StatesData_status === "success" && (
        <Grid
          item
          md={11}
          sm={11}
          xs={12}
          display={"flex"}
          justifyContent={"space-between"}
        >
          <Button
            variant="outlined"
            // size="small"
            color="success"
            endIcon={<FileDownload />}
            onClick={getExcel}
          >
            دریافت خروجی اکسل
          </Button>
          <Box sx={{ width: 120, height: 40, position: "relative" }}>
            <svg
              viewBox="0 0 220 80"
              width="100%"
              height="100%"
              preserveAspectRatio="none"
            >
              <path
                d="
                    M30 0
                    H190
                    Q200 0 205 10
                    L220 80
                    H0
                    L15 10
                    Q20 0 30 0
                    Z
                  "
                fill="none"
                stroke="lightGray"
                strokeWidth="2"
              />
            </svg>

            <Typography
              sx={{
                position: "absolute",
                inset: 0,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontWeight: "bold",
                pointerEvents: "none",
              }}
            >
              تعداد کل: {StatesData?.totalElements}
            </Typography>
          </Box>
        </Grid>
      )}
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
      {/* {editeData && ( */}
      <AddDOCase
        editable={editable}
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
          editable={true}
          addModalFlag={invitationFlag}
          setAddModalFlag={setInvitationFlag}
        />
      )}
      {firstOrderData && (
        <AddHOrder
          refetch={StatesData_refetch}
          editeData={firstOrderData}
          setEditeData={setFirstOrderData}
          editable={editable}
          addModalFlag={firstOrderFlag}
          setAddModalFlag={setFirstOrderFlag}
        />
      )}

      {editeData && logFlag && (
        <Logs
          refetch={StatesData_refetch}
          editeData={editeData}
          setEditeData={setEditeData}
          editable={editable}
          addModalFlag={logFlag}
          setAddModalFlag={setLogFlag}
        />
      )}
      {editeData && DOCaseModalFlag && (
        <DOCaseModal
          refetch={StatesData_refetch}
          editeData={editeData}
          setEditeData={setEditeData}
          editable={editable}
          addModalFlag={DOCaseModalFlag}
          setAddModalFlag={setDOCaseModalFlag}
        />
      )}

      <ConfirmBox
        open={deleteFlag}
        handleClose={() => {
          setDeleteFlag(false);
          setDeleteData(null);
        }}
        handleSubmit={() =>
          mutate(
            {
              entity: `disciplinary-case/delete/${deleteData?.id}`,
              method: "delete",
            },
            {
              onSuccess: (res: any) => {
                snackbar(
                  `پرونده انتظامی انتخاب شده با موفقیت حذف شد`,
                  "success"
                );
                StatesData_refetch();
                setDeleteFlag(false);
              },
              onError: () => {
                snackbar("خطا در حذف ", "error");
              },
            }
          )
        }
        message={`آیا از حذف پرونده انتظامی مورد نظر مطمعین میباشید؟`}
        title={"درخواست حذف!"}
      />
    </Grid>
  );
};

export default AllHCases;
