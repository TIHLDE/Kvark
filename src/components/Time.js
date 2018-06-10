import React, { Component } from 'react';


export default class extends Component {

    state = {
        time : Date.now()
    }

    componentWillMount(){
        this.updateTime();
    }

    updateTime = () => {
        setTimeout(() => {
            this.setState({time: Date.now()});
            this.updateTime();
        },1000);
    }

    render() {
        return (
            <h1>Dette er tiden: {this.state.time}</h1>
        );
    }

}