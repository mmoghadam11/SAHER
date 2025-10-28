import {
  CloseOutlined,
  Diversity3,
  Map,
  PersonAdd,
  Verified,
} from "@mui/icons-material";
import { Box, Chip, Fab, Grid, Tooltip, Typography } from "@mui/material";
import { GridColDef } from "@mui/x-data-grid";
import { useMutation, useQuery } from "@tanstack/react-query";
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
import AddPartner from "./AddPartner";
import ConfirmBox from "components/confirmBox/ConfirmBox";
import moment from "jalali-moment";

type Props = {
  selectedBranch: any;
  setSelectecBranchData: React.Dispatch<React.SetStateAction<any | null>>;
};

const BranchPartnerGrid = ({
  selectedBranch,
  setSelectecBranchData,
}: Props) => {
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
    firmBranchId: selectedBranch?.id ?? "",
  });
  const {
    data: StatesData,
    status: StatesData_status,
    refetch: StatesData_refetch,
  } = useQuery<any>({
    queryKey: [`audited-firm-branch/find-partner${paramsSerializer(filters)}`],
    queryFn: Auth?.getRequest,
    select: (res: any) => {
      return res?.data;
    },
    enabled: true,
  } as any);
  const columns: GridColDef[] = [
    {
      field: "responsiblePersonName",
      headerName: "شریک مستقر در شعبه",
      flex: 1,
    },
    {
      field: "startDate",
      headerName: "تاریخ شروع",
      flex: 1,
      renderCell: ({ row }: { row: any }) => {
        return (
          <Typography>
            {moment(new Date(row?.startDate)).format("jYYYY/jMM/jDD")}
          </Typography>
        );
      },
    },
    {
      field: "endDate",
      headerName: "تاریخ پایان",
      flex: 1,
      renderCell: ({ row }: { row: any }) => {
        if (row.endDate)
          return (
            <Typography>
              {moment(new Date(row?.endDate)).format("jYYYY/jMM/jDD")}
            </Typography>
          );
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
              setEditePartnerData(row);
              setAddPartnerFlag(true);
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

  type editeObjectType = {
    id: number;
    value: string;
    key: string;
    typeId: number;
    typeName: string;
  };
  const [editePartnerData, setEditePartnerData] =
    useState<editeObjectType | null>(null);
  const [addPartnerFlag, setAddPartnerFlag] = useState(false);
  const [appendFirmFlag, setAppendFirmFlag] = useState(false);
  const [deleteData, setDeleteData] = useState<any>(null);
  const [deleteFlag, setDeleteFlag] = useState(false);
  const [searchData, setSearchData] = useState({
    name: "",
    code: "",
  });
  useEffect(() => {
    setFilters((prev: any) => ({ ...prev, firmBranchId: selectedBranch?.id }));
  }, [selectedBranch]);

  return (
    <Grid container item md={12} justifyContent="center" mt={1}>
      <Grid
        item
        md={11}
        sm={11}
        xs={12}
        display={"flex"}
        justifyContent={"space-between"}
        mx={2}
        mb={0}
      >
        <Box display={"flex"} gap={1}>
          <Diversity3 fontSize="medium" />
          <Typography variant="body1">لیست شرکای شعبه انتخابی</Typography>
        </Box>
        <Box display={"flex"} justifyContent={"space-between"} mb={2}>
          <Tooltip title="افزودن شریک">
            <Fab
              size="small"
              sx={{ mr: 1 }}
              onClick={() => {
                setAddPartnerFlag(true);
              }}
            >
              <PersonAdd color="success" />
            </Fab>
          </Tooltip>
          <Tooltip title="بستن">
            <Fab
              size="small"
              onClick={() => {
                setSelectecBranchData(null);
              }}
            >
              <CloseOutlined color="error" />
            </Fab>
          </Tooltip>
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
      <AddPartner
        selectedBranch={selectedBranch}
        refetch={StatesData_refetch}
        addPartnerFlag={addPartnerFlag}
        setAddPartnerFlag={setAddPartnerFlag}
        editePartnerData={editePartnerData}
        setEditePartnerData={setEditePartnerData}
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
              entity: `audited-firm-branch/delete-partner/${deleteData?.id}`,
              method: "delete",
            },
            {
              onSuccess: (res: any) => {
                snackbar(`شریک انتخاب شده با موفقیت حذف شد`, "success");
                StatesData_refetch();
              },
              onError: () => {
                snackbar("خطا در حذف ", "error");
              },
            }
          )
        }
        message={`آیا از حذف شریک موردنظر مطمعین میباشید؟`}
        title={"درخواست حذف!"}
      />
    </Grid>
  );
};

export default BranchPartnerGrid;
