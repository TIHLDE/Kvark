import React, {Component} from 'react';
import PropTypes from 'prop-types';
import {withStyles} from '@material-ui/core/styles';

import {Grid, Typography, Button, Paper} from '@material-ui/core/';

{/* If you want to implement grid then go ahead! */}

const styles ={
    root:{
      height:650,
      width: 450,
      position:'relative',
    },
    wrapper:{
        paddingLeft:10,
        paddingBottom:10,
        paddingTop:20,
        paddingRight:10
    },

    button:{
        bottom:10,
        right:10,
        position:'absolute'
    }
};

class Paragraph extends Component {
    constructor(props){
        super(props);
        this.state={
            joined: props.joined,
            waiting: props.waiting,

        };

        this.join= this.join.bind(this);
        this.joining = this.joining.bind(this);
    }

    // The metod will return either 1. join! in green. this means that the user can join the event. Que number which shows the user what place in the que he or she is. and lastly joined which means that the user has joined the event and can attend.
    join = () =>{
        if(this.state.waiting === 0 && this.state.joined){
            return (<Button style={{backgroundColor:'lightblue'}} size='large'><strong>Joined!</strong></Button>);
        } else if (this.state.waiting !== 0 && this.state.joined){
           return (<Button style={{backgroundColor:'lightyellow'}} size='large'><strong>Que number : {this.state.waiting}</strong></Button>);
        }else{
          return (<Button style={{backgroundColor:'lightgreen'}} onClick={this.joining.bind(this)} size='large'>Join!</Button>);
        }
    };

    //Changes the state from join to joining. this shows that the user wants to attend the event, but can end up in que.
    joining =() =>{
        console.log("joining!");
      this.setState({
          joined: true
      })
    };

    render() {
        const {data, classes} = this.props;

        return(
        <Paper className={classes.root}>
            <div className={classes.wrapper}>
            <Grid container direction='column' wrap='nowrap' justify='center'>
                <Typography color='inherit' variant='title'>
                    <strong>
                        {data.subheader}
                    </strong>
                </Typography>
                <br/>
                <Typography color='inherit'>
                    {data.text}
                </Typography>
            </Grid>
            <Grid className={classes.button}>
                {this.join()}
            </Grid>
            </div>
        </Paper>
    )}
}

Text.propTypes={
    data: PropTypes.any
};

Paragraph.defaultProps={
    text: 'No paragraph',
    joined: false,
    subheader: 'no subheader',
    waiting: 2,
};


export default withStyles(styles)(Paragraph);
