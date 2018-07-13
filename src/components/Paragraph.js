import React, {Component} from 'react';
import PropTypes from 'prop-types';
import {withStyles} from '@material-ui/core/styles';
import {Grid, Typography, Button} from '@material-ui/core/';


const styles ={
  root:{
      height:300,
      width:'100%',
      position:'relative',
      backgroundColor:'red'
  },
    text:{
        top:0,
        right:0,
        left:0,

    }
};

class Paragraph extends Component {
    constructor(props){
        super(props);
        this.state={
            paragraph: props.paragraph,
            subHeading: props.subHeading,
            joined: props.joined
        };
        this.join=this.join.bind(this)
    };

    //Method that returns a red or green button depending on if the user has joined the arrangement or not.
    join = () =>{
        return (this.state.joined ? <Button color='green' onClick={this.joining.bind(this)}>Join!</Button>: <Button color='yellow' ><strong>Joined!</strong></Button>);
    };

    joining =() =>{
      this.setState({
          joined: true
      })
    };

    render() {
        return(
        <div style={styles.root}>
            <Grid container direction='column' wrap='nowrap' justify='center' style={styles.text}>
                <Typography color='inherit'><strong>
                    {this.state.subHeading}
                </strong>
                    {this.state.paragraph}
                </Typography>
            </Grid>
            <Grid>
                {this.join().bind(this)}
            </Grid>
        </div>
    )}
}

Text.propTypes={
    paragraph:PropTypes.string,
    joined: PropTypes.bool,
    subHeading: PropTypes.string
};

Paragraph.defaultProps={
    paragraph: 'No paragraph',
    joined: false,
    subHeading: 'no subheader'
};


export default withStyles(styles)(Paragraph);
