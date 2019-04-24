import React, {Component, Fragment} from 'react';
import {withStyles} from '@material-ui/core/styles';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import moment from 'moment';

// API imports
import JobPostService from '../../../api/services/JobPostService';

// Material UI Components
import Grid from '@material-ui/core/Grid';
import Paper from '@material-ui/core/Paper';
import Typography from '@material-ui/core/Typography';
import Divider from '@material-ui/core/Divider';
import ButtonBase from '@material-ui/core/ButtonBase';
import TextField from '@material-ui/core/TextField';
import MenuItem from '@material-ui/core/MenuItem';
import Button from '@material-ui/core/Button';
import CircularProgress from '@material-ui/core/CircularProgress';
import Snackbar from '@material-ui/core/Snackbar';
import SnackbarContent from '@material-ui/core/SnackbarContent';
import IconButton from '@material-ui/core/IconButton';

// Icons
import AddIcon from '@material-ui/icons/Add';
import DownloadIcon from '@material-ui/icons/CloudDownload';


// Project Components
import TextEditor from '../../../components/inputs/TextEditor';
import JobPostPreview from './JobPostPreview';


const SIDEBAR_WIDTH = 300;

const styles = (theme) => ({
    root: {
        paddingLeft: SIDEBAR_WIDTH,
        paddingBottom: 100,
        '@media only screen and (max-width: 800px)': {
            padding: 0,
        }
    },
    sidebar: {
        paddingTop: 64,
        position: 'fixed',
        left: 0, top: 0, bottom: 0,
        width: SIDEBAR_WIDTH,

        '@media only screen and (max-width: 800px)': {
            position: 'static',
            width: '100%',
            padding: 0,
        }
    },
    sidebarTop: {
        backgroundColor: 'whitesmoke',
        padding: '10px 5px 10px 12px',
    },
    miniTop: {
        padding: '5px 5px 5px 12px',
    },
    JobPostItem: {
        padding: '10px 10px',
        textAlign: 'left',
    },
    selected: {
        backgroundColor: theme.palette.primary.main,
        color: 'white',
    },
    field: {
        margin: '5px 0px',
        maxWidth: 300,
    },
    content: {
        width: '80%',
        maxWidth: 1000,
        marginTop: 150,
        display: 'block',
        margin: 'auto',
        padding: 36,

        '@media only screen and (max-width: 800px)': {
            width: 'auto',
            marginTop: 0,
        }
    },
    margin: {
        margin: '10px 0px',
    },
    mr: {marginRight: 10},
    snackbar: {
        marginTop: 44,
        backgroundColor: theme.palette.error.main,
    },
    messageView: {
        padding: 30,
        minWidth: 300,
        minHeight: 200,
    },
    deleteButton: {
        color: theme.palette.error.main,
    },
    progress: {
        minHeight: 300,
    },
    flexRow: {
        margin: '10px 0',
        display: 'flex',
        flexDirection: 'row',
        flexWrap: 'nowrap',

        '@media only screen and (max-width: 800px)': {
            flexDirection: 'column',
        }
    },
    padding: {
        padding: '10px 5px',
    }
});

const MessageView = withStyles(styles, {withTheme: true})((props) => {
    const {classes} = props;
    return (
        <Grid className={classNames(classes.messageView, props.className)} container direction='column' alignItems='center' justify='center'>
            <Typography className={classes.margin} variant='headline' align='center'>{props.title}</Typography>
            <Button className={classes.margin} variant='raised' color='primary' onClick={props.onClick}>{props.buttonText}</Button>
        </Grid>
    )
});

const JobPostItem = withStyles(styles, {withTheme: true})((props) => {
    const {classes} = props;
    return (
        <Fragment>
            <ButtonBase onClick={props.onClick}>
                <Grid className={classNames(classes.JobPostItem, (props.selected)? classes.selected : '' )} container direction='row' alignItems='center' justify='space-between'>
                    <Grid container direction='column' justify='center'>
                        <Typography variant='subheading' color='inherit'>{props.title}</Typography>
                        <Typography variant='caption'  color='inherit'>{props.location}</Typography>
                    </Grid>
                </Grid>
            </ButtonBase>
        <Divider/>
        </Fragment>
    );
});

JobPostItem.propTypes = {
    title: PropTypes.string,
    location: PropTypes.string,
};

//const priorities = ['Lav', 'Middels', 'Høy'];
const jobpostCreated = 'Annonsen ble opprettet';
const jobpostChanged = 'Endringen ble publisert';
const jobpostDeleted = 'Annonsen ble slettet';
const errorMessage = (data) => 'Det oppstod en feil! '.concat(JSON.stringify(data || {}));
const snackbarHideDuration = 4000;




class JobPostAdministrator extends Component {
  constructor() {
    super();
    this.state = {
        isLocked: true,
        isLoading: false,
        isFetching: false,

        jobposts: [],
        expired: [],
        selectedJobPost: null,

        title: '',
        ingress: '',
        location: '',
        deadline: new Date().toISOString(),
        company: '',
        email: '',
        link: '',
        body: '',
        signUp: false,
        image: '',
        imageAlt: '',

        showMessage: false,
        errorMessage: 'Det oppstod en feil',
        showSuccessMessage: false,
        successMessage: jobpostCreated,
        showPreview: false,
    };
  }

