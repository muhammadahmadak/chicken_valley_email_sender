# 🚀 Chicken Valley Email API Setup Guide

## 📋 **Step 1: Create .env File**

1. **Rename** `env.config` to `.env`
2. **Edit** the `.env` file with your actual email credentials

## 📧 **Step 2: Configure Email Settings**

### **Required Fields:**

```env
# Your Gmail address (owner's email)
EMAIL_USER=your-actual-email@gmail.com

# Your Gmail App Password (NOT your regular password)
EMAIL_PASS=abcd efgh ijkl mnop
```

### **Optional Fields (can leave as default):**

```env
# SMTP server (Gmail)
SMTP_HOST=smtp.gmail.com

# SMTP port (Gmail)
SMTP_PORT=587

# API server port
PORT=3000
```

## 🔐 **Step 3: Gmail Setup (IMPORTANT!)**

### **Enable 2-Factor Authentication:**
1. Go to [Google Account Settings](https://myaccount.google.com/)
2. Click **Security**
3. Enable **2-Step Verification**

### **Generate App Password:**
1. Go to **Security** → **2-Step Verification**
2. Click **App passwords**
3. Select **Mail** from dropdown
4. Click **Generate**
5. Copy the 16-character password (e.g., `abcd efgh ijkl mnop`)
6. Paste it in `EMAIL_PASS` in your `.env` file

## 📝 **Step 4: Example .env File**

```env
# 🍗 Chicken Valley Email API Configuration

# Email Configuration (Required)
EMAIL_USER=chickenvalley@gmail.com
EMAIL_PASS=abcd efgh ijkl mnop

# SMTP Configuration (Optional - defaults to Gmail)
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587

# Server Configuration (Optional)
PORT=3000
```

## ✅ **Step 5: Test Configuration**

1. **Install dependencies:**
   ```bash
   npm install
   ```

2. **Start the server:**
   ```bash
   npm start
   ```

3. **Test the API:**
   ```bash
   curl http://localhost:3000/api/health
   ```

## 🚨 **Common Issues & Solutions:**

### **"Authentication failed" error:**
- ✅ Check `EMAIL_USER` is correct
- ✅ Use App Password, NOT regular password
- ✅ Enable 2-Factor Authentication first

### **"Connection timeout" error:**
- ✅ Check internet connection
- ✅ Verify SMTP settings
- ✅ Check firewall settings

### **"Email not received":**
- ✅ Check spam/junk folder
- ✅ Verify `EMAIL_USER` in `.env`
- ✅ Test with `/api/test-email` endpoint

## 🔍 **Verify Your Setup:**

1. **Check .env file exists:**
   ```bash
   ls -la .env
   ```

2. **Check environment variables:**
   ```bash
   node -e "require('dotenv').config(); console.log('EMAIL_USER:', process.env.EMAIL_USER)"
   ```

3. **Test email sending:**
   ```bash
   curl -X POST http://localhost:3000/api/test-email \
     -H "Content-Type: application/json" \
     -d '{"testEmail": "your-email@gmail.com"}'
   ```

## 🎯 **Ready to Use!**

Once configured, your API will:
- ✅ Send order notifications FROM customers TO owner
- ✅ Use beautiful HTML email templates
- ✅ Include all order details and payment info
- ✅ Work automatically when orders are placed

**Need help?** Check the troubleshooting section in README.md! 🍗✨
