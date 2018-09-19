import React, {Component} from 'react';
import {withStyles} from '@material-ui/core/styles';
import classNames from "classnames";
import PropTypes from 'prop-types';


import Divider from '@material-ui/core/Divider';
import Typography from '@material-ui/core/Typography';

const styles = {
    root: {
        width: 'auto',
        height: 'auto',
    },
    wrapper:{
        margin:'auto',
        display: 'flex',
        flexDirection:'row',
        justifyContent:'center',
        alignItems:'center'
    },
    left:{
        textAlign: 'right',
        marginRight:'10px'

    },
    right: {
        textAlign: 'left',
        paddingLeft: '10px',

        borderStyle: 'none none none solid',
        borderColor: 'gray',
        borderWidth: '1px',
    }
};



class Information extends Component{
    constructor(){
        super();
    }
    render(){
        const { classes, data } = this.props;

        return (
            <div className={classNames(classes.root, this.props.className)}>
                <div className={classes.wrapper}>
                    <div className={classes.left}>
                        <Typography variant='title'>Dato: </Typography>
                        <Typography variant='title'>Tid: </Typography>
                        <Typography variant='title'>Sted: </Typography>
                        <Typography variant='title'>Pris: </Typography>
                    </div>
                    <div className={classes.right}>
                        <Typography variant='title'>{data.start} </Typography>
                        <Typography  variant='title'>{data.time} </Typography>
                        <Typography variant='title'>{data.location} </Typography>
                        <Typography variant='title'>{data.price} </Typography>
                    </div>
                </div>
            </div>
        );
    }
}

Information.propTypes = {
    classes: PropTypes.object.isRequired,
    data: PropTypes.object.isRequired,
};

export default withStyles(styles)(Information);
