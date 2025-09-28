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
import AddEduInfo from "./AddEduInfo";

type Props = {
  setActiveTab: React.Dispatch<React.SetStateAction<number>>;
};

const EduInfoGrid = ({ setActiveTab }: Props) => {
  const { id } = useParams();
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
    firm: id,
    termName:""
  });
  const {
    data: StatesData,
    status: StatesData_status,
    refetch: StatesData_refetch,
  } = useQuery<any>({
    queryKey: [`firm-edu-controller/search${paramsSerializer(filters)}`],
    queryFn: Auth?.getRequest,
    select: (res: any) => {
      return res?.data;
    },
    enabled: true,
  } as any);
  const columns: GridColDef[] = [
    { field: "termName", headerName: "نام ترم", flex: 1 },
    { field: "applicatorName", headerName: "درخواست کننده", flex: 1 },
    { field: "hour_count", headerName: "مقدار ساعت", flex: 1 },
    {
      headerName: "عملیات",
      field: "action",
      flex: 1,
      headerAlign: "center",
      align: "center",
      renderCell: ({ row }: { row: any }) => {
        return (
          <TableActions
            onEdit={() => {
              // navigate(`${row.id}`, { state: { userData: row } });
              setEditeData(row);
              setAddModalFlag(true)
            }}
            // onDelete={() => {
            //   setDeleteData(row);
            //   setDeleteFlag(true);
            // }}
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
          <Typography variant="h5">لیست اطلاعات آموزشی</Typography>
        </Box>
        <Box display={"flex"} justifyContent={"space-between"}>
          <CreateNewItem
            sx={{ mr: 2 }}
            name="اطلاعات آموزشی"
            // onClick={() => navigate("new")}
            onClick={() => {
              // navigate("new")
              // setActiveTab(1);
              setAddModalFlag(true)
            }}
          />
        </Box>
      </Grid>
      {/* <SearchPannel<SearchData>
        searchItems={searchItems}
        searchData={searchData}
        setSearchData={setSearchData}
        setFilters={setFilters}
      /> */}
      <Grid item md={11} sm={11} xs={12} >
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
        ) : <Typography variant="body1">اطلاعاتی برای نمایش موجود نمیباشد</Typography>}
      </Grid>
      <AddEduInfo
        refetch={StatesData_refetch}
        addModalFlag={addModalFlag}
        setAddModalFlag={setAddModalFlag}
        editeData={editeData}
        setEditeData={setEditeData}
      />
      {/* <ConfirmBox
        open={deleteFlag}
        handleClose={() => {
          setDeleteFlag(false);
          setDeleteData(null);
        }}
        handleSubmit={() =>
          mutate(
            {
              entity: `user/delete/${deleteData?.id}`,
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
        message={`آیا از حذف ${deleteData?.firstname} ${deleteData?.lastname} مطمین میباشید؟`}
        title={"درخواست حذف!"}
      /> */}
    </Grid>
  );
};

export default EduInfoGrid