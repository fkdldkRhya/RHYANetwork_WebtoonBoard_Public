import Breadcrumb from '../../../src/layouts/full/shared/breadcrumb/Breadcrumb';
import PageContainer from '../../../src/components/container/PageContainer';
import TicketListing from '../../../src/components/apps/tickets/TicketListing';
import TicketFilter from '../../../src/components/apps/tickets/TicketFilter';
import ChildCard from '../../../src/components/shared/ChildCard';
import { getLogger } from '@/backend-api/Logger';
import { LOGIN_COOKIE_NAME, getAutoLoginUserId, setSessionAutoLoginValue, userLogout } from '@/backend-api/auth/LoginChecker';
import { PagePath } from '../../../middleware';
import { GetServerSidePropsContext } from 'next';
import { findUserFromIdValueClientForSSROnly } from '@/backend-api/client/UserInfoClient';
import 'react-toastify/dist/ReactToastify.css'; 
import { ToastContainer, toast } from "react-toastify";
import { useEffect, useState } from 'react';
import { getRegisteredNaverWebtoonAllInfoNoOffset } from '@/backend-api/naver-webtoon/NaverWebtoonClient';
import { getCookie } from 'cookies-next';

const BCrumb = [
  {
    to: '/',
    title: 'Home',
  },
  {
    title: 'Webtoon list',
  },
];

const WebtoonList = () => {
  const [webtoonList, setWebtoonList] = useState([]);

  useEffect(() => {
    async function fetch() {
      try {
        toast.promise(
          async () => 
          {
            setWebtoonList(((await getRegisteredNaverWebtoonAllInfoNoOffset(getCookie(LOGIN_COOKIE_NAME) as string)) as any).data);
          },
          {
            pending: '웹툰 리스트 로딩 중...',
          },
          {
            position: toast.POSITION.TOP_RIGHT,
          }
        );
      }catch (error) {}
    }

    fetch();
  }, []);


  return (
    <PageContainer>
      <ToastContainer />
      <Breadcrumb title="Webtoon list" items={BCrumb} />
      <ChildCard>
        <TicketFilter />
        <TicketListing {...webtoonList} />
      </ChildCard>
    </PageContainer>
  );
};

export default WebtoonList;

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
      destination: PagePath.ERROR_404,
      permanent: false,
    },
    props:{},
  };
}
