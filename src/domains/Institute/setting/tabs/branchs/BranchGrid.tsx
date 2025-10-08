import { Close, Diversity3, Key, ManageAccounts, Map, Toc, Verified } from "@mui/icons-material";
import { Box, Chip, Grid, Typography } from "@mui/material";
import { GridColDef, GridToolbar } from "@mui/x-data-grid";
import { useMutation, useQuery } from "@tanstack/react-query";
import BackButton from "components/buttons/BackButton";
import CreateNewItem from "components/buttons/CreateNewItem";
import TavanaDataGrid from "components/dataGrid/TavanaDataGrid";
import TableActions from "components/table/TableActions";
import { useAuth } from "hooks/useAuth";
import { useSnackbar } from "hooks/useSnackbar";
import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { useNavigate, useParams } from "react-router-dom";
import paramsSerializer from "services/paramsSerializer";
import { PAGINATION_DEFAULT_VALUE } from "shared/paginationValue";
import VerticalTable from "components/dataGrid/VerticalTable";
import { isMobile } from "react-device-detect";
import moment from "jalali-moment";
import ConfirmBox from "components/confirmBox/ConfirmBox";
import AddBranch from "./AddBranch";
import BranchAddressGrid from "./BranchAddressGrid";
import BranchPartnerGrid from "./partner/BranchPartnerGrid";

type Props = {};

const BranchGrid = ({}: Props) => {
  const { id } = useParams();
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
    firmId: id,
  });
  const {
    data: StatesData,
    status: StatesData_status,
    refetch: StatesData_refetch,
  } = useQuery<any>({
    queryKey: [`audited-firm-branch/find${paramsSerializer(filters)}`],
    queryFn: Auth?.getRequest,
    select: (res: any) => {
      return res?.data;
    },
    enabled: true,
  } as any);
  const columns: GridColDef[] = [
    {
      field: "newspaperNotificationNo",
      headerName: "شماره آگهی روزنامه رسمی",
      flex: 1,
    },
    {
      field: "newspaperNotificationDate",
      headerName: "تاریخ آگهی روزنامه رسمی",
      flex: 1,
      renderCell: ({ row }: { row: any }) => {
        return (
          <Typography>
            {moment(new Date(row?.newspaperNotificationDate)).format(
              "jYYYY/jMM/jDD"
            )}
          </Typography>
        );
      },
    },
    { field: "morguePlace", headerName: "محل نگهداری اسناد", flex: 1 },
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
              // navigate(`${row.id}`, { state: { userData: row } });
              setEditeData(row);
              setAddModalFlag(true);
            }}
            onDelete={() => {
              setDeleteData(row);
              setDeleteFlag(true);
            }}
            onManage={{
              icon:<Map/>,
              title: "آدرس ها",
              function: () => {
                setSelectecBranchData(row);
                setGridFlag(1);
              },
            }}
            onAdd={{
              icon:<Diversity3 color="action"/>,
              title: "شرکا",
              function: () => {
                setSelectecBranchData(row);
                setGridFlag(2);
              },
            }}
          />
        );
      },
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
  const [selectecBranchData, setSelectecBranchData] =useState<editeObjectType | null>(null);
  const [addModalFlag, setAddModalFlag] = useState(false);
  const [gridFlag, setGridFlag] = useState(0);
  const [appendFirmFlag, setAppendFirmFlag] = useState(false);
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
    <Grid container item md={12} justifyContent="center">
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
          <Typography variant="h5">لیست شعبه ها</Typography>
        </Box>
        <Box display={"flex"} justifyContent={"space-between"}>
          <CreateNewItem
            sx={{ mr: 2 }}
            name="شعبه"
            // onClick={() => navigate("new")}
            onClick={() => {
              // navigate("new")
              // setActiveTab(1);
              setAddModalFlag(true);
            }}
          />
        </Box>
      </Grid>

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
              getRowHeight={() => "auto"}
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
        ) : (
          <Typography variant="body1">
            اطلاعاتی برای نمایش موجود نمیباشد
          </Typography>
        )}
      </Grid>
        {!!selectecBranchData && gridFlag===1 ? (
          <BranchAddressGrid selectedBranch={selectecBranchData} setSelectecBranchData={setSelectecBranchData} />
        ):!!selectecBranchData && gridFlag===2&&(
          <BranchPartnerGrid selectedBranch={selectecBranchData} setSelectecBranchData={setSelectecBranchData} />
        )
        }
      <AddBranch
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
              entity: `audited-firm-branch/delete/${deleteData?.id}`,
              method: "delete",
            },
            {
              onSuccess: (res: any) => {
                snackbar(`کاربر انتخاب شده با موفقیت حذف شد`, "success");
                StatesData_refetch();
              },
              onError: () => {
                snackbar("خطا در حذف ", "error");
              },
            }
          )
        }
        message={`آیا از حذف شعبه شماره ${deleteData?.newspaperNotificationNo} مطمعین میباشید؟`}
        title={"درخواست حذف!"}
      />
    </Grid>
  );
};

export default BranchGrid;
