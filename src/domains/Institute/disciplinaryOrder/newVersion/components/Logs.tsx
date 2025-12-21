import {
  AddCircle,
  ChangeCircle,
  GavelOutlined,
  Close,
  Add,
  Delete,
  Search,
  HistoryEdu,
  MenuBook,
  People,
  BusinessCenter,
} from "@mui/icons-material";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  Grid,
  Typography,
  Button,
  IconButton,
  Box,
  CircularProgress,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TextField,
  Tooltip,
  Chip,
} from "@mui/material";
import RenderFormInput from "components/render/formInputs/RenderFormInput";
import React, { useEffect, useMemo, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { useMutation, useQuery } from "@tanstack/react-query";
import { useAuth } from "hooks/useAuth";
import { useSnackbar } from "hooks/useSnackbar";
import RenderFormDisplay from "components/render/formInputs/RenderFormDisplay";
import { FormItem } from "types/formItem";
import paramsSerializer from "services/paramsSerializer";
import TavanaDataGrid from "components/dataGrid/TavanaDataGrid";
import VerticalTable from "components/dataGrid/VerticalTable";
import { isMobile } from "react-device-detect";
import { GridColDef } from "@mui/x-data-grid";
import { PAGINATION_DEFAULT_VALUE } from "shared/paginationValue";

// مسیر هوک را بر اساس ساختار پروژه خودتان تنظیم کنید

type Props = {
  editable: boolean;
  refetch: () => void;
  addModalFlag: boolean;
  setAddModalFlag: React.Dispatch<React.SetStateAction<boolean>>;
  editeData: any;
  setEditeData: React.Dispatch<React.SetStateAction<any>>;
};

const Logs = ({
  editable,
  addModalFlag,
  setAddModalFlag,
  refetch,
  editeData,
  setEditeData,
}: Props) => {
  // دیگر نیازی به id از useParams در این کامپوننت نیست
  // const { id } = useParams();
  const Auth = useAuth();
  const snackbar = useSnackbar();

  const [filters, setFilters] = useState<any>({
    ...PAGINATION_DEFAULT_VALUE,
    id: editeData?.id,
  });
  const {
    data: StatesData,
    status: StatesData_status,
    refetch: StatesData_refetch,
  } = useQuery<any>({
    queryKey: [`disciplinary-log/search${paramsSerializer(filters)}`],
    queryFn: Auth?.getRequest,
    select: (res: any) => {
      return res?.data;
    },
    enabled: !!editeData && addModalFlag,
  } as any);
  const { mutate, isLoading } = useMutation({
    mutationFn: Auth?.serverCall,
    onSuccess: () => {
      snackbar(
        !!editeData
          ? `گزارشات با موفقیت به‌روزرسانی شد`
          : `گزارشات جدید با موفقیت افزوده شد`,
        "success"
      );
      refetch();
      handleClose();
    },
    onError: () => {
      snackbar("خطا در ثبت گزارشات", "error");
    },
  });
  const handleClose = () => {
    setAddModalFlag(false);
    setEditeData(null);
  };

  const columns: GridColDef[] = [
    {
      field: "respondenType",
      headerName: "نوع شخصیت حسابرس",
      flex: 1.2,
      align: "center",
      renderCell: ({ row }: { row: any }) => {
        if (row?.cdRespondenTypeId === 397)
          return (
            <Tooltip title="حسابدار رسمی">
              <Chip
                size="small"
                label="حسابدار رسمی"
                icon={<People fontSize="small" />}
                color="info"
              />
            </Tooltip>
          );
        if (row?.cdRespondenTypeId === 396)
          return (
            <Tooltip title="موسسه">
              <Chip
                size="small"
                label="موسسه"
                icon={<BusinessCenter fontSize="small" />}
                color="warning"
              />
            </Tooltip>
          );
      },
    },
    { field: "subject", headerName: "نام شخصیت", flex: 1.2 },
  ];
  return (
    <Dialog
      open={addModalFlag}
      onClose={handleClose}
      maxWidth={"sm"}
      PaperProps={{ sx: { overflow: "visible" } }}
      fullWidth
    >
      <DialogTitle>
        <Box display="flex" justifyContent="space-between" alignItems="center">
          <Box display="flex" textAlign="center" alignItems="center" gap={1}>
            <MenuBook fontSize="large" />
            <Typography variant="h6">گزارشات پرونده انتظامی</Typography>
          </Box>
          <IconButton onClick={handleClose} size="small">
            <Close />
          </IconButton>
        </Box>
      </DialogTitle>

      <DialogContent
        // sx={editable ? { overflowx: "visible", overflowY: "auto" } : {}}
        sx={{ overflow: "visible", display: "flex", justifyContent: "center", }}
      >
        {/* <Grid container  width={"lg"}>
          <Grid item md={11} sm={11} xs={12}> */}
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
                />
              )
            ) : null}
          {/* </Grid>
        </Grid> */}
      </DialogContent>
    </Dialog>
  );
};

export default Logs;
