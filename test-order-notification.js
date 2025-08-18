// Test script for Chicken Valley Order Received Notification API
// This script demonstrates how to send order notifications to the owner

const testOrderNotification = async () => {
  const orderData = {
    customerName: "Ahmed Khan",
    customerEmail: "ahmed.khan@example.com",
    orderId: "ORD-2024-001",
    items: [
      {
        name: "Grilled Chicken Breast",
        quantity: 2,
        price: 12.99,
      },
      {
        name: "Chicken Wings (Spicy)",
        quantity: 1,
        price: 8.99,
      },
      {
        name: "French Fries",
        quantity: 1,
        price: 3.99,
      },
      {
        name: "Coca Cola",
        quantity: 2,
        price: 1.99,
      },
    ],
    totalAmount: 41.94,
    deliveryAddress: "House #45, Street #12, Gulberg III, Lahore",
    paymentMethod: "Credit Card",
    paymentStatus: "Confirmed",
  };

  try {
    console.log("🍗 Sending order received notification to owner...");
    console.log("📋 Order Details:", JSON.stringify(orderData, null, 2));

    const response = await fetch(
      "http://localhost:3000/api/send-order-received-email",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(orderData),
      }
    );

    const result = await response.json();

    if (result.success) {
      console.log("✅ Success! Order notification sent from customer to owner");
      console.log("📧 Message ID:", result.messageId);
      console.log("🆔 Order ID:", result.orderId);
      console.log("💰 Payment Status:", result.paymentStatus);
      console.log("📤 Sent from:", result.sentFrom);
      console.log("📬 Sent to:", result.sentTo);
    } else {
      console.error("❌ Failed to send notification:", result.message);
    }
  } catch (error) {
    console.error("❌ Error:", error.message);
  }
};

// Test health check
const testHealthCheck = async () => {
  try {
    console.log("🏥 Checking API health...");
    const response = await fetch("http://localhost:3000/api/health");
    const result = await response.json();

    if (result.success) {
      console.log("✅ API is running:", result.message);
      console.log("⏰ Timestamp:", result.timestamp);
    } else {
      console.error("❌ API health check failed");
    }
  } catch (error) {
    console.error("❌ Health check error:", error.message);
  }
};

// Run tests
const runTests = async () => {
  console.log("🧪 Starting Chicken Valley API Tests...\n");

  // Test health check first
  await testHealthCheck();
  console.log("");

  // Test order notification
  await testOrderNotification();

  console.log("\n🏁 Tests completed!");
};

// Run tests if this file is executed directly
if (typeof window === "undefined") {
  // Node.js environment
  const fetch = require("node-fetch");
  runTests();
} else {
  // Browser environment
  runTests();
}

// Export for use in other modules
if (typeof module !== "undefined" && module.exports) {
  module.exports = { testOrderNotification, testHealthCheck };
}
