const PROFILE = {
    firstName: 'Donovan',
    lastName: 'Rinquebach',
    title: 'Développeur Web Fullstack', 
    email: 'donovanrinquebach25@icloud.com',
    phone: '06 51 36 53 23',
    website: '', 
    github: 'https://github.com/donovan057',
    linkedin: 'https://linkedin.com/in/donovan-rinquebach',
    city: 'Woippy',
    country: 'France',
    photo: 'https://github.com/donovan057.png'
};

// ─────────────────────────────────────────────
// 1. Génération de la vCard (RFC 6350)
// ─────────────────────────────────────────────
function buildVCard(p, base64Photo = null) {
    const lines = [
        'BEGIN:VCARD',
        'VERSION:3.0',
        `N:${p.lastName};${p.firstName};;;`,
        `FN:${p.firstName} ${p.lastName}`,
        `TITLE:${p.title}`,
        `EMAIL;TYPE=WORK,INTERNET:${p.email}`,
        `TEL;TYPE=CELL:${p.phone}`
    ];

    if (p.website) lines.push(`URL:${p.website}`);
    if (p.github) lines.push(`URL:${p.github}`);
    if (p.linkedin) lines.push(`URL:${p.linkedin}`);
    
    lines.push(`ADR;TYPE=WORK:;;;${p.city};;;${p.country}`);

    if (base64Photo) {
        let photoLine = 'PHOTO;ENCODING=b;TYPE=JPEG:';
        for (let i = 0; i < base64Photo.length; i += 74) {
            photoLine += base64Photo.substring(i, i + 74) + '\r\n ';
        }
        lines.push(photoLine.trim());
    } else if (p.photo) {
        lines.push(`PHOTO;VALUE=URI:${p.photo}`);
    }

    lines.push('END:VCARD');
    return lines.join('\r\n');
}

// ─────────────────────────────────────────────
// 2. Téléchargement du fichier
// ─────────────────────────────────────────────
function downloadFile(content, fileName, mimeType) {
    const dataUri = 'data:' + mimeType + ';charset=utf-8,' + encodeURIComponent(content);
    const a = document.createElement('a');
    a.href = dataUri;
    a.download = fileName;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
}

// ─────────────────────────────────────────────
// 3. Conversion de l'image en Base64
// ─────────────────────────────────────────────
async function getBase64Image(url) {
    try {
        const proxyUrl = `https://images.weserv.nl/?url=${url.replace('https://', '')}`;
        const response = await fetch(proxyUrl);
        const blob = await response.blob();
        return new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.onloadend = () => {
                const base64data = reader.result.split(',')[1];
                resolve(base64data);
            };
            reader.onerror = reject;
            reader.readAsDataURL(blob);
        });
    } catch (error) {
        console.error("Impossible de charger la photo :", error);
        return null;
    }
}

// ─────────────────────────────────────────────
// 4. Rendu du QR Code
// ─────────────────────────────────────────────
function renderQRCode() {
    const vcard = buildVCard(PROFILE, null);
    const container = document.getElementById('qrcode');
    
    if (!container) return; // Sécurité
    
    const encodedVcard = encodeURIComponent(vcard);
    const qrUrl = `https://api.qrserver.com/v1/create-qr-code/?size=300x300&data=${encodedVcard}`;

    container.innerHTML = `<img src="${qrUrl}" alt="QR Code">`;
} 

// ─────────────────────────────────────────────
// 5. Initialisation des événements (SÉCURISÉE)
// ─────────────────────────────────────────────
const saveBtn = document.getElementById('save-contact');
if (saveBtn) {
    saveBtn.addEventListener('click', async () => {
        const originalText = saveBtn.innerHTML;
        saveBtn.innerHTML = "⏳ Chargement...";

        const base64 = await getBase64Image(PROFILE.photo);
        const vcard = buildVCard(PROFILE, base64);
        downloadFile(vcard, 'Donovan-Rinquebach.vcf', 'text/vcard');

        saveBtn.innerHTML = originalText;
    });
}

// On gère les liens en bas s'ils existent
const downloadVcf = document.getElementById('download-vcf');
if (downloadVcf) {
    downloadVcf.addEventListener('click', async (e) => {
        e.preventDefault();
        const base64 = await getBase64Image(PROFILE.photo);
        const vcard = buildVCard(PROFILE, base64);
        downloadFile(vcard, 'bio.vcf', 'text/vcard');
    });
}

const downloadJson = document.getElementById('download-json');
if (downloadJson) {
    downloadJson.addEventListener('click', (e) => {
        e.preventDefault();
        const json = JSON.stringify(PROFILE, null, 2);
        downloadFile(json, 'bio.json', 'application/json');
    });
}

function renderAvatar() {
    const avatarImg = document.getElementById('avatar-img');
    if (avatarImg && PROFILE.photo) {
        avatarImg.src = PROFILE.photo;
    }
}

// Lancement
renderQRCode();
renderAvatar();