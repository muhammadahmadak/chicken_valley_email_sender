const express = require("express");
const { Resend } = require("resend");
const cors = require("cors");
const bodyParser = require("body-parser");
const fs = require("fs");
const path = require("path");

const app = express();
const PORT = process.env.PORT || 8000;

// Middleware
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Check if .env file exists
const envPath = path.join(__dirname, ".env");
if (!fs.existsSync(envPath)) {
  console.error("❌ .env file not found!");
  console.log("💡 Please create a .env file in your project root with:");
  console.log("EMAIL_USER=ahmadak9305@gmail.com");
  console.log("RESEND_API_KEY=re_KgokoLgX_Pz7jRdQZmtMTGTEjEBRF3rDr");
  console.log("PORT=3000");
  process.exit(1);
}

// Load environment variables
require("dotenv").config();

// Debug: Check if environment variables are loaded
console.log("🔍 Environment Variables Check:");
console.log("EMAIL_USER:", process.env.EMAIL_USER);
console.log(
  "RESEND_API_KEY:",
  process.env.RESEND_API_KEY ? "✅ Loaded" : "❌ Missing"
);
console.log("PORT:", process.env.PORT);

// Initialize Resend with error handling
let resend;
try {
  if (!process.env.RESEND_API_KEY) {
    throw new Error("RESEND_API_KEY is missing from .env file");
  }
  resend = new Resend(process.env.RESEND_API_KEY);
  console.log("✅ Resend initialized successfully");
} catch (error) {
  console.error("❌ Failed to initialize Resend:", error.message);
  console.log("💡 Make sure you have a .env file with RESEND_API_KEY");
  process.exit(1);
}

