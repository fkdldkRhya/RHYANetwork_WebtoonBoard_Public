
import { getLogger } from '@/backend-api/Logger';
import { LOGIN_COOKIE_NAME, getAutoLoginUserId, setSessionAutoLoginValue, userLogout } from '@/backend-api/auth/LoginChecker';
import { GetServerSidePropsContext } from 'next';
import { findUserFromIdValueClientForSSROnly } from '@/backend-api/client/UserInfoClient';
import 'react-toastify/dist/ReactToastify.css'; 
import { ToastContainer, toast } from "react-toastify";
import { useEffect } from 'react';
import { getNaverWebtoonDaliyList } from '@/backend-api/naver-webtoon/NaverWebtoonClient';
import { getCookie } from 'cookies-next';
import Breadcrumb from '@/layouts/full/shared/breadcrumb/Breadcrumb';
import PageContainer from '@/components/container/PageContainer';
import React from 'react';
import { PagePath } from '../../../../middleware';
import NaverWebtoonDaliyCard from '@/components/widgets/naver-webtoon-daliy/NaverWebtoonDaliyCard';

const BCrumb = [
  {
    to: '/',
    title: 'Home',
  },
  {
    title: 'Daliy webtoon list',
  },
];

const DaliyWebtoonList = () => {
    const [daliyWebtoonListOrg, setDaliyWebtoonListForOrg] = React.useState<any>({});

    useEffect(() => {
        async function fetch() {
            try {
                toast.promise(
                    async () => 
                    {
                        const result : any = await getNaverWebtoonDaliyList(getCookie(LOGIN_COOKIE_NAME) as string) as any;

                        if (result.titleList.length > 15) {
                            result.titleList = result.titleList.slice(0, 15);
                        }

                        setDaliyWebtoonListForOrg(result);

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
            <Breadcrumb title="Daliy webtoon list" items={BCrumb} />

            <NaverWebtoonDaliyCard {...daliyWebtoonListOrg}/>
        </PageContainer>
    );
};

export default DaliyWebtoonList;

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
