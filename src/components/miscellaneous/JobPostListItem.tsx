import { Box, Divider, ListItemButton, Skeleton, Stack, Typography } from '@mui/material';
import { parseISO } from 'date-fns';
import { Link } from 'react-router-dom';
import URLS from 'URLS';
import { formatDate, getJobpostType, urlEncode } from 'utils';

import { JobPost } from 'types';

import Paper, { PaperProps } from 'components/layout/Paper';
import AspectRatioImg, { AspectRatioLoading } from 'components/miscellaneous/AspectRatioImg';

export type JobPostListItemProps = {
  jobPost: JobPost;
  sx?: PaperProps['sx'];
};

const JobPostListItem = ({ jobPost, sx }: JobPostListItemProps) => (
  <ListItemButton
    component={Link}
    focusRipple
    sx={{ p: 0, overflow: 'hidden', borderRadius: (theme) => `${theme.shape.borderRadius}px`, ...sx }}
    to={`${URLS.jobposts}${jobPost.id}/${urlEncode(jobPost.title)}/`}>
    <Paper noOverflow noPadding sx={{ width: '100%' }}>
      <AspectRatioImg
        alt={jobPost.image_alt || jobPost.title}
        src={jobPost.image}
        sx={{ height: 'auto', width: '100%', objectFit: 'cover', borderRadius: (theme) => `${Number(theme.shape.borderRadius) / 2}px` }}
      />
      <Stack direction='row' gap={1} justifyContent='space-between' sx={{ width: '100%', p: { xs: 1.5, md: 2 } }}>
        <Box sx={{ minWidth: 0 }}>
          <Typography
            sx={{ fontSize: { xs: '1.4rem', md: '1.5rem' }, textTransform: 'none', textOverflow: 'ellipsis', whiteSpace: 'nowrap', overflow: 'hidden' }}
            variant='h2'>
            {jobPost.title}
          </Typography>
          <Typography variant='caption'>{`${jobPost.company} • ${jobPost.location}`}</Typography>
        </Box>
      </Stack>
      <Divider />
      <Box sx={{ display: 'grid', py: 1, gridTemplateColumns: 'repeat(3, 1fr)' }}>
        <Typography align='center' variant='body2'>
          <b>Type</b>
          <br />
          {getJobpostType(jobPost.job_type)}
        </Typography>
        <Typography align='center' variant='body2'>
          <b>Årstrinn</b>
          <br />
          {`${jobPost.class_start === jobPost.class_end ? `${jobPost.class_start}.` : `${jobPost.class_start}. - ${jobPost.class_end}.`}`}
        </Typography>
        <Typography align='center' variant='body2'>
          <b>Frist</b>
          <br />
          {jobPost.is_continuously_hiring ? 'Fortløpende' : formatDate(parseISO(jobPost.deadline), { time: false })}
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
