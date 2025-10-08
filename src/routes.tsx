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
import UsersGrid from "domains/admin/pages/Users/UsersGrid";
import AddUser from "domains/admin/pages/Users/AddUser";
import RolesGrid from "domains/admin/pages/roles/RolesGrid";
import PermissionGrid from "domains/admin/pages/permissions/PermissionGrid";
import DetaileTabs from "domains/Institute/setting/DetaileTabs";
import MemberShipGrid from "domains/memberShip/MemberShipGrid";
import AddMembership from "domains/memberShip/AddMembership";
import WorkgroupGrid from "domains/workgroup/WorkgroupGrid";
import AddWorkgroup from "domains/workgroup/AddWorkgroup";
import PersonGrid from "domains/person/PersonGrid";
import AddPerson from "domains/person/AddPerson";
import FirmAdminGrid from "domains/firmAdmin/FirmAdminGrid";
import FirmAdminFormSteps from "domains/firmAdmin/FirmAdminFormSteps";
import FirmAdminDetaileTabs from "domains/firmAdmin/setting/FirmAdminDetaileTabs";
import OfficialUserGrid from "domains/accountant/officialUser/OfficialUserGrid";
import AddOfficialUser from "domains/accountant/officialUser/AddOfficialUser";
import InstituteContractGrid from "domains/Institute/contracts/InstituteContractGrid";
import ContractDetaile from "domains/Institute/contracts/ContractDetaile";

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
          <Route path="management">
            <Route path="users">
              <Route index element={<UsersGrid/>} />
              <Route path=":id" element={<AddUser />} />
            </Route>
            <Route path="roles">
              <Route index element={<RolesGrid/>} />
            </Route>
            <Route path="permissions">
              <Route index element={<PermissionGrid/>} />
            </Route>
          </Route>
          <Route path="accountant">
            <Route path="official-users" >
              <Route index element={<OfficialUserGrid/>} />
              <Route path=":id" element={<AddOfficialUser/>} />
            </Route>
          </Route>
          <Route path="institutions">
            <Route path="information">
              <Route index element={<InstititeGrid/>} />
              <Route path="details/:id">
                <Route index element={<DetaileTabs />} />
              </Route>
              <Route path=":id" element={<FormSteps />} />
            </Route>
            <Route path="persons" >
              <Route index element={<PersonGrid/>} />
              <Route path=":id" element={<AddPerson/>} />
            </Route>
            <Route path="personnels" >
              <Route index element={<MemberShipGrid/>} />
              <Route path=":id" element={<AddMembership />} />
            </Route>
            <Route path="rating-test" element={<Welcome />} />
            <Route path="partners" element={<Welcome />} />
            <Route path="exam-applicants" element={<Welcome />} />
            <Route path="membership-fee" element={<Welcome />} />
            <Route path="contracts-concluded">
              <Route index element={<InstituteContractGrid />}/>
              <Route path=":id" element={<ContractDetaile/>} />
            </Route>
          </Route>
          <Route path="FirmAdmin">
            <Route path="information">
              <Route index element={<FirmAdminGrid/>} />
              <Route path="details/:id">
                <Route index element={<FirmAdminDetaileTabs />} />
              </Route>
              <Route path=":id" element={<FirmAdminFormSteps />} />
            </Route>
          </Route>
          <Route path="IACPA">
            <Route path="workgroup" >
              <Route index element={<WorkgroupGrid/>} />
              <Route path=":id" element={<AddWorkgroup/>} />
            </Route>
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
