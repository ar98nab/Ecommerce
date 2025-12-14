import express from 'express';
import {
  addOrderItems,
  getMyOrders,
  cancelOrder,
} from '../controllers/orderController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

router.route('/').post(protect, addOrderItems);
router.route('/myorders').get(protect, getMyOrders);
router.route('/:id/cancel').patch(protect, cancelOrder);

export default router;