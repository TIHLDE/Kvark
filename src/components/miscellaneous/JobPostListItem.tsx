import { Box, Divider, ListItemButton, Skeleton, Stack, Typography } from '@mui/material';
import { parseISO } from 'date-fns';
import { Link } from 'react-router-dom';
import URLS from 'URLS';
import { formatDate, getJobpostType, urlEncode } from 'utils';
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore

import { JobPost } from 'types';

import Paper, { PaperProps } from 'components/layout/Paper';
import AspectRatioImg, { AspectRatioLoading } from 'components/miscellaneous/AspectRatioImg';

export type JobPostListItemProps = {
  jobpost: JobPost;
  sx?: PaperProps['sx'];
};

const JobPostListItem = ({ jobpost, sx }: JobPostListItemProps) => (
  <ListItemButton
    component={Link}
    focusRipple
    sx={{ p: 0, overflow: 'hidden', borderRadius: (theme) => `${theme.shape.borderRadius}px`, ...sx }}
    to={`${URLS.jobposts}${jobpost.id}/${urlEncode(jobpost.title)}/`}>
    <Paper noOverflow noPadding sx={{ width: '100%' }}>
      <div style={{ display: 'block' }}>
        <AspectRatioImg
          alt={jobpost.image_alt || jobpost.title}
          src={jobpost.image}
          sx={{ height: 'auto', width: '100%', objectFit: 'cover', borderRadius: (theme) => `${Number(theme.shape.borderRadius) / 2}px` }}
        />
      </div>
      <Stack direction='row' gap={1} justifyContent='space-between' sx={{ width: '100%', p: { xs: 1.5, md: 2 } }}>
        <Box sx={{ minWidth: 0 }}>
          <Typography
            sx={{ fontSize: { xs: '1.4rem', md: '1.5rem' }, textTransform: 'none', textOverflow: 'ellipsis', whiteSpace: 'nowrap', overflow: 'hidden' }}
            variant='h2'>
            {jobpost.title}
          </Typography>
          <Typography variant='caption'>{`${jobpost.company} • ${jobpost.location}`}</Typography>
        </Box>
        {/* TODO: fjern div rundt AspectRatioImg når flere nettlesere støtter aspect-ratio i css - https://caniuse.com/mdn-css_properties_aspect-ratio */}
      </Stack>
      <Divider />
      <Box sx={{ display: 'grid', py: 1, gridTemplateColumns: 'repeat(3, 1fr)' }}>
        <Typography align='center' variant='body2'>
          <b>Type</b>
          <br />
          {getJobpostType(jobpost.job_type)}
        </Typography>
        <Typography align='center' variant='body2'>
          <b>Årstrinn</b>
          <br />
          {`${jobpost.class_start === jobpost.class_end ? `${jobpost.class_start}.` : `${jobpost.class_start}. - ${jobpost.class_end}.`}`}
        </Typography>
        <Typography align='center' variant='body2'>
          <b>Frist</b>
          <br />
          {jobpost.is_continuously_hiring ? 'Fortløpende' : formatDate(parseISO(jobpost.deadline), { time: false })}
        </Typography>
      </Box>
    </Paper>
  </ListItemButton>
);

export default JobPostListItem;

export const JobPostListItemLoading = ({ sx }: Pick<JobPostListItemProps, 'sx'>) => (
  <ListItemButton sx={{ p: 0, overflow: 'hidden', borderRadius: (theme) => `${theme.shape.borderRadius}px` }}>
    <Paper noOverflow noPadding sx={{ width: '100%', ...sx }}>
      <Stack direction='row' gap={1} justifyContent='space-between' sx={{ width: '100%', p: { xs: 1.5, md: 2 } }}>
        <Box sx={{ minWidth: 0 }}>
          <Typography sx={{ fontSize: { xs: '1.4rem', md: '1.5rem' } }} variant='h2'>
            <Skeleton width={150} />
          </Typography>
          <Typography variant='caption'>
            <Skeleton width={100} />
          </Typography>
        </Box>
        <AspectRatioLoading sx={{ height: 45, width: 'auto' }} />
      </Stack>
      <Divider />
      <Box sx={{ display: 'grid', py: 1, gridTemplateColumns: 'repeat(3, 1fr)' }}>
        {Array.from(Array(3).keys()).map((i) => (
          <Typography align='center' key={i} variant='body2'>
            <Skeleton height={15} sx={{ margin: '2px auto' }} width={40} />
            <Skeleton height={15} sx={{ margin: '2px auto' }} width={55} />
          </Typography>
        ))}
      </Box>
    </Paper>
  </ListItemButton>
);
