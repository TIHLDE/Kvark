import { Typography, styled } from '@material-ui/core';
import Paper from 'components/layout/Paper';
import MarkdownRenderer from 'components/miscellaneous/MarkdownRenderer';
const LATEST_VERION_INDEX = 3;
const MARKDOWN_HEADER_DELIMITER = /(?=\n##\s *)/g;
import { useQuery } from 'react-query';

const ChangelogList = styled('div')({
  '& ul': {
    listStyleType: 'none',
  },
});

export type WorkDoneCardProps = {
  changelogURL: string;
  title: string;
};
const Changelog = ({ title, changelogURL }: WorkDoneCardProps) => {
  const { data } = useQuery(['changelog', changelogURL], () =>
    fetch(changelogURL)
      .then((res) => res.text())
      .then((text) => {
        const markdownSections = text.split(MARKDOWN_HEADER_DELIMITER);
        return markdownSections[LATEST_VERION_INDEX];
      }),
  );
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

export default Changelog;
