import Diversity3Icon from '@mui/icons-material/Diversity3';
import { SvgIcon } from '@mui/material';
import { FC } from 'react';

import classes from './Logo.module.css';

type Props = { color?: string };

const Logo: FC<Props> = ({ color }) => (
  <div className={classes.logo} style={{ color }}>
    <Diversity3Icon className={classes.image} fontSize="medium" />
    <span className={classes.tradeMark}> Zmest © {new Date().getFullYear()}</span>
    <SvgIcon />
  </div>
);

export default Logo;
