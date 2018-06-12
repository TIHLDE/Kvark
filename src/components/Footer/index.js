import React, {Component, Fragment} from 'react';
import './Footer.css';

import tihldeImage from '../../assets/img/tihlde_image.png';
import instagramIcon from '../../assets/img/instagram_icon.png';
import facebookIcon from '../../assets/img/facebook_icon.ico';
import twitterIcon from '../../assets/img/twitter_icon.ico';

export default class Footer extends Component {
    render() {
        const contactInformation = [
            <li>Contact</li>,
            <li id="li2">foo@bar.baz</li>,
            <li>+47 982 31 112</li>,
            <li id="li2">Gunnerius gate 1</li>,
            <li>7012</li>
        ];

        const icons = [
            <li className="Icons"><a href="https://www.facebook.com"> <img src={facebookIcon} alt = "Facebook Icon" width='40px'/></a></li>,
            <li className="Icons"><a href="https://www.twitter.com"><img src={twitterIcon} alt = "Twitter Icon" width='40px'/></a></li>,
            <li className="Icons"><a href="https://www.instagram.com"><img src={instagramIcon} alt = "Instagram Icon" width='40px'/></a></li>
        ];

        return (
            <footer className="Footer">
                <div id="tihldeIcon">
                    <img src={tihldeImage} alt ="Tihlde Logo" width='100%'/>
                </div>
                <div id="contactDiv">
                    <ul>
                        {contactInformation}
                    </ul>
                </div>
                <div id="inputing">
                    <p>Enter your email and be the first to know when arrangement happens!</p>
                    <input placeholder="Join us today!"/>
                </div>
                <div id="copyRightDiv">
                    <div id="iconDivs">
                        <ul>
                            {icons}
                        </ul>
                    </div>
                </div>
            </footer>
        );
    }
}
