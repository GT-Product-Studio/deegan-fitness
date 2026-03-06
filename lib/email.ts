import { Resend } from "resend";
import { brand } from "@/config/brand";

function getResend() {
  const apiKey = process.env.RESEND_API_KEY;
  if (!apiKey) throw new Error("RESEND_API_KEY is not set");
  return new Resend(apiKey);
}

export async function sendAccessEmail({
  to,
  planName,
  trainerName,
  magicLink,
}: {
  to: string;
  planName: string;
  trainerName: string;
  magicLink: string;
}) {
  const resend = getResend();
  const firstName = trainerName.split(" ")[0];
  const isCouples = trainerName === brand.trainers.couples.name;

  // What's included bullet points
  const includedItems = isCouples
    ? ["21-day daily core program", "Do it side-by-side, every day", "Exercise video library", "Progress tracking", "Lifetime access"]
    : ["Day-by-day workout program", "Exercise video library", "Sets, reps & coaching notes", "Progress tracking", "Lifetime access"];

  const accentColor = brand.colors.emailAccent;
  const darkBg = brand.colors.emailDarkBg;
  const cardBg = brand.colors.emailCardBg;
  const borderColor = brand.colors.emailBorder;
  const mutedText = brand.colors.emailMuted;

  const couplesPrice = brand.programs["couples-ab"].priceDollars;
  const couplesCents = brand.programs["couples-ab"].priceCents;
  const defaultPrice = brand.programs["trainerA-30"].priceDollars;
  const defaultCents = brand.programs["trainerA-30"].priceCents;

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
<html lang="en" xmlns="http://www.w3.org/1999/xhtml">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <meta http-equiv="X-UA-Compatible" content="IE=edge" />
  <meta name="color-scheme" content="dark" />
  <meta name="supported-color-schemes" content="dark" />
  <title>Your plan is ready — ${brand.name}</title>
  <style>
    @import url('https://fonts.googleapis.com/css2?family=Bebas+Neue&display=swap');
    .bebas { font-family: 'Bebas Neue', Impact, 'Arial Narrow', Arial, sans-serif !important; }
    @media only screen and (max-width: 600px) {
      .container { width: 100% !important; }
      .hero-text { font-size: 52px !important; }
      .pad { padding: 28px 20px !important; }
      .btn { padding: 16px 20px !important; }
    }
  </style>
</head>
<body style="margin:0;padding:0;background-color:${darkBg};" bgcolor="${darkBg}">

  <!-- Preheader (hidden) -->
  <div style="display:none;max-height:0;overflow:hidden;mso-hide:all;">
    Your ${planName} is ready. One tap to start your journey.&nbsp;‌&nbsp;‌&nbsp;‌&nbsp;‌&nbsp;‌&nbsp;‌&nbsp;‌&nbsp;‌
  </div>

  <table width="100%" cellpadding="0" cellspacing="0" border="0" bgcolor="${darkBg}"
    style="background-color:${darkBg};min-width:100%;">
    <tr>
      <td align="center" style="padding:32px 16px 48px;">

        <!-- Outer container -->
        <table class="container" width="560" cellpadding="0" cellspacing="0" border="0"
          style="max-width:560px;width:100%;">

          <!-- ── LOGO BAR ── -->
          <tr>
            <td style="padding:0 0 24px 0;">
              <table width="100%" cellpadding="0" cellspacing="0" border="0">
                <tr>
                  <td>
                    <p style="margin:0;font-family:'Bebas Neue',Impact,'Arial Narrow',Arial,sans-serif;
                      font-size:26px;letter-spacing:0.12em;color:#ffffff;text-transform:uppercase;">
                      ${brand.nav.logoPrefix}&nbsp;<span style="color:${accentColor};">${brand.nav.logoAccent}</span>
                    </p>
                  </td>
                  <td align="right">
                    <p style="margin:0;font-size:11px;color:${mutedText};letter-spacing:0.15em;text-transform:uppercase;">
                      Payment Confirmed
                    </p>
                  </td>
                </tr>
              </table>
            </td>
          </tr>

          <!-- ── HERO BLOCK ── -->
          <tr>
            <td bgcolor="${cardBg}" style="background-color:${cardBg};border:1px solid ${borderColor};
              border-bottom:3px solid ${accentColor};padding:44px 40px 40px;" class="pad">

              <!-- Gold eyebrow -->
              <p style="margin:0 0 14px;font-size:11px;font-weight:700;letter-spacing:0.35em;
                text-transform:uppercase;color:${accentColor};">
                ${isCouples ? `${brand.hero.trainerALabel} &amp; ${brand.hero.trainerBLabel} · ${brand.trainers.couples.specialty}` : `${firstName}'s Program`}
              </p>

              <!-- Hero headline -->
              <h1 class="bebas hero-text" style="margin:0 0 10px;
                font-family:'Bebas Neue',Impact,'Arial Narrow',Arial,sans-serif;
                font-size:64px;font-weight:400;letter-spacing:0.04em;
                color:#ffffff;line-height:1;text-transform:uppercase;">
                You're&nbsp;In.
              </h1>

              <!-- Subheadline -->
              <p style="margin:0 0 32px;font-size:15px;color:#aaaaaa;line-height:1.65;">
                ${isCouples
                  ? `<strong style="color:#ffffff;">${brand.trainers.couples.name}</strong> built this for couples. Your <strong style="color:#ffffff;">${planName}</strong> is live and ready to go.`
                  : `<strong style="color:#ffffff;">${trainerName}</strong> has your program loaded. Tap below to jump straight into your <strong style="color:#ffffff;">${planName}</strong> — no password needed.`
                }
              </p>

              <!-- CTA Button -->
              <table cellpadding="0" cellspacing="0" border="0" width="100%">
                <tr>
                  <td>
                    <a href="${magicLink}" class="btn"
                      style="display:block;background-color:${accentColor};color:#000000;
                        text-decoration:none;text-align:center;
                        padding:18px 32px;
                        font-size:11px;font-weight:800;letter-spacing:0.25em;
                        text-transform:uppercase;mso-padding-alt:0;">
                      Access My Plan →
                    </a>
                  </td>
                </tr>
              </table>

              <!-- Expiry note -->
              <p style="margin:16px 0 0;font-size:11px;color:${mutedText};text-align:center;line-height:1.5;">
                Link expires in 24 hours · Or set a password on the purchase page
              </p>
            </td>
          </tr>

          <!-- ── SPACER ── -->
          <tr><td style="height:12px;"></td></tr>

          <!-- ── PLAN SUMMARY ── -->
          <tr>
            <td bgcolor="${cardBg}" style="background-color:${cardBg};border:1px solid ${borderColor};padding:28px 40px;" class="pad">

              <!-- Section label -->
              <p style="margin:0 0 18px;font-size:10px;font-weight:700;letter-spacing:0.3em;
                text-transform:uppercase;color:${mutedText};">
                What's Included
              </p>

              <!-- Plan name row -->
              <table cellpadding="0" cellspacing="0" border="0" width="100%"
                style="border-bottom:1px solid ${borderColor};padding-bottom:16px;margin-bottom:16px;">
                <tr>
                  <td>
                    <p style="margin:0;font-size:16px;font-weight:700;color:#ffffff;">${planName}</p>
                    <p style="margin:4px 0 0;font-size:12px;color:${mutedText};">
                      ${isCouples ? "21-day program · Lifetime access" : "30-day program · Lifetime access"}
                    </p>
                  </td>
                  <td align="right" valign="top">
                    <p style="margin:0;font-size:22px;font-weight:800;color:${accentColor};">
                      ${isCouples ? couplesPrice : defaultPrice}<span style="font-size:13px;color:${mutedText};">${isCouples ? couplesCents : defaultCents}</span>
                    </p>
                  </td>
                </tr>
              </table>

              <!-- Bullet list -->
              <table cellpadding="0" cellspacing="0" border="0" width="100%">
                ${includedRows}
              </table>
            </td>
          </tr>

          <!-- ── SPACER ── -->
          <tr><td style="height:12px;"></td></tr>

          <!-- ── SOCIAL PROOF STRIP ── -->
          <tr>
            <td bgcolor="${cardBg}" style="background-color:${cardBg};border:1px solid ${borderColor};
              padding:20px 40px;text-align:center;" class="pad">
              <p style="margin:0;font-size:13px;color:#aaaaaa;line-height:1.6;">
                ${isCouples
                  ? `💪 <strong style="color:#ffffff;">Couples who train together, stay together.</strong> 21 days starts today.`
                  : `💪 <strong style="color:#ffffff;">Consistency beats intensity.</strong> Day 1 is always the hardest — just show up.`
                }
              </p>
            </td>
          </tr>

          <!-- ── FOOTER ── -->
          <tr>
            <td style="padding:28px 0 0;">
              <p style="margin:0;font-size:11px;color:#444444;line-height:1.6;text-align:center;">
                You received this because you purchased a plan at ${brand.domain.replace("https://", "")}.<br />
                Questions? Reply to this email — we're real people.
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
    subject: `You're in — ${planName} is ready 🔥`,
    html,
  });
}
