import React, {Component, Fragment} from 'react';
import {withStyles} from '@material-ui/core/styles';

// Import GRID from JSON
// NOTE: grid_minmal.json contains fewer grid elements than grid.json,
// and as grid.json is loaded from the Tihlde API, we can see it working,
// while retaining a semi functional site when it does not work.
import GridData from '../../data/grid_minimal.json';

// Grid Items/Widgets
import EventList from '../EventList';
import Jodel from '../Jodel/Jodel';
import Poster from '../Poster';
import NewsItem from '../NewsItem';

import GridItem from './GridItem';

import Api from '../../api/api';
import WebAuth from '../../api/webauth';
import {TOKEN} from '../../api/HttpHandler';
import {get} from '../../api/http';
import Utils from '../../utils.js';

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
        case "event_header":
            return <Poster id={id} data={data}/>;
        case "eventlist":
            return <EventList id={id} data={data}/>;
        case "news":
            return <NewsItem id={id} data={data}/>;
        case "jodel":
            return <Jodel id={id} data={data}/>;
        case "poster":
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
        // Load the griditems from the Tihlde API
        const resp = Api.getGridItems().catch((err) => {
            console.log('Unable to get grid items: ', err);
        }).then((data) => {
            console.log('Items: ', data);
            // NOTE: The Tihlde API uses snake case, but since JavaScript uses
            // camel case, it converts all keys in the recieved data
            // from snake case to camel case.
            // If this is not wanted (performance, inconsistency, etc.) one
            // can remove this line, but one has to change all occourences of
            // camel case to snake case.
            data = Array.from(data);
            const children = data.map((v, i) => {
                return Utils.recursiveSnakeToCamelCase(v);
            });
            this.setState({children: children});
        });
    }

    render() {
        const {classes} = this.props;
        const {children} = this.state;
        const gridChildren = (children)? children : [];

        return (
            <div className={classes.root}>
                {gridChildren.map((value, index) => {
                    return (
                        <GridItem key={index} height={value.height} width={value.width} fullWidth={value.type === 'poster'}> {/* Wraps the entire item in a GridItem with specifed row- and colspan */}
                            {getItem(value.id, value.type, value.data)}
                        </GridItem>
                    )
                })}
            </div>
        )
    }
}

export default withStyles(styles)(LayoutGrid);
