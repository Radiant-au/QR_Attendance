// utils/QrSignature.ts
import * as crypto from 'crypto';
import { env } from '@config/env';

export class QrSignature {
    /**
     * Generate dynamic QR data for user (valid for 10 minutes)
     */
    static generateUserQrToken(userId: string) {
        const timestamp = Date.now();
        const expiresAt = timestamp + (10 * 60 * 1000); // 10 minutes

        const payload = {
            userId,
            timestamp,
            expiresAt
        };

        const signature = this.generateSignature(payload);
        const tokenData = {
            ...payload,
            signature
        }
        const token = Buffer.from(JSON.stringify(tokenData)).toString('base64');

        return token;
    }

    /**
     * Verify QR data when admin scans
     */
    static verifyQrToken(token: string): { isValid: boolean; userId?: string } {
        try {
            // Decode from base64
            const decoded = JSON.parse(
                Buffer.from(token, 'base64').toString('utf8')
            );

            const { signature, ...payload } = decoded;

            if (!signature) {
                return { isValid: false };
            }

            // Check expiration
            if (Date.now() > payload.expiresAt) {
                return { isValid: false };
            }

            // Verify signature
            const isValid = this.verifySignature(payload, signature);

            return {
                isValid,
                userId: isValid ? payload.userId : undefined
            };

        } catch (error) {
            console.error("Error verifying QR token:", error);
            return { isValid: false };
        }
    }


    /**
     * Generate HMAC signature
     */
    static generateSignature(data: object): string {
        return crypto
            .createHmac('sha256', env.JWT_SECRET)
            .update(JSON.stringify(data))
            .digest('hex');
    }

    /**
     * Verify HMAC signature
     */
    static verifySignature(data: object, signature: string): boolean {
        const expectedSignature = this.generateSignature(data);
        return crypto.timingSafeEqual(
            Buffer.from(signature),
            Buffer.from(expectedSignature)
        );
    }
}