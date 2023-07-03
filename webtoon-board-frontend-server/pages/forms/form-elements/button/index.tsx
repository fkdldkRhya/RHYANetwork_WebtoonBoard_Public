import React from 'react';
import { Grid } from '@mui/material';
import Breadcrumb from '../../../../src/layouts/full/shared/breadcrumb/Breadcrumb';
import PageContainer from '../../../../src/components/container/PageContainer';
import ParentCard from '../../../../src/components/shared/ParentCard';
import ChildCard from '../../../../src/components/shared/ChildCard';

import DefaultButtons from '../../../../src/components/forms/form-elements/button/DefaultButtons';
import ColorButtons from '../../../../src/components/forms/form-elements/button/ColorButtons';
import IconLoadingButtons from '../../../../src/components/forms/form-elements/button/IconLoadingButtons';
import SizeButton from '../../../../src/components/forms/form-elements/button/SizeButton';

import OutlinedIconButtons from '../../../../src/components/forms/form-elements/button/OutlinedIconButtons';
import OutlinedSizeButton from '../../../../src/components/forms/form-elements/button/OutlinedSizeButton';

import TextDefaultButtons from '../../../../src/components/forms/form-elements/button/TextDefaultButtons';
import TextColorButtons from '../../../../src/components/forms/form-elements/button/TextColorButtons';
import TextIconButtons from '../../../../src/components/forms/form-elements/button/TextIconButtons';
import TextSizeButton from '../../../../src/components/forms/form-elements/button/TextSizeButton';

import IconColorButtons from '../../../../src/components/forms/form-elements/button/IconColorButtons';
import IconSizeButtons from '../../../../src/components/forms/form-elements/button/IconSizeButtons';

import FabDefaultButton from '../../../../src/components/forms/form-elements/button/FabDefaultButton';
import FabColorButtons from '../../../../src/components/forms/form-elements/button/FabColorButtons';
import FabSizeButtons from '../../../../src/components/forms/form-elements/button/FabSizeButtons';

import DefaultButtonGroup from '../../../../src/components/forms/form-elements/button/DefaultButtonGroup';
import SizeButtonGroup from '../../../../src/components/forms/form-elements/button/SizeButtonGroup';
import VerticalButtonGroup from '../../../../src/components/forms/form-elements/button/VerticalButtonGroup';
import ColorButtonGroup from '../../../../src/components/forms/form-elements/button/ColorButtonGroup';
import TextButtonGroup from '../../../../src/components/forms/form-elements/button/TextButtonGroup';
import OutlinedColorButtons from '../../../../src/components/forms/form-elements/button/OutlinedColorButtons';

const BCrumb = [
  {
    to: '/',
    title: 'Home',
  },
  {
    title: 'Button',
  },
];

