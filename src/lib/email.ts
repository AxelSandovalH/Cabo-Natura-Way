import { Resend } from "resend";
import type { Order, OrderItem } from "@/lib/supabase/types";

let _resend: Resend | null = null;
function getResend(): Resend {
  if (!_resend) _resend = new Resend(process.env.RESEND_API_KEY ?? "");
  return _resend;
}

const FROM_EMAIL  = "Cabo Natural Way <orders@cabonaturalway.com>";
const ADMIN_EMAIL = process.env.ADMIN_EMAIL ?? "admin@cabonaturalway.com";
const WHATSAPP    = "https://wa.me/526241234567";

// ─── Shared helpers ───────────────────────────────────────────────────────────

function shortId(id: string) {
  return id.slice(0, 8).toUpperCase();
}

function formatItems(items: OrderItem[]): string {
  return items
    .map(
      (item) => `
        <tr>
          <td style="padding:10px 12px;border-bottom:1px solid #eee;font-size:14px;color:#2D2D2D;">
            ${item.product_name}
          </td>
          <td style="padding:10px 12px;border-bottom:1px solid #eee;font-size:14px;color:#6B5B4B;text-align:center;">
            ×${item.quantity}
          </td>
          <td style="padding:10px 12px;border-bottom:1px solid #eee;font-size:14px;color:#2D5016;text-align:right;font-weight:600;">
            $${(item.unit_price * item.quantity).toFixed(2)}
          </td>
        </tr>`
    )
    .join("");
}

// ─── Admin notification ───────────────────────────────────────────────────────

