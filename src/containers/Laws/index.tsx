import React from 'react';
import Helmet from 'react-helmet';

// Material UI Components
import { makeStyles, Theme } from '@material-ui/core/styles';
import Button from '@material-ui/core/Button';

// Icons
import GavelIcon from '@material-ui/icons/Gavel';
import AccountBalanceIcon from '@material-ui/icons/AccountBalance';
import ListAltIcon from '@material-ui/icons/ListAlt';

// Project Components
import Navigation from 'components/navigation/Navigation';
import Banner from 'components/layout/Banner';

const useStyles = makeStyles((theme: Theme) => ({
  wrapper: {
    display: 'grid',
    gridTemplateColumns: '1fr',
    gridGap: theme.spacing(1),
  },
  content: {
    display: 'grid',
    gridTemplateColumns: '1fr 1fr',
    gridGap: theme.spacing(1),
    [theme.breakpoints.down('md')]: {
      gridTemplateColumns: '1fr',
    },
  },
  icons: {
    display: 'grid',
    gridTemplateColumns: '1fr 1fr 1fr',
    gridGap: theme.spacing(1),
    [theme.breakpoints.down('md')]: {
      gridTemplateColumns: '1fr',
    },
  },
  button: {
    background: theme.palette.background.paper,
    padding: theme.spacing(2, 3),
  },
  buttonLabel: {
    justifyContent: 'flex-start',
  },
  buttonLabelLarge: {
    justifyContent: 'flex-start',
    flexDirection: 'column',
    fontSize: 20,
    textAlign: 'center',
  },
  largeIcon: {
    fontSize: '100px !important',
  },
}));

function Laws() {
  const classes = useStyles();

  const largeList = [
    { icon: GavelIcon, title: 'Lover for TIHLDE', link: 'https://old.tihlde.org/assets/2019/03/TIHLDEs_Lover.pdf' },
    { icon: AccountBalanceIcon, title: 'Styreinstruks for hovedstyret', link: 'https://old.tihlde.org/assets/2019/02/Vedlegg-02.pdf' },
    { icon: AccountBalanceIcon, title: 'Undergruppeinstrukser', link: 'https://old.tihlde.org/assets/2019/02/Vedlegg-03.pdf' },
  ];

  const smallList = [
    { title: 'Regler og instrukser for Sosialen', link: 'https://old.tihlde.org/assets/2019/02/Vedlegg-04.pdf' },
    { title: 'Regler og instrukser for Næringsliv og kurs', link: 'https://old.tihlde.org/assets/2019/02/Vedlegg-05.pdf' },
    { title: 'Regler og instrukser for Drift', link: 'https://old.tihlde.org/assets/2019/02/Vedlegg-06.pdf' },
    { title: 'Regler og instrukser for Promo', link: 'https://old.tihlde.org/assets/2019/02/Vedlegg-07.pdf' },
    { title: 'Regler og instrukser for De Eldstes Raad', link: 'https://old.tihlde.org/assets/2019/02/Vedlegg-08.pdf' },
    { title: 'Regler og instrukser for TIHLDE-kontoret', link: 'https://old.tihlde.org/assets/2019/02/Vedlegg-09.pdf' },
  ];

  return (
    <Navigation banner={<Banner title='Lover og regler' />} fancyNavbar>
      <Helmet>
        <title>Lover og regler - TIHLDE</title>
      </Helmet>
      <div className={classes.wrapper}>
        <div className={classes.icons}>
          {largeList.map((item, index) => (
            <Button
              classes={{ label: classes.buttonLabelLarge }}
              className={classes.button}
              component='a'
              href={item.link}
              key={index}
              startIcon={<item.icon className={classes.largeIcon} />}
              variant='outlined'>
              {item.title}
            </Button>
          ))}
        </div>
        <div className={classes.content}>
          {smallList.map((item, index) => (
            <Button
              classes={{ label: classes.buttonLabel }}
              className={classes.button}
              component='a'
              href={item.link}
              key={index}
              startIcon={<ListAltIcon />}
              variant='outlined'>
              {item.title}
            </Button>
          ))}
        </div>
      </div>
    </Navigation>
  );
}

export default Laws;
