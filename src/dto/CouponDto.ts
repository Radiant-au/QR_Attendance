export interface RedeemCouponReqDto{
    token: string;
    shopkeeperId: number;
}

export interface RedeemCouponResDto{
    success: boolean;
    message: string;
    coupon?: string;
}

export interface generateQRTokenResDto{
    token: string;
    pinCode: string;
    status: "used" | "unused";
}