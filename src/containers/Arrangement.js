import React, {Component, Fragment} from 'react';
import {withStyles} from '@material-ui/core/styles';
import PropTypes from 'prop-types';

// Project components
import Navigation from '../components/Navigation';
import Paragraph from '../components/Paragraph';
import Poster from '../components/Poster';
import EventList from '../components/EventList';
import GridItem from '../components/Grid/GridItem';

import {Grid} from '@material-ui/core/';

{/* I you can manage grids, can you please do this in this part of the website. and if you want to change an item or two, just do it.

plus if you want to see what i have done so far, just place this <Arrangement/> in Landings.

I am far from finished

*/}

const styles = {
    root:{
        height:1000,
        width:'100%',
        flexGrow:1
    },
    paragraph:{

    },
    eventlist:{
        width:450,
        top:100
    }

};

class Arrangement extends Component {
    constructor(props){
        super(props);

        this.state={
            id: props.id,

            data_poster:{
                image: 'http://paperlief.com/images/abstract-art-black-and-white-faces-wallpaper-2.jpg',
                header: 'Hello World',
                subheader: 'This is the best arrangement in the world!!'
            },
            data_Paragraph:{
                text:'k aølskjdf kaølskj alsdkfj lajsdkløsdjfioajiognaoisndfij iajsdfkljaøksdjflkj øakfjaøiwjefølksd aølskjdf kaølskj alsdkfj lajsdkløsdjfioajiognaoisndfij iajsdfkljaøksdjflkj øakfjaøiwjefølksd aølskjdf kaølskj alsdkfj lajsdkløsdjfioajiognaoisndfij iajsdfkljaøksdjflkj øakfjaøiwjefølksd aølskjdf kaølskj alsdkfj lajsdkløsdjfioajiognaoisndfij iajsdfkljaøksdjflkj øakfjaøiwjefølksd aølskjdf kaølskj alsdkfj lajsdkløsdjfioajiognaoisndfij iajsdfkljaøksdjflkj øakfjaøiwjefølksd aølskjdf kaølskj alsdkfj lajsdkløsdjfioajiognaoisndfij iajsdfkljaøksdjflkj øakfjaøiwjefølksd aølskjdf kaølskj alsdkfj lajsdkløsdjfioajiognaoisndfij iajsdfkljaøksdjflkj øakfjaøiwjefølksdd',
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
                <Navigation>
                    <Poster data={this.state.data_poster}/>
                    <Grid container className={classes.root} spacing={8} justify='center'>
                    <Grid item className={classes.paragraph}>
                        <Paragraph data={this.state.data_Paragraph}/>
                    </Grid>
                    <Grid item  className={classes.eventlist}>
                        <EventList/>
                    </Grid>
                </Grid>
            </Navigation>

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
