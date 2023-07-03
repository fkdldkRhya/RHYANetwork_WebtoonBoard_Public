import dynamic from "next/dynamic";
const Chart = dynamic(() => import("react-apexcharts"), { ssr: false });
import { useTheme } from '@mui/material/styles';

import DashboardWidgetCard from '../../shared/DashboardWidgetCard';
import { ToastContainer, toast } from "react-toastify";
import { useEffect } from "react";
import { getAllCommentDoubleValueAVG, getCommentDoubleValueAVG } from "@/backend-api/naver-webtoon/NaverWebtoonClient";
import { LOGIN_COOKIE_NAME } from "@/backend-api/auth/LoginChecker";
import { getCookie } from "cookies-next";
import 'react-toastify/dist/ReactToastify.css'; 
import React from "react";

const EmployeeSalary = () => {
  const userToken: string = getCookie(LOGIN_COOKIE_NAME) as string;
  const [pAVGValue, setPAVGValue] = React.useState<number>(0);
  const [nAVGValue, setNAVGValue] = React.useState<number>(0);
  const [allAVGValue, setAllAVGValue] = React.useState<number>(0);

  useEffect(() => {
    async function fetch() {
      try {
        toast.promise(
          async () => 
          {
            const pAVGValue : number = await getCommentDoubleValueAVG(true, userToken);
            const nAVGValue : number = await getCommentDoubleValueAVG(false, userToken);
            const allAVGValue : number = await getAllCommentDoubleValueAVG(userToken);

            if (pAVGValue && nAVGValue && allAVGValue) {
              setPAVGValue(parseFloat(pAVGValue.toFixed(3)));
              setNAVGValue(parseFloat(nAVGValue.toFixed(3)));
              setAllAVGValue(parseFloat(allAVGValue.toFixed(3)));
            }
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
  }, []);

  // chart color
  const theme = useTheme();
  const primary = theme.palette.primary.main;
  const primarylight = theme.palette.grey[100];

  // chart
  const optionscolumnchart: any = {
    chart: {
      type: 'bar',
      fontFamily: "'Plus Jakarta Sans', sans-serif;",
      foreColor: '#adb0bb',
      toolbar: {
        show: false,
      },
      height: 280,
    },
    colors: [primarylight, primarylight, primary, primarylight, primarylight, primarylight],
    plotOptions: {
      bar: {
        borderRadius: 4,
        columnWidth: '45%',
        distributed: true,
        endingShape: 'rounded',
      },
    },
    dataLabels: {
      enabled: false,
    },
    legend: {
      show: false,
    },
    grid: {
      yaxis: {
        lines: {
          show: false,
        },
      },
    },
    xaxis: {
      categories: [['Positive'], ['Negative'], ['Total AVG']],
      axisBorder: {
        show: false,
      },
    },
    yaxis: {
      labels: {
        show: false,
      },
      max: 100,
    },
    tooltip: {
      theme: theme.palette.mode === 'dark' ? 'dark' : 'light',
    },
  };
  const seriescolumnchart = [
    {
      name: '',
      data: [pAVGValue, nAVGValue, allAVGValue],
    },
  ];

  return (
    <DashboardWidgetCard
      title="댓글 긍정 부정 평균"
      subtitle="Comments, positive and negative average"
      dataLabel1="Positive"
      dataItem1={`${pAVGValue}`}
      dataLabel2="Negative"
      dataItem2={`${nAVGValue}`}
    >
      <>
        <ToastContainer/>
        <Chart options={optionscolumnchart} series={seriescolumnchart} type="bar" height={327.5} width={"100%"} />
      </>
    </DashboardWidgetCard>
  );
};

export default EmployeeSalary;
