import { Link } from 'react-router-dom';
import URLS from 'URLS';
import { Groups } from 'types/Enums';
import { HavePermission } from 'api/hooks/User';

// Material UI Components
import { makeStyles } from '@material-ui/core/styles';
import Button from '@material-ui/core/Button';

// Icons
import EventAdminIcon from 'assets/icons/eventadmin.svg';
import GroupsAdminIcon from 'assets/icons/groups.svg';
import JobPostAdminIcon from 'assets/icons/jobpostadmin.svg';
import NewsAdminIcon from 'assets/icons/news.svg';
import UserAdminIcon from 'assets/icons/useradmin.svg';

// Project Components
import InfoCard from 'components/layout/InfoCard';

const useStyles = makeStyles((theme) => ({
  grid: {
    width: '100%',
    display: 'grid',
    gridTemplateColumns: '1fr',
    gridGap: theme.spacing(1),
  },
  button: {
    marginBottom: theme.spacing(1),
  },
}));

function Admin() {
  const classes = useStyles();

  return (
    <div className={classes.grid}>
      <HavePermission groups={[Groups.HS, Groups.INDEX, Groups.NOK, Groups.PROMO]}>
        <InfoCard header='Arrangementer' justifyText src={EventAdminIcon} text='Opprett, endre og slett arrangementer'>
          <Button className={classes.button} color='primary' component={Link} fullWidth to={URLS.eventAdmin} variant='contained'>
            Administrer arrangementer
          </Button>
        </InfoCard>
      </HavePermission>
      <HavePermission groups={[]}>
        <InfoCard header='Grupper' justifyText src={GroupsAdminIcon} text='Se og endre grupper'>
          <Button className={classes.button} color='primary' component={Link} fullWidth to={URLS.groups} variant='contained'>
            Administrer grupper
          </Button>
        </InfoCard>
      </HavePermission>
      <HavePermission groups={[Groups.HS, Groups.INDEX, Groups.NOK]}>
        <InfoCard header='Jobbannonser' justifyText src={JobPostAdminIcon} text='Opprett, endre og slett jobbannonser'>
          <Button className={classes.button} color='primary' component={Link} fullWidth to={URLS.jobpostsAdmin} variant='contained'>
            Administrer jobbannonser
          </Button>
        </InfoCard>
      </HavePermission>
      <HavePermission groups={[Groups.HS, Groups.INDEX]}>
        <InfoCard header='Medlemmer' justifyText src={UserAdminIcon} text='Aktiver, fjern og søk etter medlemmer'>
          <Button className={classes.button} color='primary' component={Link} fullWidth to={URLS.userAdmin} variant='contained'>
            Administrer medlemmer
          </Button>
        </InfoCard>
      </HavePermission>
      <HavePermission groups={[Groups.HS, Groups.INDEX]}>
        <InfoCard header='Nyheter' justifyText src={NewsAdminIcon} text='Opprett, endre og slett nyheter'>
          <Button className={classes.button} color='primary' component={Link} fullWidth to={URLS.newsAdmin} variant='contained'>
            Administrer nyheter
          </Button>
        </InfoCard>
      </HavePermission>
    </div>
  );
}

export default Admin;
