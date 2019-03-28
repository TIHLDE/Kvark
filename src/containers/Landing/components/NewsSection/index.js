import React, { Component } from 'react';
import PropTypes from 'prop-types';
import {withStyles} from '@material-ui/core/styles';

// Material UI Components
import Typography from '@material-ui/core/Typography';
import Paper from '@material-ui/core/Paper';

// Project Components
import NewsItem from './NewsItem';

const styles = {
    root: {
        padding: '84px 12px',
        backgroundColor: '#f3f3f3',

        '@media only screen and (max-width: 800px)': {
            padding: '36px 12px',
        }
    },
    wrapper: {
        maxWidth: 1200,
        margin: 'auto',

        display: 'grid',
        gridTemplateColumns: '1fr 1fr',
        gridGap: '48px',

        '@media only screen and (max-width: 800px)': {
            gridTemplateColumns: '100%',
            gridGap: '28px',
        }
    },
    padding: {
        padding: 24,
    },
    title: {
        maxWidth: 1200,
        margin: 'auto',
        marginBottom: 12,
    }
}


class NewsSection extends Component {

    constructor() {
        super();
        this.state = {
            first: {},
            second: {},
        }
    }

    componentDidMount() {
        this.initializeNews();
    }

    componentDidUpdate(prevProps) {
        if(this.props.data && this.props.data !== prevProps.data) {
            this.initializeNews();
        }
    }

    initializeNews = () => {
        const news = this.props.data || [];
        if(news.length > 0) {
            this.setState({
                first: news[0],
            });
        }
        if(news.length > 1) {
            this.setState({
                second: news[1],
            });
        }
    }

    render() {
        const {classes} = this.props;
        
        return (
            <div className={classes.root}>
                <Typography className={classes.title} gutterBottom variant='headline'>Nyheter</Typography>
                <div className={classes.wrapper}>
                    <Paper className={classes.padding} square elevation={1}>
                        <NewsItem data={this.state.first}/>
                    </Paper>
                    <Paper className={classes.padding} square elevation={1}>
                        <NewsItem data={this.state.second}/>
                    </Paper>
                </div>
            </div>
        );
    }
}

NewsSection.propTypes = {
    data: PropTypes.array.isRequired,
};

NewsSection.defaultProps = {
    data: {
        events: [],
        name: 'Arrangementer',
    },
}

export default withStyles(styles)(NewsSection);