import { Resend } from "resend";

const resend = new Resend(import.meta.env.RESEND_API_KEY);

export default async function handler(req, res) {
  if (req.method !== "POST") return res.status(405).end();

  const { email, firstName, lastName, courseName, courseLevel, reference } =
    req.body;

  try {
    await resend.emails.send({
      from: "Viola Beauty <hello@send.violabeautymua.com>",
      to: email,
      subject: `Welcome to ${courseName}, ${firstName}! ✨`,
      html: `
        <!DOCTYPE html>
        <html>
          <head>
            <meta charset="utf-8" />
            <meta name="viewport" content="width=device-width, initial-scale=1.0" />
          </head>
          <body style="margin:0;padding:0;background-color:#fff8f5;font-family:Georgia,serif;">

            <!-- Header -->
            <div style="background-color:#1a1a1a;padding:32px 24px;text-align:center;">
              <p style="color:#d4b86a;font-size:11px;letter-spacing:4px;margin:0 0 8px 0;text-transform:uppercase;">
                Viola Beauty
              </p>
              <h1 style="color:#ffffff;font-size:26px;margin:0;font-weight:600;">
                You're In, ${firstName}! 🎉
              </h1>
            </div>

            <!-- Gold bar -->
            <div style="height:3px;background:linear-gradient(to right,#d4b86a,#7c5546);"></div>

            <!-- Body -->
            <div style="max-width:560px;margin:0 auto;padding:40px 24px;">

              <!-- Greeting -->
              <p style="color:#1a1a1a;font-size:16px;line-height:1.7;margin:0 0 16px 0;">
                Dear ${firstName} ${lastName},
              </p>
              <p style="color:#444444;font-size:15px;line-height:1.8;margin:0 0 24px 0;">
                Thank you so much for purchasing <strong style="color:#7c5546;">${courseName}</strong>. 
                We are so proud of you for investing in yourself and your craft — this is just 
                the beginning of something beautiful. ✨
              </p>

              <!-- Course card -->
              <div style="background:#ffffff;border:1px solid #e8d9cc;border-radius:16px;padding:24px;margin:0 0 28px 0;">
                <p style="color:#d4b86a;font-size:10px;letter-spacing:3px;text-transform:uppercase;margin:0 0 12px 0;">
                  Your Course Details
                </p>
                <table style="width:100%;border-collapse:collapse;">
                  <tr>
                    <td style="color:#888;font-size:13px;padding:8px 0;border-bottom:1px solid #f0e6dd;">Course</td>
                    <td style="color:#1a1a1a;font-size:13px;font-weight:600;padding:8px 0;border-bottom:1px solid #f0e6dd;text-align:right;">${courseName}</td>
                  </tr>
                  <tr>
                    <td style="color:#888;font-size:13px;padding:8px 0;border-bottom:1px solid #f0e6dd;">Level</td>
                    <td style="color:#1a1a1a;font-size:13px;padding:8px 0;border-bottom:1px solid #f0e6dd;text-align:right;">${courseLevel}</td>
                  </tr>
                  <tr>
                    <td style="color:#888;font-size:13px;padding:8px 0;">Reference</td>
                    <td style="color:#1a1a1a;font-size:13px;font-family:monospace;padding:8px 0;text-align:right;">${reference}</td>
                  </tr>
                </table>
              </div>

              <!-- Next steps -->
              <div style="background:#fdf6e3;border-left:3px solid #d4b86a;border-radius:0 8px 8px 0;padding:16px 20px;margin:0 0 28px 0;">
                <p style="color:#7c5546;font-size:13px;font-weight:600;margin:0 0 8px 0;">What happens next?</p>
                <p style="color:#555;font-size:13px;line-height:1.7;margin:0;">
                  Check your inbox for an email from <strong>Thinkific</strong> with your login 
                  details and a direct link to start your course. If you don't see it within 
                  a few minutes, please check your spam folder.
                </p>
              </div>

              <!-- Quote -->
              <div style="text-align:center;padding:24px 0;border-top:1px solid #f0e6dd;border-bottom:1px solid #f0e6dd;margin:0 0 28px 0;">
                <p style="color:#7c5546;font-size:15px;font-style:italic;line-height:1.8;margin:0 0 8px 0;">
                  "True beauty is on the inside. When wearing your makeup,<br/>
                  remember to wear your personality and who you truly are."
                </p>
                <p style="color:#d4b86a;font-size:12px;margin:0;">— Viola's Secrets</p>
              </div>

              <!-- Closing -->
              <p style="color:#444;font-size:15px;line-height:1.8;margin:0 0 8px 0;">
                We are beyond excited to be part of your journey. Now go show the world 
                what you're made of! 💄
              </p>
              <p style="color:#444;font-size:15px;margin:0 0 4px 0;">With love,</p>
              <p style="color:#7c5546;font-size:15px;font-weight:600;margin:0;">Viola Beauty</p>
              <p style="color:#d4b86a;font-size:13px;margin:4px 0 0 0;">hello@violabeauty.com</p>
            </div>

            <!-- Footer -->
            <div style="background:#1a1a1a;padding:20px 24px;text-align:center;">
              <p style="color:#666;font-size:11px;margin:0;">
                If you have any questions, simply reply to this email — we're always here.
              </p>
            </div>

          </body>
        </html>
      `,
    });

    res.status(200).json({ success: true });
  } catch (err) {
    console.error("Resend error:", err);
    res.status(500).json({ error: "Failed to send email" });
  }
}
