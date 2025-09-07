import React, {useEffect} from "react";
// import { useKeycloak } from "@react-keycloak/web";
import TavanaSpinner from "components/spinner/TavanaSpinner";
import { useAuth } from "hooks/useAuth";
import Layout from "components/layout/Layout";
import { Outlet } from "react-router-dom";
import { Typography } from "@mui/material";

function Welcome() {
    const Auth = useAuth();
    return<Typography>خوش آمدید</Typography>;
}

export default Welcome;
