import {
  Close,
  Key,
  ManageAccounts,
  People,
  Toc,
  Verified,
} from "@mui/icons-material";
import { Box, Chip, CircularProgress, Grid, Typography } from "@mui/material";
import { GridColDef, GridToolbar } from "@mui/x-data-grid";
import { useMutation, useQuery } from "@tanstack/react-query";
import BackButton from "components/buttons/BackButton";
import CreateNewItem from "components/buttons/CreateNewItem";
import TavanaDataGrid from "components/dataGrid/TavanaDataGrid";
import TableActions from "components/table/TableActions";
import { useAuth } from "hooks/useAuth";
import { useSnackbar } from "hooks/useSnackbar";
import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { useNavigate, useParams } from "react-router-dom";
import paramsSerializer from "services/paramsSerializer";
import { PAGINATION_DEFAULT_VALUE } from "shared/paginationValue";
import VerticalTable from "components/dataGrid/VerticalTable";
import { isMobile } from "react-device-detect";
import moment from "jalali-moment";
import ConfirmBox from "components/confirmBox/ConfirmBox";
import JalaliRangeSlider from "components/rangeSlider/Index";
import NewSearchPannel from "components/form/NewSearchPannel";
import { FormItem } from "types/formItem";

type Props = {};

const CertifiedAccountantEDUGrid = (Props: Props) => {
//   const { id } = useParams();
  const Auth = useAuth();
  const snackbar = useSnackbar();
  const navigate = useNavigate();
  const { isLoading, mutate, error } = useMutation({
    mutationFn: Auth?.serverCall,
  });
  const {
    handleSubmit,
    formState: { errors },
    control,
  } = useForm();
  const [filters, setFilters] = useState<any>({
    ...PAGINATION_DEFAULT_VALUE,
    // auditingFirmId: id,
    personnelNationalCode:Auth.userInfo.nationalCode
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
  // const {
  //   data: StatesData,
  //   status: StatesData_status,
  //   refetch: StatesData_refetch,
  // } = useQuery<any>({
  //   queryKey: [`firm-prof-edu/find-by-firm${paramsSerializer(filters)}`],
  //   queryFn: Auth?.getRequest,
  //   select: (res: any) => {
  //     return res?.data;
  //   },
  //   enabled: true,
  // } as any);
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
    { field: "termDuration", headerName: "مدت دوره(روز)", flex: 1 },
    { field: "attendanceDuration", headerName: "مدت حضور شخص(روز)", flex: 1 },
    {
      field: "termDate",
      headerName: "تاریخ شروع",
      flex: 1.5,
      renderCell: ({ row }: { row: any }) => {
        if (!!row?.termDate)
          return (
            <Typography variant="caption">
              {moment(new Date(row?.termDate)).format("jYYYY/jMM/jDD")}
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
  // const columns: GridColDef[] = [
  //   { field: "cdTermNameValue", headerName: "نام دوره آموزشی", flex: 1 },
  //   { field: "cdEducationTypeValue", headerName: "نوع آموزش", flex: 1 },
  //   { field: "termDuration", headerName: "مدت زمان ترم آموزشی(روز)", flex: 1 },
  //   {
  //     field: "termDate",
  //     headerName: "تاریخ ترم",
  //     flex: 1,
  //     renderCell: ({ row }: { row: any }) => {
  //       if (!!row?.termDate)
  //         return (
  //           <Typography>
  //             {moment(new Date(row?.termDate)).format("jYYYY/jMM/jDD")}
  //           </Typography>
  //         );
  //     },
  //   },
  //   {
  //     headerName: "عملیات",
  //     field: "action",
  //     flex: 1,
  //     headerAlign: "center",
  //     align: "center",
  //     renderCell: ({ row }: { row: any }) => {
  //       return (
  //         <TableActions
  //           // onEdit={() => {
  //           //   // navigate(`${row.id}`, { state: { userData: row } });
  //           //   setEditeData(row);
  //           //   setAddModalFlag(true);
  //           // }}
  //           // onDelete={() => {
  //           //   setDeleteData(row);
  //           //   setDeleteFlag(true);
  //           // }}
  //           onManage={{
  //             icon: <People/>,
  //             title: "شرکت کنندگان",
  //             function: () => {
  //               setSelectecBranchData(row);
  //             },
  //           }}
  //         />
  //       );
  //     },
  //   },
  // ];

  type editeObjectType = {
    id: number;
    value: string;
    key: string;
    typeId: number;
    typeName: string;
  };
  const [editeData, setEditeData] = useState<editeObjectType | null>(null);
  const [selectecBranchData, setSelectecBranchData] =
    useState<editeObjectType | null>(null);
  const [addModalFlag, setAddModalFlag] = useState(false);
  const [appendFirmFlag, setAppendFirmFlag] = useState(false);
  const [deleteData, setDeleteData] = useState<any>(null);
  const [deleteFlag, setDeleteFlag] = useState(false);
  const [searchData, setSearchData] = useState({
    name: "",
    code: "",
  });
  const searchItems: FormItem[] = [
    {
      name: "personnelLastName",
      inputType: "text",
      label: "نام خانوادگی",
      size: { md: 2.6 },
    },
    {
      name: "personnelNationalCode",
      inputType: "text",
      label: "کد ملی",
      size: { md: 2.6 },
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
      size: { md: 3.2 },
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
      size: { md: 3.2 },
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
      {/* <AddContiniuingEdu
        refetch={StatesData_refetch}
        addModalFlag={addModalFlag}
        setAddModalFlag={setAddModalFlag}
        editeData={editeData}
        setEditeData={setEditeData}
      />
      {!!selectecBranchData && (
        <BranchEDU
          selectedEDUId={selectecBranchData}
          setSelectecBranchData={setSelectecBranchData}
        />
      )} */}
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

export default CertifiedAccountantEDUGrid;
