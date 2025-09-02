import { Box, Typography, IconButton } from "@mui/material";
import { Instagram, LinkedIn, GitHub } from "@mui/icons-material";
import "./Footer.scss";

const Footer = () => {
  return (
    <Box
      className="footer"
      sx={{
        color: (theme) => theme.palette.text.primary,
        background: "linear-gradient(to left, #e9efff, #bac7e1)",
        py: 3,
        px: 2,
        display: "flex",
        flexDirection: { xs: "column", md: "row" },
        justifyContent: "center",
        alignItems: "center",
        textAlign: { xs: "center", md: "left" },
      }}
    >
      <Typography variant="body1" >
        IACPA © {new Date().getFullYear()} SAHER
      </Typography>

      
    </Box>
  );
};

export default Footer;
