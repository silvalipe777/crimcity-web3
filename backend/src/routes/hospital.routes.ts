import { Router, Response } from 'express';
import { authMiddleware, AuthRequest } from '../middleware/auth';
import { actionLimiter } from '../middleware/rateLimit';
import { HospitalService } from '../services/hospital.service';
import { PlayerService } from '../services/player.service';

const router = Router();
router.use(authMiddleware);

router.get('/services', async (req: AuthRequest, res: Response) => {
  try {
    const player = await PlayerService.getPlayer(req.playerId!);
    const services = HospitalService.getServices(player);
    res.json({ success: true, data: services });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Error';
    res.status(400).json({ success: false, error: message });
  }
});

router.post('/heal', actionLimiter, async (req: AuthRequest, res: Response) => {
  try {
    const result = await HospitalService.heal(req.playerId!);
    res.json({ success: true, data: result });
  } catch (err: unknown) {
    const statusCode = (err as { statusCode?: number }).statusCode || 400;
    const message = err instanceof Error ? err.message : 'Error';
    res.status(statusCode).json({ success: false, error: message });
  }
});

router.post('/detox', actionLimiter, async (req: AuthRequest, res: Response) => {
  try {
    const result = await HospitalService.detox(req.playerId!);
    res.json({ success: true, data: result });
  } catch (err: unknown) {
    const statusCode = (err as { statusCode?: number }).statusCode || 400;
    const message = err instanceof Error ? err.message : 'Error';
    res.status(statusCode).json({ success: false, error: message });
  }
});

export default router;
