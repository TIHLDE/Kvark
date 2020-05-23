import React, {Component} from 'react';
import {withStyles} from '@material-ui/core/styles';
import PropTypes from 'prop-types';
import {connect} from 'react-redux';

// Service and store imports
import NewsService from '../../api/services/NewsService';

// Project components
import Navigation from '../../components/navigation/Navigation';
import NewsRenderer from './components/NewsRenderer';

const styles = {

};

class NewsPage extends Component {

  constructor() {
    super();
    this.state = {
      isLoading: false,
    };
  }

  componentDidMount() {
    window.scrollTo(0, 0);
    this.loadNews();
  }

    // Loading news info
    loadNews = () => {
      // Get newsitem id
      const id = this.props.match.params.id;

      this.setState({isLoading: true});
      NewsService.getNewsById(id, (isError, data) => {
        this.setState({isLoading: false});
      });
    }

    render() {
      const {selected} = this.props;

      return (
        <Navigation footer isLoading={this.state.isLoading} whitesmoke>
          {(this.state.isLoading) ? null :
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