const createOrderReceivedTemplate = (orderData) => {
  const {
    customerName,
    customerEmail,
    orderId,
    items,
    totalAmount,
    paymentMethod,
    paymentStatus,
    deliveryAddress, // ✅ New parameter
    orderType, // ✅ New parameter
  } = orderData;

  // Determine if it's a pickup or delivery order
  const isPickup = orderType === "pickup";
  const orderTypeIcon = isPickup ? "🚶" : "🚚";
  const orderTypeText = isPickup ? "Pickup Order" : "Delivery Order";
  const orderTypeColor = isPickup ? "#e74c3c" : "#3498db";

  return {
    subject: `${orderTypeIcon} New ${orderTypeText} #${orderId} - ${customerName}`,
    html: `<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>New Order - Chicken Valley</title>
</head>
<body style="margin: 0; padding: 0; background-color: #f5f5f5; font-family: 'Helvetica Neue', Arial, sans-serif;">
  
  <!-- Main Container -->
  <div style="max-width: 600px; margin: 20px auto; background-color: #ffffff; border-radius: 8px; box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);">
    
    <!-- Header Section -->
    <div style="background-color: #1a3c34; padding: 30px; text-align: center; color: #ffffff; border-top-left-radius: 8px; border-top-right-radius: 8px;">
      <h1 style="margin: 0; font-size: 24px; font-weight: 500;">Chicken Valley</h1>
      <p style="margin: 8px 0 0 0; font-size: 16px; font-weight: 300;">${orderTypeIcon} ${orderTypeText} Notification</p>
    </div>
    
    <!-- Customer Info Section -->
    <div style="padding: 25px; border-bottom: 1px solid #e0e0e0;">
      <h2 style="margin: 0; font-size: 20px; font-weight: 500; color: #333333;">${orderTypeIcon} New ${orderTypeText} from ${customerName}</h2>
      <p style="margin: 10px 0 0 0; font-size: 14px; color: #666666;">${
        isPickup
          ? "Customer will collect the order in person"
          : "Order will be delivered to customer address"
      }</p>
    </div>
    
    <!-- Order Details Section -->
    <div style="padding: 25px;">
      
      <!-- Payment Status Card -->
      <div style="background-color: #f8f9fa; padding: 20px; border-radius: 6px; margin-bottom: 20px; border-left: 4px solid #28a745;">
        <div style="display: flex; justify-content: space-between; align-items: center;">
          <div>
            <h3 style="margin: 0; font-size: 16px; font-weight: 500; color: #333333;">Payment Status</h3>
            <p style="margin: 5px 0 0 0; font-size: 14px; color: #666666;">${
              paymentStatus || "Confirmed"
            }</p>
          </div>
          <div style="font-size: 20px; color: #28a745;">✔</div>
        </div>
      </div>
      
      <!-- Order Type Badge -->
      <div style="background-color: ${orderTypeColor}; padding: 15px; border-radius: 6px; margin-bottom: 20px; text-align: center;">
        <h3 style="margin: 0; font-size: 18px; font-weight: 600; color: #ffffff;">${orderTypeIcon} ${orderTypeText.toUpperCase()}</h3>
      </div>
      
      <!-- Delivery Address or Pickup Info Card -->
      ${
        !isPickup && deliveryAddress
          ? `
      <div style="background-color: #e3f2fd; padding: 20px; border-radius: 6px; margin-bottom: 20px; border-left: 4px solid ${orderTypeColor};">
        <h4 style="margin: 0 0 12px 0; font-size: 16px; font-weight: 600; color: #333333;">🚚 Delivery Address</h4>
        <p style="margin: 0; font-size: 14px; color: #333333; line-height: 1.6; white-space: pre-wrap;">${deliveryAddress}</p>
        <div style="margin-top: 12px; padding-top: 12px; border-top: 1px solid #90caf9;">
          <p style="margin: 0; font-size: 13px; color: #1976d2; font-weight: 600;">📦 Delivery Fee: £2.50</p>
          <p style="margin: 5px 0 0 0; font-size: 13px; color: #666666;">⏱️ Estimated Delivery Time: 30-45 mins</p>
        </div>
      </div>
      `
          : `
      <div style="background-color: #ffebee; padding: 20px; border-radius: 6px; margin-bottom: 20px; border-left: 4px solid ${orderTypeColor};">
        <h4 style="margin: 0 0 12px 0; font-size: 16px; font-weight: 600; color: #333333;">🚶 Pickup Information</h4>
        <p style="margin: 0; font-size: 14px; color: #333333; line-height: 1.6;">
          <strong>📍 Pickup Location:</strong><br>
          8 East Street, Horsham RH12 1HL
        </p>
        <div style="margin-top: 12px; padding-top: 12px; border-top: 1px solid #ef9a9a;">
          <p style="margin: 0; font-size: 13px; color: #c62828; font-weight: 600;">Customer will collect from store</p>
          <p style="margin: 5px 0 0 0; font-size: 13px; color: #666666;">⏱️ Ready in: 10-20 mins</p>
        </div>
      </div>
      `
      }
      
      <!-- Order Info Cards -->
      <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 15px; margin-bottom: 20px;">
        <div style="background-color: #f8f9fa; padding: 15px; border-radius: 6px; border-left: 4px solid #1a3c34;">
          <h4 style="margin: 0 0 8px 0; font-size: 14px; font-weight: 500; color: #333333;">Order ID</h4>
          <p style="margin: 0; font-size: 16px; font-weight: 600; color: #1a3c34;">#${orderId}</p>
        </div>
        <div style="background-color: #f8f9fa; padding: 15px; border-radius: 6px; border-left: 4px solid #1a3c34;">
          <h4 style="margin: 0 0 8px 0; font-size: 14px; font-weight: 500; color: #333333;">Payment Method</h4>
          <p style="margin: 0; font-size: 16px; font-weight: 600; color: #1a3c34;">${
            paymentMethod || "Online Payment"
          }</p>
        </div>
      </div>
      
      <!-- Customer Details Card -->
      <div style="background-color: #f8f9fa; padding: 20px; border-radius: 6px; margin-bottom: 20px; border-left: 4px solid #1a3c34;">
        <h4 style="margin: 0 0 12px 0; font-size: 16px; font-weight: 500; color: #333333;">Customer Information</h4>
        <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 10px;">
          <div>
            <p style="margin: 0 0 5px 0; font-size: 13px; color: #666666;">Name</p>
            <p style="margin: 0; font-size: 14px; font-weight: 600; color: #333333;">${customerName}</p>
          </div>
          <div>
            <p style="margin: 0 0 5px 0; font-size: 13px; color: #666666;">Email</p>
            <p style="margin: 0; font-size: 14px; font-weight: 600; color: #333333;">${customerEmail}</p>
          </div>
        </div>
        <div style="margin-top: 12px; padding-top: 12px; border-top: 1px solid #e0e0e0;">
          <p style="margin: 0; font-size: 13px; color: #666666;">Order Time</p>
          <p style="margin: 5px 0 0 0; font-size: 14px; font-weight: 600; color: #333333;">${new Date().toLocaleDateString()} at ${new Date().toLocaleTimeString()}</p>
        </div>
      </div>
      
      <!-- Order Items Section -->
      <div style="margin-bottom: 20px;">
        <h3 style="margin: 0 0 15px 0; font-size: 18px; font-weight: 500; color: #333333;">Order Items</h3>
        <div style="background-color: #f8f9fa; border-radius: 6px; overflow: hidden;">
          ${items
            .map(
              (item, index) => `
            <div style="display: flex; justify-content: space-between; align-items: center; padding: 15px; ${
              index !== items.length - 1
                ? "border-bottom: 1px solid #e0e0e0;"
                : ""
            }">
              <div>
                <h4 style="margin: 0 0 5px 0; font-size: 14px; font-weight: 600; color: #333333;">${
                  item.name
                }</h4>
                <p style="margin: 0; font-size: 13px; color: #666666;">Quantity: ${
                  item.quantity
                }</p>
              </div>
              <div style="text-align: right;">
                <p style="margin: 0; font-size: 14px; font-weight: 600; color: #1a3c34;">£${item.price.toFixed(
                  2
                )}</p>
              </div>
            </div>
          `
            )
            .join("")}
        </div>
      </div>
      
      <!-- Total Amount Section -->
      <div style="background-color: #f8f9fa; padding: 20px; border-radius: 6px; text-align: center; margin-bottom: 20px; border-left: 4px solid #1a3c34;">
        <h3 style="margin: 0; font-size: 18px; font-weight: 500; color: #333333;">Total Amount</h3>
        <p style="margin: 8px 0 0 0; font-size: 24px; font-weight: 600; color: #1a3c34;">£${totalAmount.toFixed(
          2
        )}</p>
        ${
          !isPickup
            ? '<p style="margin: 5px 0 0 0; font-size: 12px; color: #666666;">(Including £2.50 delivery fee)</p>'
            : ""
        }
      </div>
      
      <!-- Action Required Section -->
      <div style="background-color: #fff3cd; padding: 20px; border-radius: 6px; margin-bottom: 20px; border-left: 4px solid #ffc107;">
        <h4 style="margin: 0; font-size: 16px; font-weight: 600; color: #856404;">⚠️ Action Required</h4>
        <p style="margin: 8px 0 0 0; font-size: 14px; color: #856404;">
          ${
            isPickup
              ? "Please prepare the order for customer pickup and notify when ready."
              : "Please prepare the order for delivery and arrange driver dispatch."
          }
        </p>
      </div>
      
      <!-- Footer Message -->
      <div style="text-align: center; padding: 15px; background-color: #f8f9fa; border-radius: 6px;">
        <p style="margin: 0; font-size: 14px; color: #666666;">This is an automated notification for the owner.</p>
        <p style="margin: 8px 0 0 0; font-size: 14px; font-weight: 600; color: #333333;">Please process this order promptly.</p>
      </div>
      
    </div>
    
    <!-- Footer -->
    <div style="background-color: #1a3c34; color: #ffffff; padding: 20px; text-align: center; border-bottom-left-radius: 8px; border-bottom-right-radius: 8px;">
      <p style="margin: 0; font-size: 14px;">© 2025 Chicken Valley. All rights reserved.</p>
      <p style="margin: 8px 0 0 0; font-size: 12px; opacity: 0.8;">Professional Food Service</p>
    </div>
    
  </div>
  
</body>
</html>`,
    text: `
🆕 New ${orderTypeText} - Payment Confirmed #${orderId}

${orderTypeIcon} New ${orderTypeText} from ${customerName}! 🎉

Order Type: ${orderTypeText}
${
  !isPickup && deliveryAddress
    ? `\nDelivery Address:\n${deliveryAddress}\nDelivery Fee: £2.50\nEstimated Time: 30-45 mins`
    : "\nPickup Location: 8 East Street, Horsham RH12 1HL\nReady in: 10-20 mins"
}

Payment Status: ${paymentStatus || "Confirmed"}
Payment Method: ${paymentMethod || "Online Payment"}

Order Details:
Order ID: #${orderId}
Customer Name: ${customerName}
Customer Email: ${customerEmail}
Order Date: ${new Date().toLocaleDateString()}
Order Time: ${new Date().toLocaleTimeString()}

Items:
${items
  .map((item) => `${item.name} x${item.quantity} - £${item.price.toFixed(2)}`)
  .join("\n")}

Total Amount: £${totalAmount.toFixed(2)}${
      !isPickup ? " (Including £2.50 delivery fee)" : ""
    }

Action Required:
${
  isPickup
    ? "1. Start preparing this order\n2. Update order status in system\n3. Notify customer when ready for pickup"
    : "1. Start preparing this order\n2. Arrange driver for delivery\n3. Update order status and notify customer"
}

This is an automated notification for the owner.
Please process this order promptly!
    `,
  };
};
// API endpoint to send order received email to owner after payment
app.post("/api/send-order-received-email", async (req, res) => {
  try {
    const {
      customerName,
      customerEmail,
      orderId,
      items,
      totalAmount,
      paymentMethod,
      paymentStatus,
      deliveryAddress, // ✅ Add this
      orderType, // ✅ Add this
    } = req.body;

    // Validate required fields
    if (!customerName || !customerEmail || !orderId || !items || !totalAmount) {
      return res.status(400).json({
        success: false,
        message:
          "Missing required fields: customerName, customerEmail, orderId, items, totalAmount",
      });
    }

    // Create email template
    const emailTemplate = createOrderReceivedTemplate({
      customerName,
      customerEmail,
      orderId,
      items,
      totalAmount,
      paymentMethod: paymentMethod || "Online Payment",
      paymentStatus: paymentStatus || "Confirmed",
      deliveryAddress: deliveryAddress || null, // ✅ Add this
      orderType: orderType || "pickup", // ✅ Add this
    });

    // Send email FROM customer's email TO owner's email using Resend
    console.log("📧 Attempting to send email via Resend...");
    console.log("From:", `${customerName} <${customerEmail}>`);
    console.log("To:", process.env.EMAIL_USER);
    console.log("Subject:", emailTemplate.subject);

    // Try sending FROM customer email first, fallback to owner email if needed
    let emailResult;

    // Use Resend's verified domain for sending emails
    const { data, error } = await resend.emails.send({
      from: `${customerName} <onboarding@resend.dev>`, // Use Resend's verified domain
      to: [process.env.EMAIL_USER], // Send TO owner's email (must be your verified email for free tier)
      subject: emailTemplate.subject,
      html: emailTemplate.html,
      replyTo: customerEmail, // Reply will go TO customer
      headers: {
        "X-Priority": "1",
        "X-MSMail-Priority": "High",
        Importance: "high",
      },
    });

    if (error) {
      console.error("❌ Resend API Error:", error);
      throw new Error(
        `Resend error: ${error.message || JSON.stringify(error)}`
      );
    }

    console.log("✅ Email sent successfully via Resend");
    emailResult = data;

    console.log(
      "Order received email sent successfully FROM customer TO owner via Resend:",
      emailResult.id
    );

    res.json({
      success: true,
      message:
        "Order received email sent successfully from customer to owner after payment confirmation",
      messageId: emailResult.id,
      orderId: orderId,
      paymentStatus: paymentStatus || "Confirmed",
      sentFrom: customerEmail,
      sentTo: process.env.EMAIL_USER,
    });
  } catch (error) {
    console.error(
      "Error sending order received email from customer to owner:",
      error
    );
    res.status(500).json({
      success: false,
      message: "Failed to send order received email from customer to owner",
      error: error.message,
    });
  }
});

