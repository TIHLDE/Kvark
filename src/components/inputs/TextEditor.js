import React, {Component, Fragment} from 'react';
import {withStyles} from '@material-ui/core/styles';
import classNames from 'classnames';
import PropTypes from 'prop-types';

// Material UI Components
import Input from '@material-ui/core/Input';
import Grid from '@material-ui/core/Grid';
import IconButton from '@material-ui/core/IconButton';
import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';

// Icons
import Bold from '@material-ui/icons/FormatBold';
import Italic from '@material-ui/icons/FormatItalic';
import Strike from '@material-ui/icons/StrikethroughS';
import Bulleted from '@material-ui/icons/FormatListBulleted';
import Numbered from '@material-ui/icons/FormatListNumbered';
import Image from '@material-ui/icons/Image';
import Breakline from '@material-ui/icons/SubdirectoryArrowLeft';

// External Components
import ReactMarkdown from 'react-markdown';
import breaks from 'remark-breaks';

const styles = (theme) => ({
  root: {
    width: '100%',
    height: '100%',
  },
  tabs: {
    color: theme.colors.text.main,
  },
  input: {
    width: '100%',
    height: '100%',
  },
  toolbox: {
    backgroundColor: theme.colors.background.main,
    minHeight: 30,
    padding: 4,
  },
  preview: {
    padding: 10,
    minHeight: 180,
  },
  textBtn: {
    fontSize: 19,
    fontWeight: 'bold',
  },
  iconBtn: {
    borderRadius: 0,
    padding: 4,
    height: 36,
    marginRight: 4,
  },
  emptySpace: {
    flexGrow: 1,
    maxWidth: 50,
  },
});

const ToolbarAction = withStyles(styles)((props) => {
  const {classes, children} = props;
  return (
    <IconButton className={classes.iconBtn} onClick={props.onClick}>
      {React.isValidElement(children) ? children : <span className={classes.textBtn}>{children}</span>}
    </IconButton>
  );
});

ToolbarAction.propTypes = {
  classes: PropTypes.object,
  children: PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.object,
  ]),
};

class TextEditor extends Component {
  constructor() {
    super();
    this.state = {
      tabValue: 0,
      cursorPos: 0,
      text: '',
    };

    this.input = React.createRef();
  }

    handleChange = (event) => {
      this.setState({text: event.target.value, cursorPos: this.input.selectionStart});
      if (this.props.onChange) {
        this.props.onChange(event.target.value);
      }
    }

    handleTabChange = (event, value) => {
      this.setState({tabValue: value});
    }

    appendTextAtCursor = (textToAppend) => {
      const text = this.input.value;
      const cursorPos = this.input.selectionStart === 0 ? this.state.cursorPos : this.input.selectionStart;
      const newText = text.substring(0, cursorPos) + textToAppend + text.substring(cursorPos, text.length);
      if (this.props.onChange) {
        this.props.onChange(newText);
      }
      this.setState({cursorPos: cursorPos + textToAppend.length});

      this.setSelectionStart(cursorPos + textToAppend.length);
    }

    setSelectionStart = (position) => {
      if (position < 0) {
        position = 0;
      }
      setTimeout(() => this.input.setSelectionRange(position, position), 0);
      this.setState({cursorPos: position});
      this.input.focus();
    }

    appendBold = () => {
      this.appendTextAtCursor('****');
      this.setSelectionStart(this.input.selectionStart + 2);
    }

    appendItalic = () => {
      this.appendTextAtCursor('__');
      this.setSelectionStart(this.input.selectionStart + 1);
    }

    appendStrike = () => {
      this.appendTextAtCursor('~~~~');
      this.setSelectionStart(this.input.selectionStart + 2);
    }

    appendBulletPoint = (type) => () => {
      this.appendTextAtCursor('\n'.concat(type, ' '));
    }

    appendImage = () => {
      this.appendTextAtCursor('![ALT_TEXT](IMAGE_URL)');
      this.setSelectionStart(this.input.selectionStart);
    }

    appendBreakline = () => {
      this.appendTextAtCursor('\n&nbsp;');
      this.setSelectionStart(this.input.selectionStart);
    }

    render() {
      const {classes, disableToolbox, disablePreview} = this.props;
      const {tabValue} = this.state;
      const value = this.props.value || '';
      return (
        <div className={classNames(classes.root, this.props.className)}>
          {!disablePreview && <Tabs className={classes.tabs} value={this.state.tabValue} onChange={this.handleTabChange}>
            <Tab label='Write' />
            <Tab label='Preview' />
          </Tabs>}
          {tabValue === 0 && <Fragment>
            {!disableToolbox && <Grid className={classNames(classes.toolbox, this.props.toolboxClass)} container direction='row'>
              <ToolbarAction onClick={() => this.appendTextAtCursor('### ')}>H</ToolbarAction>
              <ToolbarAction onClick={() => this.appendTextAtCursor('#### ')}>H2</ToolbarAction>
              <ToolbarAction onClick={() => this.appendTextAtCursor('##### ')}>H3</ToolbarAction>
              <ToolbarAction onClick={this.appendBold}><Bold/></ToolbarAction>
              <ToolbarAction onClick={this.appendItalic}><Italic/></ToolbarAction>
              <ToolbarAction onClick={this.appendStrike}><Strike/></ToolbarAction>

              <div className={classes.emptySpace} />
              <ToolbarAction onClick={this.appendImage}><Image/></ToolbarAction>
              <ToolbarAction onClick={this.appendBulletPoint('*')}><Bulleted/></ToolbarAction>
              <ToolbarAction onClick={this.appendBulletPoint('1.')}><Numbered/></ToolbarAction>
              <ToolbarAction onClick={this.appendBreakline}><Breakline/></ToolbarAction>
            </Grid>}
            <Input
              className={classNames(classes.input, this.props.editorClass)}
              multiline
              rows={10}
              rowsMax={20}
              disableUnderline
              value={value}
              inputRef={(el) => this.input = el}
              onChange={this.handleChange}/>
          </Fragment>
          }
          {tabValue === 1 && <div className='renderer'><ReactMarkdown className={classes.preview} source={value} plugins={[breaks]} /></div>}
        </div>
      );
    }
}

TextEditor.propTypes = {
  classes: PropTypes.object,
  disableToolbox: PropTypes.bool,
  disablePreview: PropTypes.bool,
  onChange: PropTypes.func,
  value: PropTypes.string,
  className: PropTypes.string,
  toolboxClass: PropTypes.string,
  editorClass: PropTypes.string,
};

export default withStyles(styles)(TextEditor);
