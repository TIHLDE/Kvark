import ArrowIcon from '@mui/icons-material/ArrowForwardRounded';
import { ListItem, ListItemButton, ListItemIcon, ListItemText, Skeleton, Typography } from '@mui/material';
import { parseISO } from 'date-fns';
import { useMemo } from 'react';
import { Link } from 'react-router-dom';
import URLS from 'URLS';
import { formatDate } from 'utils';

import { EventFormType, FormResourceType } from 'types/Enums';

import { useUserForms } from 'hooks/User';

import Paper from 'components/layout/Paper';
import NotFoundIndicator from 'components/miscellaneous/NotFoundIndicator';

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
      <div className='space-y-2'>
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
      </div>
    );
  }
};

export default ProfileForms;
