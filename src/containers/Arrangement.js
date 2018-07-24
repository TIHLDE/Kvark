import React, {Component, Fragment} from 'react';
import {withStyles} from '@material-ui/core/styles';
import PropTypes from 'prop-types';

// Project components
import Navigation from '../components/Navigation';
import Paragraph from '../components/Paragraph';
import Poster from '../components/Poster';
import Details from '../components/Details'
import {Grid, Button, Paper} from '@material-ui/core/';



const styles = {
    root:{
        backgroundColor:'whitesmoke',
        margin:'auto'
    },
    image:{
        backgroundColor: 'whitesmoke',
        width: '100%',
        height: 500,

        '@media only screen and (max-width: 600px)': {
            height: 300,
        }
    },
    cell:{
        paddingBottom:20
    },

};

class Arrangement extends Component {
    constructor(props){
        super(props);

        this.state={
            id: 1,
            img: 'https://static1.squarespace.com/static/5ae0420bec4eb743393f6d69/t/5ae07506562fa79909cc219b/1525247692097/?format=2500w',

            data_Paragraph:{
                text:'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed urna elit, finibus in eros vel, hendrerit faucibus ipsum. Nullam egestas libero eu mi ullamcorper gravida. Integer sed lorem a metus finibus varius consequat ac ligula. Duis et leo eu magna accumsan pulvinar. Donec id quam at sem tempor dictum. Nam feugiat congue odio, vel volutpat est consectetur in. Pellentesque sodales convallis sapien, vitae porttitor elit blandit non. Morbi quis aliquam lacus.\n' +
                '\n' +
                'Pellentesque volutpat lorem nec porttitor suscipit. Donec ac vulputate nisi. Etiam at ligula dolor. Morbi risus urna, dignissim eu pellentesque ac, feugiat egestas lorem. Donec mollis dolor sed ex mollis, quis iaculis risus varius. Aliquam faucibus dui et augue convallis consectetur id sit amet nibh. Aliquam malesuada gravida ex, id lobortis velit tempor sed. Sed malesuada leo nulla, in commodo dolor dignissim a. Curabitur sit amet ante mattis ipsum faucibus commodo. Fusce ac fringilla metus. Aliquam volutpat aliquet dui eget dapibus. Curabitur laoreet ultricies est. Quisque pulvinar, lacus sed mollis lacinia, ipsum lectus sagittis sapien, non volutpat diam dolor quis nunc. Aenean non sapien rutrum, pharetra nunc at, rhoncus magna. Etiam ligula nisi, consequat non egestas at, interdum ut mauris.',
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

    joining =() =>{
        console.log(this.state.data_Paragraph.joined);

        this.setState((prev) => {

            }
        )
    };

    componentDidMount(){
        //get data here
    }

    render() {
        const {classes} = this.props;

        return (
            <Navigation>
                <div className={classes.root}>
                    <Grid container spacing={16} justify='center'>
                        <Grid item className={classes.image}>
                            <img style={{width:'100%', height:'100%'}} src={this.state.img} alt='Missing image'/>
                        </Grid>
                        <Grid item xs={12} sm={6} >
                            <Paragraph data={this.state.data_Paragraph} join={this.join()} style={{backgroundColor:'red'}}/>
                        </Grid>
                        <Grid item xs={12} sm={6} justify='space-between'>
                            <Grid item className={classes.cell}>
                                <Details/>
                            </Grid>
                            <Grid item className={classes.cell}>
                                <Details/>
                            </Grid>
                        </Grid>
                        <Grid >
                        </Grid>
                    </Grid>
                </div>
            </Navigation>
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
