import { Box, BoxProps, ButtonBase, Skeleton, touchRippleClasses, Typography } from '@mui/material';
import { Link } from 'react-router-dom';
import URLS from 'URLS';

import { Gallery } from 'types';

import Paper from 'components/layout/Paper';
import AspectRatioImg, { AspectRatioLoading } from 'components/miscellaneous/AspectRatioImg';

export type GalleryListItemProps = {
  gallery: Gallery;
  sx?: BoxProps['sx'];
};

const GalleryListItem = ({ gallery, sx }: GalleryListItemProps) => (
  <Box sx={{ height: 'fit-content', overflow: 'hidden', ...sx }}>
    <ButtonBase
      component={Link}
      focusRipple
      sx={{ borderRadius: (theme) => `${theme.shape.borderRadius}px`, display: 'block' }}
      tabIndex={-1}
      to={`${URLS.gallery}${gallery.slug}/`}>
      <AspectRatioImg alt={gallery.image_alt || gallery.title} borderRadius className={touchRippleClasses.root} ratio={16 / 9} src={gallery.image} />
    </ButtonBase>
    <ButtonBase
      component={Link}
      focusRipple
      sx={{ borderRadius: (theme) => `${theme.shape.borderRadius}px`, width: '80%', margin: '-40px auto 0', position: 'relative', display: 'block' }}
      to={`${URLS.gallery}${gallery.slug}/`}>
      <Paper elevation={0} sx={{ textAlign: 'center', p: 1, width: '100%' }}>
        <Typography
          sx={{ fontSize: { xs: '1.4rem', md: '1.5rem' }, textTransform: 'none', textOverflow: 'ellipsis', whiteSpace: 'nowrap', overflow: 'hidden' }}
          variant='h2'>
          {gallery.title}
        </Typography>
        <Typography sx={{ overflow: 'hidden', WebkitLineClamp: 2, display: '-webkit-box', WebkitBoxOrient: 'vertical' }} variant='body2'>
          {gallery.description}
        </Typography>
      </Paper>
    </ButtonBase>
  </Box>
);

export default GalleryListItem;

export const GalleryListItemLoading = ({ sx }: Pick<GalleryListItemProps, 'sx'>) => (
  <Box sx={{ textDecoration: 'none', ...sx }}>
    <AspectRatioLoading borderRadius ratio={16 / 9} />
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
