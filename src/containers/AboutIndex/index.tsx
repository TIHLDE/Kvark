import { makeStyles } from '@material-ui/core/styles';
import Grid from '@material-ui/core/Grid';
import Banner from 'components/layout/Banner';
import Navigation from 'components/navigation/Navigation';
import React from 'react';
import Helmet from 'react-helmet';
import ErrorCard from 'containers/AboutIndex/components/ErrorCard';
import WorkDoneCard from 'containers/AboutIndex/components/WorkDoneCard';
import MembersCard from 'containers/AboutIndex/components/MembersCard';
import { Theme } from '@material-ui/core/styles/createMuiTheme';
const useStyles = makeStyles((theme: Theme) => ({
  root: {
    marginBottom: theme.spacing(2),
  },
}));

const AboutIndex = () => {
  const classes = useStyles();
  // TODO:
  // Get this information from API
  const members = [
    'Eirik Steira',
    'Olaf Rosendahl',
    'Zaim Imran',
    'Mads Lundegaard',
    'Svein Jakob Høie',
    'Omer Jonuzi',
    'Tobias Rødahl Thingnes',
    'Max Torre Schau',
    'Hermann Owren Elton',
    'Henriette Brekke Sunde',
    'Minh Dan Nguyen',
    'Norbert Gørke',
  ];
  return (
    <Navigation banner={<Banner title='Om Index' />} fancyNavbar>
      <Helmet>
        <title>Om Index - TIHLDE</title>
      </Helmet>
      <div className={classes.root}>
        <Grid container spacing={2}>
          <Grid item xs={12}>
            <WorkDoneCard changelogURL={'https://raw.githubusercontent.com/tihlde/Kvark/dev/CHANGELOG.md'} title={'Hva har vi gjort i frontend?'} />
          </Grid>
          <Grid item xs={12}>
            <WorkDoneCard changelogURL={'https://raw.githubusercontent.com/tihlde/Lepton/dev/CHANGELOG.md'} title={'Hva har vi gjort i backend?'} />
          </Grid>
          <Grid item md={6} xs={12}>
            <ErrorCard />
          </Grid>
          <Grid item md={6} xs={12}>
            <MembersCard members={members} />
          </Grid>
        </Grid>
      </div>
    </Navigation>
  );
};

export default AboutIndex;
