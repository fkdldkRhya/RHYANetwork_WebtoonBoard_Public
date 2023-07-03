import React, { ReactElement } from "react";
import Head from "next/head";
import { AppContext, AppProps } from "next/app";
import { ThemeProvider } from "@mui/material/styles";
import CssBaseline from "@mui/material/CssBaseline";
import { CacheProvider, EmotionCache } from "@emotion/react";
import { ThemeSettings } from "../src/theme/Theme";
import createEmotionCache from "../src/createEmotionCache";
import { Provider } from "react-redux";
import Store from "../src/store/Store";
import RTL from "./../src/layouts/full/shared/customizer/RTL";
import { useSelector } from "../src/store/Store";
import { AppState } from "../src/store/Store";

import BlankLayout from "../src/layouts/blank/BlankLayout";
import FullLayout from "../src/layouts/full/FullLayout";

import "../src/_mockApis";
import "../src/utils/i18n";

// CSS FILES
import "react-quill/dist/quill.snow.css";
import "./forms/form-quill/Quill.css";
import "./apps/calendar/Calendar.css";
import "../src/components/landingpage/testimonial/testimonial.css";
import "../src/components/landingpage/demo-slider/demo-slider.css";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import { findUserFromIdValueClient } from "@/backend-api/client/UserInfoClient";
import { getAutoLoginUserId } from "@/backend-api/auth/LoginChecker";

// Client-side cache, shared for the whole session of the user in the browser.
const clientSideEmotionCache = createEmotionCache();

interface MyAppProps extends AppProps {
  emotionCache?: EmotionCache;
}

const layouts: any = {
  Blank: BlankLayout,
};

const MyApp = (props: any) => {
  const {
    Component,
    emotionCache = clientSideEmotionCache,
    pageProps,
    _appProps,
  }: any = props;
  const theme = ThemeSettings();
  const customizer = useSelector((state: AppState) => state.customizer);
  const Layout = layouts[Component.layout] || FullLayout;

  return (
    <CacheProvider value={emotionCache}>
      <Head>
        <meta name="viewport" content="initial-scale=1, width=device-width" />
        <title>Webtoon Board Service</title>
      </Head>
      <ThemeProvider theme={theme}>
        <RTL direction={customizer.activeDir}>
          <CssBaseline />
          <Layout {..._appProps}>
            <Component {...pageProps} />
          </Layout>
        </RTL>
      </ThemeProvider>
    </CacheProvider>
  );
};

function MyAppFunction(props: any) : ReactElement  {
  return (
    <Provider store={Store}>
      <MyApp {...props} />
    </Provider>
  );
}

MyAppFunction.getInitialProps = async ({ Component, ctx }: AppContext) => {
  const NO_DATA : string = "undefined"
  let userId: string = NO_DATA;
  let userName: string = NO_DATA;
  let userEmail: string = NO_DATA;
  let role: string = NO_DATA;

  try {
    // 자동 로그인
    const getUserId: number = getAutoLoginUserId(ctx.req, ctx.res);
    const userInfo : any = await findUserFromIdValueClient(getUserId);
    if (userInfo) { // 자동 로그인 성공
      userId = userInfo.userId;
      userName = userInfo.userName;
      userEmail = userInfo.userEmail;
      role = userInfo.role;
    }
  }catch (error : any) {
    // 예외 발생
    userId = NO_DATA;
    userName = NO_DATA;
    userEmail = NO_DATA;
    role = NO_DATA;
  }

  return {
    _appProps: {
      userInfo: {
        userId: userId,
        userName: userName,
        userEmail: userEmail,
        role: role,
      }
    }
  };
};

export default MyAppFunction
