import { Router } from 'express';
import { isAuthenticated } from '../middlewares/auth.middleware.js';
import { createReceipt, deleteReceipt, getAllReceipts, getOnlyUserReceipts, getReceiptById, getReceiptByTrackingId, updateReceipt } from '../controllers/receipts.controller.js';
import { verifyReceiptOwnerOrAdmin } from '../middlewares/receipt.middleware.js';
import { addItem, editItem, deleteItem } from '../controllers/items.controller.js';

const receiptRouter = Router();

receiptRouter.get('/:id/details', getReceiptById);

receiptRouter.get('/:trackingId/tracking-code', getReceiptByTrackingId);

// Apply authentication middleware to all routes
receiptRouter.use(isAuthenticated); 

receiptRouter.get('/', getAllReceipts);

receiptRouter.get('/user/created-receipts', getOnlyUserReceipts);

receiptRouter.post('/create-receipt', createReceipt);


receiptRouter.put('/:id/update-receipt', verifyReceiptOwnerOrAdmin, updateReceipt);

receiptRouter.delete('/:id/delete-receipt', verifyReceiptOwnerOrAdmin, deleteReceipt);

// Items routes
receiptRouter.post('/:receiptId/add-item', addItem);
receiptRouter.put('/:itemId/edit-item', editItem);
receiptRouter.delete('/:itemId/delete-item', deleteItem);

export default receiptRouter;