import { useState } from 'react';
import { useRouter } from 'next/router';
import styles from '../styles/signup.module.css';  

export default function Signup() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const router = useRouter();

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    const response = await fetch('/api/signup', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ email, password }),
    });

    const data = await response.json();

    if (data.success) {
      router.push('/login');  // Redirect to login page after successful signup
    } else {
      setError(data.message || 'Something went wrong.');
    }
  };

  return (
    <div className={styles['form-container']}>
      <h1 className={styles.heading}>Sign Up</h1>
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
        <button type="submit" className={styles.button}>Sign Up</button>
      </form>
      <a href="/login" className={styles['link']}>Already have an account? Login</a>
    </div>
  );
}
