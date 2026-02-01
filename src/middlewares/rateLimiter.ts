// import rateLimit from "express-rate-limit";
// import { Request, Response } from "express";
// import { AuthRequest } from "@dtos/AuthDto";

// /**
//  * Rate limiter for voting endpoints.
//  * Uses pinCodeId as key instead of IP so students on shared WiFi are isolated.
//  * Settings: 3 requests per 15 seconds per pinCode.
//  */
// export const voteLimiter = rateLimit({
//   windowMs: 15 * 1000,
//   max: 3,
//   standardHeaders: true,
//   legacyHeaders: false,

//   keyGenerator: (req: AuthRequest) => {
//     if (req.user?.id) {
//       return `pincode-${req.user.id}`;
//     }
//     return "unknown-user"; // Should never happen
//   },

//   skipSuccessfulRequests: true,

//   handler: (_req, res) => {
//     res.status(429).json({
//       success: false,
//       message: "You're clicking too fast! Please wait 15 seconds.",
//       retryAfter: 15
//     });
//   }
// });

// /**
//  * Rate limiter for authentication.
//  * Uses pincode string (or fallback to IP) as key before users are authenticated.
//  */
// export const authLimiter = rateLimit({
//   windowMs: 5 * 60 * 1000, // 5 minutes
//   max: 5, // 5 login attempts per pincode
//   standardHeaders: true,
//   legacyHeaders: false,

//   keyGenerator: (req: Request) => {
//     const { pincode, code, Rcode } = req.body as {
//       pincode?: string;
//       code?: string;
//       Rcode?: string;
//     };

//     // Accept any pincode field your UI might send
//     const pin = pincode || code || Rcode;

//     if (pin) {
//       return `auth-${pin}`; // Clean, consistent cache key
//     }

//     // If no pincode provided (should not happen, but safe)
//     return "auth-unknown";
//   },

//   message: {
//     success: false,
//     message: "Too many login attempts for this pincode. Try again soon.",
//   },

//   handler: (_req: Request, res: Response) => {
//     res.status(429).json({
//       success: false,
//       message: "You tried too many times. Please wait 1 minutes.",
//       retryAfter: 60,
//     });
//   },
// });