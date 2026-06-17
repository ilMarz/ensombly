import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);

const FROM = "Ensombly <noreply@ensombly.com>";
const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? "https://ensombly.com";

export async function sendAdminInvite(email: string, token: string) {
  const link = `${SITE_URL}/admin/invite/${token}`;
  await resend.emails.send({
    from: FROM,
    to: email,
    subject: "Sei stato invitato come admin su Ensombly",
    html: `
      <p>Sei stato invitato a diventare amministratore della piattaforma <strong>Ensombly</strong>.</p>
      <p>Clicca il link per accettare l'invito (valido 48 ore):</p>
      <p><a href="${link}">${link}</a></p>
      <p>Se non hai richiesto questo invito, ignora questa email.</p>
    `,
  });
}

export async function sendNewUserNotification(to: string, user: { username: string; full_name: string | null; email?: string }) {
  await resend.emails.send({
    from: FROM,
    to,
    subject: `Nuovo utente registrato: ${user.full_name ?? user.username}`,
    html: `
      <p>Un nuovo utente si è registrato su <strong>Ensombly</strong>.</p>
      <ul>
        <li><strong>Username:</strong> @${user.username}</li>
        ${user.full_name ? `<li><strong>Nome:</strong> ${user.full_name}</li>` : ""}
        ${user.email ? `<li><strong>Email:</strong> ${user.email}</li>` : ""}
      </ul>
      <p><a href="${SITE_URL}/admin">Vai alla dashboard admin →</a></p>
    `,
  });
}

export async function sendPurchaseNotification(
  to: string,
  user: { username: string; full_name: string | null },
  plan: string,
  period: string
) {
  await resend.emails.send({
    from: FROM,
    to,
    subject: `Nuovo acquisto: ${user.full_name ?? user.username} — piano ${plan}`,
    html: `
      <p>Un utente ha acquistato un piano su <strong>Ensombly</strong>.</p>
      <ul>
        <li><strong>Utente:</strong> ${user.full_name ?? user.username} (@${user.username})</li>
        <li><strong>Piano:</strong> ${plan} (${period})</li>
      </ul>
      <p><a href="${SITE_URL}/admin">Vai alla dashboard admin →</a></p>
    `,
  });
}
