// File: .env
/*
EMAIL=your-gmail@gmail.com
PASSWORD=your-gmail-app-password
PORT=3001
*/

// File: server.js
const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');

// Load environment variables
dotenv.config();

const app = express();
const PORT = process.env.PORT || 3001;

// Middleware
app.use(express.json());
app.use(cors());

// Store OTPs in memory (resets when server restarts)
const otpStore = new Map();

// Routes
app.post('/api/send-otp', sendOTP);
app.post('/api/verify-otp', verifyOTP);

// Start server
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

// File: sendOTP.js
const nodemailer = require('nodemailer');

function sendOTP(req, res) {
    try {
        const { email } = req.body;

        // Check if email is provided
        if (!email) {
            return res.status(400).json({
                success: false,
                message: 'Email is required'
            });
        }

        // Generate 6-digit OTP
        const otp = Math.floor(100000 + Math.random() * 900000).toString();

        // Save OTP and its expiry time
        otpStore.set(email, {
            otp: otp,
            expiryTime: Date.now() + 10 * 60 * 1000  // 10 minutes from now
        });

        // Create email transporter
        const transporter = nodemailer.createTransport({
            service: 'gmail',
            auth: {
                user: process.env.EMAIL,
                pass: process.env.PASSWORD
            }
        });

        // Email content
        const mailOptions = {
            from: process.env.EMAIL,
            to: email,
            subject: 'Your Verification Code',
            html: `
                <div style="text-align: center; font-family: Arial, sans-serif;">
                    <h2>Your Verification Code</h2>
                    <h1 style="color: #4CAF50; font-size: 40px;">${otp}</h1>
                    <p>This code will expire in 10 minutes</p>
                </div>
            `
        };

        // Send email
        transporter.sendMail(mailOptions, (error, info) => {
            if (error) {
                console.error('Email error:', error);
                return res.status(500).json({
                    success: false,
                    message: 'Failed to send OTP email',
                    status:404
                });
            }

            res.status(200).json({
                success: true,
                message: 'OTP sent successfully',
                status:200
            });
        });

    } catch (error) {
        console.error('Server error:', error);
        res.status(500).json({
            success: false,
            message: 'Internal server error',
            status:500
        });
    }
}

// File: verifyOTP.js
function verifyOTP(req, res) {
    try {
        const { email, otp } = req.body;

        // Check if email and OTP are provided
        if (!email || !otp) {
            return res.status(400).json({
                success: false,
                message: 'Email and OTP are required',
                status:400
            });
        }

        // Get stored OTP data
        const storedOTPData = otpStore.get(email);

        // Check if OTP exists and is not expired
        if (!storedOTPData) {
            return res.status(400).json({
                success: false,
                message: 'OTP not found',
                status:404
            });
        }

        if (Date.now() > storedOTPData.expiryTime) {
            otpStore.delete(email);
            return res.status(400).json({
                success: false,
                message: 'OTP has expired',
                status:404
            });
        }

        // Verify OTP
        if (storedOTPData.otp === otp) {
            // Delete OTP after successful verification
            otpStore.delete(email);
            
            return res.status(200).json({
                success: true,
                message: 'OTP verified successfully',
                status:200
            });
        } else {
            return res.status(400).json({
                success: false,
                message: 'Invalid OTP'
            });
        }

    } catch (error) {
        console.error('Server error:', error);
        res.status(500).json({
            success: false,
            message: 'Internal server error',
            status:500
        });
    }
}

// Export both functions
module.exports = { sendOTP, verifyOTP };