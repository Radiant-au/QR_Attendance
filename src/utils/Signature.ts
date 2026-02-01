import * as crypto from 'crypto';
import { env } from '@config/env';

export class QrSignature {

    static generateSignature(data: any): string {
        return crypto
            .createHmac('sha256', env.JWT_SECRET)
            .update(JSON.stringify(data))
            .digest('hex');
    }

    /**
     * Verify HMAC signature
     */
    static verifySignature(data: any, signature: string): boolean {
        const expectedSignature = this.generateSignature(data);
        return crypto.timingSafeEqual(
            Buffer.from(signature),
            Buffer.from(expectedSignature)
        );
    }
}
