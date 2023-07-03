import React, { useState } from 'react';
import dynamic from "next/dynamic";
const ReactQuill = dynamic(import('react-quill'), { ssr: false })
import { useTheme } from '@mui/material/styles';

import { Paper } from '@mui/material';

import Breadcrumb from '../../../src/layouts/full/shared/breadcrumb/Breadcrumb';
import PageContainer from '../../../src/components/container/PageContainer';
import ParentCard from '../../../src/components/shared/ParentCard';

const BCrumb = [
  {
    to: '/',
    title: 'Home',
  },
  {
    title: 'Quill Editor',
  },
];

const QuillEditor = () => {
  const [text, setText] = useState('');

  const theme = useTheme();
  const borderColor = theme.palette.divider;

  return (
    <PageContainer>
      {/* breadcrumb */}
      <Breadcrumb title="Quill Editor" items={BCrumb} />
      {/* end breadcrumb */}
      <ParentCard title="Quill Editor">
        <Paper
          sx={{ border: `1px solid ${borderColor}` }}
          variant="outlined"
        >
          <ReactQuill
            value={text}
            onChange={(value) => {
              setText(value);
            }}
            placeholder="Type here..."
          />
        </Paper>
      </ParentCard>
    </PageContainer>
  );
};

export default QuillEditor;
