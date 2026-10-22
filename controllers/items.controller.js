import { prisma } from '../config/db.js';
import { recalculateReceiptTotals } from './receipts.controller.js';

export const addItem = async (req, res) => {
    try {
        const receiptId = Number(req.params.receiptId);
        const { itemName, quantity, costPrice, sellingPrice } = req.body;

        const qty = Number(quantity) || 1;
        const cost = Number(costPrice);
        const selling = Number(sellingPrice);

        const totalAmount = qty * selling;
        const profit = (selling - cost) * qty;

        await prisma.item.create({
            data: {
                receiptId,
                itemName,
                quantity: qty,
                costPrice: cost,
                sellingPrice: selling,
                totalAmount,
                profit,
            },
        });

        const updatedReceipt = await recalculateReceiptTotals(receiptId);
        return res.status(201).json(updatedReceipt);
    } catch (error) {
        return res.status(500).json({ error: error.message });
    }
}

export const editItem = async (req, res) => {
    try {
        const itemId = Number(req.params.itemId);
        const { itemName, quantity, costPrice, sellingPrice } = req.body;

        const existingItem = await prisma.item.findUnique({ where: { id: itemId } });

        if (!existingItem) return res.status(404).json({ error: "Item not found" });

        const qty = quantity !== undefined ? Number(quantity) : existingItem.quantity;
        const cost = costPrice !== undefined ? Number(costPrice) : Number(existingItem.costPrice);
        const selling = sellingPrice !== undefined ? Number(sellingPrice) : Number(existingItem.sellingPrice);

        const totalAmount = qty * selling;
        const profit = (selling - cost) * qty;

        await prisma.item.update({
            where: { id: itemId },
            data: {
                itemName: itemName || existingItem.itemName,
                quantity: qty,
                costPrice: cost,
                sellingPrice: selling,
                totalAmount,
                profit,
            },
        });

        const updatedReceipt = await recalculateReceiptTotals(existingItem.receiptId);
        return res.status(200).json(updatedReceipt);
    } catch (error) {
        return res.status(500).json({ error: error.message });
    }
}

export const deleteItem = async (req, res) => {
    try {
        const itemId = Number(req.params.itemId);
        const item = await prisma.item.findUnique({ where: { id: itemId } });
        if (!item) return res.status(404).json({ error: "Item not found" });

        const receiptId = item.receiptId;

        await prisma.item.delete({ where: { id: itemId } });

        const updatedReceipt = await recalculateReceiptTotals(receiptId);
        return res.status(200).json({ message: "Item deleted successfully", receipt: updatedReceipt });
    } catch (error) {
        return res.status(500).json({ error: error.message });
    }
}