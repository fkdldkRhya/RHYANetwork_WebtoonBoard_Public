import { Grid } from '@mui/material';
import PageContainer from '../../../../src/components/container/PageContainer';

import ProfileBanner from '../../../../src/components/apps/userprofile/profile/ProfileBanner';
import IntroCard from '../../../../src/components/apps/userprofile/profile/IntroCard';
import PhotosCard from '../../../../src/components/apps/userprofile/profile/PhotosCard';
import Post from '../../../../src/components/apps/userprofile/profile/Post';

const UserProfile = () => {
  return (
    <PageContainer>

      <Grid container spacing={3}>
        <Grid item sm={12}>
          <ProfileBanner />
        </Grid>

        {/* intro and Photos Card */}
        <Grid item sm={12} lg={4} xs={12}>
          <Grid container spacing={3}>
            <Grid item sm={12}>
              <IntroCard />
            </Grid>
            <Grid item sm={12}>
              <PhotosCard />
            </Grid>
          </Grid>
        </Grid>
        {/* Posts Card */}
        <Grid item sm={12} lg={8} xs={12}>
          <Post />
        </Grid>
      </Grid>
    </PageContainer>
  );
};

export default UserProfile;
