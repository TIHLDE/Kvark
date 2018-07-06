import React, {Component} from 'react';
import PropTypes from 'prop-types'
//import {withStyles} from '@material-ui/core/styles';

// Material UI Components
import {Typography,Card,IconButton} from '@material-ui/core';
import {KeyboardArrowUp,KeyboardArrowDown} from '@material-ui/icons'

/*
Denne komponenten er bare en jodel som man kan legge ut et random sted.
Time er hvor lenge den har vært ute på nettsiden/ tilgjengelig for å bli lest.
text er hva personen vil dele / jodle.
votes er antall votes denne jodelen har fått, man kan både få negative votes og positive votes. Dette spørs på hva folk flest syntes om denne spesifikke jodelen.
Voted er da at man kan bare vote EN gang per jodel. Så man kan ikke spamme M1 for å få super mange votes.

Er litt usikker på hvordan man skal implementere denne og hvordan i det heletatt bygge den opp. så jeg bare satt den opp på måten jeg tenkte den kunne være. Feel free til å skifte litt rundt.

Voteup() & VoteDown kan bare bli brukt dersom voted == false
*/

export default class Jodel extends Component {
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

            has_voted: false,
            upvoted: false,
        };
        this.vote = this.vote.bind(this);
        this.sendVote = this.sendVote.bind(this);
        this.setStateFromRest = this.setStateFromRest.bind(this);
    };

    sendVote(upvote) {
        let voteMethod = 'upvote';
        if (!upvote) {
            voteMethod = 'downvote';
        }
        // Get data from REST API
        return new Promise((resolve, reject) => {
            fetch(`http://localhost:8000/jodels/${this.props.id}/${voteMethod}/`, {method: 'patch'})
            .then(response => {
                console.log('response: ' + response);
                return response.json();
            }).then(data => {
                console.log('sendVote: ' + data);
                resolve(data);
            })
            .catch(err => {
                console.log('Unable to send vote of type ' + voteMethod + ' ' + err);
                reject(err);
            })
        });
    }

    // Handle user selection. Can end up in one of tree states:
    // downvoted, no votes at all, or upvoted.
    // Using the current state it determines how many increments
    // the vote number has to be incremented and does the appropriate
    // number of upvotes/downvotes. The only reason for this is the
    // lack of an identification mechanism, so this is only client-based.
    vote(upvoted) {
        let newState = {has_voted: true, upvoted: upvoted};
        if (this.state.has_voted) {
            if (upvoted === this.state.upvoted) {
                // Unvoted
                newState.has_voted = false;
            }
        };

        let promise = new Promise((resolve, reject) => {
            if (this.state.has_voted) {
                // Vote twice to pass through the unvoted state.
                if (upvoted && !this.state.upvoted) {
                    this.sendVote(true).then(d1 => {
                        this.sendVote(true).then(d2 => {
                            resolve(d2);
                        }).catch(err => {
                            reject(err);
                        });
                    }).catch(err => {
                        reject(err);
                    });
                } else if (!upvoted && this.state.upvoted) {
                    this.sendVote(false).then(d1 => {
                        this.sendVote(false).then(d2 => {
                            resolve(d2);
                        }).catch(err => {
                            reject(err);
                        });
                    }).catch(err => {
                        reject(err);
                    });
                } else if (upvoted === this.state.upvoted) {
                    // Unvoted, vote the opposite.
                    this.sendVote(!upvoted).then(d => {
                        resolve(d);
                    }).catch(err => {
                        reject(err);
                    });
                }
            } else {
                this.sendVote(upvoted).then(d => {
                    resolve(d);
                }).catch(err => {
                    reject(err);
                });
            }
        })

        promise.then(data => {
            this.setState(newState, () => {
                console.log('set state ' + this.state.has_voted + ', ' + this.state.upvoted);
                this.setState(this.stateFromJSONData(data));

            });
        }).catch(err => {
            console.log('Failed to vote:' + err);
        })


    }

    // Set the state from the json data recieved from the rest api.
    stateFromJSONData(data) {
        // The 'time' is represented with 'creation_date' (DateTime) in the
        // API, Convert this into a human readable string eg. '20 days' or '30 seconds'.
        const ageMillis = Date.now() - new Date(data.creation_time).getTime();
        const timeStr = secondsToHumanSingle(ageMillis/1000);
        return {time: timeStr, text: data.text, votes: data.votes}
    }

    setStateFromRest() {
        // Get data from REST API
        fetch(`http://localhost:8000/jodels/${this.props.id}/`, {method: 'get'})
            .then(response => {
                return response.json();
            }).then(data => {
                if (typeof data !== 'undefined') {
                    const newState = this.stateFromJSONData(data);
                    this.setState(newState);
}
            })
            .catch(err => {
                console.log(err);
            })
    }

    componentDidMount() {
        this.setStateFromRest();
    }

    render() {
        return  <Card style={this.state.style.root}>
            <div style ={this.state.style.upvote}>
            <IconButton onClick={() => this.vote(true)} disableRipple={true}>
                    <KeyboardArrowUp />
                </IconButton >
                <Typography align='center'>
                    {this.state.votes}
                </Typography>
            <IconButton onClick={() => this.vote(false)} disableRipple={true}>
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
};

// Convert a number of seconds to a human readable string containing only a
// single field, such as '20 days'.
function secondsToHumanSingle(s) {
    const table = [
        {singular: 'year',   plural: 'years',   seconds: 60*60*24*365},
        {singular: 'month',  plural: 'months',  seconds:  60*60*24*30},
        {singular: 'week',   plural: 'weeks',   seconds:   60*60*24*7},
        {singular: 'day',    plural: 'days',    seconds:     60*60*24},
        {singular: 'hour',   plural: 'hours',   seconds:        60*60},
        {singular: 'minute', plural: 'minutes', seconds:           60},
        {singular: 'second', plural: 'seconds', seconds:            1},
    ];

    let found = false;
    let conv = null;
    for (const e of table) {
        if (s >= e.seconds) {
            conv = e;
            found = true;
            break;
        }
    }
    if (!found) {
        conv = table[table.len-1];
    }

    let num = Math.floor(s/conv.seconds);
    let str = num !== 1 ? conv.plural : conv.singular;
    return `${num} ${str}`
}
