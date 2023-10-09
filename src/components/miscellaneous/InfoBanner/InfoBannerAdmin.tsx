import AddRoundedIcon from '@mui/icons-material/AddRounded';
import InfoRoundedIcon from '@mui/icons-material/InfoRounded';
import { Button, Stack, styled, Typography } from '@mui/material';
import { formatDistance } from 'date-fns';
import { parseISO } from 'date-fns/esm';
import nbLocale from 'date-fns/locale/nb';
import { makeStyles } from 'makeStyles';
import { useMemo, useState } from 'react';
import { useForm } from 'react-hook-form';
import { formatDate } from 'utils';

import { useInfoBanners } from 'hooks/InfoBanner';

import Bool from 'components/inputs/Bool';
import Dialog from 'components/layout/Dialog';
import { StandaloneExpand } from 'components/layout/Expand';
import Pagination from 'components/layout/Pagination';
import Paper from 'components/layout/Paper';
import { PrimaryTopBox } from 'components/layout/TopBox';
import Page from 'components/navigation/Page';

import InfoBannerAdminItem from './InfoBannerAdminItem';

type Filters = {
  is_visible: boolean;
  is_expired: boolean;
};

const Row = styled(Stack)(({ theme }) => ({
  gap: 0,
  flexDirection: 'column',
  width: '100%',
  [theme.breakpoints.up('md')]: {
    gap: theme.spacing(2),
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
}));

const InfoBannerAdmin = () => {
  const [open, setOpen] = useState(false);
  const [filters, setFilters] = useState<Filters>({ is_visible: false, is_expired: false });
  const { control, handleSubmit, formState } = useForm<Filters>({ defaultValues: { is_visible: false, is_expired: false } });

  const searchWithFilters = (data: Filters) => {
    setFilters({ is_visible: data.is_visible, is_expired: data.is_expired });
  };
  const { data: bannerData, hasNextPage, fetchNextPage, isFetching } = useInfoBanners(filters);
  const banners = useMemo(() => (bannerData ? bannerData.pages.map((page) => page.results).flat() : []), [bannerData]);

  return (
    <>
      <Typography>Bannere brukes for å gi en felles informasjon til alle som besøker nettsiden.</Typography>
      <Row sx={{ mb: 2, gap: 2, mt: 1 }}>
        <form onChange={handleSubmit(searchWithFilters)}>
          <Bool control={control} formState={formState} label='Se aktive' name='is_visible' type='switch' />
          <Bool control={control} formState={formState} label='Se tidligere' name='is_expired' type='switch' />
        </form>
        <Button onClick={() => setOpen(true)} startIcon={<AddRoundedIcon />} variant='outlined'>
          Nytt banner
        </Button>
      </Row>
      <Dialog onClose={() => setOpen(false)} open={open} titleText='Nytt banner'>
        <InfoBannerAdminItem onClose={() => setOpen(false)} />
      </Dialog>
      <Pagination fullWidth hasNextPage={hasNextPage} isLoading={isFetching} nextPage={() => fetchNextPage()}>
        <Stack gap={1}>
          {banners.map((banner) => (
            <StandaloneExpand
              icon={<InfoRoundedIcon />}
              key={banner.visible_from}
              primary={`Endre informasjon om ${banner.title}?`}
              secondary={`Aktiv ${formatDistance(parseISO(banner.visible_until), new Date(), {
                includeSeconds: true,
                addSuffix: true,
                locale: nbLocale,
              })}. Vises på forsiden fra ${formatDate(parseISO(banner.visible_from))} til ${formatDate(parseISO(banner.visible_until))}.`}>
              <InfoBannerAdminItem bannerId={banner.id} />
            </StandaloneExpand>
          ))}
        </Stack>
      </Pagination>
    </>
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
