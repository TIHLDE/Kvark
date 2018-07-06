import React,{Component} from 'react'
//import {withStyles} from '@material-ui/core/styles';

// Material UI Components
import {Typography,Card,IconButton} from '@material-ui/core';
import {KeyboardArrowUp,KeyboardArrowDown} from '@material-ui/icons'

const lorem = "Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis";

export default class Jodel extends Component{

    constructor(props){
        super(props);
        this.state= {
            votes: props.votes || 0,
            voted: props.voted || false,
            time: props.time || "No time",
            text: props.text || lorem
        };
         this.style = {
            root: {
                height:80,
            },
            upvote: {
                width: 40,
                height: '100%',
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
                <Typography align='center' style={{marginTop:-7, marginLeft:6}}>
                    {this.state.votes}
                </Typography>
                <IconButton onClick={this.vote.bind(this, -1)} disabled={this.state.voted}>
                    <KeyboardArrowDown/>
                </IconButton>
            </div>
            <Typography>
                {this.state.time}
            </Typography>
            <Typography >
                {this.state.text}
            </Typography>
        </Card> );
    }
}