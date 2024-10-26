// Import necessary modules
const nodemailer = require('nodemailer');

// Route to generate and send OTP via email
const sendOtp = async (req, res, otpStorage) => {
  try {
    const { email } = req.body;

    if (!email) {
      return res.status(400).json({ message: 'Email is required', statusCode: 400 });
    }

    // Generate a 6-digit OTP
    const otp = Math.floor(100000 + Math.random() * 900000).toString();

    // Store the OTP associated with the email
    otpStorage[email] = otp;
    console.log(`Stored OTP for ${email}:`, otp); // Log the stored OTP
    console.log('Current OTP Storage:', otpStorage); // Log current OTP storage

    // Create a nodemailer transporter
    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.EMAIL,
        pass: process.env.PASSWORD,
      },
    });

    // Define email options
    const mailOptions = {
      from: process.env.EMAIL,
      to: email,
      subject: 'Your OTP Code',
      text: `Your OTP code is ${otp}. It will expire in 10 minutes.`,
    };

    // Send the email
    await transporter.sendMail(mailOptions);
    res.status(200).json({ message: 'OTP sent successfully', statusCode: 200 });
    
  } catch (error) {
    // Catch errors related to email sending and respond
    console.error('Error while sending OTP:', error.message); // Log the error for debugging
    res.status(500).json({ message: 'Failed to send OTP', error: error.message, statusCode: 500 });
  }
};

module.exports = sendOtp;
