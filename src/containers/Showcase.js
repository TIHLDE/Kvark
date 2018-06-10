import React, { Component, Fragment } from 'react';
import Redir from '../components/Redir';

import '../assets/css/showcase.css';

export default class extends Component {

    render() {
        return (
            <Fragment>
                <Redir />
                <input type='button' className='light_button' value='Button' />
                <input type='button' className='medium_button' value='Button' />
                <input type='button' className='heavy_button' value='Button' />
                <input type='button' value='Button' />
                <br />
                <br />
                <input type='text' placeholder='lorem ipsum' />
                <br />
                <br />
                <input type='text' className='no_decoration' placeholder='lorem ipsum' />

                <p>Lorem ipsum</p>
                <p className='serif_text'>Lorem ipsum</p>
                <p className='serif_text text_shadow_thin'>Lorem ipsum</p>
                <p className='serif_text text_shadow_thicc'>Lorem ipsum</p>
                <p className='thin_text'>Lorem ipsum</p>
                <p className='thin_text text_shadow_thicc'>Lorem ipsum</p>
                <p className='thin_text italic'>Lorem ipsum</p>
                <h1 className='thin_text italic large_text'>Overskrift!</h1>
                <h1 className='thin_text large_text'>Overskrift!</h1>
                <h1 className='large_text'>Overskrift!</h1>
            </Fragment>
        )
    }


}
