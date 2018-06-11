import React, {Component} from 'react';
import PropTypes from 'prop-types';

//  CSS-imports
import './Progress.css';

export default class Progress extends Component {

    constructor() {
        super();
        this.container = React.createRef();
        this.barWidth = 400; // The width of the entire bar
    }

    componentDidMount() {
        // Gets the width of the bar
        this.barWidth = this.container.current.offsetWidth;
    }

    render() {
        // Check progress-type
        let progressStyle = 'Progress';
        if (this.props.circular) {
            progressStyle += ' Circular'; // Line progress
        }
        else {
            progressStyle += ' Line'; // Circular progress
        }

        // Initializes the color of the bar
        let progressColor = 'Blue';
        if (this.props.color === 'Red') {
            progressColor = 'Red';
        }
        else if (this.props.color === 'Yellow') {
            progressColor = 'Yellow';
        }
        else if (this.props.color === 'Green') {
            progressColor = 'Green';
        }

        // Making sure the progress value is between 0 and 100
        const progressValue = (this.props.progress > 100) ? 100 :
            (this.props.progress < 0) ? 0 : this.props.progress;

        // Styling for progressBar based on the progress
        const progressWidth = this.barWidth * progressValue / 100;
        const progressBarStyle = {
            width: progressWidth,
        };

        return (
            <div className={progressStyle} ref={this.container}>
                <div
                    className={progressColor}
                    id='progressBar'
                    style={progressBarStyle}>
                </div>
                <p id='progressText'>{progressValue}%</p>
            </div>
        );
    }
}

// Validates the type of the props
Progress.propTypes = {
    progress: PropTypes.number,
    circular: PropTypes.bool,
    color: PropTypes.string,
};
