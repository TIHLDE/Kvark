import AddRoundedIcon from '@mui/icons-material/AddRounded';
import InfoRoundedIcon from '@mui/icons-material/InfoRounded';
import { Stack, Typography } from '@mui/material';
import { parseISO } from 'date-fns/esm';
import { makeStyles } from 'makeStyles';
import { useMemo } from 'react';
import { formatDate } from 'utils';

import { useInfoBanners } from 'hooks/InfoBanner';

import { StandaloneExpand } from 'components/layout/Expand';
import Pagination from 'components/layout/Pagination';
import Paper from 'components/layout/Paper';
import { PrimaryTopBox } from 'components/layout/TopBox';
import Page from 'components/navigation/Page';

import InfoBannerAdminItem from './InfoBannerAdminItem';

const InfoBannerAdmin = () => {
  const { data, hasNextPage, fetchNextPage, isFetching } = useInfoBanners();
  const banners = useMemo(() => (data ? data.pages.map((page) => page.results).flat() : []), [data]);

  return (
    <Pagination fullWidth hasNextPage={hasNextPage} isLoading={isFetching} nextPage={() => fetchNextPage()}>
      <Stack gap={1}>
        <StandaloneExpand icon={<AddRoundedIcon />} primary={`Opprett ny banner`} secondary={`Opprett et nytt informasjons banner.`}>
          <InfoBannerAdminItem banner_id={''} />
        </StandaloneExpand>
        {banners.map((banner) => (
          <StandaloneExpand
            icon={<InfoRoundedIcon />}
            key={banner.visible_from}
            primary={`Endre informasjon om ${banner.title}?`}
            secondary={`Vises fra ${formatDate(parseISO(banner.visible_from))} til ${formatDate(parseISO(banner.visible_until))}`}>
            <InfoBannerAdminItem banner_id={banner.id} />
          </StandaloneExpand>
        ))}
      </Stack>
    </Pagination>
  );
};
const useStyles = makeStyles()(() => ({
  content: {
    margin: '-60px auto 60px',
    position: 'relative',
  },
}));

const CreateInfoBannerAdminDialog = () => {
  const { classes } = useStyles();

  return (
    <Page banner={<PrimaryTopBox />} options={{ title: 'Banner admin' }}>
      <Paper className={classes.content}>
        <Typography marginBottom={3} variant='h1'>
          Banner admin
        </Typography>
        <InfoBannerAdmin />
      </Paper>
    </Page>
  );
};

export default CreateInfoBannerAdminDialog;
