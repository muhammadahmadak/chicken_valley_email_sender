# 🍗 Chicken Valley Email Sender API

A Node.js API for sending order received notifications to the owner using Nodemailer. This API automatically sends beautifully formatted emails FROM each customer TO the owner when customer orders are completed and payment is confirmed. Each customer uses their own email address, but the owner always receives notifications at the same email address.

## Features

- ✅ **Owner Notifications** - Automatically sent FROM customer TO owner when orders are received
- ✅ **Customer Email Integration** - Each customer uses their own email address
- ✅ **Payment Confirmation** - Sent only after payment is completed
- ✅ **Beautiful HTML Templates** - Professional-looking emails with Chicken Valley branding
- ✅ **Text Fallback** - Plain text version for email clients that don't support HTML
- ✅ **Order Details** - Complete order information, customer details, and pricing
- ✅ **Multiple SMTP Support** - Works with Gmail, Outlook, and other email providers
- ✅ **Error Handling** - Comprehensive error handling and logging
- ✅ **CORS Enabled** - Ready for frontend integration
- ✅ **Health Check** - API status monitoring endpoint

## Prerequisites

- Node.js (version 14 or higher)
- npm or yarn
- Gmail account (or other SMTP provider)

## Installation

1. **Clone or download the project**
2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Set up environment variables:**
   - Copy `config.env.example` to `.env`
   - Fill in your email credentials

   ```bash
   cp config.env.example .env
   ```

4. **Configure your email settings in `.env`:**
   ```env
   EMAIL_USER=your-email@gmail.com
   EMAIL_PASS=your-app-password
   SMTP_HOST=smtp.gmail.com
   SMTP_PORT=587
   PORT=3000
   ```

## Gmail Setup (Recommended)

1. **Enable 2-Factor Authentication** on your Gmail account
2. **Generate an App Password:**
   - Go to Google Account settings
   - Security → 2-Step Verification → App passwords
   - Generate password for "Mail"
   - Use this password in `EMAIL_PASS`

## Running the API

### Development Mode
```bash
npm run dev
```

### Production Mode
```bash
npm start
```

The API will start on `http://localhost:3000` (or your configured PORT)

## API Endpoints

### 1. Send Order Received Notification to Owner
**POST** `/api/send-order-received-email`

Sends an order received notification email to the owner after payment is confirmed.

**Request Body:**
```json
{
  "customerName": "John Doe",
  "customerEmail": "john.doe@example.com",
  "orderId": "ORD-2024-001",
  "items": [
    {
      "name": "Grilled Chicken Breast",
      "quantity": 2,
      "price": 12.99
    },
    {
      "name": "Chicken Wings",
      "quantity": 1,
      "price": 8.99
    }
  ],
  "totalAmount": 34.97,
  "paymentMethod": "Credit Card",
  "paymentStatus": "Confirmed"
}
```

**Response:**
```json
{
  "success": true,
  "message": "Order received email sent successfully from customer to owner after payment confirmation",
  "messageId": "abc123@example.com",
  "orderId": "ORD-2024-001",
  "paymentStatus": "Confirmed",
  "sentFrom": "john.doe@example.com",
  "sentTo": "owner@chickenvalley.com"
}
```

### 2. Health Check
**GET** `/api/health`

Check if the API is running.

**Response:**
```json
{
  "success": true,
  "message": "Chicken Valley Email API is running",
  "timestamp": "2024-01-15T10:30:00.000Z"
}
```

### 3. Test Email
**POST** `/api/test-email`

Send a test email to verify your configuration.

**Request Body:**
```json
{
  "testEmail": "test@example.com"
}
```

## Usage Examples

### Frontend Integration (JavaScript)

```javascript
// Send order received notification to owner
const sendOrderReceivedNotification = async (orderData) => {
  try {
    const response = await fetch('http://localhost:3000/api/send-order-received-email', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(orderData)
    });
    
    const result = await response.json();
    
    if (result.success) {
      console.log('Order notification sent to owner successfully!');
    } else {
      console.error('Failed to send notification:', result.message);
    }
  } catch (error) {
    console.error('Error:', error);
  }
};

// Example usage
const orderData = {
  customerName: "John Doe",
  customerEmail: "john.doe@example.com",
  orderId: "ORD-2024-001",
  items: [
    { name: "Grilled Chicken", quantity: 1, price: 15.99 },
    { name: "French Fries", quantity: 1, price: 4.99 }
  ],
  totalAmount: 20.98,
  paymentMethod: "Credit Card",
  paymentStatus: "Confirmed"
};

sendOrderReceivedNotification(orderData);
```

### cURL Example

```bash
curl -X POST http://localhost:3000/api/send-order-received-email \
  -H "Content-Type: application/json" \
  -d '{
    "customerName": "John Doe",
    "customerEmail": "john.doe@example.com",
    "orderId": "ORD-2024-001",
    "items": [
      {"name": "Grilled Chicken", "quantity": 1, "price": 15.99}
    ],
    "totalAmount": 15.99,
    "paymentMethod": "Credit Card",
    "paymentStatus": "Confirmed"
  }'
```

## Email Template Features

The order received notification emails include:

- 🎨 **Professional Design** - Clean, modern layout with Chicken Valley branding
- 📋 **Order Details** - Complete order information with items and pricing
- 👤 **Customer Information** - Customer name and order details
- 💳 **Payment Information** - Payment method and status confirmation
- 📍 **Delivery Details** - Address information for delivery orders
- 🚀 **Action Required** - Clear next steps for the owner
- 📱 **Responsive Design** - Looks great on all devices
- 📧 **Text Fallback** - Plain text version for compatibility

## Error Handling

The API includes comprehensive error handling:

- **Validation Errors** - Missing required fields
- **SMTP Errors** - Email server connection issues
- **Authentication Errors** - Invalid email credentials
- **Network Errors** - Connection timeouts and failures

All errors return appropriate HTTP status codes and detailed error messages.

## Security Features

- **Environment Variables** - Sensitive data stored in `.env` file
- **Input Validation** - All input data is validated before processing
- **CORS Configuration** - Configurable cross-origin resource sharing
- **Error Sanitization** - Error messages don't expose sensitive information

## Troubleshooting

### Common Issues

1. **"Authentication failed" error:**
   - Check your email credentials in `.env`
   - Ensure you're using an App Password for Gmail
   - Verify 2-Factor Authentication is enabled

2. **"Connection timeout" error:**
   - Check your internet connection
   - Verify SMTP host and port settings
   - Check firewall settings

3. **"Email not received":**
   - Check spam/junk folder
   - Verify recipient email address
   - Check email provider settings

### Debug Mode

Enable debug logging by adding to your `.env`:
```env
DEBUG=nodemailer:*
```

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## License

This project is licensed under the ISC License.

## Support

For support and questions:
- Check the troubleshooting section
- Review the API documentation
- Test with the `/api/test-email` endpoint

---

**Made with ❤️ for Chicken Valley** 🍗
