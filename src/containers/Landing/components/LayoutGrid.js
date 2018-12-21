import React, {Component} from 'react';
import {withStyles} from '@material-ui/core/styles';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import { isDesktop } from '../../../utils';

// Import GRID from JSON
// NOTE: grid_minmal.json contains fewer grid elements than grid.json,
// and as grid.json is loaded from the Tihlde API, we can see it working,
// while retaining a semi functional site when it does not work.
// import GridData from '../../../data/grid_minimal.json';

// Grid Items/Widgets
// import EventList from './EventList';
import Poster from './Poster';
// import NewsGroup from './NewsGroup';
import ImageGallery from './ImageGallery';
import EventSection from './EventSection';
import NewsSection from './NewsSection';

//import GridItem from './GridItem';

const styles = {
    root: {
       /*  display: 'grid',
        gridTemplateColumns: 'repeat(' + GridData.gridColumns + ', 1fr)',
        girdTemplateRows: 'auto',
        gridAutoRows: '275px',
        gridGap: '20px', */

        //  margin: 'auto',
        //marginBottom: 50,
        //padding: '0 5px 5px 5px',
        //maxWidth: 1200,

        /* '@media only screen and (max-width: 1000px)': {
            gridTemplateColumns: '1fr 1fr',
        },

        '@media only screen and (max-width: 800px)': {
           gridTemplateColumns: '100%',
           padding: '5px 5px',
           gridAutoRows: 'auto',
        }, */
    },
    topPadding: {
        //paddingTop: 20,
    },
    bottomPadding: {
        //paddingBottom: 200,
    },
    topRow: {

    },
};

// Creates a item based on the type
const getItem = (id, type, data, height) => {
    switch (type) {
        case 'eventlist':
            return <EventSection id={id} data={data} height={height}/>;
        case 'news':
            return <NewsSection id={id} data={data}/>;
        case 'poster':
            return <Poster id={id} data={data}/>;
        case 'imagegallery':
            return <ImageGallery id={id} data={data}/>;
        default:
            return null;
    }
};

class LayoutGrid extends Component {

    render() {
        const {classes, grid} = this.props;
        const children = (grid)? isDesktop() ? grid : grid.filter((item) => !item.hideOnMobile) : [];
        const topPadding = !(children.length > 0 && children[0].fullWidth);
        const bottomPadding = (children.length > 0 && children[children.length-1].fullWidth);

        return (
            <div className={classNames(classes.root, (topPadding)? classes.topPadding : classes.topRow, (bottomPadding)? classes.bottomPadding: '')}>
                {children.map((value, index) => {
                    return (
                        //<GridItem key={index} rowSpan={value.height} colSpan={value.width} fullWidth={value.fullWidth} order={value.order}> {/* Wraps the entire item in a GridItem with specifed row- and colspan */}
                        <div key={index}>
                            {getItem(value.id, value.type, value.data, value.height)}
                        </div>
                       // </GridItem>
                    );
                })}
                {(children.length === 0)?
                    <Poster data={{header: 'Oi oi oi!', subheader: 'Her skjedde det noe galt', color: 'var(--tihlde-blaa)'}}/>
                    : null}
            </div>
        );
    }
}

LayoutGrid.propTypes = {
    classes: PropTypes.object,
    grid: PropTypes.array,
};

export default withStyles(styles)(LayoutGrid);
