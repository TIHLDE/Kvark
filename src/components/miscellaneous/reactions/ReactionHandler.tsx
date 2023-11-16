import { Stack, styled } from '@mui/material';

import { News } from 'types';

import Paper from 'components/layout/Paper';

import { EmojiPickerHandler } from './EmojiPickHandler';
import { EmojiShowAll } from './EmojiShowAll';
import { EmojiShowcase } from './EmojiShowcase';

const EmojiPaper = styled(Paper)(({ theme }) => ({
  padding: '4px',
  borderRadius: '8px',
  backgroundColor: theme.palette.background.paper,
}));

export type ReactionHandlerProps = {
  data: News;
};

export const ReactionHandler = ({ data }: ReactionHandlerProps) => {
  return (
    <Stack alignItems='center' direction='row' spacing={1}>
      {data.reactions?.length ? (
        <EmojiPaper>
          <EmojiShowcase data={data} />
        </EmojiPaper>
      ) : null}
      <EmojiPickerHandler data={data} />
      <EmojiShowAll data={data} />
    </Stack>
  );
};
