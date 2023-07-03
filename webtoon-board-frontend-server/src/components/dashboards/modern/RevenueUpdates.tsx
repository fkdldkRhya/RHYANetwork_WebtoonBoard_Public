import React, { useEffect } from 'react';
import dynamic from "next/dynamic";
const Chart = dynamic(() => import("react-apexcharts"), { ssr: false });
import { useTheme } from '@mui/material/styles';
import { MenuItem, Grid, Stack, Typography, Button, Avatar, Box } from '@mui/material';
import { IconGridDots } from '@tabler/icons-react';
import DashboardCard from '../../shared/DashboardCard';
import CustomSelect from '../../forms/theme-elements/CustomSelect';
import { ToastContainer, toast } from 'react-toastify';
import { getCommentAnalyzeResultUseTimeGetCount } from '@/backend-api/naver-webtoon/NaverWebtoonClient';
import dayjs from 'dayjs';
import { getCookie } from 'cookies-next';
import { LOGIN_COOKIE_NAME } from '@/backend-api/auth/LoginChecker';
import 'react-toastify/dist/ReactToastify.css'; 
import Link from 'next/link';
import { PagePath } from '../../../../middleware';

const RevenueUpdates = () => {
  const [day, setDay] = React.useState<number>(1);
  
  const userToken: string = getCookie(LOGIN_COOKIE_NAME) as string;
  const [totalCommentCountForP, setTotalCommentCountForP] = React.useState<number>(0); // 긍정 댓글 개수
  const [totalCommentCountForN, setTotalCommentCountForN] = React.useState<number>(0); // 부정 댓글 개수
  const [totalCommentCount, setTotalCommentCount] = React.useState<number>(0); // 총 댓글 개수
  const [commentCountWhereDateForPList, setCommentCountWhereDateForPList] = React.useState<Array<number>>(new Array<number>()); // 부정 댓글 개수 리스트
  const [commentCountWhereDateForNList, setCommentCountWhereDateForNList] = React.useState<Array<number>>(new Array<number>()); // 긍정 댓글 갸수 리스트
  const [dayList, setDayList] = React.useState<Array<string>>(new Array<string>()); // 날짜 리스트

  useEffect(() => {
    async function fetch() {
      try {
          toast.promise(
            async () => 
            {
              const DATE_FORMAT : string = "YYYY-MM-DD";
              const commentCountWhereDateForPListNew : Array<number> = new Array<number>();
              const commentCountWhereDateForNListNew : Array<number> = new Array<number>();
              const dayListNew : Array<string> = new Array<string>();

              let commentCountNew : number = 0;
              let commentCountForPNew : number = 0;
              let commentCountForNNew : number = 0;

              let inputDay : number;
              switch (day) {
                default:
                case 1:
                  inputDay = 7;
                  break;
                case 2:
                  inputDay = 14;
                  break;
                case 3:
                  inputDay = 30;
                  break;
              }

              for (let i = 0; i < inputDay; i ++) {
                const dayStart: string = dayjs().subtract(i, 'day').format(DATE_FORMAT);
                const dayEnd: string = dayjs().format(DATE_FORMAT)
                const pCommentCount : number = await getCommentAnalyzeResultUseTimeGetCount(
                  dayStart, 
                  dayEnd,
                  true,
                  userToken
                );
                const nCommentCount : number = await getCommentAnalyzeResultUseTimeGetCount(
                  dayStart,
                  dayEnd,
                  false,
                  userToken
                );

                commentCountWhereDateForPListNew.push(pCommentCount);
                commentCountWhereDateForNListNew.push(nCommentCount);

                dayListNew.push(dayjs(dayStart).format("MM-DD"));

                commentCountNew = commentCountNew + pCommentCount + nCommentCount;
                commentCountForPNew = commentCountForPNew + pCommentCount;
                commentCountForNNew = commentCountForNNew + nCommentCount;
              }

              setTotalCommentCount(commentCountNew);
              setTotalCommentCountForP(commentCountForPNew);
              setTotalCommentCountForN(commentCountForNNew);
              setCommentCountWhereDateForPList(commentCountWhereDateForPListNew);
              setCommentCountWhereDateForNList(commentCountWhereDateForNListNew);
              setDayList(dayListNew);
            },
            {
              pending: '웹툰 분석 정보 로딩 중...',
            },
            {
              position: toast.POSITION.TOP_RIGHT,
            }
          );
      }catch (error) {}
    } 
    
    fetch();
  }, [, day]);

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setDay(parseInt(event.target.value));
  };
  
  // chart color
  const theme = useTheme();
  const primary = theme.palette.primary.main;
  const secondary = theme.palette.secondary.main;

  // chart
  const optionscolumnchart: any = {
    chart: {
      type: 'bar',
      fontFamily: "'Plus Jakarta Sans', sans-serif;",
      foreColor: '#adb0bb',
      toolbar: {
        show: true,
      },
      height: 360,
      stacked: true,
    },
    colors: [primary, secondary],
    plotOptions: {
      bar: {
        horizontal: false,
        barHeight: '60%',
        columnWidth: '20%',
        borderRadius: [6],
        borderRadiusApplication: 'end',
        borderRadiusWhenStacked: 'all',
      },
    },

    stroke: {
      show: false,
    },
    dataLabels: {
      enabled: false,
    },
    legend: {
      show: false,
    },
    grid: {
      borderColor: 'rgba(0,0,0,0.1)',
      strokeDashArray: 3,
      xaxis: {
        lines: {
          show: false,
        },
      },
    },
    yaxis: {
      tickAmount: 4,
    },
    xaxis: {
      categories: dayList,
      axisBorder: {
        show: false,
      },
    },
    tooltip: {
      theme: theme.palette.mode === 'dark' ? 'dark' : 'light',
      fillSeriesColor: false,
    },
  };
  const seriescolumnchart = [
    {
      name: 'Positive',
      data: commentCountWhereDateForPList,
    },
    {
      name: 'Negative',
      data: commentCountWhereDateForNList,
    },
  ];

  return (
    <>
      <ToastContainer/>
      <DashboardCard
        title="최근 분석된 웹툰 전체 긍/부정 댓글 개수"
        subtitle="Total number of positive/negative comments analyzed for webtoons"
        action={
          <CustomSelect
            labelId="month-dd"
            id="month-dd"
            size="small"
            value={day}
            onChange={handleChange}
          >
            <MenuItem value={1}>7 Day</MenuItem>
            <MenuItem value={2}>14 Day</MenuItem>
            <MenuItem value={3}>30 Day</MenuItem>
          </CustomSelect>
        }
      >
        <Grid container spacing={3}>
          {/* column */}
          <Grid item xs={12} sm={8}>
            <Chart
              options={optionscolumnchart}
              series={seriescolumnchart}
              type="bar"
              height={360}
              width={"100%"}
            />
          </Grid>
          {/* column */}
          <Grid item xs={12} sm={4}>
            <Stack spacing={3} mt={3}>
              <Stack direction="row" spacing={2} alignItems="center">
                <Box
                  width={40}
                  height={40}
                  bgcolor="primary.light"
                  display="flex"
                  alignItems="center"
                  justifyContent="center"
                >
                  <Typography color="primary" variant="h6" display="flex">
                    <IconGridDots size={24} />
                  </Typography>
                </Box>
                <Box>
                  <Typography variant="h3" fontWeight="700">
                    {totalCommentCount} 개
                  </Typography>
                  <Typography variant="subtitle2" color="textSecondary">
                    Total comment count
                  </Typography>
                </Box>
              </Stack>
            </Stack>
            <Stack spacing={3} my={5}>
              <Stack direction="row" spacing={2}>
                <Avatar
                  sx={{ width: 9, mt: 1, height: 9, bgcolor: primary, svg: { display: 'none' } }}
                ></Avatar>
                <Box>
                  <Typography variant="subtitle1" color="textSecondary">
                    Total Positive
                  </Typography>
                  <Typography variant="h5">{totalCommentCountForP} 개</Typography>
                </Box>
              </Stack>
              <Stack direction="row" spacing={2}>
                <Avatar
                  sx={{ width: 9, mt: 1, height: 9, bgcolor: secondary, svg: { display: 'none' } }}
                ></Avatar>
                <Box>
                  <Typography variant="subtitle1" color="textSecondary">
                    Total Negative
                  </Typography>
                  <Typography variant="h5">{totalCommentCountForN} 개</Typography>
                </Box>
              </Stack>
            </Stack>
            <Button component={Link} href={PagePath.WEBTOON_LIST} color="primary" variant="contained" fullWidth>
              View Full Report
            </Button>
          </Grid>
        </Grid>
      </DashboardCard>
    </>
  );
};

export default RevenueUpdates;
