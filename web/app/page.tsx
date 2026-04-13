import RadioSearch from '@/components/RadioSearch';

export default function Home() {
  return (
    <main style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', alignItems: 'center', paddingTop: '50px' }}>
      
      {/* Hero Banner Section */}
      <div style={{ display: 'flex', justifyContent: 'center', width: '100%', maxWidth: '380px', marginBottom: '40px', padding: '0 20px' }}>
        <img 
          src="/logo.png" 
          alt="CyanCast Logo" 
          style={{ width: '100%', height: 'auto', filter: 'drop-shadow(0 0 15px var(--neon-cyan-glow))' }} 
        />
      </div>
      
      <p style={{ color: 'var(--text-secondary)', marginBottom: '40px', fontSize: '1.2rem', textAlign: 'center', padding: '0 20px' }}>
        Stream the vibe. Feel the beat.
      </p>

      <RadioSearch />

    </main>
  );
}
