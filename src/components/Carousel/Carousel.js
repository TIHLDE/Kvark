import React, {Component} from 'react';
import './Carousel.css';

import Event1 from '../../assets/img/Frokost.jpg';
import Event2 from '../../assets/img/Eksamensfest.jpg';
import Event3 from '../../assets/img/Generalforsamling.jpg';

// Bootstrap Components
import { Button } from 'reactstrap';
import { Container, Row} from 'reactstrap';


class Carousel extends Component {

    state = {
        order: [1,2,3],
        images: [
            Event1,
            Event2,
            Event3,
        ]
    }

    previous = () => {
        const newOrder = this.state.order;
        const firstElement = newOrder[0];
        for(let i = 0; i < newOrder.length-1; i++){
            newOrder[i] = newOrder[i+1];
        }
        newOrder[newOrder.length-1] = firstElement;
        this.setState({order: newOrder});
    }

    next = () => {
        const newOrder = this.state.order;
        const lastElement = newOrder[newOrder.length-1];
        for(let i = newOrder.length-1; i > 0; i--){
            newOrder[i] = newOrder[i-1];
        }
        newOrder[0] = lastElement;
        this.setState({order: newOrder});
    }
    
    render() {
        const EventItem = (props) => (
            <div id={'item' + props.order} className='Item'>
                <img src={this.state.images[props.order-1]} alt='event'/>
            </div>
        )

        return (
            <div className="Root">
                <div className='Carousel'>
                    {this.state.order.map((value) => {
                        return <EventItem key={value} order={value} image={this.state.images[value]}/>
                    })}
                </div>
                <div className='Options'>
                    <Button className="Button" color='primary' onClick={this.next}>Meld deg på</Button>{' '}
                </div>
                <div className='Buttons'>
                    <Button className="Button" color='danger' id='nextButton' onClick={this.previous}>Previous</Button>{' '}
                    <Button className="Button" color='primary' onClick={this.next}>Next</Button>{' '}
                </div>
            </div>
        );
    }
}

export default Carousel;
