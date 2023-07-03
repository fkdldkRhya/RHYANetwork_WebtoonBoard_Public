import React from 'react';
import { Avatar, Chip, Grid }  from '@mui/material';
import Breadcrumb from '../../../src/layouts/full/shared/breadcrumb/Breadcrumb';
import PageContainer from '../../../src/components/container/PageContainer';
import ParentCard from '../../../src/components/shared/ParentCard';
import ChildCard from '../../../src/components/shared/ChildCard';
import InlineItemCard from "../../../src/components/shared/InlineItemCard";
import { IconCheck, IconChecks, IconMoodHappy } from '@tabler/icons-react';


const BCrumb = [
  {
    to: '/',
    title: 'Home',
  },
  {
    title: 'Chip',
  },
];

const MuiChip = () => {
  const handleDelete = () => {
    console.info('You clicked the delete icon.');
  };

  return (
    <PageContainer >
      {/* breadcrumb */}
      <Breadcrumb title="Chip" items={BCrumb} />
      {/* end breadcrumb */}

      <ParentCard title="Accordion">
        <Grid container spacing={3}>
          <Grid item xs={12} display="flex" alignItems="stretch">
            <ChildCard title="Filled">
              <InlineItemCard>
                <Chip avatar={<Avatar>M</Avatar>} label="Default Filled" />
                <Chip avatar={<Avatar>M</Avatar>} label="Default Deletable" onDelete={handleDelete} />
                <Chip avatar={<Avatar alt="Natacha" src={"/images/profile/user-1.jpg"} />} label="Primary Filled" color="primary" />
                <Chip avatar={<Avatar alt="Natacha" src={"/images/profile/user-1.jpg"} />} label="Primary Deletable" color="primary" onDelete={handleDelete} />
                <Chip icon={<IconMoodHappy />} label="Secondary Filled" color="secondary" />
                <Chip icon={<IconMoodHappy />} label="Secondary Deletable" color="secondary" onDelete={handleDelete} />
                <Chip avatar={<Avatar alt="Natacha" src={"/images/profile/user-2.jpg"} />} label="Default Filled" color="success" />
                <Chip avatar={<Avatar alt="Natacha" src={"/images/profile/user-2.jpg"} />} label="Default Deletable" color="success" onDelete={handleDelete} />
                <Chip icon={<IconMoodHappy />} label="Default Filled" color="warning" />
                <Chip icon={<IconMoodHappy />} label="Default Deletable" color="warning" onDelete={handleDelete} />
                <Chip avatar={<Avatar alt="Natacha" src={"/images/profile/user-3.jpg"} />} label="Default Filled" color="error" />
                <Chip avatar={<Avatar alt="Natacha" src={"/images/profile/user-3.jpg"} />} label="Default Deletable" color="error" onDelete={handleDelete} />
              </InlineItemCard>
            </ChildCard>
          </Grid>
          <Grid item xs={12} display="flex" alignItems="stretch">
            <ChildCard title="Outlined">
              <InlineItemCard>
                <Chip variant="outlined" avatar={<Avatar>M</Avatar>} label="Default Filled" />
                <Chip variant="outlined" avatar={<Avatar>M</Avatar>} label="Default Deletable" onDelete={handleDelete} />
                <Chip variant="outlined" avatar={<Avatar alt="Natacha" src={"/images/profile/user-1.jpg"} />} label="Default Filled" color="primary" />
                <Chip variant="outlined" avatar={<Avatar alt="Natacha" src={"/images/profile/user-1.jpg"} />} label="Default Deletable" color="primary" onDelete={handleDelete} />
                <Chip variant="outlined" icon={<IconMoodHappy />} label="Default Filled" color="secondary" />
                <Chip variant="outlined" icon={<IconMoodHappy />} label="Default Deletable" color="secondary" onDelete={handleDelete} />
                <Chip variant="outlined" avatar={<Avatar alt="Natacha" src={"/images/profile/user-2.jpg"} />} label="Default Filled" color="success" />
                <Chip variant="outlined" avatar={<Avatar alt="Natacha" src={"/images/profile/user-2.jpg"} />} label="Default Deletable" color="success" onDelete={handleDelete} />
                <Chip variant="outlined" icon={<IconMoodHappy />} label="Default Filled" color="warning" />
                <Chip variant="outlined" icon={<IconMoodHappy />} label="Default Deletable" color="warning" onDelete={handleDelete} />
                <Chip variant="outlined" avatar={<Avatar alt="Natacha" src={"/images/profile/user-3.jpg"} />} label="Default Filled" color="error" />
                <Chip variant="outlined" avatar={<Avatar alt="Natacha" src={"/images/profile/user-3.jpg"} />} label="Default Deletable" color="error" onDelete={handleDelete} />
              </InlineItemCard>
            </ChildCard>
          </Grid>
          <Grid item xs={12} sm={6} display="flex" alignItems="stretch">
            <ChildCard title="Custom Icon">
              <InlineItemCard>
                <Chip
                  label="Custom Icon" color="primary" avatar={<Avatar >M</Avatar>}
                  onDelete={handleDelete}
                  deleteIcon={<IconCheck width={20} />}
                />
                <Chip
                  label="Custom Icon" color="secondary" avatar={<Avatar >S</Avatar>}
                  onDelete={handleDelete}
                  deleteIcon={<IconChecks width={20} />}
                />
              </InlineItemCard>
            </ChildCard>
          </Grid>
          <Grid item xs={12} sm={6} display="flex" alignItems="stretch">
            <ChildCard title="Custom outlined Icon">
              <InlineItemCard>
                <Chip
                  label="Custom Icon" variant="outlined" color="primary" avatar={<Avatar >M</Avatar>}
                  onDelete={handleDelete}
                  deleteIcon={<IconCheck width={20} />}
                />
                <Chip
                  label="Custom Icon" variant="outlined" color="secondary" avatar={<Avatar >S</Avatar>}
                  onDelete={handleDelete}
                  deleteIcon={<IconChecks width={20} />}
                />
              </InlineItemCard>
            </ChildCard>
          </Grid>
          <Grid item xs={12} sm={6} display="flex" alignItems="stretch">
            <ChildCard title="Disabled">
              <InlineItemCard>
                <Chip
                  label="Custom Icon" disabled avatar={<Avatar >M</Avatar>}
                  onDelete={handleDelete}
                />
                <Chip
                  label="Custom Icon" color="primary" disabled avatar={<Avatar >S</Avatar>}
                  onDelete={handleDelete}
                />
              </InlineItemCard>
            </ChildCard>
          </Grid>
          <Grid item xs={12} sm={6} display="flex" alignItems="stretch">
            <ChildCard title="Sizes">
              <InlineItemCard>
                <Chip label="Small" size="small" color="primary" />
                <Chip label="Normal" color="primary" />
              </InlineItemCard>
            </ChildCard>
          </Grid>
        </Grid>
      </ParentCard>
    </PageContainer>
  );
}
export default MuiChip;
