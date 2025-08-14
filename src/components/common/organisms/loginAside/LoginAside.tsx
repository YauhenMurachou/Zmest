import { FC } from 'react';

import BigLogo from 'src/components/common/atoms/bigLogo/BigLogo';
import Logo from 'src/components/common/atoms/logo/Logo';
import { useTranslateData } from 'src/hooks/useTranslateData';

import styles from './LoginAside.module.css';

const LoginAside: FC = () => {
  const { asideData } = useTranslateData();

  return (
    <aside className={styles.aside}>
      <BigLogo />
      <ul className={styles.social}>
        {asideData.map(({ icon, text }) => (
          <li className={styles.item} key={text}>
            {icon}
            {text}
          </li>
        ))}
      </ul>
      <Logo color="var(--blue-main)" />
    </aside>
  );
};

export default LoginAside;