export async function sendAdminOrderNotification(
  order: Order,
  items: OrderItem[]
) {
  const id = shortId(order.id);

  const html = `<!DOCTYPE html>
<html lang="en">
<head><meta charset="UTF-8"><meta name="viewport" content="width=device-width,initial-scale=1.0"><title>New Order #${id}</title></head>
<body style="margin:0;padding:0;background:#F4F4F0;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background:#F4F4F0;padding:40px 16px;">
    <tr><td align="center">
      <table width="600" cellpadding="0" cellspacing="0" style="max-width:600px;width:100%;background:#ffffff;border-radius:16px;overflow:hidden;box-shadow:0 2px 8px rgba(0,0,0,.08);">

        <!-- Header -->
        <tr><td style="background:linear-gradient(135deg,#2D5016,#1a3009);padding:32px 40px;">
          <p style="margin:0 0 6px;font-size:11px;font-weight:700;letter-spacing:.18em;text-transform:uppercase;color:#E8A838;">New Order</p>
          <h1 style="margin:0;font-size:28px;font-weight:800;color:#ffffff;">Order #${id}</h1>
          <p style="margin:8px 0 0;font-size:14px;color:rgba(255,255,255,.65);">
            ${new Date(order.created_at).toLocaleString("en-US", { dateStyle: "long", timeStyle: "short" })}
          </p>
        </td></tr>

        <!-- Body -->
        <tr><td style="padding:32px 40px;">

          <!-- Customer -->
          <h2 style="margin:0 0 16px;font-size:13px;font-weight:700;letter-spacing:.12em;text-transform:uppercase;color:#C4602A;">Customer</h2>
          <table width="100%" cellpadding="0" cellspacing="0" style="background:#FAFAF7;border-radius:10px;padding:18px 20px;margin-bottom:28px;">
            <tr>
              <td style="font-size:14px;color:#6B5B4B;padding:4px 0;width:120px;">Name</td>
              <td style="font-size:14px;color:#2D2D2D;font-weight:600;padding:4px 0;">${order.customer_name}</td>
            </tr>
            <tr>
              <td style="font-size:14px;color:#6B5B4B;padding:4px 0;">Email</td>
              <td style="font-size:14px;color:#2D2D2D;padding:4px 0;"><a href="mailto:${order.customer_email}" style="color:#2D5016;">${order.customer_email}</a></td>
            </tr>
            ${order.customer_phone ? `
            <tr>
              <td style="font-size:14px;color:#6B5B4B;padding:4px 0;">Phone</td>
              <td style="font-size:14px;color:#2D2D2D;padding:4px 0;">${order.customer_phone}</td>
            </tr>` : ""}
            <tr>
              <td style="font-size:14px;color:#6B5B4B;padding:4px 0;">Address</td>
              <td style="font-size:14px;color:#2D2D2D;padding:4px 0;">${order.delivery_address ?? "—"}</td>
            </tr>
            ${order.delivery_notes ? `
            <tr>
              <td style="font-size:14px;color:#6B5B4B;padding:4px 0;">Notes</td>
              <td style="font-size:14px;color:#2D2D2D;padding:4px 0;font-style:italic;">${order.delivery_notes}</td>
            </tr>` : ""}
          </table>

          <!-- Items -->
          <h2 style="margin:0 0 16px;font-size:13px;font-weight:700;letter-spacing:.12em;text-transform:uppercase;color:#C4602A;">Items</h2>
          <table width="100%" cellpadding="0" cellspacing="0" style="border:1px solid #eee;border-radius:10px;overflow:hidden;margin-bottom:24px;">
            <thead>
              <tr style="background:#FAFAF7;">
                <th style="padding:10px 12px;font-size:11px;font-weight:700;letter-spacing:.08em;text-transform:uppercase;color:#6B5B4B;text-align:left;">Product</th>
                <th style="padding:10px 12px;font-size:11px;font-weight:700;letter-spacing:.08em;text-transform:uppercase;color:#6B5B4B;text-align:center;">Qty</th>
                <th style="padding:10px 12px;font-size:11px;font-weight:700;letter-spacing:.08em;text-transform:uppercase;color:#6B5B4B;text-align:right;">Price</th>
              </tr>
            </thead>
            <tbody>${formatItems(items)}</tbody>
          </table>

          <!-- Totals -->
          <table width="100%" cellpadding="0" cellspacing="0" style="margin-bottom:32px;">
            <tr>
              <td style="font-size:14px;color:#6B5B4B;padding:4px 0;">Subtotal</td>
              <td style="font-size:14px;color:#2D2D2D;text-align:right;padding:4px 0;">$${order.subtotal.toFixed(2)}</td>
            </tr>
            <tr>
              <td style="font-size:14px;color:#6B5B4B;padding:4px 0;">Delivery</td>
              <td style="font-size:14px;color:#2D2D2D;text-align:right;padding:4px 0;">${order.delivery_fee === 0 ? "Free" : `$${order.delivery_fee.toFixed(2)}`}</td>
            </tr>
            <tr>
              <td style="font-size:16px;font-weight:800;color:#2D5016;padding:10px 0 4px;border-top:2px solid #eee;">Total</td>
              <td style="font-size:16px;font-weight:800;color:#2D5016;text-align:right;padding:10px 0 4px;border-top:2px solid #eee;">$${order.total.toFixed(2)}</td>
            </tr>
          </table>

          <!-- CTA -->
          <div style="text-align:center;">
            <a href="${process.env.NEXT_PUBLIC_SITE_URL ?? "https://cabonaturalway.com"}/admin/orders/${order.id}"
               style="display:inline-block;background:#2D5016;color:#fff;font-size:14px;font-weight:700;padding:14px 32px;border-radius:50px;text-decoration:none;">
              View in Dashboard →
            </a>
          </div>

        </td></tr>

        <!-- Footer -->
        <tr><td style="background:#FAFAF7;padding:20px 40px;text-align:center;border-top:1px solid #eee;">
          <p style="margin:0;font-size:12px;color:#A89880;">Cabo Natural Way · Los Cabos, Baja California Sur</p>
        </td></tr>

      </table>
    </td></tr>
  </table>
</body>
</html>`;

  await getResend().emails.send({
    from:    FROM_EMAIL,
    to:      ADMIN_EMAIL,
    subject: `🛒 New Order #${id} — $${order.total.toFixed(2)} from ${order.customer_name}`,
    html,
  });
}

