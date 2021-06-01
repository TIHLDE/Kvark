import Typography from '@material-ui/core/Typography';
import Box from '@material-ui/core/Box';
import Grid from '@material-ui/core/Grid';
import { makeStyles } from '@material-ui/styles';
import { Theme } from '@material-ui/core';
import MailOutlineIcon from '@material-ui/icons/MailOutline';
import Paper from 'components/layout/Paper';
import ContactMailIcon from '@material-ui/icons/ContactMail';

const useStyles = makeStyles((theme: Theme) => ({
  wrapIcon: {
    verticalAlign: 'middle',
    display: 'inline-flex',
  },
  icons: {
    marginRight: theme.spacing(1),
  },
}));
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
        <Grid item xs={12}>
          <Box alignItems='center' display='flex' flexWrap='wrap'>
            <ContactMailIcon className={classes.icons} />
            <a className={classes.wrapIcon} href='https://tihlde.slack.com/archives/C01CJ0EQCFM' rel='noopener noreferrer' target='_blank'>
              Kontakt oss på Slack
            </a>
          </Box>
        </Grid>
        <Grid item xs={12}>
          <Box alignItems='center' display='flex' flexWrap='wrap'>
            <MailOutlineIcon className={classes.icons} />
            <a href='mailto:index@tihlde.org' rel='noopener noreferrer' target='_blank'>
              Kontakt oss på Mail
            </a>
          </Box>
        </Grid>
      </Grid>
    </Paper>
  );
};

export default ErrorCard;
