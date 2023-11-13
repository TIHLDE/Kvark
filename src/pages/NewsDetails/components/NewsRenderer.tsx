import { Box, Button, Grid, Popover, Skeleton, Stack, styled, Typography } from '@mui/material';
import parseISO from 'date-fns/parseISO';
import EmojiPicker, { EmojiClickData } from 'emoji-picker-react';
import { useState } from 'react';
import React from 'react';
import { usePalette } from 'react-palette';
import { Link } from 'react-router-dom';
import URLS from 'URLS';
import { formatDate } from 'utils';

import { News, Reaction } from 'types';
import { PermissionApp } from 'types/Enums';

import { addReaction, changeReaction, deleteReaction } from 'hooks/Emojis';
import { HavePermission, useUser } from 'hooks/User';

import Container from 'components/layout/Container';
import Paper from 'components/layout/Paper';
import AspectRatioImg, { AspectRatioLoading } from 'components/miscellaneous/AspectRatioImg';
import MarkdownRenderer from 'components/miscellaneous/MarkdownRenderer';
import ShareButton from 'components/miscellaneous/ShareButton';

const TopContainer = styled('div', { shouldForwardProp: (prop) => prop !== 'bgColor' })<{ bgColor?: React.CSSProperties['backgroundColor'] }>(
  ({ theme, bgColor }) => ({
    color: theme.palette.common.white,
    paddingTop: theme.spacing(10),
    paddingBottom: theme.spacing(20),
    background: bgColor || theme.palette.colors.gradient.main.top,
    transition: 'background 1s',
    [theme.breakpoints.down('lg')]: {
      paddingBottom: theme.spacing(15),
    },
  }),
);

const EmojiPaper = styled(Paper)(({ theme }) => ({
  padding: '8px',
  borderRadius: '8px',
  backgroundColor: theme.palette.background.paper,
}));

