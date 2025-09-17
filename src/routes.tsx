import React, { useContext } from "react";
import { Navigate, Outlet, Route, Routes, useNavigate } from "react-router-dom";
import { useAuth } from "hooks/useAuth";
import Layout from "components/layout/Layout";
import LogoutPage from "./domains/logout/pages/Logout";
import Login from "domains/login/pages/Login";
import useSessionStorageState from "hooks/useSessionStorage";
import Password from "domains/password/pages/Password";
import TavanaSpinner from "components/spinner/TavanaSpinner";
import { mainProviderContext } from "context/MainProviderContext";
import Admin from "domains/admin/pages/Admin";
import ContactNumberAuth from "domains/Authentication/ContactNumberAuth";
import NotFound from "components/errorPages/notFound/NotFound";
import { Typography } from "@mui/material";
import Welcome from "domains/welcome/Welcome";
import Towns from "domains/basic-data/Towns";
import PublicData from "domains/basic-data/PublicData/PublicData";
import CommonData from "domains/basic-data/PublicData/pages/CommonData";
import TownShipGrid from "domains/basic-data/TownShip/TownShipGrid";
import CityGrid from "domains/basic-data/CityController/CityGrid";
import FormSteps from "domains/Institute/FormSteps";
import InstititeGrid from "domains/Institute/InstititeGrid";

const AppRoutes: React.FC = () => {
  const auth = useAuth();
  const isUserLoggedIn = auth?.isUserLoggedIn ?? false;

  return (
    <Routes>
      <Route element={<ProtectedRoute />}>
        <Route element={<AdminRoute />}>
          <Route
            index
            path="contactNumberAuthentication"
            element={<ContactNumberAuth />}
          />
          <Route index path="admin" element={<Admin />} />
          <Route path="password" element={<Password />} />
        </Route>
        <Route element={<UserRoute />}>
          <Route path="institutions">
            <Route path="information">
              <Route index element={<InstititeGrid/>} />
              <Route path="new" element={<FormSteps />} />
            </Route>
            <Route path="personnels" element={<Welcome />} />
            <Route path="rating-test" element={<Welcome />} />
            <Route path="exam-applicants" element={<Welcome />} />
            <Route path="membership-fee" element={<Welcome />} />
            <Route
              path="contracts-concluded-by-institution"
              element={<Welcome />}
            />
          </Route>
          <Route path="basic-data">
            <Route path="towns" element={<Towns />} />
            <Route path="township" element={<TownShipGrid />} />
            <Route path="city" element={<CityGrid />} />
            <Route path="public-data">
              <Route index element={<PublicData />} />
              <Route path=":id/:typeName" element={<CommonData />} />
            </Route>
          </Route>
          <Route path="/" element={<Welcome />} />
        </Route>

        <Route path="contract" element={<RemoveContract />} />
      </Route>

      <Route path="welcome" element={<Welcome />} />
      <Route path="logout" element={<LogoutPage />} />
      <Route
        path="login"
        element={isUserLoggedIn ? <Navigate to="/" /> : <Login />}
      />
      <Route path="404" element={<NotFound />} />
      <Route path="*" element={<Navigate to="login" />} />
    </Routes>
  );
};

export default AppRoutes;

type ProtectedRouteProps = {
  redirectPath?: string;
  children?: React.ReactNode;
};

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({
  redirectPath = "/login",
  children,
}) => {
  const auth = useAuth();
  const { access } = useContext(mainProviderContext);
  const navigate = useNavigate();
  const [token, setToken] = useSessionStorageState("token");

  // React.useEffect(() => {
  //   if (window.location.pathname === "/" && window.location.search.length > 10) {
  //     const params = new URLSearchParams(window.location.search);
  //     const tokenFromUrl = params.get("token") ?? "";

  //     if (tokenFromUrl) {
  //       auth?.storeToken(tokenFromUrl);
  //       setToken(tokenFromUrl);
  //       navigate("/", { replace: true });
  //     }
  //   }
  // }, [auth, navigate, setToken]);

  if (!auth?.isUserLoggedIn) {
    return <Navigate to={redirectPath} replace />;
  }

  // if (!access?.roleName?.length) {
  //   return <TavanaSpinner show />;
  // }

  return <>{children ?? <Outlet />}</>;
};

const AdminRoute: React.FC<ProtectedRouteProps> = ({ children }) => {
  const { access } = useContext(mainProviderContext);

  if (access?.accessMenu?.[0] === "administrator" && access.admin) {
    return <Layout>{children ?? <Outlet />}</Layout>;
  }

  return <Navigate to="/" replace />;
};
const UserRoute: React.FC<ProtectedRouteProps> = ({ children }) => {
  return <Layout>{children ?? <Outlet />}</Layout>;
};

const RemoveContract: React.FC = () => {
  const auth = useAuth();
  const { access } = useContext(mainProviderContext);

  React.useEffect(() => {
    if (auth?.isContractSet()) {
      auth.setContract(
        "",
        "",
        "",
        "",
        "",
        "",
        "",
        "",
        null,
        null,
        null,
        false,
        false,
        false,
        ""
      );
    }
  }, [auth]);

  return (
    <Layout hideRightMenu={!access.admin}>
      <Typography>خروجی</Typography>
    </Layout>
  );
};
