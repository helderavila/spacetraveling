import Link from 'next/link';
import styles from './header.module.scss';

export default function Header(): JSX.Element {
  // TODO
  return (
    <header className={styles.headerContainer}>
      <div>
        <Link href="/">
          <img src="/images/logo.svg" alt="logo" />
        </Link>
      </div>
    </header>
  );
}
