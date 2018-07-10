import React, {Component, Fragment} from 'react';
import PropTypes from 'prop-types'
import {withStyles} from '@material-ui/core/styles';

// Material UI Components
import {Typography, Paper, IconButton,Grid, TextField} from '@material-ui/core';
import {Divider, Input, Button, Collapse} from '@material-ui/core/';

// Icons
import {KeyboardArrowUp,KeyboardArrowDown, Comment, Person, AddCircle, RemoveCircle} from '@material-ui/icons';

// Project Components

/*
    UPDATE: 08.07.2018
    Did major changes to the Jodel-component. Added a JodelPost, JodelCard, and a JodelComments. The JodelWidget should not look like this at all, and needs to be refactored.
    Feel free to refactor everything when you have a better idea. The JodelWidget SHOULD have a FIXED size and should not be able to grow. Maybe should only one 
    JodelPost be visible at time.

    UPDATE 09.07.2018
    Created a posting element. This is just the first version of what i had in mind. there is many things missing such as the posting button to work, and making it better looking.
    and making the extention much more smooth is a plus.
*/


const styles = {
    root: {
        minWidth: 200,
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
    },
    expand:{
        height:50,
        position:'relative',
        backgroundColor:'blue',
        width:'30%',
        borderRadius:50,
        textAlign:'center',
        marginLeft:8,
    },
    expand2:{
        height:200,
        position:'relative',
        backgroundColor:'blue',
        width:'80%',
        borderRadius:50,
        textAlign:'center',
        marginLeft:8,
    },
    minus:{
        width: 60,
        height: '100%',
        position: 'absolute',
        right: 0,
        top: 0,
        bottom: 0,
    },
};

// This shows when you click the pluss icon, here can you type what you want to jodel, and click post.
const CommentText = withStyles(styles)((props) => {
    const {expanding} = props;

    return(
        <div style={styles.expand2}>
            <TextField
                id="multiline-static"
                label="Jodel Away!"
                multiline
                rows="4"
                style={{width:'80%',paddingRight:'1%'}}
                margin="normal"
                color='inheritance'
            />

            <Grid style={styles.minus} container direction='column' wrap='nowrap' justify='space-between'>
                <IconButton color='inherit' disableRipple={true} onClick={expanding}>
                    <RemoveCircle/>
                </IconButton>
            </Grid>
            <Button variant="contained" style={{marginTop:'11%'}}>
                Post
            </Button>
        </div>
    )
});

CommentText.propTypes={
    expanding: PropTypes.func
};

// This shows the small button you can click when the site starts.
const CommentCard = withStyles(styles)((props) => {
    const {loggedIn, expanding} = props;

    return (
        <div style={styles.expand}>
            {loggedIn}
            <Grid style={styles.upvote} container direction='column' wrap='nowrap' justify='space-between'>
                <IconButton color='inherit' disableRipple={true} onClick={expanding}>
                    <AddCircle/>
                </IconButton>
            </Grid>
        </div>
    )
});


CommentCard.propTypes={
    expanding: PropTypes.func,
    loggedIn: PropTypes.func
};

// This uses CommentCard and CommentText to show the different divs.

// loggedIn state tells if there is a user logged in the page. then and only then can a person type and post a jodel.
// showTextField state tells to show and not show the input area

const Commentfield = withStyles(styles)(class Commentfield extends Component {
    constructor() {
        super();

        this.state = {
            loggedIn: true,
            showTextField: true
        };

        this.login = this.login.bind(this);
        this.textField = this.textField.bind(this);
    }

    // This is used in the plus and minus buttons to enlarge and make smaller the Input area.
    textField = () => {
        this.setState({showTextField: !this.state.showTextField});
    };
    // If the person is not logged in the user will get a message "please log in to write a jodel" and cant press on the pluss icon.
    login = () =>{
        return (this.state.loggedIn ? <Typography color='inherit'><strong>Please write a Jodel</strong></Typography> : <Typography color='inherit'><strong>Please Log in to write a Jodel!</strong></Typography>);
    };
    // expands if the user is true
    expanding = () =>{
      return (this.state.loggedIn && this.state.showTextField) ? <CommentText expanding ={this.textField.bind(this)}/> :  <CommentCard loggedIn={this.login()} expanding={this.textField.bind(this)}/> ;
    };

    render() {
        return(
            <Fragment>
                {this.expanding()}
            </Fragment>
        )
    }

});


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
    };

    render() {
        const {classes, text, time, votes, comments, voteState, onVote} = this.props;

        return (
            <div className={classes.post} style={{backgroundColor: this.props.color}}>
                <JodelCard text={text} time={time} votes={votes} onCommentClick={this.toggleComments} voteState={voteState} onVote={onVote}/>
                <Collapse in={this.state.showComments}>
                    <JodelComments comments={comments}/>
                </Collapse>
            </div>
        );
    }
});

