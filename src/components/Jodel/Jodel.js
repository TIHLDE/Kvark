import React,{Component} from 'react'
//import {withStyles} from '@material-ui/core/styles';

// Material UI Components
import {Typography,Card,IconButton} from '@material-ui/core';
import {KeyboardArrowUp,KeyboardArrowDown} from '@material-ui/icons'

 export default class Jodel extends Component{
    constructor(props){
        super(props);
        this.state= {
            votes: props.votes || 0,
            voted: props.vote || false,
            time:props.time || "No time",
            text: props.text || "no text",
        };
         this.style = {
            root: {
                backgroundColor: 'orange',
                height:80
            },
            upvote: {
                width: 40,
                height: '100%',
                backgroundColor: 'red',
                float: 'right',
                textAlign: 'center',
            }
        };


        this.vote = this.vote.bind(this);
    };

    vote = (vote) => {
        this.setState({
            voted: this.state.voted = true,
            votes: this.state.votes+vote
        });
    };

    render(){
        return ( <Card style={this.style.root}>
            <div style ={this.style.upvote}>
                <IconButton style={{marginTop:-25}} onClick={this.vote.bind(this, 1)} disabled={this.state.voted}>
                    <KeyboardArrowUp />
                </IconButton >
                <Typography align='center' style={{marginTop:-10, marginLeft:6}}>
                    {this.state.votes}
                </Typography>
                <IconButton onClick={this.vote.bind(this, -1)} disabled={this.state.voted} style={{marginTop:1}}>
                    <KeyboardArrowDown/>
                </IconButton>
            </div>
            <Typography>
                {this.state.time}
            </Typography>
            <Typography>
                {this.state.text}
            </Typography>
        </Card> );
    }
}