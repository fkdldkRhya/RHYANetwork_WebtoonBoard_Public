import { Grid } from '@mui/material';
import Breadcrumb from '../../../src/layouts/full/shared/breadcrumb/Breadcrumb';
import PageContainer from '../../../src/components/container/PageContainer';
import ParentCard from '../../../src/components/shared/ParentCard';
import ChildCard from '../../../src/components/shared/ChildCard';
import BasicTransferList from '../../../src/components/ui-components/transfer-list/BasicTransferList';
import EnhancedTransferList from '../../../src/components/ui-components/transfer-list/EnhancedTransferList';

const BCrumb = [
  {
    to: '/',
    title: 'Home',
  },
  {
    title: 'Transfer List',
  },
];

const MuiTransferList = () => (
  <PageContainer>
    {/* breadcrumb */}
    <Breadcrumb title="Transfer List" items={BCrumb} />
    {/* end breadcrumb */}

    <ParentCard title="Transfer List">
      <Grid container spacing={3}>
        <Grid item xs={12}  display="flex" alignItems="stretch">
          <ChildCard title="Basic">
            <BasicTransferList />
          </ChildCard>
        </Grid>
        <Grid item xs={12}  display="flex" alignItems="stretch">
          <ChildCard title="Enhanced">
            <EnhancedTransferList />
          </ChildCard>
        </Grid>
      </Grid>
    </ParentCard>
  </PageContainer>
);
export default MuiTransferList;
