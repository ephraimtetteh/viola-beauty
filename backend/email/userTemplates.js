import transporter from "./transporter.js";

const ADMIN_EMAILS = [
  process.env.ADMIN_EMAIL_1,
  process.env.ADMIN_EMAIL_2,
].filter(Boolean);

const wrap = (title, body) => `
<!DOCTYPE html>
<html>
<body style="margin:0;padding:0;background:#fff8f5;font-family:Georgia,serif;">
  <div style="background:#1a1a1a;padding:32px 24px;text-align:center;">
    <p style="color:#d4b86a;font-size:10px;letter-spacing:5px;margin:0 0 8px;
              text-transform:uppercase;">Viola Beauty</p>
    <h1 style="color:#fff;font-size:22px;margin:0;font-weight:600;">${title}</h1>
  </div>
  <div style="height:3px;background:linear-gradient(to right,#d4b86a,#7c5546);"></div>
  <div style="max-width:560px;margin:0 auto;padding:36px 24px;">
    ${body}
    <div style="border-top:1px solid #f0e6dd;padding-top:20px;margin-top:28px;
                text-align:center;">
      <p style="color:#7c5546;font-size:14px;font-style:italic;line-height:1.8;">
        "True beauty is on the inside. When wearing your makeup,<br/>
        remember to wear your personality and who you truly are."
      </p>
      <p style="color:#d4b86a;font-size:12px;margin:6px 0 0;">— Viola's Secrets</p>
    </div>
    <p style="color:#555;font-size:14px;margin:20px 0 2px;">With love,</p>
    <p style="color:#7c5546;font-size:15px;font-weight:600;margin:0;">Viola Beauty</p>
    <p style="color:#d4b86a;font-size:13px;margin:4px 0 0;">
      hello@violabeautymua.com
    </p>
  </div>
  <div style="background:#1a1a1a;padding:20px 24px;text-align:center;">
    <p style="color:#666;font-size:11px;margin:0;">
      If you have any questions reply to this email — we're always here.
    </p>
  </div>
</body>
</html>`;

const infoTable = (rows) => `
  <div style="background:#fff;border:1px solid #e8d9cc;border-radius:14px;
              overflow:hidden;margin:20px 0;">
    <div style="height:3px;background:linear-gradient(to right,#d4b86a,#7c5546);"></div>
    <div style="padding:20px;">
      <table style="width:100%;border-collapse:collapse;">
        ${rows
          .map(
            ([k, v], i, a) => `
          <tr>
            <td style="color:#888;font-size:13px;padding:9px 0;width:40%;
                       ${i < a.length - 1 ? "border-bottom:1px solid #f0e6dd;" : ""}">
              ${k}
            </td>
            <td style="color:#1a1a1a;font-size:13px;font-weight:600;
                       padding:9px 0;text-align:right;
                       ${i < a.length - 1 ? "border-bottom:1px solid #f0e6dd;" : ""}">
              ${v}
            </td>
          </tr>`,
          )
          .join("")}
      </table>
    </div>
  </div>`;

// ── Welcome email to new user ──
export const sendWelcomeEmail = async (user) => {
  // To user
  await transporter.sendMail({
    from: `"Viola Beauty" <${process.env.NODEMAILER_USER}>`,
    to: user.email,
    subject: `Welcome to Viola Beauty, ${user.firstName}! ✨`,
    html: wrap(
      `Welcome, ${user.firstName}! 💄`,
      `<p style="color:#555;font-size:14px;line-height:1.8;margin:0 0 16px;">
        We are so excited to have you join the Viola Beauty family! Your
        account has been created and you can now track your bookings and
        purchases all in one place.
      </p>
      <div style="background:#fdf6e3;border-left:3px solid #d4b86a;
                  border-radius:0 12px 12px 0;padding:14px 18px;margin:0 0 20px;">
        <p style="color:#7c5546;font-size:13px;font-weight:700;margin:0 0 8px;">
          With your account you can:
        </p>
        <p style="color:#555;font-size:13px;line-height:1.9;margin:0;">
          ✦ View and track all your bookings<br/>
          ✦ Access your purchased courses<br/>
          ✦ Update your profile anytime
        </p>
      </div>`,
    ),
  });

  // Notify both admins
  await transporter.sendMail({
    from: `"Viola System" <${process.env.NODEMAILER_USER}>`,
    to: ADMIN_EMAILS.join(","),
    subject: `👤 New User — ${user.firstName} ${user.lastName}`,
    html: wrap(
      "New User Registration",
      infoTable([
        ["Name", `${user.firstName} ${user.lastName}`],
        ["Email", user.email],
        ["Phone", user.phone],
        [
          "Joined",
          new Date().toLocaleDateString("en-GB", {
            day: "numeric",
            month: "long",
            year: "numeric",
          }),
        ],
      ]),
    ),
  });
};
