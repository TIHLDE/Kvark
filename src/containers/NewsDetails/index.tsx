import { useEffect } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import URLS from 'URLS';
import Helmet from 'react-helmet';
import { useParams, useNavigate } from 'react-router-dom';
import { urlEncode } from 'utils';
import { useNewsById } from 'api/hooks/News';

// Project components
import Http404 from 'containers/Http404';
import Navigation from 'components/navigation/Navigation';
import NewsRenderer, { NewsRendererLoading } from 'containers/NewsDetails/components/NewsRenderer';
import TIHLDELOGO from 'assets/img/TihldeBackground.jpg';

const useStyles = makeStyles((theme) => ({
  wrapper: {
    position: 'relative',
    color: theme.palette.text.primary,
    paddingBottom: theme.spacing(2),
  },
}));

const NewsDetails = () => {
  const classes = useStyles();
  const { id } = useParams();
  const navigate = useNavigate();
  const { data, isLoading, isError } = useNewsById(Number(id));

  useEffect(() => {
    if (data) {
      navigate(`${URLS.news}${id}/${urlEncode(data.title)}/`, { replace: true });
    }
  }, [id, navigate, data]);

  if (isError) {
    return <Http404 />;
  }

  return (
    <Navigation fancyNavbar maxWidth={false}>
      {data && (
        <Helmet>
          <title>{data.title} - TIHLDE</title>
          <meta content={data.title} property='og:title' />
          <meta content='website' property='og:type' />
          <meta content={window.location.href} property='og:url' />
          <meta content={data.image || 'https://tihlde.org' + TIHLDELOGO} property='og:image' />
        </Helmet>
      )}
      <div className={classes.wrapper}>{isLoading ? <NewsRendererLoading /> : data !== undefined && <NewsRenderer data={data} />}</div>
    </Navigation>
  );
};

export default NewsDetails;