JodelPost.propTypes = {
    classes: PropTypes.object,
    text: PropTypes.string,
    time: PropTypes.string,
    votes: PropTypes.number,
    voteState: PropTypes.number,    // What datatype should this be?
    onVote: PropTypes.func,
    comments: PropTypes.array,
};

// The JodelCard. This component can both me a post and a comment. This component is the one that takes in a text, time, and vote. It also needs an ID
const JodelCard = withStyles(styles)((props) => {
    const {classes, text, time, votes, voteState, onVote} = props;
    // TODO: Present the voteState visually.

    return (
        <div className={classes.card}>
            <Grid container direction='column' wrap='nowrap' justify='center' className={classes.upvote}>
                    <IconButton color='inherit' disableRipple={true} onClick={() => props.onVote('upvote')}>
                        <KeyboardArrowUp />
                    </IconButton >
                    <Typography align='center' color='inherit'>
                        {votes}
                    </Typography>
                    <IconButton color='inherit' disableRipple={true} onClick={() => props.onVote('downvote')}>
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

JodelCard.propTypes = {
    classes: PropTypes.object,
    text: PropTypes.string,
    time: PropTypes.string,
    votes: PropTypes.number,
    voteState: PropTypes.number,    // What datatype should this be?
    onVote: PropTypes.func,
};

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

JodelComments.propTypes = {
    classes: PropTypes.object,
    comments: PropTypes.array,
};

// The Jodel component. This component is the widget/container you see in the grid.
const colors = ['#003366','#800000', '#008080'];
class Jodel extends Component {
    constructor(props){
        super(props);
        this.state = {
            // An example on how the Jodel-data could look (?) Feel free to do changes.
            data: [
                {
                    id:0, time: '15:00', votes: 23, text: 'This is my life',
                    comments: [
                        {time: '15:23', votes: 23, text: 'Hva er det han er snakker om?'},
                        {time: '15:25', votes: 200, text: 'Han ble født sånn'},
                        {time: '15:32', votes: 8, text: 'Wow xD'},
                    ],
                    voteState: 0,
                },
            /*     {
                        id:1, time: '16:00', votes: 12, text: 'Hva er forskjellen på en bil og en traktor?',
                        comments: [
                            {time: '16:23', votes: 4, text: 'Hjulene?'}
                        ],
                        voteState: 0,
                    },
                    {
                        id:2, time: '15:00', votes: 21, text: 'Hvem er det som bor i Norge?',
                        comments: [
                            {time: '15:23', votes: 3, text: 'Ikke jeg i hvert fall...'},
                        ],
                        voteState: 0,
                    }, */
                
            ],
        };
    };

    loadData() {
        return new Promise((resolve, reject) => {
            fetch(`http://localhost:8000/jodels/all/`, {method: 'get'})
            .then(response => {
                return response.json();
            }).then(data => {
                resolve(data);
            })
            .catch(err => {
                reject(err);
            })
        });
    }

    // NOTE: The server handles the current vote state.
    handleVote = (value, voteState) => {
        console.log(`Handling vote: ${value.id}, ${voteState}`)
        fetch(`http://localhost:8000/jodels/${value.id}/${voteState}/`, {method: 'patch'})
        .then(response => {
            return response.json();
        }).then(data => {
            this.setState((prev) => {
                let updated = [];
                for (let e of prev.data) {
                    if (e.id === value.id) {
                        updated.push(data);
                    } else {
                        updated.push(e);
                    }
                }
                return {data: updated}
            }, () => {
            });
        }).catch(err => {
        });
    };

    componentDidMount() {
        this.loadData().then(data => {
            this.setState({data: data});
        }).catch(err => {
            console.log('Failed to load Jodel data: ' + err);
        });
    }

    render() {
        const {classes} = this.props;

        return  (
            <Paper className={classes.root}>
                <Grid style={{padding: 10}} container direction='row' wrap='nowrap'>
                    <Typography variant='title' gutterBottom>THILDE Community Channel</Typography>
                </Grid>
                <Commentfield/>
                <div className={classes.posts}>
                    {this.state.data.map((value, index) => {
                        return <JodelPost key={value.id} text={value.text} time={value.time} votes={value.votes}
                                        comments={value.comments} color={colors[index%colors.length]}
                                        voteState={value.voteState}
                                        onVote={(voteType) => {this.handleVote(value, voteType)}}/>
                    })}
                </div>
                <Button fullWidth>Vis flere</Button>
            </Paper>
        );
    }
}

export default withStyles(styles)(Jodel);
