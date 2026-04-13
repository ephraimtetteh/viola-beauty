import transporter from "./transporter.js";
import { wrap, infoTable } from "./base.js";
import Activity from "../models/Activity.js";

const ADMIN_EMAILS = [
  process.env.ADMIN_EMAIL_1,
  process.env.ADMIN_EMAIL_2,
].filter(Boolean);

const bookingTable = (b) =>
  infoTable([
    ["Service", b.category],
    ["Package", b.package],
    ["Date", b.date],
    ["Location", b.location || "Not specified"],
    ["People", b.numberOfPeople || "Not specified"],
    ["Notes", b.notes || "None"],
  ]);

// ── New booking — send to client + both admins ──
export const sendBookingEmails = async (booking) => {
  // 1. Client confirmation
  await transporter.sendMail({
    from: `"Viola Beauty" <${process.env.NODEMAILER_USER}>`,
    to: booking.email,
    replyTo: process.env.NODEMAILER_USER,
    subject: `Your Viola Beauty Booking is Received, ${booking.firstName}! ✨`,
    html: wrap(
      `We've Got Your Booking, ${booking.firstName}! 🎉`,
      `<p style="color:#555;font-size:14px;line-height:1.8;margin:0 0 16px;">
        Thank you for choosing Viola Beauty! Your
        <strong style="color:#7c5546;">${booking.category}</strong>
        booking request has been received. Our team will reach out within
        <strong>24 hours</strong> to confirm your appointment.
      </p>
      ${bookingTable(booking)}
      <div style="background:#fdf6e3;border-left:3px solid #d4b86a;
                  border-radius:0 12px 12px 0;padding:14px 18px;">
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

  // 2. Admin notification — both emails
  await transporter.sendMail({
    from: `"Viola Bookings" <${process.env.NODEMAILER_USER}>`,
    to: ADMIN_EMAILS.join(","),
    replyTo: booking.email,
    subject: `🔔 New ${booking.category} — ${booking.firstName} ${booking.lastName} | ${booking.date}`,
    html: wrap(
      "🔔 New Booking Request",
      `<div style="background:#fdf6e3;border:1px solid #d4b86a;border-radius:12px;
                  padding:14px 18px;margin:0 0 20px;">
        <p style="color:#7c5546;font-size:13px;font-weight:700;margin:0;">
          ⏰ Please respond within 24 hours
        </p>
      </div>
      ${infoTable([
        ["Name", `${booking.firstName} ${booking.lastName}`],
        ["Email", booking.email],
        ["Phone", booking.phone],
      ])}
      ${bookingTable(booking)}
      <div style="text-align:center;margin:24px 0;">
        <a href="mailto:${booking.email}?subject=Re: Your Viola Beauty Booking"
          style="display:inline-block;background:#1a1a1a;color:#fff;text-decoration:none;
                 padding:12px 28px;border-radius:50px;font-size:13px;font-weight:600;
                 margin:0 6px;">
          Reply to Client
        </a>
        <a href="tel:${booking.phone}"
          style="display:inline-block;background:#d4b86a;color:#1a1a1a;text-decoration:none;
                 padding:12px 28px;border-radius:50px;font-size:13px;font-weight:600;
                 margin:0 6px;">
          Call Client
        </a>
      </div>`,
    ),
  });

  await Activity.create({
    type: "email_sent",
    message: `Booking emails sent to ${booking.email} and admins`,
  });
};

// ── Status update — confirmed or declined ──
export const sendStatusEmail = async (booking, status) => {
  const content = {
    confirmed: {
      title: `Your Booking is Confirmed, ${booking.firstName}! 🎉`,
      body: `
        <p style="color:#555;font-size:14px;line-height:1.8;margin:0 0 16px;">
          We are thrilled to confirm your
          <strong style="color:#7c5546;">${booking.package}</strong>
          appointment on <strong>${booking.date}</strong>. 💄
        </p>
        ${bookingTable(booking)}
        <div style="background:#fdf6e3;border-left:3px solid #d4b86a;
                    border-radius:0 12px 12px 0;padding:14px 18px;">
          <p style="color:#7c5546;font-size:13px;font-weight:700;margin:0 0 6px;">
            Important
          </p>
          <p style="color:#555;font-size:13px;line-height:1.7;margin:0;">
            Please arrive on time and complete your skin prep. Reply to
            this email if you have any questions before your appointment.
          </p>
        </div>`,
    },
    declined: {
      title: `Regarding Your Booking, ${booking.firstName}`,
      body: `
        <p style="color:#555;font-size:14px;line-height:1.8;margin:0 0 16px;">
          Thank you for your interest in Viola Beauty. Unfortunately we are
          unable to accommodate your request for <strong>${booking.date}</strong>
          due to availability constraints.
        </p>
        <p style="color:#555;font-size:14px;line-height:1.8;">
          We'd love to find an alternative date. Please reply to this email
          or visit our website to submit a new request.
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
