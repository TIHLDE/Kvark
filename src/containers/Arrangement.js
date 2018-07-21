import React, {Component, Fragment} from 'react';
import {withStyles} from '@material-ui/core/styles';
import PropTypes from 'prop-types';

// Project components
import Navigation from '../components/Navigation';
import Paragraph from '../components/Paragraph';
import Poster from '../components/Poster';
import EventList from '../components/EventList';
import Details from '../components/Details'

import {Grid,Button} from '@material-ui/core/';


const styles = {
    root:{
        height:1000,
        width:'100%',
        flexGrow:1,
        backgroundColor:'red'
    },
    eventlist:{
        width:450,
    },
    container:{
        width: 600,
        backgroundColor:'blue'
    },
    hello:{
        marginLeft: 100,
        marginBottom: 300
    }

};

class Arrangement extends Component {
    constructor(props){
        super(props);

        this.state={
            id: 1,

            data_poster:{
                image: 'http://paperlief.com/images/abstract-art-black-and-white-faces-wallpaper-2.jpg',
                header: 'Hello World',
                subheader: 'This is the best arrangement in the world!!'
            },
            data_Paragraph:{
                text:'k aølskjdf kaølskj alsdkfj lajsdkløsdjfioajiognaoisndfij iajsdfkljaøksdjflkj øakfjaøiwjefølksd aølskjdf kaølskj alsdkfj lajsdkløsdjfioajiognaoisndfij iajsdfkljaøksdjflkj øakfjaøiwjefølksd aølskjdf kaølskj alsdkfj lajsdkløsdjfioajiognaoisndfij iajsdfkljaøksdjflkj øakfjaøiwjefølksd aølskjdf kaølskj alsdkfj lajsdkløsdjfioajiognaoisndfij iajsdfkljaøksdjflkj øakfjaøiwjefølksd aølskjdf kaølskj alsdkfj lajsdkløsdjfioajiognaoisndfij iajsdfkljaøksdjflkj øakfjaøiwjefølksd aølskjdf kaølskj alsdkfj lajsdkløsdjfioajiognaoisndfij iajsdfkljaøksdjflkj øakfjaøiwjefølksd aølskjdf kaølskj alsdkfj lajsdkløsdjfioajiognaoisndfij iajsdfkljaøksdjflkj øakfjaøiwjefølksdd',
                subheader:'This is a small header for a small person',
                joined:false,
                waiting:1,
            }
        };

        this.join = this.join.bind(this);
        this.joining =  this.joining.bind(this);
    }

    //TODO: maybe put this in another class instead of having it here
    join = () =>{
        let waitingnr = this.state.data_Paragraph.waiting;
        let joined = this.state.data_Paragraph.joined;

        if(waitingnr  === 0 && joined){
            return (<Button style={{backgroundColor:'lightblue'}} size='large'><strong>Joined!</strong></Button>);

        } else if (waitingnr !== 0 && joined){
            return (<Button style={{backgroundColor:'lightyellow'}} size='large'><strong>Que number : {waitingnr}</strong></Button>);

        }else{
            return (<Button style={{backgroundColor:'lightgreen'}} onClick={this.joining.bind(this)} size='large'>Join!</Button>);
        }
    };

    //TODO: Fix so it will affect only joined
    joining =() =>{
        console.log(this.state.data_Paragraph.joined);

        this.setState((prev) => {

            }
        )
    };

    componentDidMount(){
        //get data here
    }

    //TODO: Make so the Gridsystem work normal.
    render() {
        const {classes} = this.props;

        return (
            <Fragment>
                <Navigation/>
                <Poster data={this.state.data_poster}/>
                <Grid container className={classes.root} alignContent='space-around' direction='row' justify='space-between'>
                    <Grid item className={classes.container}>
                        <Grid item>
                            <Paragraph data={this.state.data_Paragraph} join={this.join()}/>
                        </Grid>
                        <Grid item className={classes.container} >
                            <Grid className={classes.eventlist}>
                                <EventList/>
                            </Grid>
                            <Grid item className={classes.hello}>
                                <Details/>
                            </Grid>
                        </Grid>
                    </Grid>
                </Grid>

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
