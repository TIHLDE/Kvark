import { Typography, styled } from '@mui/material';
import Expand from 'components/layout/Expand';
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

const getReleaseAsStringArray = async (changelogURL: string) => {
  const res = await fetch(changelogURL);
  const text = await res.text();
  return text.split(MARKDOWN_HEADER_DELIMITER);
};

const paragraphToArray = (changelog: string) => changelog.split('\n').filter((text) => text.trim() !== '');

const getReleaseTitle = (changelog: string) => paragraphToArray(changelog)[0].substring(3);

const getReleaseBody = (changelog: string) => paragraphToArray(changelog).slice(1).join('\n');

const ChangelogCard = ({ title, changelogURL }: WorkDoneCardProps) => {
  const { data = [] } = useQuery(['changelog', changelogURL], () => getReleaseAsStringArray(changelogURL));
  return (
    <Paper>
      <Typography gutterBottom variant='h2'>
        {title}
      </Typography>
      <ChangelogList>
        <MarkdownRenderer value={data[LATEST_VERSION_INDEX]} />
        <Expand flat header='Tidligere endringer'>
          {data.slice(LATEST_VERSION_INDEX + 1).map((field, i) => (
            <Expand flat header={getReleaseTitle(field)} key={i}>
              <MarkdownRenderer value={getReleaseBody(field)} />
            </Expand>
          ))}
        </Expand>
      </ChangelogList>
    </Paper>
  );
};

export default ChangelogCard;
