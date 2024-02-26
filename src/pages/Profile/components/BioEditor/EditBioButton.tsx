import Edit from '@mui/icons-material/Edit';
import { Button, Dialog } from '@mui/material';
import { ButtonProps, styled, Theme, Typography, useMediaQuery, useTheme } from '@mui/material';
import { useState } from 'react';

import BioEditor from './BioEditor';

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

      <Dialog fullWidth maxWidth='md' onClose={() => setShowEditBio(false)} open={showEditBio}>
        <BioEditor />
      </Dialog>
    </>
  );
};

export default EditBioButton;
