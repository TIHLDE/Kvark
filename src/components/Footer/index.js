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
            <a href="https://www.facebook.com"><img src={facebookIcon} alt = "Facebook Icon" width='40px'/></a>,
            <a href="https://www.twitter.com"><img src={twitterIcon} alt = "Twitter Icon" width='40px'/></a>,
            <a href="https://www.instagram.com"><img src={instagramIcon} alt = "Instagram Icon" width='40px'/></a>,
        ];

        return (
            <footer className="Footer">
                <div id="tihldeIcon">
                    <img src={tihldeImage} alt ="Tihlde Logo" width='100%'/>
                </div>
                <div id="contactDiv">
                    <ul>
                        {contactInformation.map((value, index) => <li key={index}>{value}</li>)}
                    </ul>
                </div>
                <div id="inputing">
                    <p>Enter your email and be the first to know when arrangement happens!</p>
                    <input placeholder="Join us today!"/>
                </div>
                <div id="copyRightDiv">
                    <div id="iconDivs">
                        <ul>
                            {icons.map((value, index) => <li className='Icons' key={index}>{value}</li>)}
                        </ul>
                    </div>
                </div>
            </footer>
        );
    }
}
