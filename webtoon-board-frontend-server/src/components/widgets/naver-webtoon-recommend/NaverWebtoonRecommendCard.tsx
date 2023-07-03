import Link  from 'next/link';
import {
  CardContent,
  Typography,
  Avatar,
  Grid,
  CardMedia,
  Stack,
  Tooltip,
  Box,
} from '@mui/material';
import { IconStar, IconNews } from '@tabler/icons-react';
import BlankCard from '../../shared/BlankCard';


const NaverWebtoonRecommendCard = (items: any) => {
  return (
    <Grid container spacing={3}>
      {items.item.map((item: any) => (
        <Grid item xs={12} sm={4} key={item.rank}>
          <BlankCard className="hoverCard">
            <>
              <Typography target="_blank" component={Link} href={`https://comic.naver.com/webtoon/list?titleId=${item.titleId}`}>
                <CardMedia
                  component="img"
                  height="240"
                  image={item.thumbnailUrl}
                  alt="green iguana"
                />
              </Typography>
              <CardContent>
                <Stack direction="row" sx={{ marginTop: '-45px' }}>
                  <Tooltip title={item.displayAuthor} placement="top">
                    <Avatar aria-label="recipe"></Avatar>
                  </Tooltip>
                </Stack>

                <Box my={3}>
                  <Typography
                    gutterBottom
                    variant="h5"
                    color="inherit"
                    sx={{ textDecoration: 'none' }}
                    component={Link}
                    href="/"
                  >
                    {item.titleName}
                  </Typography>
                </Box>
                <Stack direction="row" gap={3} alignItems="center">
                  <Stack direction="row" gap={1} alignItems="center">
                    <IconStar size="18" /> {item.favoriteCount}
                  </Stack>
                  <Stack direction="row" gap={1} alignItems="center">
                    <IconNews size="18" /> {item.publishDayOfWeekList}
                  </Stack>
                </Stack>
              </CardContent>
            </>
          </BlankCard>
        </Grid>
      ))}
    </Grid>
  );
};

export default NaverWebtoonRecommendCard;
