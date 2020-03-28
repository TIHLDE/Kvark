import React, {useState} from 'react';
import {withStyles} from '@material-ui/core/styles';
import PropTypes from 'prop-types';
import Parser from 'html-react-parser';
import classNames from 'classnames';

// Material UI Components
import { Grid, Typography } from '@material-ui/core';

// Easter Components
import Lightbox from 'react-image-lightbox';
import 'react-image-lightbox/style.css';
import EasterEggImage from '../../assets/img/easter/anders.png';
import ChallengeService from '../../api/services/ChallengeService';
import AuthService from '../../api/services/AuthService';

const styles = {
    root: {
        border: '1px solid #ddd',
        backgroundColor: '#ddd',
        borderRadius: '5px',
        overflow: 'hidden',
    },
    imageContainer: {
        maxHeight: 250,
        position: 'relative',
        display: 'block',
        boxSizing: 'border-box',

        '@media only screen and (max-width: 600px)': {
            maxHeight: 100,
        },
    },
    image: {
        width: '100%',
        height: 'auto',
        minHeight: 250,
        maxHeight: 250,
        objectFit: 'cover',

        '@media only screen and (max-width: 600px)': {
            minHeight: 100,
            maxHeight: 100,
        },
    },
    filter: {
        filter: 'opacity(0.27) sepia(1)',
    },
    content: {
        backgroundColor: 'white',
        padding: 20,
    },
    info: {
        position: 'absolute',
        bottom: 20,
        left: 20,
    },
    title: {
        color: 'rgba(0,0,0,1)',

        fontSize: 54,
        '@media only screen and (max-width: 600px)': {
            fontSize: '2.1em',
        },
    },
    line: {
        height: 4,
        backgroundColor: 'var(--tihlde-blaa)',
        width: 50,
    },
    button: {
        position: 'absolute',
        bottom: 20,
        right: 20,
        '@media only screen and (max-width: 600px)': {
          display: 'none',
        },
    },
    buttonMobile: {
      display: 'none',
      '@media only screen and (max-width: 600px)': {
        display: 'block',
      },
    },
    flex: {
        display: 'flex',
        justifyContent: 'justify-content',
        alignItems: 'center',
    },
};

const Banner = (props) => {
    const {classes, button: ButtonComponent} = props;

    const [easterClicks, setEasterClicks] = useState(0);
    const [easterOpen, setEasterOpen] = useState(false);

    function easter() {
        setEasterClicks(easterClicks + 1);
        if (easterClicks > 3) {
            setEasterOpen(true);
            setEasterClicks(0);
            if (AuthService.isAuthenticated()) {
                ChallengeService.createUserChallenge('9efe12b9-b820-4e7d-9449-00150d058515');
            }
        }
    }

    return (
        <div className={classNames(classes.root, props.className)}>
            <Grid container direction='column' wrap='nowrap'>
                <div className={classes.imageContainer} onClick={() => easter()}>
                    <img className={classNames(classes.image, !props.disableFilter ? classes.filter : '')} src={props.image} alt={props.alt} />
                    {props.title && <div className={classes.info}>
                        <Typography className={classes.title} variant='h3'>
                            <strong>{props.title}</strong>
                        </Typography>
                        <div className={classes.line}/>
                    </div>}
                    {props.button && <div className={classes.button}>
                        <ButtonComponent />
                    </div>}
                </div>
                {(props.header || props.text) &&
                    <div className={classes.content}>
                        <Typography variant='h6' gutterBottom><strong>{props.header}</strong></Typography>
                        <Typography variant='subtitle1'>{props.text && Parser(props.text)}</Typography>
                    </div>
                }
                { props.button &&
                  <div className={classNames(classes.buttonMobile, classes.content)}>
                    <ButtonComponent />
                  </div>
                }
                {props.children}
            </Grid>
            {easterOpen && (
                    <Lightbox
                        enableZoom={false}
                        mainSrc={EasterEggImage}
                        onCloseRequest={() => setEasterOpen(false)}/>
                )}
        </div>
    );
};

Banner.propTypes = {
    className: PropTypes.string,
    title: PropTypes.string,
    header: PropTypes.string,
    classes: PropTypes.object,
    image: PropTypes.string,
    alt: PropTypes.string,
    text: PropTypes.string,
    disableFilter: PropTypes.bool,
    children: PropTypes.node,
    button: PropTypes.oneOfType([
      PropTypes.node,
      PropTypes.func,
    ]),
    onClick: () => {},
};

export default withStyles(styles)(Banner);
