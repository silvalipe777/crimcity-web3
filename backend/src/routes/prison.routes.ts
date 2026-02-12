import { Router, Response } from 'express';
import { authMiddleware, AuthRequest } from '../middleware/auth';
import { actionLimiter } from '../middleware/rateLimit';
import { PrisonService } from '../services/prison.service';

const router = Router();
router.use(authMiddleware);

router.get('/status', async (req: AuthRequest, res: Response) => {
  try {
    const status = await PrisonService.getStatus(req.playerId!);
    res.json({ success: true, data: status });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Error';
    res.status(400).json({ success: false, error: message });
  }
});

router.post('/bribe', actionLimiter, async (req: AuthRequest, res: Response) => {
  try {
    const result = await PrisonService.bribe(req.playerId!);
    res.json({ success: true, data: result });
  } catch (err: unknown) {
    const statusCode = (err as { statusCode?: number }).statusCode || 400;
    const message = err instanceof Error ? err.message : 'Error';
    res.status(statusCode).json({ success: false, error: message });
  }
});

export default router;
