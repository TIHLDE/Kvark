import { useMemo } from 'react';
import { useUserForms } from 'hooks/User';
import { Link } from 'react-router-dom';
import URLS from 'URLS';
import { parseISO } from 'date-fns';
import { formatDate } from 'utils';

import { ListItemText, ListItemIcon, ListItem, ListItemButton, Skeleton, Typography } from '@mui/material';
import ArrowIcon from '@mui/icons-material/ArrowForwardRounded';

// Project componets
import NotFoundIndicator from 'components/miscellaneous/NotFoundIndicator';
import Pagination from 'components/layout/Pagination';
import Paper from 'components/layout/Paper';
import { FormResourceType, EventFormType } from 'types/Enums';

const ProfileForms = () => {
  const { data, hasNextPage, fetchNextPage, isFetching } = useUserForms({ unanswered: true });
  const forms = useMemo(() => (data !== undefined ? data.pages.map((page) => page.results).flat(1) : []), [data]);

  if (!data) {
    return (
      <Paper noOverflow noPadding>
        <ListItem>
          <ListItemText primary={<Skeleton />} />
        </ListItem>
      </Paper>
    );
  } else if (!forms.length) {
    return <NotFoundIndicator header='Fant ingen spørreskjemaer' subtitle='Du har ingen spørreskjemaer du må svare på' />;
  } else {
    return (
      <Pagination fullWidth hasNextPage={hasNextPage} isLoading={isFetching} label='Last flere spørreskjemaer' nextPage={() => fetchNextPage()}>
        <Typography sx={{ px: 2, py: 1 }} variant='subtitle2'>
          Du må svare på følgende spørreskjemaer før du kan melde deg på arrangementer igjen
        </Typography>
        {forms?.map((form) => (
          <Paper key={form.id} noOverflow noPadding>
            <ListItemButton component={Link} to={`${URLS.form}${form.id}/`}>
              <ListItemText
                primary={
                  <Typography variant='h3'>
                    {form.resource_type === FormResourceType.EVENT_FORM
                      ? `${form.event.title} - ${form.type === EventFormType.EVALUATION ? `Evaluering` : `Spørreskjema`}`
                      : form.title}
                  </Typography>
                }
                secondary={
                  form.resource_type === FormResourceType.EVENT_FORM &&
                  `Holdt ${formatDate(parseISO(form.event.start_date)).toLowerCase()} på ${form.event.location}`
                }
              />
              <ListItemIcon sx={{ minWidth: 0 }}>
                <ArrowIcon />
              </ListItemIcon>
            </ListItemButton>
          </Paper>
        ))}
      </Pagination>
    );
  }
};

export default ProfileForms;
