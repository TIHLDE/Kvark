import React, {Component} from 'react';
import {withStyles} from '@material-ui/core/styles';
import PropTypes from 'prop-types';
import {connect} from 'react-redux';

// API and store imports
import API from '../api/api';
import { setSelectedItem } from '../store/actions/GridActions';

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
        const { dispatch } = this.props;

        // Get newsitem id
        const id = this.props.match.params.id;

        this.setState({isLoading: true});
        const response = API.getNewsItem(id).response();
        response.then((data) => {
            if (!response.isError) {
                dispatch(setSelectedItem(data));
            } else {
                // Redirect to 404
            }
            this.setState({isLoading: false});
        });
    }

    render() {
        const {selected} = this.props;

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
};

const stateValues = (state) => {
    return {
        selected: state.grid.selectedItem,
    };
};


export default connect(stateValues)(withStyles(styles)(NewsPage));