  componentDidMount() {
    // Fetch Job posts
    JobPostService.getJobPosts()
    .then((data) => {
        if(data) {
            this.setState({jobposts: data});
        }
    });
  }


      fetchExpired = () => {
          console.log(this.state.isFetching);
          if(this.state.isFetching) {
              return;
          }

          this.setState({isFetching: false});
          JobPostService.getExpiredData((isError, data) => {
              if (!isError) {
                  this.setState({expired: data || []});
              }
              this.setState({isFetching: true});
          });
      }

      onEventClick = (jobpost) => {
          const {selectedJobPost} = this.state;

          if(selectedJobPost !== null && selectedJobPost.id === jobpost.id) {
              this.resetJobPostState();
          } else {
              this.setState({
                  selectedJobPost: jobpost,
                  title: jobpost.title,
                  ingress: jobpost.ingress,
                  location: jobpost.location,
                  body: jobpost.body,
                  image: jobpost.image,
                  deadline: jobpost.deadline.substring(0,16),
                  company: jobpost.company,
                  email: jobpost.email,
                  link: jobpost.link,
                  signUp: jobpost.signUp,
              });
          }
          this.setState({showSuccessMessage: false});
      }

      resetJobPostState = () => {
          this.setState({
              selectedJobPost: null,
              title: '',
              ingress: '',
              location: '',
              body: '',
              image: '',
              imageAlt: '',
              deadline: new Date().toISOString().substring(0, 16),
              company: '',
              email: '',
              link: '',
              signUp: false,
          });
      }

      handleChange = (name) => (jobpost) => {
          this.setState({[name]: jobpost.target.value});
      }

      handleToggleChange = (name) => () => {
          this.setState({[name]: !this.state[name]});
      }

      onChange = (name) => (value) => {
          this.setState({[name]: value});
      }

      toggleSnackbar = () => {
          this.setState({showMessage: !this.state.showMessage});
      }

      toggleSuccessView = () => {
          this.setState({showSuccessMessage: !this.state.showSuccessMessage});
      }

      getStateJobPostItem = () => ({
          title: this.state.title,
          ingress: this.state.ingress,
          location: this.state.location,
          body: this.state.body,
          image: this.state.image,
          imageAlt: 'jobpost',
          deadline: moment(this.state.deadline).format('YYYY-MM-DDThh:mm'),
          company: this.state.company,
          email: this.state.email,
          link: this.state.link,
          signUp: this.state.signUp,
      });

      createNewJobpost = (jobpost) => {
          jobpost.preventDefault();

          const item = this.getStateJobPostItem();

          this.setState({isLoading: true});

          // Create new Jobpost
          JobPostService.createJobPost(item, (isError, data) => {
              if(!isError) {
                  const newJobposts = Object.assign([], this.state.jobposts);
                  newJobposts.unshift(data);
                  this.setState({jobposts: newJobposts, showSuccessMessage: true, successMessage: jobpostCreated});
              } else {
                  this.setState({showMessage: true, snackMessage: errorMessage(data)});
              }
              this.setState({isLoading: false});
          });
      }

    editJobPostItem = (jobpost) => {
        jobpost.preventDefault();

        const item = this.getStateJobPostItem();
        const {selectedJobPost} = this.state;

        this.setState({isLoading: true});

        // Create new Jobpost Item
        JobPostService.putJobPost(selectedJobPost.id, item, (isError, data) => {
            if(!isError) {
                // Update stored jobpost with the new data
                const newJobPost = Object.assign([], this.state.jobposts);
                const index = newJobPost.findIndex((elem) => elem.id === selectedJobPost.id); // Finding jobpost by id
                if(index !== -1) {
                    newJobPost[index] = data;
                    this.setState({jobposts: newJobPost, showSuccessMessage: true, successMessage: jobpostChanged});
                }
            } else {
                this.setState({showMessage: true, snackMessage: errorMessage(data)});
            }
            this.setState({isLoading: false});
        });
    }

    deleteJobPostItem = (jobpost) => {
        jobpost.preventDefault();

        const {selectedJobPost} = this.state;

        this.setState({isLoading: true});

        // Create new JobPost Item
        JobPostService.deleteJobPost(selectedJobPost.id, (isError, data) => {
            if(isError === false) {
                // Remove the deleted JobPost from the state
                const newJobPosts = Object.assign([], this.state.jobposts);
                const index = newJobPosts.findIndex((elem) => elem.id === selectedJobPost.id);
                if(index !== -1) {
                    newJobPosts.splice(index, 1);
                    this.setState({jobposts: newJobPosts, selectedJobPost: null, showSuccessMessage: true, successMessage: jobpostDeleted});
                }
            }
            this.setState({isLoading: false});
        });
    }


