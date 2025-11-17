import { Article, People, Search, Settings, Toc } from "@mui/icons-material";
import {
  Box,
  Button,
  CircularProgress,
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
import ConfirmBox from "components/confirmBox/ConfirmBox";

type Props = {
  all?:boolean
};

const Firms4AccountantGrid = ({all}: Props) => {
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
    // code: "",
  });
  const {
    data: StatesData,
    status: StatesData_status,
    refetch: StatesData_refetch,
  } = useQuery<any>({
    // queryKey: [process.env.REACT_APP_API_URL + `/api/unit-allocations${paramsSerializer(filters)}`],
    // queryKey: [`/api/v1/common-type/find-all${paramsSerializer(filters)}`],
    queryKey: all?[`firm/search${paramsSerializer(filters)}`]:[`firm/search-by-user${paramsSerializer(filters)}`],
    queryFn: Auth?.getRequest,
    select: (res: any) => {
      return res?.data;
    },
    enabled: true,
  } as any);
  const columns: GridColDef[] = [
    { field: "name", headerName: "نام موسسه", flex: 2 },
    { field: "nationalId", headerName: "شناسه ملی موسسه", flex: 1 },
    { field: "registerNo", headerName: "شماره ثبت", flex: 1 },
    { field: "directorNationalCode", headerName: "کد ملی مدیرعامل", flex: 1 },
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
              title: "کارکنان حرفه ای",
              function: () => {
                navigate(`${row.id}`, { state: { firmData: row } });
              },
              icon: <People />,
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
      label: "نام موسسه",
      size: { md: 4 },
    },
    // {
    //   name: "code",
    //   inputType: "text",
    //   label: "کد موسسه",
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
  useEffect(() => {
    if (StatesData?.content.length===1)
      navigate(`${StatesData?.content?.[0].id}`, {
        state: { firmData: StatesData?.content?.[0] },
      });
  }, [StatesData_status, StatesData]);
  if (StatesData_status === "loading")
    return (
      <Box height={"100vh"} textAlign={"center"} alignItems={"center"} justifyContent={"center"}>
        <Typography>لطفا منتظر بمانید...</Typography>
        <CircularProgress />
      </Box>
    );
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
        mb={2}
      >
        <Box display={"flex"}>
          <Article fontSize="large" />
          <Typography variant="h5">{all?"لیست موسسات":"موسسات شما"}</Typography>
        </Box>
      </Grid>
      {all&&<SearchPannel<SearchData>
        searchItems={searchItems}
        searchData={searchData} 
        setSearchData={setSearchData}
        setFilters={setFilters}
      />}
      <Grid item md={11} sm={11} xs={12}>
        {StatesData_status === "success" ? (
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
        ) : null}
      </Grid>

      <ConfirmBox
        open={deleteFlag}
        handleClose={() => {
          setDeleteFlag(false);
          setDeleteData(null);
        }}
        handleSubmit={() =>
          mutate(
            {
              entity: `township/delete/${deleteData?.id}`,
              method: "delete",
            },
            {
              onSuccess: (res: any) => {
                snackbar(`موسسه انتخاب شده با موفقیت حذف شد`, "success");
                StatesData_refetch();
              },
              onError: () => {
                snackbar("خطا در حذف ", "error");
              },
            }
          )
        }
        message={`آیا از حذف ${deleteData?.name} واقع در استان ${deleteData?.provinceName} مطمعین میباشید؟`}
        title={"درخواست حذف!"}
      />
    </Grid>
  );
};

export default Firms4AccountantGrid;
