import { Button, Stack, touchRippleClasses, Typography } from '@mui/material';

import { InfoBanner } from 'types';

import { useVisibleInfoBanners } from 'hooks/InfoBanner';

import Paper from 'components/layout/Paper';

import AspectRatioImg from '../AspectRatioImg';

const Banner = () => {
  const { data: banners = [] } = useVisibleInfoBanners();
  const banner: InfoBanner | undefined = banners[0];
  if (banner) {
    return (
      <Paper sx={{ mx: 2, mb: 2 }}>
        <Stack alignItems='center' gap={1}>
          {banner.image && (
            <AspectRatioImg
              alt={banner.image_alt || banner.title}
              borderRadius
              className={touchRippleClasses.root}
              src={banner.image}
              sx={{ maxWidth: '80%' }}
            />
          )}
          <Typography align='center' gutterBottom variant='h2'>
            {banner.title}
          </Typography>
          <Typography align='center'>{banner.description}</Typography>
          {banner.url && (
            <Button component='a' fullWidth href={banner.url} sx={{ mt: 1 }} variant='outlined'>
              Åpne link
            </Button>
          )}
        </Stack>
      </Paper>
    );
  }
  return <></>;
};

export default Banner;
