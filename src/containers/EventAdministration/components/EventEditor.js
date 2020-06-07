import React from 'react';
import PropTypes from 'prop-types';

// Material-UI
import {withStyles} from '@material-ui/core/styles';
import Divider from '@material-ui/core/Divider';
import CircularProgress from '@material-ui/core/CircularProgress';
import TextField from '@material-ui/core/TextField';
import Grid from '@material-ui/core/Grid';
import MenuItem from '@material-ui/core/MenuItem';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Switch from '@material-ui/core/Switch';
import ExpansionPanel from '@material-ui/core/ExpansionPanel';
import ExpansionPanelSummary from '@material-ui/core/ExpansionPanelSummary';
import ExpansionPanelDetails from '@material-ui/core/ExpansionPanelDetails';
import Typography from '@material-ui/core/Typography';

// Icons
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';

// Project components
import TextEditor from '../../../components/inputs/TextEditor';
import EventOptionalFieldsCreator from './EventOptionalFieldsCreator';
import EventRegistrationPriorities from './EventRegistrationPriorities';

const styles = (theme) => ({
  root: {
    padding: 20,
  },
  progress: {
    display: 'block',
    margin: 'auto',
    marginTop: 10,

    '@media only screen and (max-width: 800px)': {
      order: 1,
    },
  },
  field: {
    margin: '5px 0px',
    marginRight: 5,
    maxWidth: 300,
    width: '100%',
  },
  margin: {
    margin: '10px 0px',
  },
  flex: {
    display: 'flex',
    flexWrap: 'wrap',
    '@media only screen and (max-width: 1000px)': {
      flexDirection: 'column',
    },
  },
  expansionPanel: {
    width: '100%',
    boxShadow: '0px 2px 4px ' + theme.colors.border.main + '88',
    background: theme.colors.background.smoke,
  },
  switch: {
    color: theme.colors.text.light,
  },
});

