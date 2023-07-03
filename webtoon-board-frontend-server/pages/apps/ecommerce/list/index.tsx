import Breadcrumb from '../../../../src/layouts/full/shared/breadcrumb/Breadcrumb';
import PageContainer from '../../../../src/components/container/PageContainer';
import ProductTableList from '../../../../src/components/apps/ecommerce/ProductTableList/ProductTableList';
import BlankCard from '../../../../src/components/shared/BlankCard';

const BCrumb = [
  {
    to: '/',
    title: 'Home',
  },
  {
    title: 'Shop',
  },
];

const EcomProductList = () => {
  return (
    <PageContainer>
      {/* breadcrumb */}
      <Breadcrumb title="Ecom-Shop" items={BCrumb} />
      <BlankCard>
        {/* ------------------------------------------- */}
        {/* Left part */}
        {/* ------------------------------------------- */}
        <ProductTableList />
      </BlankCard>
    </PageContainer>
  );
};

export default EcomProductList;
