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
    paddingBottom: theme.spacing(2),
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
    { icon: GavelIcon, title: 'Lover for TIHLDE', link: 'https://drive.tihlde.org/index.php/s/XHSTzMdNNYkcii7' },
    { icon: AccountBalanceIcon, title: 'Styreinstruks for hovedstyret', link: 'https://drive.tihlde.org/index.php/s/6ofQZDAACYjicAS' },
    { icon: AccountBalanceIcon, title: 'Undergruppeinstrukser', link: 'https://drive.tihlde.org/index.php/s/PFCxsydPixPT7Rk' },
  ];

  const smallList = [
    { title: 'Regler og instrukser for Sosialen', link: 'https://drive.tihlde.org/index.php/s/6reZE8JAiCXDAAG' },
    { title: 'Regler og instrukser for Næringsliv og kurs', link: 'https://drive.tihlde.org/index.php/s/koXWrtzzqmykTFP' },
    { title: 'Regler og instrukser for Drift', link: 'https://drive.tihlde.org/index.php/s/o2aKNFBNzzndnmK' },
    { title: 'Regler og instrukser for Promo', link: 'https://drive.tihlde.org/index.php/s/RFENK6jntf82F4k' },
    { title: 'Regler og instrukser for De Eldstes Raad', link: 'https://drive.tihlde.org/index.php/s/aXn6QF8BrMPkQwr' },
    { title: 'Regler og instrukser for TIHLDE-kontoret', link: 'https://drive.tihlde.org/index.php/s/ZRJHFicjRgCT4BA' },
    { title: 'Regler og instrukser for Index', link: 'https://drive.tihlde.org/index.php/s/noqsxJDaAs5tySG' },
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
