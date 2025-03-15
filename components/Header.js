import Link from 'next/link';
import styles from '../styles/Header.module.css';

export default function Header() {
  return (
    <header className={styles.header}>
      {/* Clickable Title without changing style */}
      <Link href="/" passHref legacyBehavior>
        <a className={styles.title}>Recipe Forum WEBProgramming</a>
      </Link>

      <div className={styles.authButtons}>
        <Link href="/login">
          <button className={`${styles.button} ${styles.login}`}>Login</button>
        </Link>
        <Link href="/signup">
          <button className={`${styles.button} ${styles.signup}`}>Sign-up</button>
        </Link>
      </div>
    </header>
  );
}
