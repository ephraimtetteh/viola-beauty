export const wrap = (title, body) => `
<!DOCTYPE html>
<html>
<body style="margin:0;padding:0;background:#fff8f5;font-family:Georgia,serif;">
  <div style="background:#1a1a1a;padding:32px 24px;text-align:center;">
    <p style="color:#d4b86a;font-size:10px;letter-spacing:5px;margin:0 0 8px;
              text-transform:uppercase;">Viola Beauty</p>
    <h1 style="color:#fff;font-size:22px;margin:0;font-weight:600;line-height:1.4;">
      ${title}
    </h1>
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

export const infoTable = (rows) => `
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
