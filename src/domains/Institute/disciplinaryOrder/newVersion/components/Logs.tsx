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
  Gavel,
  GppGood,
  MarkEmailRead,
  PanTool,
  Verified,
  GppBad,
  CheckCircle,
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
import jalaliMoment from "jalali-moment";
import moment from "moment-timezone";

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
    disciplinaryCaseId: editeData?.id,
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
        "success",
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
      field: "actionName",
      headerName: "وضعیت",
      flex: 1.2,
      align: "center",
      renderCell: ({ row }: { row: any }) => {
        if (row?.actionName === "CASE_REVIEW")
          return <Chip label={"اولیه بدوی"} color="info" />;
        if (row?.actionName === "SUPREME_CREATED")
          return <Chip label={"ایجاد پرونده عالی"} color="info" />;
        if (row?.actionName === "PRIMARY_MEETING_REQUESTED")
          return (
            <Chip
              label={"دعوتنامه"}
              icon={<HistoryEdu sx={{ fontSize: "1rem" }} fontSize="small" />}
            />
          );
        if (row?.actionName === "SUPREME_METTING_REQUEST")
          return (
            <Chip
              label={"دعوتنامه عالی"}
              icon={<HistoryEdu sx={{ fontSize: "1rem" }} fontSize="small" />}
            />
          );
        if (row?.actionName === "CASE_MINISTRY_CONFIRM")
          return (
            <Chip
              label={"تایید وزیر"}
              color="secondary"
              icon={<CheckCircle sx={{ fontSize: "1rem" }} fontSize="small" />}
            />
          );
        if (row?.actionName === "PRIMARY_ORDER_DONE")
          return (
            <Chip
              label={"بدوی"}
              color="info"
              icon={<Gavel sx={{ fontSize: "1rem" }} fontSize="small" />}
            />
          );
        if (row?.actionName === "NOTIFIED")
          return (
            <Chip
              label={"ابلاغ"}
              color={row?.protestOverTime ? "error" : "secondary"}
              icon={
                <MarkEmailRead sx={{ fontSize: "1rem" }} fontSize="small" />
              }
            />
          );

        if (row?.actionName === "PROTEST_REVIEW")
          return (
            <Chip
              label={"اعتراض"}
              color="warning"
              icon={<PanTool sx={{ fontSize: "1rem" }} fontSize="small" />}
            />
          );
        if (row?.actionName === "PROTEST_ACCEPTED")
          return (
            <Chip
              // label={"تایید اعتراض"}
              label={"ارجاع‌به‌عالی"}
              color="success"
              icon={<GppGood sx={{ fontSize: "1rem" }} fontSize="small" />}
            />
          );
        if (row?.actionName === "PROTEST_REJECTED")
          return (
            <Chip
              // label={"تایید اعتراض"}
              label={"رد اعتراض"}
              color="warning"
              icon={<GppBad sx={{ fontSize: "1rem" }} fontSize="small" />}
            />
          );
        if (row?.actionName === "FINAL")
          return (
            <Chip
              label={"قطعی بدوی"}
              color="secondary"
              icon={
                <Verified
                  color="secondary"
                  sx={{ fontSize: "1rem" }}
                  fontSize="small"
                />
              }
            />
          );
        if (row?.processStage === "SUPREME_CREATED")
          return <Chip label={"اولیه عالی"} color="info" />;
        if (row?.processStage === "SUPREME_METTING_REQUEST")
          return (
            <Chip label={"دعوتنامه"} icon={<HistoryEdu fontSize="small" />} />
          );
        if (row?.processStage === "SUPREME_MINISTRY_CONFIRM")
          return (
            <Chip
              label={"در انتظار وزیر"}
              color="warning"
              icon={<Gavel fontSize="small" />}
            />
          );
        if (row?.processStage === "SUPREME_DONE")
          return (
            <Chip
              label={"عالی"}
              color="info"
              icon={<Gavel fontSize="small" />}
            />
          );
        if (row?.disciplinaryCaseStage === "SUPREME_MINISTRY_CONFIRM")
          return (
            <Chip
              label={"در انتظار وزیر"}
              color="warning"
              // icon={<PendingActions sx={{ fontSize: "1rem" }} fontSize="small" />}
            />
          );
        if (row?.processStage === "SUPREME_NOTIFIED")
          return (
            <Chip
              label={"ابلاغ"}
              color="secondary"
              icon={<MarkEmailRead fontSize="small" />}
            />
          );
        // if (
        //   row?.processStage === "SUPREME_FINAL"
        // )
          return (
            <Chip
              label={"قطعی عالی"}
              color="secondary"
              icon={<Verified color="secondary" fontSize="small" />}
            />
          );
      },
    },
    { field: "comment", headerName: "توضیحات", flex: 1.2 },
    {
      field: "actionDate",
      headerName: "تاریخ",
      flex: 1,
      renderCell: ({ row }: { row: any }) => {
        if (row?.actionDate)
          return (
            <Typography variant="caption">
              {/* {jalaliMoment(moment.tz(row?.actionDate, "Asia/Tehran").toDate()).format("HH:mm jYYYY/jMM/jDD")} */}
              {jalaliMoment(row?.actionDate).format("HH:mm jYYYY/jMM/jDD")}
            </Typography>
          );
      },
    },
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
            <Typography variant="h6">گردش پرونده انتظامی</Typography>
          </Box>
          <IconButton onClick={handleClose} size="small">
            <Close />
          </IconButton>
        </Box>
      </DialogTitle>

      <DialogContent
        // sx={editable ? { overflowx: "visible", overflowY: "auto" } : {}}
        sx={{ overflow: "visible", display: "flex", justifyContent: "center" }}
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
