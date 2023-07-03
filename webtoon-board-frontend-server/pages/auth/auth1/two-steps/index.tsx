import { Grid, Box, Typography } from '@mui/material';
import PageContainer from '../../../../src/components/container/PageContainer';
import Logo from '../../../../src/layouts/full/shared/logo/Logo';
import AuthTwoSteps from '../../authForms/AuthTwoSteps';
import { GetServerSidePropsContext } from 'next';
import { getAutoLoginUserId, isNotEmailAuthUser, setSessionAutoLoginValue, userLogout } from '@/backend-api/auth/LoginChecker';
import { checkUserAccountIsAlow, findUserFromIdValueClientForSSROnly, sendAuthCodeEmailForSignup } from '@/backend-api/client/UserInfoClient';
import { getLogger } from '@/backend-api/Logger';
import { PagePath } from '../../../../middleware';

const TwoSteps = (props: any) => (
  <PageContainer>
    <Grid container spacing={0} justifyContent="center" sx={{ overflowX: 'hidden' }}>
      <Grid
        item
        xs={12}
        sm={12}
        lg={8}
        xl={9}
        sx={{
          position: 'relative',
          '&:before': {
            content: '""',
            background: 'radial-gradient(#d2f1df, #d3d7fa, #bad8f4)',
            backgroundSize: '400% 400%',
            animation: 'gradient 15s ease infinite',
            position: 'absolute',
            height: '100%',
            width: '100%',
            opacity: '0.3',
          },
        }}
      >
        <Box position="relative">
          <Box px={3}>
            <Logo />
          </Box>
          <Box
            alignItems="center"
            justifyContent="center"
            height={'calc(100vh - 75px)'}
            sx={{
              display: {
                xs: 'none',
                lg: 'flex',
              },
            }}
          >
            <img
              src={"/images/backgrounds/login-bg.svg"}
              alt="bg"
              style={{
                width: '100%',
                maxWidth: '500px',
              }}
            />
          </Box>
        </Box>
      </Grid>
      <Grid
        item
        xs={12}
        sm={12}
        lg={4}
        xl={3}
        display="flex"
        justifyContent="center"
        alignItems="center"
      >
        <Box p={4}>
        <Typography variant="h4" fontWeight="700">
            Two Step Verification
          </Typography>

          <Typography variant="subtitle1" color="textSecondary" mt={2} mb={1}>
            We sent a verification code to your email. Enter the code from the email in the field
            below.
          </Typography>
          <Typography variant="subtitle1" fontWeight="700" mb={1}>
            {props.userEmail}
          </Typography>
          <AuthTwoSteps authInfo={props.authInfo} />
        </Box>
      </Grid>
    </Grid>
  </PageContainer>
);

TwoSteps.layout = "Blank";
export default TwoSteps;

export async function getServerSideProps(context: GetServerSidePropsContext) {
  try {
    // 자동 로그인
    const getUserId: number = getAutoLoginUserId(context.req, context.res);
    const userInfo : any = await findUserFromIdValueClientForSSROnly(getUserId, context);

    if (userInfo) { // 자동 로그인 성공
      setSessionAutoLoginValue(context.req, context.res); // 로그인 데이터 갱신

      // 인증 메일 발송 및 인증 정보 불러오기
      const userAuthInfo : any = await checkUserAccountIsAlow(userInfo.id, context);
      
      // 이메일 인증이 이미 완료된 사용자인 경우
      if (!isNotEmailAuthUser(userAuthInfo)) {
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

      // 인증 이메일 발송
      const emailSendResult : any = await sendAuthCodeEmailForSignup(userInfo.id, context);
      // 이메일 발송 실패 시 오류 페이지로 이동
      if (!emailSendResult || !emailSendResult.result || !emailSendResult.data.data) {
        // 오류 페이지로 이동
        return {
          redirect: {
            destination: PagePath.ERROR_404,
            permanent: false,
          },
          props:{},
        };
      }
      
      return {
        props:{
          userEmail: userInfo.userEmail,
          authInfo: {
            userId: userInfo.id,
            requestCode: emailSendResult.data.data.requestCode,
          }
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
      destination: PagePath.AUTH_AUTH1_LOGIN,
      permanent: false,
    },
    props:{},
  };
}