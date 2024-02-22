import { keyframes } from '@mui/material';

export const fadeIn = keyframes`
    from {
        opacity: 0;
    }    
    to {
        opacity: 1;
    }
`;

export const zoomIn = keyframes`
    from {
        transform: scale(0.2);
        opacity: 0;
    }

    to {
        transform: scale(1);
        opacity: 1;
    }
`;

export const spinIn = keyframes`
    from {
        transform: scale(0.5) rotate(-1800deg);
        opacity: 0;
    }
    to {
        transform: scale(1) rotate(0deg);
        opacity: 1;
    }
`;

export const slideIn = keyframes`
    from {
        transform: translateY(-1rem);
        opacity: 0;
    }
    to {
        transform: translateY(0);
        opacity: 1;
    }
`;
