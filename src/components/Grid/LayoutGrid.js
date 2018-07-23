import React, {Component, Fragment} from 'react';
import {withStyles} from '@material-ui/core/styles';

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
        padding: 5,

        '@media only screen and (max-width: 1000px)': {
            gridTemplateColumns: '1fr 1fr',
            
        },

        // Prop-styles overwrite these changes, so was not able to change gridTemplateRow and Column.
        // Therefore the solution was to swap to flexBox on mobile-phones. Need to find a better solution for tablets.
        '@media only screen and (max-width: 800px)': {
           gridTemplateColumns: '100%',
           padding: 0,
        }
    }
}

// This is the parent grid which contains all the subgrids. This component will recieve
// the JSON-data, and create the wanted grid. 
// The current code is just a skeleton of the wanted grid and nothing is final. If you have
// any contributions to improvement, DONT BE AFRAID TO BREAK EVERYTHING. JUST DO IT!

// Creates a item based on the type
const getItem = (id, type, data) => {
    switch(type) {
        case "EVENTHEADER":
            return <Poster id={id} data={data}/>;
        case "EVENTLIST":
            return <EventList id={id} data={data}/>;
        case "NEWS":
            return <NewsItem id={id} data={data}/>;
        case "JODEL":
            return <Jodel id={id} data={data}/>
        case "POSTER":
            return <Poster id={id} data={data}/>;
        default:
            return null;
    }
}

class LayoutGrid extends Component {

    constructor() {
        super();

        const areas = GridData.gridAreas;
        const middleAreas = GridData.gridAreas.split('.').join('');

        this.state = {
            areas: GridData.gridAreas, // The grid template areas
            // subGrids: GridData.subGrids, // Array of subgrids
            children: GridData.children,
        };
    }

    componentDidMount() {
        // Get data from database
    }

    render() {
        const {classes} = this.props;
        const {children} = this.state;
        const gridChildren = (children)? children : [];

        return (
            <div className={classes.root}>
                {gridChildren.map((value, index) => {
                    return (
                        <GridItem key={index} rowSpan={value.rowSpan} colSpan={value.colSpan} fullWidth={value.type === 'POSTER'}> {/* Wraps the entire item in a GridItem with specifed row- and colspan */}
                            {getItem(value.id, value.type, value.data)}
                        </GridItem>
                    )
                })}
            </div>
        )
    }
}

export default withStyles(styles)(LayoutGrid);