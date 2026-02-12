import { Router, Request, Response } from 'express';
import { AuthService } from '../services/auth.service';
import { authLimiter } from '../middleware/rateLimit';
import { z } from 'zod';

const router = Router();

const loginSchema = z.object({ username: z.string().min(2).max(20) });

// Dev login - username only (no wallet required)
router.post('/login', authLimiter, async (req: Request, res: Response) => {
  try {
    const { username } = loginSchema.parse(req.body);
    const result = await AuthService.devLogin(username);
    res.json({ success: true, data: result });
  } catch (err: unknown) {
    const statusCode = (err as { statusCode?: number }).statusCode || 400;
    const message = err instanceof Error ? err.message : 'Login failed';
    res.status(statusCode).json({ success: false, error: message });
  }
});

export default router;
