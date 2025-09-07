import { Article } from "@mui/icons-material";
import { Box, Grid, Typography } from "@mui/material";
import { GridColDef } from "@mui/x-data-grid";
import { useQuery } from "@tanstack/react-query";
import TavanaDataGrid from "components/dataGrid/TavanaDataGrid";
import TableActions from "components/table/TableActions";
import { useAuth } from "hooks/useAuth";
import { useSnackbar } from "hooks/useSnackbar";
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import paramsSerializer from "services/paramsSerializer";
import { PAGINATION_DEFAULT_VALUE } from "shared/paginationValue";

type Props = {};

const PublicData = (props: Props) => {
  const Auth = useAuth();
  const snackbar = useSnackbar();
  const navigate = useNavigate();
  const [filters, setFilters] = useState<any>({
    ...PAGINATION_DEFAULT_VALUE,
    // nationalCode: null,
  });
  const {
    data: basicData,
    status: basicData_status,
    refetch: basicData_refetch,
  } = useQuery<any>({
    // queryKey: [process.env.REACT_APP_API_URL + `/api/unit-allocations${paramsSerializer(filters)}`],
    queryKey: [`/city/find-all${paramsSerializer(filters)}`],
    queryFn: Auth?.getRequest,
    select: (res: any) => {
      return res?.data;
    },
  } as any);
  const columns: GridColDef[] = [
    { field: "name", headerName: "عنوان", flex: 5 },
    // { field: "apartmentPriceInRials", headerName: "نوع", flex: 1.5 },
    // { field: "differencePrice", headerName: "شرح", flex: 1.5 },
    // { field: "memberSelectionOrder", headerName: "اولویت عضو", flex: 1 },
    {
      headerName: "عملیات",
      field: "action",
      flex: 1,
      headerAlign: "center",
      align: "center",
      renderCell: ({ row }: { row: any }) => {
        return (
          <TableActions
              // onEdit={
              //   () => {
              //       navigate(`${row.id}`);
              //     }
              // }
          />
        );
      },
    },
  ];
  return (
    <Grid container justifyContent="center">
      <Grid item md={11} sm={11} xs={12} display={"flex"} m={2}>
        <Article fontSize="large"/>
        <Typography variant="h5">اطلاعات شهرها</Typography>
      </Grid>
      <Grid item md={11} sm={11} xs={12}>
        {
            basicData_status==="success"?(
                <TavanaDataGrid
                  rows={basicData?.content}
                  columns={columns}
                  filters={filters}
                  setFilters={setFilters}
                  rowCount={basicData?.totalElements}
                  autoHeight
                />
            ):null
        }
      </Grid>
    </Grid>
  );
};

export default PublicData;
