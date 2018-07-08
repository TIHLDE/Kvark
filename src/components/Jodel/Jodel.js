import React, {Component, Fragment} from 'react';
import PropTypes from 'prop-types'
import {withStyles} from '@material-ui/core/styles';

// Material UI Components
import {Typography, Paper, IconButton,Grid} from '@material-ui/core';
import {Tabs, Tab, Divider, Input, Button, Collapse} from '@material-ui/core/';

// Icons
import {KeyboardArrowUp,KeyboardArrowDown, Comment, Person} from '@material-ui/icons';

// Project Components
import GridItem from '../Grid/GridItem';

{/*
Denne komponenten er bare en jodel som man kan legge ut et random sted.
Time er hvor lenge den har vært ute på nettsiden/ tilgjengelig for å bli lest.
text er hva personen vil dele / jodle.
votes er antall votes denne jodelen har fått, man kan både få negative votes og positive votes. Dette spørs på hva folk flest syntes om denne spesifikke jodelen.
Voted er da at man kan bare vote EN gang per jodel. Så man kan ikke spamme M1 for å få super mange votes.

Er litt usikker på hvordan man skal implementere denne og hvordan i det heletatt bygge den opp. så jeg bare satt den opp på måten jeg tenkte den kunne være. Feel free til å skifte litt rundt.

Voteup() & VoteDown kan bare bli brukt dersom voted == false
*/}

{
    /*
        UPDATE: 08.07.2018
        Did major changes to the Jodel-component. Added a JodelPost, JodelCard, and a JodelComments. The JodelWidget should not look like this at all, and needs to be refactored.
        Feel free to refactor everything when you have a better idea. The JodelWidget SHOULD have a FIXED size and should not be able to grow. Maybe should only one 
        JodelPost be visible at time.
    */
}

const styles = {
    root: {
        height: '100%',
        color: 'whitesmoke',
    },
    posts: {
        padding: 10,
    },
    post: {
        marginBottom: 7,
        borderRadius: 5,
        padding: 5,
    },
    card: {
        height: 100,
        position: 'relative',
    },
    upvote: {
        width: 40,
        height: '100%',
        position: 'absolute',
        right: 0,
        top: 0,
        bottom: 0,
        textAlign: 'center',
    },
    content: {
        height: '100%',
    },
    subContent: {
        height: 20,
    },
    commentContainer: {
        marginTop: 10,
    }
};

// A JodelPost. This component manages a post and its comments.
const JodelPost = withStyles(styles)(class JodelPost extends Component {
    
    constructor() {
        super();
        
        this.state = {
            showComments: false,
        };
    }

    toggleComments = () => {
        this.setState({showComments: !this.state.showComments});
    }

    render() {
        const {classes, text, time, votes, comments} = this.props;

        return (
            <div className={classes.post} style={{backgroundColor: this.props.color}}>
                <JodelCard text={text} time={time} votes={votes} onCommentClick={this.toggleComments}/>
                <Collapse in={this.state.showComments}>
                    <JodelComments comments={comments}/>
                </Collapse>
            </div>
        );
    }
});

// The JodelCard. This component can both me a post and a comment. This component is the one that takes in a text, time, and vote. It also needs an ID
const JodelCard = withStyles(styles)((props) => {
    const {classes, text, time, votes} = props;

    return (
        <div className={classes.card}>
            <Grid container direction='column' wrap='nowrap' justify='center' className={classes.upvote}>
                    <IconButton color='inherit' disableRipple={true}>
                        <KeyboardArrowUp />
                    </IconButton >
                    <Typography align='center' color='inherit'>
                        {votes}
                    </Typography>
                    <IconButton color='inherit' disableRipple={true}>
                        <KeyboardArrowDown/>
                    </IconButton>
            </Grid>
            <Grid className={classes.content} container direction='column' wrap='nowrap' justify='space-between'>
                <Grid className={classes.subContent} item container direction='row' wrap='nowrap' alignItems='center'>
                    <Person/>
                    <Typography variant='caption' style={{color: 'rgba(255,255,255,0.5)'}}>
                        TIHLDE-medlem
                    </Typography>
                </Grid>
                <Typography color='inherit'>
                    {text}
                </Typography>
                <Grid className={classes.subContent} item container direction='row' wrap='nowrap' alignItems='center'>
                    <Typography variant='caption' style={{color: 'rgba(255,255,255,0.5)'}}>
                        Tid: {time}
                    </Typography>
                    {(!props.onCommentClick)? null : 
                        <IconButton color='inherit' onClick={props.onCommentClick}>
                            <Comment/>
                        </IconButton>
                    }
                </Grid>
            </Grid>
        </div>
    );
});

