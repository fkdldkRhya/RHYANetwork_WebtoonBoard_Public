import { Grid } from '@mui/material';
import PageContainer from '../../../../src/components/container/PageContainer';
import ProfileBanner from '../../../../src/components/apps/userprofile/profile/ProfileBanner';
import FriendsCard from '../../../../src/components/apps/userprofile/friends/FriendsCard';

const Friends = () => {
  return (
    <PageContainer>
      <Grid container spacing={3}>
        <Grid item sm={12}>
          <ProfileBanner />
        </Grid>
        <Grid item sm={12}>
          <FriendsCard />
        </Grid>
      </Grid>
    </PageContainer>
  );
};

export default Friends;
