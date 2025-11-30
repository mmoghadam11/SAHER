import {
  Close,
  FileDownload,
  Key,
  ManageAccounts,
  People,
  Toc,
  Verified,
} from "@mui/icons-material";
import {
  Box,
  Button,
  Chip,
  CircularProgress,
  Grid,
  Paper,
  Typography,
} from "@mui/material";
import { GridColDef, GridToolbar } from "@mui/x-data-grid";
import { useMutation, useQuery } from "@tanstack/react-query";
import BackButton from "components/buttons/BackButton";
import TavanaDataGrid from "components/dataGrid/TavanaDataGrid";
import { useAuth } from "hooks/useAuth";
import { useSnackbar } from "hooks/useSnackbar";
import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { useNavigate, useParams } from "react-router-dom";
import paramsSerializer from "services/paramsSerializer";
import { PAGINATION_DEFAULT_VALUE } from "shared/paginationValue";
import VerticalTable from "components/dataGrid/VerticalTable";
import { isMobile } from "react-device-detect";
import AddContiniuingEdu from "./AddContiniuingEdu";
import moment from "jalali-moment";
import ConfirmBox from "components/confirmBox/ConfirmBox";
import NewSearchPannel from "components/form/NewSearchPannel";
import { FormItem } from "types/formItem";

type Props = {};

