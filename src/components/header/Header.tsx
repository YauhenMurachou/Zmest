import { FC } from 'react';
import { useTranslation } from 'react-i18next';

import BigLogo from 'src/components/common/atoms/bigLogo/BigLogo';
import HeaderLogin from 'src/components/common/atoms/headerLogin/HeaderLogin';
import HeaderLogout from 'src/components/common/atoms/headerLogout/HeaderLogout';

// import HeaderNotifications from 'src/components/common/molecules/headerNotifications/HeaderNotifications';
import classes from './Header.module.css';

const Header: FC = () => {
  const { t } = useTranslation();

  return (
    <header className={classes.header}>
      <div className={classes.wrapper}>
        <div className={classes.logoWrapper}>
          <BigLogo />
          <span className={classes.social}>{t('header.social')}</span>
        </div>
        <div className={classes.rightBlock}>
          {/* <HeaderNotifications /> */}
          <HeaderLogin />
          <HeaderLogout />
        </div>
      </div>
    </header>
  );
};

export default Header;
