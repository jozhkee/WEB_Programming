import styles from '../styles/Header.module.css';
import Link from 'next/link';

export default function Header() {
  return (
    <header className={styles.header}>
      <h1 className={styles.title}>Recipe Forum WEBProgramming</h1>
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
