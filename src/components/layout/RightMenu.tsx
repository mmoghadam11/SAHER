import React, { useState, useContext } from "react";
import { useLocation, NavLink, Link } from "react-router-dom";
import {
  CSSObject,
  styled,
  Theme,
  alpha,
  useTheme,
  Box,
  Typography,
  IconButton,
  Divider,
  List,
  Collapse,
} from "@mui/material";
import MuiDrawer from "@mui/material/Drawer";
import {
  ChevronRight as ChevronRightIcon,
  ExpandMore,
  ManageAccounts,
  Help,
  Password,
  WavingHand,
  BusinessCenter,
  AutoStories,
  Article,
} from "@mui/icons-material";
import { mainProviderContext } from "context/MainProviderContext";
import { DRAWER_WIDTH, DrawerHeader } from "./Layout";
import { useAuthorization } from "hooks/useAutorization";

// Types
interface MenuItem {
  title: string;
  icon: React.ReactElement;
  url: string;
  access?: string[];
  menuChildren?: ChildMenuItem[];
}
interface ChildMenuItem {
  title: string;
  // icon: React.ReactElement;
  url: string;
  access?: string[];
  menuChildren?: ChildMenuItem[];
}

interface RenderMenuProps extends MenuItem {
  open: boolean;
}

interface RenderMenuWithChildProps extends RenderMenuProps {
  handleDrawerOpen: () => void;
}

// Styled Components
const openedMixin = (theme: Theme): CSSObject => ({
  width: DRAWER_WIDTH,
  transition: theme.transitions.create("width", {
    easing: theme.transitions.easing.easeInOut,
    duration: theme.transitions.duration.enteringScreen,
  }),
  overflowX: "hidden",
  background: `linear-gradient(180deg, ${
    theme.palette.background.default
  } 0%, ${alpha(theme.palette.primary.main, 0.05)} 100%)`,
  boxShadow: "0 0 20px rgba(0, 0, 0, 0.05)",
});

const closedMixin = (theme: Theme): CSSObject => ({
  transition: theme.transitions.create("width", {
    easing: theme.transitions.easing.easeInOut,
    duration: theme.transitions.duration.leavingScreen,
  }),
  overflowX: "hidden",
  width: `calc(${theme.spacing(9)} + 1px)`,
  background: `linear-gradient(180deg, ${
    theme.palette.background.default
  } 0%, ${alpha(theme.palette.primary.main, 0.05)} 100%)`,
  boxShadow: "0 0 20px rgba(0, 0, 0, 0.05)",
  [theme.breakpoints.up("sm")]: {
    width: `calc(${theme.spacing(9)} + 1px)`,
  },
});

const Drawer = styled(MuiDrawer, {
  shouldForwardProp: (prop) => prop !== "open",
})(({ theme, open }) => ({
  width: DRAWER_WIDTH,
  flexShrink: 0,
  whiteSpace: "nowrap",
  boxSizing: "border-box",
  ...(open && {
    ...openedMixin(theme),
    "& .MuiDrawer-paper": openedMixin(theme),
  }),
  ...(!open && {
    ...closedMixin(theme),
    "& .MuiDrawer-paper": closedMixin(theme),
  }),
}));

// Menu Data
const MENU_ITEMS: MenuItem[] = [
  {
    icon: <ManageAccounts />,
    title: "مدیریت سیستم",
    url: "projects",
    access: ["city-showmenu"],
    menuChildren: [
      {
        
        title: "مدیریت کاربران",
        url: "password",
        access: ["administrator","city-showmenu"],
      },
      {
        title: "مدیریت اعضا",
        url: "member",
        access: ["administrator"],
      },
      {
        title: "خوش آمدید",
        url: "/welcome",
        access: ["member", "administrator","city-showmenu"],
      },
    ],
  },
  {
    icon: <BusinessCenter />,
    title: "موسسات و اعضاء",
    url: "/institutions",
    access: ["city-showmenu"],
    menuChildren: [
      {
        title: "اطلاعات موسسات",
        url: "information",
        access: ["administrator","city-showmenu"],
      },
      {
        title: "مشخصات اشخاص",
        url: "personnels",
        access: ["administrator","city-showmenu"],
      },
      {
        title: "آزمون رتبه بندی",
        url: "rating-test",
        access: ["administrator","city-showmenu"],
      },
      {
        title: "متقاضیان آزمون",
        url: "exam-applicants",
        access: ["administrator","city-showmenu"],
      },
      {
        title: "حق عضویت جامعه",
        url: "membership-fee",
        access: ["administrator","city-showmenu"],
      },
      {
        title: "قرارداد های منعقده موسسه",
        url: "contracts-concluded-by-institution",
        access: ["administrator","city-showmenu"],
      },
    ],
  },
  {
    icon: <AutoStories />,
    title: "گزارشات",
    url: "projects",
    access: ["city-showmenu"],
    menuChildren: [
      {
        title: "داشبورد",
        url: "dashboard",
        access: ["administrator","city-showmenu"],
      },
    ],
  },
  {
    icon: <Article />,
    title: "اطلاعات پایه",
    url: "projects",
    access: ["city-showmenu"],
    menuChildren: [
    ],
  },
  {
    icon: <Help />,
    title: "راهنمای سامانه",
    url: "help",
    access: ["member", "administrator","city-showmenu"],
  },
];

