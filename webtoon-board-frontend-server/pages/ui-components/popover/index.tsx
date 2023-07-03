import { Grid } from '@mui/material';
import Breadcrumb from '../../../src/layouts/full/shared/breadcrumb/Breadcrumb';
import PageContainer from '../../../src/components/container/PageContainer';
import ParentCard from '../../../src/components/shared/ParentCard';
import ChildCard from '../../../src/components/shared/ChildCard';
import ClickPopover from '../../../src/components/ui-components/popover/ClickPopover';
import HoverPopover from '../../../src/components/ui-components/popover/HoverPopover';

const BCrumb = [
  {
    to: '/',
    title: 'Home',
  },
  {
    title: 'Popover',
  },
];

const MuiPopover = () => {
  return (
    <PageContainer>
      {/* breadcrumb */}
      <Breadcrumb title="Popover" items={BCrumb} />
      {/* end breadcrumb */}

      <ParentCard title="Popover">
        <Grid container spacing={3}>
          <Grid item xs={12} sm={6} display="flex" alignItems="stretch">
            <ChildCard title="Click">
              <ClickPopover />
            </ChildCard>
          </Grid>
          <Grid item xs={12} sm={6} display="flex" alignItems="stretch">
            <ChildCard title="Hover">
              <HoverPopover />
            </ChildCard>
          </Grid>
        </Grid>
      </ParentCard>
    </PageContainer>
  );
}
export default MuiPopover;
