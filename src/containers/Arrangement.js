import React, {Component} from 'react';
import {withStyles} from '@material-ui/core/styles';
import PropTypes from 'prop-types';
import {connect} from 'react-redux';

// API and store imports
import API from '../api/api';
import {GeneralActions} from '../store/actions/MainActions';

// Project components
import Navigation from '../components/Navigation';
import Paragraph from '../components/Paragraph';
import Details from '../components/Details'
import {Grid, Button} from '@material-ui/core/';



const styles = {
    root:{
        backgroundColor:'whitesmoke',
        margin:'auto',
        '@media only screen and (min-width: 600px)': {
            paddingBottom:20,
        }
    },
    image:{
        backgroundColor: 'whitesmoke',
        width: '100%',
        height: 500,

        '@media only screen and (max-width: 600px)': {
            height: 300,
        }
    },
    cell:{
        paddingBottom:20,
        width:'70%',

        '@media only screen and (max-width: 1300px)': {
            width: '100%',
        },
    },
    paragraph:{
        width:'80%',
        float:'right',
        '@media only screen and (max-width: 1300px)': {
            width: '100%',
        },
    }

};

class Arrangement extends Component {
    constructor(props){
        super(props);

        this.state={
            isLoading: false,

            id: "kjaøsdff3onq9a",
            img: 'https://static1.squarespace.com/static/5ae0420bec4eb743393f6d69/t/5ae07506562fa79909cc219b/1525247692097/?format=2500w',
            joined:false,

            data_Paragraph:{
                text:'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed urna elit, finibus in eros vel, hendrerit faucibus ipsum. Nullam egestas libero eu mi ullamcorper gravida. Integer sed lorem a metus finibus varius consequat ac ligula. Duis et leo eu magna accumsan pulvinar. Donec id quam at sem tempor dictum. Nam feugiat congue odio, vel volutpat est consectetur in. Pellentesque sodales convallis sapien, vitae porttitor elit blandit non. Morbi quis aliquam lacus.\n' +
                '\n' +
                'Pellentesque volutpat lorem nec porttitor suscipit. Donec ac vulputate nisi. Etiam at ligula dolor. Morbi risus urna, dignissim eu pellentesque ac, feugiat egestas lorem. Donec mollis dolor sed ex mollis, quis iaculis risus varius. Aliquam faucibus dui et augue convallis consectetur id sit amet nibh. Aliquam malesuada gravida ex, id lobortis velit tempor sed. Sed malesuada leo nulla, in commodo dolor dignissim a. Curabitur sit amet ante mattis ipsum faucibus commodo. Fusce ac fringilla metus. Aliquam volutpat aliquet dui eget dapibus. Curabitur laoreet ultricies est. Quisque pulvinar, lacus sed mollis lacinia, ipsum lectus sagittis sapien, non volutpat diam dolor quis nunc. Aenean non sapien rutrum, pharetra nunc at, rhoncus magna. Etiam ligula nisi, consequat non egestas at, interdum ut mauris.',
                subheader:'This is a small header for a small person',
                waiting:1,

            },
            data_details:{
                date:"29 oktober",
                clock:"18:00",
                where:"steingrimsveien 29",
                name:"Jack Ma",
                study:"Dataingeniør",
                space:"200",
                what:"BedKom",
                link:"https://www.facebook.com/photo.php?fbid=10207242816868231&set=a.1296574593963.38745.1818323030&type=3&theater"
            }
        };

        this.join = this.join.bind(this);
        this.joining =  this.joining.bind(this);
    }

    join = () =>{
        let waitingnr = this.state.data_Paragraph.waiting;

        if(waitingnr  === 0 && this.state.joined){
            return (<Button style={{backgroundColor:'lightblue'}} size='large'><strong>Joined!</strong></Button>);

        } else if (waitingnr !== 0 && this.state.joined){
            return (<Button style={{backgroundColor:'lightyellow'}} size='large'><strong>Que number : {waitingnr}</strong></Button>);

        }else{
            return (<Button style={{backgroundColor:'lightgreen'}} onClick={this.joining.bind(this)} size='large'>Join!</Button>);
        }
    };

    joining =() =>{
        this.setState({joining: !this.state.joining});
    };

    // Gets the event
    loadEvent = () => {
        // Get eventItem id
        const id = this.props.match.params.id;

        // Does the item exist in store
        const itemExists = this.props.grid.findIndex((elem) => elem.id == id) !== -1;

       // Item exists, get it from store
       if (itemExists) {
           this.props.selectStoredItem(id);
       }
       // Item does not exist, fetch from server
       else {
           this.setState({isLoading: true});
           const response = API.getEventItem(id).response();
           response.then((data) => {
               if (!response.isError) {
                   this.props.setSelectedItem(data);
               } else {
                   // Redirect to 404
               }
               this.setState({isLoading: false});
           });
       }
    }

    componentDidMount(){
        //get data here
        this.loadEvent();
    }

    render() {
        const {classes, selected} = this.props;
        return (
            <Navigation isLoading={this.state.isLoading}>
                 {(this.state.isLoading)? null : 
                    <div className={classes.root}>
                        <Grid container spacing={16}>
                            <Grid item className={classes.image}>
                                <img style={{width:'100%', height:'100%'}} src={this.state.img} alt='Missing'/>
                            </Grid>
                            <Grid item xs={12} sm={6} >
                                <div className={classes.paragraph}>
                                    <Paragraph data={this.state.data_Paragraph} join={this.join()}  style={{backgroundColor:'red'}}/>
                                </div>
                            </Grid>
                            <Grid item xs={12} sm={6}>
                                <Grid item className={classes.cell}>
                                    <Details data={this.state.data_details}/>
                                </Grid>
                            </Grid>
                        </Grid>
                    </div>
                 }
            </Navigation>
        );
    }
}

Arrangement.propTypes = {
    classes: PropTypes.object,
    id: PropTypes.string,

    selected: PropTypes.object,
    match: PropTypes.object,
    grid: PropTypes.array,
    selectStoredItem: PropTypes.func,
    setSelectedItem: PropTypes.func,
};

Arrangement.defaultProps = {
    id: "-1"
};

const stateValues = (state) => {
    return {
        grid: state.general.grid,
        selected: state.general.selectedItem,
    };
};

const dispatchers = (dispatch) => {
    return {
        selectStoredItem: (id) => dispatch({type: GeneralActions.SELECT_STORED_ITEM, payload: id}),
        setSelectedItem: (item) => dispatch({type: GeneralActions.SET_SELECTED_ITEM, payload: item}),
    };
};


export default connect(stateValues, dispatchers)(withStyles(styles)(Arrangement));
