import { Box, Grid } from '@mui/material';

import Breadcrumb from '../../../src/layouts/full/shared/breadcrumb/Breadcrumb';
import PageContainer from '../../../src/components/container/PageContainer';
import ParentCard from '../../../src/components/shared/ParentCard';
import Table2 from '../../../src/components/tables/Table2';
import Table3 from '../../../src/components/tables/Table3';
import Table1 from '../../../src/components/tables/Table1';
import Table4 from '../../../src/components/tables/Table4';
import Table5 from '../../../src/components/tables/Table5';

const BCrumb = [
  {
    to: '/',
    title: 'Home',
  },
  {
    title: 'Basic Table',
  },
];

const BasicTable = () => (
  <PageContainer>
    {/* breadcrumb */}
    <Breadcrumb title="Basic Table" items={BCrumb} />
    {/* end breadcrumb */}
    <ParentCard title="Basic Table">
      <Grid container spacing={3}>
        <Grid item xs={12}>
          <Box>
            <Table5 />
          </Box>
        </Grid>
        <Grid item xs={12}>
          <Box>
            <Table2 />
          </Box>
        </Grid>
        <Grid item xs={12}>
          <Box>
            <Table3 />
          </Box>
        </Grid>
        <Grid item xs={12}>
          <Box>
            <Table1 />
          </Box>
        </Grid>
        <Grid item xs={12}>
          <Box>
            <Table4 />
          </Box>
        </Grid>
      </Grid>
    </ParentCard>
  </PageContainer>
);

export default BasicTable;