export type NewsRendererProps = {
  data: News;
  preview?: boolean;
};
const NewsRenderer = ({ data, preview = false }: NewsRendererProps) => {
  const { data: palette } = usePalette(data?.image || '');
  const user = useUser();
  type EmojiListType = Record<string, string>;

  const showEmojiPaper = data?.emojis_allowed;

  const [openEmojiList, setOpenEmojiList] = useState(false);
  const [popoverMode, setPopoverMode] = useState<'ALL_REACTIONS' | 'EMOJI_LIST'>('EMOJI_LIST');
  const anchorRef = React.useRef(null);

  const [openAllReactions, setOpenAllReactions] = useState(false);
  const [showExistingReactions, setShowExistingReactions] = useState(false);

  const groupedReactions: Record<string, number> =
    data?.reactions?.reduce((acc, reaction) => {
      acc[reaction.emoji] = (acc[reaction.emoji] || 0) + 1;
      return acc;
    }, {} as Record<string, number>) || {};

  const top5Reactions: string[] = Object.entries(groupedReactions)
    .sort(([, a], [, b]) => b - a)
    .slice(0, 5)
    .map(([emoji]) => emoji);

  const onEmojiClick = (emojiData: EmojiClickData, event: MouseEvent) => {
    const clickedEmoji = emojiData.emoji;
    handleEmojiClick(clickedEmoji);
  };

  const userReaction: Reaction | undefined = user.data?.user_id ? data?.reactions?.find((r) => r.user === user.data?.user_id.toString()) : undefined;

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
    const userReaction = user.data?.user_id ? data?.reactions?.find((r) => r.user === user.data?.user_id) : undefined;

    if (userReaction) {
      console.log(editEmoji(userReaction.reaction_id, clickedEmoji, data.id, user.data?.user_id));
    } else {
      addReaction(clickedEmoji, data.id, user.data?.user_id);
    }

    setOpenEmojiList(false);
  };

  const editEmoji = (reaction_id: string, emoji: string, news_id: number, user_id: any) => {
    changeReaction(reaction_id, emoji, news_id, user_id);
  };

  const deleteEmoji = (reaction_id: string) => {
    deleteReaction(reaction_id);
  };

  return (
    <div>
      <TopContainer bgColor={palette.muted}>
        <Container maxWidth='lg' sx={{ px: { xs: 3, md: 5 } }}>
          <Typography sx={{ py: 1, wordWrap: 'break-word', fontSize: (theme) => ({ xs: '2.3rem', lg: theme.typography.h1.fontSize }) }} variant='h1'>
            {data.title}
          </Typography>
          <Typography gutterBottom variant='h3'>
            {data.header}
          </Typography>
        </Container>
      </TopContainer>
      <Container maxWidth='lg' sx={{ mt: { xs: -13, lg: -18 } }}>
        <Stack gap={1}>
          <AspectRatioImg alt={data.image_alt || data.title} borderRadius src={data.image} />
          {!preview && (
            <HavePermission apps={[PermissionApp.NEWS]}>
              <Button component={Link} fullWidth to={`${URLS.newsAdmin}${data.id}/`} variant='outlined'>
                Endre nyhet
              </Button>
            </HavePermission>
          )}
          <Stack direction='row' justifyContent='space-between' alignItems='center'>
            <Typography variant='body2'>
              Publisert: {formatDate(parseISO(data.created_at), { time: false })}
              {data.creator && (
                <>
                  <br />
                  Forfatter:{' '}
                  <Link to={`${URLS.profile}${data.creator.user_id}/`}>
                    {data.creator.first_name} {data.creator.last_name}
                  </Link>
                </>
              )}
            </Typography>

          </Stack>
          {showEmojiPaper && (
            <Stack sx={{ maxWidth: '1000px', marginLeft: 'auto', display: 'flex', flexDirection: 'row-reverse' }}>
              <Stack direction="row" spacing={1}>
              {data?.emojis_allowed && (
                <>
                  <Button 
                    onClick={() => {
                      handleOpenEmojiList();
                    }} 
                    ref={anchorRef}
                  >
                    +
                  </Button>
                  <Button 
                    onClick={() => {
                      handleOpenAllReactions();
                    }}
                  >
                    Se mer
                  </Button>
                </>
              )}
            </Stack>
              <EmojiPaper>
                {top5Reactions.map((emoji, index) => {
                  const userReactionWithThisEmoji = user.data?.user_id
                    ? data?.reactions?.find((r) => r.user === user.data?.user_id && r.emoji === emoji)
                    : undefined;
                  return (
                    <span
                      key={index}
                      onClick={() => {
                        if (userReactionWithThisEmoji) {
                          if (emoji === userReactedEmoji) {
                            deleteEmoji(userReactionWithThisEmoji.reaction_id);
                          } else {
                            editEmoji(userReactionWithThisEmoji.reaction_id, emoji, data.id, user.data?.user_id);
                          }
                        } else {
                          handleEmojiClick(emoji);
                        }
                      }}
                      style={{
                        cursor: 'pointer',
                        backgroundColor: emoji === userReactedEmoji ? 'grey' : 'transparent',
                        boxShadow: emoji === userReactedEmoji ? '0px 2px 5px rgba(0, 0, 0, 0.1)' : 'none',
                        padding: '5px',
                        borderRadius: '4px',
                        marginRight: '5px',
                      }}>
                      {emoji} ({groupedReactions[emoji]})
                    </span>
                  );
                })}
              </EmojiPaper>
            </Stack>
          )}
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
              style: popoverMode === 'EMOJI_LIST'
                ? {
                  width: 'auto',
                  maxHeight: 'auto',
                  overflowY: 'auto',
                }
                : {},
            }}
            transformOrigin={{
              vertical: 'bottom',
              horizontal: 'center',
            }}
          >
            <Grid container spacing={1}>
              {popoverMode === 'EMOJI_LIST' && <EmojiPicker onEmojiClick={onEmojiClick} />}
              {popoverMode === 'ALL_REACTIONS' && 
                data?.reactions?.map((reaction, index) => (
                  <Grid
                    item
                    key={index}
                    onClick={(event) => {
                      event.stopPropagation();
                      const userReactionWithThisEmoji = user.data?.user_id
                        ? data?.reactions?.find((r) => r.user === user.data?.user_id && r.emoji === reaction.emoji)
                        : undefined;
                      if (userReactionWithThisEmoji) {
                        if (reaction.emoji === userReactedEmoji) {
                          deleteEmoji(userReactionWithThisEmoji.reaction_id);
                        } else {
                          editEmoji(userReactionWithThisEmoji.reaction_id, reaction.emoji, data.id, user.data?.user_id);
                        }
                      } else {
                        handleEmojiClick(reaction.emoji);
                      }
                    }}
                    xs={2}
                  >
                    {reaction.emoji}
                  </Grid>
                ))
              }
            </Grid>
          </Popover>
          <Paper>
            <MarkdownRenderer value={data.body} />
          </Paper>
        </Stack>
        <Stack alignItems='flex-end' sx={{ marginTop: 2 }}>
          <ShareButton shareId={data.id} shareType='news' title={data.title} />
        </Stack>
      </Container>
    </div>
  );
};  

export default NewsRenderer;

export const NewsRendererLoading = () => (
  <div>
    <TopContainer>
      <Container maxWidth='lg' sx={{ px: { xs: 3, md: 5 } }}>
        <Skeleton height={80} width='60%' />
        <Skeleton height={40} width={250} />
      </Container>
    </TopContainer>
    <Container maxWidth='lg' sx={{ mt: { xs: -13, lg: -18 } }}>
      <Stack gap={1}>
        <AspectRatioLoading borderRadius />
        <Skeleton height={40} width={250} />
        <Paper>
          <Skeleton width='80%' />
          <Skeleton width='85%' />
          <Skeleton width='75%' />
          <Skeleton width='90%' />
        </Paper>
      </Stack>
    </Container>
  </div>
);