const ContinuingEducationGrid = (Props: Props) => {
  const { id } = useParams();
  const Auth = useAuth();
  const snackbar = useSnackbar();
  const navigate = useNavigate();
  const { mutate } = useMutation({
    mutationFn: Auth?.serverCall,
  });
  const { isLoading: Download_isLoading, mutate: Download_mutate } =
    useMutation({
      mutationFn: Auth?.serverCallGetFile,
    });
  const [filters, setFilters] = useState<any>({
    ...PAGINATION_DEFAULT_VALUE,
    auditingFirmId: id,
  });
  const {
    data: StatesData,
    status: StatesData_status,
    refetch: StatesData_refetch,
  } = useQuery<any>({
    queryKey: [`firm-prof-edu-personnel/search${paramsSerializer(filters)}`],
    queryFn: Auth?.getRequest,
    select: (res: any) => {
      return res?.data;
    },
    enabled: true,
  } as any);
  const { data: instituteTerms } = useQuery<any>({
    queryKey: [`firm-prof-edu-personnel/report/find-term-by-firm?firmId=${id}`],
    queryFn: Auth?.getRequest,
    select: (res: any) => {
      return res?.data;
    },
    enabled: !!id,
  } as any);
  const columns: GridColDef[] = [
    {
      field: "cdTermNameValue",
      headerName: "نام دوره",
      flex: 2.7,
      renderCell: ({ row }: { row: any }) => {
        return (
          <Typography sx={{ my: 2 }} variant="caption">
            {row?.cdTermNameValue}
          </Typography>
        );
      },
    },
    { field: "personnelFirstName", headerName: "نام", flex: 1.5 },
    { field: "personnelLastName", headerName: "نام خانوادگی", flex: 1.5 },
    { field: "termDuration", headerName: "مدت دوره(ساعت)", flex: 1 },
    { field: "attendanceDuration", headerName: "مدت حضور شخص(ساعت)", flex: 1 },
    {
      field: "termDate",
      headerName: "تاریخ شروع",
      flex: 1.5,
      renderCell: ({ row }: { row: any }) => {
        const [date, time] = row?.termDateFr?.split(" ") ?? [null, null];
        if (!!row?.termDate)
          return (
            <Typography variant="caption">
              {/* {moment(new Date(row?.termDate)).format("jYYYY/jMM/jDD")} */}
              {date?.replaceAll("-", "/") ?? null}
            </Typography>
          );
      },
    },
    // {
    //   headerName: "عملیات",
    //   field: "action",
    //   flex: 1,
    //   headerAlign: "center",
    //   align: "center",
    //   renderCell: ({ row }: { row: any }) => {
    //     return (
    //       <TableActions
    //         // onEdit={() => {
    //         //   // navigate(`${row.id}`, { state: { userData: row } });
    //         //   setEditeData(row);
    //         //   setAddModalFlag(true);
    //         // }}
    //         // onDelete={() => {
    //         //   setDeleteData(row);
    //         //   setDeleteFlag(true);
    //         // }}
    //         onManage={{
    //           icon: <People/>,
    //           title: "شرکت کنندگان",
    //           function: () => {
    //             setSelectecBranchData(row);
    //           },
    //         }}
    //       />
    //     );
    //   },
    // },
  ];

  type editeObjectType = {
    id: number;
    value: string;
    key: string;
    typeId: number;
    typeName: string;
  };
  const [editeData, setEditeData] = useState<editeObjectType | null>(null);
  const [addModalFlag, setAddModalFlag] = useState(false);
  const [deleteData, setDeleteData] = useState<any>(null);
  const [deleteFlag, setDeleteFlag] = useState(false);
  const [searchData, setSearchData] = useState({
    name: "",
    code: "",
  });
  const searchItems: FormItem[] = [
    {
      name: "cdTermId",
      inputType: "autocomplete",
      label: "دوره",
      size: { md: 2.4 },
      options: instituteTerms?.map((item: any) => ({
        value: item.id,
        title: item.value,
      })) ?? [{ value: 0, title: "خالی" }],
      storeValueAs: "id",
    },
    {
      name: "personnelLastName",
      inputType: "text",
      label: "نام خانوادگی",
      size: { md: 2.2 },
    },
    {
      name: "personnelNationalCode",
      inputType: "text",
      label: "کد ملی",
      size: { md: 2.2 },
    },
    {
      name: "termDateFrom",
      inputType: "date",
      label: "تاریخ شروع",
      elementProps: {
        setDay: (value: any) => {
          setFilters((prev: any) => ({
            ...prev,
            termDateFrom: value,
          }));
        },
        value: "",
      },
      size: { md: 2.6 },
    },
    {
      name: "termDateTo",
      inputType: "date",
      label: "تاریخ پایان",
      elementProps: {
        setDay: (value: any) => {
          setFilters((prev: any) => ({
            ...prev,
            termDateTo: value,
          }));
        },
        value: "",
      },
      size: { md: 2.6 },
    },
    // {
    //   name: "termDateFrom",
    //   inputType: "rangeSlider",
    //   label: "تاریخ دوره",
    //   elementProps: {
    //     min: moment("1403/01/01", "jYYYY/jMM/jDD").startOf("day").valueOf(),
    //     max: moment("1403/12/29", "jYYYY/jMM/jDD").startOf("day").valueOf(),
    //   },
    //   size: { md: 3 },
    // },
  ];
  useEffect(() => {
    console.log(filters);
  }, [filters]);
  function SumOfDays() {
    return StatesData?.content?.reduce(
      (total: number, input: any) => total + input.termDuration,
      0
    );
  }
  function getExcel() {
    Download_mutate(
      {
        entity: `firm-prof-edu-personnel/export${paramsSerializer(filters)}`,
        method: "get",
      },
      {
        onSuccess: (res: any) => {
          if (res && res instanceof Blob) {
            const url = URL.createObjectURL(res);
            const a = document.createElement("a");
            a.href = url;
            a.download = "گزارش_دوره_های_آموزشی.xlsx";
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
  return (
    <Grid container item md={12} justifyContent="center">
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
          <Toc fontSize="large" />
          <Typography variant="h5">لیست سوابق مستمر آموزشی</Typography>
        </Box>
        <Box display={"flex"} justifyContent={"space-between"}>
          {/* <CreateNewItem
            sx={{ mr: 2 }}
            name="سوابق مستمر آموزشی"
            // onClick={() => navigate("new")}
            onClick={() => {
              // navigate("new")
              // setActiveTab(1);
              setAddModalFlag(true);
            }}
          /> */}
          <BackButton onBack={() => navigate(-1)} />
        </Box>
      </Grid>
      {/* <Grid item md={2} sm={3} xs={12}> */}
      <NewSearchPannel<any>
        searchItems={searchItems}
        searchData={searchData}
        setSearchData={setSearchData}
        setFilters={setFilters}
      />
      {/* </Grid> */}
      {StatesData_status === "success" && (
        <Grid
          item
          md={11}
          sm={11}
          xs={12}
          display={"flex"}
          gap={2}
          alignItems={"center"}
        >
          {/* <Paper elevation={1} sx={{ width: "100%",p:2,display:"flex" }}> */}
          <Button
            variant="outlined"
            // size="small"
            color="success"
            endIcon={<FileDownload />}
            onClick={getExcel}
          >
            دریافت خروجی اکسل
          </Button>
          <Typography variant="body2">
            مجموع ساعات: {StatesData?.summary} ساعت
          </Typography>
          {/* </Paper> */}
        </Grid>
      )}
      <Grid item md={11} sm={11} xs={12}>
        {StatesData_status === "success" ? (
          isMobile ? (
            <VerticalTable
              rows={StatesData?.page?.content}
              columns={columns}
              filters={filters}
              setFilters={setFilters}
              rowCount={StatesData?.page?.totalElements}
            />
          ) : (
            <TavanaDataGrid
              rows={StatesData?.page?.content}
              columns={columns}
              filters={filters}
              setFilters={setFilters}
              rowCount={StatesData?.page?.totalElements}
              getRowHeight={() => "auto"}
              autoHeight
              hideToolbar
              // slots={{ toolbar: GridToolbar }}
              // slotProps={{
              //   toolbar: {
              //     csvOptions: { disableToolbarButton: true },
              //   },
              // }}
            />
          )
        ) : StatesData_status === "loading" ? (
          <Box
            minHeight={"50vh"}
            textAlign={"center"}
            alignItems={"center"}
            justifyContent={"center"}
          >
            <Typography>لطفا منتظر بمانید...</Typography>
            <CircularProgress />
          </Box>
        ) : (
          <Typography variant="body1">
            اطلاعاتی برای نمایش موجود نمیباشد
          </Typography>
        )}
      </Grid>

      <AddContiniuingEdu
        refetch={StatesData_refetch}
        addModalFlag={addModalFlag}
        setAddModalFlag={setAddModalFlag}
        editeData={editeData}
        setEditeData={setEditeData}
      />

      <ConfirmBox
        open={deleteFlag}
        handleClose={() => {
          setDeleteFlag(false);
          setDeleteData(null);
        }}
        handleSubmit={() =>
          mutate(
            {
              entity: `firm-prof-edu/remove/${deleteData?.id}`,
              method: "delete",
            },
            {
              onSuccess: (res: any) => {
                snackbar(`کاربر انتخاب شده با موفقیت حذف شد`, "success");
                StatesData_refetch();
              },
              onError: () => {
                snackbar("خطا در حذف ", "error");
              },
            }
          )
        }
        message={`آیا از حذف ${deleteData?.cdTermNameValue} مطمعین میباشید؟`}
        title={"درخواست حذف!"}
      />
    </Grid>
  );
};

export default ContinuingEducationGrid;
