import { Toc } from "@mui/icons-material";
import { Box, Grid, Typography } from "@mui/material";
import { GridColDef } from "@mui/x-data-grid";
import { useMutation, useQuery } from "@tanstack/react-query";
import TavanaDataGrid from "components/dataGrid/TavanaDataGrid";
import { useAuth } from "hooks/useAuth";
import { useSnackbar } from "hooks/useSnackbar";
import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import paramsSerializer from "services/paramsSerializer";
import { PAGINATION_DEFAULT_VALUE } from "shared/paginationValue";
import ConfirmBox from "components/confirmBox/ConfirmBox";
import VerticalTable from "components/dataGrid/VerticalTable";
import { isMobile } from "react-device-detect";
import AddDirectorModal from "./AddDirectorModal";
import moment from "jalali-moment";

type Props = {
  setActiveTab: React.Dispatch<React.SetStateAction<number>>;
};

const DirectorGrid = () => {
  const { id } = useParams();
  const Auth = useAuth();
  const snackbar = useSnackbar();
  const { mutate } = useMutation({
    mutationFn: Auth?.serverCall,
  });
  
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
      // align: "center",
      renderCell: ({ row }: { row: any }) => {
        if (!!row?.startDate)
          return (
            <Typography variant="body2">
              {moment(new Date(row?.startDate)).format("jYYYY/jMM/jDD")}
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
    //         onEdit={() => {
    //           // navigate(`${row.id}`, { state: { userData: row } });
    //           setEditeData(row);
    //           setAddModalFlag(true)
    //         }}
    //         onDelete={() => {
    //           setDeleteData(row);
    //           setDeleteFlag(true);
    //         }}
    //       />
    //     );
    //   },
    // },
  ];
  type searchType = {
    name: string;
    inputType: string;
    label: string;
    size: any;
  };
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
  useEffect(() => {
    console.log(filters);
  }, [filters]);

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
          {/* <CreateNewItem
            sx={{ mr: 2 }}
            name="مدیرعامل"
            onClick={() => {
              setAddModalFlag(true)
            }}
          /> */}
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
              // getRowHeight={() => "auto"}
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
              entity: `firm-director/delete/${deleteData?.id}`,
              method: "delete",
            },
            {
              onSuccess: () => {
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
