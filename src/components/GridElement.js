import React, { Component } from 'react';

export default class extends Component {

    constructor(props) {
        super(props);
        this.state = {
            id: props.id,
            width: props.width,
            height: props.height,
            margin: props.margin,
        }
        this.handleWidthChange = this.handleWidthChange.bind(this);
        this.handleHeightChange = this.handleHeightChange.bind(this);
        this.handleMarginChange = this.handleMarginChange.bind(this);
    }

    handleWidthChange(e) {
        this.setState({
            id: this.state.id,
            width: e.target.value,
            height: this.state.height,
            margin: this.state.margin,
        });
        this.forceUpdate();
    }

    handleHeightChange(e) {
        this.setState({
            id: this.state.id,
            width: this.state.width,
            height: e.target.value,
            margin: this.state.margin,
        });
        this.forceUpdate();
    }

    handleMarginChange(e) {
        this.setState({
            id: this.state.id,
            width: this.state.width,
            height: this.state.height,
            margin: e.target.value,
        });
        this.forceUpdate();
    }

    render() {
        console.log(this.state.margin);
        let style = {
            marginLeft: this.state.margin + 'px',
            marginRight: this.state.margin + 'px',
            gridColumn: 'span ' + this.state.width,
            gridRow: 'span ' + this.state.height,
        };

        return (
            <div className='main_grid_element' id={this.state.id} style={style} >
                <h2>{this.state.id}</h2>
                Bredde: <input type='range' defaultValue={this.state.width} min='1' max='3' step='1' onChange={this.handleWidthChange} />
                <br />
                Height: <input type='range' defaultValue={this.state.height} min='1' max='3' step='1' onChange={this.handleHeightChange} />
                <br />
                Margin: <input type='range' defaultValue={this.state.margin} min='-10' max='10' step='1' onChange={this.handleMarginChange} />
                <br />
                Bredde = {this.state.width}
                <br />
                Høyde = {this.state.height}
                <br />
                Margin = {this.state.margin}
            </div>
        );
    }
}