// Handles the Jodel-comments based on prop-comments.
const JodelComments = withStyles(styles)((props) => {
    const {classes, comments} = props;

    return (
        <Grid className={classes.commentContainer} container direction='column' wrap='nowrap' spacing={16}>
            <Grid item container direction='column' wrap='nowrap'>
                <Typography variant='subheading' color='inherit'>Skriv en kommentar</Typography>
                <Input fullWidth placeholder='Skriv en kommentar' style={{color: 'inherit'}} />
                <Button size='small' color='inherit'>Kommenter</Button>
            </Grid>
            <Grid item container direction='column' wrap='nowrap'>
            {(!comments)? null : 
                comments.map((value, index) => {
                    return ( 
                        <Fragment key={index}>
                            <JodelCard text={value.text} time={value.time} votes={value.votes}/>
                            <Divider/>
                        </Fragment>
                    )
                })
            }
            </Grid>
        </Grid>
    );
});

// The Jodel component. This component is the widget/container you see in the grid.
const colors = ['#003366','#800000', '#008080'];
class Jodel extends Component {
    constructor(props){
        super(props);
        this.state = {
            // An example on how the Jodel-data could look (?) Feel free to do changes.
            data: [
                {
                    id:'MYID', time: '15:00', votes: 23, text: 'This is my life',
                    comments: [
                        {time: '15:23', votes: 23, text: 'Hva er det han er snakker om?'},
                        {time: '15:25', votes: 200, text: 'Han ble født sånn'},
                        {time: '15:32', votes: 8, text: 'Wow xD'},
                    ],
                    voteState: 0,
                },
                {
                    id:'MYID', time: '16:00', votes: 12, text: 'Hva er forskjellen på en bil og en traktor?',
                    comments: [
                        {time: '16:23', votes: 4, text: 'Hjulene?'}
                    ],
                    voteState: 0,
                },
                {
                    id:'MYID', time: '15:00', votes: 21, text: 'Hvem er det som bor i Norge?',
                    comments: [
                        {time: '15:23', votes: 3, text: 'Ikke jeg i hvert fall...'},
                    ],
                    voteState: 0,
                },
                
            ],
        };
        this.vote = this.vote.bind(this);
    };

    vote(type) {
        // If the vote type is equal to the old vote type,
        // then we assume that the user has 'unselected' their up/down vote
        // and wants to reset ther vote back to 'none'.
        this.setState((prev) => {return {votedState: prev === type ? 'none' : type}}, () => {
            console.log(type)
        });
    };

    componentDidMount() {
        // Get data from
    }

    render() {
        const {classes} = this.props;

        return  (
            <Paper className={classes.root}>
                <Grid style={{padding: 10}} container direction='row' wrap='nowrap'>
                    <Typography variant='title' gutterBottom>THILDE Community Channel</Typography>
                </Grid>
                <div className={classes.posts}>
                    {this.state.data.map((value, index) => {
                        return <JodelPost key={index} text={value.text} time={value.time} votes={value.votes} comments={value.comments} color={colors[index%colors.length]}/>
                    })}
                </div>
                <Button fullWidth>Vis flere</Button>
            </Paper>
        );
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
};

export default withStyles(styles)(Jodel);
