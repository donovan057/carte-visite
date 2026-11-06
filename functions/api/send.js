export async function onRequestPost(context) {
    const { request, env } = context;
    try {
        const { emails } = await request.json();
        const CARD_URL = "https://carte-de-visite.pages.dev/";
        const RESEND_API_KEY = env.RESEND_API_KEY;

        const htmlContent = `
          <div style="font-family: sans-serif; color: #333; max-width: 600px; margin: auto; padding: 20px; border: 1px solid #eee; border-radius: 10px;">
            <h2>Bonjour,</h2>
            <p>Je me permets de vous contacter car je suis <strong>Développeur Web Fullstack</strong>.</p>
            <a href="${CARD_URL}" style="display:inline-block; background: #22d3ee; color: #000; padding: 12px 24px; text-decoration: none; border-radius: 6px; font-weight: bold; margin: 20px 0;">Voir ma carte de visite</a>
          </div>
        `;

        for (const email of emails) {
            await fetch('https://api.resend.com/emails', {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${RESEND_API_KEY}`,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    from: 'Donovan Rinquebach <onboarding@resend.dev>',
                    to: [email],
                    subject: 'Développeur Web • Ma carte de visite',
                    html: htmlContent
                })
            });
        }
        return new Response(JSON.stringify({ success: true }), { status: 200 });
    } catch (error) {
        return new Response(JSON.stringify({ error: error.message }), { status: 500 });
    }
}