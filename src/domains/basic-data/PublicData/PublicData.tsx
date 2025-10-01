import { Article, Search, Settings } from "@mui/icons-material";
import { Box, Button, Grid, Paper, Typography } from "@mui/material";
import { GridColDef } from "@mui/x-data-grid";
import { useMutation, useQuery } from "@tanstack/react-query";
import CreateNewItem from "components/buttons/CreateNewItem";
import TavanaDataGrid from "components/dataGrid/TavanaDataGrid";
import SearchPannel from "components/form/SearchPannel";
import RenderFormInput from "components/render/formInputs/RenderFormInput";
import TableActions from "components/table/TableActions";
import { useAuth } from "hooks/useAuth";
import { useSnackbar } from "hooks/useSnackbar";
import React, { useEffect, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import paramsSerializer from "services/paramsSerializer";
import { PAGINATION_DEFAULT_VALUE } from "shared/paginationValue";
import AddPublicData from "./pages/components/AddPublicData";
import ConfirmBox from "components/confirmBox/ConfirmBox";

type Props = {};

const PublicData = (props: Props) => {
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
    name: "",
  });
  const [addModalFlag, setAddModalFlag] = useState(false);
  const [deleteFlag, setDeleteFlag] = useState(false);
  const [editeData, setEditeData] = useState(null);
  const [deleteData, setDeleteData] = useState<any>(null);
  const {
    data: basicData,
    status: basicData_status,
    refetch: basicData_refetch,
  } = useQuery<any>({
    // queryKey: [process.env.REACT_APP_API_URL + `/api/unit-allocations${paramsSerializer(filters)}`],
    // queryKey: [`/api/v1/common-type/find-all${paramsSerializer(filters)}`],
    queryKey: [`common-type/search${paramsSerializer(filters)}`],
    queryFn: Auth?.getRequest,
    select: (res: any) => {
      return res?.data;
    },
    disabled: true,
  } as any);
  const columns: GridColDef[] = [
    { field: "typeName", headerName: "عنوان", flex: 2 },
    { field: "className", headerName: "کلید", flex: 2 },
    // { field: "apartmentPriceInRials", headerName: "نوع", flex: 1.5 },
    // { field: "differencePrice", headerName: "شرح", flex: 1.5 },
    // { field: "memberSelectionOrder", headerName: "اولویت عضو", flex: 1 },
    {
      headerName: "عملیات",
      field: "action",
      flex: 1,
      headerAlign: "center",
      align: "center",
      renderCell: ({ row }: { row: any }) => {
        return (
          <TableActions
            onManage={{
              icon: <Settings color="primary" />,
              function: () => {
                navigate(`${row.id}/${row.typeName}`);
              },
            }}
            onEdit={() => {
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
    className: string;
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
      label: "عنوان",
      size: { md: 5 },
    },
    {
      name: "className",
      inputType: "text",
      label: "کلید",
      size: { md: 5 },
    },
  ];
  const [searchData, setSearchData] = useState<SearchData>({
    name: "",
    className: "",
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
      >
        <Box display={"flex"}>
          <Article fontSize="large" />
          <Typography variant="h5">اطلاعات پایه</Typography>
        </Box>
        <CreateNewItem
          sx={{ mr: 2 }}
          name="اطلاعات پایه"
          onClick={() => setAddModalFlag(true)}
        />
      </Grid>
      <SearchPannel<SearchData>
        searchItems={searchItems}
        searchData={searchData}
        setSearchData={setSearchData}
        setFilters={setFilters}
      />
      <Grid item md={11} sm={11} xs={12}>
        {basicData_status === "success" ? (
          <TavanaDataGrid
            rows={basicData?.content}
            columns={columns}
            filters={filters}
            setFilters={setFilters}
            rowCount={basicData?.totalElements}
            getRowHeight={() => "auto"}
            autoHeight
            hideToolbar
          />
        ) : null}
      </Grid>
      <AddPublicData
        refetch={basicData_refetch}
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
              entity: `common-type/delete/${deleteData?.id}`,
              method: "delete",
            },
            {
              onSuccess: (res: any) => {
                snackbar(`کاربر انتخاب شده با موفقیت حذف شد`, "success");
                basicData_refetch();
              },
              onError: () => {
                snackbar("خطا در حذف ", "error");
              },
            }
          )
        }
        message={`آیا از حذف ${deleteData?.typeName}-${deleteData?.className} مطمعین میباشید؟`}
        title={"درخواست حذف!"}
      />
    </Grid>
  );
};

export default PublicData;
