import React from 'react';
import PropTypes from 'prop-types';
import Helmet from 'react-helmet';

// Material UI Components
import { withStyles } from '@material-ui/core/styles';
import Divider from '@material-ui/core/Divider';

// Icons
import GavelIcon from '@material-ui/icons/Gavel';
import AccountBalanceIcon from '@material-ui/icons/AccountBalance';
import ListAltIcon from '@material-ui/icons/ListAlt';

// Project Components
import Navigation from '../../components/navigation/Navigation';
import Banner from '../../components/layout/Banner';
import Icons from './components/Icons';
import LinkButton from '../../components/navigation/LinkButton';
import Paper from '../../components/layout/Paper';

const styles = (theme) => ({
  root: {
    maxWidth: 1200,
    margin: 'auto',
    padding: 12,
    paddingTop: 20,
  },
  wrapper: {
    paddingTop: 10,
    paddingBottom: 30,
    display: 'grid',
    gridTemplateColumns: '1fr',
    gridTemplateRows: 'auto',
    margin: 'auto',
    gridGap: 15,
    justifyContent: 'center',
    '@media only screen and (max-width: 1200px)': {
      paddingLeft: 6,
      paddingRight: 6,
    },
  },
  container: {
    overflow: 'hidden',
  },
  content: {
    display: 'grid',
    gridTemplateColumns: '1fr 1fr',
    backgroundColor: theme.palette.colors.border.main,
    gridGap: 1,
    '@media only screen and (max-width: 860px)': {
      gridTemplateColumns: '1fr',
    },
  },
  icons: {
    display: 'grid',
    gridTemplateColumns: '1fr 1fr 1fr',
    backgroundColor: theme.palette.colors.border.main,
    gridGap: 1,
    '@media only screen and (max-width: 860px)': {
      gridTemplateColumns: '1fr',
    },
  },
});

function Laws(props) {
  const { classes } = props;

  return (
    <Navigation fancyNavbar footer whitesmoke>
      <Helmet>
        <title>Lover og regler - TIHLDE</title>
      </Helmet>
      <Banner title='Lover og regler' />
      <div className={classes.root}>
        <div className={classes.wrapper}>
          <Paper className={classes.container} noPadding>
            <div className={classes.icons}>
              <Icons
                data={{
                  title: 'Lover for TIHLDE',
                  alt: 'Lover for TIHLDE',
                }}
                icon={GavelIcon}
                to={'https://old.tihlde.org/assets/2019/03/TIHLDEs_Lover.pdf'}
              />
              <Icons
                data={{
                  title: 'Styreinstruks for hovedstyret',
                  alt: 'Styreinstruks for hovedstyret',
                }}
                icon={AccountBalanceIcon}
                to={'https://old.tihlde.org/assets/2019/02/Vedlegg-02.pdf'}
              />
              <Icons
                data={{
                  title: 'Undergruppeinstrukser',
                  alt: 'Undergruppeinstrukser',
                }}
                icon={AccountBalanceIcon}
                to={'https://old.tihlde.org/assets/2019/02/Vedlegg-03.pdf'}
              />
            </div>
            <Divider />
            <div className={classes.content}>
              <LinkButton icon={ListAltIcon} noPadding textLeft to='https://old.tihlde.org/assets/2019/02/Vedlegg-04.pdf'>
                Regler og instrukser for Sosialen
              </LinkButton>
              <LinkButton icon={ListAltIcon} noPadding textLeft to='https://old.tihlde.org/assets/2019/02/Vedlegg-05.pdf'>
                Regler og instrukser for Næringsliv og kurs
              </LinkButton>
              <LinkButton icon={ListAltIcon} noPadding textLeft to='https://old.tihlde.org/assets/2019/02/Vedlegg-06.pdf'>
                Regler og instrukser for Drift
              </LinkButton>
              <LinkButton icon={ListAltIcon} noPadding textLeft to='https://old.tihlde.org/assets/2019/02/Vedlegg-07.pdf'>
                Regler og instrukser for Promo
              </LinkButton>
              <LinkButton icon={ListAltIcon} noPadding textLeft to='https://old.tihlde.org/assets/2019/02/Vedlegg-08.pdf'>
                Regler og instrukser for De Eldstes Raad
              </LinkButton>
              <LinkButton icon={ListAltIcon} noPadding textLeft to='https://old.tihlde.org/assets/2019/02/Vedlegg-09.pdf'>
                Regler og instrukser for TIHLDE-kontoret
              </LinkButton>
            </div>
          </Paper>
        </div>
      </div>
    </Navigation>
  );
}

Laws.propTypes = {
  classes: PropTypes.object,
};

export default withStyles(styles)(Laws);
