import React, { useEffect } from "react";
// import { useKeycloak } from "@react-keycloak/web";
import TavanaSpinner from "components/spinner/TavanaSpinner";
import { useAuth } from "hooks/useAuth";
import Layout from "components/layout/Layout";
import { Outlet } from "react-router-dom";
import {
  alpha,
  Box,
  Button,
  Card,
  CardActions,
  CardContent,
  CardHeader,
  Grid,
  Typography,
  useTheme,
} from "@mui/material";
import Carousel from "components/Carousel/Carousel";
import EmblaCarousel from "components/Carousel/EmblaCarouselWithScaleAndLazy";
import { useAuthorization } from "hooks/useAutorization";
import { AccountBalance, BusinessCenter, People } from "@mui/icons-material";
interface CarouselItem {
  id: number;
  title: string;
  image: string;
  description: string;
}
interface MenuItem {
  title: string;
  icon?: React.ReactElement;
  url: string;
  description: string;
  access?: string[];
}
const menuItems: MenuItem[] = [
  {
    title: "احکام انتظامی",
    url: "IACPA/disciplinary-order",
    access: ["administrator", "city-showmenu"],
    description: "مدیریت کلی احکام انتظامی",
    icon: <AccountBalance />,
  },
  {
    title: "اطلاعات موسسات",
    url: "institutions/information",
    access: ["administrator", "city-showmenu"],
    description: "انتخاب و بررسی موسسات",
    icon: <BusinessCenter />,
  },
  {
    title: "حسابداران رسمی",
    url: "accountant/official-users",
    access: ["administrator", "city-showmenu"],
    description: "بررسی حسابدارن رسمی",
    icon: <People />,
  },
];
const carouselItems: CarouselItem[] = [
  {
    id: 1,
    title: "عنوان اول",
    image: "https://picsum.photos/800/400?random=1",
    description: "توضیحات مربوط به آیتم اول",
  },
  {
    id: 2,
    title: "عنوان دوم",
    image: "https://picsum.photos/800/400?random=2",
    description: "توضیحات مربوط به آیتم دوم",
  },
  {
    id: 3,
    title: "عنوان سوم",
    image: "https://picsum.photos/800/400?random=3",
    description: "توضیحات مربوط به آیتم سوم",
  },
];
function HangOverMenu() {
  const Auth = useAuth();
  const theme = useTheme();
  const authFunctions = useAuthorization();
  return (
    <Grid container justifyContent={"center"}>
      {/* <Grid item md={4}>
        <Carousel
          items={carouselItems}
          autoPlay={true}
          interval={5000}
          height={300}
        />
      </Grid> */}
      {/**@description EmblaCarousel */}
      {/* <Grid item md={11}>
        <EmblaCarousel slides={carouselItems}/>
      </Grid> */}
      {/**@description hangover */}
      <Grid
              container
              item
              md={11}
              justifyContent={"space-around"}
              spacing={4}
              sx={{
                height: "14vh",
                // backgroundColor:`${alpha(theme.palette.primary.main, 0.3)}`,
                backgroundColor: theme.palette.primary.light,
                overflow: "visible",
                // position: "relative",
                borderRadius: "5px",
              }}
            >
              {menuItems
                ?.filter((item) => {
                  // return item.access?.includes(access?.accessMenu[0]);
                  return authFunctions?.hasMenuAccess(item.access);
                })
                ?.map((item, index) => (
                  <Grid
                    item
                    md={4}
                    sx={{
                      // position: "relative",
                      display: "flex",
                      justifyContent: "center",
                    }}
                  >
                    <Card
                      sx={{
                        borderRadius:"5px",
                        position: "relative",
                        top: "18px", // کارت از پایین گرید بیرون می‌زند بدون افزایش ارتفاع
                        // width: "100%",
                        maxHeight: "30vh",
                        // aspectRatio: "15/16",
                      }}
                    >
                      {/* <CardHeader title={item.title} /> */}
                      <CardContent 
                      // sx={{ height: "100%" }}
                      >
                        <Box display={"flex"} gap={1}>
                          {item.icon}
                          <Typography gutterBottom variant="h6" component="div">
                            {item.title}
                          </Typography>
                        </Box>
                        <Typography variant="body2" sx={{ color: "text.secondary" }}>
                          {item.description}
                        </Typography>
                      </CardContent>
                      <CardActions>
                        <Button>مشاهده</Button>
                        <Typography
                          variant="body2"
                          sx={{
                            position: "absolute",
                            bottom: 16,
                            right: 16,
                            // color: slide.image ? "white" : "text.secondary",
                            zIndex: 2,
                          }}
                        >
                          {index + 1} / {carouselItems.length}
                        </Typography>
                      </CardActions>
                    </Card>
                  </Grid>
                ))}
            </Grid>
    </Grid>
  );
}

export default HangOverMenu;
