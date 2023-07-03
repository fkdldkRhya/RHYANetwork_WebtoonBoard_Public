import { SvgIconProps } from '@mui/material/SvgIcon';
import { alpha, styled } from '@mui/material/styles';
import TreeView from '@mui/lab/TreeView';
import TreeItem, { TreeItemProps, treeItemClasses } from '@mui/lab/TreeItem';
import { useSpring, animated } from 'react-spring';
import { Collapse } from '@mui/material';
import { TransitionProps } from '@mui/material/transitions';
import { IconFolderPlus, IconFolderMinus, IconFolder } from '@tabler/icons-react';
import Breadcrumb from '../../../src/layouts/full/shared/breadcrumb/Breadcrumb';
import PageContainer from '../../../src/components/container/PageContainer';
import ParentCard from '../../../src/components/shared/ParentCard';
import ChildCard from '../../../src/components/shared/ChildCard';
import { getLogger } from '@/backend-api/Logger';
import { getAutoLoginUserId, setSessionAutoLoginValue, userLogout } from '@/backend-api/auth/LoginChecker';
import { findUserFromIdValueClientForSSROnly } from '@/backend-api/client/UserInfoClient';
import { GetServerSidePropsContext } from 'next';
import { PagePath } from '../../../middleware';

const BCrumb = [
  {
    to: '/',
    title: 'Home',
  },
  {
    title: 'Treeview',
  },
];

function MinusSquare(props: SvgIconProps) {
  return (
    <>
      <IconFolderMinus style={{ width: 22, height: 22 }} {...props} />
    </>
  );
}

function PlusSquare(props: SvgIconProps) {
  return (
    <>
      <IconFolderPlus style={{ width: 22, height: 22 }} {...props} />
    </>
  );
}

function CloseSquare(props: SvgIconProps) {
  return (
    <>
      <IconFolder style={{ width: 22, height: 22 }} {...props} />
    </>
  );
}

function TransitionComponent(props: TransitionProps) {
  const style = useSpring({
    from: {
      opacity: 0,
      transform: 'translate3d(20px,0,0)',
    },
    to: {
      opacity: props.in ? 1 : 0,
      transform: `translate3d(${props.in ? 0 : 20}px,0,0)`,
    },
  });

  return (
    <animated.div style={style}>
      <Collapse {...props} />
    </animated.div>
  );
}

const StyledTreeItem = styled((props: TreeItemProps) => (
  <TreeItem {...props} TransitionComponent={TransitionComponent} />
))(({ theme }) => ({
  [`& .${treeItemClasses.iconContainer}`]: {
    '& .close': {
      opacity: 0.3,
    },
  },
  [`& .${treeItemClasses.group}`]: {
    marginLeft: 15,
    paddingLeft: 18,
    borderLeft: `1px dashed ${alpha(theme.palette.text.primary, 0.4)}`,
  },
}));

const Treeview = () => {
  return (
    <PageContainer>
      {/* breadcrumb */}
      <Breadcrumb title="Treeview" items={BCrumb} />
      {/* end breadcrumb */}
      <ParentCard title="Treeview">
        <ChildCard>
          <TreeView
            aria-label="customized"
            defaultExpanded={['1']}
            defaultCollapseIcon={<MinusSquare />}
            defaultExpandIcon={<PlusSquare />}
            defaultEndIcon={<CloseSquare />}
            sx={{ height: 200, flexGrow: 1, overflowY: 'auto' }}
          >
            <StyledTreeItem nodeId="1" label="Main">
              <StyledTreeItem nodeId="2" label="Hello" />
              <StyledTreeItem nodeId="3" label="Subtree with children">
                <StyledTreeItem nodeId="6" label="Hello" />
                <StyledTreeItem nodeId="7" label="Sub-subtree with children">
                  <StyledTreeItem nodeId="9" label="Child 1" />
                  <StyledTreeItem nodeId="10" label="Child 2" />
                  <StyledTreeItem nodeId="11" label="Child 3" />
                </StyledTreeItem>
                <StyledTreeItem nodeId="8" label="Hello" />
              </StyledTreeItem>
              <StyledTreeItem nodeId="4" label="World" />
              <StyledTreeItem nodeId="5" label="Something something" />
            </StyledTreeItem>
          </TreeView>
        </ChildCard>
      </ParentCard>
    </PageContainer>
  );
};

export default Treeview;

export async function getServerSideProps(context: GetServerSidePropsContext) {
  try {
    // 자동 로그인
    const getUserId: number = getAutoLoginUserId(context.req, context.res);
    const userInfo : any = await findUserFromIdValueClientForSSROnly(getUserId, context);
    if (userInfo) { // 자동 로그인 성공
      setSessionAutoLoginValue(context.req, context.res); // 로그인 데이터 갱신

      return {
        props:{},
      };
    }
  }catch (error : any) {
    // 예외 처리
    getLogger().error(error.toString());
  }

  // 로그아웃
  userLogout(context.req, context.res);

  // 로그인 페이지로 이동
  return {
    redirect: {
      destination: PagePath.ERROR_404,
      permanent: false,
    },
    props:{},
  };
}