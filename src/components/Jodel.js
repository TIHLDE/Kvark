import React, {Component} from 'react';
//import {withStyles} from '@material-ui/core/styles';

// Material UI Components
import {Typography,Card,IconButton} from '@material-ui/core';
import {KeyboardArrowUp,KeyboardArrowDown} from '@material-ui/icons'

{/*
Denne komponenten er bare en jodel som man kan legge ut et random sted.
Time er hvor lenge den har vært ute på nettsiden/ tilgjengelig for å bli lest.
text er hva personen vil dele / jodle.
votes er antall votes denne jodelen har fått, man kan både få negative votes og positive votes. Dette spørs på hva folk flest syntes om denne spesifikke jodelen.
Voted er da at man kan bare vote EN gang per jodel. Så man kan ikke spamme M1 for å få super mange votes.

Er litt usikker på hvordan man skal implementere denne og hvordan i det heletatt bygge den opp. så jeg bare satt den opp på måten jeg tenkte den kunne være. Feel free til å skifte litt rundt.

Voteup() & VoteDown kan bare bli brukt dersom voted == false

MAP function:

    const newState = this.state.users.map((user) =>{
    const tempUser= user;
    tempUser.age-=10;
    return tempUser;
    })
    this.setstate({
    newState;
    })

    {this.state.users.map((user) =>{
        return <User/>
    })}

*/}

export default class Jodel extends Component {
    constructor(props){
        super(props);
        this.state = {
            style: {
                root: {
                    width: '100%',
                    height: 100,
                    backgroundColor: 'orange'
                },
                upvote: {
                    width: '10%',
                    height: '100%',
                    backgroundColor: 'red',
                    float: 'right',
                    textAlign: 'center',
                },

            },
            time: props.time || "No time",
            votes: props.votes || 0,
            text: props.text || "No text",
            voted: false
        };
            this.vote = this.vote.bind(this);
    };

    vote = (vote) => {
        this.setState({
            voted: this.state.voted = true,
            votes: this.state.votes+vote
        });
    };

    render() {
        return  <Card style={this.state.style.root}>
            <div style ={this.state.style.upvote}>
                <IconButton onClick={this.vote.bind(this, 1)} disableRipple={true} disabled={this.state.voted}>
                    <KeyboardArrowUp />
                </IconButton >
                <Typography align='center'>
                    {this.state.votes}
                </Typography>
                <IconButton onClick={this.vote.bind(this, -1)} disableRipple={true} disabled={this.state.voted}>
                    <KeyboardArrowDown/>
                </IconButton>

            </div>
            {this.state.time}
            <br/>
            <Typography>
                {this.state.text}
            </Typography>


        </Card>;
    }
}