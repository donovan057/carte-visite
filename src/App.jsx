import { useState, useEffect } from 'react';
import { PROFILE, buildVCard, getBase64Image, downloadFile } from './vcard';
import './index.css';

function App() {
  const [qrCodeUrl, setQrCodeUrl] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    // Génération du QR Code au chargement
    const vcard = buildVCard(PROFILE, null);
    const encodedVcard = encodeURIComponent(vcard);
    setQrCodeUrl(`https://api.qrserver.com/v1/create-qr-code/?size=300x300&data=${encodedVcard}`);
  }, []);

  const handleSaveContact = async () => {
    setIsLoading(true);
    const base64 = await getBase64Image(PROFILE.photo);
    const vcard = buildVCard(PROFILE, base64);
    downloadFile(vcard, 'Donovan-Rinquebach.vcf', 'text/vcard');
    setIsLoading(false);
  };

  return (
    <main className="card">
      <header className="card-header">
        <div className="avatar" aria-hidden="true">
          <img src={PROFILE.photo} alt="Photo de profil" id="avatar-img" />
        </div>
        <h1>{PROFILE.firstName} {PROFILE.lastName}</h1>
        <p className="role">{PROFILE.title}</p>
      </header>

      <section className="bio">
        <p>
          Je conçois des applications web performantes et accessibles.
          Spécialisé en <strong>TypeScript</strong>, <strong>React</strong> et <strong>Node.js</strong>.
        </p>
      </section>

      <section className="projects">
        <h2 className="section-title">Derniers projets</h2>
        <a href={PROFILE.github} target="_blank" rel="noopener noreferrer" className="project-card">
          <h3>Carte de visite API</h3>
          <p>Worker Cloudflare, Resend, React</p>
        </a>
        <a href="#" className="project-card">
          <h3>Application React</h3>
          <p>Dashboard, API REST, Tailwind</p>
        </a>
      </section>

      <section className="actions">
        <button onClick={handleSaveContact} className="btn-primary" disabled={isLoading}>
          {isLoading ? "⏳ Chargement..." : "📇 Ajouter à mes contacts"}
        </button>
        
        <div className="links">
          <a href={PROFILE.github} target="_blank" rel="noopener noreferrer" aria-label="GitHub">
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M9 19c-5 1.5-5-2.5-7-3m14 6v-3.87a3.37 3.37 0 0 0-.94-2.61c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0 0 20 4.77 5.07 5.07 0 0 0 19.91 1S18.73.65 16 2.48a13.38 13.38 0 0 0-7 0C6.27.65 5.09 1 5.09 1A5.07 5.07 0 0 0 5 4.77a5.44 5.44 0 0 0-1.5 3.78c0 5.42 3.3 6.61 6.44 7A3.37 3.37 0 0 0 9 18.13V22"></path></svg>
          </a>
          <a href={PROFILE.linkedin} target="_blank" rel="noopener noreferrer" aria-label="LinkedIn">
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"></path><rect x="2" y="9" width="4" height="12"></rect><circle cx="4" cy="4" r="2"></circle></svg>
          </a>
          <a href={`mailto:${PROFILE.email}`} aria-label="Email">
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"></path><polyline points="22,6 12,13 2,6"></polyline></svg>
          </a>
        </div>
      </section>

      <section className="qr-section">
        {qrCodeUrl && <div id="qrcode"><img src={qrCodeUrl} alt="QR Code" /></div>}
        <p className="qr-caption">Scannez pour m'ajouter directement</p>
      </section>

      <footer className="card-footer">
        <span className="dot"></span> Disponible pour des missions freelance
      </footer>
    </main>
  );
}

export default App;