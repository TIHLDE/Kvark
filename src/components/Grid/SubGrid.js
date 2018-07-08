import React, {Component} from 'react';
import {withStyles} from '@material-ui/core/styles';
import classNames from 'classnames';

// Grid Items/Widgets
import EventList from '../EventList';
import Jodel from '../Jodel/Jodel';
import EventHeader from '../EventHeader';
import Poster from '../Poster';

import GridItem from './GridItem';


const styles = {
    subgrid: {
        display: 'grid',
        '@media only screen and (max-width: 600px)': {
            display: 'flex',
            flexDirection: 'column',
        }
    }
}

const getItem = (id, type, data) => {
    switch(type) {
        case "EVENTHEADER":
            return <EventHeader id={id} data={data}/>;
        case "EVENTLIST":
            return <EventList id={id} data={data}/>;
        case "NEWS":
            return <EventList id={id} data={data}/>;
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

        gridGap: 3,
        gridTemplateRows: props.rows,
        gridTemplateColumns: props.cols,
        alignContent: 'start',

       
        maxHeight: '100%',
        padding: 4,
        zIndex: 1000,        
    }

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
                        <GridItem key={index} rowSpan={value.rowSpan} colSpan={value.colSpan}>
                            {getItem(value.id, value.type, value.data)}
                        </GridItem>
                    )
                })
            }
        </div>
    )
}

export default withStyles(styles)(SubGrid);