// ─── Customer confirmation ────────────────────────────────────────────────────

export async function sendCustomerConfirmation(
  order: Order,
  items: OrderItem[]
) {
  const id = shortId(order.id);

  const html = `<!DOCTYPE html>
<html lang="en">
<head><meta charset="UTF-8"><meta name="viewport" content="width=device-width,initial-scale=1.0"><title>Order Confirmed — Cabo Natural Way</title></head>
<body style="margin:0;padding:0;background:#F4F4F0;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background:#F4F4F0;padding:40px 16px;">
    <tr><td align="center">
      <table width="600" cellpadding="0" cellspacing="0" style="max-width:600px;width:100%;background:#ffffff;border-radius:16px;overflow:hidden;box-shadow:0 2px 8px rgba(0,0,0,.08);">

        <!-- Header -->
        <tr><td style="background:linear-gradient(135deg,#2D5016,#1a3009);padding:40px 40px 32px;text-align:center;">
          <div style="font-size:48px;margin-bottom:12px;">🌿</div>
          <h1 style="margin:0 0 8px;font-size:26px;font-weight:800;color:#ffffff;">Your order is confirmed!</h1>
          <p style="margin:0;font-size:15px;color:rgba(255,255,255,.70);">
            Thanks, ${order.customer_name.split(" ")[0]}. Fresh Baja produce is on its way.
          </p>
        </td></tr>

        <!-- Order ID badge -->
        <tr><td style="padding:0 40px;">
          <div style="background:#E8A838;border-radius:0 0 12px 12px;padding:12px 20px;text-align:center;margin-bottom:32px;">
            <p style="margin:0;font-size:12px;font-weight:700;letter-spacing:.15em;text-transform:uppercase;color:rgba(0,0,0,.55);">Order ID</p>
            <p style="margin:4px 0 0;font-size:20px;font-weight:800;color:#1a2e0a;letter-spacing:.06em;">#${id}</p>
          </div>
        </td></tr>

        <!-- Body -->
        <tr><td style="padding:0 40px 32px;">

          <!-- What happens next -->
          <h2 style="margin:0 0 16px;font-size:13px;font-weight:700;letter-spacing:.12em;text-transform:uppercase;color:#C4602A;">What happens next</h2>
          <table width="100%" cellpadding="0" cellspacing="0" style="margin-bottom:28px;">
            ${[
              ["📱", "We'll WhatsApp you", "Within 30 min to confirm your delivery window"],
              ["🌾", "We pick fresh",       "Your order goes from farm to our vehicle the same morning"],
              ["🚐", "We deliver",          "Fresh to your door, usually 9 AM – 6 PM"],
            ].map(([icon, title, desc]) => `
            <tr>
              <td style="width:44px;padding:8px 12px 8px 0;vertical-align:top;">
                <div style="width:40px;height:40px;background:#2D5016/8;border-radius:10px;background:#EEF3E8;display:flex;align-items:center;justify-content:center;font-size:20px;text-align:center;line-height:40px;">${icon}</div>
              </td>
              <td style="padding:8px 0;vertical-align:top;">
                <p style="margin:0 0 2px;font-size:14px;font-weight:600;color:#2D5016;">${title}</p>
                <p style="margin:0;font-size:13px;color:#6B5B4B;">${desc}</p>
              </td>
            </tr>`).join("")}
          </table>

          <!-- Order summary -->
          <h2 style="margin:0 0 16px;font-size:13px;font-weight:700;letter-spacing:.12em;text-transform:uppercase;color:#C4602A;">Your items</h2>
          <table width="100%" cellpadding="0" cellspacing="0" style="border:1px solid #eee;border-radius:10px;overflow:hidden;margin-bottom:20px;">
            <thead>
              <tr style="background:#FAFAF7;">
                <th style="padding:10px 12px;font-size:11px;font-weight:700;letter-spacing:.08em;text-transform:uppercase;color:#6B5B4B;text-align:left;">Product</th>
                <th style="padding:10px 12px;font-size:11px;font-weight:700;letter-spacing:.08em;text-transform:uppercase;color:#6B5B4B;text-align:center;">Qty</th>
                <th style="padding:10px 12px;font-size:11px;font-weight:700;letter-spacing:.08em;text-transform:uppercase;color:#6B5B4B;text-align:right;">Price</th>
              </tr>
            </thead>
            <tbody>${formatItems(items)}</tbody>
          </table>

          <!-- Totals -->
          <table width="100%" cellpadding="0" cellspacing="0" style="margin-bottom:32px;">
            <tr>
              <td style="font-size:13px;color:#6B5B4B;padding:4px 0;">Subtotal</td>
              <td style="font-size:13px;color:#2D2D2D;text-align:right;padding:4px 0;">$${order.subtotal.toFixed(2)}</td>
            </tr>
            <tr>
              <td style="font-size:13px;color:#6B5B4B;padding:4px 0;">Delivery</td>
              <td style="font-size:13px;color:#2D2D2D;text-align:right;padding:4px 0;">${order.delivery_fee === 0 ? "Free 🎉" : `$${order.delivery_fee.toFixed(2)}`}</td>
            </tr>
            <tr>
              <td style="font-size:15px;font-weight:800;color:#2D5016;padding:10px 0 4px;border-top:2px solid #eee;">Total paid</td>
              <td style="font-size:15px;font-weight:800;color:#2D5016;text-align:right;padding:10px 0 4px;border-top:2px solid #eee;">$${order.total.toFixed(2)} USD</td>
            </tr>
          </table>

          <!-- Delivery details -->
          <div style="background:#FAFAF7;border-radius:12px;padding:18px 20px;margin-bottom:32px;">
            <p style="margin:0 0 8px;font-size:12px;font-weight:700;letter-spacing:.1em;text-transform:uppercase;color:#A89880;">Delivering to</p>
            <p style="margin:0;font-size:14px;color:#2D2D2D;font-weight:500;">${order.delivery_address}</p>
            ${order.delivery_notes ? `<p style="margin:6px 0 0;font-size:13px;color:#6B5B4B;font-style:italic;">Note: ${order.delivery_notes}</p>` : ""}
          </div>

          <!-- WhatsApp CTA -->
          <div style="background:linear-gradient(135deg,#128C7E,#075E54);border-radius:14px;padding:24px;text-align:center;margin-bottom:8px;">
            <p style="margin:0 0 6px;font-size:15px;font-weight:700;color:#ffffff;">Questions about your order?</p>
            <p style="margin:0 0 18px;font-size:13px;color:rgba(255,255,255,.75);">We reply in under 10 minutes on WhatsApp.</p>
            <a href="${WHATSAPP}?text=Hi!%20I%20just%20placed%20order%20%23${id}"
               style="display:inline-block;background:#25D366;color:#fff;font-size:14px;font-weight:700;padding:12px 28px;border-radius:50px;text-decoration:none;">
              💬 Chat on WhatsApp
            </a>
          </div>

        </td></tr>

        <!-- Footer -->
        <tr><td style="background:#FAFAF7;padding:24px 40px;text-align:center;border-top:1px solid #eee;">
          <p style="margin:0 0 4px;font-size:13px;font-weight:600;color:#2D5016;">Cabo Natural Way</p>
          <p style="margin:0;font-size:12px;color:#A89880;">Fresh organic produce from Baja California farms</p>
          <p style="margin:8px 0 0;font-size:11px;color:#C4C4B8;">Los Cabos, Baja California Sur · Mexico</p>
        </td></tr>

      </table>
    </td></tr>
  </table>
</body>
</html>`;

  await getResend().emails.send({
    from:    FROM_EMAIL,
    to:      order.customer_email,
    subject: `✅ Order #${id} confirmed — Cabo Natural Way`,
    html,
  });
}
