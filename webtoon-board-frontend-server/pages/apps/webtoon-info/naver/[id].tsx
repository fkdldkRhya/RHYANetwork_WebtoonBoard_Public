/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, useState } from "react";
import {
  CardContent,
  Stack,
  Avatar,
  Typography,
  CardMedia,
  Chip,
  Tooltip,
  Box,
  Divider,
  Skeleton,
  TableContainer,
  TableHead,
  Table,
  TableRow,
  TableCell,
  TableBody,
  useTheme,
  Pagination,
} from "@mui/material";
import {
  IconHeart,
  IconPoint,
} from "@tabler/icons-react";

import BlankCard from "@/components/shared/BlankCard";
import Breadcrumb from "@/layouts/full/shared/breadcrumb/Breadcrumb";
import { PagePath } from "../../../../middleware";
import { getLogger } from "@/backend-api/Logger";
import { LOGIN_COOKIE_NAME, getAutoLoginUserId, setSessionAutoLoginValue, userLogout } from "@/backend-api/auth/LoginChecker";
import { findUserFromIdValueClientForSSROnly } from "@/backend-api/client/UserInfoClient";
import { GetServerSidePropsContext } from "next";
import { checkIsAccessWebtoonInfo, getWebtoonAnaylzeInfoFromDB, getNaverWebtoonArticleListForPage, getWebtoonInfo, getNaverWebtoonRecommendList } from "@/backend-api/naver-webtoon/NaverWebtoonClient";
import { getCookie } from "cookies-next";
import { ToastContainer, toast } from "react-toastify";
import 'react-toastify/dist/ReactToastify.css'; 
import NaverWebtoonRecommendCard from "@/components/widgets/naver-webtoon-recommend/NaverWebtoonRecommendCard";

