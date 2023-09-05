import AddRoundedIcon from '@mui/icons-material/AddRounded';
import InfoRoundedIcon from '@mui/icons-material/InfoRounded';
import { Button, Stack, styled, Typography } from '@mui/material';
import { parseISO } from 'date-fns/esm';
import { makeStyles } from 'makeStyles';
import { useMemo, useState } from 'react';
import { useForm } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';
import URLS from 'URLS';
import { formatDate } from 'utils';
import { argsToParams } from 'utils';

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
  expired: boolean;
  only_active: boolean;
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
  const navigate = useNavigate();

  const getInitialFilters = useMemo((): Filters => {
    const params = new URLSearchParams(location.search);
    const expired = params.get('expired') ? Boolean(params.get('expired') === 'true') : false;
    const only_active = params.get('only_active') ? Boolean(params.get('only_active') === 'true') : false;
    return { expired, only_active };
  }, []);

  const [filters, setFilters] = useState<Filters>(getInitialFilters);
  const { control, handleSubmit, formState } = useForm<Filters>({ defaultValues: getInitialFilters });

  const searchWithFilters = (data: Filters) => {
    setFilters(data);
    navigate(`${URLS.bannerAdmin}${argsToParams(data)}`);
  };
  const { data: bannerData, hasNextPage, fetchNextPage, isFetching } = useInfoBanners(filters);
  const banners = useMemo(() => (bannerData ? bannerData.pages.map((page) => page.results).flat() : []), [bannerData]);

  return (
    <Pagination fullWidth hasNextPage={hasNextPage} isLoading={isFetching} nextPage={() => fetchNextPage()}>
      <Row sx={{ mb: 2 }}>
        <form onChange={handleSubmit(searchWithFilters)}>
          <Bool control={control} formState={formState} label='Tidligere' name='expired' type='switch' />
          <Bool control={control} formState={formState} label='Kun aktive' name='only_active' type='switch' />
        </form>
        <Button onClick={() => setOpen(true)} startIcon={<AddRoundedIcon />} variant='outlined'>
          Nytt banner
        </Button>
        <Dialog onClose={() => setOpen(false)} open={open} titleText='Nytt banner'>
          <InfoBannerAdminItem onClose={() => setOpen(false)} />
        </Dialog>
      </Row>
      <Stack gap={1}>
        {banners.map((banner) => (
          <StandaloneExpand
            icon={<InfoRoundedIcon />}
            key={banner.visible_from}
            primary={`Endre informasjon om ${banner.title}?`}
            secondary={`Vises fra ${formatDate(parseISO(banner.visible_from))} til ${formatDate(parseISO(banner.visible_until))}`}>
            <InfoBannerAdminItem bannerId={banner.id} />
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
