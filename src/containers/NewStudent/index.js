import React, {useEffect} from 'react';
import {withStyles} from '@material-ui/core/styles';
import parser from 'html-react-parser';

// Material UI Components
import Divider from '@material-ui/core/Divider';

// Project Components
import Navigation from '../../components/navigation/Navigation';
import InfoCard from '../../components/layout/InfoCard';
import Banner from '../../components/layout/Banner';

import Text from '../../text/NewStudentText';
import Expansion from '../../components/layout/Expand';
import PropTypes from 'prop-types';
import Button from '@material-ui/core/Button';
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
});

function NewStudent(props) {
  const {classes} = props;

  useEffect(() => window.scrollTo(0, 0), []);

  return (
    <Navigation footer whitesmoke fancyNavbar>
      <Banner
        title={Text.banner.header}
        text={Text.banner.subHeader}
      />
      <div className={classes.root}>
        <div className={classes.content}>
          <InfoCard header={Text.fadder.headline} text={Text.fadder.text} imageClass={classes.image} src={TihldeImg} classes={{children: classes.flex}} justifyText>
            <Button className={classes.bottomSpacing} variant='contained' color='primary' href='https://drive.google.com/file/d/1iHSVglQSDBH-qIxRv3w8OnC8vDR7NQTd/view?usp=sharing'> Trykk her for info om fadderuka </Button>
          </InfoCard>
          <InfoCard className={classes.infocard} header={Text.faq.header}>
            {Object.values(Text.faq.content).map((value, index) => (
              <div key={index} >
                <Expansion header={value['header']} text={value['text']} flat />
                <Divider />
              </div>
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
