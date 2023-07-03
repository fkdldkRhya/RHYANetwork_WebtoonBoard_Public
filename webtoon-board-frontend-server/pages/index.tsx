/*
import React from "react";
import PageContainer from "../src/components/container/PageContainer";
import { redirect } from 'react-router-dom';

// components
import Banner from "../src/components/landingpage/banner/Banner";
import C2a from "../src/components/landingpage/c2a/C2a";
import C2a2 from "../src/components/landingpage/c2a/C2a2";
import DemoSlider from "../src/components/landingpage/demo-slider/DemoSlider";
import Features from "../src/components/landingpage/features/Features";
import Footer from "../src/components/landingpage/footer/Footer";
import Frameworks from "../src/components/landingpage/frameworks/Frameworks";
import LpHeader from "../src/components/landingpage/header/Header";
import Testimonial from "../src/components/landingpage/testimonial/Testimonial";
import Modern from "./dashboards/modern";

const Landingpage = () => {
  return (
    <PageContainer>
      <LpHeader />
      <Banner />
      <DemoSlider />
      <Frameworks />
      <Testimonial />
      <Features />
      <C2a />
      <C2a2 />
      <Footer />
    </PageContainer>
  );
};

Landingpage.layout = "Blank";
export default Landingpage;
*/
import { Box, Grid } from "@mui/material";
import PageContainer from "../src/components/container/PageContainer";

import RevenueUpdates from "../src/components/dashboards/modern/RevenueUpdates";
import YearlyBreakup from "../src/components/dashboards/modern/YearlyBreakup";
import MonthlyEarnings from "../src/components/dashboards/modern/MonthlyEarnings";
import EmployeeSalary from "../src/components/dashboards/modern/EmployeeSalary";
import Customers from "../src/components/dashboards/modern/Customers";
import Projects from "../src/components/dashboards/modern/Projects";
import Social from "../src/components/dashboards/modern/Social";
import SellingProducts from "../src/components/dashboards/modern/SellingProducts";
import WeeklyStats from "../src/components/dashboards/modern/WeeklyStats";
import TopPerformers from "../src/components/dashboards/modern/TopPerformers";
import Welcome from "../src/layouts/full/shared/welcome/Welcome";
import { getAutoLoginUserId, setSessionAutoLoginValue, userLogout } from "@/backend-api/auth/LoginChecker";
import { GetServerSidePropsContext } from "next";
import { PagePath } from "../middleware";
import { findUserFromIdValueClientForSSROnly } from "@/backend-api/client/UserInfoClient";
import { getLogger } from "@/backend-api/Logger";
import React from "react";

const Modern = () => {

  return (
    <PageContainer>
      <Box>
        <Grid container spacing={3}>
          {/* column */}
          <Grid item xs={12} lg={12}>
            {/*<TopCards />*/}
          </Grid>
          {/* column */}
          <Grid item xs={12} lg={8}>
            <RevenueUpdates/>
          </Grid>
          {/* column */}
          <Grid item xs={12} lg={4}>
            <EmployeeSalary />
          </Grid>
          <Grid item xs={12} lg={12}>
            <TopPerformers />
          </Grid>
          {/*
          <Grid item xs={12} lg={4}>
          <EmployeeSalary />
          </Grid>
          <Grid item xs={12} lg={4}>
          <Grid container spacing={3}>
            <Grid item xs={12} sm={6}>
              <Customers />
            </Grid>
            <Grid item xs={12} sm={6}>
              <Projects />
            </Grid>
            <Grid item xs={12}>
              <Social />
            </Grid>
          </Grid>
          </Grid>
          <Grid item xs={12} lg={4}>
          <SellingProducts />
          </Grid>
          <Grid item xs={12} lg={4}>
          <WeeklyStats />
          </Grid>
          <Grid item xs={12} lg={8}>
          <TopPerformers />
          </Grid>
        */}
        </Grid>
        {/* <Welcome /> */}
      </Box>
    </PageContainer>
  );
};

export default Modern;

export async function getServerSideProps(context: GetServerSidePropsContext) {
  try {
    // 자동 로그인
    const getUserId: number = getAutoLoginUserId(context.req, context.res);
    const userInfo : any = await findUserFromIdValueClientForSSROnly(getUserId, context);

    if (userInfo) { // 자동 로그인 성공
      setSessionAutoLoginValue(context.req, context.res); // 로그인 데이터 갱신
      return {
        props:{},
      };
    }
  }catch (error : any) {
    // 예외 처리
    getLogger().error(error.toString());
  }

  // 로그아웃
  userLogout(context.req, context.res);

  // 로그인 페이지로 이동
  return {
    redirect: {
      destination: PagePath.AUTH_AUTH1_LOGIN,
      permanent: false,
    },
    props:{},
  };
}