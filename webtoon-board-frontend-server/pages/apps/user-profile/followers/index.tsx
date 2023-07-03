import { Grid } from '@mui/material';
import PageContainer from '../../../../src/components/container/PageContainer';
import ProfileBanner from '../../../../src/components/apps/userprofile/profile/ProfileBanner';
import FollowerCard from '../../../../src/components/apps/userprofile/followers/FollowerCard';


const Followers = () => {
  return (
    <PageContainer>
     
      <Grid container spacing={3}>
        <Grid item sm={12}>
          <ProfileBanner />
        </Grid>
        <Grid item sm={12}>
          <FollowerCard />
        </Grid>
      </Grid>
    </PageContainer>
  );
};

export default Followers;
