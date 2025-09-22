import React, { useEffect } from "react";
// import { useKeycloak } from "@react-keycloak/web";
import TavanaSpinner from "components/spinner/TavanaSpinner";
import { useAuth } from "hooks/useAuth";
import Layout from "components/layout/Layout";
import { Outlet } from "react-router-dom";
import { Grid, Typography } from "@mui/material";
import Carousel from "components/Carousel/Carousel";
interface CarouselItem {
  title: string;
  image: string;
  description: string;
}
const carouselItems: CarouselItem[] = [
  {
    title: "عنوان اول",
    image: "https://picsum.photos/800/400?random=1",
    description: "توضیحات مربوط به آیتم اول",
  },
  {
    title: "عنوان دوم",
    image: "https://picsum.photos/800/400?random=2",
    description: "توضیحات مربوط به آیتم دوم",
  },
  {
    title: "عنوان سوم",
    image: "https://picsum.photos/800/400?random=3",
    description: "توضیحات مربوط به آیتم سوم",
  },
];
function Welcome() {
  const Auth = useAuth();
  return (
    <Grid container justifyContent={"center"}>
      <Grid item md={11}>
        <Typography variant="h6">خوش آمدید</Typography>
      </Grid>
      {/* <Grid item md={4}>
        <Carousel
          items={carouselItems}
          autoPlay={true}
          interval={5000}
          height={300}
        />
      </Grid> */}

    </Grid>
  );
}

export default Welcome;
