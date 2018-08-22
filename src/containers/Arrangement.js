import React, {Component} from 'react';
import {withStyles} from '@material-ui/core/styles';
import PropTypes from 'prop-types';
import {connect} from 'react-redux';
import classNames from 'classnames';

// API and store imports
import API from '../api/api';
import {GeneralActions} from '../store/actions/MainActions';

// Project components
import Navigation from '../components/Navigation';
import Paragraph from '../components/Paragraph';
import Details from '../components/Details'
import { Button} from '@material-ui/core/';
import {Typography} from '@material-ui/core';



const styles = {
    root:{
        margin:'auto',
        maxWidth: 1200,
    },
    wrapper: {
        display: 'grid',
        gridTemplateColumns: '1fr 1fr',
        gridTemplateRows: 'auto',
        gridGap: '10px',
        padding: '10px 10px 10px 10px',
        gridTemplateAreas:"'header header'\n" +
            "        'cell cell'\n" +
            "        'paragraph img'",

        '@media only screen and (max-width: 600px)': {
            gridTemplateColumns: '100%',
            gridTemplateAreas:"'img'\n" +
                "        'header'\n" +
                "        'cell' \n" +
                "        'paragraph' \n",


        }
    },
    cell:{
        gridArea:"cell",
    },

    paragraph: {
        gridArea:"paragraph"
    },
    image:{
        gridArea:"img",
        width:"100%",


    },
    header:{
        height:'200px',
        backgroundColor:'white',
        paddingBottom:'10px',
        gridArea:"header",

        '@media only screen and (max-width: 600px)': {
            height:'100px',
        }
    },

};
const Header = withStyles(styles)((props) => {
    const {classes, data} = props;

    return (
        <div className={classNames(classes.header, props.className)}>
            <Typography variant="display1">
                {data.title}
            </Typography>
        </div>
    )
});

class Arrangement extends Component {
    constructor(props){
        super(props);

        this.state={
            isLoading: false,
        };
    }

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
    };

    componentDidMount(){
        window.scrollTo(0,0);
        //get data here
        this.loadEvent();
    }

    render() {
        const {classes, selected} = this.props;
        const data = (selected && selected.data)? selected.data : (selected)? selected : {};
        let button = <Button color="primary">Meld deg på</Button>;

            return (
            <Navigation isLoading={this.state.isLoading} footer>
                 {(this.state.isLoading)? null :
                    <div className={classes.root}>
                        <div className={classes.wrapper}>
                        <Header className={classes.header} data={{
                            title: data.title
                        }}
                        />
                        <Details className={classes.cell} data={{
                            date: data.start,
                            where: data.location,
                            what: data.what,
                            link: data.link
                        }} join={button}/>
                            <img className={classes.image} style={{width:'100%', height:'auto'}} src={data.image} alt={data.image_alt}/>
                            <Paragraph  className={classes.paragraph} data={{
                                subheader: data.title,
                                text: data.description,
                            }}/>
                        </div>
                    </div>
                 }
            </Navigation>
        );
    }
}

Arrangement.propTypes = {
    classes: PropTypes.object,
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
