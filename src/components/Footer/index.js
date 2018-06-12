import React, {Component, Fragment} from 'react';
import tihlde_image from '../../assets/img/tihlde_image.png';
import instagram_icon from '../../assets/img/instagram_icon.png';
import facebook_icon from '../../assets/img/facebook_icon.ico';
import twitter_icon from '../../assets/img/twitter_icon.ico';

export default class Footer extends Component {
    render() {
        const styles = {
            footer: {
                width: '100%',
                height: '300px',
                backgroundColor: '#6666ff',
                position: 'relative',
                fontSize:'15px',
            },
            listing: {
                listStyleType:'none',
                marginTop:'10px'
            },
            listing1:{
                marginTop:'20px',
                listStyleType:'none'
            },
            contactDiv:{
                marginLeft:'300px',
                marginTop:'30px',
                width: '200px',
                height: '85%',
                position:'absolute',
            },
            copyrightDiv: {
                borderTopStyle:'solid',
                borderTopColor:'black',
                borderTopWidth:'1px',
                marginLeft:'10%',
                height:'25%',
                width:'80%',
                bottom: '0',
                position:'absolute'
            },
            icons_div:{
                width:'200px',
                height:'100%',
                marginLeft:'45%',
                marginTop:'3px'
            },
            icons:{
                listStyleType:'none',
                float: 'left',
                marginLeft:'10px'

            },
            tihlde_icon:{
                marginTop:'20px',
                marginLeft:'20px',
                width:'100px',
                position:'absolute',
                height:'60%',
                float:'left'
            },
            inputing:{
                width:'250px',
                height:'150px',
                marginLeft:'970px',
                marginTop:'80px',
                position:'absolute'
            }
        };

        const contact_information =[
            <li style={styles.listing}>Contact</li>,
            <li style={styles.listing1}>foo@bar.baz</li>,
            <li style={styles.listing}>+47 982 31 112</li>,
            <li style={styles.listing1}>Gunnerius gate 1</li>,
            <li style={styles.listing}>7012</li>
        ];

        const icons =[
            <li style={styles.icons}><a href="https://www.facebook.com"> <img src={facebook_icon} alt = "Facebook Icon" width='40px'/></a></li>,
            <li style={styles.icons}><a href="https://www.twitter.com"><img src={twitter_icon} alt = "Twitter Icon" width='40px'/></a></li>,
            <li style={styles.icons}><a href="https://www.instagram.com"><img src={instagram_icon} alt = "Instagram Icon" width='40px'/></a></li>,
        ];

        return(
            <Fragment>
                <footer style={styles.footer}>
                    <div style={styles.tihlde_icon}>
                        <img src={tihlde_image} alt ="Tihlde Logo" width='100%'/>
                    </div>
                    <div style={styles.contactDiv}>
                        <ul>
                            {contact_information}
                        </ul>
                    </div>
                    <div style={styles.inputing}>
                        <p>Enter your email and be the first to know when arrangement happens!</p>
                        <input placeholder="Join us today!"/>
                    </div>
                    <div style={styles.copyrightDiv}>
                        <div style={styles.icons_div}>
                            <ul>
                                {icons}
                            </ul>
                        </div>
                    </div>
                </footer>
            </Fragment>
        );
    }
}