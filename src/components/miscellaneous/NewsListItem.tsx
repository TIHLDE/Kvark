import { Box, BoxProps, Button, ButtonBase, Grid, Skeleton, Stack, styled, touchRippleClasses, Typography } from '@mui/material';
import { List, ListItem, Popover } from '@mui/material';
import { parseISO } from 'date-fns';
import EmojiPicker, { EmojiClickData } from 'emoji-picker-react';
import { useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import URLS from 'URLS';
import { formatDate, urlEncode } from 'utils';
import '../../assets/css/popover.css';
import { useMutation, useQuery, useQueryClient } from 'react-query';

import { News, Reaction } from 'types';

import { useNewsById } from 'hooks/News';
import { useSnackbar } from 'hooks/Snackbar';
import { useUser } from 'hooks/User';

import Paper from 'components/layout/Paper';
import AspectRatioImg, { AspectRatioLoading } from 'components/miscellaneous/AspectRatioImg';

import React from 'react';

export type NewsListItemProps = {
  news: News;
  sx?: BoxProps['sx'];
};

const EmojiPaper = styled(Paper)(({ theme }) => ({
  padding: '8px',
  borderRadius: '8px',
  backgroundColor: theme.palette.background.paper,
}));

const NewsListItem = ({ news, sx }: NewsListItemProps) => {
  const user = useUser();
  const { data: newsDetails, isLoading: newsDetailsLoading } = useNewsById(news.id);

  const showSnackbar = useSnackbar();

  const showEmojiPaper = !newsDetailsLoading && newsDetails?.emojis_allowed;
  const anchorRef = React.useRef(null);

  const [openEmojiList, setOpenEmojiList] = useState(false);
  const [popoverMode, setPopoverMode] = useState<'ALL_REACTIONS' | 'EMOJI_LIST'>('EMOJI_LIST');

  const groupedReactions: Record<string, number> =
    newsDetails?.reactions?.reduce((acc, reaction) => {
      acc[reaction.emoji] = (acc[reaction.emoji] || 0) + 1;
      return acc;
    }, {} as Record<string, number>) || {};

  const top5Reactions: string[] = Object.entries(groupedReactions)
    .sort(([, a], [, b]) => b - a)
    .slice(0, 5)
    .map(([emoji]) => emoji);

  const userReaction: Reaction | undefined = user.data?.user_id ? newsDetails?.reactions?.find((r) => r.user === user.data?.user_id.toString()) : undefined;

  const userReactedEmoji: string | undefined = userReaction?.emoji;

  const isUserReactionInTop5: boolean = top5Reactions.includes(userReactedEmoji || '');

  if (!isUserReactionInTop5 && userReactedEmoji) {
    top5Reactions.push(userReactedEmoji);
  }

  const handleCloseEmojiList = () => {
    setOpenEmojiList(false);
  };

  return (
    <Box sx={{ height: 'fit-content', overflow: 'hidden', ...sx }}>
      <ButtonBase
        component={Link}
        focusRipple
        sx={{ borderRadius: (theme) => `${theme.shape.borderRadius}px`, display: 'block' }}
        tabIndex={-1}
        to={`${URLS.news}${news.id}/${urlEncode(news.title)}/`}>
        <AspectRatioImg alt={news.image_alt || news.title} borderRadius className={touchRippleClasses.root} src={news.image} />
      </ButtonBase>
      <Box sx={{ display: 'flex', flexDirection: 'column' }}>
        <ButtonBase
          component={Link}
          focusRipple
          sx={{
            borderRadius: (theme) => `${theme.shape.borderRadius}px`,
            width: '80%',
            margin: '-40px auto 0',
            position: 'relative',
            display: 'block',
          }}
          to={`${URLS.news}${news.id}/${urlEncode(news.title)}/`}>
          <div>
            <Paper elevation={0} sx={{ textAlign: 'center', p: 1, width: '100%' }}>
              <Typography
                sx={{
                  fontSize: { xs: '1.4rem', md: '1.5rem' },
                  textTransform: 'none',
                  textOverflow: 'ellipsis',
                  whiteSpace: 'nowrap',
                  overflow: 'hidden',
                }}
                variant='h2'>
                {news.title}
              </Typography>
              <Typography variant='caption'>{formatDate(parseISO(news.created_at), { time: false })}</Typography>
              <Typography
                sx={{
                  overflow: 'hidden',
                  WebkitLineClamp: 2,
                  display: '-webkit-box',
                  WebkitBoxOrient: 'vertical',
                }}
                variant='body2'>
                {news.header}
              </Typography>
            </Paper>
          </div>
        </ButtonBase>
        <Popover
          anchorEl={anchorRef.current}
          anchorOrigin={{
            vertical: 'top',
            horizontal: 'center',
          }}
          onClose={handleCloseEmojiList}
          open={openEmojiList}
          PaperProps={{
            className: popoverMode === 'ALL_REACTIONS' ? 'popoverPaperAllReactions' : '',
            style:
              popoverMode === 'EMOJI_LIST'
                ? {
                    width: 'auto',
                    maxHeight: 'auto',
                    overflowY: 'auto',
                  }
                : popoverMode === 'ALL_REACTIONS'
                ? {}
                : {},
          }}
          transformOrigin={{
            vertical: 'bottom',
            horizontal: 'center',
          }}></Popover>
      </Box>
    </Box>
  );
};

export default NewsListItem;

export const NewsListItemLoading = ({ sx }: Pick<NewsListItemProps, 'sx'>) => (
  <Box sx={{ textDecoration: 'none', ...sx }}>
    <AspectRatioLoading borderRadius />
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
