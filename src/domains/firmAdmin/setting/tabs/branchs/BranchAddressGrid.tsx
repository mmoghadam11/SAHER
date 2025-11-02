import { CloseOutlined, Map, Verified } from "@mui/icons-material";
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
import AddAddress from "./AddAddress";

type Props = {
  selectedBranch: any;
  setSelectecBranchData: React.Dispatch<React.SetStateAction<any | null>>;
};

const BranchAddressGrid = ({
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
    queryKey: [`audited-firm-branch/find-address${paramsSerializer(filters)}`],
    queryFn: Auth?.getRequest,
    select: (res: any) => {
      return res?.data;
    },
    enabled: true,
  } as any);
  const columns: GridColDef[] = [
    { field: "cityName", headerName: "شهر", flex: 1 },
    { field: "street", headerName: "خیابان", flex: 1 },
    { field: "plateNo", headerName: "پلاک", flex: 1 },
    { field: "postalCode", headerName: "کد پستی", flex: 1 },
    {
      field: "active",
      headerName: "آدرس فعال",
      flex: 1,
      renderCell: ({ row }: { row: any }) => {
        if (row.active) return <Chip color="secondary" label="فعال" icon={<Verified  />}/>;
        else return<Chip color="default" label="غیر فعال"/>
      },
    },
    {
      headerName: "عملیات",
      field: "action",
      flex: 1,
      headerAlign: "center",
      align: "center",
      renderCell: ({ row }: { row: any }) => {
        if (row.active)
          return (
            <TableActions
              onEdit={() => {
                setEditeAddressData(row);
                setAddAddressFlag(true);
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
  const [editeAddressData, setEditeAddressData] =
    useState<editeObjectType | null>(null);
  const [addAddressFlag, setAddAddressFlag] = useState(false);
  const [appendFirmFlag, setAppendFirmFlag] = useState(false);
  const [deleteAddressData, setDeleteAddressData] = useState<any>(null);
  const [deleteFlag, setDeleteFlag] = useState(false);
  const [searchData, setSearchData] = useState({
    name: "",
    code: "",
  });
  useEffect(() => {
    setFilters((prev:any)=>({...prev,firmBranchId: selectedBranch?.id}))
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
        <Box display={"flex"}>
          <Map fontSize="medium" />
          <Typography variant="body1">لیست آدرس‌های شعبه انتخابی</Typography>
        </Box>
        <Box display={"flex"} justifyContent={"space-between"} mb={2}>
          <Tooltip title="تغییر آدرس فعال">
            <Fab
              size="small"
              sx={{ mr: 1 }}
              onClick={() => {
                setAddAddressFlag(true);
              }}
            >
              <Map color="success" />
            </Fab>
          </Tooltip>
          <Tooltip title="">
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
      <AddAddress
        selectedBranch={selectedBranch}
        refetch={StatesData_refetch}
        addAddressFlag={addAddressFlag}
        setAddAddressFlag={setAddAddressFlag}
        editeAddressData={editeAddressData}
        setEditeAddressData={setEditeAddressData}
      />
    </Grid>
  );
};

export default BranchAddressGrid;
