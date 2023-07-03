import { Grid } from '@mui/material';
import Breadcrumb from '../../../src/layouts/full/shared/breadcrumb/Breadcrumb';
import PageContainer from '../../../src/components/container/PageContainer';
import ParentCard from '../../../src/components/shared/ParentCard';
import ChildCard from '../../../src/components/shared/ChildCard';

import SimpleList from '../../../src/components/ui-components/lists/SimpleList';
import NestedList from '../../../src/components/ui-components/lists/NestedList';
import FolderList from '../../../src/components/ui-components/lists/FolderList';
import SelectedList from '../../../src/components/ui-components/lists/SelectedList';
import ControlsList from '../../../src/components/ui-components/lists/ControlsList';
import SwitchList from '../../../src/components/ui-components/lists/SwitchList';
import React from 'react';

const BCrumb = [
  {
    to: '/',
    title: 'Home',
  },
  {
    title: 'List',
  },
];

const MuiList = () => (
  <PageContainer>
    {/* breadcrumb */}
    <Breadcrumb title="List" items={BCrumb} />
    {/* end breadcrumb */}

    <ParentCard title="List">
      <Grid container spacing={3}>
        <Grid item xs={12} sm={6} display="flex" alignItems="stretch">
          <ChildCard title="Simple">
            <SimpleList />
          </ChildCard>
        </Grid>
        <Grid item xs={12} sm={6} display="flex" alignItems="stretch">
          <ChildCard title="Nested">
            <NestedList />
          </ChildCard>
        </Grid>
        <Grid item xs={12} sm={6} display="flex" alignItems="stretch">
          <ChildCard title="Folder">
            <FolderList />
          </ChildCard>
        </Grid>
        <Grid item xs={12} sm={6} display="flex" alignItems="stretch">
          <ChildCard title="Selected">
            <SelectedList />
          </ChildCard>
        </Grid>
        <Grid item xs={12} sm={6} display="flex" alignItems="stretch">
          <ChildCard title="Controls">
            <ControlsList />
          </ChildCard>
        </Grid>
        <Grid item xs={12} sm={6} display="flex" alignItems="stretch">
          <ChildCard title="Switch">
            <SwitchList />
          </ChildCard>
        </Grid>
      </Grid>
    </ParentCard>
  </PageContainer>
);
export default MuiList;
