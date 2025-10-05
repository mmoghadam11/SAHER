import { Article, Search, Settings } from "@mui/icons-material";
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
import ConfirmBox from "components/confirmBox/ConfirmBox";
import moment from "jalali-moment";

type Props = {};

const MemberShipGrid = (props: Props) => {
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
    firstName: "",
    lastName: "",
    // code: "",
  });
  const {
    data: StatesData,
    status: StatesData_status,
    refetch: StatesData_refetch,
  } = useQuery<any>({
    // queryKey: [process.env.REACT_APP_API_URL + `/api/unit-allocations${paramsSerializer(filters)}`],
    // queryKey: [`/api/v1/common-type/find-all${paramsSerializer(filters)}`],
    queryKey: [`membership/search${paramsSerializer(filters)}`],
    queryFn: Auth?.getRequest,
    select: (res: any) => {
      return res?.data;
    },
    enabled: true,
  } as any);
  const columns: GridColDef[] = [
    {
      field: "firstName",
      headerName: "نام کارمند",
      flex: 2,
      renderCell: ({ row }: { row: any }) => {
        return row?.firstName + " " + row?.lastName;
      },
    },
    {
      field: "latinFirstName",
      headerName: "نام لاتین",
      flex: 1,
      renderCell: ({ row }: { row: any }) => {
        return row?.latinFirstName + " " + row?.latinLastName;
      },
    },
    {
      field: "birthDate",
      headerName: "تاریخ تولد",
      flex: 1,
      renderCell: ({ row }: { row: any }) => {
        return moment(row?.birthDate).format("jYYYY/jMM/jDD");
      },
    },
    { field: "idNumber", headerName: "کد پرسنلی", flex: 1 },
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
              navigate(`${row.id}`, { state: { firmData: row } });
            }}
            onDelete={() => {
              setDeleteData(row);
              setDeleteFlag(true);
            }}
            // onManage={{
            //   title: "جزئیات کارمند",
            //   function: () => {
            //     navigate(`details/${row.id}`, { state: { firmData: row } });
            //   },
            //   icon: <Settings />,
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
      name: "firstName",
      inputType: "text",
      label: "نام کارمند",
      size: { md: 4 },
    },
    {
      name: "lastName",
      inputType: "text",
      label: "نام خانوادگی کارمند",
      size: { md: 4 },
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
          <Article fontSize="large" />
          <Typography variant="h5">کارکنان موسسات</Typography>
        </Box>
        <Box display={"flex"} justifyContent={"space-between"}>
          <CreateNewItem
            sx={{ mr: 2 }}
            name="کارمند"
            onClick={() => navigate("new")}
          />
          <BackButton onBack={() => navigate(-1)} />
        </Box>
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
              entity: `membership/remove/${deleteData?.id}`,
              method: "delete",
            },
            {
              onSuccess: (res: any) => {
                snackbar(`کارمند انتخاب شده با موفقیت حذف شد`, "success");
                StatesData_refetch();
              },
              onError: () => {
                snackbar("خطا در حذف ", "error");
              },
            }
          )
        }
        message={`آیا از حذف ${deleteData?.firstName}  ${deleteData?.lastName} مطمعین میباشید؟`}
        title={"درخواست حذف!"}
      />
    </Grid>
  );
};

export default MemberShipGrid;
