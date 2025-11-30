import {
  AccountCircle,
  Article,
  Search,
  Settings,
  Toc,
} from "@mui/icons-material";
import {
  Avatar,
  Box,
  Button,
  Dialog,
  DialogTitle,
  Grid,
  IconButton,
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
import { FormItem } from "types/formItem";
import NewSearchPannel from "components/form/NewSearchPannel";
import { useAuthorization } from "hooks/useAutorization";
import { isMobile } from "react-device-detect";
import VerticalTable from "components/dataGrid/VerticalTable";
import ProfileDialog from "../../../components/ProfileDialog";

type Props = {};

const OfficialUserGrid = (props: Props) => {
  const Auth = useAuth();
  const { hasMenuAccess } = useAuthorization();
  const snackbar = useSnackbar();
  const navigate = useNavigate();
  const { state } = useLocation();
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
    nationalCode: hasMenuAccess(["accountant-showmenu"])
      ? Auth.userInfo.nationalCode
      : "",
    ...state?.searchFilters,
    // code: "",
  });

  useEffect(() => {
    setFilters((prev: any) => ({
      ...prev,
      ...state?.searchFilters,
    }));
    setSearchData((prev: any) => ({
      ...prev,
      ...state?.searchFilters,
    }));
  }, [state]);

  const {
    data: StatesData,
    status: StatesData_status,
    refetch: StatesData_refetch,
  } = useQuery<any>({
    queryKey: [`certified-accountant/search${paramsSerializer(filters)}`],
    queryFn: Auth?.getRequest,
    select: (res: any) => {
      return res?.data;
    },
    enabled: !!Auth.userInfo,
  } as any);
  const columns: GridColDef[] = [
    {
      field: "image",
      headerName: "پروفایل",
      flex: 1,
      renderCell: ({ row }: { row: any }) => {
        return (
          <IconButton onClick={() => {
            setEditeData(row);
            setProfileDialogFlag(true);
          }}>
            <Avatar
              // src={avatarUrl ?? undefined}
              src={
                process.env.REACT_APP_Image_URL +
                row?.profileImageUrl
              }
              sx={{
                width: 40,
                height: 40,
                border: "2px solid",
                borderColor: "divider",
              }}
            >
              <AccountCircle sx={{ width: 40, height: 40 }} color="inherit" />
            </Avatar>
          </IconButton>
        );
      },
    },
    // {
    //   field: "firstName",
    //   headerName: "نام حسابدار رسمی",
    //   flex: 2,
    //   renderCell: ({ row }: { row: any }) => {
    //     return row?.firstName + " " + row?.lastName;
    //   },
    // },
    {
      field: "firstName",
      headerName: "نام",
      flex: 1,
    },
    {
      field: "lastName",
      headerName: "نام خانوادگی",
      flex: 1,
    },
    {
      field: "membershipNo",
      headerName: "کد عضویت",
      flex: 1,
    },
    {
      field: "cdMembershipTypeName",
      headerName: "نوع عضویت",
      flex: 1,
    },
    {
      field: "auditingFirmName",
      headerName: "موسسه",
      flex: 1,
    },
    {
      field: "nationalCode",
      headerName: "کد ملی",
      flex: 1,
    },
    {
      field: "mobileNo",
      headerName: "تلفن همراه",
      flex: 1,
    },
    {
      field: "birthPlaceName",
      headerName: "شهر تولد",
      flex: 1,
    },
    // {
    //   field: "latinFirstName",
    //   headerName: "نام لاتین",
    //   flex: 1,
    //   renderCell: ({ row }: { row: any }) => {
    //     return row?.latinFirstName + " " + row?.latinLastName;
    //   },
    // },
    {
      field: "birthDate",
      headerName: "تاریخ تولد",
      flex: 1,
      renderCell: ({ row }: { row: any }) => {
        return moment(row?.birthDate).format("jYYYY/jMM/jDD");
      },
    },
    {
      field: "cdServiceTypeName",
      headerName: "وضعیت فعالیت",
      flex: 1,
    },
    {
      field: "cdDisciplinaryOrderStatusName",
      headerName: "وضعیت انتظامی",
      flex: 1,
    },
    {
      headerName: "عملیات",
      field: "action",
      flex: 1,
      headerAlign: "center",
      align: "center",
      renderCell: ({ row }: { row: any }) => {
        if (!hasMenuAccess(["accountant-showmenu"]))
          return (
            <TableActions
              onEdit={() => {
                navigate(`${row.id}`, {
                  state: {
                    accountantData: row,
                    editable: true,
                    searchFilters: filters,
                  },
                });
              }}
              onView={() => {
                navigate(`${row.id}`, {
                  state: {
                    accountantData: row,
                    editable: false,
                    searchFilters: filters,
                  },
                });
              }}
              onDelete={() => {
                setDeleteData(row);
                setDeleteFlag(true);
              }}
              onManage={{
                title: "جزئیات حسابدار رسمی",
                function: () => {
                  navigate(`details/${row.id}`, {
                    state: { accountantData: row, searchFilters: filters },
                  });
                },
                icon: <Toc />,
              }}
            />
          );
        else
          return (
            <TableActions
              onView={() => {
                navigate(`${row.id}`, {
                  state: {
                    accountantData: row,
                    editable: false,
                    searchFilters: filters,
                  },
                });
              }}
              // onManage={{
              //   title: "جزئیات حسابدار رسمی",
              //   function: () => {
              //     navigate(`details/${row.id}`, {
              //       state: { accountantData: row, searchFilters: filters },
              //     });
              //   },
              //   icon: <Toc />,
              // }}
            />
          );
      },
    },
  ];
  const {
    data: membershipType,
    status: membershipType_status,
    refetch: membershipType_refetch,
  } = useQuery<any>({
    queryKey: [`common-data/find-by-type-all?typeId=26`],
    queryFn: Auth?.getRequest,
    select: (res: any) => {
      return res?.data;
    },
  } as any);
  const {
    data: serviceTypeOptions,
    status: serviceTypeOptions_status,
    refetch: serviceTypeOptions_refetch,
  } = useQuery<any>({
    queryKey: [`common-data/find-by-type-all?typeId=49`],
    queryFn: Auth?.getRequest,
    select: (res: any) => {
      return res?.data;
    },
  } as any);
  interface SearchData {
    name: string;
    code: string;
  }
  const searchItems: FormItem[] = [
    {
      name: "lastName",
      inputType: "text",
      label: "نام خانوادگی",
      size: { md: 2.4 },
    },
    {
      name: "nationalCode",
      inputType: "text",
      label: "کد ملی",
      size: { md: 2.4 },
    },
    {
      name: "membershipNo",
      inputType: "text",
      label: "کد عضویت",
      size: { md: 2.4 },
    },
    {
      name: "cdMembershipTypeId",
      inputType: "autocomplete",
      label: "نوع عضویت",
      size: { md: 2.4 },
      options: membershipType?.map((item: any) => ({
        value: item.id,
        title: item.value,
      })) ?? [{ value: 0, title: "خالی" }],
      storeValueAs: "id",
    },
    {
      name: "cdServiceTypeId",
      inputType: "autocomplete",
      label: "وضعیت فعالیت",
      size: { md: 2.4 },
      options: serviceTypeOptions?.map((item: any) => ({
        value: item.id,
        title: item.value,
      })) ?? [{ value: 0, title: "خالی" }],
      storeValueAs: "id",
    },
    // {
    //   name: "cdMembershipTypeId",
    //   inputType: "autocomplete",
    //   label: "نوع عضویت",
    //   size: { md: 2.4 },
    //   options: membershipType?.map((item: any) => ({
    //     id: item.id,
    //     value: item.value,
    //   })) ?? [{ id: 0, value: "خالی" }],
    //   storeValueAs: "id",
    // },
    // {
    //   name: "cdServiceTypeId",
    //   inputType: "autocomplete",
    //   label: "وضعیت فعالیت",
    //   size: { md: 2.4 },
    //   options: serviceTypeOptions?.map((item: any) => ({
    //     id: item.id,
    //     value: item.value,
    //   })) ?? [{ id: 0, value: "خالی" }],
    //   storeValueAs: "id",
    // },
  ];
  
  const [editeData, setEditeData] = useState<any>(null);
  const [profileDialogFlag, setProfileDialogFlag] = useState(false);
  const [deleteData, setDeleteData] = useState<any>(null);
  const [deleteFlag, setDeleteFlag] = useState(false);
  const [searchData, setSearchData] = useState({
    ...state?.searchFilters,
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
          <Typography variant="h5">حسابداران رسمی</Typography>
        </Box>
        <Box display={"flex"} justifyContent={"space-between"}>
          {!hasMenuAccess(["accountant-showmenu"]) && (
            <CreateNewItem
              sx={{ mr: 2 }}
              name="حسابدار رسمی"
              onClick={() => navigate("new", { state: { editable: true } })}
            />
          )}

          <BackButton onBack={() => navigate(-1)} />
        </Box>
      </Grid>
      {!hasMenuAccess(["accountant-showmenu"]) && (
        <NewSearchPannel<SearchData>
          searchItems={searchItems}
          searchData={searchData}
          setSearchData={setSearchData}
          setFilters={setFilters}
        />
      )}

      <Grid item md={11} sm={11} xs={12}>
        {StatesData_status === "success" && !!StatesData ? (
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
              getRowHeight={() => "auto"}
              autoHeight
              hideToolbar
            />
          )
        ) : null}
      </Grid>

      <ProfileDialog
      onClose={()=>{setProfileDialogFlag(false)}}
      open={profileDialogFlag}
      currentAvatarUrl={editeData?.profileImageUrl??""}
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
              entity: `certified-accountant/remove/${deleteData?.id}`,
              method: "delete",
            },
            {
              onSuccess: (res: any) => {
                snackbar(`حسابدار رسمی انتخاب شده با موفقیت حذف شد`, "success");
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

export default OfficialUserGrid;
