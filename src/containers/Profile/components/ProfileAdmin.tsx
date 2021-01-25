import { Link } from 'react-router-dom';
import URLS from 'URLS';
import { Groups } from 'types/Enums';

// API and store import
import { HavePermission } from 'api/hooks/User';

// Text imports
import Text from 'text/AdminText';

// Material UI Components
import { makeStyles } from '@material-ui/core/styles';
import Button from '@material-ui/core/Button';

// Icons
import EventAdminIcon from 'assets/icons/eventadmin.svg';
import JobPostAdminIcon from 'assets/icons/jobpostadmin.svg';
import UserAdminIcon from 'assets/icons/useradmin.svg';
import NewsAdminIcon from 'assets/icons/news.svg';

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
        <InfoCard header='Arrangementer' justifyText src={EventAdminIcon} text={Text.events}>
          <Button className={classes.button} color='primary' component={Link} fullWidth to={URLS.eventAdmin} variant='contained'>
            Administrer arrangementer
          </Button>
        </InfoCard>
      </HavePermission>
      <HavePermission groups={[Groups.HS, Groups.INDEX, Groups.NOK]}>
        <InfoCard header='Jobbannonser' justifyText src={JobPostAdminIcon} text={Text.jobposts}>
          <Button className={classes.button} color='primary' component={Link} fullWidth to={URLS.jobpostsAdmin} variant='contained'>
            Administrer jobbannonser
          </Button>
        </InfoCard>
      </HavePermission>
      <HavePermission groups={[Groups.HS, Groups.INDEX]}>
        <InfoCard header='Nyheter' justifyText src={NewsAdminIcon} text={Text.news}>
          <Button className={classes.button} color='primary' component={Link} fullWidth to={URLS.newsAdmin} variant='contained'>
            Administrer nyheter
          </Button>
        </InfoCard>
      </HavePermission>
      <HavePermission groups={[Groups.HS, Groups.INDEX]}>
        <InfoCard header='Medlemmer' justifyText src={UserAdminIcon} text={Text.users}>
          <Button className={classes.button} color='primary' component={Link} fullWidth to={URLS.userAdmin} variant='contained'>
            Administrer medlemmer
          </Button>
        </InfoCard>
      </HavePermission>
    </div>
  );
}

export default Admin;
