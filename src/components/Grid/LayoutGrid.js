import React, {Component} from 'react';
import {withStyles} from '@material-ui/core/styles';
import PropTypes from 'prop-types';

// Import GRID from JSON
import GridData from '../../data/grid.json';

// Grid Items/Widgets
import EventList from '../EventList';
import Jodel from '../Jodel/Jodel';
import Poster from '../Poster';
import NewsItem from '../NewsItem';

import GridItem from './GridItem';

const styles = {
    root: {
        display: 'grid',
        // gridTemplateAreas: GridData.gridAreas,
        gridTemplateColumns: 'repeat(' + GridData.gridColumns + ', 1fr)',
        gridTemplateRows: 'auto',
        gridGap: '5px',

        maxWidth: 1400,
        margin: 'auto',
        marginBottom: 50,
        padding: '0 5px 5px 5px',

        '@media only screen and (max-width: 1000px)': {
            gridTemplateColumns: '1fr 1fr',
        },

        // Prop-styles overwrite these changes, so was not able to change gridTemplateRow and Column.
        // Therefore the solution was to swap to flexBox on mobile-phones. Need to find a better solution for tablets.
        '@media only screen and (max-width: 800px)': {
           gridTemplateColumns: '100%',
           padding: '0 5px',
        },
    },
};

// This is the parent grid which contains all the subgrids. This component will recieve
// the JSON-data, and create the wanted grid.
// The current code is just a skeleton of the wanted grid and nothing is final. If you have
// any contributions to improvement, DONT BE AFRAID TO BREAK EVERYTHING. JUST DO IT!

// Creates a item based on the type
const getItem = (id, type, data) => {
    switch (type) {
        case 'eventlist':
            return <EventList id={id} data={data}/>;
        case 'news':
            return <NewsItem id={id} data={data}/>;
        case 'jodel':
            return <Jodel id={id} data={data}/>;
        case 'poster':
            return <Poster id={id} data={data}/>;
        default:
            return null;
    }
};

class LayoutGrid extends Component {

    constructor() {
        super();

        this.state = {
            children: GridData.children,
        };
    }

    componentDidMount() {
        // Get data from database
    }

    render() {
        const {classes, grid} = this.props;
        const children = (grid)? grid : [];
        console.log(children);

        return (
            <div className={classes.root}>
                {children.map((value, index) => {
                    return (
                        <GridItem key={index} rowSpan={value.height} colSpan={value.width} fullWidth={value.fullWidth} order={value.order}> {/* Wraps the entire item in a GridItem with specifed row- and colspan */}
                            {getItem(value.id, value.type, value.data)}
                        </GridItem>
                    );
                })}
            </div>
        );
    }
}

LayoutGrid.propTypes = {
    classes: PropTypes.object,
    grid: PropTypes.array,
};

export default withStyles(styles)(LayoutGrid);
