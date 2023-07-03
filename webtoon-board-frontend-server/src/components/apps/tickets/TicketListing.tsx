import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from '../../../store/Store';
import {
  Box,
  Table,
  TableContainer,
  TableHead,
  TableRow,
  TableCell,
  Typography,
  TableBody,
  IconButton,
  Chip,
  Stack,
  Avatar,
  Tooltip,
  TextField,
  Pagination,
  useTheme,
  Dialog,
  AppBar,
  Button,
  Divider,
  List,
  ListItem,
  ListItemText,
  Toolbar,
  Slide,
} from '@mui/material';
import { fetchTickets, SearchTicket } from '../../../store/apps/tickets/TicketSlice';
import { IconMenu, IconX } from '@tabler/icons-react';
import { TicketType } from '../../../types/apps/ticket';
import { getProviderImage } from '@/utils/webtoon-provider-images';
import { TransitionProps } from '@mui/material/transitions';
import { useRouter } from 'next/router';
import { PagePath } from '../../../../middleware';

const Transition = React.forwardRef(function Transition(
  props: TransitionProps & {
    children: React.ReactElement;
  },
  ref: React.Ref<unknown>,
) {
  return <Slide direction="up" ref={ref} {...props} />;
});

const TicketListing = (webtoonList : any) => {
  const dispatch = useDispatch();
  const theme = useTheme();
  const LIMIT: number = 10;

  useEffect(() => {
    dispatch(fetchTickets(webtoonList));
  }, [dispatch, webtoonList]);

  const getVisibleTickets = (tickets: TicketType[], filter: string, ticketSearch: string) => {
    if (!tickets) return [];

    switch (filter) {
      case 'naver_webtoon':
        return tickets.filter(
          (c) => c.provider == "NAVER" && c.title.toLocaleLowerCase().includes(ticketSearch),
        );

      default:
        throw new Error(`Unknown filter: ${filter}`);
    }
  };

  const tickets : TicketType[] = useSelector((state) => {
    return getVisibleTickets(
      (state.ticketReducer.tickets as any) ? (state.ticketReducer.tickets as any).array : [] as TicketType[],
      state.ticketReducer.currentFilter,
      state.ticketReducer.ticketSearch,
    )
  });

  useEffect(() => {
    if (tickets)
      setFullCount(tickets.length);
  }, tickets);

  const ticketBadge = (ticket: TicketType) => ticket.isAccess === 0 ? theme.palette.success.light : theme.palette.error.light;
  
  const router = useRouter();

  const [selectWebtoonId, setSelectWebtoonId] = useState<number>(0);
  const [selectWebtoonTitle, setSelectWebtoonTitle] = useState<string>('');
  const [startIndex, setStartIndex] = useState(0);
  const [endIndex, setEndIndex] = useState(9);
  const [fullCount, setFullCount] = useState(tickets.length);
  const [open, setOpen] = useState(false);
  const handleClickOpen = (id: any, title: any) => { 
    setSelectWebtoonId(id);
    setSelectWebtoonTitle(title);
    setOpen(true);
  };
  const handleClose = () => { setOpen(false);  };

  return (
    <>
      <Box mt={4}>
        <Box sx={{ maxWidth: '260px', ml: 'auto' }} mb={3}>
          <TextField
            size="small"
            label="Search"
            fullWidth
            onChange={(e) => {
              dispatch(
                SearchTicket(e.target.value)
              );
            }}
          />
        </Box>
        <TableContainer>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>
                  <Typography variant="h6">Id</Typography>
                </TableCell>
                <TableCell>
                  <Typography variant="h6">Webtoon info</Typography>
                </TableCell>
                <TableCell>
                  <Typography variant="h6">Provider</Typography>
                </TableCell>
                <TableCell>
                  <Typography variant="h6">Status</Typography>
                </TableCell>
                <TableCell>
                  <Typography variant="h6">Article</Typography>
                </TableCell>
                <TableCell align="right">
                  <Typography variant="h6">Menu</Typography>
                </TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {tickets.slice(startIndex, endIndex).map((ticket) => (
                <TableRow key={ticket.webtoonId} hover>
                  <TableCell>{ticket.webtoonId}</TableCell>
                  <TableCell>
                    <Box>
                      <Typography variant="h6" fontWeight={600} noWrap>
                        {ticket.title}
                      </Typography>
                      <Typography
                        color="textSecondary"
                        noWrap
                        sx={{ maxWidth: '250px' }}
                        variant="subtitle2"
                        fontWeight={400}
                      >
                        {ticket.synopsis}
                      </Typography>
                    </Box>
                  </TableCell>
                  <TableCell>
                    <Stack direction="row" gap="10px" alignItems="center">
                      <Avatar
                        src={getProviderImage(ticket.provider)}
                        sx={{
                          borderRadius: '100%',
                          width: '35',
                        }}
                      />
                      {/* <Image src={ticket.thumb} alt="image" width={35} height={35}/> */}
                      <Typography variant="h6">{ticket.provider}</Typography>
                    </Stack>
                  </TableCell>
                  <TableCell>
                    <Chip
                      sx={{
                        backgroundColor: ticketBadge(ticket),
                      }}
                      size="small"
                      label={ticket.isAccess == 0 ? 'Accessible' : 'Not Accessible'}
                    />
                  </TableCell>
                  <TableCell>
                    <Typography variant="subtitle1">
                      {`${ticket.articleStart} - ${ticket.articleEnd}`}
                    </Typography>
                  </TableCell>
                  <TableCell align="right">
                    <Tooltip title="Webtoon Setting">
                      <IconButton onClick={() => {handleClickOpen(ticket.webtoonId, ticket.title)}} disabled={ticket.isAccess != 0}>
                        <IconMenu size="18" />
                      </IconButton>
                      </Tooltip>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
        <Dialog fullScreen open={open} onClose={handleClose} TransitionComponent={Transition}>
          <AppBar sx={{ position: 'relative' }}>
            <Toolbar>
              <IconButton edge="start" color="inherit" onClick={handleClose} aria-label="close">
                <IconX width={24} height={24} />
              </IconButton>
              <Typography ml={2} flex={1} variant="h6" component="div">
                {selectWebtoonTitle} | Menu
              </Typography>
            </Toolbar>
          </AppBar>
          <List>
            <ListItem button>
              <ListItemText primary="View default info" secondary="웹툰 기본 정보" onClick={() => {
                router.push(`${PagePath.WEBTOON_DETAIL_INFO_FOR_NAVER}/${selectWebtoonId}`);
              }}/>
            </ListItem>
            
            <Divider />

            <ListItem button>
              <ListItemText primary="View comment-analyze-result" secondary="웹툰 댓글 긍정/부정 관련 통계" onClick={() => {
                router.push(`${PagePath.CHARTS_WEBTOON_COMMENT_ANALYZE_RESULT_FOR_NAVER}/${selectWebtoonId}`);
              }}/>
            </ListItem>
            <Divider />
          </List>
        </Dialog>
        <Box my={3} display="flex" justifyContent={'center'}>
          <Pagination count={fullCount <= LIMIT ? 1 : fullCount % LIMIT == 0 ? Math.trunc((fullCount / LIMIT)) : Math.trunc((fullCount / LIMIT)) + 1 } color="primary" onChange={(_event: React.ChangeEvent<unknown>, iPage: number) => {
            setStartIndex((iPage - 1) * LIMIT);
            setEndIndex(iPage * LIMIT);
          }} />
        </Box>
      </Box>
    </>
  );
};

export default TicketListing;
