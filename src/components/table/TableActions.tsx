import React from "react";
import { Box, Grid, IconButton, Tooltip } from "@mui/material";
import EditOutlinedIcon from "@mui/icons-material/EditOutlined";
import DeleteOutlineOutlinedIcon from "@mui/icons-material/DeleteOutlineOutlined";
import VisibilityOutlinedIcon from "@mui/icons-material/VisibilityOutlined";
import { AddCircleOutline, ManageAccountsOutlined } from "@mui/icons-material";

type Props = {
  onEdit?: (record: any) => void;
  onDelete?: (record: any) => void;
  onView?: (record: any) => void;
  onAdd?: {
    function: (record: any) => void;
    title?: string;
    icon?: any;
  };
  onManage?: {
    function: (record: any) => void;
    title?: string;
    icon?: any;
  };
};

const TableActions: React.FC<Props> = ({
  onEdit,
  onDelete,
  onView,
  onAdd,
  onManage,
}) => {
  return (
    <Grid container justifyContent="center">
      {onView && (
        <Grid item>
          <Tooltip title="مشاهده">
            <IconButton onClick={onView} color="primary">
              <VisibilityOutlinedIcon />
            </IconButton>
          </Tooltip>
        </Grid>
      )}
      {onEdit && (
        <Grid item>
          <Tooltip title="ویرایش">
            <IconButton onClick={onEdit} color="info">
              <EditOutlinedIcon />
            </IconButton>
          </Tooltip>
        </Grid>
      )}
      {onAdd && (
        <Grid item>
          <Tooltip title={onAdd.title??"افزودن"}>
            <IconButton onClick={onAdd.function} color="primary">
              {onAdd?.icon || <AddCircleOutline />}
            </IconButton>
          </Tooltip>
        </Grid>
      )}
      {onManage && (
        <Grid item>
          <Tooltip title={onManage.title??"جزئیات"}>
            <IconButton onClick={onManage.function} color="primary">
              {onManage?.icon || <ManageAccountsOutlined />}
            </IconButton>
          </Tooltip>
        </Grid>
      )}
      {onDelete && (
        <Grid item>
          <Tooltip title="حذف">
            <IconButton onClick={onDelete} color="error">
              <DeleteOutlineOutlinedIcon />
            </IconButton>
          </Tooltip>
        </Grid>
      )}
    </Grid>
  );
};

export default TableActions;
