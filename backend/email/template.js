import transporter from "./transporter.js";
import Activity from "../models/Activity.js";

// ── Shared branded wrapper ──
const wrap = (title, body) => `
<!DOCTYPE html>
<html>
<body style="margin:0;padding:0;background:#fff8f5;font-family:Georgia,serif;">
  <div style="background:#1a1a1a;padding:32px 24px;text-align:center;">
    <p style="color:#d4b86a;font-size:10px;letter-spacing:5px;margin:0 0 8px;text-transform:uppercase;">
      Viola Beauty
    </p>
    <h1 style="color:#fff;font-size:22px;margin:0;font-weight:600;line-height:1.4;">
      ${title}
    </h1>
  </div>
  <div style="height:3px;background:linear-gradient(to right,#d4b86a,#7c5546);"></div>
  <div style="max-width:560px;margin:0 auto;padding:36px 24px;">
    ${body}
    <div style="border-top:1px solid #f0e6dd;padding-top:20px;margin-top:28px;text-align:center;">
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
      If you have any questions, simply reply to this email — we're always here.
    </p>
  </div>
</body>
</html>`;

// ── Booking detail table ──
const bookingTable = (b) => `
  <div style="background:#fff;border:1px solid #e8d9cc;border-radius:14px;overflow:hidden;margin:20px 0;">
    <div style="height:3px;background:linear-gradient(to right,#d4b86a,#7c5546);"></div>
    <div style="padding:20px;">
      <p style="color:#d4b86a;font-size:10px;letter-spacing:3px;text-transform:uppercase;
                margin:0 0 14px;font-weight:600;">Booking Details</p>
      <table style="width:100%;border-collapse:collapse;">
        ${[
          ["Service", b.category],
          ["Package", b.package],
          ["Date", b.date],
          ["Location", b.location],
          ["People", b.numberOfPeople],
          ["Notes", b.notes],
        ]
          .map(
            ([k, v], i, a) => `
          <tr>
            <td style="color:#888;font-size:13px;padding:9px 0;
                       ${i < a.length - 1 ? "border-bottom:1px solid #f0e6dd;" : ""}
                       width:40%;">${k}</td>
            <td style="color:#1a1a1a;font-size:13px;font-weight:600;padding:9px 0;
                       ${i < a.length - 1 ? "border-bottom:1px solid #f0e6dd;" : ""}
                       text-align:right;">${v}</td>
          </tr>`,
          )
          .join("")}
      </table>
    </div>
  </div>`;

