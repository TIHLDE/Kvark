import React, { Component } from 'react';

export default class extends Component {
    render() {
        return (
            <div className='main_grid_display'>
                {this.props.gridElements}
            </div>
        )
    }
}
