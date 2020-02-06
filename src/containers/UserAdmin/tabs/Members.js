import React, {Component} from 'react';
import {withStyles} from '@material-ui/core/styles';
import PropTypes from 'prop-types';
import connect from 'react-redux/es/connect/connect';
import classNames from 'classnames';

// API and store imports
// import AdminService from '../../../api/services/AdminService';


// Material Components
import Divider from '@material-ui/core/Divider';
import CircularProgress from '@material-ui/core/CircularProgress';
import Grow from '@material-ui/core/Grow';
import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';
import ListItem from '@material-ui/core/ListItem';
import Hidden from '@material-ui/core/Hidden';

// Project components
import PersonListItem from "./components/PersonListItem"
import Pageination from '../../../components/layout/Pageination'
import NoPersonsIndicator from './components/NoPersonsIndicator';

const styles = (theme) => ({
    grid: {
        display: 'grid',
        gridTemplateColumns: '1fr',
        gridTemplateRows:'auto',
        width: '100%',

        position: 'relative',

        '@media only screen and (max-width: 800px)': {
            gridTemplateColumns: '1fr',
            justifyContent: 'center',
            gridAutoFlow: 'row dense',
        },
    },
    progress: {
        display: 'block',
        margin: 'auto',
        marginTop: 10,

        '@media only screen and (max-width: 800px)': {
            order: 1,
        },
    },
    notActivated: {
        gridAutoFlow: 'column',
        display: 'grid',
        gridGap: '10px',
        width: '100%',
        textAlign: 'left',
        gridTemplateColumns: 'auto 1fr auto auto auto 96px',
        gridTemplateRows: '1fr',

        '@media only screen and (max-width: 600px)': {
            display: 'none',
        },
    },
    title: {
        fontWeight: 'bold',
    },
    id: {
        minWidth: '65px',
    },
    class: {
        minWidth: '60px'
    },
    vipps: {
        minWidth: '70px'
    },
});


class Members extends Component {

    constructor(){
        super();
        this.state = {
            members: [],
            isLoading: false,
            isFetching: false,

            nextPage: null,
            expiredShown: false,
        }
    }

    // Gets the event
    loadMembers = () => {
        // Add in filters if needed.
        // let urlParameters = {};

        // Decide if we should go to next page or not.
        if (this.state.nextPage){
            // urlParameters = {
                // page: this.state.nextPage,
                // ...urlParameters
            // };

        } else if (this.state.members.length > 0 ) {
            // Abort if we have no more pages and allready have loaded everything
            this.setState({isFetching: false})
            return;
        }

        this.setState((oldState) => {
            let displayedMembers = [{"id":0,"activated":false,"vipps":585702,"user_class":2,"user_study":5,"first_name":"Sellers","last_name":"Gallegos","user_id":"comtours"},{"id":1,"activated":false,"vipps":418733,"user_class":5,"user_study":3,"first_name":"Francisca","last_name":"Whitley","user_id":"danja"},{"id":2,"activated":false,"vipps":207369,"user_class":5,"user_study":4,"first_name":"Esperanza","last_name":"Maynard","user_id":"digigen"},{"id":3,"activated":false,"vipps":672872,"user_class":5,"user_study":4,"first_name":"Bush","last_name":"Cleveland","user_id":"austex"},{"id":4,"activated":false,"vipps":511135,"user_class":5,"user_study":1,"first_name":"Adriana","last_name":"Mckinney","user_id":"poshome"},{"id":5,"activated":false,"vipps":237015,"user_class":5,"user_study":3,"first_name":"Earlene","last_name":"Velez","user_id":"ultrasure"},{"id":6,"activated":false,"vipps":786322,"user_class":3,"user_study":1,"first_name":"Daniel","last_name":"Black","user_id":"zilphur"},{"id":7,"activated":false,"vipps":795412,"user_class":2,"user_study":5,"first_name":"Cain","last_name":"Higgins","user_id":"zyple"},{"id":8,"activated":false,"vipps":585702,"user_class":2,"user_study":5,"first_name":"Sellers","last_name":"Gallegos","user_id":"comtours"},{"id":9,"activated":false,"vipps":418733,"user_class":5,"user_study":3,"first_name":"Francisca","last_name":"Whitley","user_id":"danja"},{"id":10,"activated":false,"vipps":207369,"user_class":5,"user_study":4,"first_name":"Esperanza","last_name":"Maynard","user_id":"digigen"},{"id":11,"activated":false,"vipps":672872,"user_class":5,"user_study":4,"first_name":"Bush","last_name":"Cleveland","user_id":"austex"},{"id":12,"activated":false,"vipps":511135,"user_class":5,"user_study":1,"first_name":"Adriana","last_name":"Mckinney","user_id":"poshome"},{"id":13,"activated":false,"vipps":237015,"user_class":5,"user_study":3,"first_name":"Earlene","last_name":"Velez","user_id":"ultrasure"},{"id":14,"activated":false,"vipps":786322,"user_class":3,"user_study":1,"first_name":"Daniel","last_name":"Black","user_id":"zilphur"},{"id":15,"activated":false,"vipps":795412,"user_class":2,"user_study":5,"first_name":"Cain","last_name":"Higgins","user_id":"zyple"}];
            return {members: displayedMembers};
          });


        // TODO: Create AdminService with option to get all members

        // Fetch members from server
        /*AdminService.getMembers(urlParameters, (isError, data) => {


            if(isError === false) {
                // For backward compabillity
                let nextPageUrl = data.next;
                let displayedMembers = data.members;
                urlParameters = {};

                // If we have a url for the next page convert it into a object
                if (nextPageUrl) {
                  let nextPageUrlQuery = nextPageUrl.substring(nextPageUrl.indexOf('?') + 1);
                  let parameterArray = nextPageUrlQuery.split('&');
                  parameterArray.forEach((parameter) => {
                    const parameterString = parameter.split('=')
                    urlParameters[parameterString[0]] = parameterString[1]
                  })
                }

                // Get the page number from the object if it exist
                let nextPage = urlParameters['page'] ? urlParameters['page'] : null;
                let expiredShown = this.state.expiredShown;

                if (nextPage === null && !expiredShown && (this.state.search || this.state.category)){
                  nextPage = 1;
                  expiredShown = true;
                }

                this.setState((oldState) => {

                  // If we allready have members
                  if (this.state.members.length > 0) {
                    displayedMembers = oldState.members.concat(displayedmembers);
                  }
                  return {members: displayedMembers, nextPage: nextPage, expiredShown: expiredShown};
                });

            }
            this.setState({isLoading: false, isFetching: false});
        });*/
    };

