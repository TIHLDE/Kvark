import React, {Component, Fragment} from 'react';
import {withStyles} from '@material-ui/core/styles';
import PropTypes from 'prop-types';

// Project components
import Navigation from '../components/Navigation';
import Paragraph from '../components/Paragraph';
import Poster from '../components/Poster';
import GridContainer from '../components/Grid/GridContainer';
import EventList from '../components/EventList';
import GridItem from '../components/Grid/GridItem';
import Eksamensfest from '../assets/img/Eksamensfest.jpg'

import {Grid} from '@material-ui/core/';

{/* I you can manage grids, can you please do this in this part of the website. and if you want to change an item or object, just do it.

*/}

const styles = {
    root:{
      backgroundColor:'red',
        height:1000,
        width:'100%'
    },
    paragraph:{
        marginLeft:'40%',
        marginTop:10,
        backgroundColor:'blue'
    },
    eventlist:{
        width:450,
        paddingBottom:10,
        backgroundColor:'yellow',
        marginLeft:250
    }

};

class Arrangement extends Component {
    constructor(props){
        super(props);

        this.state={
            id: props.id,

            data_poster:{
                image: Eksamensfest,
                header: 'Hello World',
                subheader: 'This is the best arrangement in the world!!'
            },
            data_Paragraph:{
                text:'klsdjafø jsdklfj aøsdlkjf ølaksjdf øljkaslødjf døflkj aølskjdf kaølskj alsdkfj lajsdkløsdjfioajiognaoisndfij iajsdfkljaøksdjflkj øakfjaøiwjefølksd',
                subheader:'This is a small header for a small person',
                joined:false
            }
        }
    }

    componentDidMount(){
        //get data here
    }

    render() {
        const {classes} = this.props;

        return (
            <Fragment>
                <Navigation/>
                    <Poster data={this.state.data_poster}/>

                <div className={classes.root}>
                    <div className={classes.paragraph}>
                        <Paragraph data={this.state.data_Paragraph}/>
                    </div>
                    <div className={classes.eventlist}>
                        <EventList/>
                    </div>
                </div>

            </Fragment>
        );
    }
}



Arrangement.propTypes = {
    classes: PropTypes.object,
    id: PropTypes.string
};

Arrangement.defaultProps={
    id: "-1"
};




export default withStyles(styles)(Arrangement);
