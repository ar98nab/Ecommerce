import express from 'express';
import {
  getProducts,
  getProductById,
  createProduct,
  updateProduct,
  deleteProduct,
} from '../controllers/productController.js';
import { protect, sellerOnly } from '../middleware/authMiddleware.js';

const router = express.Router();

router.route('/').get(getProducts).post(protect, sellerOnly, createProduct);
router
  .route('/:id')
  .get(getProductById)
  .put(protect, sellerOnly, updateProduct)
  .delete(protect, sellerOnly, deleteProduct);

export default router;