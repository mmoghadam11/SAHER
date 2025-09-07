import { Article, Search } from "@mui/icons-material";
import { Box, Button, Grid, Paper, Typography } from "@mui/material";
import { GridColDef } from "@mui/x-data-grid";
import { useMutation, useQuery } from "@tanstack/react-query";
import BackButton from "components/buttons/BackButton";
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

type Props = {};

const States = (props: Props) => {
  const { id,typeName } = useParams();
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
    typeId: id??"",
  });
  const {
    data: StatesData,
    status: StatesData_status,
    refetch: StatesData_refetch,
  } = useQuery<any>({
    // queryKey: [process.env.REACT_APP_API_URL + `/api/unit-allocations${paramsSerializer(filters)}`],
    // queryKey: [`/api/v1/common-type/find-all${paramsSerializer(filters)}`],
    queryKey: [`/common-type/find-by-type${paramsSerializer(filters)}`],
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
            onEdit={() => {
              navigate(`${row.id}`);
            }}
          />
        );
      },
    },
  ];
  interface SearchData {
    name: string;
    className: string;
    m: string;
  }
  type searchType = {
    name: string;
    inputType: string;
    label: string;
    size: any;
  };
  const searchItems: searchType[] = [
    {
      name: "typeName",
      inputType: "text",
      label: "عنوان",
      size: { md: 4 },
    },
    {
      name: "className",
      inputType: "text",
      label: "کلید",
      size: { md: 4 },
    },
    {
      name: "m",
      inputType: "text",
      label: "کیش",
      size: { md: 4 },
    },
  ];
  const [searchData, setSearchData] = useState({
    name: "",
    className: "",
    m: "",
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
      <Grid item md={11} sm={11} xs={12} display={"flex"} justifyContent={"space-between"} m={2} mb={0}>
        <Box display={"flex"}>
          <Article fontSize="large" />
          <Typography variant="h5">{typeName}</Typography>
        </Box>
        <BackButton onBack={()=>navigate(-1)}/>
      </Grid>
      <SearchPannel<SearchData>
        searchItems={searchItems}
        searchData={searchData}
        setSearchData={setSearchData}
        setFilters={setFilters}
      />
      <Grid item md={11} sm={11} xs={12}>
        {StatesData_status === "success" ? (
          <TavanaDataGrid
            rows={StatesData?.content}
            columns={columns}
            filters={filters}
            setFilters={setFilters}
            rowCount={StatesData?.totalElements}
            autoHeight
            hideToolbar
          />
        ) : null}
      </Grid>
    </Grid>
  );
};

export default States;
