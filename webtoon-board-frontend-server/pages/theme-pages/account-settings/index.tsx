import * as React from 'react';
import PageContainer from '../../../src/components/container/PageContainer';
import Breadcrumb from '../../../src/layouts/full/shared/breadcrumb/Breadcrumb';
import { Grid, Tabs, Tab, Box, CardContent, Divider } from '@mui/material';

// components
import AccountTab from '../../../src/components/pages/account-setting/AccountTab';
import { IconArticle, IconBell, IconLock, IconUserCircle } from '@tabler/icons-react';
import BlankCard from '../../../src/components/shared/BlankCard';
import NotificationTab from '../../../src/components/pages/account-setting/NotificationTab';
import BillsTab from '../../../src/components/pages/account-setting/BillsTab';
import SecurityTab from '../../../src/components/pages/account-setting/SecurityTab';
import { getLogger } from '@/backend-api/Logger';
import { LOGIN_COOKIE_NAME, getAutoLoginUserId, setSessionAutoLoginValue, userLogout } from '@/backend-api/auth/LoginChecker';
import { findUserFromIdValueClientForSSROnly } from '@/backend-api/client/UserInfoClient';
import { GetServerSidePropsContext } from 'next';
import { PagePath } from '../../../middleware';
import { getCookie } from 'cookies-next';

const BCrumb = [
  {
    to: '/',
    title: 'Home',
  },
  {
    title: 'Account Setting',
  },
];

interface TabPanelProps {
  children?: React.ReactNode;
  index: number;
  value: number;
}

function TabPanel(props: TabPanelProps) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`simple-tabpanel-${index}`}
      aria-labelledby={`simple-tab-${index}`}
      {...other}
    >
      {value === index && <Box>{children}</Box>}
    </div>
  );
}

function a11yProps(index: number) {
  return {
    id: `simple-tab-${index}`,
    'aria-controls': `simple-tabpanel-${index}`,
  };
}

const AccountSetting = (props: any) => {
  const [value, setValue] = React.useState(0);

  const handleChange = (event: React.SyntheticEvent, newValue: number) => {
    setValue(newValue);
  };

  return (
    <PageContainer>
      {/* breadcrumb */}
      <Breadcrumb title="Account Setting" items={BCrumb} />
      {/* end breadcrumb */}

      <Grid container spacing={3}>
        <Grid item xs={12}>
          <BlankCard>
            <Box sx={{ maxWidth: { xs: 320, sm: 480 } }}>
              <Tabs
                value={value}
                onChange={handleChange}
                scrollButtons="auto"
                aria-label="basic tabs example"
              >
                <Tab
                  iconPosition="start"
                  icon={<IconUserCircle size="22" />}
                  label="Account"
                  {...a11yProps(0)}
                />
                {/*
                <Tab
                  iconPosition="start"
                  icon={<IconBell size="22" />}
                  label="Notifications"
                  {...a11yProps(1)}
                />
                <Tab
                  iconPosition="start"
                  icon={<IconArticle size="22" />}
                  label="Bills"
                  {...a11yProps(2)}
                />
                <Tab
                  iconPosition="start"
                  icon={<IconLock size="22" />}
                  label="Security"
                  {...a11yProps(3)}
                />
                */}
              </Tabs>
            </Box>
            <Divider />
            <CardContent>
              {/*
                <TabPanel value={value} index={1}>
                  <NotificationTab />
                </TabPanel>
                <TabPanel value={value} index={2}>
                  <BillsTab />
                </TabPanel>
                <TabPanel value={value} index={3}>
                  <SecurityTab />
                </TabPanel>
              */}
              <TabPanel value={value} index={0}>
                <AccountTab {...props}/>
              </TabPanel>
            </CardContent>
          </BlankCard>
        </Grid>
      </Grid>
    </PageContainer>
  );
};

export default AccountSetting;

export async function getServerSideProps(context: GetServerSidePropsContext) {
  try {
    // 자동 로그인
    const getUserId: number = getAutoLoginUserId(context.req, context.res);
    const userInfo : any = await findUserFromIdValueClientForSSROnly(getUserId, context);
    if (userInfo) { // 자동 로그인 성공
      setSessionAutoLoginValue(context.req, context.res); // 로그인 데이터 갱신

      return {
        props:{
          userInfo: userInfo,
          token: (getCookie(LOGIN_COOKIE_NAME, {req: context.req, res: context.res}) as string)
        },
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
      destination: PagePath.ERROR_404,
      permanent: false,
    },
    props:{},
  };
}