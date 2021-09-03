import { lazy, Suspense, useEffect, useMemo } from 'react';
import classnames from 'classnames';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import URLS, { PAGES_URLS } from 'URLS';
import { usePage } from 'api/hooks/Pages';
import { Page as IPage } from 'types/Types';
import { Groups } from 'types/Enums';

// Material UI Components
import { makeStyles } from '@mui/styles';
import { Theme, Typography, Breadcrumbs, Skeleton } from '@mui/material';

// Project Components
import Page from 'components/navigation/Page';
import Banner from 'components/layout/Banner';
import Paper from 'components/layout/Paper';
import MarkdownRenderer from 'components/miscellaneous/MarkdownRenderer';
import PagesAdmin from 'containers/Pages/components/PagesAdmin';
import PagesList from 'containers/Pages/components/PagesList';
import PagesSearch from 'containers/Pages/components/PagesSearch';
import ShareButton from 'components/miscellaneous/ShareButton';
const MembersCard = lazy(() => import('containers/Pages/specials/Index/MembersCard'));
const Index = lazy(() => import('containers/Pages/specials/Index'));

type ThemeProps = {
  data?: IPage;
};

const useStyles = makeStyles<Theme, ThemeProps>((theme) => ({
  link: {
    textDecoration: 'none',
  },
  breadcrumb: {
    textTransform: 'capitalize',
  },
  grid: {
    display: 'grid',
    gridGap: theme.spacing(2),
  },
  root: {
    gridTemplateColumns: '300px 1fr',
    margin: theme.spacing(1, 0, 2),
    alignItems: 'self-start',
    [theme.breakpoints.down('lg')]: {
      gridGap: theme.spacing(1),
      gridTemplateColumns: () => '1fr',
    },
  },
  inner: {
    gridTemplateColumns: ({ data }) => (data?.image ? '1fr 350px' : '1fr'),
    alignItems: 'self-start',
    [theme.breakpoints.down('xl')]: {
      gridTemplateColumns: () => '1fr',
    },
    [theme.breakpoints.down('lg')]: {
      gridGap: theme.spacing(1),
    },
  },
  content: {
    [theme.breakpoints.down('lg')]: {
      gridGap: theme.spacing(1),
    },
  },
  list: {
    gridGap: theme.spacing(1),
  },
  paper: {
    overflow: 'hidden',
  },
  image: {
    width: '100%',
    maxHeight: 350,
    objectFit: 'cover',
    border: `1px solid ${theme.palette.divider}`,
    borderRadius: theme.shape.borderRadius,
  },
}));

const Pages = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const levels = useMemo(() => location.pathname.split('/').filter((x) => x.trim() !== ''), [location.pathname]);
  const path = useMemo(() => (levels.slice(1).length ? `${levels.slice(1).join('/')}/` : ''), [levels]);
  const { data, error, isLoading } = usePage(path);
  const classes = useStyles({ data });

  useEffect(() => {
    if (data && location.pathname !== data.path) {
      navigate(`${URLS.pages}${data.path}`, { replace: true });
    }
  }, [navigate, location.pathname, data]);

  const SpecialContent = () => {
    switch (path) {
      case PAGES_URLS.SOSIALEN:
        return <MembersCard slug={Groups.SOSIALEN} />;
      case PAGES_URLS.DRIFT:
        return <MembersCard slug={Groups.DRIFT} />;
      case PAGES_URLS.NOK:
        return <MembersCard slug={Groups.NOK} />;
      case PAGES_URLS.PROMO:
        return <MembersCard slug={Groups.PROMO} />;
      case PAGES_URLS.ABOUT_INDEX:
        return <Index />;
      default:
        return null;
    }
  };

  return (
    <Page
      banner={
        <Banner title={isLoading ? <Skeleton width={300} /> : error ? 'Noe gikk galt' : data?.title}>
          <PagesSearch />
        </Banner>
      }
      options={{ title: data ? data.title : 'Laster side...' }}>
      <Breadcrumbs aria-label='breadcrumb' maxItems={4}>
        {levels.slice(0, levels.length - 1).map((level, i) => (
          <Link className={classes.link} key={i} to={`/${levels.slice(0, i + 1).join('/')}`}>
            <Typography className={classes.breadcrumb}>{level.replace(/-/gi, ' ')}</Typography>
          </Link>
        ))}
        <Typography>{data?.title}</Typography>
      </Breadcrumbs>
      <div className={classnames(classes.grid, classes.root)}>
        {isLoading ? (
          <>
            <Paper className={classes.paper} noPadding>
              <Skeleton height={48} variant='rectangular' />
            </Paper>
            <Paper>
              <Skeleton height={50} variant='text' width='40%' />
              <Skeleton height={30} variant='text' />
              <Skeleton height={30} variant='text' />
            </Paper>
          </>
        ) : error ? (
          <>
            <Paper className={classes.paper} noPadding>
              <PagesList homeButton pages={[]} />
            </Paper>
            <Paper>
              <Typography>{error.detail}</Typography>
            </Paper>
          </>
        ) : (
          data !== undefined && (
            <>
              <div className={classnames(classes.grid, classes.list)}>
                <Paper className={classes.paper} noPadding>
                  <PagesList pages={data.children} />
                </Paper>
                <ShareButton color='inherit' fullWidth shareId={data.path} shareType='pages' title={data.title} />
                <PagesAdmin page={data} />
              </div>
              <div className={classnames(classes.grid, classes.inner)}>
                <div className={classnames(classes.grid, classes.content)}>
                  {Boolean(data.content.trim().length) && (
                    <Paper>
                      <MarkdownRenderer value={data.content} />
                    </Paper>
                  )}
                  <Suspense fallback={null}>
                    <SpecialContent />
                  </Suspense>
                </div>
                {data.image && <img alt={data.image_alt || data.title} className={classes.image} src={data.image} />}
              </div>
            </>
          )
        )}
      </div>
    </Page>
  );
};

export default Pages;
