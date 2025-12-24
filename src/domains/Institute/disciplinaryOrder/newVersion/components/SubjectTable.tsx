import {
  AddCircle,
  ChangeCircle,
  GavelOutlined,
  Close,
  Add,
  Delete,
  Search,
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
} from "@mui/material";
import RenderFormInput from "components/render/formInputs/RenderFormInput";
import React, { useEffect, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { useMutation, useQuery } from "@tanstack/react-query";
import { useAuth } from "hooks/useAuth";
import { useSnackbar } from "hooks/useSnackbar";
import RenderFormDisplay from "components/render/formInputs/RenderFormDisplay";
// مسیر هوک را بر اساس ساختار پروژه خودتان تنظیم کنید

type Props = {
  editable: boolean;
  selectedItems: any;
  setSelectedItems: React.Dispatch<React.SetStateAction<any>>;
  editeData: any;
};

const SubjectTable = ({
  editeData,
  selectedItems,
  setSelectedItems,
  editable,
}: Props) => {
  // دیگر نیازی به id از useParams در این کامپوننت نیست
  // const { id } = useParams();
  const Auth = useAuth();
  const snackbar = useSnackbar();
  const {
    handleSubmit,
    control,
    formState: { errors },
    reset,
    setValue,
    getValues,
    watch,
  } = useForm<any>();
  const [searchKey, setSearchKey] = useState("");
  const {
    data: orderSubjectOptions,
    refetch: searchRefetch,
    isFetching: isSearching,
  } = useQuery<any>({
    // queryKey: [`common-data/find-by-type-all?typeId=48`],
    queryKey: [`disciplinary-subject-base/search-all?code=${searchKey}`],
    queryFn: Auth?.getRequest,
    select: (res: any) => res?.data,
    enabled: false,
  } as any);
  const handleSearchClick = () => {
    if (searchKey.length >= 1) {
      searchRefetch();
    }
  };
  const handleAddItem = (item: any) => {
    // جلوگیری از تکراری بودن
    const exists = selectedItems.find((i: any) => i.id === item.id);
    if (!exists) {
      setSelectedItems((prev: any) => [...prev, item]);
    } else snackbar("این موضوع قبلا انتخاب شده", "warning");
  };
  const handleRemoveItem = (id: any) => {
    setSelectedItems((prev: any) => prev.filter((i: any) => i.id !== id));
  };

  if (editable)
    return (
      <Grid container item xs={12} spacing={2}>
        {/* ستون چپ: جستجو و نتایج */}
        <Grid item xs={12} md={6}>
          <Paper variant="outlined" sx={{ p: 2, height: "100%" }}>
            <Typography
              variant="subtitle1"
              gutterBottom
              sx={{ fontWeight: "bold" }}
            >
              جستجو و افزودن ردیف موضوع تخلف
            </Typography>

            {/* باکس جستجو */}
            <Box display="flex" gap={1} mb={2}>
              <TextField
                label="ردیف موضوع را وارد کنید"
                size="small"
                fullWidth
                value={searchKey}
                onChange={(e) => setSearchKey(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    e.preventDefault();
                    handleSearchClick();
                  }
                }}
              />
              <Button
                variant="contained"
                onClick={handleSearchClick}
                disabled={isSearching}
              >
                {isSearching ? (
                  <CircularProgress size={24} color="inherit" />
                ) : (
                  <Search />
                )}
              </Button>
            </Box>

            {/* جدول نتایج جستجو */}
            <TableContainer sx={{ maxHeight: 300 }}>
              <Table stickyHeader size="small">
                <TableHead>
                  <TableRow>
                    <TableCell>نام</TableCell>
                    <TableCell align="center">افزودن</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {orderSubjectOptions ? (
                    orderSubjectOptions?.map((row: any, index: number) => (
                      <TableRow key={1} hover>
                        <TableCell>
                          <Tooltip title={row.subjectTitle}>
                            <Typography variant="caption">
                              {row.subjectTitle}
                            </Typography>
                          </Tooltip>
                        </TableCell>
                        <TableCell align="center">
                          {(editeData?.cdPersonalityId === 397 &&
                            row?.cerifiedAccountantUsed) ||
                          (editeData?.cdPersonalityId === 396 &&
                            row?.auditingFirmUsed) ? (
                            <IconButton
                              color="primary"
                              size="small"
                              onClick={() => handleAddItem(row)}
                            >
                              <Add />
                            </IconButton>
                          ) : (
                            <Tooltip title="نامتناسب با این پرونده">
                              <Close color="disabled" />
                            </Tooltip>
                          )}
                        </TableCell>
                      </TableRow>
                    ))
                  ) : (
                    // ))
                    <TableRow>
                      <TableCell colSpan={3} align="center">
                        {isSearching
                          ? "در حال جستجو..."
                          : "موردی یافت نشد / جستجو کنید"}
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </TableContainer>
          </Paper>
        </Grid>

        {/* ستون راست: لیست انتخاب شده‌ها */}
        <Grid item xs={12} md={6}>
          <Paper
            variant="outlined"
            sx={{
              p: 2,
              height: "100%",
              bgcolor: (theme) =>
                theme.palette.mode === "light" ? "#f9f9f9" : "#494949ff",
            }}
          >
            <Typography
              variant="subtitle1"
              gutterBottom
              sx={{ fontWeight: "bold", color: "primary.main" }}
            >
              لیست نهایی (انتخاب شده) موضوعات تخلف
            </Typography>

            <TableContainer sx={{ maxHeight: 365 }}>
              <Table stickyHeader size="small">
                <TableHead>
                  <TableRow>
                    <TableCell>نام</TableCell>
                    <TableCell align="center">حذف</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {selectedItems && selectedItems.length > 0 ? (
                    selectedItems.map((row: any, index: number) => (
                      <TableRow key={index}>
                        <TableCell>
                          <Tooltip title={row.subjectTitle}>
                            {row.subjectTitle}
                          </Tooltip>
                        </TableCell>
                        <TableCell align="center">
                          <Tooltip title="حذف">
                            <IconButton
                              color="error"
                              size="small"
                              onClick={() => handleRemoveItem(row.id)}
                            >
                              <Delete fontSize="small" />
                            </IconButton>
                          </Tooltip>
                        </TableCell>
                      </TableRow>
                    ))
                  ) : (
                    <TableRow>
                      <TableCell
                        colSpan={3}
                        align="center"
                        sx={{ color: "text.secondary" }}
                      >
                        هنوز موردی اضافه نشده است
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </TableContainer>
          </Paper>
        </Grid>
      </Grid>
    );
  else
    return (
      <Grid container item xs={12} spacing={2}>
        {/* ستون راست: لیست انتخاب شده‌ها */}
        <Grid item xs={12} md={12}>
          <Paper
            variant="outlined"
            sx={{
              p: 2,
              height: "100%",
              bgcolor: (theme) =>
                theme.palette.mode === "light" ? "#f9f9f9" : "#494949ff",
            }}
          >
            <Typography
              variant="subtitle1"
              gutterBottom
              sx={{
                fontWeight: "bold",
                color: "primary.main",
                textAlign: "center",
              }}
            >
              لیست نهایی موضوعات تخلف
            </Typography>

            <TableContainer sx={{ maxHeight: 365 }}>
              <Table stickyHeader size="small">
                <TableHead>
                  <TableRow>
                    <TableCell align="center">ردیف</TableCell>
                    <TableCell align="center">نام</TableCell>
                    {/* <TableCell align="center">حذف</TableCell> */}
                  </TableRow>
                </TableHead>
                <TableBody>
                  {selectedItems && selectedItems.length > 0 ? (
                    selectedItems.map((row: any, index: number) => (
                      <TableRow key={index}>
                        <TableCell align="center">{row.code}</TableCell>
                        <TableCell align="center">
                          <Tooltip title={row.subjectTitle}>
                            {row.subjectTitle}
                          </Tooltip>
                        </TableCell>
                        {/* <TableCell align="center">
                                          <Tooltip title="حذف">
                                            <IconButton
                                              color="error"
                                              size="small"
                                              onClick={() => handleRemoveItem(row.id)}
                                            >
                                              <Delete fontSize="small" />
                                            </IconButton>
                                          </Tooltip>
                                        </TableCell> */}
                      </TableRow>
                    ))
                  ) : (
                    <TableRow>
                      <TableCell
                        colSpan={3}
                        align="center"
                        sx={{ color: "text.secondary" }}
                      >
                        هنوز موردی اضافه نشده است
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </TableContainer>
          </Paper>
        </Grid>
      </Grid>
    );
};

export default SubjectTable;
