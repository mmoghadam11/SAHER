import { Button } from "@mui/material";
import React from "react";
import { useNavigate } from "react-router-dom";
import AddCircleIcon from "@mui/icons-material/AddCircle";

type Props = {
  icon?: React.ReactElement;
  name: string;
  url?: string;
  onClick?:any;
  sx?:any
};

const CreateNewItem: React.FC<Props> = ({ icon, name, url,onClick,sx}) => {
  const navigate = useNavigate();
  return (
    <Button
      variant="contained"
      endIcon={icon || <AddCircleIcon />}
      onClick={() => {onClick ? onClick() : navigate(url || "new");}}
      color="info"
      sx={{ ...sx,minWidth: "100px", mb: 2 }}
    >
      ایجاد {name} جدید
    </Button>
  );
};

export default CreateNewItem;
