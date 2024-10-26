// Route to verify OTP
const verifyOtp = (req, res, otpStorage) => {
    const { email, otp } = req.body;
  
    if (!email || !otp) {
      return res.status(400).json({ message: 'Email and OTP are required' });
    }
  
    // Log the incoming request
    console.log('Incoming request:', { email, otp });
    // Log the stored OTP for the given email
    console.log('Stored OTP for email:', otpStorage[email]); 
  
    // Check if the OTP matches
    if (otpStorage[email] && otpStorage[email] === otp) {
      delete otpStorage[email]; // Optionally, remove the OTP after verification
      res.status(200).json({ message: 'OTP verified successfully', status: 'success',statusCode:200 });
    } else {
      res.status(400).json({ message: 'Invalid OTP', status: 'failed',statusCode:404 });
    }
  };
  
  module.exports = verifyOtp;
  