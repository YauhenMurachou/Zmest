import Diversity3Icon from '@mui/icons-material/Diversity3';
import { FC } from 'react';

import classes from './BigLogo.module.css';

const BigLogo: FC = () => (
  <div className={classes.logo}>
    <Diversity3Icon className={classes.image} fontSize="large" />
    <span className={classes.near}>Pobach</span>
    <Diversity3Icon className={classes.image} fontSize="large" />
  </div>
);

export default BigLogo;
