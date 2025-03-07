// pages/_app.js
import '../styles/styles.css'; // Import your global stylesheet

export default function App({ Component, pageProps }) {
  return <Component {...pageProps} />;
}