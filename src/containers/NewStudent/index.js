import React, {useEffect} from 'react';
import {withStyles} from '@material-ui/core/styles';
import parser from 'html-react-parser';
import PropTypes from 'prop-types';
import Helmet from 'react-helmet';

// Material UI Components
import Divider from '@material-ui/core/Divider';
import Typography from '@material-ui/core/Typography';
import Button from '@material-ui/core/Button';

// Project Components
import Navigation from '../../components/navigation/Navigation';
import Paper from '../../components/layout/Paper';
import InfoCard from '../../components/layout/InfoCard';
import Banner from '../../components/layout/Banner';
import Text from '../../text/NewStudentText';
import Expansion from '../../components/layout/Expand';
import TihldeImg from '../../assets/img/tihlde_image.png';

const styles = (theme) => ({
  root: {
    minHeight: '90vh',
    maxWidth: 1200,
    margin: '0 auto',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'stretch',
    paddingBottom: 80,
  },
  content: {
    display: 'grid',
    gridTemplateColumns: '1fr',
    gridAutoFlow: 'row',
    gridGap: '15px',
    margin: '20px auto',
    '@media only screen and (max-width: 700px)': {
      gridTemplateColumns: '1fr',
    },
  },
  bottomContent: {
    marginTop: 50,
    color: theme.colors.text.light,
  },
  infocard: {
    '@media only screen and (max-width: 600px)': {
      padding: 28,
    },
  },
  image: {
    width: 900,
    height: 500,
  },
  subheader: {
    marginTop: 15,
    fontSize: '1.2rem',
  },
});

function NewStudent(props) {
  const {classes} = props;

  useEffect(() => window.scrollTo(0, 0), []);

  return (
    <Navigation footer whitesmoke fancyNavbar>
      <Helmet>
        <title>Ny student - TIHLDE</title>
      </Helmet>
      <Banner
        title={Text.banner.header}
        text={Text.banner.subHeader}
      />
      <div className={classes.root}>
        <div className={classes.content}>
          <InfoCard header={Text.fadder.headline} text={Text.fadder.text} imageClass={classes.image} src={TihldeImg} classes={{children: classes.flex}} justifyText>
            <Button className={classes.bottomSpacing} variant='contained' color='primary' target='_noopener' href='https://drive.google.com/file/d/1Q8kx9p_khg6LbK1HACPAKIfjVwLPeJ2J/view'> Trykk her for info om fadderuka </Button>
          </InfoCard>
          <InfoCard className={classes.infocard} header={Text.faq.header}>
            {Text.faq.categories.map((category, i) => (
              <React.Fragment key={i}>
                <Typography className={classes.subheader} variant='subtitle1'>{category.title}</Typography>
                <Paper noPadding>
                  {category.items.map((item, index) => (
                    <React.Fragment key={index}>
                      <Expansion header={item.header} text={item.text} flat />
                      {index !== category.items.length - 1 && <Divider />}
                    </React.Fragment>
                  ))}
                </Paper>
              </React.Fragment>
            ))}
            <div className={classes.bottomContent}>{parser(Text.faq.subheader)}</div>
          </InfoCard>
        </div>
      </div>
    </Navigation>
  );
}

NewStudent.propTypes = {
  classes: PropTypes.object,
};

export default withStyles(styles)(NewStudent);
