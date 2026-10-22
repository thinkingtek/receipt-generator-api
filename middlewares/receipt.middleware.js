import { prisma } from "../config/db.js";


export const verifyReceiptOwnerOrAdmin = async (req, res, next) => {
    try {
        const id = Number(req.params.id);
        const userId = req.user.id;
        const userRole = req.user.role; // e.g., 'ADMIN', 'SUPER_ADMIN', or 'STAFF'

        // 1. Find the receipt first
        const receipt = await prisma.receipt.findUnique({
            where: { id },
        });

        if (!receipt) {
            return res.status(404).json({ error: "Receipt not found" });
        }

        // 2. Define authorized roles
        const privilegedRoles = ['ADMIN', 'SUPER_ADMIN', 'admin', 'super_admin'];
        const hasPrivilegedRole = privilegedRoles.includes(userRole);
        const isOwner = receipt.createdById === userId;

        // 3. Deny access if neither condition is met
        if (!hasPrivilegedRole && !isOwner) {
            return res.status(403).json({ 
                error: "Forbidden: You do not have permission to modify or delete this receipt." 
            });
        }

        // 4. Attach receipt to request object for downstream controllers to use
        req.receipt = receipt;

        // Pass control to the next middleware/controller
        next();
    } catch (error) {
        return res.status(500).json({ error: error.message });
    }
};

export const verifyReceiptOwnerOrAdminForItems = async (req, res, next) => {
    try {
        const userId = req.user.id;
        const userRole = req.user.role; // e.g., 'ADMIN', 'SUPER_ADMIN', or 'STAFF'

        // 1. Find the receipt first
        const receipt = req.receipt

        if (!receipt) {
            return res.status(404).json({ error: "Receipt not found" });
        }

        // 2. Define authorized roles
        const privilegedRoles = ['ADMIN', 'SUPER_ADMIN', 'admin', 'super_admin'];
        const hasPrivilegedRole = privilegedRoles.includes(userRole);
        const isOwner = receipt.createdById === userId;

        // 3. Deny access if neither condition is met
        if (!hasPrivilegedRole && !isOwner) {
            return res.status(403).json({ 
                error: "Forbidden: You do not have permission to modify or delete this receipt." 
            });
        }

        // Pass control to the next middleware/controller
        next();
    } catch (error) {
        return res.status(500).json({ error: error.message });
    }
};