// ── Send new booking emails ──
export const sendBookingEmails = async (booking) => {
  // Client confirmation
  await transporter.sendMail({
    from: `"Viola Beauty" <${process.env.NODEMAILER_USER}>`,
    to: booking.email,
    replyTo: process.env.NODEMAILER_USER,
    subject: `Your Viola Beauty Booking is Received, ${booking.firstName}! ✨`,
    html: wrap(
      `We've Got Your Booking, ${booking.firstName}! 🎉`,
      `<p style="color:#555;font-size:14px;line-height:1.8;margin:0 0 16px;">
        Thank you for choosing Viola Beauty! Your <strong style="color:#7c5546;">
        ${booking.category}</strong> booking request has been received.
        Our team will reach out within <strong>24 hours</strong> to confirm
        your appointment.
      </p>
      ${bookingTable(booking)}
      <div style="background:#fdf6e3;border-left:3px solid #d4b86a;
                  border-radius:0 12px 12px 0;padding:14px 18px;margin:0 0 20px;">
        <p style="color:#7c5546;font-size:13px;font-weight:700;margin:0 0 8px;">
          What happens next?
        </p>
        <p style="color:#555;font-size:13px;line-height:1.7;margin:0;">
          We will contact you within 24 hours to confirm availability and
          discuss deposit requirements to secure your date.
        </p>
      </div>`,
    ),
  });

  // Viola internal notification
  await transporter.sendMail({
    from: `"Viola Bookings" <${process.env.NODEMAILER_USER}>`,
    to: process.env.ADMIN_EMAIL,
    replyTo: booking.email,
    subject: `🔔 New ${booking.category} Booking — ${booking.firstName} ${booking.lastName} | ${booking.date}`,
    html: wrap(
      "🔔 New Booking Request",
      `<div style="background:#fdf6e3;border:1px solid #d4b86a;border-radius:12px;
                  padding:14px 18px;margin:0 0 20px;">
        <p style="color:#7c5546;font-size:13px;font-weight:700;margin:0;">
          ⏰ Please respond within 24 hours
        </p>
      </div>
      <div style="background:#fff;border:1px solid #e8d9cc;border-radius:14px;
                  overflow:hidden;margin:0 0 16px;">
        <div style="height:3px;background:linear-gradient(to right,#d4b86a,#7c5546);"></div>
        <div style="padding:20px;">
          <p style="color:#d4b86a;font-size:10px;letter-spacing:3px;text-transform:uppercase;
                    margin:0 0 14px;font-weight:600;">Client Information</p>
          <table style="width:100%;border-collapse:collapse;">
            ${[
              ["Name", `${booking.firstName} ${booking.lastName}`],
              ["Email", booking.email],
              ["Phone", booking.phone],
            ]
              .map(
                ([k, v], i, a) => `
              <tr>
                <td style="color:#888;font-size:13px;padding:9px 0;
                           ${i < a.length - 1 ? "border-bottom:1px solid #f0e6dd;" : ""}
                           width:40%;">${k}</td>
                <td style="color:#1a1a1a;font-size:13px;font-weight:700;padding:9px 0;
                           ${i < a.length - 1 ? "border-bottom:1px solid #f0e6dd;" : ""}
                           text-align:right;">${v}</td>
              </tr>`,
              )
              .join("")}
          </table>
        </div>
      </div>
      ${bookingTable(booking)}
      <div style="text-align:center;margin:24px 0;">
        <a href="mailto:${booking.email}?subject=Re: Your Viola Beauty Booking"
          style="display:inline-block;background:#1a1a1a;color:#fff;text-decoration:none;
                 padding:12px 28px;border-radius:50px;font-size:13px;font-weight:600;margin:0 6px;">
          Reply to Client
        </a>
        <a href="tel:${booking.phone}"
          style="display:inline-block;background:#d4b86a;color:#1a1a1a;text-decoration:none;
                 padding:12px 28px;border-radius:50px;font-size:13px;font-weight:600;margin:0 6px;">
          Call Client
        </a>
      </div>`,
    ),
  });

  await Activity.create({
    type: "email_sent",
    message: `Booking emails sent to ${booking.email}`,
  });
};

// ── Send status update email ──
export const sendStatusEmail = async (booking, status) => {
  const content = {
    confirmed: {
      title: `Your Booking is Confirmed, ${booking.firstName}! 🎉`,
      body: `
        <p style="color:#555;font-size:14px;line-height:1.8;margin:0 0 16px;">
          We are thrilled to confirm your <strong style="color:#7c5546;">
          ${booking.package}</strong> appointment on
          <strong>${booking.date}</strong>. Get ready for an incredible
          experience! 💄
        </p>
        ${bookingTable(booking)}
        <div style="background:#fdf6e3;border-left:3px solid #d4b86a;
                    border-radius:0 12px 12px 0;padding:14px 18px;">
          <p style="color:#7c5546;font-size:13px;font-weight:700;margin:0 0 6px;">
            Important
          </p>
          <p style="color:#555;font-size:13px;line-height:1.7;margin:0;">
            Please ensure you arrive on time and have completed your skin prep.
            Reply to this email if you have any questions before your appointment.
          </p>
        </div>`,
    },
    declined: {
      title: `Regarding Your Booking, ${booking.firstName}`,
      body: `
        <p style="color:#555;font-size:14px;line-height:1.8;margin:0 0 16px;">
          Thank you so much for your interest in Viola Beauty. Unfortunately,
          we are unable to accommodate your request for
          <strong>${booking.date}</strong> due to availability constraints.
        </p>
        <p style="color:#555;font-size:14px;line-height:1.8;margin:0 0 16px;">
          We would love to find an alternative date. Please reply to this
          email or visit our website to submit a new request.
        </p>`,
    },
  };

  const { title, body } = content[status] || {};
  if (!title) return;

  await transporter.sendMail({
    from: `"Viola Beauty" <${process.env.NODEMAILER_USER}>`,
    to: booking.email,
    replyTo: process.env.NODEMAILER_USER,
    subject: title,
    html: wrap(title, body),
  });

  await Activity.create({
    type: "email_sent",
    message: `Status email (${status}) sent to ${booking.email}`,
  });
};
