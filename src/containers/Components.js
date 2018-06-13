import React, {Component, Fragment} from 'react';
import PropTypes from 'prop-types';

import Footer from '../components/Footer';
import Header from '../components/Header';
import Loading from '../components/Loading';
import Paragraph from '../components/Paragraph';
import Picture from '../components/Picture';
import Progress from '../components/Progress';
import Event from '../components/Event';

import ColdDawnDuskImage from '../assets/img/cold-dawn-dusk.jpg';
import TihldeLogo from '../assets/img/tihlde_image.png';

class ExampleGroup extends Component {
    render() {
        const titleStyle = {
            textAlign: 'center',
            marginTop: '100px',
            marginBottom: '0px',
            marginLeft: 'auto',
            marginRight: 'auto',
            maxWidth: '80%',
            fontSize: '1.5em',
            boxShadow: '0 2px 2px 0 rgba(0, 0, 0, 0.2), 0 0px 20px 0 rgba(0, 0, 0, 0.19)',
            backgroundColor: '#EAEAEA',
        };
        return (
            <Fragment>
                <div style={titleStyle}>
                {this.props.title}
                </div>
                {this.props.children}
            </Fragment>
        );
    }
}
ExampleGroup.propTypes = {
    children: PropTypes.any,
    title: PropTypes.string,
};

class Example extends Component {
    render() {
        const outerStyle = {
            backgroundColor: 'white',
            maxWidth: '80%',
            textAlign: 'center',
            margin: 'auto',
            boxShadow: '0 4px 8px 0 rgba(0, 0, 0, 0.2), 0 6px 20px 0 rgba(0, 0, 0, 0.19)',
            marginBottom: '10px',
            marginLeft: 'auto',
            marginRight: 'auto',
        };

        const innerStyle = {
        };

        const titleStyle = {
            textAlign: 'center',
            margin: 'auto',
        };

        return (
            <Fragment>
                <div style={titleStyle}>
                    <p>{this.props.title}</p>
                </div>
                <div style={outerStyle}>
                    <div style={innerStyle}>
                        {this.props.children}
                    </div>
                </div>
            </Fragment>
        );
    }
}
Example.propTypes = {
    children: PropTypes.any,
    title: PropTypes.string,
};

/**
 * Demonstration page containing all the various components.
 */
export default class Components extends Component {
    constructor(props) {
        super(props);
        this.state = {
            progressNormal: 0,
            progressCircular: 0,
        };
        this.tickProgressbars = this.tickProgressbars.bind(this);
    }

    componentDidMount() {
        this.progressBarIntervalID = setInterval(this.tickProgressbars, 100);
    }

    tickProgressbars() {
        this.setState((props) => {return {
            progressNormal: (props.progressNormal + 1 > 100 ? 0 : props.progressNormal + 1),
            progressCircular: (props.progressCircular + 1 > 100 ? 0 : props.progressCircular + 1),
         };});
    }

    componentWillUnmount() {
        clearInterval(this.timerProgressBarIntervalID);
    }

    render() {
        const tihldePicture = <Picture src={TihldeLogo} alt='Example header picture'/>;
        const naturePicture = <Picture src={ColdDawnDuskImage} alt='Example event picture'/>;
        const eventData = {
            pinned: false,
            pinnedPriority: 0,
            title: 'Test event',
            picture: naturePicture,
            startDateTime: new Date(2018, 6, 22, 0, 0),
            endDateTime: new Date(2018, 6, 23, 5, 0),
            content: <Paragraph text='Example content'/>,
        };

        return (
            <Fragment>
                <ExampleGroup title='Header'>
                    <Example>
                        <Header text='Example header text' logo={tihldePicture}/>
                    </Example>
                </ExampleGroup>

                <ExampleGroup title='Paragraph'>
                    <Example>
                        <Paragraph text='This is an example paragraph.' />
                    </Example>
                </ExampleGroup>

                <ExampleGroup title='Progress'>
                    <Example title='Normal'>
                        <Progress progress={this.state.progressNormal} />
                        <Progress progress={this.state.progressNormal} color="Red"/>
                        <Progress progress={this.state.progressNormal} color="Green"/>
                    </Example>
                    <Example title='Circular'>
                        <Progress progress={this.state.progressCircular} circular={true}/>
                        <Progress progress={this.state.progressCircular} circular={true} color="Red"/>
                        <Progress progress={this.state.progressCircular} circular={true} color="Green"/>
                    </Example>
                </ExampleGroup>

                <ExampleGroup title='Loading'>
                    <Example>
                        <Loading/>
                    </Example>
                </ExampleGroup>

                <ExampleGroup title='Picture'>
                    <Example title='Normal'>
                        <Picture src={ColdDawnDuskImage} height={500} width={500}/>
                    </Example>
                    <Example title='Circular'>
                        <Picture src={ColdDawnDuskImage} height={500} width={500} type='circular'/>
                    </Example>
                </ExampleGroup>


                <ExampleGroup title='Event'>
                  <Example>
                    <Event data={eventData}/>
                  </Example>
                </ExampleGroup>

                <ExampleGroup title='Footer'>
                    <Example>
                        <Footer />
                    </Example>
                </ExampleGroup>

            </Fragment>
        );
    }
}
