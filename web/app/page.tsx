import RadioSearch from '@/components/RadioSearch';
import styles from './page.module.css';

export default function Home() {
  return (
    <main className={styles.main}>
      
      {/* Hero Banner Section */}
      <div className={styles.hero}>
        <img 
          src="/logo.png" 
          alt="CyanCast Logo" 
          className={styles.logo}
        />
      </div>
      
      <p className={styles.tagline}>
        Stream the vibe. Feel the beat.
      </p>

      <RadioSearch />

    </main>
  );
}
