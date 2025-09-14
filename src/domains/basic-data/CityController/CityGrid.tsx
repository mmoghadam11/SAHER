import { Article, Search } from "@mui/icons-material";
import {
  Box,
  Button,
  Dialog,
  DialogTitle,
  Grid,
  Modal,
  Paper,
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
import AddModal from "./components/AddModal";
import ConfirmBox from "components/confirmBox/ConfirmBox";

type Props = {};

const CityGrid = (props: Props) => {
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
    code: "",
    townShipId: "",
  });
  const {
    data: StatesData,
    status: StatesData_status,
    refetch: StatesData_refetch,
  } = useQuery<any>({
    // queryKey: [process.env.REACT_APP_API_URL + `/api/unit-allocations${paramsSerializer(filters)}`],
    // queryKey: [`/api/v1/common-type/find-all${paramsSerializer(filters)}`],
    queryKey: [`city/search${paramsSerializer(filters)}`],
    queryFn: Auth?.getRequest,
    select: (res: any) => {
      return res?.data;
    },
    enabled: true,
  } as any);
  const {
      data: provinceOptions,
      status: provinceOptions_status,
      refetch: provinceOptions_refetch,
    } = useQuery<any>({
      queryKey: [`township/find-province`],
      queryFn: Auth?.getRequest,
      select: (res: any) => {
        return res?.data;
      },
    } as any);
  const columns: GridColDef[] = [
    { field: "name", headerName: "نام شهر", flex: 2 },
    { field: "code", headerName: "کد شهر", flex: 2 },
    { field: "townShipName", headerName: "شهرستان", flex: 2 },
    { field: "provinceName", headerName: "استان", flex: 2 },
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
    townShipId: string;
  }
  type searchType = {
    name: string;
    inputType: string;
    label: string;
    size: any;
    options?: any;
  };
  const searchItems: searchType[] = [
    {
      name: "name",
      inputType: "text",
      label: "نام شهر",
      size: { md: 4 },
    },
    {
      name: "code",
      inputType: "text",
      label: "کد شهر",
      size: { md: 4 },
    },
    {
      name: "provinceId", 
      inputType: "autocomplete",
      label: "استان",
      size: { md: 4 },
      options: provinceOptions?.map((item:any)=>({id:item.id,value:item.value}))??[],
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
  const [addModalFlag, setAddModalFlag] = useState(false);
  const [deleteData, setDeleteData] = useState<any>(null);
  const [deleteFlag, setDeleteFlag] = useState(false);
  const [searchData, setSearchData] = useState({
    name: "",
    code: "",
    townShipId: "",
  });

  function handleDelete() {
    mutate(
      {
        entity: `city/delete/${deleteData?.id}`,
        method: "delete",
      },
      {
        onSuccess: (res: any) => {
          snackbar(`شهر انتخاب شده با موفقیت حذف شد`, "success");
          StatesData_refetch();
          setDeleteFlag(false);
          setDeleteData(null);
        },
        onError: () => {
          snackbar("خطا در حذف شهر ", "error");
        },
      }
    );
  }
  return (
    <Grid container justifyContent="center">
      <Grid
        container
        item
        md={11}
        sm={11}
        xs={12}
        display={"flex"}
        justifyContent={"space-between"}
        m={2}
        mb={0}
      >
        <Grid item display={"flex"}>
          <Article fontSize="large" />
          <Typography variant="h5">شهر ها</Typography>
        </Grid>
        <Grid item display={"flex"} justifyContent={"space-between"}>
          <CreateNewItem
            sx={{ mr: 2 }}
            name="شهر"
            onClick={() => setAddModalFlag(true)}
          />
          <BackButton onBack={() => navigate(-1)} />
        </Grid>
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
      <AddModal
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
        handleSubmit={handleDelete}
        message={`آیا از حذف ${deleteData?.name} واقع در استان ${deleteData?.provinceName} مطمین میباشید؟`}
        title={"درخواست حذف!"}
      />
    </Grid>
  );
};

export default CityGrid;
