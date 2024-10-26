// api/sendOtp.js
const nodemailer = require('nodemailer');

const sendOtp = async (req, res) => {
    const { email } = req.body;

    if (!email) {
        return res.status(400).json({ message: 'Email is required' });
    }

    // Generate a 6-digit OTP
    const otp = Math.floor(100000 + Math.random() * 900000).toString();

    // Store the OTP associated with the email in memory
    // Use a global object or another storage mechanism in production
    global.otpStorage = global.otpStorage || {};
    global.otpStorage[email] = otp;

    // Create a nodemailer transporter
    let transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
            user: process.env.EMAIL, // Your email address
            pass: process.env.PASSWORD, // Your email password or app password
        },
    });

    // Define email options
    let mailOptions = {
        from: process.env.EMAIL,
        to: email,
        subject: 'Your OTP Code',
        text: `Your OTP code is ${otp}. It will expire in 10 minutes.`,
    };

    // Send the email
    try {
        await transporter.sendMail(mailOptions);
        res.status(200).json({ message: 'OTP sent successfully' });
    } catch (error) {
        res.status(500).json({ message: 'Failed to send OTP', error: error.message });
    }
};

module.exports = sendOtp;