const NaverWebtoonInfo = (props: any) => {

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
      title: "Webtoon info",
    },
  ];

  const theme = useTheme();
  const webtoonId: any = props.webtoonId;
  const webtoonInfo: any = props.webtoonInfo;
  const webtoonAnalyzeInfo: any = props.webtoonAnalyzeInfo;
  const [isLoading, setLoading] = React.useState(true);
  const [articles, setArticlesList] = React.useState([]);
  const [pageSize, setPageSize] = React.useState(20);
  const [startIndex, setStartIndex] = useState(1);
  const [fullCount, setFullCount] = useState(0);
  const [recommendWebtoonList, setRecommendWebtoonList] = useState(new Array<any>());

  // 비동기 데이터 불러오기
  useEffect(() => {
    async function fetch() {
      // 웹툰 회차 리스트
      toast.promise(
        async () => 
        {
          const serverResult = ((await getNaverWebtoonArticleListForPage(webtoonId as string, startIndex, getCookie(LOGIN_COOKIE_NAME) as string)) as any);

          setArticlesList(serverResult.articleList);
          setFullCount(serverResult.pageInfo.totalRows);
          setPageSize(serverResult.pageInfo.pageSize);
        },
        {
          pending: '웹툰 회차 리스트 로딩 중...',
        },
        {
          position: toast.POSITION.TOP_RIGHT,
        }
      );
    }

    fetch();
  }, [,startIndex]);

  // 비동기 데이터 불러오기
  useEffect(() => {
    async function fetch() {
      // 추천 웹툰 리스트
      toast.promise(
        async () => 
        {
          let serverResult = ((await getNaverWebtoonRecommendList(webtoonId as string, getCookie(LOGIN_COOKIE_NAME) as string)) as any) as [];

          if (serverResult && serverResult.length > 6) {
            serverResult = serverResult.slice(0, 6) as [];
          }

          const newArray: Array<any> = new Array<any>();

          await serverResult.forEach(async (obj: any) => {
            const webtoonInfo : any = await getWebtoonInfo(obj.titleId,  getCookie(LOGIN_COOKIE_NAME) as string);

            newArray.push({
              "titleId": obj.titleId,
              "titleName": obj.titleName,
              "displayAuthor": obj.displayAuthor,
              "thumbnailUrl": obj.thumbnailUrl,
              "rank": obj.rank,
              "favoriteCount": webtoonInfo.favoriteCount,
              "publishDayOfWeekList": webtoonInfo.publishDayOfWeekList,
            })
          });

          setRecommendWebtoonList(newArray);
        },
        {
          pending: '추천 웹툰 리스트 로딩 중...',
        },
        {
          position: toast.POSITION.TOP_RIGHT,
        }
      );
    }

    fetch();
  }, []);

  let webtoonAuthorDisplayName: string = "";
  let webtoonAuthorDisplayNameForWriters: any[] = [];
  let webtoonAuthorDisplayNameForPainters: any[] = [];
  let webtoonAuthorDisplayNameForOriginAuthors: any[] = [];
  if (webtoonInfo) {
    if (webtoonInfo?.author?.writers && webtoonInfo?.author?.writers.length > 0) {
      webtoonAuthorDisplayName = `${webtoonAuthorDisplayName}  ${webtoonInfo?.author?.writers[0].name}`;

      webtoonAuthorDisplayNameForWriters = (webtoonInfo?.author?.writers as Array<any>).map((obj) => obj.name);
    }
  
    if (webtoonInfo?.author?.painters && webtoonInfo?.author?.painters.length > 0) {
      webtoonAuthorDisplayName = `${webtoonAuthorDisplayName} | ${webtoonInfo?.author?.painters[0].name}`

      webtoonAuthorDisplayNameForPainters = (webtoonInfo?.author?.painters as Array<any>).map((obj) => obj.name);
    }
  
    if (webtoonInfo?.author?.originAuthors && webtoonInfo?.author?.originAuthors.length > 0) {
      webtoonAuthorDisplayName = `${webtoonAuthorDisplayName} | ${webtoonInfo?.author?.originAuthors[0].name}`

      webtoonAuthorDisplayNameForOriginAuthors = (webtoonInfo?.author?.originAuthors as Array<any>).map((obj) => obj.name);
    }
  }

  webtoonAuthorDisplayName = webtoonAuthorDisplayName.trim();

  useEffect(() => {
    const timer = setTimeout(() => {
      setLoading(false);
    }, 700);

    return () => clearTimeout(timer);
  }, []);

  return (
    <Box>
      <Breadcrumb title="Webtoon Detail Info" items={BCrumb} />
      <ToastContainer />
      {webtoonInfo ? (
        <>
          <BlankCard>
            <>
              {isLoading ? (
                <>
                  <Skeleton
                    animation="wave"
                    variant="rectangular"
                    width="100%"
                    height={600}
                    sx={{
                      borderRadius: (theme) => theme.shape.borderRadius / 5,
                    }}
                  ></Skeleton>
                </>
              ) : (
                <CardMedia
                  component="img"
                  height="600"
                  image={webtoonInfo?.posterThumbnailUrl}
                  alt="green iguana"
                />
              )}
              <CardContent>
                <Stack direction="row" sx={{ marginTop: "-45px" }}>
                  <Tooltip
                    title={webtoonAuthorDisplayName}
                    placement="top">
                    <Avatar
                      aria-label="recipe"
                    ></Avatar>
                  </Tooltip>
                </Stack>
                
                {(webtoonInfo?.new && webtoonInfo?.new as boolean) ? (
                  <Chip
                    label="신작!"
                    size="small"
                    sx={{ marginTop: 2 }}
                  ></Chip>
                ): null}

                {(webtoonInfo?.finished && webtoonInfo?.finished as boolean) ? (
                  <Chip
                    label="완결"
                    size="small"
                    sx={{ marginTop: 2 }}
                  ></Chip>
                ): null}

                {(webtoonInfo?.rest && webtoonInfo?.rest as boolean) ? (
                  <Chip
                    label="휴재"
                    size="small"
                    sx={{ marginTop: 2 }}
                  ></Chip>
                ): null}

                <Box my={3}>
                  <Typography
                    gutterBottom
                    variant="h1"
                    fontWeight={600}
                    color="inherit"
                    sx={{ textDecoration: "none" }}
                  >
                    {webtoonInfo?.titleName}
                  </Typography>
                </Box>
                <Stack direction="row" gap={3} alignItems="center">
                  <Stack direction="row" gap={1} alignItems="center">
                    <IconHeart size="18" /> {webtoonInfo?.favoriteCount}
                  </Stack>

                  <Stack direction="row" ml="auto" alignItems="center">
                    <IconPoint size="16" />
                    <small>
                      {webtoonInfo ? (
                        <>{`${webtoonInfo.publishDayOfWeekList} 웹툰`}</>
                      ) : (
                        "None"
                      )}
                    </small>
                    
                    <IconPoint size="16" />
                    <small>
                      {webtoonInfo ? (
                        <>{webtoonInfo.age.description}</>
                      ) : (
                        "None"
                      )}
                    </small>

                    <IconPoint size="16" />
                    <small>
                      {webtoonInfo ? (
                        <>{webtoonInfo.dailyPass as boolean ? "DailyPass!" : "No dailyPass"}</>
                      ) : (
                        "None"
                      )}
                    </small>
                  </Stack>
                </Stack>
              </CardContent>
              <Divider />
              <CardContent>
                <Typography variant="h2">WEBTOON Default info</Typography>
                <p>
                {webtoonInfo ? (
                        <>{webtoonInfo.synopsis}</>
                      ) : (
                        "None"
                      )}
                </p>

                <Typography fontWeight={600}>{webtoonAnalyzeInfo.provider} - {webtoonInfo?.titleName}</Typography>
                {/*<Typography fontStyle="italic">This is italic text.</Typography>*/}

                <Box my={4}>
                  <Divider />
                </Box>

                <Typography variant="h3">WEBTOON Analyze info</Typography>
                <ul>
                  <li><strong>분석 대상 (회차):</strong> {webtoonAnalyzeInfo.articleStart}회차 부터 {webtoonAnalyzeInfo.articleEnd}회차 까지</li>
                  <li><strong>분석 대상 (댓글):</strong> {webtoonAnalyzeInfo.commentTarget === "BEST" ? "베스트 댓글을 대상으로 분석함" : "최신 댓글을 대상으로 분석함"}</li>
                  <li><strong>댓글 분석 제한 측정 방식:</strong> {webtoonAnalyzeInfo.maxType === "ARTICLE" ? "회차별 개수 확인 방식" : "전체 회차별 개수 확인 방식"}</li>
                  <li><strong>댓글 분석 제한 개수:</strong> {webtoonAnalyzeInfo.maxSize}개 / {webtoonAnalyzeInfo.maxType}</li>
                </ul>
                
                <Box my={4}>
                  <Divider />
                </Box>

                <Typography variant="h3">WEBTOON Author</Typography>
                <ul>
                  <li><strong>Writers:</strong> {webtoonAuthorDisplayNameForWriters.length <= 0 ?
                   "None!" : webtoonAuthorDisplayNameForWriters.join(", ")}</li>
                  <li><strong>Painters:</strong> {webtoonAuthorDisplayNameForPainters.length <= 0 ?
                   "None!" : webtoonAuthorDisplayNameForPainters.join(", ")}</li>
                  <li><strong>Origin authors:</strong> {webtoonAuthorDisplayNameForOriginAuthors.length <= 0 ?
                   "None!" : webtoonAuthorDisplayNameForOriginAuthors.join(", ")}</li>
                </ul>

                <Box my={4}>
                  <Divider />
                </Box>

                <Typography variant="h3">WEBTOON Curation tag</Typography>
                <ul>
                  {
                    webtoonInfo ? 
                    webtoonInfo?.curationTagList.map((tag : any) => (
                      <li>{tag.tagName}</li>
                    )) : null
                  }
                </ul>
                {
                  /*
                <Box my={4}>
                  <Divider />
                </Box>

                <Typography variant="h3">Order list.</Typography>
                <ol>
                  <li>Gigure out what it is or</li>
                  <li>The links it currently</li>
                  <li>It allows you to start your bid</li>
                  <li>Gigure out what it is or</li>
                  <li>The links it currently</li>
                  <li>It allows you to start your bid</li>
                </ol>
                <Box my={4}>
                  <Divider />
                </Box>
                <Typography variant="h3">Quotes</Typography>
                <Box p={2} bgcolor="grey[100]" mt={2}>
                  <Typography variant="h6">
                    <IconQuote /> Life is short, Smile while you still have
                    teeth!
                  </Typography>
                </Box>
                  */
                }
                
                <Box my={4}>
                  <Divider />
                </Box>

                <Typography variant="h3">WEBTOON Article list</Typography>
                <ul>
                  <TableContainer>
                    <Table>
                      <TableHead>
                        <TableRow>
                          <TableCell>
                            <Typography variant="h6">Article No.</Typography>
                          </TableCell>
                          <TableCell>
                            <Typography variant="h6">Thumbnail</Typography>
                          </TableCell>
                          <TableCell>
                            <Typography variant="h6">Star Score</Typography>
                          </TableCell>
                          <TableCell>
                            <Typography variant="h6">BGM</Typography>
                          </TableCell>
                          <TableCell>
                            <Typography variant="h6">UP!</Typography>
                          </TableCell>
                          <TableCell>
                            <Typography variant="h6">Date Description</Typography>
                          </TableCell>
                        </TableRow>
                      </TableHead>
                      <TableBody>
                        {articles.map((article: any) => (
                          <TableRow key={article.no} hover>
                            <TableCell>{article.no}</TableCell>
                            <TableCell>
                              <Avatar
                                    sx={{
                                      borderRadius: '100%',
                                      width: '35',
                                    }}
                                    src={article.thumbnailUrl}
                                  />
                            </TableCell>
                            <TableCell>
                              <Stack direction="row" gap="10px" alignItems="center">
                                <Box>
                                  <Typography variant="h6" fontWeight={600} noWrap>
                                    {article.starScore}
                                  </Typography>
                                  
                                  <Typography
                                    color="textSecondary"
                                    noWrap
                                    sx={{ maxWidth: '250px' }}
                                    variant="subtitle2"
                                    fontWeight={400}
                                  >
                                    {article.subtitle}
                                  </Typography>
                                </Box>
                                {/* <Image src={ticket.thumb} alt="image" width={35} height={35}/> */}
                              </Stack>
                            </TableCell>
                            <TableCell>
                              <Chip
                                sx={{
                                  backgroundColor: article.bgm as boolean ? theme.palette.success.light : theme.palette.error.light,
                                }}
                                size="small"
                                label={`${article.bgm}`}
                              />
                            </TableCell>
                            <TableCell>
                              <Chip
                                sx={{
                                  backgroundColor: article.up as boolean ? theme.palette.success.light : theme.palette.error.light,
                                }}
                                size="small"
                                label={`${article.up}`}
                              />
                            </TableCell>
                            <TableCell>
                              <Typography variant="subtitle1">
                                {`${article.serviceDateDescription}`}
                              </Typography>
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </TableContainer>
                  <Box my={3} display="flex" justifyContent={'center'}>
                    <Pagination count={fullCount <= pageSize ? 1 : fullCount % pageSize == 0 ? Math.trunc((fullCount / pageSize)) : Math.trunc((fullCount / pageSize)) + 1 } color="primary" onChange={(_event: React.ChangeEvent<unknown>, iPage: number) => {
                      setStartIndex(iPage);
                    }} />
                  </Box>
                </ul>

                <Box my={4}>
                  <Divider />
                </Box>

                <Typography variant="h3">WEBTOON Recommend list</Typography>
                <ul>
                  <NaverWebtoonRecommendCard {...{"item": recommendWebtoonList}} />
                </ul>
              </CardContent>
            </>
          </BlankCard>
        </>
      ) : (
        "No found"
      )}
    </Box>
  );
};

export default NaverWebtoonInfo;

export async function getServerSideProps(context: GetServerSidePropsContext) {
  try {
    // 자동 로그인
    const getUserId: number = getAutoLoginUserId(context.req, context.res);
    const userInfo : any = await findUserFromIdValueClientForSSROnly(getUserId, context);
    if (userInfo) { // 자동 로그인 성공
      setSessionAutoLoginValue(context.req, context.res); // 로그인 데이터 갱신
      const userToken: string = getCookie(LOGIN_COOKIE_NAME, { req : context.req, res: context.res }) as string;
      const webtoonId: string  = (context.params as any).id;

      if (userInfo.role != "ADMIN" && !await checkIsAccessWebtoonInfo(webtoonId, getCookie(LOGIN_COOKIE_NAME, { req : context.req, res: context.res }) as string)) {
        // 예외 처리
        getLogger().error("접근 할 수 없는 데이터 입니다.");

        // 메인 페이지로 이동
        return {
          redirect: {
            destination: PagePath.ERROR_404,
            permanent: false,
          },
          props:{ },
        };
      }
    
      // 웹툰 정보 불러오기
      const webtoonInfo : any = await getWebtoonInfo(webtoonId, userToken);
      const webtoonAnalyzeInfo : any = await getWebtoonAnaylzeInfoFromDB(webtoonId, userToken);

      // 데이터 반환
      return {
        props:{
          webtoonId: webtoonId,
          webtoonInfo: webtoonInfo,
          webtoonAnalyzeInfo: webtoonAnalyzeInfo,
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