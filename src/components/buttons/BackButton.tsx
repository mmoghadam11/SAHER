import { Button } from "@mui/material";
import React from "react";
import ReplyIcon from "@mui/icons-material/Reply";

type Props = {
  onBack: () => void;
  text?: string;
};

const BackButton: React.FC<Props> = ({ onBack, text = "بازگشت" }) => {
  return (
    <Button
      variant="outlined"
      onClick={() => onBack()}
      endIcon={<ReplyIcon />}
      color="warning"
      sx={{ minWidth: "150px", mb: 2 }}
    >
      بازگشت
    </Button>
  );
};

export default BackButton;
