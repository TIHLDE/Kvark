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

        '@media only screen and (max-width: 600px)': {
            display: 'flex',
            flexDirection: 'column',
            flexWrap: 'nowrap',
        }
    }
}

class LayoutGrid extends Component {

    constructor() {
        super();

        this.state = {
            areas: GridData.gridAreas,
            subGrids: GridData.subGrids,
        };
    }

    componentDidMount() {
        // Get data from database
    }

    render() {
        const {classes} = this.props;

        return (
            <div className={classes.root} style={{gridTemplateAreas: 'this.state.areas'}}>
                {this.state.subGrids.map((value, index) => {
                    return <SubGrid key={index} id={value.id} children={value.children} class={value.class} rows={value.rows} cols={value.cols} />
                })}
            </div>
        )
    }
}

export default withStyles(styles)(LayoutGrid);