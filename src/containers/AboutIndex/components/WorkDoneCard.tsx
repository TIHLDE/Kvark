import { makeStyles } from '@material-ui/core/styles';
import Typography from '@material-ui/core/Typography';
import Paper from 'components/layout/Paper';
import MarkdownRenderer from 'components/miscellaneous/MarkdownRenderer';
const LATEST_VERION_INDEX = 3;
const MARKDOWN_HEADER_DELIMITER = /(?=\n##\s *)/g;
import { useQuery } from 'react-query';

const useStyles = makeStyles((theme) => ({
  list: {
    '& ul': {
      listStyleType: 'none',
      '& li': {
        fontSize: theme.typography.body1.fontSize,
      },
    },
  },
}));

export type WorkDoneCardProps = {
  changelogURL: string;
  title: string;
};
const WorkDoneCard = ({ title, changelogURL }: WorkDoneCardProps) => {
  const classes = useStyles();
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
      <div className={classes.list}>
        <MarkdownRenderer value={data || ''} />
      </div>
    </Paper>
  );
};

export default WorkDoneCard;
