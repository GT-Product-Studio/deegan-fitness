import { Resend } from "resend";
import { brand } from "@/config/brand";

function getResend() {
  const apiKey = process.env.RESEND_API_KEY;
  if (!apiKey) throw new Error("RESEND_API_KEY is not set");
  return new Resend(apiKey);
}

export async function sendAccessEmail({
  to,
  magicLink,
}: {
  to: string;
  magicLink: string;
}) {
  const resend = getResend();

  const accentColor = brand.colors.primary;
  const darkBg = brand.colors.background;
  const cardBg = brand.colors.backgroundCard;
  const borderColor = brand.colors.border;
  const mutedText = brand.colors.textMuted;

  const includedItems = [
    "All 3 training levels (Rookie / Pro Am / Factory)",
    "Weekly training regiment",
    "Heart rate zone training guides",
    "Benchmark against Haiden's stats",
    "Race-week schedule adjustments",
    "Cancel anytime",
  ];

  const includedRows = includedItems.map(item => `
    <tr>
      <td style="padding:7px 0;border-bottom:1px solid ${borderColor};">
        <table cellpadding="0" cellspacing="0">
          <tr>
            <td style="padding-right:12px;vertical-align:middle;">
              <div style="width:6px;height:6px;border-radius:50%;background-color:${accentColor};"></div>
            </td>
            <td style="font-size:13px;color:#cccccc;vertical-align:middle;">${item}</td>
          </tr>
        </table>
      </td>
    </tr>
  `).join("");

  const html = `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <meta name="color-scheme" content="dark" />
  <title>Welcome to ${brand.name}</title>
  <style>
    @import url('https://fonts.googleapis.com/css2?family=Oswald:wght@700&display=swap');
    .display { font-family: 'Oswald', Impact, 'Arial Narrow', Arial, sans-serif !important; }
    @media only screen and (max-width: 600px) {
      .container { width: 100% !important; }
      .hero-text { font-size: 48px !important; }
      .pad { padding: 28px 20px !important; }
    }
  </style>
</head>
<body style="margin:0;padding:0;background-color:${darkBg};" bgcolor="${darkBg}">

  <div style="display:none;max-height:0;overflow:hidden;mso-hide:all;">
    Your ${brand.name} subscription is active. Start training now.
  </div>

  <table width="100%" cellpadding="0" cellspacing="0" border="0" bgcolor="${darkBg}">
    <tr>
      <td align="center" style="padding:32px 16px 48px;">
        <table class="container" width="560" cellpadding="0" cellspacing="0" border="0" style="max-width:560px;width:100%;">

          <tr>
            <td style="padding:0 0 24px 0;">
              <p style="margin:0;font-family:'Oswald',Impact,sans-serif;font-size:26px;letter-spacing:0.12em;color:#ffffff;text-transform:uppercase;">
                ${brand.nav.logoPrefix}&nbsp;<span style="color:${accentColor};">${brand.nav.logoAccent}</span>
              </p>
            </td>
          </tr>

          <tr>
            <td bgcolor="${cardBg}" style="background-color:${cardBg};border:1px solid ${borderColor};border-bottom:3px solid ${accentColor};padding:44px 40px 40px;" class="pad">
              <p style="margin:0 0 14px;font-size:11px;font-weight:700;letter-spacing:0.35em;text-transform:uppercase;color:${accentColor};">
                Subscription Active
              </p>
              <h1 class="display hero-text" style="margin:0 0 10px;font-family:'Oswald',Impact,sans-serif;font-size:64px;font-weight:700;letter-spacing:0.04em;color:#ffffff;line-height:1;text-transform:uppercase;">
                You're In.
              </h1>
              <p style="margin:0 0 32px;font-size:15px;color:#aaaaaa;line-height:1.65;">
                Your <strong style="color:#ffffff;">${brand.subscription.displayName}</strong> subscription is live. Tap below to start training.
              </p>
              <table cellpadding="0" cellspacing="0" border="0" width="100%">
                <tr>
                  <td>
                    <a href="${magicLink}" class="btn" style="display:block;background-color:${accentColor};color:#000000;text-decoration:none;text-align:center;padding:18px 32px;font-size:11px;font-weight:800;letter-spacing:0.25em;text-transform:uppercase;">
                      Start Training &rarr;
                    </a>
                  </td>
                </tr>
              </table>
            </td>
          </tr>

          <tr><td style="height:12px;"></td></tr>

          <tr>
            <td bgcolor="${cardBg}" style="background-color:${cardBg};border:1px solid ${borderColor};padding:28px 40px;" class="pad">
              <p style="margin:0 0 18px;font-size:10px;font-weight:700;letter-spacing:0.3em;text-transform:uppercase;color:${mutedText};">
                What's Included
              </p>
              <table cellpadding="0" cellspacing="0" border="0" width="100%">
                <tr>
                  <td>
                    <p style="margin:0;font-size:16px;font-weight:700;color:#ffffff;">${brand.subscription.displayName}</p>
                    <p style="margin:4px 0 16px;font-size:12px;color:${mutedText};">${brand.subscription.priceFormatted}/mo &middot; Cancel anytime</p>
                  </td>
                </tr>
              </table>
              <table cellpadding="0" cellspacing="0" border="0" width="100%">
                ${includedRows}
              </table>
            </td>
          </tr>

          <tr>
            <td style="padding:28px 0 0;">
              <p style="margin:0;font-size:11px;color:#444444;line-height:1.6;text-align:center;">
                You received this because you subscribed at ${brand.domain.replace("https://", "")}.<br />
                Questions? Email ${brand.supportEmail}.
              </p>
            </td>
          </tr>

        </table>
      </td>
    </tr>
  </table>
</body>
</html>`.trim();

  const fromAddress = process.env.RESEND_FROM_EMAIL ?? brand.fromEmail;

  await resend.emails.send({
    from: fromAddress,
    to,
    subject: `You're in — ${brand.name} subscription active`,
    html,
  });
}
