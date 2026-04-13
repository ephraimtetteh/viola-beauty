import transporter from "./transporter.js";
import { wrap, infoTable } from "./base.js";

const ADMIN_EMAILS = [
  process.env.ADMIN_EMAIL_1,
  process.env.ADMIN_EMAIL_2,
].filter(Boolean);

// ── Course purchase thank you ──
export const sendCourseEmail = async ({
  email,
  firstName,
  lastName,
  courseName,
  courseLevel,
  reference,
}) => {
  await transporter.sendMail({
    from: `"Viola Beauty" <${process.env.NODEMAILER_USER}>`,
    to: email,
    replyTo: process.env.NODEMAILER_USER,
    subject: `Welcome to ${courseName}, ${firstName}! ✨`,
    html: wrap(
      `You're In, ${firstName}! 🎉`,
      `<p style="color:#555;font-size:14px;line-height:1.8;margin:0 0 16px;">
        Thank you so much for purchasing
        <strong style="color:#7c5546;">${courseName}</strong>.
        We are so proud of you for investing in yourself — this is just
        the beginning of something beautiful. ✨
      </p>
      ${infoTable([
        ["Course", courseName],
        ["Level", courseLevel],
        ["Reference", reference],
      ])}
      <div style="background:#fdf6e3;border-left:3px solid #d4b86a;
                  border-radius:0 12px 12px 0;padding:14px 18px;margin:20px 0;">
        <p style="color:#7c5546;font-size:13px;font-weight:700;margin:0 0 8px;">
          What happens next?
        </p>
        <p style="color:#555;font-size:13px;line-height:1.7;margin:0;">
          Check your inbox for an email from <strong>Thinkific</strong> with
          your login details. If you don't see it within a few minutes,
          please check your spam folder.
        </p>
      </div>`,
    ),
  });

  // Notify admins
  await transporter.sendMail({
    from: `"Viola System" <${process.env.NODEMAILER_USER}>`,
    to: ADMIN_EMAILS.join(","),
    subject: `💰 Course Purchase — ${firstName} ${lastName} | ${courseName}`,
    html: wrap(
      "New Course Purchase",
      infoTable([
        ["Name", `${firstName} ${lastName}`],
        ["Email", email],
        ["Course", courseName],
        ["Level", courseLevel],
        ["Reference", reference],
        [
          "Date",
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

// ── Welcome email on registration ──
export const sendWelcomeEmail = async (user) => {
  await transporter.sendMail({
    from: `"Viola Beauty" <${process.env.NODEMAILER_USER}>`,
    to: user.email,
    subject: `Welcome to Viola Beauty, ${user.firstName}! ✨`,
    html: wrap(
      `Welcome, ${user.firstName}! 💄`,
      `<p style="color:#555;font-size:14px;line-height:1.8;margin:0 0 16px;">
        We are so excited to have you join the Viola Beauty family!
        Your account has been created and you can now track your
        bookings and purchases all in one place.
      </p>
      <div style="background:#fdf6e3;border-left:3px solid #d4b86a;
                  border-radius:0 12px 12px 0;padding:14px 18px;">
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

  // Notify admins
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
