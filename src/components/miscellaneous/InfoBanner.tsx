import { Button, Stack, touchRippleClasses, Typography } from '@mui/material';

import { Banner } from 'types';

import { useVisibleBanners } from 'hooks/Banner';

import Paper from 'components/layout/Paper';

import AspectRatioImg from './AspectRatioImg';

const InfoBanner = () => {
  const { data: banners = [] } = useVisibleBanners();
  const banner: Banner | undefined = banners[0];
  if (banner) {
    return (
      <Paper sx={{ mx: 2, mb: 2 }}>
        {banner.image && <AspectRatioImg alt={banner.image_alt || banner.title} borderRadius className={touchRippleClasses.root} src={banner.image} />}
        <Stack gap={1}>
          <Typography align='center' gutterBottom variant='h2'>
            {banner.title}
          </Typography>
          <Typography align='center'>{banner.description}</Typography>
          {banner.url && (
            <Button
              fullWidth
              onClick={(e) => {
                e.preventDefault();
                window.location.href = `${banner.url}`;
              }}
              sx={{ mt: 1 }}
              variant='outlined'>
              Åpne link
            </Button>
          )}
        </Stack>
      </Paper>
    );
  }
  return <></>;
};

export default InfoBanner;
