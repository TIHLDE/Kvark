import React, { Component } from 'react';

import { Route, Link } from 'react-router-dom';


export default class extends Component {

    render() {
        return (
            <div className='redir'>
                Skift til side: <input type='text' onChange={e => this.url = e.target.value} placeholder='/bedrifter' />
                <Link to={{ pathname: this.url }}>gå til</Link>
            </div>
        );
    }

    url = "";

}
