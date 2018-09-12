import PropTypes from 'prop-types';

import React, {Component} from 'react';

import Paper from '@material-ui/core/Paper';
import Typography from '@material-ui/core/Typography';
import Button from '@material-ui/core/Button';

import {withStyles} from '@material-ui/core/styles';


import Navigation from '../components/Navigation';


const styles = {
    container: {
        padding: '100px',
    },
    grid: {
        display: 'grid',
        gridTemplateRows: 'repeat(2, 1fr)',
        gridTemplateColumns: 'repeat(2, 1fr)',
        gridGap: '20px',
    },
    element: {
        padding: '30px',
    },
    image: {
        width: '300px',
    }
};


class Services extends Component {

    render() {
        const {classes} = this.props;

        return <Navigation>
            <div className={classes.container}>
                <div className={classes.grid}>
                    <Paper className={classes.element}>
                        <Typography variant='title'>Epost</Typography>
                        <img className={classes.image} src='https://gfx.nrk.no/5DjcdZDEC-SrTXfRx4lH_AoCIFQcnVGnutXkI5w7cU6w' />
                        <Typography variant='body1'>Lenge leve fantorangen!!!</Typography>
                        <a href='https://webmail.tihlde.org/'><Button>Klik vis d lik fantorangen</Button></a>
                    </Paper>
                    <Paper className={classes.element}>
                        <Typography variant='title'>Hosting</Typography>
                        <img className={classes.image} src='https://gfx.nrk.no/5DjcdZDEC-SrTXfRx4lH_AoCIFQcnVGnutXkI5w7cU6w' />
                        <Typography variant='body1'>Lenge leve fantorangen!!!</Typography>
                        <a href='https://wiki.tihlde.org/landing/fantorangen'><Button>1 lik = 1 fantorang</Button></a>
                    </Paper>
                    <Paper className={classes.element}>
                        <Typography variant='title'>Virtuelle maskiner</Typography>
                        <img className={classes.image} src='https://gfx.nrk.no/5DjcdZDEC-SrTXfRx4lH_AoCIFQcnVGnutXkI5w7cU6w' />
                        <Typography variant='body1'>Lenge leve fantorangen!!!</Typography>
                    </Paper>
                    <Paper className={classes.element}>
                        <Typography variant='title'>Database</Typography>
                        <img className={classes.image} src='https://gfx.nrk.no/5DjcdZDEC-SrTXfRx4lH_AoCIFQcnVGnutXkI5w7cU6w' />
                        <Typography variant='body1'>Lenge leve fantorangen!!!</Typography>
                    </Paper>
                </div>
            </div>
        </Navigation>;

    }

}

Services.proptypes = {
    classes: PropTypes.Object,
};

export default withStyles(styles)(Services);
