import crypto from 'crypto';

export function createRefCode() {
  const chars = 'abcdefghijklmnopqrstuvwxyz0123456789';
  const randomBytes = crypto.randomBytes(15);
  let result = '';
  
  for (let i = 0; i < 15; i++) {
    result += chars[randomBytes[i] % chars.length];
  }
  
  return result;
}

export async function createUniqueTrackingId(prisma) {
  let isUnique = false;
  let trackingId = '';

  while (!isUnique) {
    trackingId = createRefCode();
    
    // Check if it already exists in the database
    const existing = await prisma.receipt.findUnique({
      where: { trackingId },
    });

    if (!existing) {
      isUnique = true;
    }
  }

  return trackingId;
}