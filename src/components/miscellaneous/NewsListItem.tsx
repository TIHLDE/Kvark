import { Box, BoxProps, ButtonBase, Skeleton, Stack, styled, touchRippleClasses, Typography } from '@mui/material';
import { parseISO } from 'date-fns';
import { Link } from 'react-router-dom';
import URLS from 'URLS';
import { formatDate, urlEncode } from 'utils';

import { News } from 'types';

import Paper from 'components/layout/Paper';
import AspectRatioImg, { AspectRatioLoading } from 'components/miscellaneous/AspectRatioImg';

export type NewsListItemProps = {
  news: News;
  sx?: BoxProps['sx'];
};

const EmojiPaper = styled(Paper)(({ theme }) => ({
  padding: '8px',
  borderRadius: '8px',
  backgroundColor: theme.palette.background.paper,
}));

const NewsListItem = ({ news, sx }: NewsListItemProps) => (
  <Box sx={{ height: 'fit-content', overflow: 'hidden', ...sx }}>
    <ButtonBase
      component={Link}
      focusRipple
      // TODO: fjern display: block når flere nettlesere støtter aspect-ratio i css - https://caniuse.com/mdn-css_properties_aspect-ratio
      sx={{ borderRadius: (theme) => `${theme.shape.borderRadius}px`, display: 'block' }}
      tabIndex={-1}
      to={`${URLS.news}${news.id}/${urlEncode(news.title)}/`}>
      <AspectRatioImg alt={news.image_alt || news.title} borderRadius className={touchRippleClasses.root} src={news.image} />
    </ButtonBase>
    <Box sx={{ display: 'flex', flexDirection: 'column' }}>
      <ButtonBase
        component={Link}
        focusRipple
        sx={{ borderRadius: (theme) => `${theme.shape.borderRadius}px`, width: '80%', margin: '-40px auto 0', position: 'relative', display: 'block' }}
        to={`${URLS.news}${news.id}/${urlEncode(news.title)}/`}>
        <div>
          <Paper elevation={0} sx={{ textAlign: 'center', p: 1, width: '100%' }}>
            <Typography
              sx={{ fontSize: { xs: '1.4rem', md: '1.5rem' }, textTransform: 'none', textOverflow: 'ellipsis', whiteSpace: 'nowrap', overflow: 'hidden' }}
              variant='h2'>
              {news.title}
            </Typography>
            <Typography variant='caption'>{formatDate(parseISO(news.created_at), { time: false })}</Typography>
            <Typography sx={{ overflow: 'hidden', WebkitLineClamp: 2, display: '-webkit-box', WebkitBoxOrient: 'vertical' }} variant='body2'>
              {news.header}
            </Typography>
          </Paper>
          <Stack sx={{ maxWidth: '100px', marginLeft: 'auto' }}>
            <EmojiPaper>👩, 👨, 👨</EmojiPaper>
          </Stack>
        </div>
      </ButtonBase>
    </Box>
  </Box>
);

export default NewsListItem;

export const NewsListItemLoading = ({ sx }: Pick<NewsListItemProps, 'sx'>) => (
  <Box sx={{ textDecoration: 'none', ...sx }}>
    <AspectRatioLoading borderRadius />
    <Paper elevation={0} sx={{ textAlign: 'center', p: 1, width: '80%', margin: '-40px auto 0', position: 'relative' }}>
      <Typography
        sx={{ fontSize: { xs: '1.4rem', md: '1.5rem' }, textTransform: 'none', textOverflow: 'ellipsis', whiteSpace: 'nowrap', overflow: 'hidden' }}
        variant='h2'>
        <Skeleton sx={{ margin: 'auto' }} width='70%' />
      </Typography>
      <Typography variant='caption'>
        <Skeleton sx={{ margin: 'auto' }} width='30%' />
      </Typography>
      <Typography variant='body2'>
        <Skeleton sx={{ margin: 'auto' }} width='80%' />
        <Skeleton sx={{ margin: 'auto' }} width='60%' />
      </Typography>
    </Paper>
  </Box>
);
