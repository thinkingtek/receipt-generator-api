import { prisma } from '../config/db.js';
import { createUniqueTrackingId } from '../utils/generateTrackingId.js';

// Helper function to recalculate receipt totals
export async function recalculateReceiptTotals(receiptId) {
    const items = await prisma.item.findMany({ where: { receiptId: Number(receiptId) } });

    let subtotal = 0;
    let totalProfit = 0;

    for (const item of items) {
        const itemTotal = Number(item.quantity) * Number(item.sellingPrice);
        const itemProfit = (Number(item.sellingPrice) - Number(item.costPrice)) * Number(item.quantity);
        
        subtotal += itemTotal;
        totalProfit += itemProfit;
    }

    const receipt = await prisma.receipt.findUnique({ where: { id: Number(receiptId) } });
    const shippingFee = receipt ? Number(receipt.shippingFee) : 0;
    const total = subtotal + shippingFee;

    return await prisma.receipt.update({
        where: { id: Number(receiptId) },
        data: {
        subtotal,
        total,
        totalProfit,
        },
        include: { items: true },
    });
}

export const getAllReceipts = async (req, res) => {
    try {
        const receipts = await prisma.receipt.findMany({
            include: { items: true },
            orderBy: { createdAt: "desc" }
        });
        res.status(200).json(receipts);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

export const getOnlyUserReceipts = async (req, res) => {
    console.log('Request user:--- ', req.user);
    // res.send('Hello')
    try {
        const receipts = await prisma.receipt.findMany({
            where: { createdById: req.user.id },
            include: { items: true },
            orderBy: { createdAt: "desc" },
        });
        res.status(200).json(receipts);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
}

export const createReceipt = async (req, res) => {
  try {
    const { 
      customerName, 
      customerEmail, 
      customerPhone, 
      paidDate, 
      receivedDate, 
      status, 
      currency, 
      shippingFee, 
      notes 
    } = req.body;
   
    const trackingId = await createUniqueTrackingId(prisma);

    const receipt = await prisma.receipt.create({
      data: {
        createdById: req.user.id,
        createdByName: req.user.name || req.user.email, // Save permanent snapshot name
        customerName,
        customerEmail,
        customerPhone,
        paidDate: new Date(paidDate),
        receivedDate: receivedDate ? new Date(receivedDate) : null,
        trackingId,
        status: status || "PAID",
        currency: currency || "NGN",
        shippingFee: shippingFee || 0.00,
        notes,
      },
      include: { items: true },
    });

    res.status(201).json(receipt);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const getReceiptById = async (req, res) => {
    
    try {
        const id = Number(req.params.id); 
        const receipt = await prisma.receipt.findUnique({ 
            where: { id },
            include: { items: true }
        });

        if (!receipt) {
            return res.status(404).json({ error: "Receipt not found" });
        }
        req.receiptDets = receipt;
        req.test = 'This is the testing of request on other property name';
        return res.status(200).json(receipt);
    } catch (error) {
        console.error("Error fetching receipt:", error);
        return res.status(500).json({ error: error.message });
    }
};

export const getReceiptByTrackingId = async (req, res) => {
    try {
        const { trackingId } = req.params;
        const receipt = await prisma.receipt.findUnique({
            where: { trackingId },
            include: { items: true }
        });
        if (!receipt) {
            return res.status(404).json({error: 'Not found'});
        }
        return res.status(200).json(receipt);
    } catch (error) {
        return res.status(500).json({ error: error.message });
    }
};

export const updateReceipt = async (req, res) => {
   try {
    const id = Number(req.params.id);
    const { 
      customerName, 
      customerEmail, 
      customerPhone, 
      paidDate, 
      receivedDate, 
      status, 
      currency, 
      shippingFee, 
      notes 
    } = req.body;

    await prisma.receipt.update({
      where: { id },
      data: {
        customerName,
        customerEmail,
        customerPhone,
        paidDate: paidDate ? new Date(paidDate) : undefined,
        receivedDate: receivedDate ? new Date(receivedDate) : undefined,
        status,
        currency,
        shippingFee: shippingFee !== undefined ? shippingFee : undefined,
        notes,
      },
    });

    const updatedReceipt = await recalculateReceiptTotals(id);
    return res.json(updatedReceipt);
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};

export const deleteReceipt = async (req, res) => {
    try {
        const id = Number(req.params.id);
        await prisma.receipt.delete({ where: { id } });
        return res.json({ message: "Receipt deleted successfully" });
    } catch (error) {
        return res.status(500).json({ error: error.message });
    }
};