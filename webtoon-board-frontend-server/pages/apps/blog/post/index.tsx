import Breadcrumb from '../../../../src/layouts/full/shared/breadcrumb/Breadcrumb';
import PageContainer from '../../../../src/components/container/PageContainer';
import BlogListing from '../../../../src/components/apps/blog/BlogListing';

const Blog = () => {
  return (
    <PageContainer>
      <Breadcrumb title="Blog app" subtitle="Get the latest news" />
      {/* ------------------------------------------- */}
      {/* Blog Listing */}
      {/* ------------------------------------------- */}
      <BlogListing />
    </PageContainer>
  );
};

export default Blog;
