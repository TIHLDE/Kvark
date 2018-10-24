import React, { Component } from 'react';

import { withStyles } from '@material-ui/core/styles';



// Project Components
import Navigation from '../components/Navigation';
import InfoCard from '../components/InfoCard';
import Banner from '../components/Banner';

import Text from '../text/NewStudentText';
import Expansion from '../components/Expand';
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
        gridTemplateColumns: '1fr 1fr',
        gridAutoFlow: 'row',
        gridGap: '15px',
        margin: '20px auto',

        '@media only screen and (max-width: 700px)': {
            gridTemplateColumns: '1fr',
        },
    },

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
                        title={Text.banner.header}
                        text={Text.banner.subHeader}
                        image={Text.banner.imageUrl}
                    />

                    <Expansion header={Text.faq.header} subtext={Text.faq.subheader}>
                        {
                            Object.values(Text.faq.content).map((value, index) => (
                                <Expansion key={index} header={value["header"]} text={value["text"]} flat/>
                            ))
                        }
                    </Expansion>

                    <div className={classes.content}>
                        {
                            Object.values(Text.content).map((value, index) => (
                                <InfoCard key={index} header={value["header"]} text={value["text"]} justifyText/>
                            ))
                        }
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
