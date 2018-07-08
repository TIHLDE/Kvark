import React, {Component} from 'react';
import {withStyles} from '@material-ui/core/styles';

// Import GRID from JSON
import GridData from '../../data/grid.json';

// Project Components
import SubGrid from './SubGrid';

const styles = {
    root: {
        display: 'grid',
        gridTemplateAreas: GridData.gridAreas,

        // Prop-styles overwrite these changes, so was not able to change gridTemplateRow and Column.
        // Therefore the solution was to swap to flexBox on mobile-phones. Need to find a better solution for tablets.
        '@media only screen and (max-width: 600px)': {
            display: 'flex',
            flexDirection: 'column',
            flexWrap: 'nowrap',
        }
    }
}

// This is the parent grid which contains all the subgrids. This component will recieve
// the JSON-data, and create the wanted grid. 
// The current code is just a skeleton of the wanted grid and nothing is final. If you have
// any contributions to improvement, DONT BE AFRAID TO BREAK EVERYTHING. JUST DO IT!

class LayoutGrid extends Component {

    constructor() {
        super();

        this.state = {
            areas: GridData.gridAreas, // The grid template areas
            subGrids: GridData.subGrids, // Array of subgrids
        };
    }

    componentDidMount() {
        // Get data from database
    }

    render() {
        const {classes} = this.props;

        return (
            <div className={classes.root}>
                {this.state.subGrids.map((value, index) => {
                    return <SubGrid key={index} id={value.id} children={value.children} class={value.class} rows={value.rows} cols={value.cols} /> // Creating subgrids
                })}
            </div>
        )
    }
}

export default withStyles(styles)(LayoutGrid);