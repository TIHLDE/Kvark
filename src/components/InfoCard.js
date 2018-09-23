import React, {Fragment} from 'react';
import {withStyles} from '@material-ui/core/styles';
import PropTypes from 'prop-types';
import Parser from 'html-react-parser';
import classNames from 'classnames';

// Material UI Components
import Paper from '@material-ui/core/Paper';
import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';

// Icons

const styles = {
    root: {
        padding: 40,
        '@media only screen and (max-width: 950px)': {
            margin: '0 5px',
        },
    },
    wrapper: {
        display: 'flex',
        flexDirection: 'row',
        alignItems: 'center',
        height: '100%',
        '@media only screen and (max-width: 1100px)': {
            flexDirection: 'column',
        },
    },
    image: {
        maxWidth: 160,
        maxHeight: 160,
    },
    margin: {
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        marginRight: 30,

        '@media only screen and (max-width: 1100px)': {
            margin: '0 30px 30px 30px',
        },
    },
    padding: {
        padding: '10px 0px',
    },
    cover: {
        height: '100%',
    },
    header: {
        marginBottom: 10,
    },
    grow: {
        flexGrow: 1,
    },
    children: {},
};

const InfoCard = (props) => {
    let {classes} = props;

    return (
        <Paper className={classNames(classes.root, props.className)} square elevation={1}>
            <div className={classes.wrapper}>
                {(!props.src)? null :
                    <div className={classes.margin}>
                        <img className={classes.image} src={props.src} alt={props.alt}/>
                    </div>
                }
                <Grid className={(props.justifyText)? classes.cover : ''} container direction='column' nowrap='nowrap' justify='flex-start'>
                    <Typography className={classes.header} variant='title'><strong>{props.header}</strong></Typography>
                    <Typography variant='body2' component='p'>{Parser(props.text)}</Typography>

                    {(!props.subText)? null :
                        <Fragment>
                            <Typography className={classes.padding} variant='subheading'><strong>{props.subheader}</strong></Typography>
                            <Typography variant='body2' component='p'>{Parser(props.subText)}</Typography>
                        </Fragment>
                    }
                    
                    {props.children && (
                        <div className={classNames(classes.grow, classes.padding, props.classes.children)}>
                            {props.children}
                        </div>
                    )}
                </Grid>
            </div>
        </Paper>
    );
};

InfoCard.propTypes = {
    classes: PropTypes.object,
    header: PropTypes.string,
    text: PropTypes.string,
    src: PropTypes.any,
    alt: PropTypes.string,
    justifyText: PropTypes.bool,
    subheader: PropTypes.string,
    subText: PropTypes.string,
    className: PropTypes.string,

    children: PropTypes.node,
};

export default withStyles(styles)(InfoCard);
