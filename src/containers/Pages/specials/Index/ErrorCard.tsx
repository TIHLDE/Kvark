import Typography from '@material-ui/core/Typography';
import Box from '@material-ui/core/Box';
import Grid from '@material-ui/core/Grid';
import { makeStyles } from '@material-ui/styles';
import { Theme } from '@material-ui/core';
import MailOutlineIcon from '@material-ui/icons/MailOutline';
import Paper from 'components/layout/Paper';
import ContactMailIcon from '@material-ui/icons/ContactMail';
import GithubIcon from '@material-ui/icons/CodeRounded';

const useStyles = makeStyles((theme: Theme) => ({
  wrapIcon: {
    verticalAlign: 'middle',
    display: 'inline-flex',
  },
  icons: {
    marginRight: theme.spacing(1),
  },
}));

const LINKS = [
  { link: 'https://tihlde.slack.com/archives/C01CJ0EQCFM', label: 'Kontakt oss på Slack', icon: ContactMailIcon },
  { link: 'mailto:index@tihlde.org', label: 'Kontakt oss med epost', icon: MailOutlineIcon },
  { link: 'https://github.com/TIHLDE/Kvark/issues/new', label: 'Lag et issue i Github', icon: GithubIcon },
];

const ErrorCard = () => {
  const classes = useStyles();
  return (
    <Paper>
      <Grid container spacing={2}>
        <Grid item xs={12}>
          <Box alignItems='center' display='flex' flexWrap='wrap'>
            <Typography variant='h2'>Feil på siden?</Typography>
          </Box>
        </Grid>
        {LINKS.map((link, index) => (
          <Grid item key={index} xs={12}>
            <Box alignItems='center' display='flex' flexWrap='wrap'>
              <link.icon className={classes.icons} />
              <a href={link.link} rel='noopener noreferrer' target='_blank'>
                {link.label}
              </a>
            </Box>
          </Grid>
        ))}
      </Grid>
    </Paper>
  );
};

export default ErrorCard;
