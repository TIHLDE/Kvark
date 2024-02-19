import Edit from '@mui/icons-material/Edit';
import { Button, Dialog } from '@mui/material';
import { ButtonProps, styled, Theme, Typography, useMediaQuery, useTheme } from '@mui/material';
import { BioTenplate } from 'BioTemplate';
import { useState } from 'react';

const Bio = styled(BioTenplate)(({ theme }) => ({
  padding: theme.spacing(4, 3),
  display: 'block',
  margin: '0 auto',
  height: 'auto !important',
  width: '100% !important',
  maxHeight: 350,
  objectFit: 'contain',
}));

export type BioButtonProps = ButtonProps & {
  bioValue: string;
  subtitle?: string;
};

const EditBioButton = ({ bioValue, subtitle, children, ...props }: BioButtonProps) => {
  const [showEditBio, setShowEditBio] = useState(false);
  const theme = useTheme();
  const lgDown = useMediaQuery((theme: Theme) => theme.breakpoints.down('lg'));

  return (
    <>
      <Button variant='contained' {...props} endIcon={<Edit />} onClick={() => setShowEditBio(true)}>
        Redigér bio
        {children}
      </Button>

      <Dialog
        fullScreen={lgDown}
        onClose={() => setShowEditBio(false)}
        open={showEditBio}
        sx={{ '& .MuiPaper-root': { backgroundColor: (theme) => theme.palette.common.white } }}>
        <Bio bgColor={theme.palette.common.white} fgColor={theme.palette.common.black} size={1000} value={qrValue} />
        {subtitle && (
          <Typography align='center' sx={{ my: 0.25, color: (theme) => theme.palette.common.black }} variant='h3'>
            {subtitle}
          </Typography>
        )}
      </Dialog>
    </>
  );
};

export default EditBioButton;
