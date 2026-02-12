import rateLimit from 'express-rate-limit';

export const generalLimiter = rateLimit({
  windowMs: 1 * 60 * 1000,
  max: 100,
  message: { success: false, error: 'Too many requests, try again later' },
  standardHeaders: true,
  legacyHeaders: false,
});

export const authLimiter = rateLimit({
  windowMs: 5 * 60 * 1000,
  max: 20,
  message: { success: false, error: 'Too many auth attempts, try again later' },
});

export const actionLimiter = rateLimit({
  windowMs: 1 * 60 * 1000,
  max: 30,
  message: { success: false, error: 'Too many game actions, slow down' },
});
