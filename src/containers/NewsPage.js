import React, {Component} from 'react';
import {withStyles} from '@material-ui/core/styles';
import PropTypes from 'prop-types';
import {connect} from 'react-redux';

// API and store imports
import API from '../api/api';
import {GeneralActions} from '../store/actions/MainActions';

// Project components
import Navigation from '../components/Navigation';
import NewsRenderer from '../components/NewsComponents/NewsRenderer';


const styles = {
    
};

class NewsPage extends Component {

    constructor() {
        super();
        this.state = {
            isLoading: false,
        }
    }
    
    componentDidMount() {
        window.scrollTo(0,0);
        this.loadNews();
    }

    // Loading news info
    loadNews = () => {
        // Get newsitem id
        const id = this.props.match.params.id;

        this.setState({isLoading: true});
        const response = API.getNewsItem(id).response();
        response.then((data) => {
            if (!response.isError) {
                this.props.setSelectedItem(data);
            } else {
                // Redirect to 404
            }
            this.setState({isLoading: false});
        });
    }

    render() {
        const {classes, selected} = this.props;
        

        return (
            <Navigation footer isLoading={this.state.isLoading}>
                {(this.state.isLoading)? null : 
                    <NewsRenderer newsData={selected} />
                }
            </Navigation>
        );
    }
}

NewsPage.propTypes = {
    classes: PropTypes.object,
    selected: PropTypes.object,
    match: PropTypes.object,
    grid: PropTypes.array,
    selectStoredItem: PropTypes.func,
    setSelectedItem: PropTypes.func,
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

export default connect(stateValues, dispatchers)(withStyles(styles)(NewsPage));
