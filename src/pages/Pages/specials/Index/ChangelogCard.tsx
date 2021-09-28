import { Typography, styled } from '@mui/material';
import Paper from 'components/layout/Paper';
import MarkdownRenderer from 'components/miscellaneous/MarkdownRenderer';
import { useQuery } from 'react-query';

const LATEST_VERSION_INDEX = 3;
const MARKDOWN_HEADER_DELIMITER = /(?=\n##\s *)/g;

const ChangelogList = styled('div')({
  '& ul': {
    listStyleType: 'none',
  },
});

export type WorkDoneCardProps = {
  changelogURL: string;
  title: string;
};

async function getReleaseAsString(changelogURL: string, index: number) {
  const res = await fetch(changelogURL);
  const text = await res.text();
  const markdownSections = text.split(MARKDOWN_HEADER_DELIMITER);
  console.log(markdownSections[index]);
  return markdownSections[index];
}

async function GetReleaseAsStringArray(changelogURL: string) {
  const res = await fetch(changelogURL);
  const text = await res.text();
  const markdownSections = text.split(MARKDOWN_HEADER_DELIMITER);
  return markdownSections;
}

async function GetReleaseTitle(changelogURL: string, index: number) {
  const release = await getReleaseAsString(changelogURL, index);
  return release.split('\n')[0].substring(3);
}

const ChangelogCard = ({ title, changelogURL }: WorkDoneCardProps) => {
  const { data } = useQuery(['changelog', changelogURL], () => getReleaseAsString(changelogURL, LATEST_VERSION_INDEX));
  return (
    <Paper>
      <Typography gutterBottom variant='h2'>
        {title}
      </Typography>
      <ChangelogList>
        <MarkdownRenderer value={data || ''} />
      </ChangelogList>
    </Paper>
  );
};

export {ChangelogCard, GetReleaseAsStringArray, GetReleaseTitle};
