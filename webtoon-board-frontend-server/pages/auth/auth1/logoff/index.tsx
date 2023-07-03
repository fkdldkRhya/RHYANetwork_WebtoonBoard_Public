import { userLogout } from '@/backend-api/auth/LoginChecker';
import { GetServerSidePropsContext } from 'next';
import { PagePath } from '../../../../middleware';
import { getLogger } from '@/backend-api/Logger';

const LogOff = () => {
  return (<></>);
};

LogOff.layout = "Blank";
export default LogOff;

export async function getServerSideProps(context: GetServerSidePropsContext) {
  try {
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
  }catch (error: any) {
    // 예외 처리
    getLogger().error(error.toString());
  }

  return {
    props:{},
  };
}