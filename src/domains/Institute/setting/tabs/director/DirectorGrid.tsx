import { Close, Key, ManageAccounts, Toc, Verified } from "@mui/icons-material";
import { Box, Chip, Grid, Typography } from "@mui/material";
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
import ConfirmBox from "components/confirmBox/ConfirmBox";
import VerticalTable from "components/dataGrid/VerticalTable";
import { isMobile } from "react-device-detect";
import SearchPannel from "components/form/SearchPannel";
import AddDirectorModal from "./AddDirectorModal";
import { useAuthorization } from "hooks/useAutorization";
import moment from "jalali-moment";

type Props = {
  setActiveTab: React.Dispatch<React.SetStateAction<number>>;
};

const DirectorGrid = ({ setActiveTab }: Props) => {
  const { id } = useParams();
  const Auth = useAuth();
  const { hasPermission } = useAuthorization();
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
    firm: id,
  });
  const {
    data: StatesData,
    status: StatesData_status,
    refetch: StatesData_refetch,
  } = useQuery<any>({
    queryKey: [`firm-director/find-by-firm${paramsSerializer(filters)}`],
    queryFn: Auth?.getRequest,
    select: (res: any) => {
      return res?.data;
    },
    enabled: true,
  } as any);
  const columns: GridColDef[] = [
    { field: "firstName", headerName: "نام مدیرعامل", flex: 1.5 },
    { field: "lastName", headerName: "نام خانوادگی", flex: 1.5 },
    { field: "nationalCode", headerName: "کد ملی", flex: 1 },
    {
      field: "startDate",
      headerName: "تاریخ شروع مدیریت",
      flex: 1,
      align:"center",
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
      headerName: "عملیات",
      field: "action",
      flex: 1,
      headerAlign: "center",
      align: "center",
      renderCell: ({ row }: { row: any }) => {
        if (!hasPermission("supervisor"))
          return (
            <TableActions
              onEdit={() => {
                // navigate(`${row.id}`, { state: { userData: row } });
                setEditeData(row);
                setAddModalFlag(true);
              }}
              onDelete={() => {
                setDeleteData(row);
                setDeleteFlag(true);
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
  type searchType = {
    name: string;
    inputType: string;
    label: string;
    size: any;
  };
  const searchItems: searchType[] = [
    {
      name: "name",
      inputType: "text",
      label: "نام کاربر",
      size: { md: 4 },
    },
    // {
    //   name: "code",
    //   inputType: "text",
    //   label: "کد کاربر",
    //   size: { md: 4 },
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
  const [appendFirmFlag, setAppendFirmFlag] = useState(false);
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
          <Toc fontSize="large" />
          <Typography variant="h5">لیست مدیران عامل</Typography>
        </Box>
        <Box display={"flex"} justifyContent={"space-between"}>
          {!hasPermission("supervisor") && (
            <CreateNewItem
              sx={{ mr: 2 }}
              name="مدیرعامل"
              // onClick={() => navigate("new")}
              onClick={() => {
                // navigate("new")
                // setActiveTab(1);
                setAddModalFlag(true);
              }}
            />
          )}
        </Box>
      </Grid>
      {/* <SearchPannel<SearchData>
        searchItems={searchItems}
        searchData={searchData}
        setSearchData={setSearchData}
        setFilters={setFilters}
      /> */}
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
              // rowHeight={25}
              getRowHeight={() =>
                !hasPermission("supervisor") ? "auto" : null
              }
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
        ) : null}
      </Grid>
      <AddDirectorModal
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
              entity: `firm-director/remove/${deleteData?.id}`,
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
        message={`آیا از حذف ${deleteData?.firstName} ${deleteData?.lastName} مطمعین میباشید؟`}
        title={"درخواست حذف!"}
      />
    </Grid>
  );
};

export default DirectorGrid;
