import { useState } from 'react';
import { useRouter } from 'next/router';
import styles from '../styles/login.module.css';  

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const router = useRouter();

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    const response = await fetch('/api/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ email, password }),
    });

    const data = await response.json();

    if (data.success) {
      router.push('/');  // Redirect to the home page after successful login
    } else {
      setError(data.message || 'Invalid credentials.');
    }
  };

  return (
    <div className={styles['form-container']}>
      <h1 className={styles.heading}>Login</h1>
      <form onSubmit={handleSubmit}>
        <input
          className={styles['form-control-dark']}
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        <input
          className={styles['form-control-dark']}
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
        {error && <p className={styles['error-message']}>{error}</p>}
        <button type="submit" className={styles.button}>Login</button>
      </form>
      <a href="/signup" className={styles['link']}>Don't have an account? Sign up</a>
    </div>
  );
}
