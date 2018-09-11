import React, {Component} from 'react';
import {withStyles} from '@material-ui/core/styles';
import PropTypes from 'prop-types';

// API imports
import API from '../../api/api';

// Material UI Components
import Grid from '@material-ui/core/Grid';
import TextField from '@material-ui/core/TextField';
import Divider from '@material-ui/core/Divider';
import Typography from '@material-ui/core/Typography';
import Button from '@material-ui/core/Button';
import Switch from '@material-ui/core/Switch';

// Icons

// Project Components
import NewsItem from './NewsItem';
import NewsRenderer from './NewsRenderer';

// External Componentns
import { Editor } from 'react-draft-wysiwyg';
import 'react-draft-wysiwyg/dist/react-draft-wysiwyg.css';
import draftToHtml from 'draftjs-to-html';
import htmlToDraft from 'html-to-draftjs';
import { EditorState, convertToRaw, ContentState } from 'draft-js';


const styles = {
    root: {
        display: 'grid',
        gridTemplateColumns: '1fr 2fr',
        padding: '30px 10px',
        fontSize: 17,
    },
    content: {
        maxWidth: 800,
        display: 'block',
        margin: '30px auto',
    },
    newsItemWrapper: {
        display: 'block',
        margin: 'auto',
        maxWidth: 400,
        height: 300,
    },
    newsItem: {
        width: 400,
        height: 300,
    },
    newsRendererWrapper: {
        gridColumn: 'span 2',
        paddingTop: 50,
        marginBottom: 300,
    },
    padding: {
        padding: 20,
    },
    margin: {
        margin: 10,
    },
    editor: {
        border: '1px solid black',
        marginBottom: 30,
    },
};

class NewsRegistrator extends Component {

    constructor() {
        super();
        this.state = {
            title: '',
            header: '',
            body: '',

            height: 0,
            width: 0,
            order: 0,

            image: '',
            imageAlt: '',

            editorSourceHTML: '',
        };
    }

    handleChange = (name) => (event) => {
        this.setState({[name]: event.target.value})
    }

    handleEditorChange = (editorState) => {
        const value = draftToHtml(convertToRaw(editorState.getCurrentContent()));
        this.setState({body: value});
    }

    saveNews = (event) => {
        event.preventDefault();

        const item = {
            title: this.state.title,
            header: this.state.header,
            body: this.state.body,
            height: this.state.height,
            width: this.state.width,
            order: this.state.order,
            image: this.state.image,
            imageAlt: this.state.imageAlt,
        };

        const response = API.createNewsItem(item).response();
        response.then((data) => {
            console.log(data);
            if(response.isError === false) {
                
            }
        });
    }

    render() {
        const {title, header, body, height, width, order, image, imageAlt} = this.state;
        const {classes} = this.props;
        const data = {title: title, header: header, body: body, image: image, imageAlt: imageAlt};

        return (
            <div className={classes.root}>
                <div className={classes.newsItemWrapper}>
                    <NewsItem className={classes.newsItem} data={data}/>
                </div>
                <form>
                    <Grid className={classes.content} container direction='column' wrap='nowrap' alignItems='center'>
                        <TextField className={classes.margin} fullWidth label='Tittel' value={title} onChange={this.handleChange('title')} required/>
                        <TextField className={classes.margin} fullWidth label='Header' value={header} onChange={this.handleChange('header')} required/>

                        <Grid container direction='row' wrap='nowrap' >
                            <TextField className={classes.margin} label='Width' type='number' value={width} onChange={this.handleChange('width')} required/>
                            <TextField className={classes.margin} label='Height' type='number' value={height} onChange={this.handleChange('height')} required/>
                            <TextField className={classes.margin} label='Order' type='number' value={order} onChange={this.handleChange('order')} required/>
                        </Grid>

                        <Grid container direction='row' alignItems='center'>
                            <div><Switch color='primary'/></div>
                            <Typography className={classes.padding} variant='body2' align='center'>Hide On Mobile</Typography>
                        </Grid>
                        
                        
                        
                        <TextField className={classes.margin} fullWidth label='Image' value={image} onChange={this.handleChange('image')} required/>
                        <TextField className={classes.margin} fullWidth label='ImageAlt' value={imageAlt} onChange={this.handleChange('imageAlt')} required/>
                        

                        <Typography className={classes.padding} variant='title' align='center'>Content:</Typography>
                        <Editor wrapperClassName={classes.editor} onChange={(e) => console.log(e)} onEditorStateChange={this.handleEditorChange}/>
                        <Button className={classes.padding} color='primary' variant='raised' onClick={this.saveNews} type='submit'>Save</Button>
                    </Grid>
                </form>
                
                <div className={classes.newsRendererWrapper}>
                    <Divider/>
                    <Typography className={classes.padding} variant='title' align='center'>Preview</Typography>
                    <Divider/>
                    <NewsRenderer newsData={data} />
                </div>
            </div>
        );
    }
}

NewsRegistrator.propTypes = {
    classes: PropTypes.object,
};

export default withStyles(styles)(NewsRegistrator);
