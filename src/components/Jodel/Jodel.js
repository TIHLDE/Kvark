import React, {Component} from 'react';
import PropTypes from 'prop-types'
//import {withStyles} from '@material-ui/core/styles';

// Material UI Components
import {Typography,Card,IconButton} from '@material-ui/core';
import {KeyboardArrowUp,KeyboardArrowDown} from '@material-ui/icons'

/*
 * Denne komponenten er bare en jodel som man kan legge ut et random sted.
 * Time er hvor lenge den har vært ute på nettsiden/ tilgjengelig for å bli lest.
 * text er hva personen vil dele / jodle.
 * votes er antall votes denne jodelen har fått, man kan både få negative votes og positive votes. Dette spørs på hva folk flest syntes om denne spesifikke jodelen.
 * Voted er da at man kan bare vote EN gang per jodel. Så man kan ikke spamme M1 for å få super mange votes.
 * 
 * Er litt usikker på hvordan man skal implementere denne og hvordan i det heletatt bygge den opp. så jeg bare satt den opp på måten jeg tenkte den kunne være. Feel free til å skifte litt rundt.
 * 
 * Voteup() & VoteDown kan bare bli brukt dersom voted == false
 */

export default class Jodel extends Component {
    const votedAlts = {none: 'none', down: 'down', up: 'up'};

    constructor(props){
        super(props);
        this.state = {
            style: {
                root: {
                    height:80,
                },
                upvote: {
                    width: 40,
                    height: '100%',
                    float: 'right',
                    textAlign: 'center',
                }
            },
            time: props.time,
            votes: props.votes,
            text: props.text,

            // Can the user change their vote?
            votedState: 'none', // alternatives: ['none', 'down', 'up']
        };
        this.vote = this.vote.bind(this);
    };

    vote(type) {
        // If the vote type is equal to the old vote type,
        // then we assume that the user has 'unselected' their up/down vote
        // and wants to reset ther vote back to 'none'.
        this.setState((prev) => {return {votedState: prev === type ? 'none' : type}}, () => {
            console.log(type)

            // Update number of votes using the REST API
            // TODO

        });
    };

    stateFromJSON(json) {
        return {time: json.creation_time, text: json.text, votes: json.votes}
    }

    componentDidMount() {
        // Get data from REST API
        fetch(`http://localhost:8000/jodels/${this.props.id}/`, {method: 'get'})
            .then(response => {
                return response.json();
            }).then(json => {
                console.log(json)
                this.setState(this.stateFromJSON(json));
            })
            .catch(err => {
                console.log(err);
            })
    }

    render() {
        return  <Card style={this.state.style.root}>
            <div style ={this.state.style.upvote}>
            <IconButton onClick={() => this.vote('up')} disableRipple={true}>
                    <KeyboardArrowUp />
                </IconButton >
                <Typography align='center'>
                    {this.state.votes}
                </Typography>
            <IconButton onClick={() => this.vote('down')} disableRipple={true}>
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

Jodel.propTypes = {
    id: PropTypes.number,            // the database key
    time: PropTypes.string,          // time to display while waiting for reply from rest api
    votes: PropTypes.number,         // votes to ...
    text: PropTypes.string,          // text to ...
};


Jodel.defaultProps = {
    time: 'unknown time',
    votes: 0,
    text: 'No content text',
    id: 1,
}
