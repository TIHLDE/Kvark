import { Box, BoxProps, Button, ButtonBase, Grid, Skeleton, Stack, styled, touchRippleClasses, Typography } from '@mui/material';
import { List, ListItem, Popover } from '@mui/material';
import { parseISO } from 'date-fns';
import { useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import URLS from 'URLS';
import { formatDate, urlEncode } from 'utils';

import { News, Reaction } from 'types';

import { addReaction, changeEmoji, deleteEmoji, getEmojies } from 'hooks/Emojis';
import { useCreateNews, useDeleteNews, useNewsById, useUpdateNews } from 'hooks/News';
import { useUser } from 'hooks/User';

import Paper from 'components/layout/Paper';
import AspectRatioImg, { AspectRatioLoading } from 'components/miscellaneous/AspectRatioImg';

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
  type EmojiListType = Record<string, string>;
  const { data: newsDetails, isLoading: newsDetailsLoading } = useNewsById(news.id);
  console.log(newsDetails);
  const { data: emojiList } = getEmojies() as { data: EmojiListType | undefined };

  const showEmojiPaper = !newsDetailsLoading && newsDetails?.emojis_allowed;

  const [openEmojiList, setOpenEmojiList] = useState(false);
  const [popoverMode, setPopoverMode] = useState<'ALL_REACTIONS' | 'EMOJI_LIST'>('EMOJI_LIST');
  const [openAllReactions, setOpenAllReactions] = useState(false);
  const [showExistingReactions, setShowExistingReactions] = useState(false);


  const groupedReactions: Record<string, number> = newsDetails?.reactions?.reduce((acc, reaction) => {
    acc[reaction.emoji] = (acc[reaction.emoji] || 0) + 1;
    return acc;
  }, {} as Record<string, number>) || {};

  const top5Reactions: string[] = Object.entries(groupedReactions)
  .sort(([, a], [, b]) => b - a)
  .slice(0, 5)
  .map(([emoji]) => emoji);

  const userReaction: Reaction | undefined = user.data?.user_id
  ? newsDetails?.reactions?.find((r) => r.user === user.data?.user_id.toString())
  : undefined;
  
  const userReactedEmoji: string | undefined = userReaction?.emoji;

  const isUserReactionInTop5: boolean = top5Reactions.includes(userReactedEmoji || '');

  if (!isUserReactionInTop5 && userReactedEmoji) {
    top5Reactions.push(userReactedEmoji);
  }

  const handleOpenEmojiList = () => {
    setPopoverMode('EMOJI_LIST');
    setOpenEmojiList(true);
  };

  const handleCloseEmojiList = () => {
    setOpenEmojiList(false);
  };

  const handleOpenAllReactions = () => {
    setPopoverMode('ALL_REACTIONS');
    setOpenEmojiList(true);
  };

  const handleCloseAllReactions = () => {
      setOpenAllReactions(false);
  };

  const handleEmojiClick = (clickedEmoji: string) => {
    const userReaction = user.data?.user_id
      ? newsDetails?.reactions?.find((r) => {
          return r.user === user.data?.user_id;
        })
      : undefined;

    if (userReaction) {
      const user_id = user.data?.user_id;
      editEmoji(userReaction.reaction_id, clickedEmoji, news.id, user_id);
    } else {
      addReaction(clickedEmoji, news.id, user.data?.user_id);
    }

    handleCloseEmojiList();
  };

  const editEmoji = (reaction_id: string, emoji: string, newsId: number, user_id: any) => {
    changeEmoji(reaction_id, emoji, news.id, user.data?.user_id);
  };

  const deleteReaction = (reaction_id: string) => {
    console.log(deleteEmoji(reaction_id));
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
            {showEmojiPaper && (
              <Stack sx={{ maxWidth: '1000px', marginLeft: 'auto', display: 'flex', flexDirection: 'row-reverse' }}>
                <EmojiPaper>
                {top5Reactions.map((emoji, index) => {
                    const userReactionWithThisEmoji = user.data?.user_id
                    ? newsDetails?.reactions?.find((r) => r.user === user.data?.user_id && r.emoji === emoji)
                    : undefined;
                      return (
                          <span 
                              key={index} 
                              onClick={() => {
                                  if (userReactionWithThisEmoji) {
                                      if (emoji === userReactedEmoji) {
                                          deleteReaction(userReactionWithThisEmoji.reaction_id);
                                      } else {
                                          editEmoji(userReactionWithThisEmoji.reaction_id, emoji, news.id, user.data?.user_id);
                                      }
                                  } else {
                                      handleEmojiClick(emoji);
                                  }
                              }}
                              style={{ 
                                  cursor: 'pointer',
                                  backgroundColor: emoji === userReactedEmoji ? "grey" : "transparent",
                                  boxShadow: emoji === userReactedEmoji ? "0px 2px 5px rgba(0, 0, 0, 0.1)" : "none", 
                                  padding: "5px", 
                                  borderRadius: "4px", 
                                  marginRight: "5px"
                              }}
                          >
                              {emoji} {groupedReactions[emoji]}
                          </span>
                      );
                  })}
                </EmojiPaper>
              </Stack>
            )}
          </div>
        </ButtonBase>
        <Button onClick={handleOpenEmojiList}>+</Button>
        <Button onClick={handleOpenAllReactions}>Se mer</Button>
        <Popover
          anchorOrigin={{
            vertical: 'center',
            horizontal: 'center',
          }}
          anchorPosition={{ top: window.innerHeight / 2, left: window.innerWidth / 2 }}
          anchorReference='anchorPosition'
          onClose={handleCloseEmojiList}
          open={openEmojiList}
          PaperProps={{
            style: {
              width: '70%',
              maxHeight: '50vh',
              overflowY: 'auto',
            },
          }}
          transformOrigin={{
            vertical: 'center',
            horizontal: 'center',
          }}
        >
          <Grid container spacing={1}>
            {popoverMode === 'EMOJI_LIST' && emojiList && 
              Object.keys(emojiList).map((emoji, index) => (
                <Grid item key={index} onClick={() => handleEmojiClick(emoji)} style={{ textAlign: 'center', cursor: 'pointer' }} xs={1}>
                  {emoji}
                </Grid>
              ))
            }
            {popoverMode === 'ALL_REACTIONS' && 
              top5Reactions.map((emoji, index) => (
                <Grid item key={index} onClick={() => {
                  const userReactionWithThisEmoji = user.data?.user_id
                    ? newsDetails?.reactions?.find((r) => r.user === user.data?.user_id && r.emoji === emoji)
                    : undefined;
                  if (userReactionWithThisEmoji) {
                    if (emoji === userReactedEmoji) {
                      deleteReaction(userReactionWithThisEmoji.reaction_id);
                    } else {
                      editEmoji(userReactionWithThisEmoji.reaction_id, emoji, news.id, user.data?.user_id);
                    }
                  } else {
                    handleEmojiClick(emoji);
                  }
                }} 
                style={{ 
                  textAlign: 'center',
                  cursor: 'pointer',
                  backgroundColor: emoji === userReactedEmoji ? "grey" : "transparent",
                  boxShadow: emoji === userReactedEmoji ? "0px 2px 5px rgba(0, 0, 0, 0.1)" : "none", 
                  padding: "5px", 
                  borderRadius: "4px", 
                  marginRight: "5px"
                }} 
                xs={1}
                >
                  {emoji} {groupedReactions[emoji]}
                </Grid>
              ))
            }
          </Grid>
        </Popover>
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
