import React from "react";
import { DataGrid, DataGridProps, GridPaginationModel, GridToolbar } from "@mui/x-data-grid";
import { Grid } from "@mui/material";
import { IQueryFilter } from "types/types";

interface Props extends DataGridProps {
  setFilters?: React.Dispatch<React.SetStateAction<IQueryFilter>>;
  filters?: IQueryFilter;
  hideToolbar?: boolean;
}

const TavanaDataGrid = (props: Props) => {
  const { setFilters, filters, hideToolbar=false } = props;
  return (
    <Grid container spacing={0}>
      <Grid item xs={12} sx={{ minHeight: "200px" }}>
        <DataGrid
          sx={{
            "& .MuiTablePagination-actions": {direction: "rtl"}
          }}
          localeText={{
            toolbarDensity: "اندازه",
            toolbarDensityLabel: "اندازه سطر",
            toolbarDensityCompact: "کوچک",
            toolbarDensityStandard: "متوسط",
            toolbarDensityComfortable: "بزرگ",

            toolbarFilters: "فیلتر",
            toolbarFiltersLabel: "فیلتر",
            toolbarFiltersTooltipHide: "مخفی کردن فیلتر",
            toolbarFiltersTooltipShow: "نمایش فیلتر",

            toolbarExport: "دریافت خروجی",
            toolbarExportCSV: "دریافت فایل CSV",
            toolbarExportPrint: "پرینت",

            toolbarColumns: "ستون ها",
            toolbarColumnsLabel: "ستون ها",

            MuiTablePagination: {
              labelRowsPerPage: "تعداد ردیف",
              lang: "fa",
              dir: "rtl",
              labelDisplayedRows: ({ from, to, count }) => {
                return `${from}–${to} از ${count !== -1 ? count : `نمایش بیشتر ${to}`}`;
              },
            },

            noRowsLabel: "داده ای یافت نشد",
          }}
          pageSizeOptions={[5, 10, 20, 50, 100]}
          disableColumnMenu
          {...(setFilters && {
            onSortModelChange: (sort) => {
              setFilters((p) => ({
                ...p,
                sortBy: sort[0]?.field ?? undefined,
                sortDir: sort[0]?.sort ?? undefined,
              }));
            },
            onPaginationModelChange: (pagination: GridPaginationModel) => {
              setFilters((filters) => ({
                ...filters,
                size  : pagination?.pageSize,
                page: pagination?.page+1,
              }));
            },
            paginationMode: "server",
            paginationModel: {
              page: filters?.page ? (filters?.page-1) : 0,
              pageSize: filters?.size || 10,
            },
            // rowCount: filters?.count,
            rowCount: filters?.totalElements,
          })}
          {...props}
          slots={{
            ...hideToolbar ? {} : {toolbar: GridToolbar},
            ...props?.slots,
          }}
        />
      </Grid>
    </Grid>
  );
};

export default TavanaDataGrid;
