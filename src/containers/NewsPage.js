import React, {Component} from 'react';
import {withStyles} from '@material-ui/core/styles';
import PropTypes from 'prop-types';

// Material UI Components
import Grid from '@material-ui/core/Grid';
import Paper from '@material-ui/core/Paper';
import Typography from '@material-ui/core/Typography';
import Avatar from '@material-ui/core/Avatar';

// Project components
import Navigation from '../components/Navigation';

const styles = {
    root: {
        margin: 'auto',
        width: '100%',
        maxWidth: '1200px',
        backgroundColor: '#ebebe',
        overflow: 'hidden',
    },
    image: {
        maxHeight: '700px',
        width: 'auto',
    },
    contentWrapper: {
        position: 'relative',
    },
    content: {
        height: 'auto',
        width: '100%',

        display: 'grid',
        gridTemplateRows: '1fr auto',

        marginBottom: 30,
    },
    newsContent: {
        backgroundColor: 'white',
        padding: 20,
    },
    description: {
        backgroundColor: 'whitesmoke',
        padding: 10,
        width: '100%',
        margin: 'auto',

        '@media only screen and (max-width: 700px)': {
            margin: 0,
        }
    },
    contentText: {
        fontSize: '0.55em',
    },
    avatar: {
        borderRadius: 0,
        width: '50px',
        height: '50px',
    }
};

class NewsPage extends Component {

    constructor() {
        super();
        this.state = {
            title: 'It does not even matter',
            author: 'Anders Iversen',
            timeLastUpdated: '12.03.18',
            image: 'https://gfx.nrk.no/f_5R0FmVa8KNRkE3q32KpQ5uMIQ0Vc7J4JzIrrSynCZA',

            contentText: '',
        }
    }

    render() {
        const {classes} = this.props;

        return (
            <Navigation>
                <Grid className={classes.root} container direction='column' wrap='nowrap'>
                    <img className={classes.image} src={this.state.image} alt='news'/>
                    <div className={classes.contentWrapper}>
                        <Paper className={classes.content} elevation={0}>
                            <div className={classes.description}>
                                <Grid container direction='row' wrap='nowrap' spacing={16}>
                                    <Avatar className={classes.avatar}>W</Avatar>
                                    <Grid item container direction='column' wrap='norwrap' justify='flex-end'>
                                        <Typography variant='caption'>Skrevet av: {this.state.author}</Typography>
                                        <Typography variant='caption'>Sist oppdatert: {this.state.timeLastUpdated}</Typography>
                                    </Grid>
                                </Grid>    
                            </div>
                            <div className={classes.newsContent}>
                                <h2>{this.state.title}</h2>
                                <p className={classes.contentText}>
                                    The standard Lorem Ipsum passage, used since the 1500s
                                    "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum."
                                    <br/><br/>
                                    Section 1.10.32 of "de Finibus Bonorum et Malorum", written by Cicero in 45 BC
                                    "Sed ut perspiciatis unde omnis iste natus error sit voluptatem accusantium doloremque laudantium, totam rem aperiam, eaque ipsa quae ab illo inventore veritatis et quasi architecto beatae vitae dicta sunt explicabo. Nemo enim ipsam voluptatem quia voluptas sit aspernatur aut odit aut fugit, sed quia consequuntur magni dolores eos qui ratione voluptatem sequi nesciunt. Neque porro quisquam est, qui dolorem ipsum quia dolor sit amet, consectetur, adipisci velit, sed quia non numquam eius modi tempora incidunt ut labore et dolore magnam aliquam quaerat voluptatem. Ut enim ad minima veniam, quis nostrum exercitationem ullam corporis suscipit laboriosam, nisi ut aliquid ex ea commodi consequatur? Quis autem vel eum iure reprehenderit qui in ea voluptate velit esse quam nihil molestiae consequatur, vel illum qui dolorem eum fugiat quo voluptas nulla pariatur?"
                                </p>
                            </div>
                        </Paper>
                    </div>
                </Grid>
            </Navigation>
        );
    }
}

NewsPage.propTypes = {
    classes: PropTypes.object,
};


export default withStyles(styles)(NewsPage);