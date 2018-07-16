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
        marginTop:'90%',
        marginLeft:'70%'
    }
};

// I want the button to be green when joined, yellow when pending and light blue when you can join. I need internett to see how i can make the Button component these colors and not only secondart primary and so on
const colors =[
    'secondary',
    'primary'
];

class Paragraph extends Component {
    constructor(props){
        super(props);
        this.state={
            joined: props.joined,
            pending: props.pending
        };

        this.join= this.join.bind(this);
        this.joining = this.joining.bind(this);
    }

    //Method that returns a red or green button depending on if the user has joined the arrangement or not.
    join = () =>{
        return (!this.state.joined ? <Button color={colors[0]} onClick={this.joining.bind(this)}>Join!</Button>: <Button color={colors[1]} ><strong>Joined!</strong></Button>);
    };

    //Changes the state from join to joining. It is joining beacuse it might become (pending) which I will implement in later updates.
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
    pending: -1,
};


export default withStyles(styles)(Paragraph);
