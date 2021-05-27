import { useMemo } from 'react';
import classnames from 'classnames';

// Material UI Components
import { makeStyles, useTheme } from '@material-ui/core/styles';

import { NavigationOptions } from 'components/navigation/Navigation';

const useStyles = makeStyles(() => ({
  logo: {
    margin: 'auto',
    display: 'block',
  },
}));

export type TihldeLogoProps = Pick<NavigationOptions, 'darkColor' | 'lightColor'> & {
  size: 'small' | 'large';
  className?: string;
};

function TihldeLogo({ size, darkColor, lightColor, className }: TihldeLogoProps) {
  const theme = useTheme();
  const classes = useStyles();
  const color = useMemo(() => {
    const isDark = theme.palette.type === 'dark';
    const prop = isDark ? darkColor : lightColor;
    if (prop === 'black') {
      return '#000000';
    } else if (prop === 'blue') {
      return theme.palette.colors.tihlde;
    } else {
      return '#ffffff';
    }
  }, [theme.palette, darkColor, lightColor]);

  return (
    <svg
      className={classnames(classes.logo, className)}
      height='400'
      id='svg2'
      version='1.1'
      viewBox={size === 'large' ? '250 435 2000 450' : '335 365 400 580'}
      width={size === 'large' ? 2000 : 400}
      xmlns='http://www.w3.org/2000/svg'>
      <defs id='defs6'>
        <clipPath clipPathUnits='userSpaceOnUse' id='clipPath18'>
          <path d='M 0,1005 H 1920 V 0 H 0 Z' id='path16' />
        </clipPath>
      </defs>
      <g id='g10' transform='matrix(1.3333333,0,0,-1.3333333,0,1340)'>
        <g id='g12'>
          <g clipPath='url(#clipPath18)' id='g14'>
            <g id='g20' transform='translate(511.269,424.2549)'>
              <path
                // eslint-disable-next-line max-len
                d='m 0,0 c -3.475,-0.752 -6.717,-2.12 -9.617,-3.994 l -40.546,40.546 -51.872,51.872 92.418,92.418 c 2.9,-1.874 6.142,-3.242 9.617,-3.994 z m -22.763,-22.763 h -176.82 c -0.766,3.475 -2.134,6.717 -4.008,9.631 l 92.418,92.418 40.587,-40.587 51.832,-51.831 c -1.875,-2.914 -3.243,-6.156 -4.009,-9.631 m -189.966,18.769 c -2.914,1.874 -6.155,3.242 -9.63,4.008 v 176.82 c 3.475,0.766 6.716,2.134 9.63,4.008 l 92.418,-92.418 z m 13.146,203.604 h 176.82 c 0.766,-3.475 2.134,-6.716 4.009,-9.631 l -92.419,-92.417 -92.418,92.417 c 1.874,2.915 3.242,6.156 4.008,9.631 M 12.927,0.014 v 176.82 c 13.42,2.955 23.474,14.924 23.474,29.233 0,16.524 -13.406,29.93 -29.931,29.93 -14.308,0 -26.278,-10.054 -29.233,-23.474 h -176.82 c -2.955,13.42 -14.924,23.474 -29.232,23.474 -16.525,0 -29.931,-13.406 -29.931,-29.93 0,-14.309 10.04,-26.265 23.46,-29.219 V 0 c -13.42,-2.955 -23.46,-14.91 -23.46,-29.22 0,-16.524 13.406,-29.929 29.931,-29.929 14.308,0 26.277,10.053 29.232,23.473 h 176.82 c 2.955,-13.42 14.925,-23.473 29.233,-23.473 16.525,0 29.931,13.405 29.931,29.929 0,14.31 -10.054,26.279 -23.474,29.234'
                id='path22'
                style={{ fill: color, fillOpacity: 1, fillRule: 'nonzero', stroke: 'none' }}
              />
            </g>
            <g id='g24' transform='translate(617.4761,526.4263)'>
              <path
                d='m 0,0 c 0,0 -32.366,-43.487 -93.28,-59.943 -4.173,-1.136 -8.481,-2.134 -12.927,-2.982 -12.216,-2.353 -25.444,-3.571 -39.643,-3.174 -3.365,0.096 -6.867,0.246 -10.52,0.479 -6.401,0.411 -13.214,1.067 -20.423,2.148 -18.495,2.763 -39.506,8.207 -62.296,18.877 -3.146,1.464 -6.32,3.037 -9.535,4.706 -0.889,0.465 -1.778,0.917 -2.667,1.368 -18.809,9.63 -38.384,17.332 -77.275,19.37 -4.09,0.205 -8.385,0.356 -12.927,0.451 -2.271,0.041 -4.61,0.055 -7.018,0.069 -21.572,0.082 -86.248,-11.586 -86.248,-11.586 0,0 32.365,43.472 93.266,59.943 4.172,1.121 8.481,2.133 12.927,2.968 12.23,2.367 25.458,3.584 39.67,3.187 4.255,-0.123 8.728,-0.328 13.434,-0.684 6.511,-0.492 13.433,-1.258 20.737,-2.462 17.196,-2.818 36.456,-8.003 57.208,-17.482 3.748,-1.724 7.551,-3.571 11.395,-5.582 0.287,-0.15 0.574,-0.3 0.862,-0.437 19.384,-10.068 38.931,-18.194 79.053,-20.3 4.09,-0.219 8.385,-0.37 12.927,-0.466 2.284,-0.027 4.637,-0.054 7.045,-0.068 C -64.676,-11.668 0,0 0,0'
                id='path26'
                style={{ fill: color, fillOpacity: 1, fillRule: 'nonzero', stroke: 'none' }}
              />
            </g>
            {size === 'large' && (
              <>
                <g id='g28' transform='translate(708.1836,585.4761)'>
                  <path
                    d='M 0,0 H -50.162 V 50.338 H 113.033 V 0 H 62.871 V -197.092 H 0 Z'
                    id='path30'
                    style={{ fill: color, fillOpacity: 1, fillRule: 'nonzero', stroke: 'none' }}
                  />
                </g>
                <path
                  d='m 840.945,635.814 h 62.87 v -247.43 h -62.87 z'
                  id='path32'
                  style={{ fill: color, fillOpacity: 1, fillRule: 'nonzero', stroke: 'none' }}
                />
                <g id='g34' transform='translate(1051.293,489.0576)'>
                  <path
                    d='m 0,0 h -48.824 v -100.674 h -62.873 v 247.43 h 62.873 V 51.754 H 0 v 95.002 h 62.871 v -247.43 H 0 Z'
                    id='path36'
                    style={{ fill: color, fillOpacity: 1, fillRule: 'nonzero', stroke: 'none' }}
                  />
                </g>
                <g id='g38' transform='translate(1149.9443,635.814)'>
                  <path
                    d='m 0,0 h 62.87 v -197.094 h 76.916 V -247.43 H 0 Z'
                    id='path40'
                    style={{ fill: color, fillOpacity: 1, fillRule: 'nonzero', stroke: 'none' }}
                  />
                </g>
                <g id='g42' transform='translate(1373.6689,435.8848)'>
                  <path
                    d='m 0,0 h 13.712 c 18.059,0 31.601,6.497 40.632,19.497 9.029,12.994 13.544,31.548 13.544,55.653 0,15.83 -1.673,28.713 -5.018,38.639 -3.342,9.925 -7.857,17.602 -13.542,23.041 -5.685,5.434 -12.375,9.156 -20.067,11.167 -7.69,2.004 -15.774,3.013 -24.243,3.013 l -5.018,0 z m -62.87,199.929 h 89.959 c 17.164,0 32.38,-2.898 45.647,-8.685 13.262,-5.794 24.465,-14.064 33.61,-24.814 9.139,-10.756 16.052,-23.635 20.734,-38.638 4.682,-15.011 7.023,-31.728 7.023,-50.16 0,-21.508 -2.624,-40.118 -7.86,-55.831 C 121.001,6.081 113.421,-6.912 103.502,-17.192 93.581,-27.473 81.373,-35.095 66.885,-40.057 52.389,-45.02 35.893,-47.501 17.39,-47.501 h -80.26 z'
                    id='path44'
                    style={{ fill: color, fillOpacity: 1, fillRule: 'nonzero', stroke: 'none' }}
                  />
                </g>
                <g id='g46' transform='translate(1533.5215,635.814)'>
                  <path
                    d='M 0,0 H 143.131 V -48.919 H 61.533 V -96.42 h 77.585 v -48.919 H 61.533 v -53.172 h 85.946 V -247.43 H 0 Z'
                    id='path48'
                    style={{ fill: color, fillOpacity: 1, fillRule: 'nonzero', stroke: 'none' }}
                  />
                </g>
              </>
            )}
          </g>
        </g>
      </g>
    </svg>
  );
}
export default TihldeLogo;
