import React from "react";
import { Box, IconButton } from "@mui/material";
import EditOutlinedIcon from "@mui/icons-material/EditOutlined";
import DeleteOutlineOutlinedIcon from "@mui/icons-material/DeleteOutlineOutlined";
import VisibilityOutlinedIcon from "@mui/icons-material/VisibilityOutlined";

type Props = {
  onEdit?: (record: any) => void;
  onDelete?: (record: any) => void;
  onView?: (record: any) => void;
};

const TableActions: React.FC<Props> = ({ onEdit, onDelete, onView }) => {
  return (
    <Box>
      {onView && (
        <IconButton onClick={onView} color="primary">
          <VisibilityOutlinedIcon />
        </IconButton>
      )}
      {onEdit && (
        <IconButton onClick={onEdit} color="info">
          <EditOutlinedIcon />
        </IconButton>
      )}
      {onDelete && (
        <IconButton onClick={onDelete} color="error">
          <DeleteOutlineOutlinedIcon />
        </IconButton>
      )}
    </Box>
  );
};

export default TableActions;