    render() {
        const {classes} = this.props;
        const {selectedJobPost, title, ingress, location, body: body, image, company, email, link} = this.state;
        const selectedJobPostId = (selectedJobPost)? selectedJobPost.id : '';
        const isNewItem = (selectedJobPost === null);
        const header = (isNewItem)? 'Lag en ny annonse' : 'Endre annonse';

        return (
          <Fragment>
              <div className={classes.root}>
                  <Snackbar
                      open={this.state.showMessage}
                      autoHideDuration={snackbarHideDuration}
                      anchorOrigin={{
                          vertical: 'top',
                          horizontal: 'right',
                      }}
                      onClose={this.toggleSnackbar}>

                          <SnackbarContent
                              className={classes.snackbar}
                              message={this.state.snackMessage}/>
                      </Snackbar>

                  <Paper className={classes.content} square>
                      {(this.state.isLoading)? <Grid className={classes.progress} container justify='center' alignItems='center'><CircularProgress /></Grid> :
                      (this.state.showSuccessMessage)? <MessageView title={this.state.successMessage} buttonText='Nice' onClick={this.toggleSuccessView}/> :
                          <form>
                              <Grid container direction='column' wrap='nowrap'>
                                  <Typography variant='headline'>{header}</Typography>
                                  <TextField className={classes.field} label='Tittel' value={title} onChange={this.handleChange('title')} required/>
                                  <TextField className={classes.field} label='Ingress' value={ingress} onChange={this.handleChange('ingress')} required/>
                                  <TextField className={classes.field} label='Sted' value={location} onChange={this.handleChange('location')} required/>

                                  <TextEditor className={classes.margin} value={body} onChange={this.onChange('body')}/>

                                  <Divider className={classes.margin} />
                                  <TextField className={classes.margin} fullWidth label='Bilde' value={image} onChange={this.handleChange('image')}/>
                                  <TextField className={classes.margin} label='Bedrift' value={company} onChange={this.handleChange('company')} required/>
                                  <TextField className={classes.margin} label="E-post" value={email} onChange={this.handleChange('email')}/>
                                  <TextField className={classes.margin} fullWidth type='datetime-local' pattern="[0-9]{4}-[0-9]{2}-[0-9]{2}" label='Frist' value={this.state.deadline} onChange={this.handleChange('deadline')}/>
                                  <TextField className={classes.margin} label="Link" value={link} onChange={this.handleChange('link')}/>




                                  <Grid container direction='row' wrap='nowrap' justify='space-between'>
                                      {(isNewItem)?
                                          <div>
                                              <Button className={classes.mr} onClick={this.createNewJobpost} type='submit' variant='raised' color='primary'>Lag ny annonse</Button>
                                              <Button variant='outlined' color='primary' onClick={this.handleToggleChange('showPreview')}>Preview</Button>
                                          </div>

                                          :
                                          <Fragment>
                                              <div>
                                                  <Button className={classes.mr} onClick={this.editJobPostItem} variant='raised' type='submit' color='primary'>Lagre</Button>
                                                  <Button variant='outlined' color='primary' onClick={this.handleToggleChange('showPreview')}>Preview</Button>
                                              </div>
                                              <Button className={classes.deleteButton} onClick={this.deleteJobPostItem} variant='outlined'>Slett</Button>
                                          </Fragment>
                                      }
                                  </Grid>
                              </Grid>
                          </form>
                      }
                  </Paper>

              </div>
              <Paper className={classes.sidebar}>
                  <Grid container direction='column' wrap='nowrap'>
                      <Grid className={classNames(classes.sidebarTop)} container direction='row' wrap='nowrap' alignItems='center' justify='space-between'>
                          <Typography variant='title' color='inherit'>Annonser</Typography>
                          <IconButton onClick={this.resetJobPostState}><AddIcon/></IconButton>
                      </Grid>
                      {this.state.jobposts.map((value, index) => (
                          <JobPostItem
                              key={index}
                              selected={value.id === selectedJobPostId}
                              onClick={() => this.onEventClick(value)}
                              title={value.title}
                              location={value.location} />
                      ))}

                      <Grid className={classNames(classes.sidebarTop, classes.miniTop)} container direction='row' wrap='nowrap' alignItems='center' justify='space-between'>
                          <Typography variant='title' color='inherit'>Utgåtte</Typography>
                          <IconButton onClick={this.fetchExpired}><DownloadIcon/></IconButton>
                      </Grid>
                      {this.state.expired.map((value, index) => (
                          <JobPostItem
                              key={index}
                              selected={value.id === selectedJobPostId}
                              onClick={() => this.onEventClick(value)}
                              title={value.title}
                              location={value.location} />
                      ))}

                  </Grid>
              </Paper>
              <JobPostPreview data={this.getStateJobPostItem()} open={this.state.showPreview} onClose={this.handleToggleChange('showPreview')}/>
          </Fragment>
        );
    }
}

JobPostAdministrator.propTypes = {
    classes: PropTypes.object,
};

export default withStyles(styles, {withTheme: true})(JobPostAdministrator);
