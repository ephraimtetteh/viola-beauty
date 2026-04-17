import transporter from "./transporter.js";
import { wrap, infoTable } from "./base.js";

const ADMIN_EMAILS = [
  process.env.ADMIN_EMAIL_1,
  process.env.ADMIN_EMAIL_2,
].filter(Boolean);

// ── Student registration confirmation ──
export const sendClassRegistrationEmail = async (reg, cls) => {
  // To student
  await transporter.sendMail({
    from: `"Viola Beauty" <${process.env.NODEMAILER_USER}>`,
    to: reg.email,
    replyTo: process.env.NODEMAILER_USER,
    subject: `You're registered for ${cls.title}! ✨`,
    html: wrap(
      `You're In, ${reg.firstName}!`,
      `<p style="color:#555;font-size:14px;line-height:1.8;margin:0 0 16px;">
        Thank you for registering for <strong style="color:#7c5546;">${cls.title}</strong>.
        Your deposit has been received and your spot is now secured.
      </p>
      ${infoTable([
        ["Class", cls.title],
        ["Date", cls.date],
        ["Time", cls.time],
        ["Location", cls.location],
        ["Duration", cls.duration],
        ["Deposit", `GH₵ ${(reg.depositPaid / 100).toFixed(2)}`],
        ["Balance", `GH₵ ${((cls.price - reg.depositPaid) / 100).toFixed(2)}`],
        ["Reference", reg.reference],
      ])}
      <div style="background:#fdf6e3;border-left:3px solid #d4b86a;
                  border-radius:0 12px 12px 0;padding:14px 18px;margin:20px 0;">
        <p style="color:#7c5546;font-size:13px;font-weight:700;margin:0 0 8px;">
          What to bring
        </p>
        <p style="color:#555;font-size:13px;line-height:1.7;margin:0;">
          Bring a notepad, your enthusiasm, and any makeup products you currently own.
          A detailed list will be sent closer to the date.
        </p>
      </div>
      <p style="color:#555;font-size:13px;line-height:1.7;">
        The balance of <strong>GH₵ ${((cls.price - reg.depositPaid) / 100).toFixed(2)}</strong>
        is due on the day of the class. If you have any questions reply to this email.
      </p>`,
    ),
  });

  // To admins
  await transporter.sendMail({
    from: `"Viola System" <${process.env.NODEMAILER_USER}>`,
    to: ADMIN_EMAILS.join(","),
    replyTo: reg.email,
    subject: `New Class Registration — ${reg.firstName} ${reg.lastName} | ${cls.title} | ${cls.date}`,
    html: wrap(
      "New Class Registration",
      `<div style="background:#fdf6e3;border:1px solid #d4b86a;border-radius:12px;
                  padding:14px 18px;margin:0 0 20px;">
        <p style="color:#7c5546;font-size:13px;font-weight:700;margin:0;">
          Deposit received — spot secured
        </p>
      </div>
      ${infoTable([
        ["Student", `${reg.firstName} ${reg.lastName}`],
        ["Email", reg.email],
        ["Phone", reg.phone],
        ["Class", cls.title],
        ["Date", cls.date],
        ["Deposit", `GH₵ ${(reg.depositPaid / 100).toFixed(2)}`],
        ["Reference", reg.reference],
        ["Experience", reg.experience || "Not specified"],
        ["Goals", reg.goals || "Not specified"],
      ])}
      <div style="text-align:center;margin:20px 0;">
        <a href="mailto:${reg.email}"
          style="display:inline-block;background:#1a1a1a;color:#fff;
                 text-decoration:none;padding:12px 28px;border-radius:50px;
                 font-size:13px;font-weight:600;margin:0 6px;">
          Email Student
        </a>
        <a href="tel:${reg.phone}"
          style="display:inline-block;background:#d4b86a;color:#1a1a1a;
                 text-decoration:none;padding:12px 28px;border-radius:50px;
                 font-size:13px;font-weight:600;margin:0 6px;">
          Call Student
        </a>
      </div>`,
    ),
  });
};
