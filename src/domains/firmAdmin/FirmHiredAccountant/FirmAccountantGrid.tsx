import {
  AddCircle,
  Article,
  CheckCircle,
  Close,
  PersonRemove,
  Search,
  Settings,
  Verified,
} from "@mui/icons-material";
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
import { useLocation, useNavigate, useParams } from "react-router-dom";
import paramsSerializer from "services/paramsSerializer";
import { PAGINATION_DEFAULT_VALUE } from "shared/paginationValue";
import ConfirmBox from "components/confirmBox/ConfirmBox";
import moment from "jalali-moment";
import TerminateCooprationModal from "./components/TerminateCooprationModal";
import { FormItem } from "types/formItem";

type Props = {all?:boolean};

const FirmAccountantGrid = ({all}: Props) => {
  const Auth = useAuth();
  const { id } = useParams();
  const {state} =useLocation();
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
    auditingFirmId: id,
    lastName: "",
    // cooperationStatus:true,
    // code: "",
  });
  const {
    data: StatesData,
    status: StatesData_status,
    refetch: StatesData_refetch,
  } = useQuery<any>({
    queryKey: [`membership/search${paramsSerializer(filters)}`],
    queryFn: Auth?.getRequest,
    select: (res: any) => {
      return res?.data;
    },
    enabled: true,
  } as any);
  // const {
  //   data: selectecFirm,
  //   status: selectecFirm_status,
  //   refetch: selectecFirm_refetch,
  // } = useQuery<any>({
  //   queryKey: [`firm/search?id=${id}`],
  //   queryFn: Auth?.getRequest,
  //   select: (res: any) => {
  //     return res?.data;
  //   },
  // } as any);
  const columns: GridColDef[] = [
    // {
    //   field: "personnelFirstName",
    //   headerName: "نام",
    //   flex: 2,
    //   renderCell: ({ row }: { row: any }) => {
    //     return row?.personnelFirstName + " " + row?.personnelLastName;
    //   },
    // },
    {
      field: "membershipNo",
      headerName: "کد عضویت",
      flex: 1,
    },
    {
      field: "firstName",
      headerName: "نام",
      flex: 1,
    },
    {
      field: "lastName",
      headerName: "نام خانوادگی",
      flex: 1.1,
    },
    {
      field: "membershipTypeName",
      headerName: "نوع عضویت",
      flex: 1,
    },
    {
      field: "cooperationStartDate",
      headerName: "شروع همکاری",
      flex: 1,
      renderCell: ({ row }: { row: any }) => {
        if (row?.cooperationStartDate)
          return moment(row?.cooperationStartDate).format("jYYYY/jMM/jDD");
      },
    },
    {
      field: "endDate",
      headerName: "پایان همکاری",
      flex: 1,
      renderCell: ({ row }: { row: any }) => {
        if (row?.cooperationEndDate)
          return moment(row?.cooperationEndDate).format("jYYYY/jMM/jDD");
        else return null;
      },
    },
    {
      field: "lastMembershipCardIssuanceDate",
      headerName: "تاریخ صدور کارت",
      flex: 1,
      renderCell: ({ row }: { row: any }) => {
        if (row?.lastMembershipCardIssuanceDate)
          return moment(row?.lastMembershipCardIssuanceDate).format(
            "jYYYY/jMM/jDD"
          );
        else return null;
      },
    },
    {
      field: "status",
      headerName: "وضعیت",
      flex: 1,
      renderCell: ({ row }: { row: any }) => {
        if (row?.status)
          return <Chip label="فعال" icon={<Verified />} color="secondary" />;
        else return <Chip label="غیر فعال" icon={<Close />} color="default" />;
      },
    },
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
              navigate(`${row.id}`, {
                state: { staffData: row, editable: true },
              });
            }}
            onView={() => {
              setEditeData(row);
              setAddModalFlag(true);
              navigate(`${row.id}`, {
                state: { staffData: row, editable: false },
              });
            }}
            onManage={{
              title: "پایان همکاری",
              function: () => {
                setDeleteData(row);
                setCooprationFlag(true);
              },
              icon: <PersonRemove color="error" />,
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
    personnelFirstName: string;
    personnelLastName: string;
  }

  const searchItems: FormItem[] = [
    {
      name: "firstName",
      inputType: "text",
      label: "نام",
      size: { md: 3 },
    },
    {
      name: "lastName",
      inputType: "text",
      label: "نام خانوادگی",
      size: { md: 3 },
    },
    // {
    //   name: "cooperationStatus",
    //   inputType: "select",
    //   label: "وضعیت",
    //   size: { md: 3 },
    //   options: [
    //     { value: "", title: "همه" },
    //     { value: "true", title: "فعال" },
    //     { value: "false", title: "غیرفعال" },
    //   ],
    // },
    // {
    //   name: "cdProfessionalRankId",
    //   inputType: "autocomplete",
    //   label: "رده حرفه‌ای",
    //   size: { md: 3 },
    //   options: rankOptions?.map((item: any) => ({
    //     id: item.id,
    //     value: item.value,
    //   })) ?? [{ id: 0, value: "خالی" }],
    //   storeValueAs: "id",
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
  const [cooprationFlag, setCooprationFlag] = useState(false);
  const [searchData, setSearchData] = useState({
    personnelFirstName: "",
    personnelLastName: "",
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
          <Typography variant="h5">حسابداران شاغل در موسسه {state?.firmData?.name}</Typography>
        </Box>
        <Box display={"flex"} justifyContent={"space-between"}>
          {/* <Button
            endIcon={<AddCircle />}
            variant="contained"
            color="info"
            onClick={() => navigate("new", { state: { editable: true } })}
            sx={{ minWidth: "100px", mb: 2, mr: 2 }}
          >
            افزودن کارکنان حرفه ای
          </Button> */}
          {!all&&<CreateNewItem
            sx={{ mr: 2 }}
            title="افزودن حسابدار رسمی"
            onClick={() => navigate("new", { state: { editable: true } })}
          />}
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
      <TerminateCooprationModal
        addModalFlag={cooprationFlag}
        setAddModalFlag={setCooprationFlag}
        editeData={deleteData}
        setEditeData={setDeleteData}
        refetch={StatesData_refetch}
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
              entity: `membership/remove/${deleteData?.id}`,
              method: "delete",
            },
            {
              onSuccess: (res: any) => {
                snackbar(
                  `اتمام همکاری با شخص انتخاب شده با موفقیت انجام شد`,
                  "success"
                );
                StatesData_refetch();
                setDeleteFlag(false);
                setDeleteData(null);
              },
              onError: () => {
                snackbar("خطا در اتمام همکاری ", "error");
              },
            }
          )
        }
        // message={`آیا از اتمام همکاری با ${deleteData?.firstName}  ${deleteData?.lastName} مطمعین میباشید؟`}
        message={`آیا از حذف  ${deleteData?.firstName}  ${deleteData?.lastName} مطمعین میباشید؟`}
        title={"درخواست حذف!"}
      />
    </Grid>
  );
};

export default FirmAccountantGrid;
