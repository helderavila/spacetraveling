import styles from './header.module.scss';

export default function Header(): JSX.Element {
  // TODO
  return (
    <header className={styles.headerContainer}>
      <div>
        <img src="/images/logo.svg" alt="Space Traveling" />
      </div>
    </header>
  );
}
