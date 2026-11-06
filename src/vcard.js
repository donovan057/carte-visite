export const PROFILE = {
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

export function buildVCard(p, base64Photo = null) {
    const lines = [
        'BEGIN:VCARD', 'VERSION:3.0',
        `N:${p.lastName};${p.firstName};;;`,
        `FN:${p.firstName} ${p.lastName}`,
        `TITLE:${p.title}`, `EMAIL;TYPE=WORK,INTERNET:${p.email}`,
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

export async function getBase64Image(url) {
    try {
        const proxyUrl = `https://images.weserv.nl/?url=${url.replace('https://', '')}`;
        const response = await fetch(proxyUrl);
        const blob = await response.blob();
        return new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.onloadend = () => resolve(reader.result.split(',')[1]);
            reader.onerror = reject;
            reader.readAsDataURL(blob);
        });
    } catch (error) { return null; }
}

export function downloadFile(content, fileName, mimeType) {
    const dataUri = 'data:' + mimeType + ';charset=utf-8,' + encodeURIComponent(content);
    const a = document.createElement('a');
    a.href = dataUri; a.download = fileName;
    document.body.appendChild(a); a.click(); document.body.removeChild(a);
}