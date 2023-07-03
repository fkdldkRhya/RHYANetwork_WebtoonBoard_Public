import React, { useEffect } from 'react';
import DashboardCard from '../../shared/DashboardCard';
import {
  Typography,
  Box,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  Avatar,
  Chip,
  TableContainer,
  Stack,
  Tooltip,
  IconButton,
} from '@mui/material';
import { ToastContainer, toast } from 'react-toastify';
import { getCookie } from 'cookies-next';
import { LOGIN_COOKIE_NAME } from '@/backend-api/auth/LoginChecker';
import { getAllCommentCountRanking, getWebtoonInfo } from '@/backend-api/naver-webtoon/NaverWebtoonClient';
import { getProviderImage } from '@/utils/webtoon-provider-images';
import { IconExternalLink } from '@tabler/icons-react';
import { PagePath } from '../../../../middleware';
import router from 'next/router';

const TopPerformers = () => {
  const userToken: string = getCookie(LOGIN_COOKIE_NAME) as string;
  const [ranking, setRanking] = React.useState<Array<any>>(new Array<any>());

  useEffect(() => {
    async function fetch() {
      try {
        toast.promise(
          async () => 
          {
            const rankingArray : Array<any> = new Array<any>();
            const ranking : Array<any> = await getAllCommentCountRanking(userToken);
            if (ranking) {
              let rank : number = 1;
              for (const rankingItemValue of ranking) {
                const webtoonId : number = rankingItemValue.key;
                const count : number = rankingItemValue.doc_count;

                const webtoonInfo : any = await getWebtoonInfo(webtoonId.toString(), userToken);

                let displayAuthor : string = "";
                let displayAuthorInfoW : string = "None!";
                let displayAuthorInfoP : string = "None!";
                let displayAuthorInfoO : string = "None!";
                if (webtoonInfo.author.writers && webtoonInfo.author.writers.length > 0)
                  displayAuthorInfoW = webtoonInfo.author.writers[0].name;
                if (webtoonInfo.author.painters && webtoonInfo.author.painters.length > 0)
                  displayAuthorInfoP = webtoonInfo.author.painters[0].name;
                if (webtoonInfo.author.originAuthors && webtoonInfo.author.originAuthors.length > 0)
                  displayAuthorInfoO = webtoonInfo.author.originAuthors[0].name;
                displayAuthor = `${displayAuthorInfoW}, ${displayAuthorInfoP}, ${displayAuthorInfoO}`
                displayAuthor = displayAuthor.replace(", None!", "");
                displayAuthor = displayAuthor.replace("None!,", "");
                displayAuthor = displayAuthor.replace("  ", " ");
                displayAuthor = displayAuthor.trim();

                rankingArray.push({
                  webtoonId: webtoonId,
                  count: count,
                  title: webtoonInfo.titleName,
                  thumbnail: webtoonInfo.thumbnailUrl,
                  author: displayAuthor,
                  rank: rank++,
                  provider: "NAVER",
                })
              }
            }

            setRanking(rankingArray);
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

  // for select
  const [month, setMonth] = React.useState('1');
  
  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setMonth(event.target.value);
  };

  return (
    <DashboardCard
      title="웹툰 댓글 수 Top 5"
      subtitle="Top 5 webtoon comments"
    >
      <>
        <ToastContainer/>
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
                  <Typography variant="subtitle2" fontWeight={600}>Ranking</Typography>
                </TableCell>
                <TableCell>
                  <Typography variant="subtitle2" fontWeight={600}>Webtoon Info</Typography>
                </TableCell>
                <TableCell>
                  <Typography variant="subtitle2" fontWeight={600}>Provider</Typography>
                </TableCell>
                <TableCell>
                  <Typography variant="subtitle2" fontWeight={600}>Comment Count</Typography>
                </TableCell>
                <TableCell>
                  <Typography variant="subtitle2" fontWeight={600}>Menu</Typography>
                </TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {ranking.map((info) => (
                <TableRow key={info.webtoonId}>
                  <TableCell>
                    {/* <Chip chipcolor={basic.status == 'Active' ? 'success' : basic.status == 'Pending' ? 'warning' : basic.status == 'Completed' ? 'primary' : basic.status == 'Cancel' ? 'error' : 'secondary'} */}
                    <Chip
                      sx={{
                        bgcolor:
                          info.rank === 1
                            ? (theme) => theme.palette.error.light
                            : info.rank === 2
                              ? (theme) => theme.palette.warning.light
                              : info.rank === 3
                                ? (theme) => theme.palette.success.light
                                : (theme) => theme.palette.secondary.light,
                        color:
                          info.rank === 1
                            ? (theme) => theme.palette.error.main
                            : info.rank === 2
                              ? (theme) => theme.palette.warning.main
                              : info.rank === 3
                                ? (theme) => theme.palette.success.main
                                : (theme) => theme.palette.secondary.main,
                        borderRadius: '8px',
                      }}
                      size="small"
                      label={info.rank}
                    />
                  </TableCell>
                  <TableCell>
                    <Stack direction="row" spacing={2}>
                      <Avatar src={info.thumbnail} alt={info.title} sx={{ width: 40, height: 40 }} />
                      <Box>
                        <Typography variant="subtitle2" fontWeight={600}>
                          {info.title}
                        </Typography>
                        <Typography color="textSecondary" fontSize="12px" variant="subtitle2">
                          {info.author}
                        </Typography>
                      </Box>
                    </Stack>
                  </TableCell>
                  <TableCell>
                    <Stack direction="row" gap="10px" alignItems="center">
                      <Avatar
                        src={getProviderImage(info.provider.toString())}
                        sx={{
                          borderRadius: '100%',
                          width: '35',
                        }}
                      />
                      {/* <Image src={ticket.thumb} alt="image" width={35} height={35}/> */}
                      <Typography color="textSecondary" variant="subtitle2" fontWeight={400}>{info.provider}</Typography>
                    </Stack>
                  </TableCell>
                  <TableCell>
                    <Typography variant="subtitle2">{info.count} 개</Typography>
                  </TableCell>
                  <TableCell align="center">
                    <Tooltip title="Webtoon anaylze info view now">
                      <IconButton>
                        <IconExternalLink size="18" onClick={() => {
                          router.push(`${PagePath.CHARTS_WEBTOON_COMMENT_ANALYZE_RESULT_FOR_NAVER}/${info.webtoonId}`);
                        }} />
                      </IconButton>
                    </Tooltip>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </>
    </DashboardCard>
  );
};

export default TopPerformers;