// Health check endpoint
app.get("/api/health", (req, res) => {
  res.json({
    success: true,
    message: "Chicken Valley Email API is running",
    timestamp: new Date().toISOString(),
    resendStatus: "✅ Configured",
    ownerEmail: process.env.EMAIL_USER,
  });
});

// Test email endpoint (for development) - sends FROM customer TO owner
app.post("/api/test-email", async (req, res) => {
  try {
    const { customerEmail, customerName } = req.body;

    if (!customerEmail || !customerName) {
      return res.status(400).json({
        success: false,
        message: "customerEmail and customerName are required",
      });
    }

    // Send test email FROM customer TO owner using Resend
    console.log("📧 Attempting to send test email via Resend...");
    console.log("From:", `${customerName} <orders@resend.dev>`);
    console.log("To:", process.env.EMAIL_USER);

    const { data, error } = await resend.emails.send({
      from: "Chicken Valley Orders <onboarding@resend.dev>", // Use Resend's verified domain
      to: [process.env.EMAIL_USER], // Send TO owner's email
      subject: "🧪 Test Email - Chicken Valley API",
      replyTo: customerEmail, // Reply will go TO customer
      html: `
        <!DOCTYPE html>
        <html>
        <head>
          <meta charset="utf-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>Test Email - Chicken Valley</title>
        </head>
        <body style="margin: 0; padding: 0; background-color: #f5f5f5; font-family: 'Arial', 'Helvetica', sans-serif;">
          
          <!-- Main Container -->
          <div style="max-width: 600px; margin: 20px auto; background-color: #ffffff; border: 1px solid #e0e0e0; border-radius: 4px; overflow: hidden;">
            
            <!-- Header Section -->
            <div style="background-color: #2c3e50; padding: 30px; text-align: center; color: white;">
              <h1 style="margin: 0; font-size: 28px; font-weight: 600; letter-spacing: 1px;">CHICKEN VALLEY</h1>
              <p style="margin: 8px 0 0 0; font-size: 16px; opacity: 0.9; font-weight: 400;">Test Email - API Verification</p>
            </div>
            
            <!-- Test Status Section -->
            <div style="padding: 25px; background-color: #ecf0f1; border-bottom: 1px solid #d5dbdb;">
              <h2 style="margin: 0; font-size: 24px; color: #2c3e50; font-weight: 600;">Test Email Successfully Sent</h2>
              <p style="margin: 8px 0 0 0; color: #34495e; font-size: 16px;">Your email system is working perfectly</p>
            </div>
            
            <!-- Details Section -->
            <div style="padding: 30px;">
              
              <!-- Status Card -->
              <div style="background-color: #d5f4e6; border: 1px solid #82e0aa; padding: 20px; border-radius: 4px; margin-bottom: 25px;">
                <div style="display: flex; justify-content: space-between; align-items: center;">
                  <div>
                    <h3 style="margin: 0; font-size: 18px; color: #27ae60; font-weight: 600;">Status</h3>
                    <p style="margin: 5px 0 0 0; color: #27ae60; font-size: 16px; font-weight: 500;">Test Email Working</p>
                  </div>
                  <div style="color: #27ae60; font-size: 24px; font-weight: bold;">✓</div>
                </div>
              </div>
              
              <!-- Info Cards -->
              <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 20px; margin-bottom: 25px;">
                <div style="background-color: #f8f9fa; padding: 15px; border-radius: 4px; border-left: 3px solid #3498db;">
                  <p style="margin: 0 0 5px 0; color: #7f8c8d; font-size: 13px; text-transform: uppercase; font-weight: 600;">Customer</p>
                  <p style="margin: 0; color: #2c3e50; font-size: 16px; font-weight: 600;">${customerName}</p>
                </div>
                <div style="background-color: #f8f9fa; padding: 15px; border-radius: 4px; border-left: 3px solid #e74c3c;">
                  <p style="margin: 0 0 5px 0; color: #7f8c8d; font-size: 13px; text-transform: uppercase; font-weight: 600;">Email</p>
                  <p style="margin: 0; color: #2c3e50; font-size: 16px; font-weight: 600;">${customerEmail}</p>
                </div>
              </div>
              
              <!-- Test Details Card -->
              <div style="background-color: #f8f9fa; padding: 20px; border-radius: 4px; border-left: 3px solid #9b59b6;">
                <h4 style="margin: 0 0 15px 0; color: #2c3e50; font-size: 16px; font-weight: 600;">Test Information</h4>
                <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 15px;">
                  <div>
                    <p style="margin: 0 0 5px 0; color: #7f8c8d; font-size: 13px; text-transform: uppercase; font-weight: 600;">Test Type</p>
                    <p style="margin: 0; color: #2c3e50; font-size: 16px; font-weight: 600;">API Email Verification</p>
                  </div>
                  <div>
                    <p style="margin: 0 0 5px 0; color: #7f8c8d; font-size: 13px; text-transform: uppercase; font-weight: 600;">Received By</p>
                    <p style="margin: 0; color: #2c3e50; font-size: 16px; font-weight: 600;">Owner</p>
                  </div>
                </div>
                <div style="margin-top: 15px; padding-top: 15px; border-top: 1px solid #ecf0f1;">
                  <p style="margin: 0 0 5px 0; color: #7f8c8d; font-size: 13px; text-transform: uppercase; font-weight: 600;">Test Time</p>
                  <p style="margin: 0; color: #2c3e50; font-size: 16px; font-weight: 600;">${new Date().toLocaleDateString()} at ${new Date().toLocaleTimeString()}</p>
                </div>
              </div>
              
              <!-- What This Means Section -->
              <div style="background-color: #f8f9fa; border: 1px solid #e9ecef; padding: 20px; border-radius: 4px; margin-bottom: 25px;">
                <h4 style="margin: 0 0 15px 0; color: #2c3e50; font-size: 16px; font-weight: 600;">What This Means</h4>
                <div style="display: grid; grid-template-columns: 1fr 1fr 1fr; gap: 15px;">
                  <div style="text-align: center;">
                    <p style="margin: 0 0 5px 0; color: #7f8c8d; font-size: 12px; text-transform: uppercase; font-weight: 600;">Email Config</p>
                    <p style="margin: 0; color: #2c3e50; font-size: 14px;">Working correctly</p>
                  </div>
                  <div style="text-align: center;">
                    <p style="margin: 0 0 5px 0; color: #7f8c8d; font-size: 12px; text-transform: uppercase; font-weight: 600;">Customer Emails</p>
                    <p style="margin: 0; color: #2c3e50; font-size: 14px;">Reach owner</p>
                  </div>
                  <div style="text-align: center;">
                    <p style="margin: 0 0 5px 0; color: #7f8c8d; font-size: 12px; text-transform: uppercase; font-weight: 600;">System Status</p>
                    <p style="margin: 0; color: #2c3e50; font-size: 14px;">Ready</p>
                  </div>
                </div>
              </div>
              
              <!-- Success Message -->
              <div style="text-align: center; padding: 20px; background-color: #f8f9fa; border-radius: 4px;">
                <p style="margin: 0; color: #6c757d; font-size: 14px;">This is a test email to verify the Chicken Valley Email API setup.</p>
                <p style="margin: 8px 0 0 0; color: #2c3e50; font-size: 16px; font-weight: 600;">Your email system is working perfectly.</p>
              </div>
              
            </div>
            
            <!-- Footer -->
            <div style="background-color: #34495e; color: white; padding: 20px; text-align: center;">
              <p style="margin: 0; font-size: 14px;">© 2024 Chicken Valley Restaurant. All rights reserved.</p>
              <p style="margin: 5px 0 0 0; font-size: 12px; opacity: 0.8;">Professional Food Service</p>
            </div>
            
          </div>
          
        </body>
        </html>
      `,
    });

    if (error) {
      console.error("❌ Resend API Error:", error);
      throw new Error(
        `Resend error: ${error.message || JSON.stringify(error)}`
      );
    }

    res.json({
      success: true,
      message: "Test email sent successfully FROM customer TO owner via Resend",
      messageId: data.id,
      sentFrom: customerEmail,
      sentTo: process.env.EMAIL_USER,
      customerName: customerName,
    });
  } catch (error) {
    console.error("Error sending test email:", error);
    res.status(500).json({
      success: false,
      message: "Failed to send test email",
      error: error.message,
    });
  }
});

// Start server
app.listen(PORT, () => {
  console.log(`🍗 Chicken Valley Email API server running on port ${PORT}`);
  console.log(`Health check: http://localhost:${PORT}/api/health`);
  console.log(
    `Send order received notification to owner: POST http://localhost:${PORT}/api/send-order-received-email`
  );
  console.log(`Test email: POST http://localhost:${PORT}/api/test-email`);
});