// Helper Components
const MenuIcon: React.FC<{ icon: React.ReactElement; isActive?: boolean }> = ({
  icon,
  isActive = false,
}) => {
  const theme = useTheme();

  return (
    <Box
      sx={{
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        mr: 2,
        width: "24px",
        height: "24px",
        color: isActive ? theme.palette.primary.contrastText : "inherit",
        fontSize: "22px",
      }}
    >
      {icon}
    </Box>
  );
};

// Main Components
const RenderMenu: React.FC<RenderMenuProps> = ({ title, icon, url, open }) => {
  const theme = useTheme();
  const location = useLocation();
  const isActive = location.pathname === url;

  return (
    <NavLink to={url} style={{ textDecoration: "none" }}>
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          p: 1.5,
          m: 1,
          borderRadius: "12px",
          fontSize: "15px",
          color: isActive
            ? theme.palette.primary.contrastText
            : theme.palette.text.secondary,
          background: isActive
            ? `linear-gradient(90deg, ${theme.palette.primary.main} 0%, ${alpha(
                theme.palette.primary.main,
                0.8
              )} 100%)`
            : "transparent",
          transition: "all 0.2s ease-in-out",
          "&:hover": {
            background: isActive
              ? `linear-gradient(90deg, ${
                  theme.palette.primary.main
                } 0%, ${alpha(theme.palette.primary.main, 0.8)} 100%)`
              : alpha(theme.palette.primary.main, 0.05),
            color: isActive
              ? theme.palette.primary.contrastText
              : theme.palette.primary.main,
            transform: "translateX(4px)",
          },
        }}
      >
        <MenuIcon icon={icon} isActive={isActive} />
        <Typography
          sx={{
            fontWeight: isActive ? 600 : 400,
            opacity: open ? 1 : 0,
            transition: "all 0.3s ease-in-out",
            fontSize: "0.9rem",
          }}
        >
          {title}
        </Typography>
      </Box>
    </NavLink>
  );
};

