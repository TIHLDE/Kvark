import React, { Component } from 'react';
import { withStyles } from '@material-ui/core/styles';

// Material UI Components
import Divider from '@material-ui/core/Divider';

// Project Components
import Navigation from '../../components/navigation/Navigation';
import InfoCard from '../../components/layout/InfoCard';
import Banner from '../../components/layout/Banner';

import Text from '../../text/NewStudentText';
import Expansion from '../../components/layout/Expand';
import PropTypes from 'prop-types';


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
    banner: {
        marginTop: 20,
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
    infocard: {
        '@media only screen and (max-width: 600px)': {
            padding: 28,
        }
    }
});


class NewStudent extends Component {


    componentDidMount() {
        window.scrollTo(0, 0);
    }

    render() {
        const { classes } = this.props;
        return (
            <Navigation footer whitesmoke>
                <div className={classes.root}>
                    <Banner
                        className={classes.banner}
                        h6={Text.banner.header}
                        text={Text.banner.subHeader}
                        image={Text.banner.imageUrl}
                    />
                    <div className={classes.content}>
                        <InfoCard className={classes.infocard} header={Text.faq.header} text={Text.faq.subheader}>
                        {
                            Object.values(Text.faq.content).map((value, index) => (
                                <div key={index} >
                                    <Expansion header={value['header']} text={value['text']} flat />
                                    <Divider />
                                </div>
                            ))
                        }
                        </InfoCard>
                    </div>
                </div>
            </Navigation>
        )
    }
}

NewStudent.propTypes = {
    classes: PropTypes.object,
};



export default withStyles(styles)(NewStudent);
