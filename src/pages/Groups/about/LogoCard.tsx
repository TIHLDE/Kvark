import { Typography } from '@mui/material';
import { makeStyles } from 'makeStyles';
import { Group } from 'types/Group';

export type LogoCardProps = {
  group: Group;
};

const useStyles = makeStyles()(() => ({
  container: {
    display: 'flex',
    flexDirection: 'column',
  },
  logo: {
    height: '100px',
    width: '100px',
    margin: '10px',
    borderRadius: '20px',
  },
}));

const LogoCard = ({ group }: LogoCardProps) => {
  const { classes } = useStyles();
  if (group.image === null) {
    return null;
  }
  return (
    <>
      <div className={classes.container}>
        <Typography variant='h3'>Gruppe logo:</Typography>
        <img alt={group.image_alt} className={classes.logo} src={group.image} />
      </div>
    </>
  );
};
export default LogoCard;
