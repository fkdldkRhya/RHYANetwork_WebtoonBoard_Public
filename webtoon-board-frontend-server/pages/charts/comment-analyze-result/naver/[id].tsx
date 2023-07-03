import dynamic from "next/dynamic";
const Chart = dynamic(() => import("react-apexcharts"), { ssr: false });
import { useTheme } from '@mui/material/styles';
import PageContainer from '../../../../src/components/container/PageContainer';
import Breadcrumb from '../../../../src/layouts/full/shared/breadcrumb/Breadcrumb';
import ParentCard from '../../../../src/components/shared/ParentCard';
import React, { useEffect } from "react";
import { checkIsAccessWebtoonInfo, getCommentAnalyzeResult, getCommentWordFrequencyInfo, getWebtoonInfo } from "@/backend-api/naver-webtoon/NaverWebtoonClient";
import { GetServerSidePropsContext } from "next";
import { LOGIN_COOKIE_NAME, getAutoLoginUserId, setSessionAutoLoginValue, userLogout } from "@/backend-api/auth/LoginChecker";
import { findUserFromIdValueClientForSSROnly } from "@/backend-api/client/UserInfoClient";
import { getLogger } from "@/backend-api/Logger";
import { PagePath } from "../../../../middleware";
import { getCookie } from "cookies-next";
import { TableContainer, Table, TableHead, TableRow, TableCell, Typography, TableBody, Chip, Grid } from "@mui/material";
import NaverWebtoonCommentList from "@/components/apps/webtoon-comment-naver/NaverWebtoonCommentList";
import WordCloud from "react-d3-cloud";
import 'react-toastify/dist/ReactToastify.css'; 
import { ToastContainer, toast } from "react-toastify";

const BCrumb = [
  {
    to: PagePath.DASHBOARDS_MODERN,
    title: 'Home',
  },
  {
    to: PagePath.WEBTOON_LIST,
    title: 'Webtoon list',
  },
  {
    title: 'Webtoon Comment Analyze Result',
  },
];