    componentDidMount(){
        window.scrollTo(0,0);
        this.setState({isLoading: true});
        this.loadMembers();
    }

    getNextPage = () => {
      this.loadMembers();
    }

    handleDelete = (id) => {
        console.log("Delete", id);
    }

    handleActivate = (id) => {
        console.log("Activate", id);
    }

    render() {
        const {classes} = this.props;

        return (
                <div className={classes.grid}>
                    {this.state.isFetching ? <CircularProgress className={classes.progress} /> :
                        <Grow in={!this.state.isFetching}>
                            <div>
                                <Pageination nextPage={this.getNextPage} page={this.state.nextPage}>
                                    <Hidden xsDown>
                                        <ListItem className={classes.btn}>
                                            <Grid className={classNames(classes.notActivated)} container direction='row' wrap='nowrap' alignItems='center'>
                                                <Typography className={classNames(classes.title, classes.id)} variant='subtitle1'>Id:</Typography>
                                                <Typography className={classes.title} variant='subtitle1'>Navn:</Typography>
                                                <Typography className={classes.title} variant='subtitle1'>Studie:</Typography>
                                                <Typography className={classNames(classes.title, classes.class)} variant='subtitle1'>Klasse:</Typography>
                                                <Typography className={classNames(classes.title, classes.vipps)} variant='subtitle1'>Vipps:</Typography>
                                            </Grid>
                                        </ListItem>
                                    </Hidden>
                                    {this.state.members && this.state.members.map((value, index) => (
                                        <div key={value.id}>
                                            <PersonListItem key={value.id} data={value} handleDelete={this.handleDelete} handleActivate={this.handleActivate} />
                                            <Divider/>

                                        </div>
                                    ))}
                                </Pageination>
                                { (this.state.members.length === 0 && !this.state.isLoading) &&
                                    <NoPersonsIndicator />
                                }
                            </div>
                        </Grow>
                    }
                </div>
        );
    }
}


Members.propTypes = {
    classes: PropTypes.object,
    match: PropTypes.object,
    grid: PropTypes.object,
};

Members.defaultProps = {
    id: "-1"
};

const stateValues = (state) => {
    return {
        grid: state.grid
    };
};


export default connect(stateValues)(withStyles(styles, {withTheme: true})(Members));
