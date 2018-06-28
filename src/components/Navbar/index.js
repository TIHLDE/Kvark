import React, {Component} from 'react';

// Bootstrap Component
import {Navbar as BootNav, NavbarBrand} from 'reactstrap';

export default class Navbar extends Component {
    render() {
        return (
            <BootNav style={{backgroundColor: 'var(--tihlde-blaa)'}}>
                <NavbarBrand style={{color: 'white'}}>TIHLDE</NavbarBrand>
            </BootNav>
        );
    }
}
