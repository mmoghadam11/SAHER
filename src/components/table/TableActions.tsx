import React from "react";
import { Box, IconButton, Tooltip } from "@mui/material";
import EditOutlinedIcon from "@mui/icons-material/EditOutlined";
import DeleteOutlineOutlinedIcon from "@mui/icons-material/DeleteOutlineOutlined";
import VisibilityOutlinedIcon from "@mui/icons-material/VisibilityOutlined";
import { AddCircleOutline } from "@mui/icons-material";

type Props = {
  onEdit?: (record: any) => void;
  onDelete?: (record: any) => void;
  onView?: (record: any) => void;
  onAdd?: {
    function: (record: any) => void;
    title: string;
  };
};

const TableActions: React.FC<Props> = ({ onEdit, onDelete, onView, onAdd }) => {
  return (
    <Box>
      {onView && (
        <Tooltip title="مشاهده">
          <IconButton onClick={onView} color="primary">
            <VisibilityOutlinedIcon />
          </IconButton>
        </Tooltip>
      )}
      {onAdd && (
        <Tooltip title={onAdd.title}>
          <IconButton onClick={onAdd.function} color="primary">
            <AddCircleOutline />
          </IconButton>
        </Tooltip>
      )}
      {onEdit && (
        <Tooltip title="ویرایش">
          <IconButton onClick={onEdit} color="info">
            <EditOutlinedIcon />
          </IconButton>
        </Tooltip>
      )}
      {onDelete && (
        <Tooltip title="حذف">
          <IconButton onClick={onDelete} color="error">
            <DeleteOutlineOutlinedIcon />
          </IconButton>
        </Tooltip>
      )}
    </Box>
  );
};

export default TableActions;
