import React, {Component} from 'react';
import {withStyles} from '@material-ui/core/styles';

// Material UI Components
import Paper from '@material-ui/core/Paper';
import CardMedia from '@material-ui/core/CardMedia';
import Typography from '@material-ui/core/Typography';


const styles = {
    card: {
        height: '100%',
        maxHeight: 300,
        overflow: 'hidden',
        position: 'relative',
    },
    none: {
        minHeight: 200,
    },
    image: {
        minHeight: '80%',
        width: '100%',
        marginBottom: 50,
        objectFit: 'fill',
    },
    textContainer: {
        position: 'absolute',
        bottom: 0,
        left: 0,
        right: 0,
        minHeight: 60,
        backgroundColor: '#232F34',
        color: 'white',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        padding: '4 10',
    },
}

class NewsItem extends Component {

    render() {
        const {classes, data} = this.props;

        return (
            <Paper className={classes.card}>
                {(data.image)?
              
                <img className={classes.image} src={data.image} alt='news'/>
               
                :
                    <Typography className={classes.none} variant='title' align='center'>No news provided</Typography>
                }
                <div className={classes.textContainer}>
                    <p variant='subheading' align='center' color='inherit'>{data.title}</p>
                </div>
            </Paper>
        );
    }
}

export default withStyles(styles)(NewsItem);