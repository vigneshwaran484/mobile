// Mock authentication service
// In production, replace with Firebase Phone Auth or SMS API

export const sendOTP = async (phoneNumber) => {
    // Simulate API call
    return new Promise((resolve) => {
        setTimeout(() => {
            // Mock OTP is always "123456" for testing
            console.log(`OTP sent to ${phoneNumber}: 123456`);
            resolve({ success: true, message: 'OTP sent successfully' });
        }, 1000);
    });
};

export const verifyOTP = async (phoneNumber, otp) => {
    // Simulate API call
    return new Promise((resolve) => {
        setTimeout(() => {
            // Mock verification - accepts "123456"
            if (otp === '123456') {
                resolve({
                    success: true,
                    user: {
                        phone: phoneNumber,
                        id: `user_${phoneNumber.slice(-4)}`
                    }
                });
            } else {
                resolve({ success: false, message: 'Invalid OTP' });
            }
        }, 1000);
    });
};

export const saveUserProfile = async (userId, userData) => {
    // Simulate saving to database
    return new Promise((resolve) => {
        setTimeout(() => {
            console.log('User profile saved:', userData);
            resolve({ success: true });
        }, 500);
    });
};
