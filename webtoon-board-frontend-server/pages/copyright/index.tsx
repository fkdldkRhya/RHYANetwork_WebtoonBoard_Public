import { getLogger } from '@/backend-api/Logger';
import { getAutoLoginUserId, setSessionAutoLoginValue, userLogout } from '@/backend-api/auth/LoginChecker';
import { findUserFromIdValueClientForSSROnly } from '@/backend-api/client/UserInfoClient';
import PageContainer from '@/components/container/PageContainer';
import ChildCard from '@/components/shared/ChildCard';
import ParentCard from '@/components/shared/ParentCard';
import Breadcrumb from '@/layouts/full/shared/breadcrumb/Breadcrumb';
import { Typography, Grid } from '@mui/material';
import { GetServerSidePropsContext } from 'next';
import { PagePath } from '../../middleware';

const BCrumb = [
  {
    to: '/',
    title: 'Home',
  },
  {
    title: 'Copyright',
  },
];

const CopyrightPage = () => {
  return (
    <PageContainer>
      {/* breadcrumb */}
      <Breadcrumb title="Copyright" items={BCrumb} />
      {/* end breadcrumb */}
      <Grid container spacing={3}>
        <Grid item sm={12}>
          <ParentCard title="Copyright">
            <Grid container spacing={3}>
              <Grid item sm={12}>
                <ChildCard>
                  <Typography variant="h2">RHYA.Network Service | CodeWorks TM</Typography>
                  <Typography variant="body1" color="textSecondary">
                    Copyright 2023 RHYA.Network. All rights reserved.
                    
                    <br/>
                    <br/>
                    <br/>

                    BSD 2-Clause License
                    <br/>
                    <br/>
                    <br/>
                    Copyright (c) 2023, CHOI SI-HUN
                    <br/>
                    <br/>
                    Redistribution and use in source and binary forms, with or without modification, are permitted provided that the following conditions are met:
                    Redistributions of source code must retain the above copyright notice, this list of conditions and the following disclaimer.
                    Redistributions in binary form must reproduce the above copyright notice, this list of conditions and the following disclaimer in the documentation and/or other materials provided with the distribution.
                    <br/>
                    <br/>
                    THIS SOFTWARE IS PROVIDED BY THE COPYRIGHT HOLDERS AND CONTRIBUTORS "AS IS" AND ANY EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE IMPLIED WARRANTIES OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE ARE DISCLAIMED. IN NO EVENT SHALL THE COPYRIGHT HOLDER OR CONTRIBUTORS BE LIABLE FOR ANY DIRECT, INDIRECT, INCIDENTAL, SPECIAL, EXEMPLARY, OR CONSEQUENTIAL DAMAGES (INCLUDING, BUT NOT LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS OR SERVICES; LOSS OF USE, DATA, OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER CAUSED AND ON ANY THEORY OF LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY, OR TORT (INCLUDING NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE OF THIS SOFTWARE, EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.
                  </Typography>

                  <br/>
                  <br/>
                  
                  <img src="/images/svgs/rn-cw-logo.svg" alt="logo.icon" width="auto" />
                </ChildCard>
              </Grid>
            </Grid>

          </ParentCard>
        </Grid>
      </Grid >


    </PageContainer >
  );
};

export default CopyrightPage;

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