const RenderMenuWithChild: React.FC<RenderMenuWithChildProps> = ({
  title,
  icon,
  url,
  open,
  handleDrawerOpen,
  menuChildren,
}) => {
  const theme = useTheme();
  const location = useLocation();
  const [expanded, setExpanded] = useState(false);

  const isChildActive = menuChildren?.some(
    (child) => location.pathname === `${url}/${child.url}`
  );

  const handleToggle = (event: React.SyntheticEvent) => {
    event.preventDefault();
    if (!open) {
      handleDrawerOpen();
      setTimeout(() => setExpanded(true), 300);
    } else {
      setExpanded(!expanded);
    }
  };

  return (
    <Box sx={{ width: "100%", mb: 0.5 }}>
      <Box
        onClick={handleToggle}
        sx={{
          display: "flex",
          alignItems: "center",
          p: 1.5,
          m: 1,
          borderRadius: "12px",
          cursor: "pointer",
          color: isChildActive
            ? theme.palette.primary.main
            : theme.palette.text.secondary,
          background: isChildActive
            ? alpha(theme.palette.primary.main, 0.1)
            : "transparent",
          transition: "all 0.2s ease-in-out",
          "&:hover": {
            background: alpha(theme.palette.primary.main, 0.05),
            color: theme.palette.primary.main,
          },
        }}
      >
        <MenuIcon icon={icon} />
        <Typography
          sx={{
            flexGrow: 1,
            fontWeight: isChildActive ? 600 : 400,
            opacity: open ? 1 : 0,
            transition: "opacity 0.3s ease",
            fontSize: "0.9rem",
          }}
        >
          {title}
        </Typography>
        {open && (
          <ExpandMore
            sx={{
              transform: expanded ? "rotate(180deg)" : "rotate(0deg)",
              transition: "transform 0.3s ease",
              fontSize: "20px",
            }}
          />
        )}
      </Box>

      <Collapse in={open && expanded} timeout="auto" unmountOnExit>
      {/**
       * @description menu item sizing 
       * */ }
        <Box sx={{ pl: 4 ,pr:1}}>
          {menuChildren?.map((child) => (
            <NavLink
              key={`${url}/${child.url}`}
              to={`${url}/${child.url}`}
              style={{ textDecoration: "none" }}
            >
              {({ isActive }) => (
                <Box
                  sx={{
                    display: "flex",
                    alignItems: "center",
                    p: 1.5,
                    pl: 3,
                    m: 0.5,
                    borderRadius: "10px",
                    fontSize: "14px",
                    color: isActive
                      ? theme.palette.primary.contrastText
                      : theme.palette.text.secondary,
                    background: isActive
                      ? `linear-gradient(90deg, ${alpha(
                          theme.palette.primary.main,
                          0.8
                        )} 0%, ${theme.palette.primary.main} 100%)`
                      : "transparent",
                    transition: "all 0.2s ease-in-out",
                    "&:hover": {
                      background: isActive
                        ? `linear-gradient(90deg, ${alpha(
                            theme.palette.primary.main,
                            0.8
                          )} 0%, ${theme.palette.primary.main} 100%)`
                        : alpha(theme.palette.primary.main, 0.05),
                      color: isActive
                        ? theme.palette.primary.contrastText
                        : theme.palette.primary.main,
                      transform: "translateX(4px)",
                    },
                  }}
                >
                  {/* <MenuIcon icon={child.icon} isActive={isActive} /> */}
                  <Typography
                    sx={{
                      fontWeight: isActive ? 600 : 400,
                      opacity: open ? 1 : 0,
                      transition: "opacity 0.3s ease",
                      fontSize: "0.85rem",
                    }}
                  >
                    {child.title}
                  </Typography>
                </Box>
              )}
            </NavLink>
          ))}
        </Box>
      </Collapse>
    </Box>
  );
};

// Main Component
const RightMenu: React.FC<{
  open: boolean;
  handleDrawerClose: () => void;
  handleDrawerOpen: () => void;
}> = ({ open, handleDrawerClose, handleDrawerOpen }) => {
  const { access } = useContext(mainProviderContext);
  const theme = useTheme();
  const authFunctions=useAuthorization()
  return (
    <Drawer variant="permanent" open={open}>
      <DrawerHeader
        sx={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          position: "static",
          padding: "10px 12px",
          minHeight: "64px",
          background: alpha(theme.palette.primary.main, 0.1),
          borderBottom: `1px solid ${alpha(theme.palette.divider, 0.1)}`,
        }}
      >
        <Link to="/dashboard" style={{ textDecoration: "none", flexGrow: 1 }}>
          <Typography
            variant="h6"
            noWrap
            fontWeight={700}
            fontSize={16}
            sx={{
              color: theme.palette.primary.main,
              transition: "opacity 0.3s ease",
              opacity: open ? 1 : 0,
            }}
          >
            جامعه حسابداران رسمی ایران
          </Typography>
        </Link>
        <IconButton
          onClick={handleDrawerClose}
          sx={{
            color: theme.palette.primary.main,
            background: alpha(theme.palette.primary.main, 0.1),
            "&:hover": {
              background: alpha(theme.palette.primary.main, 0.2),
            },
          }}
        >
          <ChevronRightIcon />
        </IconButton>
      </DrawerHeader>

      <Divider sx={{ borderColor: alpha(theme.palette.divider, 0.1) }} />

      <List sx={{ padding: "8px 0", flexGrow: 1 }}>
        {MENU_ITEMS
        .filter((item) => {
          // return item.access?.includes(access?.accessMenu[0]);
          return authFunctions?.hasMenuAccess(item.access);
        })
        .map((menu) => {
          if (menu.menuChildren?.length) {
            let minichild = menu.menuChildren
            .filter((item) =>
              // item.access?.includes(access?.roleName[0])
              authFunctions?.hasMenuAccess(item.access)
            );
            return (
              <RenderMenuWithChild
                key={menu.url}
                title={menu.title}
                icon={menu.icon}
                url={menu.url}
                menuChildren={minichild}
                open={open}
                handleDrawerOpen={handleDrawerOpen}
              />
            );
          } else {
            return (
              <RenderMenu
                key={menu.url}
                title={menu.title}
                icon={menu.icon}
                url={menu.url}
                open={open}
              />
            );
          }
        })}
      </List>
    </Drawer>
  );
};

export default RightMenu;
