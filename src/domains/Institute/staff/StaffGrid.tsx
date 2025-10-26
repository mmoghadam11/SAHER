import { Article, CheckCircle, Search, Settings } from "@mui/icons-material";
import {
  Box,
  Button,
  Chip,
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
import { FormItem } from "types/formItem";

type Props = {};

const StaffGrid = (props: Props) => {
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
    cooperationStatus: "",
    // code: "",
  });
  const {
    data: StatesData,
    status: StatesData_status,
    refetch: StatesData_refetch,
  } = useQuery<any>({
    queryKey: [`professional-staff/search${paramsSerializer(filters)}`],
    queryFn: Auth?.getRequest,
    select: (res: any) => {
      return res?.data;
    },
    enabled: true,
  } as any);
  const columns: GridColDef[] = [
    // {
    //   field: "personnelFirstName",
    //   headerName: "نام شخص",
    //   flex: 1.5,
    //   renderCell: ({ row }: { row: any }) => {
    //     return row?.personnelFirstName + " " + row?.personnelLastName;
    //   },
    // },
    {
      field: "personnelFirstName",
      headerName: "نام",
      flex: 1.5,
    },
    {
      field: "personnelLastName",
      headerName: "نام خانوادگی",
      flex: 1.5,
    },
    {
      field: "personnelNationalCode",
      headerName: "کد ملی",
      flex: 1.2,
    },
    {
      field: "auditingFirmName",
      headerName: "نام موسسه",
      flex: 1.5,
    },
    {
      field: "birthDate",
      headerName: "شروع همکاری",
      flex: 1,
      renderCell: ({ row }: { row: any }) => {
        return moment(row?.startDate).format("jYYYY/jMM/jDD");
      },
    },
    {
      field: "endDate",
      headerName: "پایان همکاری",
      flex: 1,
      renderCell: ({ row }: { row: any }) => {
        if (row?.endDate) return moment(row?.endDate).format("jYYYY/jMM/jDD");
        else return null;
      },
    },
    {
      field: "cooperationStatus",
      headerName: "وضعیت",
      flex: 1,
      renderCell: ({ row }: { row: any }) => {
        if (row?.cooperationStatus)
          return <Chip color="secondary" label="فعال" icon={<CheckCircle />} />;
        else return <Chip color="default" label="غیر فعال" />;
      },
    },
    { field: "cdProfessionalRankName", headerName: "رده حرفه‌ای", flex: 1 },
    {
      headerName: "عملیات",
      field: "action",
      flex: 1,
      headerAlign: "center",
      align: "center",
      renderCell: ({ row }: { row: any }) => {
        return (
          <TableActions
            onView={() => {
              setEditeData(row);
              setAddModalFlag(true);
              navigate(`${row.auditingFirmId + "/" + row.id}`, {
                state: { staffData: row, editable: false },
              });
            }}
            onEdit={() => {
              setEditeData(row);
              setAddModalFlag(true);
              navigate(`${row.auditingFirmId + "/" + row.id}`, {
                state: { staffData: row, editable: true },
              });
            }}
            // onManage={{
            //   title: "جزئیات شخص",
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
  const {
    data: firmOptions,
    status: firmOptions_status,
    refetch: firmOptions_refetch,
  } = useQuery<any>({
    queryKey: [`firm/search-all`],
    queryFn: Auth?.getRequest,
    select: (res: any) => {
      return res?.data;
    },
  } as any);
  const {
    data: rankOptions,
    status: rankOptions_status,
    refetch: rankOptions_refetch,
  } = useQuery<any>({
    queryKey: [`common-data/find-by-type-all?typeId=25`],
    queryFn: Auth?.getRequest,
    select: (res: any) => {
      return res?.data;
    },
  } as any);

  const searchItems: FormItem[] = [
    {
      name: "personnelFirstName",
      inputType: "text",
      label: "نام",
      size: { md: 3 },
    },
    // {
    //   name: "personnelLastName",
    //   inputType: "text",
    //   label: "نام خانوادگی",
    //   size: { md: 3 },
    // },
    // {
      //   name: "personnelNationalCode",
      //   inputType: "text",
      //   label: "کدملی شخص",
      //   size: { md: 3 },
      // },
      {
        name: "cooperationStatus",
        inputType: "select",
        label: "وضعیت",
        size: { md: 3 },
        options: [
          { value: "", title: "همه" },
          { value: "true", title: "فعال" },
          { value: "false", title: "غیرفعال" },
        ],
      },
      {
        name: "auditingFirmId",
        inputType: "autocomplete",
        label: "موسسه",
        size: { md: 3 },
        options: firmOptions?.map((item: any) => ({
          id: item.id,
          value: item.name,
        })) ?? [{ id: 0, name: "خالی" }],
        storeValueAs: "id",
      },
      {
        name: "cdProfessionalRankId",
        inputType: "autocomplete",
        label: "رده حرفه‌ای",
        size: { md: 3 },
        options: rankOptions?.map((item: any) => ({
          id: item.id,
          value: item.value,
        })) ?? [{ id: 0, value: "خالی" }],
        storeValueAs: "id",
      },
      

    //   {
    //   name: "cdProfessionalRankId",
    //   inputType: "select",
    //   label: "رده حرفه‌ای",
    //   size: { md: 6 },
    //   options: options?.rankOptions?.map((item: any) => ({
    //     value: item?.id,
    //     title: item?.value
    //   })) ?? [{ value: 0, title: "خالی" }],
    //   rules: { required: "انتخاب رده حرفه‌ای الزامی است" },
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
          <Typography variant="h5">کارکنان حرفه‌ای موسسات</Typography>
        </Box>
        <Box display={"flex"} justifyContent={"space-between"}>
          <CreateNewItem
            sx={{ mr: 2 }}
            name="شخص"
            onClick={() => navigate("new", { state: { editable: true } })}
          />
          <BackButton onBack={() => navigate(-1)} />
        </Box>
      </Grid>
      <SearchPannel<any>
        searchItems={searchItems}
        searchData={searchData}
        setSearchData={setSearchData}
        setFilters={setFilters}
      />
      <Grid item md={11} sm={11} xs={12}>
        {StatesData_status === "success" && !!StatesData ? (
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
                snackbar(`شخص انتخاب شده با موفقیت حذف شد`, "success");
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

export default StaffGrid;
