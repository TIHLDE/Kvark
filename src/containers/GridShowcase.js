import React, { Component, Fragment } from 'react';
import Redir from '../components/Redir';

import GridDisplay from '../components/GridDisplay';
import GridElement from '../components/GridElement';

export default class extends Component {

    constructor(props) {
        super(props);
        this.state = {
            gridElements: new Array(),
            counter : 0,
        }
        this.handleClick = this.handleClick.bind(this);
    }

    handleClick(e) {
        //console.log(this.state.gridElements.length);
        this.setState({
            gridElements: [<GridElement key={this.state.counter + 1} id={this.state.counter} width={1} height={1} margin={0} />].concat(this.state.gridElements),
            counter: this.state.counter + 1,
        });
        //console.log(this.state.)
        this.forceUpdate();
    }

    render() {
        return (
            <Fragment>
                <Redir />
                <input type='button' className='medium_button' value='add grid element' onClick={this.handleClick} />
                <p>{this.state.counter}</p>
                <GridDisplay gridElements={this.state.gridElements} />
            </Fragment>
        )
    }
}
