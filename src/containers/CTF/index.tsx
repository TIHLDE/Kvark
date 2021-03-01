import { useState, useEffect } from 'react';
import Helmet from 'react-helmet';

// Material UI Components
import { makeStyles } from '@material-ui/core/styles';

// Project Components
import Banner from 'components/layout/Banner';
import Navigation from 'components/navigation/Navigation';
import Modal from 'components/layout/Modal';

const useStyles = makeStyles((theme) => ({
  root: {
    marginBottom: theme.spacing(3),
    color: theme.palette.background.default,
    marginTop: 250,
    height: 1200,
    width: '100%',
    display: 'flex',
    justifyContent: 'center',
    fontSize: 36,
  },
  inputField: {
    color: theme.palette.background.default,
    height: 100,
  },
  memberProof: {
    display: 'flex',
    justifyContent: 'center',
  },
}));

const CTF = () => {
  const [ans, setAns] = useState('');
  const classes = useStyles();
  const [showModal, setShowModal] = useState(false);
  const flag = 'flag{f86c744e-2659-47dc-a81f-48e31a3818ae}';

  useEffect(() => {
    if (ans === '1') {
      setShowModal(true);
    }
  }, [ans]);
  return (
    // eslint-disable-next-line
    <Navigation>
      <Helmet>
        <title>Can you find me?</title>
      </Helmet>
      <Modal className={classes.memberProof} onClose={() => setShowModal(false)} open={showModal}>
        <div>{flag}</div>
      </Modal>
      <div className={classes.root}>
        Hvor mange ganger kan tallet 1 trekkes fra 1111?
        <input className={classes.inputField} onChange={(e) => setAns(e.target.value)} type='hidden' value={ans}></input>
      </div>
    </Navigation>
  );
};

export default CTF;
