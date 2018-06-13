import React, {Component} from 'react';
import './Footer.css';

import tihldeImage from '../../assets/img/tihlde_image.png';
import instagramIcon from '../../assets/img/instagram_icon.png';
import facebookIcon from '../../assets/img/facebook_icon.ico';
import twitterIcon from '../../assets/img/twitter_icon.ico';

export default class Footer extends Component {
    render() {
        const contactInformation = [
            'Contact',
            'foo@bar.baz',
            '+47 982 31 112',
            'Gunnerius gate 1',
            '7012',
        ];

        const icons = [
            {link: 'https://www.facebook.com', iconSrc: facebookIcon, iconAlt: 'Facebook Icon'},
            {link: 'https://www.twitter.com', iconSrc: twitterIcon, iconAlt: 'Twitter Icon'},
            {link: 'https://www.instagram.com', iconSrc: instagramIcon, iconAlt: 'Instagram Icon'},
        ];

        return (
            <footer className="Footer">
                <div id="tihldeIcon">
                    <img src={tihldeImage} alt="Tihlde Logo" width='100%' />
                </div>
                <div id="contactDiv">
                    <ul>
                        {contactInformation.map((value, index) => <li key={index}>{value}</li>)}
                    </ul>
                </div>
                <div id="inputing">
                    <p>Enter your email and be the first to know when arrangement happens!</p>
                    <input placeholder="Join us today!" />
                </div>
                <div id="copyRightDiv">
                    <div id="iconDivs">
                        <ul>
                            {icons.map((value, index) =>
                                <li className='Icons' key={index}>{
                                    <a href={value.link}>
                                        <img src={value.iconSrc} alt={value.iconAlt} width='40px' />
                                    </a>
                                }</li>)
                            }
                        </ul>
                    </div>
                </div>
            </footer>
        );
    }
}
