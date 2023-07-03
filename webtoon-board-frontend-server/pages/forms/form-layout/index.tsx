import { Grid } from '@mui/material';
import {
  FbOrdinaryForm,
  FbDefaultForm,
  FbBasicHeaderForm,
  FbReadonlyForm,
  FbDisabledForm,
  FbLeftIconForm,
  FbRightIconForm,
  FbInputVariants,
} from '../../../src/components/forms/form-layouts/index';
import PageContainer from '../../../src/components/container/PageContainer';
import Breadcrumb from '../../../src/layouts/full/shared/breadcrumb/Breadcrumb';

const BCrumb = [
  {
    to: '/',
    title: 'Home',
  },
  {
    title: 'Form Layouts',
  },
];

const FormLayouts = () => (
  <PageContainer>
    {/* breadcrumb */}
    <Breadcrumb title="Form Layouts" items={BCrumb} />
    {/* end breadcrumb */}
    
    <Grid container spacing={3}>
      <Grid item lg={12} md={12} xs={12}>
        <FbOrdinaryForm />
      </Grid>
      <Grid item lg={12} md={12} xs={12}>
        <FbInputVariants />
      </Grid>
      <Grid item lg={12} md={12} xs={12}>
        <FbDefaultForm />
      </Grid>
      <Grid item lg={12} md={12} xs={12}>
        <FbBasicHeaderForm />
      </Grid>
      <Grid item lg={12} md={12} xs={12}>
        <FbReadonlyForm />
      </Grid>
      <Grid item lg={12} md={12} xs={12}>
        <FbDisabledForm />
      </Grid>
      <Grid item lg={6} md={12} xs={12}>
        <FbLeftIconForm />
      </Grid>
      <Grid item lg={6} md={12} xs={12}>
        <FbRightIconForm />
      </Grid>
    </Grid>
  </PageContainer>
);

export default FormLayouts;
