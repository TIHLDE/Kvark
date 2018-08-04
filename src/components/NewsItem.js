import React, {Component} from 'react';
import {withStyles} from '@material-ui/core/styles';
import {Link} from 'react-router-dom';
import URLS from '../URLS';

// Material UI Components
import Paper from '@material-ui/core/Paper';
import Typography from '@material-ui/core/Typography';


const styles = {
    card: {
        height: '100%',
        maxHeight: 300,
        overflow: 'hidden',
        position: 'relative',
        cursor: 'pointer',
    },
    none: {
        minHeight: 200,
    },
    image: {
        height: 200,
        width: '100%',
        objectFit: 'cover',
    },
    textContainer: {
        position: 'absolute',
        bottom: 0,
        left: 0,
        right: 0,
        minHeight: 60,
        backgroundColor: 'white',
        color: 'black',
        alignItems: 'center',
        padding: '20px 15px 10px 15px',
    },
};

class NewsItem extends Component {

    render() {
        const {classes} = this.props;
        let {data} = this.props;
        data = (data)? data : {};

        let imageOrFallback = null;
        if (data && data.image) {
            imageOrFallback = <img className={classes.image} src={data.image} alt={data.imageAlt}/>;
        } else {
           imageOrFallback = <Typography className={classes.none} variant='title'>Missing Image</Typography>;
        }

        return (
            <Paper className={classes.card} square={true}>
                <Link to={URLS.news + this.props.id}>
                {imageOrFallback}
                <div className={classes.textContainer}>
                    <Typography variant='headline' color='inherit'>{data.title}</Typography>
                    <Typography variant='body2' color='inherit'>(Ikon) Næringsliv og Kurs (Ikon) 12/23-18</Typography>
                </div>
                </Link>
            </Paper>
        );
    }
}

export default withStyles(styles)(NewsItem);
