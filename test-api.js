// Test script for Chicken Valley Email API
// Run this after starting the server to test the email functionality

const testOrderEmail = async () => {
  const orderData = {
    customerEmail: "test@example.com", // Replace with your test email
    customerName: "Test Customer",
    orderId: "TEST-ORD-001",
    items: [
      {
        name: "Grilled Chicken Breast",
        quantity: 2,
        price: 12.99
      },
      {
        name: "Chicken Wings (8 pieces)",
        quantity: 1,
        price: 8.99
      },
      {
        name: "French Fries",
        quantity: 1,
        price: 4.99
      },
      {
        name: "Cola Drink",
        quantity: 2,
        price: 2.49
      }
    ],
    totalAmount: 44.94,
    deliveryAddress: "123 Test Street, Test City, TC 12345"
  };

  try {
    console.log('🍗 Testing Chicken Valley Email API...');
    console.log('Sending order confirmation email...');
    
    const response = await fetch('http://localhost:3000/api/send-order-email', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(orderData)
    });
    
    const result = await response.json();
    
    if (result.success) {
      console.log('✅ Email sent successfully!');
      console.log('Message ID:', result.messageId);
      console.log('Order ID:', result.orderId);
      console.log('\n📧 Check your email inbox for the order confirmation!');
    } else {
      console.error('❌ Failed to send email:', result.message);
      if (result.error) {
        console.error('Error details:', result.error);
      }
    }
  } catch (error) {
    console.error('❌ Error testing API:', error.message);
    console.log('\n💡 Make sure the server is running on http://localhost:3000');
  }
};

const testHealthCheck = async () => {
  try {
    console.log('🏥 Testing health check...');
    
    const response = await fetch('http://localhost:3000/api/health');
    const result = await response.json();
    
    if (result.success) {
      console.log('✅ API is healthy:', result.message);
      console.log('Timestamp:', result.timestamp);
    } else {
      console.log('❌ API health check failed');
    }
  } catch (error) {
    console.error('❌ Health check failed:', error.message);
  }
};

const testSimpleEmail = async () => {
  try {
    console.log('📧 Testing simple email...');
    
    const response = await fetch('http://localhost:3000/api/test-email', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        testEmail: "test@example.com" // Replace with your test email
      })
    });
    
    const result = await response.json();
    
    if (result.success) {
      console.log('✅ Test email sent successfully!');
      console.log('Message ID:', result.messageId);
    } else {
      console.error('❌ Test email failed:', result.message);
    }
  } catch (error) {
    console.error('❌ Error testing simple email:', error.message);
  }
};

// Run all tests
const runAllTests = async () => {
  console.log('🚀 Starting Chicken Valley Email API Tests...\n');
  
  await testHealthCheck();
  console.log('');
  
  await testSimpleEmail();
  console.log('');
  
  await testOrderEmail();
  console.log('');
  
  console.log('🏁 Tests completed!');
};

// Check if running in Node.js environment
if (typeof fetch === 'undefined') {
  console.log('📝 This test script requires Node.js 18+ or you can run it in a browser console');
  console.log('💡 To run in Node.js, use: node test-api.js');
  console.log('💡 To run in browser, open the console and paste the functions');
} else {
  runAllTests();
}

// Export functions for use in other environments
if (typeof module !== 'undefined' && module.exports) {
  module.exports = {
    testOrderEmail,
    testHealthCheck,
    testSimpleEmail,
    runAllTests
  };
}
