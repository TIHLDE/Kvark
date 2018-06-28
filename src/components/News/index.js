import React, { Component } from 'react';

import { Card, CardImg, CardText, CardBody,
    CardTitle } from 'reactstrap';

import NoImageImage from '../../assets/img/no-image_image.png';


export default class News extends Component {

    constructor(props) {
        super(props);
        this.state = {
            image: this.props.image || NoImageImage,
            title: this.props.title || 'no title',
            text: this.props.text || 'no text',
        }
    }

    render() {
        return (
            <div>
                <Card>
                    <CardImg top width='100%' src={ this.state.image }/>
                    <CardBody>
                        <CardTitle>{ this.state.title }</CardTitle>
                        <CardText>{ this.state.text }</CardText>
                    </CardBody>
                </Card>
            </div>
        );
    }
}
