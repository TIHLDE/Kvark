import { Box, BoxProps } from '@mui/material';

interface SchaffoldProps extends BoxProps {
  variant?: 'vertical' | 'horizontal';
  spacing?: 'small' | 'medium' | 'large';
}

const WrappedSchaffold = ({ variant, spacing, children, ...props }: SchaffoldProps) => {
  let spacingStr = '';
  let variantStr = '';

  switch (spacing) {
    case 'large':
      spacingStr = '5rem';
      break;
    case 'medium':
      spacingStr = '3rem';
      break;
    case 'small':
      spacingStr = '1rem';
      break;
    default:
      spacingStr = '3rem';
  }

  switch (variant) {
    case 'horizontal':
      variantStr = 'row';
      break;
    case 'vertical':
      variantStr = 'column';
      break;
    default:
      variantStr = 'column';
  }

  return (
    <Box
      {...props}
      sx={{
        display: 'flex',
        flexDirection: variantStr,
        width: '100%',
        height: '100%',
        gap: spacingStr,
        alignItems: 'center',
        justifyContent: 'center',
        textAlign: 'center',
      }}>
      {children}
    </Box>
  );
};

export default WrappedSchaffold;
