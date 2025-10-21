import {
  AddCircle,
  Article,
  CheckCircle,
  PersonRemove,
  Search,
  Settings,
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
import { useNavigate, useParams } from "react-router-dom";
import paramsSerializer from "services/paramsSerializer";
import { PAGINATION_DEFAULT_VALUE } from "shared/paginationValue";
import ConfirmBox from "components/confirmBox/ConfirmBox";
import moment from "jalali-moment";
import TerminateCooprationModal from "./components/TerminateCooprationModal";

type Props = {};

const FirmPartnersGrid = (props: Props) => {
  const Auth = useAuth();
  const { id } = useParams();
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
    firstName:"",
    lastName: "",
    // cooperationStatus:true,
    // code: "",
  });
  const {
    data: StatesData,
    status: StatesData_status,
    refetch: StatesData_refetch,
  } = useQuery<any>({
    // queryKey: [`certified-accountant/search${paramsSerializer(filters)}`],
    queryKey: [`firm-partner/search${paramsSerializer(filters)}`],
    queryFn: Auth?.getRequest,
    select: (res: any) => {
      return res?.data;
    },
    enabled: true,
  } as any);
  const columns: GridColDef[] = [
    {
      field: "personnelFirstName",
      headerName: "نام شخص",
      flex: 2,
      renderCell: ({ row }: { row: any }) => {
        return row?.personnelFirstName + " " + row?.personnelLastName;
      },
    },
    {
      field: "birthDate",
      align:"center",
      headerName: "تاریخ شروع همکاری",
      flex: 1,
      renderCell: ({ row }: { row: any }) => {
        if(row?.startDate)return moment(row?.startDate).format("jYYYY/jMM/jDD");
        else return "---"
      },
    },
    {
      field: "endDate",
      align:"center",
      headerName: "تاریخ پایان همکاری",
      flex: 1,
      renderCell: ({ row }: { row: any }) => {
        if(row?.endDate) return moment(row?.endDate).format("jYYYY/jMM/jDD");
        else return "---"
      },
    },
    {
      field: "dang",
      headerName: "سهم الشرکه",
      flex: 1,
    },
    { field: "partnerStatus", headerName: "وضعیت همکاری", flex: 1,
      renderCell: ({ row }: { row: any }) => {
        if(row?.partnerStatus) return <Chip color="secondary" label="فعال" icon={<CheckCircle/>}/>;
        else return <Chip color="default" label="غیر فعال"/>;
      },
     },
    {
      headerName: "عملیات",
      field: "action",
      flex: 1,
      headerAlign: "center",
      align: "center",
      renderCell: ({ row }: { row: any }) => {
        if(row?.partnerStatus===true) return (
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
              title: "اتمام همکاری",
              function: () => {
                setDeleteData(row);
                setDeleteFlag(true);
              },
              icon: <PersonRemove color="error" />,
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
  type searchType = {
    name: string;
    inputType: string;
    label: string;
    size: any;
  };
  const searchItems: searchType[] = [
    {
      name: "personnelFirstName",
      inputType: "text",
      label: "نام شخص",
      size: { md: 4 },
    },
    {
      name: "personnelLastName",
      inputType: "text",
      label: "نام خانوادگی شخص",
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
          <Typography variant="h5">شرکای موسسه</Typography>
        </Box>
        <Box display={"flex"} justifyContent={"space-between"}>
          <Button
            endIcon={<AddCircle />}
            variant="contained"
            color="info"
            onClick={() => navigate("new", { state: { editable: true } })}
            sx={{ minWidth: "100px", mb: 2, mr: 2 }}
          >
            افزودن شریک
          </Button>
          {/* <CreateNewItem
            sx={{ mr: 2 }}
            name="شخص"
            onClick={() => navigate("new", { state: { editable: true } })}
          /> */}
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
      addModalFlag={deleteFlag}
      setAddModalFlag={setDeleteFlag}
      editeData={deleteData}
      setEditeData={setDeleteData}
      refetch={StatesData_refetch}/>
      {/* <ConfirmBox
        open={deleteFlag}
        handleClose={() => {
          setDeleteFlag(false);
          setDeleteData(null);
        }}
        handleSubmit={() =>
          mutate(
            {
              entity: `professional-staff/terminate-cooperation?personnelId=${deleteData?.personnelId}&auditingFirmId=${id}`,
              method: "put",
            },
            {
              onSuccess: (res: any) => {
                snackbar(`اتمام همکاری با شخص انتخاب شده با موفقیت انجام شد`, "success");
                StatesData_refetch();
              },
              onError: () => {
                snackbar("خطا در اتمام همکاری ", "error");
              },
            }
          )
        }
        message={`آیا از اتمام همکاری با ${deleteData?.personnelFirstName}  ${deleteData?.personnelLastName} مطمعین میباشید؟`}
        title={"درخواست حذف!"}
      /> */}
    </Grid>
  );
};

export default FirmPartnersGrid;
