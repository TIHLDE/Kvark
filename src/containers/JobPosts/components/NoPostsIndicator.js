import React, { Component } from 'react';
import {withStyles} from '@material-ui/core/styles';

// Material UI Components

// Text
import Text from '../../../text/JobPostText';

// Icons
import NoDataIcon from '../../../assets/icons/nodata.svg';

// Project Components
import MessageIndicator from '../../../components/layout/MessageIndicator';

const styles = {
    root: {
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        padding: 20,
    },
    imageWrapper: {
        maxWidth: 125,
        maxHeight: 125,
        width: 125,
        height: 125,
        overflow: 'hidden',
        marginBottom: 20,
    },
    image: {
        objectFit: 'cover',
        width: '100%',
        height: '100%',
    }
}

class NoPostsIndicator extends Component {

    render() {
        const {classes} = this.props;
        return (
            <div className={classes.root}>
                <div class={classes.imageWrapper}>
                    <img className={classes.image} src={NoDataIcon} alt='Ingen arrangementer' />
                </div>
                <MessageIndicator header={Text.noJobPost} subheader={Text.subNoPosts}/>
            </div>
        );
    }
}

export default withStyles(styles)(NoPostsIndicator);