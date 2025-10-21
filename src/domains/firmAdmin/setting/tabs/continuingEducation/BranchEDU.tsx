import { CloseOutlined, Map, People, PersonAddAlt1, Verified } from "@mui/icons-material";
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
import AddEDU from "./AddEDU";
import moment from "jalali-moment";

type Props = {
  selectedEDUId: any;
  setSelectecBranchData: React.Dispatch<React.SetStateAction<any | null>>;
};

const BranchEDU = ({
  selectedEDUId,
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
    firm : id ?? "",
  });
  const {
    data: StatesData,
    status: StatesData_status,
    refetch: StatesData_refetch,
  } = useQuery<any>({
    queryKey: [`firm-prof-edu-personnel/find-by-firm${paramsSerializer(filters)}`],
    queryFn: Auth?.getRequest,
    select: (res: any) => {
      return res?.data;
    },
    enabled: true,
  } as any);
  const columns: GridColDef[] = [
    { field: "auditingFirmName", headerName: "موسسه", flex: 1 },
    {
      field: "active",
      headerName: "آدرس فعال",
      flex: 1,
      renderCell: ({ row }: { row: any }) => {
        return(row?.personnelFirstName+" "+row?.personnelLastName)
      },
    },
    { field: "termScore", headerName: "نمره ترم", flex: 1 },
    { field: "certificateDate", headerName: "تاریخ مدرک", flex: 1 ,
      renderCell: ({ row }: { row: any }) => {
          if(row?.certificateDate)
            return (
            moment(row?.certificateDate).format("jYYYY/jMM/jDD")
          );
      },
    },
    { field: "certificateNo", headerName: "شماره مدرک", flex: 1 },
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
                setEditeEDUPersonelData(row);
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
  const [editeEDUPersonelData, setEditeEDUPersonelData] =
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
    setFilters((prev:any)=>({...prev,firmBranchId: selectedEDUId?.id}))
  }, [selectedEDUId]);

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
          <People fontSize="medium" />
          <Typography variant="body1">دانشپذیران دوره آموزشی انتخاب شده</Typography>
        </Box>
        <Box display={"flex"} justifyContent={"space-between"} mb={2}>
          <Tooltip title="افزودن دانشپذیر">
            <Fab
              size="small"
              sx={{ mr: 1 }}
              onClick={() => {
                setAddAddressFlag(true);
              }}
            >
              <PersonAddAlt1 color="primary" />
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
      <AddEDU
        selectedEDUId={selectedEDUId}
        refetch={StatesData_refetch}
        addAddressFlag={addAddressFlag}
        setAddAddressFlag={setAddAddressFlag}
        editeEDUPersonelData={editeEDUPersonelData}
        setEditeEDUPersonelData={setEditeEDUPersonelData}
      />
    </Grid>
  );
};

export default BranchEDU;