const CommentAnalyzeResultForNaver = (params : any) => {
  const [aValue, setAValue] = React.useState<any>([]); // x축 회차
  const [pValue, setPValue] = React.useState<any>([]); // 긍정
  const [nValue, setNValue] = React.useState<any>([]); // 부정
  const [ccValue, setCCValue] = React.useState<any>([]); // 전체 댓글 개수
  const [pfValue, setPFValue] = React.useState<any>(0); // 전체 긍정 댓글 개수
  const [nfValue, setNFValue] = React.useState<any>(0); // 전체 부정 댓글 개수
  const [maValue, setMAValue] = React.useState<any>(0); // 댓글이 가장 많은 회차
  const [pmaValue, setPMAValue] = React.useState<any>(0); // 댓글이 가장 많은 회차의 긍정 댓글 개수
  const [nmaValue, setNMAValue] = React.useState<any>(0); // 댓글이 가장 많은 회차의 부정 댓글 개수
  const [wordCloudChartValue, setWordCloudChartValue] = React.useState<any>([]); // 워드 클라우드 데이터
  const [commentWordFrequencyInfo, setCommentWordFrequencyInfo] = React.useState<any>([]); // 단어 출현 빈도 수
  const [mostCommentCountArticleCommentList, setMostCommentCountArticleCommentList] = React.useState<any>([]); // 댓글이 가장 많은 회차의 댓글 목록
  const [sareaChartTitle, setSareaChartTitle] = React.useState<string>("Webtoon Comment Analyze Result");
  const [gradientChartTitle, setGradientChartTitle] = React.useState<string>("Webtoon Comment Analyze Result");
  const [cwfTableTitle, setCWFTableTitle] = React.useState<string>("Webtoon Comment Analyze Result");

  // chart color
  const theme = useTheme();
  const primary = theme.palette.primary.main;
  const primarylight = theme.palette.primary.light;
  const secondary = theme.palette.secondary.main;
  const secondarylight = theme.palette.secondary.light;
  const warning = theme.palette.warning.main;

  const fetchData = async () => {
    toast.promise(async () => {
      // 사용자 인증 토큰
      const token : string = getCookie(LOGIN_COOKIE_NAME) as string;
      const webtoonId : string = params.webtoonId as string;

      // 웹툰 기본 정보 가져오기
      // ==============================================================
      const webtoonInfo : any = await getWebtoonInfo(webtoonId, token);
      // ==============================================================

      // 긍정, 부정 데이터 가져오기
      // ==============================================================
      const panInfo : any = await getCommentAnalyzeResult(webtoonId, token);
      // ==============================================================
      
      // 댓글 단어 빈도 수 데이터 가져오기
      // ==============================================================
      const commentWordFrequencyInfo: any = await getCommentWordFrequencyInfo(webtoonId, token);
      // ==============================================================

      // 기본 정보 설정
      setSareaChartTitle(`${webtoonInfo.titleName} | NAVER WEBTOON - 긍정/부정 통계`);
      setGradientChartTitle(`${webtoonInfo.titleName} | NAVER WEBTOON - 댓글 개수 통계`);
      setCWFTableTitle(`${webtoonInfo.titleName} | NAVER WEBTOON - 댓글 단어 출현 빈도`);

      let genAValue : Array<string> = []; // 회차 정보

      let genPValue : Array<number> = []; // 긍정 정보
      let genNValue : Array<number> = []; // 부정 정보

      let pfValue : number = 0; // 전체 긍정 댓글 개수
      let nfValue : number = 0; // 전체 부정 댓글 개수

      let pmaValue : number = 0; // 가장 많은 회차의 긍정 댓글 개수
      let nmaValue : number = 0; // 가장 많은 회차의 부정 댓글 개수

      let genCCValue : Array<number> = []; // 전체 댓글 개수 정보
      
      let commentCountMostBigArticle : number = 0; // 댓글 가장 많은 회차
      let commentCountMostBigCount : number = 0; // 가장 많은 댓글 개수

      let genMostCommentCountArticleCommentList : Array<any> = []; // 댓글 가장 많은 회차의 댓글 목록

      let pCount : number = 0;
      let nCount : number = 0;
      let cCount : number = 0;
      let backArticle : number = 1;
      let forEachIndex : number = 0;
      let isStartIndex : boolean = true;

      panInfo.forEach((item : any) => {
        let article = item._source.article;
        const articleText: string = `${article} 화`;
        
        if (isStartIndex) {
          isStartIndex = false;
          backArticle = article;
        }
        
        if (backArticle != article || forEachIndex == panInfo.length - 1) {
          if (forEachIndex == panInfo.length - 1) {
            cCount ++;

            if (!genAValue.includes(articleText)) {
              backArticle = article;
              genAValue.push(articleText);
            }
          }

          if (commentCountMostBigCount < pCount + nCount && commentCountMostBigArticle != article) {
            commentCountMostBigCount = pCount + nCount;
            commentCountMostBigArticle = backArticle;

            pmaValue = pCount;
            nmaValue = nCount;

            genMostCommentCountArticleCommentList.length = 0;
          }

          genPValue.push(pCount);
          genNValue.push(nCount);
          genCCValue.push(cCount);

          backArticle = article;

          pCount = 0;
          nCount = 0;

          cCount = 0;
        }

        if (item._source.comment_result as boolean) {
          pCount++;
          pfValue++;
        }else {
          nCount++;
          nfValue++;
        }

        if (!genAValue.includes(articleText)) {
          backArticle = article;
          genAValue.push(articleText);
        }

        cCount ++;
        forEachIndex ++;
      });

      setAValue(genAValue);
      setPValue(genPValue);
      setNValue(genNValue);
      setCCValue(genCCValue);
      setPFValue(pfValue);
      setNFValue(nfValue);
      setPMAValue(pmaValue);
      setNMAValue(nmaValue);
      setMAValue(commentCountMostBigArticle);
      setCommentWordFrequencyInfo(JSON.parse(commentWordFrequencyInfo).slice(0, 10));

      setMostCommentCountArticleCommentList(
        panInfo.filter((f: any) => (f._source.article as number) === commentCountMostBigArticle)
      );

      // Create word cloud chart
      let wordCloudChartTextColorArrayIndex : number = 0;
      const wordCloudChartTextColorArray : any = [ theme.palette.error.main, secondarylight, primary, secondary, warning ];
      const wordCloudChart : any = new Array<any>();
      JSON.parse(commentWordFrequencyInfo).slice(0, 50).forEach((element: any) => {
        wordCloudChart.push({
          "text": element.word,
          "value": element.count,
          "color": wordCloudChartTextColorArray[wordCloudChartTextColorArrayIndex],
        });

        if (wordCloudChartTextColorArray.length - 1 == wordCloudChartTextColorArrayIndex)
          wordCloudChartTextColorArrayIndex = 0;
        else
          wordCloudChartTextColorArrayIndex += 1;
      });
      setWordCloudChartValue(wordCloudChart);
    },
    {
      pending: "분석 데이터를 불러오는 중입니다...",
    },
    {
      position: "top-right",
    })
  };

  useEffect(() => {
    fetchData();
  }, []);

  const optionsareachart:any = {
    chart: {
      id: 'area-chart',
      fontFamily: "'Plus Jakarta Sans', sans-serif",
      foreColor: '#adb0bb',
      zoom: {
        enabled: true,
      },
      toolbar: {
        show: false,
      },
    },
    dataLabels: {
      enabled: false,
    },
    stroke: {
      width: '3',
      curve: 'smooth',
    },
    colors: [primary, secondary],
    xaxis: {
      type: 'category',
      categories: aValue,
    },
    yaxis: {
      opposite: false,
      labels: {
        show: true,
      },
    },
    legend: {
      show: true,
      position: 'bottom',
      width: '50px',
    },
    grid: {
      show: false,
    },
    tooltip: {
      theme: 'dark',
      fillSeriesColor: false,
    },
  };

  const seriesareachart = [
    {
      name: 'Positive',
      data: pValue,
    },
    {
      name: 'Negative',
      data: nValue,
    },
  ];

  const optionsgredientchart: any = {
    chart: {
      height: 350,
      type: 'line',
      fontFamily: "'Plus Jakarta Sans', sans-serif",
      foreColor: '#adb0bb',
      toolbar: {
        show: false,
      },
      dropShadow: {
        enabled: true,
        color: 'rgba(0,0,0,0.2)',
        top: 12,
        left: 4,
        blur: 3,
        opacity: 0.4,
      },
    },
    stroke: {
      width: 7,
      curve: 'smooth',
    },
    xaxis: {
      type: 'category',
      categories: aValue,
    },
    fill: {
      type: 'gradient',
      gradient: {
        shade: 'dark',
        gradientToColors: [primary],
        shadeIntensity: 1,
        type: 'horizontal',
        opacityFrom: 1,
        opacityTo: 0.9,
        stops: [0, 100, 100, 100],
      },
    },
    markers: {
      size: 4,
      opacity: 0.9,
      colors: [primary],
      strokeColor: '#fff',
      strokeWidth: 2,

      hover: {
        size: 7,
      },
    },
    tooltip: {
      theme: 'dark',
    },
    grid: {
      show: false,
    },
  };

  const seriesgredientchart: any = [
    {
      name: 'Comments',
      data: ccValue,
    },
  ];

  // 1
  const optionsdoughnutchart: any = {
    labels: ['Positive', 'Negative'],
    chart: {
      id: 'donut-chart',
      fontFamily: "'Plus Jakarta Sans', sans-serif",
      foreColor: '#adb0bb',
    },
    dataLabels: {
      enabled: false,
    },
    plotOptions: {
      pie: {
        donut: {
          size: '70px',
        },
      },
    },
    legend: {
      show: true,
      position: 'bottom',
      width: '50px',
    },
    colors: [primary, primarylight, secondary, secondarylight, warning],
    tooltip: {
      theme: 'dark',
      fillSeriesColor: false,
    },
  };

  const seriesdoughnutchart = [pfValue, nfValue];

  // 2
  const optionspiechart: any = {
    labels: ['Positive', 'Negative'],
    chart: {
      id: 'pie-chart',
      fontFamily: "'Plus Jakarta Sans', sans-serif",
      foreColor: '#adb0bb',
      toolbar: {
        show: false,
      },
    },
    dataLabels: {
      enabled: false,
    },
    plotOptions: {
      pie: {
        donut: {
          size: '70px',
        },
      },
    },
    legend: {
      show: true,
      position: 'bottom',
      width: '50px',
    },
    colors: [primary, primarylight, secondary, secondarylight, warning],
    tooltip: {
      fillSeriesColor: false,
    },
  };
  
  const seriespiechart = [pmaValue, nmaValue];
  
  return (
    <PageContainer>
      <ToastContainer />
      <Breadcrumb title="Webtoon Comment Analyze Result" items={BCrumb} />

      <ParentCard title={sareaChartTitle}>
        <Chart options={optionsareachart} series={seriesareachart} type="area" height="300px" width={"100%"}/>
      </ParentCard>

      <ParentCard title={gradientChartTitle}>
        <Chart
          options={optionsgredientchart}
          series={seriesgredientchart}
          type="line"
          height="300px"
          width={"100%"}
        />
      </ParentCard>

      <ParentCard title={cwfTableTitle}>
        <TableContainer>
          <Table
            aria-label="simple table"
            sx={{
              whiteSpace: 'nowrap',
            }}
          >
            <TableHead>
              <TableRow>
                <TableCell>
                  <Typography variant="h6">Comment word</Typography>
                </TableCell>
                <TableCell>
                  <Typography variant="h6">Frequency</Typography>
                </TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {commentWordFrequencyInfo.map((item: any) => (
                <TableRow>
                  <TableCell>
                    <Typography variant="h6" fontWeight={400}>
                      {item.word}
                    </Typography>
                  </TableCell>
                  <TableCell>
                    {/* <Chip chipcolor={basic.status == 'Active' ? 'success' : basic.status == 'Pending' ? 'warning' : basic.status == 'Completed' ? 'primary' : basic.status == 'Cancel' ? 'error' : 'secondary'} */}
                    <Chip
                      sx={{
                        bgcolor: (theme) => theme.palette.primary.light,
                        color: (theme) => theme.palette.primary.main,
                        borderRadius: '8px',
                      }}
                      size="small"
                      label={item.count}
                    />
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </ParentCard>
      
      <ParentCard title="워드 클라우드 [Word Cloud]">
        <WordCloud 
          data={wordCloudChartValue}
          font="Impact"
          fontStyle="italic"
          fontWeight="bold"
          spiral="rectangular"
          rotate={-45}  
          fontSize={(word) => Math.log2(word.value) * 5}
          fill={(d: any, i: any) => d.color}
          padding={5}
          random={Math.random} />
      </ParentCard>

      <Grid container spacing={3}>
        <Grid item lg={6} md={12} xs={12}>
          <ParentCard title="긍정/부정 댓글 전체 비율">
            <Chart
              options={optionsdoughnutchart}
              series={seriesdoughnutchart}
              type="donut"
              height="300px"
              width={"100%"}
            />
          </ParentCard>
        </Grid>

        <Grid item lg={6} md={12} xs={12}>
          <ParentCard title={`가장 댓글이 많은 회차 긍정/부정 비율 [${maValue} 화]`}>
            <Chart options={optionspiechart} series={seriespiechart} type="pie" height="300px" width={"100%"} />
          </ParentCard>
        </Grid>
      </Grid>

      <ParentCard title="가장 댓글이 많은 회차 댓글 리스트">
        <NaverWebtoonCommentList {...{"list" : mostCommentCountArticleCommentList}}/>
      </ParentCard>
    </PageContainer>
  );
};

export default CommentAnalyzeResultForNaver;

export async function getServerSideProps(context: GetServerSidePropsContext) {
  try {
    // 자동 로그인
    const getUserId: number = getAutoLoginUserId(context.req, context.res);
    const userInfo : any = await findUserFromIdValueClientForSSROnly(getUserId, context);
    if (userInfo) { // 자동 로그인 성공
      setSessionAutoLoginValue(context.req, context.res); // 로그인 데이터 갱신

      const webtoonId: string  = (context.params as any).id

      if (userInfo.role != "ADMIN" && !await checkIsAccessWebtoonInfo(webtoonId, getCookie(LOGIN_COOKIE_NAME, { req : context.req, res: context.res }) as string)) {
        // 예외 처리
        getLogger().error("접근 할 수 없는 데이터 입니다.");

        // 메인 페이지로 이동
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
          webtoonId: (context.params as any).id,
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