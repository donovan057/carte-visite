export default {
  async fetch(request, env) {
    const url = new URL(request.url);

    // 1. Route pour l'API d'envoi d'email
    if (url.pathname === '/api/send' && request.method === 'POST') {
      try {
        const { emails } = await request.json();
        const CARD_URL = "https://carte-de-visite.donovanrinquebach25.workers.dev/";
        const RESEND_API_KEY = env.RESEND_API_KEY;

        // Vérification de la clé API
        if (!RESEND_API_KEY) {
          return new Response(JSON.stringify({ error: "La clé RESEND_API_KEY est manquante sur Cloudflare." }), { 
            status: 500,
            headers: { "Content-Type": "application/json" }
          });
        }

        // 🎨 Template HTML "Premium" (Dark Mode)
        const htmlContent = `
          <!DOCTYPE html>
          <html>
          <head>
            <meta charset="utf-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <style>
              body { font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif; background-color: #f4f4f5; margin: 0; padding: 20px; }
              .container { max-width: 600px; margin: 0 auto; background-color: #0a0e14; border-radius: 16px; overflow: hidden; box-shadow: 0 10px 30px rgba(0,0,0,0.1); }
              .header { background: linear-gradient(135deg, #22d3ee 0%, #a78bfa 100%); padding: 30px 20px; text-align: center; }
              .header h1 { color: #0a0e14; margin: 0; font-size: 24px; font-weight: bold; }
              .header p { color: #0a0e14; margin: 5px 0 0; font-size: 14px; opacity: 0.8; }
              .content { padding: 30px 30px 20px; color: #e5e7eb; line-height: 1.6; font-size: 15px; }
              .content h2 { color: #ffffff; font-size: 20px; margin-top: 0; }
              .skills { background-color: #131820; border: 1px solid #1f2937; border-radius: 8px; padding: 15px; margin: 20px 0; }
              .skills strong { color: #22d3ee; }
              .btn-container { text-align: center; margin: 30px 0; }
              .btn { display: inline-block; background: linear-gradient(135deg, #22d3ee, #a78bfa); color: #0a0e14; padding: 14px 32px; text-decoration: none; border-radius: 8px; font-weight: bold; font-size: 16px; }
              .footer { background-color: #131820; padding: 20px; text-align: center; font-size: 12px; color: #9ca3af; border-top: 1px solid #1f2937; }
              .footer a { color: #9ca3af; text-decoration: underline; }
            </style>
          </head>
          <body>
            <div class="container">
              
              <!-- En-tête -->
              <div class="header">
                <h1>Donovan Rinquebach</h1>
                <p>Développeur Web Fullstack</p>
              </div>

              <!-- Corps de l'email -->
              <div class="content">
                <h2>Bonjour,</h2>
                <p>Je me permets de vous contacter car je suis à la recherche de nouvelles opportunités (missions freelance ou CDI).</p>
                <p>Spécialisé dans l'écosystème JavaScript, je conçois des applications web performantes et modernes.</p>
                
                <div class="skills">
                  <p style="margin:0;"><strong>Mes expertises :</strong> TypeScript, React, Node.js, Cloudflare.</p>
                </div>

                <p>Plutôt que de vous envoyer un CV classique, je vous invite à découvrir ma carte de visite numérique interactive. Vous y trouverez mes liens et mon contact direct :</p>

                <div class="btn-container">
                  <a href="${CARD_URL}" class="btn">Découvrir ma carte de visite</a>
                </div>

                <p>Je reste à votre entière disposition pour échanger sur vos besoins.</p>
                <p style="margin-bottom:0;">Bien cordialement,<br><strong>Donovan</strong></p>
              </div>

              <!-- Pied de page (RGPD & Contact) -->
              <div class="footer">
                <p style="margin-top:0;">Contact : <a href="mailto:donovanrinquebach25@icloud.com" style="color: #22d3ee;">donovanrinquebach25@icloud.com</a></p>
                <p>Ce message vous est adressé dans un cadre professionnel.<br>
                Si vous ne souhaitez plus recevoir d'emails de ma part, répondez simplement "STOP" à ce message.</p>
              </div>

            </div>
          </body>
          </html>
        `;

        // Envoi de l'email via Resend
        for (const email of emails) {
          const resendResponse = await fetch('https://api.resend.com/emails', {
            method: 'POST',
            headers: {
              'Authorization': `Bearer ${RESEND_API_KEY}`,
              'Content-Type': 'application/json'
            },
            body: JSON.stringify({
              from: 'Donovan Rinquebach <onboarding@resend.dev>',
              to: [email],
              subject: '🚀 Développeur Web Fullstack - Ma carte de visite',
              html: htmlContent
            })
          });

          // Vérification de la réponse de Resend
          if (!resendResponse.ok) {
            const errorData = await resendResponse.json();
            return new Response(JSON.stringify({ 
              erreur: "Resend a refusé l'envoi", 
              details_resend: errorData 
            }), { 
              status: 400,
              headers: { "Content-Type": "application/json" }
            });
          }
        }

        return new Response(JSON.stringify({ success: true }), { 
          status: 200,
          headers: { "Content-Type": "application/json" }
        });

      } catch (error) {
        return new Response(JSON.stringify({ error: error.message }), { 
          status: 500,
          headers: { "Content-Type": "application/json" }
        });
      }
    }

    // 2. Pour toutes les autres requêtes (HTML, CSS, image), on sert les fichiers statiques
    return env.ASSETS.fetch(request); 
  }
};