const MuiButton = () => (
  <PageContainer>
    {/* breadcrumb */}
    <Breadcrumb title="Button" items={BCrumb} />
    {/* end breadcrumb */}
    <Grid container spacing={3}>
      <Grid item xs={12}>
        <ParentCard title='Buttons'>
          <Grid container spacing={3}>
            {/* ------------------------- row 1 ------------------------- */}
            <Grid item xs={12} lg={6} display="flex" alignItems="stretch">
              <ChildCard title="Default">
                <DefaultButtons />
              </ChildCard>
            </Grid>
            {/* ------------------------- row 1 ------------------------- */}
            <Grid item xs={12} lg={6} display="flex" alignItems="stretch">
              <ChildCard title="Colors">
                <ColorButtons />
              </ChildCard>
            </Grid>
            {/* ------------------------- row 1 ------------------------- */}
            <Grid item xs={12} lg={6} display="flex" alignItems="stretch">
              <ChildCard title="Loading Buttons">
                <IconLoadingButtons />
              </ChildCard>
            </Grid>
            {/* ------------------------- row 1 ------------------------- */}
            <Grid item xs={12} lg={6} display="flex" alignItems="stretch">
              <ChildCard title="Sizes">
                <SizeButton />
              </ChildCard>
            </Grid>
            {/* ------------------------- row 1 ------------------------- */}
            <Grid item xs={12} lg={6} display="flex" alignItems="stretch">
              <ChildCard title="Outlined">
                <OutlinedColorButtons />
              </ChildCard>
            </Grid>
            {/* ------------------------- row 1 ------------------------- */}
            <Grid item xs={12} lg={6} display="flex" alignItems="stretch">
              <ChildCard title="Outlined Icon">
                <OutlinedIconButtons />
              </ChildCard>
            </Grid>
            {/* ------------------------- row 1 ------------------------- */}
            <Grid item xs={12} lg={6} display="flex" alignItems="stretch">
              <ChildCard title="Outline Size">
                <OutlinedSizeButton />
              </ChildCard>
            </Grid>
            {/* ------------------------- row 1 ------------------------- */}
            <Grid item xs={12} lg={6} display="flex" alignItems="stretch">
              <ChildCard title="Text">
                <TextDefaultButtons />
              </ChildCard>
            </Grid>
            {/* ------------------------- row 1 ------------------------- */}
            <Grid item xs={12} lg={6} display="flex" alignItems="stretch">
              <ChildCard title="Text Color">
                <TextColorButtons />
              </ChildCard>
            </Grid>
            {/* ------------------------- row 1 ------------------------- */}
            <Grid item xs={12} lg={6} display="flex" alignItems="stretch">
              <ChildCard title="Text Icon">
                <TextIconButtons />
              </ChildCard>
            </Grid>
            {/* ------------------------- row 1 ------------------------- */}
            <Grid item xs={12} lg={6} display="flex" alignItems="stretch">
              <ChildCard title="Text Sizes">
                <TextSizeButton />
              </ChildCard>
            </Grid>
            {/* ------------------------- row 1 ------------------------- */}
            <Grid item xs={12} lg={6} display="flex" alignItems="stretch">
              <ChildCard title="Icon Color">
                <IconColorButtons />
              </ChildCard>
            </Grid>
            {/* ------------------------- row 1 ------------------------- */}
            <Grid item xs={12} lg={6} display="flex" alignItems="stretch">
              <ChildCard title="Icon Sizes">
                <IconSizeButtons />
              </ChildCard>
            </Grid>
            {/* ------------------------- row 1 ------------------------- */}
            <Grid item xs={12} lg={6} display="flex" alignItems="stretch">
              <ChildCard title="FAB">
                <FabDefaultButton />
              </ChildCard>
            </Grid>
            {/* ------------------------- row 1 ------------------------- */}
            <Grid item xs={12} lg={6} display="flex" alignItems="stretch">
              <ChildCard title="FAB Color">
                <FabColorButtons />
              </ChildCard>
            </Grid>
            {/* ------------------------- row 1 ------------------------- */}
            <Grid item xs={12} lg={6} display="flex" alignItems="stretch">
              <ChildCard title="FAB Size">
                <FabSizeButtons />
              </ChildCard>
            </Grid>
          </Grid>
        </ParentCard>
      </Grid>
      <Grid item xs={12}>
        <ParentCard title='Button Group'>
          <Grid container spacing={3}>
            {/* ------------------------- row 1 ------------------------- */}
            <Grid item xs={12} lg={6} display="flex" alignItems="stretch">
              <ChildCard title="Default">
                <DefaultButtonGroup />
              </ChildCard>
            </Grid>
            {/* ------------------------- row 1 ------------------------- */}
            <Grid item xs={12} lg={6} display="flex" alignItems="stretch">
              <ChildCard title="Sizes">
                <SizeButtonGroup />
              </ChildCard>
            </Grid>
            {/* ------------------------- row 1 ------------------------- */}
            <Grid item xs={12} lg={6} display="flex" alignItems="stretch">
              <ChildCard title="Verical">
                <VerticalButtonGroup />
              </ChildCard>
            </Grid>
            {/* ------------------------- row 1 ------------------------- */}
            <Grid item xs={12} lg={6} display="flex" alignItems="stretch">
              <ChildCard title="Text">
                <TextButtonGroup />
              </ChildCard>
            </Grid>
            {/* ------------------------- row 1 ------------------------- */}
            <Grid item xs={12} display="flex" alignItems="stretch">
              <ChildCard title="Color">
                <ColorButtonGroup />
              </ChildCard>
            </Grid>
          </Grid>
        </ParentCard>
      </Grid>
    </Grid>
  </PageContainer >
);
export default MuiButton;