function EventEditor(props) {
  const {classes, event, setEvent, categories} = props;
  const priorities = ['Lav', 'Middels', 'Høy'];

  return (
    <div className={classes.root}>
      {!event ?
        <CircularProgress className={classes.progress} /> :
        <form>
          <Grid container direction='column' wrap='nowrap'>
            <TextField variant='filled' className={classes.field} label='Tittel' value={event.title || ''} onChange={(e) => setEvent({...event, title: e.target.value})} required/>
            <TextField variant='filled' multiline rowsMax={3} className={classes.field} label='Sted' value={event.location || ''} onChange={(e) => setEvent({...event, location: e.target.value})}/>
            <div className={classes.flex}>
              <TextField variant='filled' className={classes.field} InputLabelProps={{shrink: true}} type='datetime-local' pattern='[0-9]{4}-[0-9]{2}-[0-9]{2}' label='Start' value={event.start_date.substring(0, 16) || new Date().toISOString().substring(0, 16)} onChange={(e) => setEvent({...event, start_date: e.target.value})}/>
              <TextField variant='filled' className={classes.field} InputLabelProps={{shrink: true}} type='datetime-local' pattern='[0-9]{4}-[0-9]{2}-[0-9]{2}' label='Slutt' value={event.end_date.substring(0, 16) || new Date().toISOString().substring(0, 16)} onChange={(e) => setEvent({...event, end_date: e.target.value})}/>
            </div>
            <FormControlLabel
              className={classes.switch}
              control={<Switch checked={event.sign_up || false} onChange={(e) => setEvent({...event, sign_up: e.target.checked})} color='primary' />}
              label='Åpen for påmelding'/>
            {event.sign_up &&
            <>
              <TextField variant='filled' className={classes.field} type='number' label='Antall plasser' value={event.limit} onChange={(e) => setEvent({...event, limit: e.target.value})} />
              <div className={classes.flex}>
                <TextField variant='filled' className={classes.field} InputLabelProps={{shrink: true}} type='datetime-local' pattern='[0-9]{4}-[0-9]{2}-[0-9]{2}' label='Start påmelding' value={event.start_registration_at.substring(0, 16) || new Date().toISOString().substring(0, 16)} onChange={(e) => setEvent({...event, start_registration_at: e.target.value})} />
                <TextField variant='filled' className={classes.field} InputLabelProps={{shrink: true}} type='datetime-local' pattern='[0-9]{4}-[0-9]{2}-[0-9]{2}' label='Slutt påmelding' value={event.end_registration_at.substring(0, 16) || new Date().toISOString().substring(0, 16)} onChange={(e) => setEvent({...event, end_registration_at: e.target.value})} />
                <TextField variant='filled' className={classes.field} InputLabelProps={{shrink: true}} type='datetime-local' pattern='[0-9]{4}-[0-9]{2}-[0-9]{2}' label='Avmeldingsfrist' value={event.sign_off_deadline.substring(0, 16) || new Date().toISOString().substring(0, 16)} onChange={(e) => setEvent({...event, sign_off_deadline: e.target.value})} />
              </div>
              <TextField variant='filled' className={classes.margin} label='Link til evalueringsundersøkelse' value={event.evaluate_link} onChange={(e) => setEvent({...event, evaluate_link: e.target.value})}/>
              {event.registration_priorities &&
                <div className={classes.margin}>
                  <ExpansionPanel className={classes.expansionPanel}>
                    <ExpansionPanelSummary
                      expandIcon={<ExpandMoreIcon />}
                      aria-controls='priorities'
                      id='priorities-header'
                    >
                      <Typography className={classes.heading}>Prioriterte</Typography>
                    </ExpansionPanelSummary>
                    <ExpansionPanelDetails>
                      <EventRegistrationPriorities event={event} setEvent={(item) => setEvent(item)} />
                    </ExpansionPanelDetails>
                  </ExpansionPanel>
                </div>
              }
              {event.optional_fields &&
                <div className={classes.margin}>
                  <ExpansionPanel className={classes.expansionPanel}>
                    <ExpansionPanelSummary
                      expandIcon={<ExpandMoreIcon />}
                      aria-controls='priorities'
                      id='priorities-header'
                    >
                      <Typography className={classes.heading}>Spørsmål ved påmelding ({event.optional_fields.length})</Typography>
                    </ExpansionPanelSummary>
                    <ExpansionPanelDetails>
                      <EventOptionalFieldsCreator optionalFields={event.optional_fields} handleOptionalFields={(item) => setEvent({...event, optional_fields: item})} />
                    </ExpansionPanelDetails>
                  </ExpansionPanel>
                </div>
              }
            </>}
            <TextEditor className={classes.textEditor} value={event.description || ''} onChange={(e) => setEvent({...event, description: e})}/>
            <Divider className={classes.margin} />
            <div className={classes.flex}>
              <TextField variant='filled' multiline rowsMax={3} className={classes.field} label='Logo bilde-url' value={event.image || ''} onChange={(e) => setEvent({...event, image: e.target.value})}/>
              <TextField variant='filled' multiline rowsMax={3} className={classes.field} label='Alternativ bildetekst' value={event.image_alt || ''} onChange={(e) => setEvent({...event, image_alt: e.target.value})}/>
            </div>
            <div className={classes.flex}>
              <TextField variant='filled' className={classes.field} select label='Proritering' value={event.priority || 0} onChange={(e) => setEvent({...event, priority: e.target.value})}>
                {priorities.map((value, index) => (
                  <MenuItem key={index} value={index}>
                    {value}
                  </MenuItem>
                ))}
              </TextField>
              <TextField variant='filled' className={classes.field} select label='Kategori' value={event.category || ''} onChange={(e) => setEvent({...event, category: e.target.value})}>
                {categories.map((value, index) => (
                  <MenuItem key={index} value={value.id}>
                    {value.text}
                  </MenuItem>
                ))}
              </TextField>
            </div>
          </Grid>
        </form>
      }
    </div>
  );
}

EventEditor.propTypes = {
  classes: PropTypes.object.isRequired,
  event: PropTypes.object.isRequired,
  setEvent: PropTypes.func.isRequired,
  categories: PropTypes.array.isRequired,
};

export default withStyles(styles)(EventEditor);
