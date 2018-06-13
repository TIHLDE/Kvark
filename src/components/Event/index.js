import React, {Fragment, Component} from 'react';
import PropTypes from 'prop-types';

import Picture from '../../components/Picture';

export default class Event extends Component {
    render() {
        const d = this.props.data;
        return (
            <Fragment>
              <div className='EventContainer'>
                <div className='EventPicture'>
                  {d.picture}
                </div>
                <div className='EventOverlay'>
                  <div className='EventDetails'>
                    <p>{d.startDateTime.getDate()}-{d.endDateTime.getDate()}</p>
                  </div>
                </div>
                <div classname='EventTitle'>
                  {d.title}
                </div>
              </div>
            </Fragment>
        );
    }
}

Event.defaultProps = {
    data: undefined,
};

Event.propTypes = {
    data: PropTypes.shape({
        // Should the event be prioritized to always be displayed at the top?
        pinned: PropTypes.bool,
        // Used to differentiate the pinned events.
        pinnedPriority: PropTypes.number,

        // The event title is the text to be shown in the events feed.
        title: PropTypes.string.isRequired,
        // The picture to display.
        picture: PropTypes.objectOf(Picture),

        // The start date and time of the event.
        startDateTime: PropTypes.objectOf(Date),
        // The end date and time of the event.
        endDateTime: PropTypes.objectOf(Date),

        // Event contents.
        content: PropTypes.any, // NOTE: Not decided
    }),
};

