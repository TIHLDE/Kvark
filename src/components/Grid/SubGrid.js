import React from 'react';
import {withStyles} from '@material-ui/core/styles';
import PropTypes from 'prop-types';

// Grid Items/Widgets
import EventList from '../EventList';
import Jodel from '../Jodel/Jodel';
import Poster from '../Poster';
import NewsItem from '../NewsItem';

import GridItem from './GridItem';


const styles = {
    subgrid: {
        display: 'grid',
        gridGap: 10,
        
        // Prop-styles overwrite these changes, so was not able to change gridTemplateRow and Column.
        // Therefore the solution was to swap to flexBox on mobile-phones. Need to find a better solution for tablets.
        '@media only screen and (max-width: 600px)': { 
            display: 'flex',
            flexDirection: 'column',
        }
    }
}

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

const SubGrid = (props) => {
    const {classes} = props;

    const gridStyles = {
        
        gridArea: props.id,

        gridGap: 4,
        gridTemplateRows: props.rows,
        gridTemplateColumns: props.cols,
        alignContent: 'start',

       
        maxHeight: '100%',
        padding: 4,
        zIndex: 1000,        
    }

    // If the grid has class 'fullWidth', make it fullWidth (reduce marginBottom and zIndex)
    const fullWidthStyles = {
        padding: 0,
        marginBottom: '-100px',
        zIndex: 10,
    }

    const style = (props.class === 'fullWidth')? {...gridStyles, ...fullWidthStyles} : gridStyles;
   
    return (
        <div className={classes.subgrid} style={style}>
            {(!props.children)? null : 
                props.children.map((value, index) => {
                    return (
                        <GridItem key={index} rowSpan={value.rowSpan} colSpan={value.colSpan}> {/* Wraps the entire item in a GridItem with specifed row- and colspan */}
                            {getItem(value.id, value.type, value.data)}
                        </GridItem>
                    )
                })
            }
        </div>
    )
}

SubGrid.propTypes = {
    id: PropTypes.string,       // ID of the substring, should represent a GridTemplateArea name
    children: PropTypes.array,  // The array of items in the subgrid
    class: PropTypes.string,    // The class of the SubGrid. Should either 'fullWidth' or 'normal'
    rows: PropTypes.string,     // The GridTemplateRows value
    cols: PropTypes.string,     // The GridTemplateColumn value
};

export default withStyles(styles)(SubGrid);