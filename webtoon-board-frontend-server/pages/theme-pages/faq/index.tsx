import PageContainer from '../../../src/components/container/PageContainer';
import Breadcrumb from '../../../src/layouts/full/shared/breadcrumb/Breadcrumb';
import { Grid } from '@mui/material';
import Questions from '../../../src/components/pages/faq/Questions';
import StillQuestions from '../../../src/components/pages/faq/StillQuestions';

const BCrumb = [
  {
    to: '/',
    title: 'Home',
  },
  {
    title: 'FAQ',
  },
];

const Faq = () => {
  return (
    <PageContainer >
      {/* breadcrumb */}
      <Breadcrumb title="FAQ" items={BCrumb} />
      {/* end breadcrumb */}
      <Grid container spacing={3}>
        <Grid item xs={12}>
          <Questions />
          <StillQuestions />
        </Grid>
      </Grid>
    </PageContainer>
  );
};

export default Faq;
