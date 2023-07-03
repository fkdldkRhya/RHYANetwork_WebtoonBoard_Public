import { Box } from '@mui/material';
import Breadcrumb from '../../../src/layouts/full/shared/breadcrumb/Breadcrumb';
import PageContainer from '../../../src/components/container/PageContainer';
import ProductTableList from '../../../src/components/apps/ecommerce/ProductTableList/ProductTableList';

const BCrumb = [
  {
    to: '/',
    title: 'Home',
  },
  {
    title: 'Search Table',
  },
];

const SearchTable = () => {
  return (
    <PageContainer>
      {/* breadcrumb */}
      <Breadcrumb title="Search Table" items={BCrumb} />
      {/* end breadcrumb */}
      <Box>
        <ProductTableList />
      </Box>
    </PageContainer>
  );
};

export default SearchTable;
