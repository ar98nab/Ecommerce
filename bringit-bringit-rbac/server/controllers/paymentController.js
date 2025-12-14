import Razorpay from 'razorpay';

const createRazorpayOrder = async (req, res) => {
  try {
    const { amount } = req.body;

    if (!amount) {
      return res.status(400).json({ message: 'Amount is required' });
    }

    const keyId = process.env.RAZORPAY_KEY_ID;
    const keySecret = process.env.RAZORPAY_KEY_SECRET;

    if (!keyId || !keySecret) {
      return res.status(500).json({
        message:
          'Razorpay keys are not configured. Please set RAZORPAY_KEY_ID and RAZORPAY_KEY_SECRET in .env.',
      });
    }

    const instance = new Razorpay({
      key_id: keyId,
      key_secret: keySecret,
    });

    const options = {
      amount: Math.round(amount * 100),
      currency: 'INR',
      receipt: 'rcpt_' + Date.now(),
    };

    const order = await instance.orders.create(options);
    res.json({ order, key: keyId });
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .json({ message: error.message || "Razorpay order creation failed because I didn't provide my RAZORPAY_KEY_ID and RAZORPAY_KEY_SECRET in .env. " });
  }
};

export { createRazorpayOrder };