import { createHash, randomBytes } from "crypto";
import Orders from "../models/order.model.js";

// POST /api/payments/init\
export const initPayment = async (req, res) => {
  try {
    const user = req.user;
    if (!user) return res.status(401).json({ message: "Unauthorized" });

    const { credits, currency, amount } = req.body;
    console.log(credits, currency, amount);
    if (!credits || !currency || !amount) {
      return res.status(400).json({ message: "Missing payment fields" });
    }

    let ordersDoc = await Orders.findOne({ user: user.id });
    if (!ordersDoc) {
      ordersDoc = await Orders.create({ user: user.id, orders: [] });
    }

    const orderItem = {
      credits,
      currency,
      amount: String(amount),
      status: "pending",
    };

    ordersDoc.orders.push(orderItem);
    await ordersDoc.save();

    const savedItem = ordersDoc.orders[ordersDoc.orders.length - 1];
    const orderItemId = String(savedItem._id);

    // Hardcoded forward URL to the third-party payment gateway
    const forwardUrl = "https://secure.transactworld.com/transaction/Checkout";

    const f = {
      memberId: process.env.MEMBER_ID,
      totype: process.env.TO_TYPE,
      language: process.env.LANGUAGE,
      accountId: process.env.ACCOUNT_ID,
      amount: orderItem.amount,
      ip: process.env.IP,
      paymentBrand: process.env.PAYMENT_BRAND,
      paymentMode: process.env.PAYMENT_MODE,
      currency: orderItem.currency,
      merchantRedirectUrl: process.env.MERCHANT_REDIRECT_URL,
    };

    const randomData = randomBytes(16).toString("hex");
    const merchantTransactionId = createHash("sha256")
      .update(randomData)
      .digest("hex");

    const values = `${f.memberId}|${f.totype}|${f.amount}|${merchantTransactionId}|${f.merchantRedirectUrl}|${process.env.WORKING_KEY}`;

    const checksum = createHash("md5").update(values).digest("hex");

    // my "payment/forward/:id" is the notification url with merchant id setted as :id parameter of my backend route
    // because the payment gateway sends a callback for which it requires a transaction id so that's why i have the :id setted as the parameter so my payment gateway will send a post request to my payment/forward/:id in which :id i already passes as the merchantTransactionId.
    const notificationUrl = `${process.env.NOTIFICATION_URL}${merchantTransactionId}`;

    console.log("notification url:", notificationUrl);

    return res.json({
      forwardUrl,
      paymentData: { ...f, checksum, merchantTransactionId, notificationUrl },
    });
  } catch (err) {
    console.error("initPayment error:", err);
    return res.status(500).json({ message: " Payment Init failed" });
  }
};

// --------------------------------------------------------------------------------

// GET /api/payments/forward/:orderItemId
export const forwardPayment = async (req, res) => {
  const orderItemId = String(req.params.orderItemId);

  const trackingId = req.body.trackingid;
  console.log("notification param transaction id", orderItemId);
  console.log("notification body tracking id", trackingId);

  //   const doc = await Orders.findOne({ "orders._id": orderItemId }).lean();
  //   if (!doc) return res.status(404).send("Order not found");

  //   const item = doc.orders?.find((o) => String(o._id) === orderItemId) || null;

  //   if (!item) return res.status(404).send("Order item not found");

  //   // Security headers for the forward page
  //   res.set({
  //     "Content-Type": "text/html; charset=utf-8",
  //     "Cache-Control": "no-store, no-cache, must-revalidate, max-age=0",
  //     Pragma: "no-cache",
  //     "X-Content-Type-Options": "nosniff",
  //     "Referrer-Policy": "no-referrer",
  //     "Content-Security-Policy":
  //       "default-src 'none'; script-src 'unsafe-inline'; form-action https://secure.transactworld.com; base-uri 'none'; frame-ancestors 'none'",
  //   });

  //   // Minimal inline escape to avoid XSS when injecting values
  //   const h = (s = "") =>
  //     String(s)
  //       .replace(/&/g, "&amp;")
  //       .replace(/</g, "&lt;")
  //       .replace(/>/g, "&gt;")
  //       .replace(/"/g, "&quot;")
  //       .replace(/'/g, "&#39;");

  //   // Build fields on the fly
  //   const f = {
  //     memberId: process.env.TW_MEMBER_ID,
  //     checksum: "heulzDyq6YrH6iTcvbbZztWeO8RsCdYA",
  //     language: "ENG",
  //     accountid: process.env.TW_ACCOUNT_ID,
  //     totype: "Transactworld",
  //     merchantTransactionId: orderItemId, // unique per order item
  //     amount: item.amount,
  //     currency: item.currency,
  //     ip: req.ip,
  //     paymentBrand: "VISA",
  //   };

  //   res.send(`<!doctype html>
  // <html>
  //   <body>
  //     <form method="POST" action="https://secure.transactworld.com/transaction/Checkout" id="gw">
  //       <input type="hidden" name="memberId" value="${h(f.memberId)}">
  //       <input type="hidden" name="checksum" value="${h(f.checksum)}">
  //       <input type="hidden" name="language" value="${h(f.language)}">
  //       <input type="hidden" name="accountid" value="${h(f.accountid)}">
  //       <input type="hidden" name="totype" value="${h(f.totype)}">
  //       <input type="hidden" name="merchantTransactionId" value="${h(
  //         f.merchantTransactionId
  //       )}">
  //       <input type="hidden" name="amount" value="${h(f.amount)}">
  //       <input type="hidden" name="currency" value="${h(f.currency)}">
  //       <input type="hidden" name="ip" value="${h(f.ip)}">
  //       <input type="hidden" name="paymentBrand" value="${h(f.paymentBrand)}">
  //       <noscript><button type="submit">Continue</button></noscript>
  //     </form>
  //     <script>document.getElementById('gw').submit();</script>
  //   </body>
  // </html>`);
};
