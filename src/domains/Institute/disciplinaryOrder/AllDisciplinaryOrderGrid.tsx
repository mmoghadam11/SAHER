import {
  Article,
  BusinessCenter,
  Close,
  DoneAll,
  FileDownload,
  Gavel,
  HistoryEdu,
  LibraryBooksOutlined,
  People,
  PictureAsPdf,
  ReceiptLong,
  Search,
  Settings,
  Verified,
  Work,
} from "@mui/icons-material";
import {
  Box,
  Button,
  Chip,
  Dialog,
  DialogTitle,
  Grid,
  List,
  ListItem,
  ListItemText,
  Modal,
  Paper,
  Tooltip,
  Typography,
} from "@mui/material";
import { GridColDef } from "@mui/x-data-grid";
import { useMutation, useQuery } from "@tanstack/react-query";
import BackButton from "components/buttons/BackButton";
import CreateNewItem from "components/buttons/CreateNewItem";
import TavanaDataGrid from "components/dataGrid/TavanaDataGrid";
import SearchPannel from "components/form/SearchPannel";
import RenderFormInput from "components/render/formInputs/RenderFormInput";
import TableActions from "components/table/TableActions";
import { useAuth } from "hooks/useAuth";
import { useSnackbar } from "hooks/useSnackbar";
import React, { useEffect, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { useNavigate, useParams } from "react-router-dom";
import paramsSerializer from "services/paramsSerializer";
import { PAGINATION_DEFAULT_VALUE } from "shared/paginationValue";
import ConfirmBox from "components/confirmBox/ConfirmBox";
import { FormItem } from "types/formItem";
import ShowDisciplinaryOrder from "./ShowDisciplinaryOrder";
import moment from "jalali-moment";
import { useAuthorization } from "hooks/useAutorization";
import NewSearchPannel from "components/form/NewSearchPannel";
import PdfUploadForm from "./details/PdfUploadForm";
import UploadPdfDialog from "./details/UploadPDFDialog";
import { isMobile } from "react-device-detect";
import VerticalTable from "components/dataGrid/VerticalTable";

type Props = {};

const AllDisciplinaryOrderGrid = (props: Props) => {
  const Auth = useAuth();
  const authFunctions = useAuthorization();
  const snackbar = useSnackbar();
  const navigate = useNavigate();
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
  const [filters, setFilters] = useState<any>({
    ...PAGINATION_DEFAULT_VALUE,
    name: "",
    // code: "",
  });
  const {
    data: StatesData,
    status: StatesData_status,
    refetch: StatesData_refetch,
  } = useQuery<any>({
    // queryKey: [process.env.REACT_APP_API_URL + `/api/unit-allocations${paramsSerializer(filters)}`],
    // queryKey: [`/api/v1/common-type/find-all${paramsSerializer(filters)}`],
    queryKey: [`disciplinary-order/search${paramsSerializer(filters)}`],
    queryFn: Auth?.getRequest,
    select: (res: any) => {
      return res?.data;
    },
    enabled: true,
  } as any);
  const columns: GridColDef[] = [
    // { field: "name", headerName: "نام موسسه", flex: 2 },
    // { field: "nationalId", headerName: "شناسه ملی موسسه", flex: 1 },
    // { field: "registerNo", headerName: "شماره ثبت", flex: 1 },
    // { field: "directorNationalCode", headerName: "کد ملی مدیرعامل", flex: 1 },
    {
      field: "respondenType",
      headerName: "نوع شخصیت حسابرس",
      flex: 1.2,
      align: "center",
      renderCell: ({ row }: { row: any }) => {
        if (row?.cdRespondenTypeId === 397)
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
        if (row?.cdRespondenTypeId === 396)
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
    { field: "subject", headerName: "نام شخصیت", flex: 1.2 },
    {
      field: "subjectTypeName",
      align: "center",
      headerName: "ردیف موضوع",
      // flex: 2.2,
      flex: 1,
      renderCell: ({ row }: { row: any }) => {
        return (
          <Box
            sx={{
              overflow: "hidden",
              textOverflow: "ellipsis",
            }}
          >
            <List dense disablePadding>
              {row?.subjectTypeList?.map((SItem: any, SIndex: number) => (
                <ListItem
                  key={SIndex}
                  sx={{
                    py: 0,
                    my: 0,
                    overflow: "hidden",
                    whiteSpace: "nowrap",
                    textOverflow: "ellipsis",
                  }}
                >
                  <Tooltip title={SItem?.value}>
                    <ListItemText
                      primaryTypographyProps={{
                        variant: "caption",
                        noWrap: true,
                        sx: { textOverflow: "ellipsis" },
                      }}
                    >
                      {SItem?.key}
                    </ListItemText>
                  </Tooltip>
                </ListItem>
              ))}
            </List>
          </Box>
        );
      },
    },
    {
      field: "claimantTypeName",
      headerName: "نوع حکم",
      flex: 1,
      cellClassName: () => "font-13",
    },
    {
      field: "orderNumber",
      headerName: "شماره حکم",
      flex: 1,
      cellClassName: () => "font-13",
    },
    {
      field: "startDate",
      headerName: "تاریخ شروع",
      flex: 1,
      renderCell: ({ row }: { row: any }) => {
        if (!!row?.startDate)
          return (
            <Typography variant="caption">
              {moment(new Date(row?.startDate)).format("jYYYY/jMM/jDD")}
            </Typography>
          );
      },
    },
    {
      field: "cdOrderTypeValue",
      headerName: "نوع تنبیه",
      flex: 1,
      cellClassName: () => "font-13",
    },
    {
      field: "claimant",
      headerName: "شاکی",
      flex: 1.2,
      cellClassName: () => "font-13",
    },
    {
      field: "workgroupName",
      headerName: "کارگروه",
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
        if (row?.notificationStatus){
          const [date, time] = row?.notificationDateFr?.split(" ")??[null,null];
          return (
            <Box
              display={"flex"}
              flexDirection={"column"}
              alignItems={"center"}
            >
              <Verified color="secondary" />
              <Tooltip title={row?.notificationDateFr+" (تاریخ ابلاغ)"}>
                <Typography variant="caption">
                  {/* {moment(new Date(row?.notificationDate)).format(
                    "jYYYY/jMM/jDD"
                  )} */}
                  {date?.replaceAll("-", "/")??null}
                </Typography>
              </Tooltip>
            </Box>
          );
        }
          
        else return <Close color="disabled" />;
      },
    },
    // {
    //   field: "notificationDate",
    //   headerName: "تاریخ ابلاغ",
    //   flex: 1,
    //   renderCell: ({ row }: { row: any }) => {
    //     if (row?.notificationDate)
    //       return (
    //         <Typography variant="caption">
    //           {moment(new Date(row?.notificationDate)).format("jYYYY/jMM/jDD")}
    //         </Typography>
    //       );
    //   },
    // },
    {
      field: "seen",
      headerName: "مشاهده شده",
      flex: 1,
      align: "center",
      renderCell: ({ row }: { row: any }) => {
        if (row?.seen){
          const [date, time] = row?.seenDateFr?.split(" ")??[null,null];
          return (
            <Box
              display={"flex"}
              flexDirection={"column"}
              alignItems={"center"}
            >
              <DoneAll color="success" />
              {row?.seenDate && (
                <Tooltip title={row?.seenDateFr+" (تاریخ مشاهده)"}>
                  <Typography variant="caption">
                    {/* {moment(new Date(row?.seenDate)).format("jYYYY/jMM/jDD")} */}
                    {date?.replaceAll("-", "/")??null}
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
        if (authFunctions?.hasPermission("disciplinary-order-edit"))
          return (
            <TableActions
              onEdit={() => {
                setEditable(true);
                setEditeData(row);
                setAddModalFlag(true);
              }}
              onDelete={() => {
                setDeleteData(row);
                setDeleteFlag(true);
              }}
              // onView={() => {
              //   setEditable(false);
              //   setEditeData(row);
              //   setAddModalFlag(true);
              // }}
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
    // {
    //   name: "auditingFirmId",
    //   inputType: "autocomplete",
    //   label: "موسسه",
    //   size: { md: 4 },
    //   options: firmOptions?.map((item: any) => ({
    //     value: item.id,
    //     title: item.name,
    //   })) ?? [{ value: 0, title: "خالی" }],
    //   storeValueAs: "id",
    // },
    {
      name: "subject",
      inputType: "text",
      label: "شخصیت",
      size: { md: 4 },
    },
    {
      name: "cdOrderTypeId",
      inputType: "autocomplete",
      label: "نوع تنبیه",
      size: { md: 4 },
      options: orderTypeOptions?.map((item: any) => ({
        value: item.id,
        title: item.value,
      })) ?? [{ value: 0, title: "خالی" }],
      storeValueAs: "id",
    },
    {
      name: "workgroupId",
      inputType: "autocomplete",
      label: "کارگروه",
      size: { md: 4 },
      options: workgroupOptions?.map((item: any) => ({
        value: item.id,
        title: item.name,
      })) ?? [{ value: 0, title: "خالی" }],
      storeValueAs: "id",
    },
    {
      name: "cdSubjectTypeKey",
      inputType: "text",
      label: "ردیف موضوع",
      size: { md: 3 },
    },
    {
      name: "hasAttachment",
      inputType: "autocomplete",
      label: "دارای پیوست",
      size: { md: 3 },
      options: [
        { value: "true", title: "میباشد" },
        { value: "false", title: "نمیباشد" },
      ],
      storeValueAs: "id",
    },
    {
      name: "cdClaimantTypeId",
      inputType: "autocomplete",
      label: "نوع حکم",
      size: { md: 3 },
      options: [
        { value: "398", title: "بدوی" },
        { value: "399", title: "عالی" },
      ],
      storeValueAs: "id",
    },
    {
      name: "orderNumber",
      inputType: "text",
      label: "شماره حکم",
      size: { md: 3 },
    },
  ];
  type editeObjectType = {
    id: number;
    value: string;
    key: string;
    typeId: number;
    typeName: string;
  };
  const [editeData, setEditeData] = useState<editeObjectType | null>(null);
  const [basePDFData, setBasePDFData] = useState<any>(null);
  const [editable, setEditable] = useState<boolean>(
    authFunctions?.hasPermission("disciplinary-order-edit")
  );
  const [addModalFlag, setAddModalFlag] = useState(false);
  const [pdfFlag, setPdfFlag] = useState(false);
  const [deleteData, setDeleteData] = useState<any>(null);
  const [deleteFlag, setDeleteFlag] = useState(false);
  const [searchData, setSearchData] = useState({
    name: "",
    code: "",
  });
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
          <Typography variant="h5">احکام انتظامی</Typography>
        </Box>
        <Box display={"flex"} justifyContent={"space-between"} gap={1}>
          {authFunctions?.hasPermission("disciplinary-order-edit") && (
            <CreateNewItem
              title="حکم انتظامی جدید"
              onClick={() => {
                setEditeData(null);
                setEditable(true);
                setAddModalFlag(true);
              }}
            />
          )}

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
      <ShowDisciplinaryOrder
        editable={editable}
        refetch={StatesData_refetch}
        addModalFlag={addModalFlag}
        setAddModalFlag={setAddModalFlag}
        editeData={editeData}
        setEditeData={setEditeData}
      />
      {/* <Grid item xs={12}>
        <PdfUploadForm
          onUploadSubmit={() => {}}
          onViewClick={() => {}}
          existingPdfUrl={null}
          onRemoveClick={() => {}}
        />
      </Grid> */}
      {pdfFlag && (
        <UploadPdfDialog
          refetch={StatesData_refetch}
          entityId={basePDFData?.id ?? ""}
          notificationStatus={basePDFData?.notificationStatus ?? null}
          onClose={() => {
            setPdfFlag(false);
          }}
          open={pdfFlag}
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
              entity: `disciplinary-order/delete/${deleteData?.id}`,
              method: "delete",
            },
            {
              onSuccess: (res: any) => {
                snackbar(`حکم انتظامی انتخاب شده با موفقیت حذف شد`, "success");
                StatesData_refetch();
                setDeleteFlag(false);
              },
              onError: () => {
                snackbar("خطا در حذف ", "error");
              },
            }
          )
        }
        message={`آیا از حذف حکم انتظامی مورد نظر مطمعین میباشید؟`}
        title={"درخواست حذف!"}
      />
    </Grid>
  );
};

export default AllDisciplinaryOrderGrid;
